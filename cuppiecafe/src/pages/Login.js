import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function getLoginError(err) {
  const status = err?.status || err?.response?.status;
  const code = err?.code || err?.response?.data?.code;
  const message =
    err?.message ||
    err?.response?.data?.message ||
    "";

  // บัญชีถูกปิดใช้งาน
  if (
    status === 403 ||
    code === "ACCOUNT_DISABLED" ||
    code === "USER_INACTIVE" ||
    /account.*disabled|user.*inactive|บัญชี.*ปิดใช้งาน/i.test(message)
  ) {
    return {
      title: "บัญชีของคุณถูกปิดใช้งาน",
      description:
        "บัญชีนี้ไม่สามารถเข้าสู่ระบบได้ กรุณาติดต่อผู้ดูแลระบบเพื่อสอบถามข้อมูลเพิ่มเติม",
      type: "warning",
    };
  }

  // อีเมลหรือรหัสผ่านไม่ถูกต้อง
  if (
    status === 401 ||
    /invalid.*(email|password|credential)|incorrect.*(password|email)/i.test(
      message
    )
  ) {
    return {
      title: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      description: "กรุณาตรวจสอบอีเมลและรหัสผ่านอีกครั้ง",
      type: "error",
    };
  }

  // ปัญหาการเชื่อมต่อ
  if (
    err instanceof TypeError ||
    /failed to fetch|network|fetch/i.test(message)
  ) {
    return {
      title: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
      description:
        "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง",
      type: "error",
    };
  }

  return {
    title: "เข้าสู่ระบบไม่สำเร็จ",
    description: message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    type: "error",
  };
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, isLoggedIn } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || "/";

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "กรุณากรอกอีเมลและรหัสผ่านก่อนเข้าสู่ระบบ",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      navigate(destination, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(getLoginError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <Navbar />

      <main className="flex justify-center px-5 py-12 md:py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-[#F0E4D8] shadow-sm px-7 py-9 md:px-9 md:py-10">
            {/* Header */}
            <div className="text-center mb-9">
              <div className="text-5xl mb-4">☕</div>

              <h1 className="text-3xl font-bold text-[#493629]">
                เข้าสู่ระบบ
              </h1>

              <p className="text-[#82766C] mt-2">
                ยินดีต้อนรับกลับสู่ Cuppie
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-[#493629] font-medium mb-2">
                  อีเมล
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="กรอกอีเมลของคุณ"
                  autoComplete="email"
                  className="w-full border border-[#E8DCCF] rounded-2xl px-4 py-4 text-[#493629] outline-none transition focus:border-[#A87852] focus:ring-2 focus:ring-[#A87852]/20"
                />
              </div>

              <div className="mb-5">
                <label className="block text-[#493629] font-medium mb-2">
                  รหัสผ่าน
                </label>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="กรอกรหัสผ่าน"
                  autoComplete="current-password"
                  className="w-full border border-[#E8DCCF] rounded-2xl px-4 py-4 text-[#493629] outline-none transition focus:border-[#A87852] focus:ring-2 focus:ring-[#A87852]/20"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  className={`mt-4 p-4 rounded-xl border ${
                    error.type === "warning"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">
                      {error.type === "warning" ? "⚠️" : "ⓘ"}
                    </span>

                    <div>
                      <p
                        className={`font-semibold ${
                          error.type === "warning"
                            ? "text-amber-800"
                            : "text-red-700"
                        }`}
                      >
                        {error.title}
                      </p>

                      <p
                        className={`text-sm mt-1 leading-relaxed ${
                          error.type === "warning"
                            ? "text-amber-700"
                            : "text-red-600"
                        }`}
                      >
                        {error.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-7 bg-[#754A30] text-white py-4 rounded-full font-medium hover:bg-[#493629] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </button>
            </form>

            {/* Register */}
            <p className="text-center text-[#82766C] mt-7">
              ยังไม่มีบัญชี?
              <Link
                to="/register"
                className="text-[#754A30] font-semibold ml-2 hover:underline"
              >
                สมัครสมาชิก
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;