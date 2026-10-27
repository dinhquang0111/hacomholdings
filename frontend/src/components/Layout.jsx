import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth";

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-teal-700 text-white" : "text-slate-200 hover:bg-teal-800"}`;

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-teal-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="text-lg font-semibold tracking-wide">IRMS</div>
            <div className="text-xs text-teal-100">Hệ thống quản lý yêu cầu nội bộ</div>
          </div>
          <nav className="flex flex-wrap gap-1">
            <NavLink to="/my-requests" className={linkClass}>
              Yêu cầu của tôi
            </NavLink>
            {user?.role === "AGENT" && (
              <NavLink to="/assigned-tasks" className={linkClass}>
                Công việc được giao
              </NavLink>
            )}
            {user?.role === "COORDINATOR" && (
              <>
                <NavLink to="/department-queue" className={linkClass}>
                  Hàng đợi bộ phận
                </NavLink>
                <NavLink to="/dashboard" className={linkClass}>
                  Dashboard
                </NavLink>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <div className="text-right">
              <div className="font-medium">{user?.displayName}</div>
              <div className="text-xs text-teal-200">{user?.role}</div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-teal-800 px-3 py-2 text-sm hover:bg-teal-700"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
