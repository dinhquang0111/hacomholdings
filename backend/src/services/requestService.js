const crypto = require("crypto");
const { pool, withTransaction } = require("../db/pool");
const config = require("../config");
const { payloadHash } = require("../utils/hash");
const { addHours } = require("../utils/clock");
const { badRequest, conflict, notFound, forbidden } = require("../utils/errors");
const { canView } = require("./access");

function validateCreate({ title, description, requestTypeId, priority, clientRequestId }) {
  const t = String(title || "").trim();
  const d = String(description || "").trim();
  if (t.length < 5 || t.length > 150) {
    throw badRequest("Tiêu đề phải từ 5 đến 150 ký tự");
  }
  if (d.length < 20 || d.length > 5000) {
    throw badRequest("Mô tả phải từ 20 đến 5.000 ký tự");
  }
  if (!requestTypeId) {
    throw badRequest("Loại yêu cầu là bắt buộc");
  }
  const p = priority || "MEDIUM";
  if (!["LOW", "MEDIUM", "HIGH"].includes(p)) {
    throw badRequest("Mức ưu tiên không hợp lệ");
  }
  if (!clientRequestId) {
    throw badRequest("client_request_id là bắt buộc");
  }
  return { title: t, description: d, requestTypeId, priority: p, clientRequestId };
}

function mapRequest(row) {
  if (!row) return null;
  return {
    id: row.id,
    requestCode: row.request_code,
    clientRequestId: row.client_request_id,
    title: row.title,
    description: row.description,
    requestTypeId: row.request_type_id,
    requestTypeCode: row.request_type_code,
    requestTypeName: row.request_type_name,
    createdBy: row.created_by,
    createdByName: row.created_by_name,
    requesterDepartmentId: row.requester_department_id_snapshot,
    handlingDepartmentId: row.handling_department_id,
    handlingDepartmentName: row.handling_department_name,
    assignedTo: row.assigned_to,
    assignedToName: row.assigned_to_name,
    priority: row.priority,
    status: row.status,
    version: row.version,
    submittedAt: row.submitted_at,
    dueAt: row.due_at,
    resolvedAt: row.resolved_at,
    closedAt: row.closed_at,
    currentResolution: row.current_resolution,
    waitingQuestion: row.waiting_question,
    overdue: row.overdue === true || row.overdue === "t",
  };
}

const DETAIL_SELECT = `
  SELECT r.*,
         rt.code AS request_type_code,
         rt.name AS request_type_name,
         d.name AS handling_department_name,
         cu.display_name AS created_by_name,
         au.display_name AS assigned_to_name
  FROM requests r
  JOIN request_types rt ON rt.id = r.request_type_id
  JOIN departments d ON d.id = r.handling_department_id
  JOIN users cu ON cu.id = r.created_by
  LEFT JOIN users au ON au.id = r.assigned_to
`;

async function createRequest(user, body) {
  const input = validateCreate(body);
  const hash = payloadHash({
    title: input.title,
    description: input.description,
    requestTypeId: input.requestTypeId,
    priority: input.priority,
  });

  return withTransaction(async (client) => {
    const existing = await client.query(
      `SELECT * FROM requests WHERE created_by = $1 AND client_request_id = $2`,
      [user.id, input.clientRequestId]
    );
    if (existing.rowCount) {
      const row = existing.rows[0];
      if (row.payload_hash !== hash) {
        throw conflict("Cùng client_request_id nhưng nội dung khác hồ sơ đã gửi", {
          existingId: row.id,
        });
      }
      const full = await client.query(`${DETAIL_SELECT} WHERE r.id = $1`, [row.id]);
      return { request: mapRequest(full.rows[0]), replayed: true };
    }

    const typeRes = await client.query(
      `SELECT rt.*, d.is_active AS dept_active
       FROM request_types rt
       JOIN departments d ON d.id = rt.handling_department_id
       WHERE rt.id = $1`,
      [input.requestTypeId]
    );
    const type = typeRes.rows[0];
    if (!type || !type.is_active || !type.dept_active) {
      throw badRequest("Loại yêu cầu không tồn tại hoặc đã ngừng nhận");
    }

    const hours = config.priorityHours[input.priority];
    const submittedAt = new Date();
    const dueAt = addHours(submittedAt, hours);
    const year = submittedAt.getUTCFullYear();
    const seq = await client.query(`SELECT nextval('request_code_seq') AS n`);
    const requestCode = `IRMS-${year}-${String(seq.rows[0].n).padStart(5, "0")}`;
    const id = crypto.randomUUID();

    await client.query(
      `INSERT INTO requests (
         id, request_code, client_request_id, payload_hash, title, description,
         request_type_id, created_by, requester_department_id_snapshot, handling_department_id,
         assigned_to, priority, status, version, submitted_at, due_at
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NULL,$11,'SUBMITTED',1,$12,$13
       )`,
      [
        id,
        requestCode,
        input.clientRequestId,
        hash,
        input.title,
        input.description,
        input.requestTypeId,
        user.id,
        user.homeDepartmentId,
        type.handling_department_id,
        input.priority,
        submittedAt,
        dueAt,
      ]
    );

    await client.query(
      `INSERT INTO request_events (
         request_id, event_type, from_status, to_status, actor_id, reason_or_content, request_version
       ) VALUES ($1,'SUBMIT',NULL,'SUBMITTED',$2,'Tạo yêu cầu',1)`,
      [id, user.id]
    );

    const full = await client.query(`${DETAIL_SELECT} WHERE r.id = $1`, [id]);
    return { request: mapRequest(full.rows[0]), replayed: false };
  }).catch(async (error) => {
    if (error.code === "23505") {
      const existing = await pool.query(
        `SELECT * FROM requests WHERE created_by = $1 AND client_request_id = $2`,
        [user.id, input.clientRequestId]
      );
      const row = existing.rows[0];
      if (row && row.payload_hash === hash) {
        const full = await pool.query(`${DETAIL_SELECT} WHERE r.id = $1`, [row.id]);
        return { request: mapRequest(full.rows[0]), replayed: true };
      }
      if (row) {
        throw conflict("Cùng client_request_id nhưng nội dung khác hồ sơ đã gửi", {
          existingId: row.id,
        });
      }
    }
    throw error;
  });
}

