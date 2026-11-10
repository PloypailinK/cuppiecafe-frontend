import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminMembers from "../../pages/AdminMembers";
import { useAuth } from "../../context/AuthContext";

jest.mock("../../context/AuthContext", () => ({ useAuth: jest.fn() }));
const members = [
  { id: "m1", full_name: "Test Member", email: "test@example.com", role: "member", is_active: true },
  { id: "m2", full_name: "Inactive Member", email: "off@example.com", role: "member", is_active: false },
];
beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({ token: "admin-token" });
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => members });
});

test("loads member list and active count", async () => {
  render(<AdminMembers />);
  expect(await screen.findByText("Test Member")).toBeInTheDocument();
  expect(screen.getByText("test@example.com")).toBeInTheDocument();
  expect(screen.getByText("จัดการสมาชิก")).toBeInTheDocument();
});

test("filters members by search keyword", async () => {
  render(<AdminMembers />);
  await screen.findByText("Test Member");
  fireEvent.change(screen.getByPlaceholderText("ค้นหาชื่อหรืออีเมลสมาชิก..."), {
    target: { value: "off@" },
  });
  expect(screen.getByText("Inactive Member")).toBeInTheDocument();
  expect(screen.queryByText("Test Member")).not.toBeInTheDocument();
});

test("shows confirmation and deactivates selected member", async () => {
  global.fetch
    .mockResolvedValueOnce({ ok: true, json: async () => members })
    .mockResolvedValueOnce({ ok: true })
    .mockResolvedValueOnce({ ok: true, json: async () => [members[1]] });
  render(<AdminMembers />);
  await screen.findByText("Test Member");
  fireEvent.click(screen.getByRole("button", { name: "ปิดบัญชี" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "ยืนยันปิดใช้งาน" }));
  expect(await screen.findByText("Inactive Member")).toBeInTheDocument();
  expect(global.fetch.mock.calls[1][1].method).toBe("DELETE");
});
