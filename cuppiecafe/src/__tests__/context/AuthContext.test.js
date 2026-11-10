import React from "react";
import {render,screen,fireEvent,waitFor} from "@testing-library/react";
import {AuthProvider,useAuth} from "../../context/AuthContext";
function Consumer(){
 const auth=useAuth();
 return <div>
  <span data-testid="login">{String(auth.isLoggedIn)}</span>
  <span data-testid="admin">{String(auth.isAdmin)}</span>
  <button onClick={()=>auth.logout()}>logout</button>
  <button onClick={()=>auth.login(" user@example.com ","password123").catch(()=>{})}>login</button>
 </div>;
}
beforeEach(()=>{localStorage.clear();global.fetch=jest.fn();});
afterEach(()=>jest.restoreAllMocks());
test("เริ่มต้นเป็น Guest เมื่อไม่มี token",()=>{
 render(<AuthProvider><Consumer/></AuthProvider>);
 expect(screen.getByTestId("login")).toHaveTextContent("false");
 expect(screen.getByTestId("admin")).toHaveTextContent("false");
});
test("logout ล้าง token และข้อมูลสมาชิก",()=>{
 localStorage.setItem("cuppie-token","token");
 localStorage.setItem("cuppie-user",JSON.stringify({name:"Member"}));
 render(<AuthProvider><Consumer/></AuthProvider>);
 fireEvent.click(screen.getByText("logout"));
 expect(localStorage.getItem("cuppie-token")).toBeNull();
 expect(localStorage.getItem("cuppie-user")).toBeNull();
 expect(screen.getByTestId("login")).toHaveTextContent("false");
});
test("login ส่งอีเมลที่ trim แล้ว และเก็บ token เมื่อสำเร็จ",async()=>{
 const payload=btoa(JSON.stringify({sub:"u1",role:"admin"}));
 const token=`x.${payload}.y`;
 global.fetch.mockResolvedValue({ok:true,json:async()=>({token,full_name:"Admin",email:"user@example.com",role:"admin"})});
 render(<AuthProvider><Consumer/></AuthProvider>);
 fireEvent.click(screen.getByText("login"));
 await waitFor(()=>expect(screen.getByTestId("login")).toHaveTextContent("true"));
 expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/auth/login"),expect.objectContaining({method:"POST",body:JSON.stringify({email:"user@example.com",password:"password123"})}));
 expect(localStorage.getItem("cuppie-token")).toBe(token);
 expect(screen.getByTestId("admin")).toHaveTextContent("true");
});
test("login โยน status 401 เมื่อรหัสผ่านไม่ถูกต้อง",async()=>{
 global.fetch.mockResolvedValue({ok:false,status:401,text:async()=>"Unauthorized"});
 function ErrorConsumer(){const {login}=useAuth();return <button onClick={()=>login("a@b.com","bad").catch(e=>document.body.dataset.error=String(e.status))}>login error</button>}
 render(<AuthProvider><ErrorConsumer/></AuthProvider>);
 fireEvent.click(screen.getByText("login error"));
 await waitFor(()=>expect(document.body.dataset.error).toBe("401"));
});
