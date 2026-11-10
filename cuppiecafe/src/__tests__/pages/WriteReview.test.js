import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import WriteReview from "../../pages/WriteReview";
import { useAuth } from "../../context/AuthContext";

jest.mock("../../components/Navbar", () => () => <nav>Navbar</nav>);
jest.mock("../../context/AuthContext", () => ({ useAuth: jest.fn() }));

const cafe = { id: "cafe-1", name: "Morning Cafe", address: "นครปฐม" };
function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/cafes/cafe-1/review"]}>
      <Routes><Route path="/cafes/:id/review" element={<WriteReview />} /></Routes>
    </MemoryRouter>
  );
}
beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({ token: "test-token" });
  global.fetch = jest.fn().mockResolvedValue({
    ok: true, status: 200, json: async () => [cafe],
  });
});

test("loads cafe and displays review form", async () => {
  renderPage();
  expect(await screen.findByText("ร้าน Morning Cafe")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("เล่าประสบการณ์ของคุณที่ร้านนี้...")).toBeInTheDocument();
});

test("requires a rating before submitting", async () => {
  renderPage();
  fireEvent.change(await screen.findByPlaceholderText("เล่าประสบการณ์ของคุณที่ร้านนี้..."), {
    target: { value: "กาแฟดีมาก" },
  });
  fireEvent.click(screen.getByRole("button", { name: "ส่งรีวิว" }));
  expect(await screen.findByText("กรุณาเลือกคะแนน")).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test("requires review text before submitting", async () => {
  renderPage();
  fireEvent.click(await screen.findByRole("button", { name: "ให้ 5 คะแนน" }));
  fireEvent.click(screen.getByRole("button", { name: "ส่งรีวิว" }));
  expect(await screen.findByText("กรุณาเขียนรีวิวก่อนส่ง")).toBeInTheDocument();
});

test("submits review and shows success state", async () => {
  global.fetch
    .mockResolvedValueOnce({ ok: true, json: async () => [cafe] })
    .mockResolvedValueOnce({ ok: true, status: 201, text: async () => "" });
  renderPage();
  fireEvent.click(await screen.findByRole("button", { name: "ให้ 5 คะแนน" }));
  fireEvent.change(screen.getByPlaceholderText("เล่าประสบการณ์ของคุณที่ร้านนี้..."), {
    target: { value: "  กาแฟดีมาก  " },
  });
  fireEvent.click(screen.getByRole("button", { name: "ส่งรีวิว" }));
  expect(await screen.findByText("ส่งรีวิวเรียบร้อยแล้ว")).toBeInTheDocument();
  const body = JSON.parse(global.fetch.mock.calls[1][1].body);
  expect(body).toEqual({ cafe_id: "cafe-1", rating: 5, comment: "กาแฟดีมาก" });
});
