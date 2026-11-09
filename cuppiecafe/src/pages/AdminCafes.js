import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = (
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8080"
).replace(/\/+$/, "");

const emptyForm = {
  name: "",
  category_id: "",
  description: "",
  address: "",
  price_min: "",
  price_max: "",
  opening_hours: "",
  contact_info: "",
};

function AdminCafes() {
  const { token } = useAuth();

  const [cafes, setCafes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const [selectedCafe, setSelectedCafe] = useState(null);
  const [deactivating, setDeactivating] = useState(false);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // โหลดข้อมูลคาเฟ่
  const loadCafes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/cafes`);

      if (!response.ok) {
        throw new Error("ไม่สามารถโหลดรายการคาเฟ่ได้");
      }

      const data = await response.json();
      setCafes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCafes();
  }, [loadCafes]);

  // จัดการการเปลี่ยนแปลงในฟอร์ม
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ล้างฟอร์ม
  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  // แก้ไขข้อมูลคาเฟ่
  function handleEdit(cafe) {
    setEditingId(cafe.id);

    setForm({
      name: cafe.name || "",
      category_id: cafe.category_id || "",
      description: cafe.description || "",
      address: cafe.address || "",
      price_min: cafe.price_min ?? "",
      price_max: cafe.price_max ?? "",
      opening_hours: cafe.opening_hours || "",
      contact_info: cafe.contact_info || "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // เตรียมข้อมูลก่อนส่ง API
  function buildPayload() {
    return {
      name: form.name.trim(),
      category_id: form.category_id.trim() || null,
      description: form.description.trim() || null,
      address: form.address.trim() || null,
      price_min:
        form.price_min === "" ? null : Number(form.price_min),
      price_max:
        form.price_max === "" ? null : Number(form.price_max),
      opening_hours: form.opening_hours.trim() || null,
      contact_info: form.contact_info.trim() || null,
    };
  }

  // เพิ่มหรือแก้ไขคาเฟ่
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("กรุณากรอกชื่อคาเฟ่");
      return;
    }

    const priceMin =
      form.price_min === "" ? null : Number(form.price_min);

    const priceMax =
      form.price_max === "" ? null : Number(form.price_max);

    if (
      (priceMin !== null &&
        (!Number.isFinite(priceMin) || priceMin < 0)) ||
      (priceMax !== null &&
        (!Number.isFinite(priceMax) || priceMax < 0))
    ) {
      setError("กรุณากรอกราคาเป็นตัวเลขตั้งแต่ 0 ขึ้นไป");
      return;
    }

    if (
      priceMin !== null &&
      priceMax !== null &&
      priceMin > priceMax
    ) {
      setError("ราคาต่ำสุดต้องไม่มากกว่าราคาสูงสุด");
      return;
    }

    if (!token) {
      setError("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
      return;
    }

    try {
      setSaving(true);

      const isEditing = Boolean(editingId);

      const url = isEditing
        ? `${API_URL}/api/admin/cafes/${encodeURIComponent(editingId)}`
        : `${API_URL}/api/admin/cafes`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: authHeaders,
        body: JSON.stringify(buildPayload()),
      });

      if (!response.ok) {
        const text = await response.text();

        throw new Error(
          text ||
            (isEditing
              ? "ไม่สามารถแก้ไขคาเฟ่ได้"
              : "ไม่สามารถเพิ่มคาเฟ่ได้")
        );
      }

      setMessage(
        isEditing
          ? "แก้ไขข้อมูลคาเฟ่เรียบร้อยแล้ว"
          : "เพิ่มคาเฟ่เรียบร้อยแล้ว"
      );

      resetForm();
      await loadCafes();
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  // เปิด Modal ยืนยัน
  function openDeactivateModal(cafe) {
    setSelectedCafe(cafe);
    setError("");
    setMessage("");
  }

  // ปิด Modal
  function closeDeactivateModal() {
    if (deactivating) return;

    setSelectedCafe(null);
  }

  // ยืนยันปิดใช้งานคาเฟ่
  async function confirmDeactivate() {
    if (!selectedCafe || !token) {
      setError("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");
      return;
    }

    try {
      setDeactivating(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/cafes/${encodeURIComponent(
          selectedCafe.id
        )}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      if (!response.ok) {
        const text = await response.text();

        throw new Error(
          text || "ไม่สามารถปิดใช้งานคาเฟ่ได้"
        );
      }

      setMessage(
        `ปิดใช้งาน ${selectedCafe.name} เรียบร้อยแล้ว`
      );

      if (editingId === selectedCafe.id) {
        resetForm();
      }

      setSelectedCafe(null);

      await loadCafes();
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setDeactivating(false);
    }
  }

  // ค้นหาคาเฟ่
  const filteredCafes = cafes.filter((cafe) => {
    const keyword = search.toLowerCase();

    return (
      cafe.name?.toLowerCase().includes(keyword) ||
      cafe.address?.toLowerCase().includes(keyword) ||
      cafe.category_name?.toLowerCase().includes(keyword)
    );
  });

  const inputClass =
    "w-full border border-[#E8DCCF] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#A87852]";

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs tracking-[0.18em] text-[#A87852] font-semibold">
            CAFE MANAGEMENT
          </p>

          <h1 className="text-3xl font-bold text-[#493629] mt-2">
            จัดการคาเฟ่
          </h1>

          <p className="text-gray-500 mt-2">
            เพิ่ม แก้ไข และปิดใช้งานข้อมูลคาเฟ่
          </p>
        </div>

        <button
          type="button"
          onClick={loadCafes}
          disabled={loading}
          className="bg-white border border-[#E8DCCF] text-[#754A30] px-5 py-3 rounded-xl hover:bg-[#F0E4D8] disabled:opacity-50"
        >
          ↻ รีเฟรชรายการ
        </button>
      </div>

      {/* NOTIFICATIONS */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-5">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-5">
          {message}
        </div>
      )}

      {/* CAFE FORM */}
      <section className="bg-white rounded-2xl shadow-sm border border-[#EFE5DB] p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs tracking-widest text-[#A87852] font-semibold">
              CAFE INFORMATION
            </p>

            <h2 className="text-xl font-bold text-[#493629] mt-1">
              {editingId
                ? "แก้ไขข้อมูลคาเฟ่"
                : "เพิ่มคาเฟ่ใหม่"}
            </h2>
          </div>

          <span className="text-3xl">☕</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#493629] mb-1">
              ชื่อคาเฟ่ *
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="ชื่อคาเฟ่"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#493629] mb-1">
              Category ID (ถ้ามี)
            </label>

            <input
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className={inputClass}
              placeholder="UUID ของหมวดหมู่"
            />

            <p className="text-xs text-gray-400 mt-1">
              เว้นว่างได้ หากยังไม่มี Category ID
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#493629] mb-1">
              รายละเอียด
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={inputClass}
              placeholder="รายละเอียดของคาเฟ่"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#493629] mb-1">
              ที่อยู่
            </label>

            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className={inputClass}
              placeholder="ที่อยู่คาเฟ่"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#493629] mb-1">
                ราคาต่ำสุด (บาท)
              </label>

              <input
                type="number"
                min="0"
                name="price_min"
                value={form.price_min}
                onChange={handleChange}
                className={inputClass}
                placeholder="เช่น 50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#493629] mb-1">
                ราคาสูงสุด (บาท)
              </label>

              <input
                type="number"
                min="0"
                name="price_max"
                value={form.price_max}
                onChange={handleChange}
                className={inputClass}
                placeholder="เช่น 200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#493629] mb-1">
              เวลาเปิด–ปิด
            </label>

            <input
              name="opening_hours"
              value={form.opening_hours}
              onChange={handleChange}
              className={inputClass}
              placeholder="เช่น 09:00 - 18:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#493629] mb-1">
              ข้อมูลติดต่อ
            </label>

            <input
              name="contact_info"
              value={form.contact_info}
              onChange={handleChange}
              className={inputClass}
              placeholder="เบอร์โทรศัพท์หรือช่องทางติดต่อ"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#754A30] text-white px-6 py-3 rounded-xl hover:bg-[#493629] disabled:opacity-50"
            >
              {saving
                ? "กำลังบันทึก..."
                : editingId
                ? "บันทึกการแก้ไข"
                : "เพิ่มคาเฟ่"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200"
              >
                ยกเลิก
              </button>
            )}
          </div>
        </form>
      </section>

      {/* CAFE LIST */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="text-xs tracking-widest text-[#A87852] font-semibold">
              CAFE DIRECTORY
            </p>

            <h2 className="text-xl font-bold text-[#493629] mt-1">
              รายการคาเฟ่
            </h2>
          </div>

          <span className="text-sm text-gray-500">
            {cafes.length} รายการ
          </span>
        </div>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหาชื่อคาเฟ่ ที่อยู่ หรือหมวดหมู่..."
          className={`${inputClass} bg-white mb-5`}
        />

        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
            กำลังโหลดข้อมูล...
          </div>
        ) : filteredCafes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
            ไม่พบรายการคาเฟ่
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCafes.map((cafe) => (
              <article
                key={cafe.id}
                className="bg-white rounded-2xl border border-[#EFE5DB] shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-[#493629]">
                    {cafe.name}
                  </h3>

                  {cafe.category_name && (
                    <p className="text-sm text-[#A87852] mt-1">
                      {cafe.category_name}
                    </p>
                  )}

                  <p className="text-sm text-gray-500 mt-2">
                    {cafe.address || "ไม่มีข้อมูลที่อยู่"}
                  </p>

                  {cafe.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {cafe.description}
                    </p>
                  )}

                  {(cafe.price_min != null ||
                    cafe.price_max != null) && (
                    <p className="text-sm text-gray-500 mt-2">
                      ราคา: {cafe.price_min ?? "-"} –{" "}
                      {cafe.price_max ?? "-"} บาท
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-2 break-all">
                    ID: {cafe.id}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(cafe)}
                    className="bg-[#F0E4D8] text-[#754A30] px-4 py-2 rounded-full hover:bg-[#E8DCCF]"
                  >
                    แก้ไข
                  </button>

                  <button
                    type="button"
                    onClick={() => openDeactivateModal(cafe)}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-100"
                  >
                    ปิดใช้งาน
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CONFIRMATION MODAL */}
      {selectedCafe && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#241A15]/60 backdrop-blur-sm p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeactivateModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="deactivate-title"
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-200 animate-[modalIn_0.2s_ease-out]"
          >
            <div className="relative p-7">
              {/* CENTERED TRASH ICON */}
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                  <svg
                    width="29"
                    height="29"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="m19 6-1 14H6L5 6" />
                    <path d="M10 11v5M14 11v5" />
                  </svg>
                </div>
              </div>

              {/* HEADING */}
              <div className="text-center">
                <p className="text-xs tracking-[0.18em] font-semibold text-red-600">
                  CAFE MANAGEMENT
                </p>

                <h2
                  id="deactivate-title"
                  className="text-2xl font-bold text-[#493629] mt-2"
                >
                  ยืนยันปิดใช้งานคาเฟ่?
                </h2>

                <p className="text-sm text-gray-600 mt-3">
                  คุณกำลังจะปิดใช้งานคาเฟ่
                </p>
              </div>

              {/* CAFE INFORMATION */}
              <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
                <p className="font-semibold text-[#493629]">
                  {selectedCafe.name}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {selectedCafe.address || "ไม่มีข้อมูลที่อยู่"}
                </p>
              </div>

              {/* WARNING BOX */}
              <div className="flex gap-3 mt-4 p-3 rounded-xl bg-red-50 border border-red-200">
                <svg
                  className="shrink-0 mt-0.5 text-red-600"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <path d="M10.3 3.9 1.8 18.5a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                </svg>

                <div>
                  <p className="text-sm font-semibold text-red-700">
                    โปรดตรวจสอบก่อนยืนยัน
                  </p>

                  <p className="text-xs text-red-600 mt-1 leading-relaxed">
                    คาเฟ่นี้จะไม่แสดงในรายการคาเฟ่ที่เปิดใช้งานอยู่
                    แต่ข้อมูลเดิมจะยังคงอยู่ในระบบ
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 mt-7">
                <button
                  type="button"
                  onClick={closeDeactivateModal}
                  disabled={deactivating}
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  ยกเลิก
                </button>

                <button
                  type="button"
                  onClick={confirmDeactivate}
                  disabled={deactivating}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 active:bg-red-800 transition disabled:opacity-50"
                >
                  {deactivating
                    ? "กำลังดำเนินการ..."
                    : "ยืนยันปิดใช้งาน"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ANIMATION */}
      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default AdminCafes;