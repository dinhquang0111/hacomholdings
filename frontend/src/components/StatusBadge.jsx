import { STATUS_CLASS, STATUS_LABEL } from "../format";

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[status] || "bg-slate-100"}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}
