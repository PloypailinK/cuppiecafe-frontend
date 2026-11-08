import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#493629]">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              ยินดีต้อนรับผู้ดูแลระบบ Cuppie
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-amber-900 text-white px-5 py-2 rounded-full"
          >
            ออกจากระบบ
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-500">บัญชีผู้ดูแลระบบ</p>
          <p className="font-semibold mt-2">{user?.email}</p>
          <p className="text-sm text-amber-900 mt-1">
            Role: {user?.role}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-6">
          <Link
            to="/admin/members"
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-[#493629]">
              จัดการสมาชิก
            </h2>
            <p className="text-gray-500 mt-2">
              ดูรายชื่อและจัดการบัญชีสมาชิก
            </p>
          </Link>

          <Link
            to="/admin/cafes"
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-[#493629]">
              จัดการคาเฟ่
            </h2>
            <p className="text-gray-500 mt-2">
              เพิ่ม แก้ไข และปิดใช้งานคาเฟ่
            </p>
          </Link>

          <Link
            to="/admin/reviews"
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-[#493629]">
              จัดการรีวิว
            </h2>
            <p className="text-gray-500 mt-2">
              ตรวจสอบและจัดการรีวิว
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;