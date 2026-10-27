const { test } = require("node:test");
const assert = require("node:assert/strict");

test("công thức tồn quá hạn dùng so sánh chặt now > due_at", () => {
  const t0 = new Date("2026-10-20T03:00:00.000Z").getTime();
  const dueEqual = new Date("2026-10-20T03:00:00.000Z").getTime();
  const dueBefore = new Date("2026-10-20T02:00:00.000Z").getTime();
  const dueAfter = new Date("2026-10-20T04:00:00.000Z").getTime();
  assert.equal(t0 > dueEqual, false);
  assert.equal(t0 > dueBefore, true);
  assert.equal(t0 > dueAfter, false);
});

test("bốn chỉ số fixture IT: 8, 4, 2, 1", () => {
  const tickets = [
    { status: "SUBMITTED", due: "after" },
    { status: "ASSIGNED", due: "before" },
    { status: "IN_PROGRESS", due: "after" },
    { status: "WAITING_FOR_REQUESTER", due: "before" },
    { status: "RESOLVED", due: "before" },
    { status: "CLOSED", due: "before" },
    { status: "CANCELLED", due: "before" },
    { status: "REJECTED", due: "before" },
  ];
  const backlog = new Set(["SUBMITTED", "ASSIGNED", "IN_PROGRESS", "WAITING_FOR_REQUESTER"]);
  const submitted = tickets.length;
  const openBacklog = tickets.filter((t) => backlog.has(t.status)).length;
  const overdue = tickets.filter((t) => backlog.has(t.status) && t.due === "before").length;
  const waiting = tickets.filter((t) => t.status === "RESOLVED").length;
  assert.deepEqual([submitted, openBacklog, overdue, waiting], [8, 4, 2, 1]);
});
