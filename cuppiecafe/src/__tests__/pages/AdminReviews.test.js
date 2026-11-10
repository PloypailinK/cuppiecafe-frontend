import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminReviews from "../../pages/AdminReviews";
import { useAuth } from "../../context/AuthContext";

jest.mock("../../context/AuthContext", () => ({ useAuth: jest.fn() }));
const reviews = [{
  id: "r1", member_name: "Test Member", cafe_name: "Morning Cafe",
  rating: 5, comment: "กาแฟอร่อย",
}];
beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({ token: "admin-token" });
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => reviews });
});

test("loads reviews and displays review information", async () => {
  render(<AdminReviews />);
  expect(await screen.findByText("Test Member")).toBeInTheDocument();
  expect(screen.getByText("Morning Cafe")).toBeInTheDocument();
  expect(screen.getByText("★ 5/5")).toBeInTheDocument();
});

test("filters reviews by cafe or comment", async () => {
  render(<AdminReviews />);
  await screen.findByText("กาแฟอร่อย");
  fireEvent.change(screen.getByPlaceholderText("ค้นหารีวิว ชื่อสมาชิก หรือชื่อคาเฟ่..."), {
    target: { value: "Morning" },
  });
  expect(screen.getByText("Morning Cafe")).toBeInTheDocument();
  expect(screen.getAllByText("1", { selector: "p" })).toHaveLength(2);
});

test("deletes review after confirmation", async () => {
  global.fetch
    .mockResolvedValueOnce({ ok: true, json: async () => reviews })
    .mockResolvedValueOnce({ ok: true });
  render(<AdminReviews />);
  await screen.findByText("กาแฟอร่อย");
  fireEvent.click(screen.getByRole("button", { name: "ลบรีวิว" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "ยืนยันลบรีวิว" }));
  expect(await screen.findByText("ไม่พบข้อมูลรีวิว")).toBeInTheDocument();
  expect(global.fetch.mock.calls[1][1].method).toBe("DELETE");
});
