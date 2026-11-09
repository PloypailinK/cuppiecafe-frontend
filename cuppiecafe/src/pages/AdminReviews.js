import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = (
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8080"
).replace(/\/+$/, "");

function AdminReviews() {
  const { token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  // โหลดข้อมูลรีวิว
  const fetchReviews = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
  }, [token]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // เปิด Modal ยืนยัน
  const handleOpenModal = (review) => {
    setError("");
    setSelectedReview(review);
  };

  // ปิด Modal
  const handleCloseModal = () => {
    if (processingId !== null) return;
    setSelectedReview(null);
  };

  // ยืนยันลบรีวิว
  const handleDelete = async () => {
    if (!selectedReview) return;

    const review = selectedReview;

    try {
      setProcessingId(review.id);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/reviews/${encodeURIComponent(review.id)}`,
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

      setSelectedReview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  // ข้อมูลรีวิว
  const getReviewText = (review) =>
    review.comment ||
    review.content ||
    review.review_text ||
    "-";

  const getReviewerName = (review) =>
    review.member_name ||
    review.full_name ||
    review.user_name ||
    "สมาชิก";

  const getCafeName = (review) =>
    review.cafe_name ||
    review.cafe?.name ||
    "ไม่ระบุคาเฟ่";

  // ค้นหารีวิว
  const filteredReviews = reviews.filter((review) => {
    const keyword = search.toLowerCase();

    return [
      review.id,
      getReviewText(review),
      getReviewerName(review),
      getCafeName(review),
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <p className="text-xs tracking-[0.18em] text-[#A87852] font-semibold">
            REVIEWS MANAGEMENT
          </p>

          <h1 className="text-3xl font-bold text-[#493629] mt-2">
            จัดการรีวิว
          </h1>

          <p className="text-gray-500 mt-2">
            ตรวจสอบและจัดการรีวิวจากสมาชิก Cuppie
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReviews}
          disabled={loading}
          className="bg-[#754A30] text-white px-5 py-3 rounded-xl hover:bg-[#493629] disabled:opacity-50 transition"
        >
          {loading ? "กำลังโหลด..." : "↻ รีเฟรชข้อมูล"}
        </button>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EFE5DB]">
          <p className="text-gray-500 text-sm">
            รีวิวทั้งหมด
          </p>

          <p className="text-3xl font-bold text-[#493629] mt-2">
            {reviews.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EFE5DB]">
          <p className="text-gray-500 text-sm">
            ผลการค้นหา
          </p>

          <p className="text-3xl font-bold text-[#493629] mt-2">
            {filteredReviews.length}
          </p>
        </div>
      </div>

      {/* REVIEW TABLE */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#EFE5DB]">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหารีวิว ชื่อสมาชิก หรือชื่อคาเฟ่..."
          className="w-full border border-[#E8DCCF] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#A87852] mb-6"
        />

        {error && (
          <p className="text-red-600 bg-red-50 p-3 rounded-xl mb-4">
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
                  <th className="py-4 px-3 text-center">
                    จัดการ
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b last:border-0 hover:bg-[#FAF8F4] transition"
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
                        type="button"
                        onClick={() => handleOpenModal(review)}
                        disabled={processingId === review.id}
                        className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg disabled:opacity-50 transition"
                      >
                        ลบรีวิว
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* DELETE REVIEW MODAL */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={handleCloseModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-review-title"
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
                id="delete-review-title"
                className="text-xl md:text-2xl font-bold text-[#493629]"
              >
                ยืนยันการลบรีวิว
              </h2>

              <p className="text-gray-500 mt-4 leading-7">
                ต้องการลบรีวิวนี้ใช่หรือไม่?
              </p>

              <p className="text-red-600 text-sm mt-3">
                เมื่อลบแล้วจะไม่สามารถกู้คืนรีวิวนี้ได้
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
                onClick={handleDelete}
                disabled={processingId !== null}
                className="flex-1 bg-red-600 text-white py-3.5 rounded-full hover:bg-red-700 transition disabled:opacity-50"
              >
                {processingId !== null
                  ? "กำลังลบ..."
                  : "ยืนยันลบรีวิว"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReviews;