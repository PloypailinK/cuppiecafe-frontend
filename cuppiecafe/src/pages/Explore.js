
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import CafeCard from "../components/CafeCard";

const API_URL = (
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8080"
).replace(/\/+$/, "");

const CATEGORIES = [
  "ทั้งหมด",
  "มินิมอล",
  "ธรรมชาติ",
  "Cozy",
  "Vintage",
  "Pet Friendly",
];

const DEMO_STYLES = [
  "มินิมอล",
  "ธรรมชาติ",
  "Cozy",
  "Vintage",
];

function normalizeCategory(value) {
  if (!value) return "ทั้งหมด";

  const aliases = {
    "วินเทจ": "Vintage",
    "คาเฟ่สัตว์เลี้ยง": "Pet Friendly",
  };

  const normalized = aliases[value] || value;

  return CATEGORIES.includes(normalized)
    ? normalized
    : "ทั้งหมด";
}

function getCafeStyles(cafe, index) {
  const existingStyles = [
    ...(Array.isArray(cafe.styles) ? cafe.styles : []),
    ...(Array.isArray(cafe.tags) ? cafe.tags : []),
    cafe.style,
    cafe.ambience,
  ].filter(Boolean);

  if (existingStyles.length > 0) {
    return existingStyles;
  }

  const text = [
    cafe.name,
    cafe.description,
    cafe.category,
    cafe.category_name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const styles = [];

  if (/minimal|minimalist|มินิมอล|เรียบง่าย/.test(text)) {
    styles.push("มินิมอล");
  }

  if (/nature|forest|garden|green|ธรรมชาติ|สวน|ต้นไม้/.test(text)) {
    styles.push("ธรรมชาติ");
  }

  if (/cozy|warm|อบอุ่น|สบาย/.test(text)) {
    styles.push("Cozy");
  }

  if (/vintage|retro|วินเทจ|ย้อนยุค/.test(text)) {
    styles.push("Vintage");
  }

  if (/pet friendly|pet-friendly|สัตว์เลี้ยง/.test(text)) {
    styles.push("Pet Friendly");
  }

  if (styles.length === 0) {
    styles.push(DEMO_STYLES[index % DEMO_STYLES.length]);
  }

  return styles;
}

function Explore() {
  const [cafes, setCafes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // อ่านหมวดหมู่จาก URL
  const [searchParams, setSearchParams] = useSearchParams();

  const category = normalizeCategory(
    searchParams.get("category")
  );
//useEffect
  useEffect(() => {
    const fetchCafes = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/cafes`
        );

        if (!response.ok) {
          throw new Error(
            `ไม่สามารถโหลดคาเฟ่ได้ (${response.status})`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("รูปแบบข้อมูลจาก API ไม่ถูกต้อง");
        }

        const formattedCafes = data
          .filter((cafe) => cafe.id)
          .map((cafe, index) => ({
            ...cafe,
            id: cafe.id,
            location:
              cafe.address ||
              [
                cafe.locality,
                cafe.region,
              ]
                .filter(Boolean)
                .join(", ") ||
              "ไม่ระบุที่อยู่",
            styles: getCafeStyles(cafe, index),
          }));

        setCafes(formattedCafes);
      } catch (err) {
        console.error("Fetch cafes error:", err);
        setError(
          err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCafes();
  }, []);

  // เปลี่ยนหมวดหมู่และ URL พร้อมกัน
  const handleCategoryChange = (item) => {
    if (item === "ทั้งหมด") {
      setSearchParams({});
    } else {
      setSearchParams({ category: item });
    }
  };

  const filteredCafes = cafes.filter((cafe) => {
    const keyword = search.toLowerCase().trim();

    const matchName =
      cafe.name?.toLowerCase().includes(keyword) ||
      cafe.location?.toLowerCase().includes(keyword);

    const matchCategory =
      category === "ทั้งหมด" ||
      cafe.styles.some(
        (style) =>
          normalizeCategory(style) === category
      );

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

        {/* Search */}
        <input
          type="text"
          placeholder="ค้นหาชื่อคาเฟ่หรือสถานที่..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mt-8 p-4 rounded-xl border border-amber-100 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mt-5">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleCategoryChange(item)}
              className={`px-5 py-2 rounded-full transition ${
                category === item
                  ? "bg-amber-900 text-white"
                  : "bg-white text-amber-900 hover:bg-amber-100 border border-amber-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Cafe Count */}
        <div className="mt-10 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {search
              ? `ผลการค้นหา "${search}"`
              : category === "ทั้งหมด"
                ? "คาเฟ่ทั้งหมด"
                : `คาเฟ่หมวด${category}`}
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            พบ {filteredCafes.length} ร้าน
          </p>
        </div>

        {/* Loading */}
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
                handleCategoryChange("ทั้งหมด");
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
