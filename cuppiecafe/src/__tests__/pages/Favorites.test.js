import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Favorites from "../../pages/Favorites";
import { useFavorites } from "../../context/FavoritesContext";

jest.mock("../../components/Navbar", () => () => <nav>Navbar</nav>);
jest.mock("../../context/FavoritesContext", () => ({ useFavorites: jest.fn() }));

function renderPage() {
  return render(<MemoryRouter><Favorites /></MemoryRouter>);
}

beforeEach(() => jest.clearAllMocks());

test("shows empty favorites state and explore link", () => {
  useFavorites.mockReturnValue({ favorites: [], removeFavorite: jest.fn() });
  renderPage();
  expect(screen.getByText("ยังไม่มีคาเฟ่ในรายการโปรด")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /ค้นหาคาเฟ่เลย/ })).toHaveAttribute("href", "/cafes");
});

test("shows favorite cafes", () => {
  useFavorites.mockReturnValue({
    favorites: [{ id: "c1", name: "Morning Cafe", location: "นครปฐม", image_url: "https://example.com/cafe.jpg" }],
    removeFavorite: jest.fn(),
  });
  renderPage();
  expect(screen.getByText("Morning Cafe")).toBeInTheDocument();
  expect(screen.getByText(/1 ร้าน/)).toBeInTheDocument();
});

test("removes a favorite cafe", () => {
  const removeFavorite = jest.fn();
  useFavorites.mockReturnValue({
    favorites: [{ id: "c1", name: "Morning Cafe", location: "นครปฐม", image_url: "https://example.com/cafe.jpg" }],
    removeFavorite,
  });
  renderPage();
  fireEvent.click(screen.getByRole("button", { name: /นำออกจากรายการ/ }));
  expect(removeFavorite).toHaveBeenCalledWith("c1");
});
