import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CafeCard from "../components/CafeCard";

const API_URL = (
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8080"
).replace(/\/+$/, "");

function Explore() {
  const [cafes, setCafes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/foursquare/cafes?query=coffee`
        );

        if (!response.ok) {
          throw new Error(`ไม่สามารถโหลดคาเฟ่ได้ (${response.status})`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("รูปแบบข้อมูลจาก API ไม่ถูกต้อง");
        }

        const formattedCafes = data
          .filter((cafe) => cafe.id)
          .map((cafe) => ({
            ...cafe,
            id: cafe.id,
            location:
              cafe.address ||
              "ไม่ระบุที่อยู่",
          }));

        setCafes(formattedCafes);
      } catch (err) {
        console.error("Fetch cafes error:", err);
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchCafes();
  }, []);

  const categories = [
    "ทั้งหมด",
    ...new Set(cafes.map((cafe) => cafe.category_name).filter(Boolean)),
  ];

  const filteredCafes = cafes.filter((cafe) => {
    const keyword = search.toLowerCase().trim();

    const matchName =
      cafe.name?.toLowerCase().includes(keyword) ||
      cafe.location?.toLowerCase().includes(keyword);

    const matchCategory =
      category === "ทั้งหมด" || cafe.category_name === category;

    return matchName && matchCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <Navbar />

      <section className="px-6 md:px-16 py-12 max-w-7xl mx-auto">
        <p className="text-amber-800 font-medium text-sm">
          ค้นพบสถานที่ที่ใช่สำหรับคุณ
        </p>

        <h1 className="text-4xl font-bold text-gray-800 mt-2">
          สำรวจคาเฟ่
        </h1>

        <p className="text-gray-500 mt-3">
          ค้นพบคาเฟ่บรรยากาศอบอุ่น และค้นหาร้านโปรดแห่งใหม่ในแบบของคุณ
        </p>

        <input
          type="text"
          placeholder="ค้นหาชื่อคาเฟ่หรือสถานที่..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mt-8 p-4 rounded-xl border border-amber-100 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700"
        />

        <div className="flex flex-wrap gap-3 mt-5">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-5 py-2 rounded-full transition ${
                category === item
                  ? "bg-amber-900 text-white"
                  : "bg-white text-amber-900 hover:bg-amber-100"
              }`}
            >
              {item === "ทั้งหมด" ? "ทั้งหมด" : item}
            </button>
          ))}
        </div>

        <div className="mt-10 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {search ? `ผลการค้นหา "${search}"` : "คาเฟ่ทั้งหมด"}
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            พบ {filteredCafes.length} ร้าน
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-amber-900 text-lg">
              กำลังโหลดข้อมูลคาเฟ่...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl">
            <p className="text-4xl mb-4">⚠️</p>
            <h3 className="text-gray-800 text-lg font-semibold">
              โหลดข้อมูลไม่สำเร็จ
            </h3>
            <p className="text-gray-500 mt-2">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-amber-900 underline"
            >
              ลองอีกครั้ง
            </button>
          </div>
        ) : filteredCafes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCafes.map((cafe) => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl">
            <p className="text-4xl mb-4">☕</p>

            <h3 className="text-gray-800 text-lg font-semibold">
              ไม่พบคาเฟ่ที่ค้นหา
            </h3>

            <p className="text-gray-500 mt-2">
              ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("ทั้งหมด");
              }}
              className="mt-4 text-amber-900 underline"
            >
              ล้างตัวกรอง
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Explore;