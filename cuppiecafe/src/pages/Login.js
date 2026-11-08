import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      setLoading(true);

      await login(email, password);

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <Navbar />

      <main className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="text-5xl">☕</div>

            <h1 className="text-3xl font-bold text-gray-800 mt-4">
              เข้าสู่ระบบ
            </h1>

            <p className="text-gray-500 mt-2">
              ยินดีต้อนรับกลับสู่ Cuppie
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block text-gray-700 font-medium mb-2">
              อีเมล
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="กรอกอีเมลของคุณ"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-amber-800"
            />

            <label className="block text-gray-700 font-medium mb-2">
              รหัสผ่าน
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่าน"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-800"
            />

            {error && (
              <p className="text-red-500 text-sm mt-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-7 bg-amber-900 text-white py-3 rounded-full hover:bg-amber-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            ยังไม่มีบัญชี?
            <Link
              to="/register"
              className="text-amber-900 font-semibold ml-2 hover:underline"
            >
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
