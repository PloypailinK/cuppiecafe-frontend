import React from "react";
import {render,screen,fireEvent} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
jest.mock("../../context/AuthContext",()=>({useAuth:jest.fn()}));
import {useAuth} from "../../context/AuthContext";
test("แสดงเมนูจัดการและชื่อผู้ดูแล",()=>{
 useAuth.mockReturnValue({user:{name:"Admin User"},logout:jest.fn()});
 render(<MemoryRouter><AdminLayout><h1>เนื้อหาหน้า Admin</h1></AdminLayout></MemoryRouter>);
 expect(screen.getAllByText("Admin User").length).toBeGreaterThan(0);
 expect(screen.getByText("จัดการสมาชิก")).toBeInTheDocument();
 expect(screen.getByText("จัดการคาเฟ่")).toBeInTheDocument();
 expect(screen.getByText("จัดการรีวิว")).toBeInTheDocument();
 expect(screen.getByText("เนื้อหาหน้า Admin")).toBeInTheDocument();
});
test("เรียก logout เมื่อกดออกจากระบบ",()=>{
 const logout=jest.fn();
 useAuth.mockReturnValue({user:{name:"Admin"},logout});
 render(<MemoryRouter><AdminLayout><div>content</div></AdminLayout></MemoryRouter>);
 fireEvent.click(screen.getByRole("button",{name:"ออกจากระบบ"}));
 expect(logout).toHaveBeenCalledTimes(1);
});
