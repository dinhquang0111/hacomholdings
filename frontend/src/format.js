export const STATUS_LABEL = {
  SUBMITTED: "Chờ phân công",
  ASSIGNED: "Đã phân công",
  IN_PROGRESS: "Đang xử lý",
  WAITING_FOR_REQUESTER: "Chờ bổ sung",
  RESOLVED: "Chờ xác nhận",
  CLOSED: "Đã đóng",
  REJECTED: "Từ chối",
  CANCELLED: "Đã hủy",
};

export const PRIORITY_LABEL = {
  LOW: "Thấp (48 giờ)",
  MEDIUM: "Trung bình (24 giờ)",
  HIGH: "Cao (8 giờ)",
};

export const STATUS_CLASS = {
  SUBMITTED: "bg-slate-100 text-slate-700",
  ASSIGNED: "bg-sky-100 text-sky-800",
  IN_PROGRESS: "bg-indigo-100 text-indigo-800",
  WAITING_FOR_REQUESTER: "bg-amber-100 text-amber-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-zinc-200 text-zinc-700",
  REJECTED: "bg-rose-100 text-rose-800",
  CANCELLED: "bg-orange-100 text-orange-800",
};

export function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
