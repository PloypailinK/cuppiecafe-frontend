import React from "react";
import {render,screen,fireEvent} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import Register from "../../pages/Register";
jest.mock("../../components/Navbar",()=>()=> <div>Navbar</div>);
test("แสดงฟอร์มสมัครสมาชิก",()=>{
 render(<MemoryRouter><Register/></MemoryRouter>);
 expect(screen.getByPlaceholderText("กรอกชื่อของคุณ")).toBeInTheDocument();
 expect(screen.getByPlaceholderText("กรอกอีเมลของคุณ")).toBeInTheDocument();
});
test("แจ้งเตือนเมื่อรหัสผ่านไม่ตรงกัน",()=>{
 render(<MemoryRouter><Register/></MemoryRouter>);
 fireEvent.change(screen.getByPlaceholderText("กรอกชื่อของคุณ"),{target:{value:"Test"}});
 fireEvent.change(screen.getByPlaceholderText("กรอกอีเมลของคุณ"),{target:{value:"test@example.com"}});
 fireEvent.change(screen.getByPlaceholderText("อย่างน้อย 8 ตัวอักษร"),{target:{value:"password123"}});
 fireEvent.change(screen.getByPlaceholderText("กรอกรหัสผ่านอีกครั้ง"),{target:{value:"different"}});
 fireEvent.click(screen.getByRole("button",{name:/สมัครสมาชิก/}));
 expect(screen.getByText("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง")).toBeInTheDocument();
});
test("แจ้งเตือนเมื่อรหัสผ่านสั้นกว่า 8 ตัวอักษร",()=>{
 render(<MemoryRouter><Register/></MemoryRouter>);
 fireEvent.change(screen.getByPlaceholderText("อย่างน้อย 8 ตัวอักษร"),{target:{value:"123"}});
 fireEvent.change(screen.getByPlaceholderText("กรอกรหัสผ่านอีกครั้ง"),{target:{value:"123"}});
 fireEvent.click(screen.getByRole("button",{name:/สมัครสมาชิก/}));
 expect(screen.getByText("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")).toBeInTheDocument();
});
