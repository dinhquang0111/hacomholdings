import { useEffect, useState } from "react";
import { api } from "../api";
import { STATUS_LABEL } from "../format";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .dashboard()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="rounded bg-rose-50 p-4 text-rose-700">{error}</p>;
  if (!data) return <p>Đang tải dashboard...</p>;

  const cards = [
    { label: "Tổng gửi trong kỳ", value: data.metrics.submittedInPeriod, hint: "Lọc theo thời điểm gửi" },
    { label: "Tồn cần xử lý hiện tại", value: data.metrics.openBacklog, hint: "SUBMITTED / ASSIGNED / IN_PROGRESS / WAITING" },
    { label: "Tồn quá hạn hiện tại", value: data.metrics.overdueBacklog, hint: "Thuộc tồn cần xử lý và now > hạn" },
    { label: "Chờ xác nhận hiện tại", value: data.metrics.waitingConfirmation, hint: "Trạng thái RESOLVED" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold">Dashboard điều phối</h1>
      <p className="mt-1 text-sm text-slate-500">
        Mốc xem: {new Date(data.asOf).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} · Kỳ gửi:{" "}
        {new Date(data.period.from).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} →{" "}
        {new Date(data.period.to).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">{card.label}</div>
            <div className="mt-2 text-3xl font-semibold text-teal-800">{card.value}</div>
            <div className="mt-1 text-xs text-slate-400">{card.hint}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Trạng thái hiện tại</th>
              <th className="px-4 py-3 text-left">Số hồ sơ gửi trong kỳ</th>
            </tr>
          </thead>
          <tbody>
            {data.statusBreakdown.map((row) => (
              <tr key={row.status} className="border-t">
                <td className="px-4 py-2">{STATUS_LABEL[row.status]}</td>
                <td className="px-4 py-2">{row.count}</td>
              </tr>
            ))}
            <tr className="border-t bg-slate-50 font-semibold">
              <td className="px-4 py-2">Tổng</td>
              <td className="px-4 py-2">{data.statusBreakdown.reduce((s, r) => s + r.count, 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
