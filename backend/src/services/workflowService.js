const { withTransaction } = require("../db/pool");
const { badRequest, conflict, forbidden, notFound } = require("../utils/errors");
const {
  loadActiveAgent,
  requireCoordinatorOf,
  requireAssignee,
  requireCreator,
  TERMINAL,
} = require("./access");
const { DETAIL_SELECT, mapRequest } = require("./requestService");

function requireContent(content, label) {
  const text = String(content || "").trim();
  if (text.length < 5 || text.length > 2000) {
    throw badRequest(`${label} phải từ 5 đến 2.000 ký tự`);
  }
  return text;
}

function requireVersion(body) {
  const v = Number(body.expected_version);
  if (!Number.isInteger(v) || v < 1) {
    throw badRequest("expected_version là bắt buộc và phải là số nguyên dương");
  }
  return v;
}

async function lockRequest(client, id) {
  const result = await client.query(`SELECT * FROM requests WHERE id = $1 FOR UPDATE`, [id]);
  if (!result.rowCount) {
    throw notFound("Không tìm thấy yêu cầu");
  }
  return result.rows[0];
}

async function applyChange(client, { request, user, expectedVersion, toStatus, eventType, content, newAssigneeId, extra }) {
  if (request.version !== expectedVersion) {
    throw conflict("Dữ liệu đã thay đổi, vui lòng tải lại hồ sơ", {
      currentVersion: request.version,
    });
  }
  const nextVersion = request.version + 1;
  const assignedTo = extra && Object.prototype.hasOwnProperty.call(extra, "assigned_to")
    ? extra.assigned_to
    : (newAssigneeId !== undefined ? newAssigneeId : request.assigned_to);
  const resolvedAt = extra && Object.prototype.hasOwnProperty.call(extra, "resolved_at")
    ? extra.resolved_at
    : request.resolved_at;
  const closedAt = extra && Object.prototype.hasOwnProperty.call(extra, "closed_at")
    ? extra.closed_at
    : request.closed_at;
  const currentResolution = extra && Object.prototype.hasOwnProperty.call(extra, "current_resolution")
    ? extra.current_resolution
    : request.current_resolution;
  const waitingQuestion = extra && Object.prototype.hasOwnProperty.call(extra, "waiting_question")
    ? extra.waiting_question
    : request.waiting_question;

  const updated = await client.query(
    `UPDATE requests
     SET status = $1,
         version = $2,
         assigned_to = $3,
         resolved_at = $4,
         closed_at = $5,
         current_resolution = $6,
         waiting_question = $7
     WHERE id = $8 AND version = $9
     RETURNING *`,
    [
      toStatus,
      nextVersion,
      assignedTo,
      resolvedAt,
      closedAt,
      currentResolution,
      waitingQuestion,
      request.id,
      expectedVersion,
    ]
  );
  if (!updated.rowCount) {
    throw conflict("Xung đột phiên bản, thao tác không được ghi đè", {
      currentVersion: request.version,
    });
  }

  await client.query(
    `INSERT INTO request_events (
       request_id, event_type, from_status, to_status,
       old_assignee_id, new_assignee_id, actor_id, reason_or_content, request_version
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [
      request.id,
      eventType,
      request.status,
      toStatus,
      request.assigned_to,
      assignedTo,
      user.id,
      content || null,
      nextVersion,
    ]
  );

  const full = await client.query(`${DETAIL_SELECT} WHERE r.id = $1`, [request.id]);
  return mapRequest(full.rows[0]);
}

async function isAgentStillValid(client, request) {
  if (!request.assigned_to) return false;
  const agent = await loadActiveAgent(
    client,
    request.assigned_to,
    request.handling_department_id,
    request.created_by
  );
  return Boolean(agent);
}

async function performAction(user, requestId, action, body) {
  const expectedVersion = requireVersion(body || {});

  return withTransaction(async (client) => {
    const request = await lockRequest(client, requestId);
    const { canView } = require("./access");
    if (!canView(user, request)) {
      const { notFound } = require("../utils/errors");
      throw notFound("Không tìm thấy yêu cầu");
    }
    if (TERMINAL.has(request.status)) {
      throw forbidden("Hồ sơ đã kết thúc, không nhận hành động ghi mới");
    }

    switch (action) {
      case "assign":
        return assign(client, user, request, expectedVersion, body);
      case "reassign":
        return reassign(client, user, request, expectedVersion, body);
      case "start":
        return start(client, user, request, expectedVersion);
      case "request-info":
        return requestInfo(client, user, request, expectedVersion, body);
      case "provide-info":
        return provideInfo(client, user, request, expectedVersion, body);
      case "resolve":
        return resolve(client, user, request, expectedVersion, body);
      case "confirm":
        return confirm(client, user, request, expectedVersion, body);
      case "reopen":
        return reopen(client, user, request, expectedVersion, body);
      case "reject":
        return reject(client, user, request, expectedVersion, body);
      case "cancel":
        return cancel(client, user, request, expectedVersion, body);
      default:
        throw badRequest("Hành động không hợp lệ");
    }
  });
}

async function assign(client, user, request, expectedVersion, body) {
  requireCoordinatorOf(user, request);
  if (request.status !== "SUBMITTED") {
    throw conflict("Chỉ phân công hồ sơ đang chờ phân công");
  }
  if (!body.assignee_id) {
    throw badRequest("assignee_id là bắt buộc");
  }
  const agent = await loadActiveAgent(
    client,
    body.assignee_id,
    request.handling_department_id,
    request.created_by
  );
  if (!agent) {
    throw forbidden("Agent không hợp lệ: phải đang hoạt động, đúng bộ phận và khác người tạo");
  }
  return applyChange(client, {
    request,
    user,
    expectedVersion,
    toStatus: "ASSIGNED",
    eventType: "ASSIGN",
    content: body.content ? requireContent(body.content, "Ghi chú phân công") : "Phân công người xử lý",
    newAssigneeId: agent.id,
  });
}

async function reassign(client, user, request, expectedVersion, body) {
  requireCoordinatorOf(user, request);
  const reason = requireContent(body.content || body.reason, "Lý do giao lại");
  if (!body.assignee_id) {
    throw badRequest("assignee_id là bắt buộc");
  }
  const allowed = {
    ASSIGNED: "ASSIGNED",
    IN_PROGRESS: "ASSIGNED",
    WAITING_FOR_REQUESTER: "WAITING_FOR_REQUESTER",
    RESOLVED: "RESOLVED",
  };
  const toStatus = allowed[request.status];
  if (!toStatus) {
    throw conflict("Không thể giao lại ở trạng thái hiện tại");
  }
  const agent = await loadActiveAgent(
    client,
    body.assignee_id,
    request.handling_department_id,
    request.created_by
  );
  if (!agent) {
    throw forbidden("Agent mới không hợp lệ");
  }
  if (agent.id === request.assigned_to) {
    throw badRequest("Agent mới phải khác người đang được giao");
  }
  return applyChange(client, {
    request,
    user,
    expectedVersion,
    toStatus,
    eventType: "REASSIGN",
    content: reason,
    newAssigneeId: agent.id,
  });
}

async function start(client, user, request, expectedVersion) {
  requireAssignee(user, request);
  if (request.status !== "ASSIGNED") {
    throw conflict("Chỉ bắt đầu từ trạng thái đã phân công");
  }
  const valid = await isAgentStillValid(client, request);
  if (!valid) {
    throw forbidden("Phân công không còn hiệu lực");
  }
  return applyChange(client, {
    request,
    user,
    expectedVersion,
    toStatus: "IN_PROGRESS",
    eventType: "START",
    newAssigneeId: request.assigned_to,
  });
}

async function requestInfo(client, user, request, expectedVersion, body) {
  requireAssignee(user, request);
  if (request.status !== "IN_PROGRESS") {
    throw conflict("Chỉ hỏi bổ sung khi đang xử lý");
  }
  const question = requireContent(body.content, "Câu hỏi");
  return applyChange(client, {
    request,
    user,
    expectedVersion,
    toStatus: "WAITING_FOR_REQUESTER",
    eventType: "REQUEST_INFO",
    content: question,
    extra: { waiting_question: question },
  });
}

async function provideInfo(client, user, request, expectedVersion, body) {
  requireCreator(user, request);
  if (request.status !== "WAITING_FOR_REQUESTER") {
    throw conflict("Chỉ gửi bổ sung khi hồ sơ đang chờ người gửi");
  }
  const answer = requireContent(body.content, "Nội dung bổ sung");
  const valid = await isAgentStillValid(client, request);
  if (!valid) {
    return applyChange(client, {
      request,
      user,
      expectedVersion,
      toStatus: "SUBMITTED",
      eventType: "PROVIDE_INFO_UNASSIGNED",
      content: answer,
      extra: {
        assigned_to: null,
        waiting_question: null,
      },
    });
  }
  return applyChange(client, {
    request,
    user,
    expectedVersion,
    toStatus: "IN_PROGRESS",
    eventType: "PROVIDE_INFO",
    content: answer,
    extra: { waiting_question: null },
  });
}

async function resolve(client, user, request, expectedVersion, body) {
  requireAssignee(user, request);
  if (request.status !== "IN_PROGRESS") {
    throw conflict("Chỉ báo kết quả khi đang xử lý");
  }
  const resolution = requireContent(body.content, "Kết quả và cách kiểm tra");
  return applyChange(client, {
    request,
    user,
    expectedVersion,
    toStatus: "RESOLVED",
    eventType: "RESOLVE",
    content: resolution,
    extra: {
      resolved_at: new Date(),
      current_resolution: resolution,
    },
  });
}

async function confirm(client, user, request, expectedVersion, body) {
  requireCreator(user, request);
  if (request.status !== "RESOLVED") {
    throw conflict("Chỉ xác nhận khi hồ sơ đang chờ xác nhận");
  }
  const note = body.content ? requireContent(body.content, "Nội dung xác nhận") : "Xác nhận kết quả đạt";
  return applyChange(client, {
    request,
    user,
    expectedVersion,
    toStatus: "CLOSED",
    eventType: "CONFIRM",
    content: note,
    extra: { closed_at: new Date() },
  });
}

async function reopen(client, user, request, expectedVersion, body) {
  requireCreator(user, request);
  if (request.status !== "RESOLVED") {
    throw conflict("Chỉ phản hồi chưa đạt khi hồ sơ đang chờ xác nhận");
  }
  const reason = requireContent(body.content, "Lý do chưa đạt");
  const valid = await isAgentStillValid(client, request);
  if (!valid) {
    return applyChange(client, {
      request,
      user,
      expectedVersion,
      toStatus: "SUBMITTED",
      eventType: "REOPEN_UNASSIGNED",
      content: reason,
      extra: {
        assigned_to: null,
        resolved_at: null,
        current_resolution: null,
      },
    });
  }
  return applyChange(client, {
    request,
    user,
    expectedVersion,
    toStatus: "IN_PROGRESS",
    eventType: "REOPEN",
    content: reason,
    extra: {
      resolved_at: null,
      current_resolution: null,
    },
  });
}

async function reject(client, user, request, expectedVersion, body) {
  requireCoordinatorOf(user, request);
  if (request.status !== "SUBMITTED") {
    throw conflict("Chỉ từ chối hồ sơ đang chờ phân công");
  }
  const reason = requireContent(body.content, "Lý do và hướng dẫn");
  return applyChange(client, {
    request,
    user,
    expectedVersion,
    toStatus: "REJECTED",
    eventType: "REJECT",
    content: reason,
    extra: { assigned_to: null },
  });
}

async function cancel(client, user, request, expectedVersion, body) {
  const reason = requireContent(body.content, "Lý do hủy");
  if (request.status === "SUBMITTED") {
    const asCreator = request.created_by === user.id;
    const asCoordinator =
      user.role === "COORDINATOR" &&
      user.serviceDepartmentId === request.handling_department_id &&
      request.created_by !== user.id;
    if (!asCreator && !asCoordinator) {
      throw forbidden("Chỉ người tạo hoặc điều phối bộ phận được hủy ở trạng thái chờ phân công");
    }
    return applyChange(client, {
      request,
      user,
      expectedVersion,
      toStatus: "CANCELLED",
      eventType: "CANCEL",
      content: reason,
    });
  }
  if (["ASSIGNED", "IN_PROGRESS", "WAITING_FOR_REQUESTER"].includes(request.status)) {
    requireCoordinatorOf(user, request);
    return applyChange(client, {
      request,
      user,
      expectedVersion,
      toStatus: "CANCELLED",
      eventType: "CANCEL",
      content: reason,
    });
  }
  throw conflict("Không thể hủy ở trạng thái hiện tại");
}

module.exports = { performAction };
