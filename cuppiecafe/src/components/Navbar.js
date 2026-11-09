import { useEffect } from "react";
import {
  NavLink,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (location.pathname === "/" && location.hash === "#categories") {
      requestAnimationFrame(() => {
        document.getElementById("categories")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [location.pathname, location.hash]);

  const linkStyle = ({ isActive }) =>
    `whitespace-nowrap transition hover:text-amber-800 ${
      isActive
        ? "text-amber-900 font-semibold"
        : "text-gray-600"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCategoryClick = () => {
    if (location.pathname === "/") {
      document.getElementById("categories")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      navigate("/#categories");
    }
  };

  return (
    <header className="w-full bg-white">
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#493629] text-[#F8EBDD] px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[9px] md:text-[10px] tracking-[0.15em] font-medium">
          <span>WELCOME TO CUPPIE</span>

          <span className="hidden sm:block">
            DISCOVER YOUR LITTLE HAPPY PLACE
          </span>

          <span>YOUR CAFE COMPANION</span>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="border-b border-[#EEE7DF] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">

          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-bold text-amber-900 justify-self-start"
          >
            Cuppie<span className="text-amber-600">.</span>
          </Link>

          {/* MENU */}
          <div className="flex items-center justify-center gap-4 md:gap-7 text-xs md:text-sm">
            <NavLink to="/" end className={linkStyle}>
              หน้าแรก
            </NavLink>

            <NavLink to="/cafes" className={linkStyle}>
              สำรวจคาเฟ่
            </NavLink>

            {isLoggedIn && (
              <NavLink to="/favorites" className={linkStyle}>
                รายการโปรด ♥
              </NavLink>
            )}

            <button
              type="button"
              onClick={handleCategoryClick}
              className="whitespace-nowrap text-gray-600 hover:text-amber-800 transition"
            >
              หมวดหมู่
            </button>

            {/* ADMIN MENU */}
            {isLoggedIn && isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `whitespace-nowrap transition ${
                    isActive ||
                    location.pathname.startsWith("/admin/")
                      ? "text-amber-900 font-bold"
                      : "text-[#A87852] font-semibold hover:text-amber-900"
                  }`
                }
              >
                Admin ⚙
              </NavLink>
            )}
          </div>

          {/* USER ACTIONS */}
          <div className="flex items-center justify-self-end gap-3">
            {isLoggedIn ? (
              <>
                <span className="hidden sm:block text-sm text-amber-900 whitespace-nowrap">
                  สวัสดี, {user?.name || "สมาชิก"}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-amber-900 text-white px-4 md:px-6 py-3 rounded-full text-xs md:text-sm hover:bg-amber-800 transition whitespace-nowrap"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-sm text-amber-900 font-medium whitespace-nowrap"
                >
                  เข้าสู่ระบบ
                </NavLink>

                <NavLink
                  to="/register"
                  className="bg-amber-900 text-white px-4 md:px-6 py-3 rounded-full text-xs md:text-sm hover:bg-amber-800 transition whitespace-nowrap"
                >
                  สมัครสมาชิก
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;