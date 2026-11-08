
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <Navbar />

      <main className="px-6 md:px-16 py-12">
        {/* Page Heading */}
        <div>
          <p className="text-[#A87852] font-medium text-sm tracking-wide">
            ร้านโปรดของคุณ
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-[#493629] mt-2">
            คาเฟ่ที่ชื่นชอบ <span className="text-[#A87852]">♥</span>
          </h1>

          <p className="text-[#82766C] mt-3">
            รวมคาเฟ่ที่คุณบันทึกไว้ในที่เดียว
          </p>
        </div>

        {favorites.length > 0 ? (
          <>
            <div className="flex items-center justify-between mt-10 mb-6">
              <h2 className="text-lg font-semibold text-[#493629]">
                ร้านโปรดของฉัน
              </h2>

              <span className="text-sm text-[#82766C] bg-[#F0E4D8] px-4 py-2 rounded-full">
                {favorites.length} ร้าน
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((cafe) => (
                <div
                  key={cafe.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
                >
                  <div className="relative">
                    <img
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-full h-56 object-cover"
                    />

                    <span className="absolute top-4 right-4 bg-white/90 text-[#A87852] rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-sm">
                      ♥
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#754A30] bg-[#F5EDE5] px-3 py-1 rounded-full">
                        {cafe.category === "Minimal Cafe"
                          ? "มินิมอล"
                          : cafe.category === "Nature Cafe"
                          ? "ธรรมชาติ"
                          : cafe.category === "Coffee & Bakery"
                          ? "กาแฟและเบเกอรี่"
                          : cafe.category}
                      </span>

                      <span className="text-sm text-[#82766C]">
                        ⭐ {cafe.rating}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-[#493629] mt-4">
                      {cafe.name}
                    </h2>

                    <p className="text-sm text-[#82766C] mt-2">
                      📍 {cafe.location}
                    </p>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#F0E4D8]">
                      <Link
                        to={`/cafes/${cafe.id}`}
                        className="text-[#754A30] font-medium text-sm hover:text-[#A87852] transition"
                      >
                        ดูรายละเอียด →
                      </Link>

                      <button
                        onClick={() => removeFavorite(cafe.id)}
                        className="text-sm text-[#A87852] hover:text-red-600 transition"
                      >
                        ♥ นำออกจากรายการ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty Favorites */
          <div className="max-w-4xl mx-auto mt-12">
            <div className="relative overflow-hidden bg-white rounded-3xl border border-[#F0E4D8] shadow-sm px-6 py-12 md:px-12 md:py-14">
              {/* Decorative Circles */}
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
