import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const API_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8080";

function AdminMembers() {
  const { token } = useAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/members`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
        }

        if (response.status === 403) {
          throw new Error("คุณไม่มีสิทธิ์เข้าถึงข้อมูลสมาชิก");
        }

        throw new Error("ไม่สามารถโหลดข้อมูลสมาชิกได้");
      }

      const data = await response.json();

      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMembers();
    } else {
      setLoading(false);
      setError("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
    }
  }, [token]);

  const handleDeactivate = async (member) => {
    const confirmed = window.confirm(
      `ต้องการปิดใช้งานบัญชี ${member.full_name} ใช่หรือไม่?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(member.id);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/members/${member.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("ไม่สามารถปิดใช้งานบัญชีได้");
      }

      await fetchMembers();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredMembers = members.filter((member) => {
    const keyword = search.toLowerCase();

    return (
      member.full_name?.toLowerCase().includes(keyword) ||
      member.email?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Link
          to="/admin"
          className="text-amber-900 hover:underline"
        >
          ← กลับ Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#493629]">
              จัดการสมาชิก
            </h1>

            <p className="text-gray-500 mt-2">
              ตรวจสอบและจัดการบัญชีสมาชิก Cuppie
            </p>
          </div>

          <button
            onClick={fetchMembers}
            disabled={loading}
            className="bg-amber-900 text-white px-5 py-3 rounded-full hover:bg-amber-800 disabled:opacity-50"
          >
            {loading ? "กำลังโหลด..." : "รีเฟรชข้อมูล"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500">สมาชิกทั้งหมด</p>

            <p className="text-3xl font-bold text-[#493629] mt-2">
              {members.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500">สมาชิกที่ใช้งานอยู่</p>

            <p className="text-3xl font-bold text-green-700 mt-2">
              {members.filter((member) => member.is_active).length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อหรืออีเมลสมาชิก..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-800 mb-6"
          />

          {error && (
            <p className="text-red-500 bg-red-50 p-3 rounded-xl mb-4">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-center text-gray-500 py-10">
              กำลังโหลดข้อมูลสมาชิก...
            </p>
          ) : filteredMembers.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              ไม่พบข้อมูลสมาชิก
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-gray-500 text-sm">
                    <th className="py-4 px-3">ชื่อสมาชิก</th>
                    <th className="py-4 px-3">อีเมล</th>
                    <th className="py-4 px-3">Role</th>
                    <th className="py-4 px-3">สถานะ</th>
                    <th className="py-4 px-3 text-center">จัดการ</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b last:border-0 hover:bg-[#FAF8F4]"
                    >
                      <td className="py-4 px-3 font-medium text-[#493629]">
                        {member.full_name}
                      </td>

                      <td className="py-4 px-3 text-gray-600">
                        {member.email}
                      </td>

                      <td className="py-4 px-3">
                        <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm">
                          {member.role}
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        {member.is_active ? (
                          <span className="text-green-700 text-sm">
                            ● ใช้งานอยู่
                          </span>
                        ) : (
                          <span className="text-red-600 text-sm">
                            ● ปิดใช้งาน
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-3 text-center">
                        {member.is_active ? (
                          <button
                            onClick={() => handleDeactivate(member)}
                            disabled={processingId === member.id}
                            className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg disabled:opacity-50"
                          >
                            {processingId === member.id
                              ? "กำลังดำเนินการ..."
                              : "ปิดบัญชี"}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            ปิดบัญชีแล้ว
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminMembers;