import React from "react";
import {render,screen,fireEvent,waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import Explore from "../../pages/Explore";
jest.mock("../../components/Navbar",()=>()=> <div>Navbar</div>);
jest.mock("../../components/CafeCard",()=>({cafe})=><div data-testid="cafe-card">{cafe.name}</div>);
beforeEach(()=>{global.fetch=jest.fn();});
afterEach(()=>jest.restoreAllMocks());
test("โหลดและแสดงรายการคาเฟ่จาก API",async()=>{
 global.fetch.mockResolvedValue({ok:true,json:async()=>[{id:"1",name:"Minimal Cafe",address:"Bangkok"}]});
 render(<MemoryRouter><Explore/></MemoryRouter>);
 expect(await screen.findByText("Minimal Cafe")).toBeInTheDocument();
 expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/foursquare/cafes?query=coffee"));
});
test("ค้นหาคาเฟ่จากชื่อร้าน",async()=>{
 global.fetch.mockResolvedValue({ok:true,json:async()=>[{id:"1",name:"Minimal Cafe"},{id:"2",name:"Nature House"}]});
 render(<MemoryRouter><Explore/></MemoryRouter>);
 await screen.findByText("Minimal Cafe");
 fireEvent.change(screen.getByPlaceholderText("ค้นหาชื่อคาเฟ่หรือสถานที่..."),{target:{value:"Nature"}});
 expect(screen.getByText("Nature House")).toBeInTheDocument();
 expect(screen.queryByText("Minimal Cafe")).not.toBeInTheDocument();
});
test("แสดงข้อความเมื่อโหลดข้อมูลคาเฟ่ไม่สำเร็จ", async () => {
  global.fetch.mockResolvedValue({ ok: false });

  render(<MemoryRouter><Explore /></MemoryRouter>);

  expect(await screen.findByText("โหลดข้อมูลไม่สำเร็จ"))
    .toBeInTheDocument();
});