function scopeFilter(user, scope) {
  if (scope === "mine") {
    return { sql: "r.created_by = $1", params: [user.id] };
  }
  if (scope === "assigned") {
    if (user.role !== "AGENT") {
      throw forbidden("Chỉ người xử lý mới xem được công việc được giao");
    }
    return { sql: "r.assigned_to = $1", params: [user.id] };
  }
  if (scope === "department") {
    if (user.role !== "COORDINATOR" || !user.serviceDepartmentId) {
      throw forbidden("Chỉ điều phối mới xem được hàng đợi bộ phận");
    }
    return { sql: "r.handling_department_id = $1", params: [user.serviceDepartmentId] };
  }
  throw badRequest("scope phải là mine, assigned hoặc department");
}

async function listRequests(user, query) {
  const scope = query.scope || "mine";
  const { sql, params } = scopeFilter(user, scope);
  const page = Math.max(1, Number(query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize || 20)));
  const status = query.status;
  const q = String(query.q || "").trim();
  const asOf = query.as_of;
  const where = [sql];
  if (status) {
    params.push(status);
    where.push(`r.status = $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    const idx = params.length;
    where.push(`(r.title ILIKE $${idx} OR r.request_code ILIKE $${idx} OR r.description ILIKE $${idx})`);
  }

  const count = await pool.query(
    `SELECT COUNT(*)::int AS n FROM requests r WHERE ${where.join(" AND ")}`,
    params
  );
  const offset = (page - 1) * pageSize;
  params.push(pageSize);
  params.push(offset);

  const list = await pool.query(
    `${DETAIL_SELECT}
     WHERE ${where.join(" AND ")}
     ORDER BY r.submitted_at DESC, r.id DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const items = list.rows.filter((row) => canView(user, row)).map((row) => {
    const mapped = mapRequest(row);
    const clock = asOf ? new Date(asOf) : config.demoAsOf ? new Date(config.demoAsOf) : new Date();
    mapped.overdue =
      ["SUBMITTED", "ASSIGNED", "IN_PROGRESS", "WAITING_FOR_REQUESTER"].includes(row.status) &&
      clock.getTime() > new Date(row.due_at).getTime();
    return mapped;
  });

  return { items, page, pageSize, total: count.rows[0].n };
}

async function getRequest(user, id) {
  const result = await pool.query(`${DETAIL_SELECT} WHERE r.id = $1`, [id]);
  const row = result.rows[0];
  if (!row || !canView(user, row)) {
    throw notFound("Không tìm thấy yêu cầu");
  }
  const mapped = mapRequest(row);
  const clock = config.demoAsOf ? new Date(config.demoAsOf) : new Date();
  mapped.overdue =
    ["SUBMITTED", "ASSIGNED", "IN_PROGRESS", "WAITING_FOR_REQUESTER"].includes(row.status) &&
    clock.getTime() > new Date(row.due_at).getTime();
  return mapped;
}

async function listEvents(user, id) {
  await getRequest(user, id);
  const result = await pool.query(
    `SELECT e.*, u.display_name AS actor_name,
            ou.display_name AS old_assignee_name,
            nu.display_name AS new_assignee_name
     FROM request_events e
     JOIN users u ON u.id = e.actor_id
     LEFT JOIN users ou ON ou.id = e.old_assignee_id
     LEFT JOIN users nu ON nu.id = e.new_assignee_id
     WHERE e.request_id = $1
     ORDER BY e.created_at ASC, e.id ASC`,
    [id]
  );
  return result.rows.map((row) => ({
    id: row.id,
    requestId: row.request_id,
    eventType: row.event_type,
    fromStatus: row.from_status,
    toStatus: row.to_status,
    oldAssigneeId: row.old_assignee_id,
    oldAssigneeName: row.old_assignee_name,
    newAssigneeId: row.new_assignee_id,
    newAssigneeName: row.new_assignee_name,
    actorId: row.actor_id,
    actorName: row.actor_name,
    reasonOrContent: row.reason_or_content,
    createdAt: row.created_at,
    requestVersion: row.request_version,
  }));
}

async function listRequestTypes() {
  const result = await pool.query(
    `SELECT rt.id, rt.code, rt.name, rt.handling_department_id, d.name AS handling_department_name
     FROM request_types rt
     JOIN departments d ON d.id = rt.handling_department_id
     WHERE rt.is_active = TRUE AND d.is_active = TRUE
     ORDER BY rt.name`
  );
  return result.rows;
}

async function listAgents(user, departmentId) {
  if (user.role !== "COORDINATOR" || user.serviceDepartmentId !== departmentId) {
    throw forbidden("Chỉ điều phối đúng bộ phận được xem danh sách agent");
  }
  const result = await pool.query(
    `SELECT id, email, display_name, role, service_department_id, is_active
     FROM users
     WHERE role = 'AGENT' AND service_department_id = $1 AND is_active = TRUE
     ORDER BY display_name`,
    [departmentId]
  );
  return result.rows.map((row) => ({
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    serviceDepartmentId: row.service_department_id,
  }));
}

module.exports = {
  createRequest,
  listRequests,
  getRequest,
  listEvents,
  listRequestTypes,
  listAgents,
  mapRequest,
  DETAIL_SELECT,
};
