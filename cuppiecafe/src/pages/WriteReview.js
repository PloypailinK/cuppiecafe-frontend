import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const API_URL = (
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8080"
).replace(/\/+$/, "");

function WriteReview() {
  const { id } = useParams();
  const { token } = useAuth();

  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // โหลดคาเฟ่และค้นหาด้วย UUID จาก Supabase
  useEffect(() => {
    const fetchCafe = async () => {
      try {
        setLoading(true);
        setFetchError("");

        const response = await fetch(
          `${API_URL}/api/cafes`
        );

        if (!response.ok) {
          throw new Error("ไม่สามารถโหลดข้อมูลคาเฟ่ได้");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("รูปแบบข้อมูลคาเฟ่ไม่ถูกต้อง");
        }

        // ใช้ UUID ของ Supabase ไม่ใช่ Foursquare ID
        const foundCafe = data.find(
          (item) => item.id === id
        );

        if (!foundCafe) {
          setCafe(null);
          setFetchError("ไม่พบข้อมูลคาเฟ่");
          return;
        }

        setCafe({
          ...foundCafe,
          location: foundCafe.address || "ไม่ระบุที่อยู่",
        });
      } catch (err) {
        console.error("Write review error:", err);
        setFetchError(
          err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCafe();
  }, [id]);

  // ส่งรีวิวไป Backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("กรุณาเลือกคะแนน");
      return;
    }

    if (!review.trim()) {
      setError("กรุณาเขียนรีวิวก่อนส่ง");
      return;
    }

    if (!token) {
      setError("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cafe_id: cafe.id,
          rating: rating,
          comment: review.trim(),
        }),
      });

      if (!response.ok) {
        const message = await response.text();

        if (response.status === 401) {
          throw new Error("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
        }

        if (response.status === 403) {
          throw new Error("คุณไม่มีสิทธิ์ส่งรีวิว");
        }

        throw new Error(message || "ไม่สามารถบันทึกรีวิวได้");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Submit review error:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการส่งรีวิว");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4]">
        <Navbar />
        <p className="text-center py-20 text-gray-500">
          กำลังโหลดข้อมูลคาเฟ่...
        </p>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="min-h-screen bg-[#FAF8F4]">
        <Navbar />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-800">
            {fetchError || "ไม่พบข้อมูลคาเฟ่"}
          </h1>

          <Link
            to="/cafes"
            className="text-amber-900 mt-5 inline-block hover:underline"
          >
            กลับไปสำรวจคาเฟ่
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-12">
        <Link
          to={`/cafes/${cafe.id}`}
          className="text-amber-900 hover:underline"
        >
          ← กลับไปหน้ารายละเอียด
        </Link>

        <div className="bg-white rounded-3xl p-8 mt-6 shadow-sm">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-5">🎉</div>

              <h1 className="text-2xl font-bold text-gray-800">
                ส่งรีวิวเรียบร้อยแล้ว
              </h1>

              <p className="text-gray-500 mt-3">
                ขอบคุณที่แบ่งปันประสบการณ์กับเรา
              </p>

              <Link
                to={`/cafes/${cafe.id}`}
                className="inline-block mt-7 bg-amber-900 text-white px-8 py-3 rounded-full"
              >
                กลับไปหน้าคาเฟ่
              </Link>
            </div>
          ) : (
            <>
              <p className="text-amber-800 text-sm font-medium">
                แบ่งปันประสบการณ์ของคุณ
              </p>

              <h1 className="text-3xl font-bold text-gray-800 mt-2">
                เขียนรีวิว
              </h1>

              <p className="text-gray-500 mt-3">
                ร้าน {cafe.name}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                📍 {cafe.location}
              </p>

              <form onSubmit={handleSubmit} className="mt-8">
                <label className="block font-semibold text-gray-800 mb-3">
                  ให้คะแนนคาเฟ่นี้
                </label>

                <div className="flex gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`ให้ ${star} คะแนน`}
                      className={`text-4xl transition ${star <= rating
                          ? "text-amber-400"
                          : "text-gray-300"
                        }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <label className="block font-semibold text-gray-800 mb-3">
                  รีวิวของคุณ
                </label>

                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="5"
                  placeholder="เล่าประสบการณ์ของคุณที่ร้านนี้..."
                  className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-800 resize-none"
                />

                {error && (
                  <p className="text-red-500 text-sm mt-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 bg-amber-900 text-white py-3 rounded-full hover:bg-amber-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "กำลังส่งรีวิว..." : "ส่งรีวิว"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default WriteReview;