
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CafeCard from "../components/CafeCard";

const API_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8080";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Home() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ดึงข้อมูลคาเฟ่จาก Foursquare ผ่าน Backend
  useEffect(() => {
    const fetchCafes = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/foursquare/cafes?query=coffee`
        );

        if (!response.ok) {
          throw new Error("ไม่สามารถโหลดข้อมูลคาเฟ่ได้");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("รูปแบบข้อมูลไม่ถูกต้อง");
        }

        const formattedCafes = data.map((cafe) => ({
          ...cafe,
          id: cafe.fsq_id || cafe.id || cafe.name,
          location:
            [
              cafe.address,
              cafe.locality,
              cafe.region,
            ]
              .filter(Boolean)
              .join(", ") || "ไม่ระบุที่อยู่",
        }));

        setCafes(formattedCafes);
      } catch (err) {
        console.error("Home fetch error:", err);
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchCafes();
  }, []);

  const categories = [
    {
      name: "มินิมอล",
      description: "เรียบง่าย สบายตา",
      image:
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=900",
    },
    {
      name: "ธรรมชาติ",
      description: "พักผ่อนท่ามกลางธรรมชาติ",
      image:
        "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900",
    },
    {
      name: "วินเทจ",
      description: "เสน่ห์ที่เหนือกาลเวลา",
      image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900",
    },
    {
      name: "คาเฟ่สัตว์เลี้ยง",
      description: "ใช้เวลากับเพื่อนตัวน้อย",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#493629]">
      <Navbar />

      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-16 py-12 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="order-1">
            <div className="inline-flex items-center gap-3 bg-[#F0E4D8] rounded-full px-5 py-3 mb-7">
              <span className="w-2 h-2 rounded-full bg-[#A87852]" />
              <p className="text-[10px] md:text-xs tracking-[0.16em] font-semibold text-[#754A30]">
                YOUR LITTLE CAFE COMPANION
              </p>
            </div>

            <h1 className="text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight">
              Find your
              <br />
              <span className="text-[#A87852]">cozy corner.</span>
            </h1>

            <h2 className="text-xl md:text-xl lg:text-2xl font-semibold mt-6">
              คาเฟ่ดี ๆ รอให้คุณค้นพบอยู่
            </h2>

            <p className="text-sm md:text-sm lg:text-base text-[#82766C] leading-8 mt-4 max-w-lg">
              ไม่ว่าจะเป็นคาเฟ่บรรยากาศอบอุ่น ร้านกาแฟสไตล์มินิมอล
              หรือมุมโปรดสำหรับวันพักผ่อน ให้ Cuppie พาคุณไปค้นพบสถานที่ที่ใช่
            </p>

            <Link
              to="/cafes"
              className="inline-flex items-center gap-4 mt-7 bg-[#754A30] text-white px-8 py-4 rounded-full text-sm font-medium shadow-md hover:bg-[#5D3928] hover:-translate-y-1 transition duration-300"
            >
              ค้นหาคาเฟ่เลย
              <ArrowIcon />
            </Link>

            <div className="border-t border-[#E7DCCF] mt-9 pt-5 max-w-md flex items-center gap-4">
              <div className="w-12 h-12 shrink-0 rounded-full bg-[#F0E4D8] flex items-center justify-center text-2xl">
                ☕
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Your moment, your cafe.
                </p>
                <p className="text-xs text-[#96877A] mt-1">
                  ค้นพบคาเฟ่ในแบบที่เป็นคุณ
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="order-2 relative w-full max-w-[560px] mx-auto md:ml-auto">
            <div className="absolute -top-6 -right-5 w-40 h-40 md:w-52 md:h-52 rounded-full bg-[#EBD7C3]" />
            <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full bg-[#C69A75] opacity-40" />

            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200"
                alt="บรรยากาศคาเฟ่แสนอบอุ่น"
                className="w-full h-[340px] sm:h-[400px] md:h-[430px] lg:h-[500px] object-cover rounded-[30px] shadow-xl"
              />

              <div className="absolute bottom-5 left-4 right-4 md:left-5 md:right-5 bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-5 shadow-lg">
                <p className="text-[10px] tracking-[0.15em] text-[#A87852] font-semibold">
                  A MOMENT FOR YOURSELF
                </p>
                <p className="text-sm md:text-base font-bold text-[#493629] mt-2">
                  ให้ทุกการออกไปคาเฟ่เป็นช่วงเวลาพิเศษ
                </p>
              </div>

              <div className="absolute -top-4 -right-4 md:-right-6 w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#754A30] text-white flex flex-col items-center justify-center shadow-lg rotate-12">
                <span className="text-2xl">♡</span>
                <span className="text-[8px] tracking-widest">CUPPIE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        id="categories"
        className="px-6 md:px-10 lg:px-16 py-14 md:py-16 scroll-mt-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div>
              <p className="text-[10px] tracking-[0.2em] font-semibold text-[#98765B]">
                EXPLORE YOUR STYLE
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mt-3">
                คาเฟ่ในแบบที่คุณชอบ
              </h2>
              <p className="text-sm text-[#82766C] mt-2">
                เลือกบรรยากาศที่ใช่ แล้วออกไปค้นพบสถานที่ใหม่ ๆ
              </p>
            </div>

            <Link
              to="/cafes"
              className="text-sm font-semibold text-[#754A30] hover:underline"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                to="/cafes"
                key={category.name}
                className="group bg-white rounded-3xl overflow-hidden border border-[#EEE5DC] shadow-sm hover:shadow-lg transition duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#FAF3EA] text-[#754A30] flex items-center justify-center shadow-sm group-hover:bg-[#754A30] group-hover:text-white transition">
                    <ArrowIcon />
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">
                      {category.name}
                    </h3>
                    <span className="text-[#A87852]">→</span>
                  </div>
                  <p className="text-sm text-[#96877A] mt-2">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RECOMMENDED CAFES */}
      <section className="px-6 md:px-10 lg:px-16 py-14 md:py-16 bg-[#F3EDE5]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-9">
            <div>
              <p className="text-[10px] tracking-[0.2em] font-semibold text-[#98765B]">
                HANDPICKED FOR YOU
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mt-3">
                คาเฟ่แนะนำ
              </h2>
              <p className="text-sm text-[#82766C] mt-2">
                ร้านน่าสนใจจากคาเฟ่ในนครปฐม
              </p>
            </div>

            <Link
              to="/cafes"
              className="text-sm font-semibold text-[#754A30] hover:underline"
            >
              ดูคาเฟ่ทั้งหมด →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16 text-[#82766C]">
              กำลังโหลดข้อมูลคาเฟ่...
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-[#754A30] underline"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          ) : cafes.length === 0 ? (
            <div className="text-center py-16 text-[#82766C]">
              ยังไม่พบข้อมูลคาเฟ่
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {cafes.slice(0, 6).map((cafe) => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
