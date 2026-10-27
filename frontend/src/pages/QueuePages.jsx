import { useEffect, useState } from "react";
import { api } from "../api";
import RequestTable from "../components/RequestTable";

function ListPage({ title, scope, empty }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await api.listRequests({ scope, page, pageSize: 20, q, status });
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, scope]);

  return (
    <div>
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="my-4 flex flex-wrap gap-2">
        <input
          className="rounded-lg border px-3 py-2 text-sm"
          placeholder="Tìm kiếm"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <select className="rounded-lg border px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Mọi trạng thái</option>
          {["SUBMITTED", "ASSIGNED", "IN_PROGRESS", "WAITING_FOR_REQUESTER", "RESOLVED", "CLOSED", "REJECTED", "CANCELLED"].map(
            (s) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>
        <button onClick={load} className="rounded-lg bg-teal-700 px-3 py-2 text-sm text-white">
          Lọc
        </button>
      </div>
      {error && <p className="mb-3 rounded bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {loading ? <p>Đang tải...</p> : <RequestTable items={items} empty={empty} />}
      <div className="mt-3 flex gap-2 text-sm">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-40">
          Trước
        </button>
        <span className="py-1">
          Trang {page} / {Math.max(1, Math.ceil(total / 20))}
        </span>
        <button
          disabled={page * 20 >= total}
          onClick={() => setPage(page + 1)}
          className="rounded border px-3 py-1 disabled:opacity-40"
        >
          Sau
        </button>
      </div>
    </div>
  );
}

export function DepartmentQueue() {
  return <ListPage title="Hàng đợi bộ phận" scope="department" empty="Không có hồ sơ trong bộ phận" />;
}

export function AssignedTasks() {
  return <ListPage title="Công việc được giao" scope="assigned" empty="Bạn chưa được giao hồ sơ nào" />;
}
