import React from "react";
import {render,screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import AdminDashboard from "../../pages/AdminDashboard";
jest.mock("../../context/AuthContext",()=>({useAuth:()=>({user:{name:"Admin User"}})}));
test("แสดงข้อมูลต้อนรับและเมนูจัดการหลัก",()=>{
 render(<MemoryRouter><AdminDashboard/></MemoryRouter>);
 expect(screen.getByText(/Admin User/)).toBeInTheDocument();
 expect(screen.getByText("จัดการสมาชิก")).toBeInTheDocument();
 expect(screen.getByText("จัดการคาเฟ่")).toBeInTheDocument();
 expect(screen.getByText("จัดการรีวิว")).toBeInTheDocument();
});
