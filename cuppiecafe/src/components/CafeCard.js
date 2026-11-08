
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

// รูปคาเฟ่จาก Unsplash
const cafeImages = [
  "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800",
];

const DEFAULT_IMAGE = cafeImages[0];

// เลือกรูปตาม ID ร้าน
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

function CafeCard({ cafe }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // รองรับทั้ง ID จาก Foursquare และข้อมูลเดิม
  const cafeId = cafe.id ?? cafe.fsq_id;

  // ทำให้ข้อมูลที่บันทึก Favorites มี id เสมอ
  const normalizedCafe = {
    ...cafe,
    id: cafeId,
  };

  const favorite = isFavorite(cafeId);

  const [imageSrc, setImageSrc] = useState(
    getCafeImage(cafe)
  );

  const handleFavorite = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: { pathname: "/favorites" },
        },
      });
      return;
    }

    toggleFavorite(normalizedCafe);
  };

  const categoryNames = {
    "Café": "คาเฟ่",
    "Coffee Shop": "ร้านกาแฟ",
    "Minimal Cafe": "มินิมอล",
    "Nature Cafe": "ธรรมชาติ",
    "Coffee & Bakery": "กาแฟและเบเกอรี่",
    "Vintage Cafe": "วินเทจ",
    "Pet Friendly": "คาเฟ่สัตว์เลี้ยง",
  };

  // รองรับ ID ทั้งตัวเลขและ String
  const hasDetail = Boolean(cafeId);

  const location =
    cafe.location ||
    [
      cafe.address,
      cafe.locality,
      cafe.region,
    ]
      .filter(Boolean)
      .join(", ") ||
    "ไม่ระบุที่อยู่";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300">

      {/* Cafe Image */}
      <div className="relative">
        <img
          src={imageSrc}
          alt={cafe.name || "Cafe"}
          onError={() => {
            if (imageSrc !== DEFAULT_IMAGE) {
              setImageSrc(DEFAULT_IMAGE);
            }
          }}
          className="w-full h-56 object-cover"
        />

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={
            favorite
              ? "นำออกจากรายการโปรด"
              : "เพิ่มในรายการโปรด"
          }
          className="absolute top-4 right-4 bg-white w-10 h-10 rounded-full shadow-md text-xl flex items-center justify-center hover:scale-110 transition"
        >
          <span
            className={
              favorite
                ? "text-red-500"
                : "text-gray-400"
            }
          >
            {favorite ? "♥" : "♡"}
          </span>
        </button>
      </div>

      {/* Cafe Information */}
      <div className="p-5">

        {/* Category and Rating */}
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
            {categoryNames[cafe.category] ||
              cafe.category ||
              "คาเฟ่"}
          </span>

          {cafe.rating != null && (
            <span className="text-sm font-semibold">
              ⭐ {cafe.rating}
            </span>
          )}
        </div>

        {/* Cafe Name */}
        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          {cafe.name}
        </h3>

        {/* Location */}
        <p className="text-sm text-gray-500 mt-2">
          📍 {location}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4">
          {cafe.price ? (
            <span className="text-sm text-gray-600">
              ราคา {cafe.price}
            </span>
          ) : (
            <span className="text-xs text-gray-400">
              ข้อมูลจาก Foursquare
            </span>
          )}

          {hasDetail && (
            <Link
              to={`/cafes/${cafeId}`}
              className="text-amber-900 font-medium text-sm hover:underline"
            >
              ดูรายละเอียด →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default CafeCard;
