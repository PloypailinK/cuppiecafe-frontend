import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = (
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8080"
).replace(/\/+$/, "");

function AdminMembers() {
  const { token } = useAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchMembers = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
  }, [token]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleOpenModal = (member) => {
    setError("");
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    if (processingId) return;
    setSelectedMember(null);
  };

  const handleDeactivate = async () => {
    if (!selectedMember) return;

    const member = selectedMember;

    try {
      setProcessingId(member.id);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/members/${encodeURIComponent(member.id)}`,
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

      setSelectedMember(null);
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
    <div>
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs tracking-[0.18em] text-[#A87852] font-semibold">
            MEMBERS MANAGEMENT
          </p>

          <h1 className="text-3xl font-bold text-[#493629] mt-2">
            จัดการสมาชิก
          </h1>

          <p className="text-gray-500 mt-2">
            ตรวจสอบและจัดการบัญชีสมาชิก Cuppie
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMembers}
          disabled={loading}
          className="bg-[#754A30] text-white px-5 py-3 rounded-xl hover:bg-[#493629] disabled:opacity-50 transition"
        >
          {loading ? "กำลังโหลด..." : "↻ รีเฟรชข้อมูล"}
        </button>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EFE5DB]">
          <p className="text-gray-500 text-sm">สมาชิกทั้งหมด</p>

          <p className="text-3xl font-bold text-[#493629] mt-2">
            {members.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EFE5DB]">
          <p className="text-gray-500 text-sm">สมาชิกที่ใช้งานอยู่</p>

          <p className="text-3xl font-bold text-green-700 mt-2">
            {members.filter((member) => member.is_active).length}
          </p>
        </div>
      </div>

      {/* MEMBER TABLE */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#EFE5DB]">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหาชื่อหรืออีเมลสมาชิก..."
          className="w-full border border-[#E8DCCF] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#A87852] mb-6"
        />

        {error && (
          <p className="text-red-600 bg-red-50 p-3 rounded-xl mb-4">
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
                    className="border-b last:border-0 hover:bg-[#FAF8F4] transition"
                  >
                    <td className="py-4 px-3 font-medium text-[#493629]">
                      {member.full_name}
                    </td>

                    <td className="py-4 px-3 text-gray-600">
                      {member.email}
                    </td>

                    <td className="py-4 px-3">
                      <span className="bg-[#F0E4D8] text-[#754A30] px-3 py-1 rounded-full text-sm">
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
                          type="button"
                          onClick={() => handleOpenModal(member)}
                          disabled={processingId === member.id}
                          className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg disabled:opacity-50 transition"
                        >
                          ปิดบัญชี
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
      </section>

      {/* RED CONFIRMATION MODAL */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={handleCloseModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="deactivate-title"
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-7 md:p-10"
            onClick={(event) => event.stopPropagation()}
          >
            {/* RED TRASH ICON */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="m19 6-1 14H6L5 6" />
                  <path d="M10 11v5" />
                  <path d="M14 11v5" />
                </svg>
              </div>
            </div>

            {/* MODAL TEXT */}
            <div className="text-center">
              <h2
                id="deactivate-title"
                className="text-xl md:text-2xl font-bold text-[#493629]"
              >
                ยืนยันการปิดใช้งานบัญชี
              </h2>

              <p className="text-gray-500 mt-4 leading-7">
                ต้องการปิดใช้งานบัญชี{" "}
                <span className="font-semibold text-[#493629]">
                  {selectedMember.full_name}
                </span>{" "}
                ใช่หรือไม่?
              </p>

              <p className="text-red-600 text-sm mt-3">
                สมาชิกจะไม่สามารถเข้าสู่ระบบได้หลังจากปิดใช้งานบัญชี
              </p>
            </div>

            {/* MODAL BUTTONS */}
            <div className="flex gap-3 mt-9">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={processingId !== null}
                className="flex-1 border border-[#E8DCCF] text-[#754A30] py-3.5 rounded-full hover:bg-[#FAF8F4] transition disabled:opacity-50"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                onClick={handleDeactivate}
                disabled={processingId !== null}
                className="flex-1 bg-red-600 text-white py-3.5 rounded-full hover:bg-red-700 transition disabled:opacity-50"
              >
                {processingId !== null
                  ? "กำลังดำเนินการ..."
                  : "ยืนยันปิดใช้งาน"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMembers;