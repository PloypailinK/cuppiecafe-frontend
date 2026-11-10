import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminCafes from "../../pages/AdminCafes";
import { useAuth } from "../../context/AuthContext";

jest.mock("../../context/AuthContext", () => ({ useAuth: jest.fn() }));
const cafes = [{ id: "c1", name: "Morning Cafe", address: "นครปฐม", category_name: "Minimal" }];
beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({ token: "admin-token" });
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => cafes });
  window.scrollTo = jest.fn();
});

test("loads cafe list and add form", async () => {
  render(<AdminCafes />);
  expect(await screen.findByText("Morning Cafe")).toBeInTheDocument();
  expect(screen.getByText("เพิ่มคาเฟ่ใหม่")).toBeInTheDocument();
});

test("validates required cafe name", async () => {
  render(<AdminCafes />);
  await screen.findByText("Morning Cafe");
  fireEvent.click(screen.getByRole("button", { name: "เพิ่มคาเฟ่" }));
  expect(screen.getByText("กรุณากรอกชื่อคาเฟ่")).toBeInTheDocument();
});

test("validates minimum and maximum price", async () => {
  render(<AdminCafes />);
  await screen.findByText("Morning Cafe");
  fireEvent.change(screen.getByPlaceholderText("ชื่อคาเฟ่"), { target: { value: "New Cafe" } });
  fireEvent.change(screen.getByPlaceholderText("เช่น 200"), { target: { value: "100" } });
  fireEvent.change(screen.getByPlaceholderText("เช่น 50"), { target: { value: "200" } });
  fireEvent.click(screen.getByRole("button", { name: "เพิ่มคาเฟ่" }));
  expect(screen.getByText("ราคาต่ำสุดต้องไม่มากกว่าราคาสูงสุด")).toBeInTheDocument();
});

test("creates a cafe and refreshes the list", async () => {
  global.fetch
    .mockResolvedValueOnce({ ok: true, json: async () => cafes })
    .mockResolvedValueOnce({ ok: true, text: async () => "" })
    .mockResolvedValueOnce({ ok: true, json: async () => [...cafes, { id: "c2", name: "New Cafe" }] });
  render(<AdminCafes />);
  await screen.findByText("Morning Cafe");
  fireEvent.change(screen.getByPlaceholderText("ชื่อคาเฟ่"), { target: { value: "New Cafe" } });
  fireEvent.click(screen.getByRole("button", { name: "เพิ่มคาเฟ่" }));
  expect(await screen.findByText("เพิ่มคาเฟ่เรียบร้อยแล้ว")).toBeInTheDocument();
  expect(global.fetch.mock.calls[1][1].method).toBe("POST");
});
