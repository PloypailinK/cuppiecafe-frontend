import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8080";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    if (password.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: name.trim(),
          email: email.trim(),
          password: password,
        }),
      });

      if (!response.ok) {
        const message = await response.text();

        if (response.status === 409) {
          throw new Error("อีเมลนี้ถูกใช้สมัครสมาชิกแล้ว");
        }

        if (response.status === 400) {
          throw new Error(message || "กรุณาตรวจสอบข้อมูลที่กรอก");
        }

        throw new Error(message || "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่");
      }

      await response.json();

      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (err) {
      setError(
        err.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <Navbar />

      <main className="max-w-md mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="text-5xl">☕</div>

            <h1 className="text-3xl font-bold text-gray-800 mt-4">
              สมัครสมาชิก
            </h1>

            <p className="text-gray-500 mt-2">
              เริ่มต้นค้นพบคาเฟ่และแบ่งปันประสบการณ์ไปกับเรา
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>

              <h2 className="text-xl font-bold text-green-700">
                สมัครสมาชิกสำเร็จ!
              </h2>

              <p className="text-gray-500 mt-3">
                บัญชีของคุณถูกบันทึกเรียบร้อยแล้ว
                สามารถเข้าสู่ระบบได้เลย
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full mt-7 bg-amber-900 text-white py-3 rounded-full hover:bg-amber-800 transition"
              >
                ไปหน้าเข้าสู่ระบบ
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <label className="block text-gray-700 font-medium mb-2">
                  ชื่อผู้ใช้งาน
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="กรอกชื่อของคุณ"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-amber-800"
                />

                <label className="block text-gray-700 font-medium mb-2">
                  อีเมล
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="กรอกอีเมลของคุณ"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-amber-800"
                />

                <label className="block text-gray-700 font-medium mb-2">
                  รหัสผ่าน
                </label>

                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-amber-800"
                />

                <label className="block text-gray-700 font-medium mb-2">
                  ยืนยันรหัสผ่าน
                </label>

                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
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
                  {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
                </button>
              </form>

              <p className="text-center text-gray-500 mt-6">
                มีบัญชีอยู่แล้ว?
                <Link
                  to="/login"
                  className="text-amber-900 font-semibold ml-2 hover:underline"
                >
                  เข้าสู่ระบบ
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Register;
