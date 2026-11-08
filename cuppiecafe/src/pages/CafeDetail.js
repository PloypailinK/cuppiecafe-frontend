import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

const API_URL = (
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8080"
).replace(/\/+$/, "");

const cafeImages = [
  "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1000",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000",
  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1000",
];

function getCafeImage(cafe) {
  if (cafe.image_url) return cafe.image_url;
  if (cafe.image) return cafe.image;

  const id = cafe.fsq_id || cafe.id || cafe.name || "cafe";

  const index = Array.from(String(id)).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0
  ) % cafeImages.length;

  return cafeImages[index];
}

function CafeDetail() {
  const { id } = useParams();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { toggleFavorite, isFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCafe = async () => {
      try {
        setLoading(true);
        setError("");
        setCafe(null);

        const response = await fetch(
          `${API_URL}/api/cafes/${encodeURIComponent(id)}`
        );

        if (response.status === 404) {
          setCafe(null);
          return;
        }

        if (!response.ok) {
          throw new Error(
            `ไม่สามารถโหลดข้อมูลคาเฟ่ได้ (${response.status})`
          );
        }

        const data = await response.json();

        if (!data || !data.id) {
          setCafe(null);
          return;
        }

        setCafe({
          ...data,
          id: data.id,
          location: data.address || "ไม่ระบุที่อยู่",
        });
      } catch (err) {
        console.error("Cafe detail error:", err);
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCafe();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4]">
        <Navbar />
        <div className="text-center py-24 text-gray-500">
          กำลังโหลดข้อมูลคาเฟ่...
        </div>
      </div>
    );
  }

  if (error || !cafe) {
    return (
      <div className="min-h-screen bg-[#FAF8F4]">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-2xl font-bold text-gray-800">
            {error || "ไม่พบข้อมูลคาเฟ่"}
          </h1>

          <Link
            to="/cafes"
            className="text-amber-900 mt-5 inline-block"
          >
            กลับไปสำรวจคาเฟ่
          </Link>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(cafe.id);

  const handleFavorite = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: { from: { pathname: `/cafes/${cafe.id}` } },
      });
      return;
    }

    toggleFavorite(cafe);
  };

  const handleReview = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: {
            pathname: `/cafes/${cafe.id}/review`,
          },
        },
      });
      return;
    }

    navigate(`/cafes/${cafe.id}/review`);
  };

  const category =
    cafe.category_name || cafe.category || "คาเฟ่";

  const categoryNames = {
    "Café": "คาเฟ่",
    "Coffee Shop": "ร้านกาแฟ",
    "Minimal Cafe": "มินิมอล",
    "Nature Cafe": "ธรรมชาติ",
    "Coffee & Bakery": "กาแฟและเบเกอรี่",
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <Navbar />

      <main className="px-6 md:px-16 py-12 max-w-6xl mx-auto">
        <Link
          to="/cafes"
          className="text-amber-900 hover:underline"
        >
          ← กลับไปหน้าสำรวจคาเฟ่
        </Link>

        <div className="grid md:grid-cols-2 gap-10 mt-8 items-start">
          <img
            src={getCafeImage(cafe)}
            alt={cafe.name}
            onError={(event) => {
              event.currentTarget.src = cafeImages[0];
            }}
            className="w-full h-80 md:h-[450px] object-cover rounded-3xl shadow-sm"
          />

          <div>
            <span className="text-sm text-amber-800 bg-amber-50 px-4 py-2 rounded-full">
              {categoryNames[category] || category}
            </span>

            <h1 className="text-4xl font-bold text-gray-800 mt-6">
              {cafe.name}
            </h1>

            <p className="text-gray-500 mt-4">
              📍 {cafe.location}
            </p>

            {cafe.rating != null && (
              <p className="text-gray-700 mt-4">
                ⭐ คะแนน {cafe.rating} / 5
              </p>
            )}

            {cafe.price && (
              <p className="text-gray-700 mt-2">
                ราคา {cafe.price}
              </p>
            )}

            <div className="bg-white rounded-2xl p-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-800">
                เกี่ยวกับคาเฟ่นี้
              </h2>

              <p className="text-gray-500 leading-relaxed mt-3">
                มาสัมผัสบรรยากาศดี ๆ พร้อมเครื่องดื่มและช่วงเวลาพักผ่อน
                เหมาะสำหรับคนที่กำลังมองหาสถานที่นั่งชิล
                และใช้เวลากับตัวเองหรือคนพิเศษ
              </p>
            </div>

            <button
              onClick={handleFavorite}
              className="mt-6 w-full border border-amber-900 text-amber-900 py-3 rounded-full hover:bg-amber-50 transition"
            >
              {favorite
                ? "♥ บันทึกเป็นรายการโปรดแล้ว"
                : "♡ เพิ่มในรายการโปรด"}
            </button>

            <button
              onClick={handleReview}
              className="block text-center mt-4 w-full bg-amber-900 text-white py-3 rounded-full hover:bg-amber-800 transition"
            >
              เขียนรีวิว
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CafeDetail;