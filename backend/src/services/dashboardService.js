const { pool } = require("../db/pool");
const config = require("../config");
const { forbidden, badRequest } = require("../utils/errors");
const { OPEN_BACKLOG } = require("./access");

async function getDashboard(user, query) {
  if (user.role !== "COORDINATOR" || !user.serviceDepartmentId) {
    throw forbidden("Chỉ điều phối được xem dashboard bộ phận");
  }
  const from = query.from ? new Date(query.from) : new Date(config.dashboardPeriodFrom);
  const to = query.to ? new Date(query.to) : new Date(config.dashboardPeriodTo);
  const asOf = query.as_of ? new Date(query.as_of) : config.demoAsOf ? new Date(config.demoAsOf) : new Date();
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || Number.isNaN(asOf.getTime())) {
    throw badRequest("Tham số thời gian không hợp lệ");
  }

  const dept = user.serviceDepartmentId;
  const submitted = await pool.query(
    `SELECT COUNT(*)::int AS n FROM requests
     WHERE handling_department_id = $1 AND submitted_at >= $2 AND submitted_at < $3`,
    [dept, from, to]
  );
  const backlog = await pool.query(
    `SELECT COUNT(*)::int AS n FROM requests
     WHERE handling_department_id = $1
       AND status = ANY($2::request_status[])`,
    [dept, Array.from(OPEN_BACKLOG)]
  );
  const overdue = await pool.query(
    `SELECT COUNT(*)::int AS n FROM requests
     WHERE handling_department_id = $1
       AND status = ANY($2::request_status[])
       AND due_at < $3`,
    [dept, Array.from(OPEN_BACKLOG), asOf]
  );
  const waiting = await pool.query(
    `SELECT COUNT(*)::int AS n FROM requests
     WHERE handling_department_id = $1 AND status = 'RESOLVED'`,
    [dept]
  );
  const breakdown = await pool.query(
    `SELECT status, COUNT(*)::int AS count
     FROM requests
     WHERE handling_department_id = $1 AND submitted_at >= $2 AND submitted_at < $3
     GROUP BY status
     ORDER BY status`,
    [dept, from, to]
  );

  const allStatuses = [
    "SUBMITTED",
    "ASSIGNED",
    "IN_PROGRESS",
    "WAITING_FOR_REQUESTER",
    "RESOLVED",
    "CLOSED",
    "REJECTED",
    "CANCELLED",
  ];
  const map = Object.fromEntries(breakdown.rows.map((r) => [r.status, r.count]));
  const statusBreakdown = allStatuses.map((status) => ({
    status,
    count: map[status] || 0,
  }));

  return {
    asOf: asOf.toISOString(),
    period: { from: from.toISOString(), to: to.toISOString() },
    departmentId: dept,
    metrics: {
      submittedInPeriod: submitted.rows[0].n,
      openBacklog: backlog.rows[0].n,
      overdueBacklog: overdue.rows[0].n,
      waitingConfirmation: waiting.rows[0].n,
    },
    statusBreakdown,
  };
}

module.exports = { getDashboard };
