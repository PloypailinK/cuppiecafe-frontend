import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const API_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8080";

function AdminReviews() {
  const { token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("กรุณาเข้าสู่ระบบใหม่");
        }

        if (response.status === 403) {
          throw new Error("คุณไม่มีสิทธิ์เข้าถึงข้อมูลรีวิว");
        }

        throw new Error("ไม่สามารถโหลดข้อมูลรีวิวได้");
      }

      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReviews();
    } else {
      setLoading(false);
      setError("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
    }
  }, [token]);

  const handleDelete = async (review) => {
    const confirmed = window.confirm(
      "ต้องการลบรีวิวนี้ใช่หรือไม่?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(review.id);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/reviews/${review.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("ไม่สามารถลบรีวิวได้");
      }

      setReviews((previous) =>
        previous.filter((item) => item.id !== review.id)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const keyword = search.toLowerCase();

    return [
      review.id,
      review.comment,
      review.content,
      review.review_text,
      review.member_name,
      review.full_name,
      review.cafe_name,
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(keyword)
    );
  });

  const getReviewText = (review) =>
    review.comment || review.content || review.review_text || "-";

  const getReviewerName = (review) =>
    review.member_name || review.full_name || review.user_name || "สมาชิก";

  const getCafeName = (review) =>
    review.cafe_name || review.cafe?.name || "ไม่ระบุคาเฟ่";

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

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#493629]">
              จัดการรีวิว
            </h1>

            <p className="text-gray-500 mt-2">
              ตรวจสอบและจัดการรีวิวจากสมาชิก Cuppie
            </p>
          </div>

          <button
            onClick={fetchReviews}
            disabled={loading}
            className="bg-amber-900 text-white px-5 py-3 rounded-full hover:bg-amber-800 disabled:opacity-50"
          >
            {loading ? "กำลังโหลด..." : "รีเฟรชข้อมูล"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500">รีวิวทั้งหมด</p>
            <p className="text-3xl font-bold text-[#493629] mt-2">
              {reviews.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500">ผลการค้นหา</p>
            <p className="text-3xl font-bold text-[#493629] mt-2">
              {filteredReviews.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหารีวิว ชื่อสมาชิก หรือชื่อคาเฟ่..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-800 mb-6"
          />

          {error && (
            <p className="text-red-500 bg-red-50 p-3 rounded-xl mb-4">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-center text-gray-500 py-10">
              กำลังโหลดข้อมูลรีวิว...
            </p>
          ) : filteredReviews.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              ไม่พบข้อมูลรีวิว
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-gray-500 text-sm">
                    <th className="py-4 px-3">สมาชิก</th>
                    <th className="py-4 px-3">คาเฟ่</th>
                    <th className="py-4 px-3">คะแนน</th>
                    <th className="py-4 px-3">ความคิดเห็น</th>
                    <th className="py-4 px-3 text-center">จัดการ</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReviews.map((review) => (
                    <tr
                      key={review.id}
                      className="border-b last:border-0 hover:bg-[#FAF8F4]"
                    >
                      <td className="py-4 px-3 font-medium text-[#493629]">
                        {getReviewerName(review)}
                      </td>

                      <td className="py-4 px-3 text-gray-600">
                        {getCafeName(review)}
                      </td>

                      <td className="py-4 px-3 text-amber-700 whitespace-nowrap">
                        {review.rating != null
                          ? `★ ${review.rating}/5`
                          : "-"}
                      </td>

                      <td className="py-4 px-3 text-gray-600 max-w-xs">
                        <p className="line-clamp-3">
                          {getReviewText(review)}
                        </p>
                      </td>

                      <td className="py-4 px-3 text-center">
                        <button
                          onClick={() => handleDelete(review)}
                          disabled={processingId === review.id}
                          className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg disabled:opacity-50"
                        >
                          {processingId === review.id
                            ? "กำลังลบ..."
                            : "ลบรีวิว"}
                        </button>
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

export default AdminReviews;