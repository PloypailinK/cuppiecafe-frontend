import React from "react";
import {render,screen,fireEvent} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import Login from "../../pages/Login";
jest.mock("../../components/Navbar",()=>()=> <div>Navbar</div>);
jest.mock("../../context/AuthContext",()=>({useAuth:jest.fn()}));
import {useAuth} from "../../context/AuthContext";
beforeEach(()=>{useAuth.mockReturnValue({isLoggedIn:false,login:jest.fn()});});
test("แสดงฟอร์มเข้าสู่ระบบ",()=>{
 render(<MemoryRouter><Login/></MemoryRouter>);
 expect(screen.getByPlaceholderText("กรอกอีเมลของคุณ")).toBeInTheDocument();
 expect(screen.getByPlaceholderText("กรอกรหัสผ่าน")).toBeInTheDocument();
});
test("แสดงข้อความเมื่อ login ไม่สำเร็จด้วย 401",async()=>{
 const login=jest.fn().mockRejectedValue(Object.assign(new Error("Invalid"),{status:401}));
 useAuth.mockReturnValue({isLoggedIn:false,login});
 render(<MemoryRouter><Login/></MemoryRouter>);
 fireEvent.change(screen.getByPlaceholderText("กรอกอีเมลของคุณ"),{target:{value:"bad@example.com"}});
 fireEvent.change(screen.getByPlaceholderText("กรอกรหัสผ่าน"),{target:{value:"wrong"}});
 fireEvent.click(screen.getByRole("button",{name:/เข้าสู่ระบบ/}));
 expect(await screen.findByText("อีเมลหรือรหัสผ่านไม่ถูกต้อง")).toBeInTheDocument();
});
