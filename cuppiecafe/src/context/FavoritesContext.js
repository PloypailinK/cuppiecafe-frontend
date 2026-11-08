
import { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("cuppie-favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const toggleFavorite = (cafe) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === cafe.id);

      const updated = exists
        ? prev.filter((item) => item.id !== cafe.id)
        : [...prev, cafe];

      localStorage.setItem("cuppie-favorites", JSON.stringify(updated));

      return updated;
    });
  };

  const isFavorite = (id) =>
    favorites.some((item) => item.id === id);

  const removeFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.filter((item) => item.id !== id);

      localStorage.setItem("cuppie-favorites", JSON.stringify(updated));

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
