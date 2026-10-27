const { pool } = require("../db/pool");
const { notFound, forbidden } = require("../utils/errors");

const TERMINAL = new Set(["CLOSED", "REJECTED", "CANCELLED"]);
const OPEN_BACKLOG = new Set(["SUBMITTED", "ASSIGNED", "IN_PROGRESS", "WAITING_FOR_REQUESTER"]);

function isCreator(user, request) {
  return request.created_by === user.id;
}

function isCurrentAssignee(user, request) {
  return request.assigned_to === user.id;
}

function isDeptCoordinator(user, request) {
  return (
    user.role === "COORDINATOR" &&
    user.serviceDepartmentId &&
    user.serviceDepartmentId === request.handling_department_id
  );
}

function canView(user, request) {
  if (isCreator(user, request)) return true;
  if (isCurrentAssignee(user, request) && user.role === "AGENT") return true;
  if (isDeptCoordinator(user, request)) return true;
  return false;
}

function actingAsRequesterOnly(user, request) {
  return isCreator(user, request);
}

async function loadRequestOr404(clientOrPool, user, requestId) {
  const db = clientOrPool || pool;
  const result = await db.query(`SELECT * FROM requests WHERE id = $1`, [requestId]);
  const request = result.rows[0];
  if (!request || !canView(user, request)) {
    throw notFound("Không tìm thấy yêu cầu");
  }
  return request;
}

function assertCanWriteConversation(request) {
  if (TERMINAL.has(request.status)) {
    throw forbidden("Hồ sơ đã kết thúc, không thể thêm bình luận hoặc tệp");
  }
}

async function loadActiveAgent(client, agentId, handlingDepartmentId, createdBy) {
  const result = await client.query(
    `SELECT * FROM users WHERE id = $1`,
    [agentId]
  );
  const agent = result.rows[0];
  if (
    !agent ||
    !agent.is_active ||
    agent.role !== "AGENT" ||
    agent.service_department_id !== handlingDepartmentId ||
    agent.id === createdBy
  ) {
    return null;
  }
  return agent;
}

function requireCoordinatorOf(user, request) {
  if (isCreator(user, request)) {
    throw forbidden("Không được dùng quyền điều phối trên hồ sơ do chính mình tạo");
  }
  if (!isDeptCoordinator(user, request)) {
    throw forbidden("Chỉ điều phối đúng bộ phận mới được thực hiện thao tác này");
  }
}

function requireAssignee(user, request) {
  if (isCreator(user, request)) {
    throw forbidden("Không được tự xử lý hồ sơ do chính mình tạo");
  }
  if (user.role !== "AGENT" || !isCurrentAssignee(user, request)) {
    throw forbidden("Chỉ người đang được giao mới được thực hiện thao tác này");
  }
}

function requireCreator(user, request) {
  if (!isCreator(user, request)) {
    throw forbidden("Chỉ người tạo yêu cầu mới được thực hiện thao tác này");
  }
}

module.exports = {
  TERMINAL,
  OPEN_BACKLOG,
  isCreator,
  isCurrentAssignee,
  isDeptCoordinator,
  canView,
  actingAsRequesterOnly,
  loadRequestOr404,
  loadActiveAgent,
  requireCoordinatorOf,
  requireAssignee,
  requireCreator,
  assertCanWriteConversation,
};
