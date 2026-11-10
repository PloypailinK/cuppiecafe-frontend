import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";

jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));
import { useAuth } from "../../context/AuthContext";

function Location() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}
function setup(auth, initial="/") {
  useAuth.mockReturnValue(auth);
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Navbar />
      <Routes>
        <Route path="*" element={<Location />} />
      </Routes>
    </MemoryRouter>
  );
}
test("แสดงเมนูสำหรับ Guest", () => {
  setup({ user:null, isLoggedIn:false, logout:jest.fn() });
  expect(screen.getByText("WELCOME TO CUPPIE")).toBeInTheDocument();
  expect(screen.getByText("เข้าสู่ระบบ")).toBeInTheDocument();
  expect(screen.getByText("สมัครสมาชิก")).toBeInTheDocument();
  expect(screen.queryByText(/รายการโปรด/)).not.toBeInTheDocument();
});
test("แสดงเมนูสมาชิกและออกจากระบบ", () => {
  const logout=jest.fn();
  setup({ user:{name:"Test Member",role:"member"}, isLoggedIn:true, logout });
  expect(screen.getByText(/สวัสดี, Test Member/)).toBeInTheDocument();
  fireEvent.click(screen.getByText("ออกจากระบบ"));
  expect(logout).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId("location")).toHaveTextContent("/");
});
test("แสดงเมนู Admin เมื่อผู้ใช้เป็น admin", () => {
  setup({ user:{name:"Admin",role:"admin"}, isLoggedIn:true, logout:jest.fn() });
  expect(screen.getByText("Admin ⚙")).toBeInTheDocument();
});
