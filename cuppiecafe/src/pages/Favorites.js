
import { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

// รูปสำรองสำหรับคาเฟ่
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
];

function FavoriteCard({ cafe, removeFavorite }) {
  const imageCandidates = [
    cafe.image_url,
    cafe.image,
    ...cafeImages,
  ].filter(Boolean);

  const uniqueImages = [...new Set(imageCandidates)];

  const [imageIndex, setImageIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  const categoryNames = {
    "Café": "คาเฟ่",
    "Coffee Shop": "ร้านกาแฟ",
    "Minimal Cafe": "มินิมอล",
    "Nature Cafe": "ธรรมชาติ",
    "Coffee & Bakery": "กาแฟและเบเกอรี่",
    "Vintage Cafe": "วินเทจ",
    "Pet Friendly": "Pet Friendly",
  };

  const category =
    cafe.category_name ||
    cafe.category ||
    "คาเฟ่";

  const location =
    cafe.location ||
    cafe.address ||
    cafe.locality ||
    "ไม่ระบุที่อยู่";

  const handleImageError = () => {
    if (imageIndex < uniqueImages.length - 1) {
      setImageIndex((prev) => prev + 1);
    } else {
      setImageFailed(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300">

      {/* Cafe Image */}
      <div className="relative">
        {imageFailed ? (
          <div className="w-full h-56 bg-[#F0E4D8] flex flex-col items-center justify-center">
            <span className="text-5xl">☕</span>
            <p className="text-sm text-[#82766C] mt-3">
              ไม่มีรูปภาพร้าน
            </p>
          </div>
        ) : (
          <img
            key={uniqueImages[imageIndex]}
            src={uniqueImages[imageIndex]}
            alt={cafe.name || "Cafe"}
            onError={handleImageError}
            className="w-full h-56 object-cover"
          />
        )}

        {/* Favorite Icon */}
        <span className="absolute top-4 right-4 bg-white/90 text-[#A87852] rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-sm">
          ♥
        </span>
      </div>

      {/* Cafe Information */}
      <div className="p-5">

        {/* Category and Rating */}
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs text-[#754A30] bg-[#F5EDE5] px-3 py-1 rounded-full">
            {categoryNames[category] || category}
          </span>

          {cafe.rating != null && (
            <span className="text-sm text-[#82766C]">
              ⭐ {cafe.rating}
            </span>
          )}
        </div>

        {/* Cafe Name */}
        <h2 className="text-xl font-semibold text-[#493629] mt-4">
          {cafe.name}
        </h2>

        {/* Location */}
        <p className="text-sm text-[#82766C] mt-2">
          📍 {location}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#F0E4D8] gap-2">
          <Link
            to={`/cafes/${cafe.id}`}
            className="text-[#754A30] font-medium text-sm hover:text-[#A87852] transition"
          >
            ดูรายละเอียด →
          </Link>

          <button
            type="button"
            onClick={() => removeFavorite(cafe.id)}
            className="text-sm text-[#A87852] hover:text-red-600 transition"
          >
            ♥ นำออกจากรายการ
          </button>
        </div>
      </div>
    </div>
  );
}

function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <Navbar />

      <main className="px-6 md:px-16 py-12 max-w-7xl mx-auto">

        {/* Page Heading */}
        <div>
          <p className="text-[#A87852] font-medium text-sm tracking-wide">
            ร้านโปรดของคุณ
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-[#493629] mt-2">
            คาเฟ่ที่ชื่นชอบ{" "}
            <span className="text-[#A87852]">♥</span>
          </h1>

          <p className="text-[#82766C] mt-3">
            รวมคาเฟ่ที่คุณบันทึกไว้ในที่เดียว
          </p>
        </div>

        {favorites.length > 0 ? (
          <>
            {/* Favorite Count */}
            <div className="flex items-center justify-between mt-10 mb-6">
              <h2 className="text-lg font-semibold text-[#493629]">
                ร้านโปรดของฉัน
              </h2>

              <span className="text-sm text-[#82766C] bg-[#F0E4D8] px-4 py-2 rounded-full">
                {favorites.length} ร้าน
              </span>
            </div>

            {/* Cafe Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((cafe) => (
                <FavoriteCard
                  key={cafe.id}
                  cafe={cafe}
                  removeFavorite={removeFavorite}
                />
              ))}
            </div>
          </>
        ) : (
          /* Empty Favorites */
          <div className="max-w-4xl mx-auto mt-12">
            <div className="relative overflow-hidden bg-white rounded-3xl border border-[#F0E4D8] shadow-sm px-6 py-12 md:px-12 md:py-14">

              <div className="absolute -top-16 -right-12 w-48 h-48 rounded-full bg-[#F8F0E8] opacity-70" />

              <div className="absolute -bottom-20 -left-12 w-52 h-52 rounded-full bg-[#F5EDE5] opacity-70" />

              <div className="relative z-10 text-center max-w-xl mx-auto">

                <div className="w-20 h-20 mx-auto rounded-full bg-[#F5EDE5] flex items-center justify-center mb-6">
                  <span className="text-4xl">♡</span>
                </div>

                <p className="text-xs font-semibold tracking-[0.2em] text-[#A87852] mb-3">
                  YOUR FAVORITE CORNER
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-[#493629]">
                  ยังไม่มีคาเฟ่ในรายการโปรด
                </h2>

                <p className="text-[#82766C] mt-4 leading-7">
                  คาเฟ่ที่คุณกดหัวใจไว้จะมาปรากฏที่นี่
                  <br className="hidden sm:block" />
                  ลองออกไปค้นหาร้านโปรดแห่งใหม่กันนะ
                </p>

                <Link
                  to="/cafes"
                  className="inline-flex items-center justify-center gap-2 mt-8 bg-[#754A30] text-white px-9 py-3.5 rounded-full font-medium hover:bg-[#493629] transition duration-300 shadow-sm"
                >
                  ค้นหาคาเฟ่เลย
                  <span>→</span>
                </Link>

                <p className="text-xs text-[#B0A399] mt-6">
                  เก็บร้านที่ใช่ไว้ แล้วกลับมาดูได้ทุกเมื่อ
                </p>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Favorites;
