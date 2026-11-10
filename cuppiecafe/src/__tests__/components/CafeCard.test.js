import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CafeCard from "../../components/CafeCard";
jest.mock("../../context/FavoritesContext",()=>({useFavorites:jest.fn()}));
jest.mock("../../context/AuthContext",()=>({useAuth:jest.fn()}));
import {useFavorites} from "../../context/FavoritesContext";
import {useAuth} from "../../context/AuthContext";
const cafe={id:"c1",name:"Cafe Test",category:"Coffee Shop",location:"Bangkok",rating:4.5,price:"฿"};
function setup({logged=true,favorite=false}={}) {
 const toggleFavorite=jest.fn();
 useFavorites.mockReturnValue({toggleFavorite,isFavorite:()=>favorite});
 useAuth.mockReturnValue({isLoggedIn:logged});
 const navigate=jest.fn();
 return {toggleFavorite,navigate,...render(<MemoryRouter><CafeCard cafe={cafe}/></MemoryRouter>)};
}
test("แสดงชื่อร้าน ที่อยู่ และคะแนน",()=>{
 setup();
 expect(screen.getByText("Cafe Test")).toBeInTheDocument();
 expect(screen.getByText(/Bangkok/)).toBeInTheDocument();
 expect(screen.getByText(/4.5/)).toBeInTheDocument();
});
test("แสดงปุ่มเพิ่มรายการโปรดเมื่อยังไม่ Favorite",()=>{
 setup();
 expect(screen.getByRole("button",{name:"เพิ่มในรายการโปรด"})).toBeInTheDocument();
});
test("แสดงปุ่มนำออกเมื่อเป็น Favorite",()=>{
 setup({favorite:true});
 expect(screen.getByRole("button",{name:"นำออกจากรายการโปรด"})).toBeInTheDocument();
});
test("ลิงก์ไปหน้ารายละเอียดของคาเฟ่",()=>{
 setup();
 expect(screen.getByRole("link",{name:/ดูรายละเอียด/})).toHaveAttribute("href","/cafes/c1");
});
