
import { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

const STORAGE_KEY = "cuppie-favorites";

// สร้างข้อความสำหรับเปรียบเทียบชื่อร้านและที่อยู่
function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

// ตรวจสอบว่าคาเฟ่เป็นร้านเดียวกันหรือไม่
function isSameCafe(a, b) {
  const idA = a.id ?? a.fsq_id;
  const idB = b.id ?? b.fsq_id;

  // ถ้ามี ID เดียวกัน ถือว่าเป็นร้านเดียวกัน
  if (
    idA != null &&
    idB != null &&
    String(idA) === String(idB)
  ) {
    return true;
  }

  // เปรียบเทียบชื่อร้านและที่อยู่
  const nameA = normalizeText(a.name);
  const nameB = normalizeText(b.name);

  const addressA = normalizeText(
    a.address || a.location
  );

  const addressB = normalizeText(
    b.address || b.location
  );

  return (
    nameA !== "" &&
    addressA !== "" &&
    nameA === nameB &&
    addressA === addressB
  );
}

// ลบรายการคาเฟ่ที่ซ้ำกัน
function removeDuplicateFavorites(items) {
  const unique = [];

  items.forEach((cafe) => {
    const exists = unique.some((item) =>
      isSameCafe(item, cafe)
    );

    if (!exists) {
      unique.push(cafe);
    }
  });

  return unique;
}

// โหลดข้อมูลและล้างรายการซ้ำเดิม
function loadFavorites() {
  try {
    const savedFavorites = localStorage.getItem(STORAGE_KEY);

    if (!savedFavorites) {
      return [];
    }

    const parsed = JSON.parse(savedFavorites);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const cleaned = removeDuplicateFavorites(parsed);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(cleaned)
    );

    return cleaned;
  } catch (error) {
    console.error("Load favorites error:", error);
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites);

  const saveFavorites = (updated) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error("Save favorites error:", error);
    }
  };

  const toggleFavorite = (cafe) => {
    setFavorites((prev) => {
      const exists = prev.some((item) =>
        isSameCafe(item, cafe)
      );

      const updated = exists
        ? prev.filter(
            (item) => !isSameCafe(item, cafe)
          )
        : removeDuplicateFavorites([
            ...prev,
            {
              ...cafe,
              id: cafe.id ?? cafe.fsq_id,
              image_url:
                cafe.image_url ||
                cafe.image ||
                null,
              location:
                cafe.location ||
                cafe.address ||
                "ไม่ระบุที่อยู่",
            },
          ]);

      saveFavorites(updated);

      return updated;
    });
  };

  const isFavorite = (cafeOrId) =>
    favorites.some((item) => {
      if (
        typeof cafeOrId === "object" &&
        cafeOrId !== null
      ) {
        return isSameCafe(item, cafeOrId);
      }

      return (
        String(item.id) === String(cafeOrId) ||
        String(item.fsq_id) === String(cafeOrId)
      );
    });

  const removeFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.filter(
        (item) =>
          String(item.id) !== String(id) &&
          String(item.fsq_id) !== String(id)
      );

      saveFavorites(updated);

      return updated;
    });
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
