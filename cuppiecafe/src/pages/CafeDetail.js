
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

const API_URL = (
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8080"
).replace(/\/+$/, "");

const cafeImages = [
  "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200",
  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200",
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
  const navigate = useNavigate();

  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageSrc, setImageSrc] = useState("");

  const { toggleFavorite, isFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();

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

        const formattedCafe = {
          ...data,
          id: data.id,
          location: data.address || "ไม่ระบุที่อยู่",
        };

        setCafe(formattedCafe);
        setImageSrc(getCafeImage(formattedCafe));
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
        <div className="text-center py-32 text-[#82766C]">
          กำลังโหลดข้อมูลคาเฟ่...
        </div>
      </div>
    );
  }

  if (error || !cafe) {
    return (
      <div className="min-h-screen bg-[#FAF8F4]">
        <Navbar />

        <div className="max-w-xl mx-auto text-center py-32 px-6">
          <div className="text-5xl mb-5">☕</div>

          <h1 className="text-2xl font-bold text-[#493629]">
            {error || "ไม่พบข้อมูลคาเฟ่"}
          </h1>

          <p className="text-[#82766C] mt-3">
            ขออภัย ไม่สามารถแสดงข้อมูลร้านนี้ได้
          </p>

          <Link
            to="/cafes"
            className="inline-block mt-6 bg-[#754A30] text-white px-7 py-3 rounded-full hover:bg-[#493629] transition"
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
        state: {
          from: {
            pathname: `/cafes/${cafe.id}`,
          },
        },
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

  const category = cafe.category_name || cafe.category || "คาเฟ่";

  const categoryNames = {
    "Café": "คาเฟ่",
    "Coffee Shop": "ร้านกาแฟ",
    "Minimal Cafe": "มินิมอล",
    "Nature Cafe": "ธรรมชาติ",
    "Coffee & Bakery": "กาแฟและเบเกอรี่",
    "Vintage Cafe": "วินเทจ",
    "Pet Friendly": "คาเฟ่สัตว์เลี้ยง",
  };

  const description =
    cafe.description ||
    "มาสัมผัสบรรยากาศดี ๆ พร้อมเครื่องดื่มและช่วงเวลาพักผ่อน เหมาะสำหรับคนที่กำลังมองหาสถานที่นั่งชิล และใช้เวลากับตัวเองหรือคนพิเศษ";

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-14">

        {/* Back Navigation */}
        <Link
          to="/cafes"
          className="inline-flex items-center gap-2 text-[#82766C] hover:text-[#754A30] transition mb-8"
        >
          <span>←</span>
          <span>กลับไปหน้าสำรวจคาเฟ่</span>
        </Link>

        {/* Cafe Detail */}
        <section className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Cafe Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-[28px] shadow-sm">
              <img
                src={imageSrc}
                alt={cafe.name || "Cafe"}
                onError={() => {
                  setImageSrc(cafeImages[0]);
                }}
                className="w-full h-[350px] sm:h-[450px] lg:h-[560px] object-cover"
              />
            </div>

            <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-[#493629]">
              ☕ Cuppie Cafe Guide
            </div>
          </div>

          {/* Cafe Information */}
          <div className="flex flex-col">

            {/* Category */}
            <div>
              <span className="inline-block bg-[#F0E4D8] text-[#754A30] px-4 py-2 rounded-full text-sm font-medium">
                {categoryNames[category] || category}
              </span>
            </div>

            {/* Cafe Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#493629] leading-tight mt-6">
              {cafe.name}
            </h1>

            {/* Location */}
            <div className="flex items-start gap-3 mt-5 text-[#82766C]">
              <span className="text-lg">📍</span>
              <p className="leading-relaxed">
                {cafe.location}
              </p>
            </div>

            {/* Rating and Price */}
            {(cafe.rating != null || cafe.price) && (
              <div className="flex flex-wrap gap-3 mt-6">
                {cafe.rating != null && (
                  <div className="bg-white border border-[#F0E4D8] rounded-xl px-5 py-3">
                    <p className="text-xs text-[#82766C]">
                      คะแนนร้าน
                    </p>
                    <p className="text-[#493629] font-semibold mt-1">
                      ⭐ {cafe.rating} / 5
                    </p>
                  </div>
                )}

                {cafe.price && (
                  <div className="bg-white border border-[#F0E4D8] rounded-xl px-5 py-3">
                    <p className="text-xs text-[#82766C]">
                      ช่วงราคา
                    </p>
                    <p className="text-[#493629] font-semibold mt-1">
                      {cafe.price}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 md:p-8 mt-8 border border-[#F0E4D8]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">☕</span>

                <h2 className="text-xl font-semibold text-[#493629]">
                  เกี่ยวกับคาเฟ่นี้
                </h2>
              </div>

              <p className="text-[#82766C] leading-8 mt-4">
                {description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-7">
              <button
                type="button"
                onClick={handleFavorite}
                className={`w-full py-4 rounded-full border transition font-medium ${
                  favorite
                    ? "bg-[#F0E4D8] border-[#754A30] text-[#754A30]"
                    : "bg-transparent border-[#754A30] text-[#754A30] hover:bg-[#F0E4D8]"
                }`}
              >
                {favorite
                  ? "♥ บันทึกเป็นรายการโปรดแล้ว"
                  : "♡ เพิ่มในรายการโปรด"}
              </button>

              <button
                type="button"
                onClick={handleReview}
                className="w-full py-4 rounded-full bg-[#754A30] text-white hover:bg-[#493629] transition font-medium"
              >
                ✎ เขียนรีวิว
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default CafeDetail;
