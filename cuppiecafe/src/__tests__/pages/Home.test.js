import React from "react";
import {render,screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import Home from "../../pages/Home";
jest.mock("../../components/Navbar",()=>()=> <div>Navbar</div>);
jest.mock("../../components/CafeCard",()=>({cafe})=><div>{cafe.name}</div>);
beforeEach(()=>{global.fetch=jest.fn();});
afterEach(()=>jest.restoreAllMocks());
test("แสดงหน้าแรกและโหลดข้อมูลคาเฟ่",async()=>{
 global.fetch.mockResolvedValue({ok:true,json:async()=>[{id:"c1",name:"Cuppie Test Cafe"}]});
 render(<MemoryRouter><Home/></MemoryRouter>);
 expect(screen.getByText(/Find your/)).toBeInTheDocument();
 expect(await screen.findByText("Cuppie Test Cafe")).toBeInTheDocument();
});
test("แสดงข้อผิดพลาดเมื่อ API ไม่สำเร็จ",async()=>{
 global.fetch.mockResolvedValue({ok:false});
 render(<MemoryRouter><Home/></MemoryRouter>);
 expect(await screen.findByText(/ไม่สามารถโหลดข้อมูลคาเฟ่ได้/)).toBeInTheDocument();
});
