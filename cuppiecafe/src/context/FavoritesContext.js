
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

const STORAGE_PREFIX = "cuppie-favorites";

// สร้าง Key แยกตามบัญชี
function getStorageKey(user) {
  if (!user) return null;

  const accountId = user.id || user.email;

  if (!accountId) return null;

  return `${STORAGE_PREFIX}:${encodeURIComponent(
    String(accountId).toLowerCase()
  )}`;
}

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

  if (
    idA != null &&
    idB != null &&
    String(idA) === String(idB)
  ) {
    return true;
  }

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

// โหลด Favorites ของสมาชิก
function loadFavorites(storageKey) {
  if (!storageKey) return [];

  try {
    const savedFavorites = localStorage.getItem(storageKey);

    if (!savedFavorites) {
      return [];
    }

    const parsed = JSON.parse(savedFavorites);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const cleaned = removeDuplicateFavorites(parsed);

    localStorage.setItem(
      storageKey,
      JSON.stringify(cleaned)
    );

    return cleaned;
  } catch (error) {
    console.error("Load favorites error:", error);
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const { user, isLoggedIn } = useAuth();

  const [favorites, setFavorites] = useState([]);

  const storageKey = isLoggedIn
    ? getStorageKey(user)
    : null;

  // โหลด Favorites เมื่อเปลี่ยนบัญชีหรือ Login
  useEffect(() => {
    if (!storageKey) {
      setFavorites([]);
      return;
    }

    setFavorites(loadFavorites(storageKey));
  }, [storageKey]);

  // บันทึก Favorites ของบัญชีปัจจุบัน
  const saveFavorites = (updated) => {
    if (!storageKey) return;

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error("Save favorites error:", error);
    }
  };

  // เพิ่มหรือนำร้านออกจากรายการโปรด
  const toggleFavorite = (cafe) => {
    if (!isLoggedIn || !storageKey || !cafe) {
      return;
    }

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

  // ตรวจสอบว่าร้านอยู่ในรายการโปรดหรือไม่
  const isFavorite = (cafeOrId) => {
    if (!isLoggedIn) return false;

    return favorites.some((item) => {
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
  };

  // ลบรายการโปรด
  const removeFavorite = (id) => {
    if (!isLoggedIn || !storageKey) return;

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
        favorites: isLoggedIn ? favorites : [],
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
