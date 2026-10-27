import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

const DEMOS = [
  { label: "Nhân viên", name: "Nguyễn Văn An", email: "nv.an@irms.local" },
  { label: "Agent IT", name: "Lê Minh Khang", email: "agent.it@irms.local" },
  { label: "Điều phối IT", name: "Đỗ Thu Hà", email: "coord.it@irms.local" },
  { label: "Điều phối Hành chính", name: "Hoàng Đức Nam", email: "coord.hc@irms.local" },
];

export default function Login() {
  const { user, login, busy } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("account");
  const [showPassword, setShowPassword] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const demoRef = useRef(null);

  useEffect(() => {
    function onClickOutside(event) {
      if (demoRef.current && !demoRef.current.contains(event.target)) {
        setDemoOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (user) return <Navigate to="/my-requests" replace />;

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const logged = await login(email, password);
      if (logged.role === "COORDINATOR") navigate("/dashboard");
      else if (logged.role === "AGENT") navigate("/assigned-tasks");
      else navigate("/my-requests");
    } catch (err) {
      setError(err.message);
    }
  }

  function fillDemo(account) {
    setTab("account");
    setEmail(account.email);
    setPassword("Demo@123");
    setError("");
    setDemoOpen(false);
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <section className="relative min-h-[40vh] w-full overflow-hidden md:min-h-screen md:w-[54%]">
        <img
          src="/images/hacom-tower.jpg"
          alt="Tòa nhà văn phòng hiện đại"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-black/30" />
        <div className="relative z-10 flex h-full min-h-[40vh] flex-col justify-between p-8 text-white md:min-h-screen md:p-12 lg:px-16 lg:py-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-200">
              Cổng nội bộ doanh nghiệp
            </p>
            <p className="mt-1 text-sm font-medium text-white/90">Hệ thống quản lý yêu cầu nội bộ</p>
          </div>

          <div>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">Cổng IRMS</h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-200 lg:text-lg">
              Quy trình tập trung cho IT và Hành chính: gửi yêu cầu, phân công, xử lý và xác nhận kết quả trên cùng một hệ thống, kèm lịch sử thao tác đầy đủ.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-2 text-[11px] text-slate-200">
              <span className="rounded-md border border-white/15 bg-black/30 px-2.5 py-1 font-medium backdrop-blur-sm">
                Phân quyền theo hồ sơ
              </span>
              <span className="rounded-md border border-white/15 bg-black/30 px-2.5 py-1 font-medium backdrop-blur-sm">
                Thời hạn SLA · giờ Việt Nam
              </span>
              <span className="rounded-md border border-white/15 bg-black/30 px-2.5 py-1 font-medium backdrop-blur-sm">
                Phiên đăng nhập bảo mật
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full items-center justify-center bg-[#f6f4f1] px-5 py-10 md:w-[46%] md:px-10 lg:px-14">
        <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-black/5">
          <div className="mb-6 flex flex-col items-center text-center">
            <img
              src="/images/hacom-logo.png"
              alt="Hacom Holdings Logo"
              className="mb-4 h-14 w-14 rounded-xl object-contain"
            />
            <h2 className="text-[18px] font-semibold tracking-tight text-slate-900">
              Chào mừng đến với <span className="inline-block whitespace-nowrap text-[#D32F2F] font-bold">Hacom Holdings</span>
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              Đăng nhập bằng tài khoản nội bộ được cấp bởi hệ thống quản trị.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setTab("account")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                tab === "account" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Tài khoản
            </button>
            <button
              type="button"
              onClick={() => setTab("qr")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                tab === "qr" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Quét QR
            </button>
          </div>

          {tab === "account" ? (
            <form onSubmit={submit} className="space-y-4">
              {error && (
                <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
              )}

              <label className="block text-sm font-medium text-slate-700">
                Email / Mã nhân viên
                <input
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/15"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nhap.email@irms.local"
                  autoComplete="username"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Mật khẩu
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-16 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/15"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </label>

              <button
                disabled={busy}
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Đang đăng nhập..." : "Đăng nhập ngay"}
              </button>
            </form>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
              <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-slate-300 bg-white">
                <div className="grid grid-cols-5 gap-0.5">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-2 w-2 ${[0, 1, 2, 4, 5, 6, 8, 10, 12, 14, 16, 18, 19, 20, 22, 23, 24].includes(i) ? "bg-slate-800" : "bg-transparent"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-700">Đăng nhập bằng mã QR</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Tính năng dành cho môi trường doanh nghiệp. Bản dùng thử vui lòng chọn tab Tài khoản.
              </p>
            </div>
          )}

          <div ref={demoRef} className="relative mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setDemoOpen((open) => !open)}
              className="text-[13px] font-medium text-slate-500 transition hover:text-orange-700"
            >
              🔑 Chọn tài khoản thử nghiệm
            </button>

            {demoOpen && (
              <div className="absolute top-8 z-20 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-2xl">
                <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Điền sẵn email và mật khẩu
                </p>
                {DEMOS.map((item) => (
                  <button
                    key={item.email}
                    type="button"
                    onClick={() => fillDemo(item)}
                    className="flex w-full flex-col rounded-lg px-2.5 py-2 text-left hover:bg-orange-50"
                  >
                    <span className="text-sm font-medium text-slate-800">
                      {item.label}: {item.email}
                    </span>
                    <span className="text-[11px] text-slate-500">Mật khẩu: Demo@123 · {item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
