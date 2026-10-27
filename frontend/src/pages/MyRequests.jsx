import { useEffect, useState } from "react";
import { api } from "../api";
import RequestTable from "../components/RequestTable";

const PRIORITY_HINT = {
  LOW: "Nhu cầu không cản trở công việc.",
  MEDIUM: "Ảnh hưởng một người nhưng còn cách làm thay.",
  HIGH: "Công việc bị chặn hoặc ảnh hưởng nhiều người.",
};

export default function MyRequests() {
  const [types, setTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    requestTypeId: "",
    priority: "MEDIUM",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await api.listRequests({ scope: "mine", page, pageSize: 20, q, status });
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    api.requestTypes().then((d) => {
      setTypes(d.items);
      setForm((f) => ({ ...f, requestTypeId: f.requestTypeId || d.items[0]?.id || "" }));
    });
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  async function createTicket(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const data = await api.createRequest({
        ...form,
        clientRequestId: crypto.randomUUID(),
      });
      setMessage(`Đã tạo ${data.request.requestCode}. Tải tệp (nếu có) tại màn chi tiết.`);
      setForm((f) => ({ ...f, title: "", description: "" }));
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Tạo yêu cầu mới</h1>
        <p className="mt-1 text-sm text-slate-500">
          Không gửi mật khẩu, dữ liệu cá nhân nhạy cảm hoặc thông tin bí mật trên ticket. Tạo hồ sơ trước, sau đó đính kèm tệp ở trang chi tiết.
        </p>
        {message && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
        {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <form onSubmit={createTicket} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm md:col-span-2">
            Tiêu đề
            <input
              required
              minLength={5}
              maxLength={150}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label className="text-sm">
            Loại yêu cầu
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.requestTypeId}
              onChange={(e) => setForm({ ...form, requestTypeId: e.target.value })}
            >
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {t.handling_department_name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Mức ưu tiên
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="LOW">Thấp — 48 giờ</option>
              <option value="MEDIUM">Trung bình — 24 giờ</option>
              <option value="HIGH">Cao — 8 giờ</option>
            </select>
            <span className="mt-1 block text-xs text-slate-500">{PRIORITY_HINT[form.priority]}</span>
          </label>
          <label className="text-sm md:col-span-2">
            Mô tả
            <textarea
              required
              minLength={20}
              maxLength={5000}
              rows={4}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <button className="rounded-lg bg-teal-700 px-4 py-2 font-medium text-white hover:bg-teal-800 md:col-span-2">
            Gửi yêu cầu
          </button>
        </form>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end gap-3">
          <h2 className="text-lg font-semibold">Danh sách của tôi ({total})</h2>
          <input
            placeholder="Tìm mã, tiêu đề..."
            className="rounded-lg border px-3 py-2 text-sm"
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
          <button className="rounded-lg border px-3 py-2 text-sm" onClick={load}>
            Lọc
          </button>
        </div>
        {loading ? <p>Đang tải...</p> : <RequestTable items={items} />}
        <div className="mt-3 flex gap-2 text-sm">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-40">
            Trước
          </button>
          <span className="py-1">Trang {page}</span>
          <button
            disabled={page * 20 >= total}
            onClick={() => setPage(page + 1)}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      </section>
    </div>
  );
}
