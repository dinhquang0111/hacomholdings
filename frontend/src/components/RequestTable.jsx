import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatDate, PRIORITY_LABEL } from "../format";

export default function RequestTable({ items, empty }) {
  if (!items?.length) {
    return <p className="rounded-xl bg-white p-6 text-center text-slate-500 shadow-sm">{empty || "Không có yêu cầu"}</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">Mã</th>
            <th className="px-4 py-3">Tiêu đề</th>
            <th className="px-4 py-3">Loại</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3">Ưu tiên</th>
            <th className="px-4 py-3">Người xử lý</th>
            <th className="px-4 py-3">Hạn xử lý</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-teal-800">
                <Link to={`/requests/${row.id}`}>{row.requestCode}</Link>
              </td>
              <td className="px-4 py-3">
                <Link to={`/requests/${row.id}`} className="hover:underline">
                  {row.title}
                </Link>
                {row.overdue && (
                  <span className="ml-2 rounded bg-rose-100 px-1.5 py-0.5 text-xs text-rose-700">Quá hạn</span>
                )}
              </td>
              <td className="px-4 py-3">{row.requestTypeName}</td>
              <td className="px-4 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3">{PRIORITY_LABEL[row.priority] || row.priority}</td>
              <td className="px-4 py-3">{row.assignedToName || "—"}</td>
              <td className="px-4 py-3">{formatDate(row.dueAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
