import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { AuthProvider } from "../../context/AuthContext";
import { FavoritesProvider, useFavorites } from "../../context/FavoritesContext";

function FavoritesProbe() {
  const { favorites, toggleFavorite, isFavorite, removeFavorite } = useFavorites();
  const cafe = { id: "cafe-1", name: "Cuppie Cafe", location: "Nakhon Pathom" };

  return (
    <div>
      <span data-testid="count">{favorites.length}</span>
      <span data-testid="favorite">{String(isFavorite("cafe-1"))}</span>
      <button onClick={() => toggleFavorite(cafe)}>toggle</button>
      <button onClick={() => removeFavorite("cafe-1")}>remove</button>
    </div>
  );
}

function renderFavorites({ loggedIn = true, userId = "member-1" } = {}) {
  localStorage.clear();
  if (loggedIn) {
    const payload = btoa(JSON.stringify({ sub: userId, role: "member" }));
    localStorage.setItem("cuppie-token", `header.${payload}.signature`);
    localStorage.setItem("cuppie-user", JSON.stringify({ id: userId, name: "Test Member", email: `${userId}@example.com` }));
  }

  return render(
    <AuthProvider>
      <FavoritesProvider>
        <FavoritesProbe />
      </FavoritesProvider>
    </AuthProvider>
  );
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});

test("starts with an empty favorites list for a logged-in member", () => {
  renderFavorites();
  expect(screen.getByTestId("count")).toHaveTextContent("0");
  expect(screen.getByTestId("favorite")).toHaveTextContent("false");
});

test("adds a cafe to favorites and saves it for the current member", () => {
  renderFavorites();
  fireEvent.click(screen.getByRole("button", { name: "toggle" }));

  expect(screen.getByTestId("count")).toHaveTextContent("1");
  expect(screen.getByTestId("favorite")).toHaveTextContent("true");
  expect(localStorage.getItem("cuppie-favorites:member-1")).toContain("Cuppie Cafe");
});

test("removes a cafe when its favorite button is toggled again", () => {
  renderFavorites();
  const toggle = screen.getByRole("button", { name: "toggle" });
  fireEvent.click(toggle);
  fireEvent.click(toggle);

  expect(screen.getByTestId("count")).toHaveTextContent("0");
  expect(screen.getByTestId("favorite")).toHaveTextContent("false");
});

test("does not add favorites when the member is logged out", () => {
  renderFavorites({ loggedIn: false });
  fireEvent.click(screen.getByRole("button", { name: "toggle" }));

  expect(screen.getByTestId("count")).toHaveTextContent("0");
  expect(screen.getByTestId("favorite")).toHaveTextContent("false");
});
