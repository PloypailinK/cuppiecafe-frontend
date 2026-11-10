import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CafeDetail from "../../pages/CafeDetail";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";

jest.mock("../../components/Navbar", () => () => <nav>Navbar</nav>);
jest.mock("../../context/FavoritesContext", () => ({ useFavorites: jest.fn() }));
jest.mock("../../context/AuthContext", () => ({ useAuth: jest.fn() }));

const cafe = {
  id: "cafe-1",
  name: "Cuppie Test Cafe",
  address: "Nakhon Pathom",
  description: "กาแฟหอม",
  rating: 4.5,
  price: "฿100-200",
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/cafes/cafe-1"]}>
      <Routes><Route path="/cafes/:id" element={<CafeDetail />} /></Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn().mockResolvedValue({
    ok: true, status: 200, json: async () => cafe,
  });
  useFavorites.mockReturnValue({
    toggleFavorite: jest.fn(),
    isFavorite: jest.fn(() => false),
  });
  useAuth.mockReturnValue({ isLoggedIn: true });
});

test("loads and displays cafe details", async () => {
  renderPage();
  expect(await screen.findByText("Cuppie Test Cafe")).toBeInTheDocument();
  expect(screen.getByText("Nakhon Pathom")).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/cafes/cafe-1"));
});

test("shows not found state when API returns 404", async () => {
  global.fetch.mockResolvedValueOnce({ ok: false, status: 404 });
  renderPage();
  expect(await screen.findByText("ไม่พบข้อมูลคาเฟ่")).toBeInTheDocument();
});

test("adds cafe to favorites when favorite button is clicked", async () => {
  const toggleFavorite = jest.fn();
  useFavorites.mockReturnValue({ toggleFavorite, isFavorite: () => false });
  renderPage();
  fireEvent.click(await screen.findByRole("button", { name: /เพิ่มในรายการโปรด/ }));
  expect(toggleFavorite).toHaveBeenCalledWith(expect.objectContaining({ id: "cafe-1" }));
});
