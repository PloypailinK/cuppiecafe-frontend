import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      subtitle: "ภาพรวมระบบ",
      icon: "▦",
      path: "/admin",
    },
    {
      title: "จัดการสมาชิก",
      subtitle: "Members Management",
      icon: "♙",
      path: "/admin/members",
    },
    {
      title: "จัดการคาเฟ่",
      subtitle: "Cafe Management",
      icon: "☕",
      path: "/admin/cafes",
    },
    {
      title: "จัดการรีวิว",
      subtitle: "Reviews Management",
      icon: "✎",
      path: "/admin/reviews",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userInitial = (
    user?.name ||
    user?.email ||
    "A"
  )
    .charAt(0)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF8F4] md:flex">

      {/* SIDEBAR */}
      <aside className="w-full md:w-[250px] md:h-screen md:sticky md:top-0 bg-[#493629] text-[#F8EBDD] flex flex-col shrink-0">

        {/* LOGO */}
        <div className="px-7 py-7 border-b border-white/10 shrink-0">
          <Link to="/">
            <h1 className="text-2xl font-bold tracking-wide">
              Cuppie<span className="text-[#D2A77E]">.</span>
            </h1>

            <p className="text-[10px] text-[#CBB8A6] tracking-[0.2em] mt-1">
              ADMINISTRATION
            </p>
          </Link>
        </div>

        {/* SIDEBAR MENU */}
        <div className="px-4 py-7 flex-1 min-h-0 overflow-y-auto">

          <p className="text-[10px] tracking-[0.2em] text-[#BCA18C] font-semibold px-3 mb-4">
            MAIN MENU
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#806047] text-white shadow-sm"
                      : "text-[#D8C9BC] hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="w-7 text-center text-lg">
                      {item.icon}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {item.title}
                      </p>

                      <p className="text-[10px] text-[#C1AA98] mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>

                    {isActive && (
                      <span className="w-1.5 h-6 rounded-full bg-[#E5C4A5]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* GENERAL MENU */}
          <div className="mt-10">
            <p className="text-[10px] tracking-[0.2em] text-[#BCA18C] font-semibold px-3 mb-4">
              GENERAL
            </p>

            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#D8C9BC] hover:bg-white/10 hover:text-white transition"
            >
              <span className="w-7 text-center text-lg">
                ⌂
              </span>

              <span className="text-sm">
                กลับสู่หน้าเว็บไซต์
              </span>
            </Link>
          </div>
        </div>

        {/* SIDEBAR PROFILE */}
        <div className="mt-auto p-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">

            {/* AVATAR */}
            <div className="w-10 h-10 rounded-full bg-[#D8B99F] text-[#493629] flex items-center justify-center font-bold shrink-0">
              {userInitial}
            </div>

            {/* USER INFO */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">
                {user?.name || "Administrator"}
              </p>

              <p className="text-[10px] text-[#C1AA98]">
                System Admin
              </p>
            </div>

            {/* LOGOUT BUTTON */}
            <button
              type="button"
              onClick={handleLogout}
              title="ออกจากระบบ"
              aria-label="ออกจากระบบ"
              className="relative z-10 w-11 h-11 flex items-center justify-center rounded-lg text-[#E5C4A5] hover:bg-[#754A30] hover:text-white active:bg-[#A87852] transition-all duration-200 cursor-pointer shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none"
              >
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
              </svg>
            </button>

          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 min-w-0">

        {/* TOPBAR */}
        <header className="min-h-[76px] bg-white border-b border-[#EFE5DB] px-5 md:px-9 py-3 flex items-center justify-between gap-4">

          <div>
            <p className="text-xs text-[#A69A8F]">
              Application
              <span className="mx-2">›</span>
              <span className="text-[#754A30] font-medium">
                Admin Panel
              </span>
            </p>

            <p className="text-sm font-semibold text-[#493629] mt-1">
              Cuppie Management Workspace
            </p>
          </div>

          {/* TOPBAR USER */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-[#493629]">
                {user?.name || "Administrator"}
              </p>

              <p className="text-[11px] text-[#A69A8F]">
                {user?.email}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#F0E4D8] text-[#754A30] flex items-center justify-center font-bold">
              {userInitial}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-5 md:p-8 lg:p-10 max-w-[1500px] mx-auto">
          {children}
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;