
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
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800",
  "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800",
  "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800",
  "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800",
  "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800",
  "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=800",
  "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  "https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=800",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
];

const DEFAULT_IMAGE = cafeImages[0];

// เลือกรูปตาม ID ร้าน
function getCafeImage(cafe) {
  if (cafe.image_url) return cafe.image_url;
  if (cafe.image) return cafe.image;

  const id = String(
    cafe.fsq_id || cafe.id || cafe.name || "cafe"
  );

  const hash = Array.from(id).reduce(
    (sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0,
    0
  );

  return cafeImages[hash % cafeImages.length];
}

function CafeCard({ cafe }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const cafeId = cafe.id ?? cafe.fsq_id;

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

    // บันทึกรูปที่กำลังแสดงไปพร้อมกับข้อมูลร้าน
    toggleFavorite({
      ...normalizedCafe,
      image_url: cafe.image_url || cafe.image || imageSrc,
    });
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
