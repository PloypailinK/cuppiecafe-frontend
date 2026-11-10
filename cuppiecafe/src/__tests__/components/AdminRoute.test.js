import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import AdminRoute from "../../components/AdminRoute";

function renderAdminRoute({ loggedIn, role }) {
  localStorage.clear();
  if (loggedIn) {
    const payload = btoa(JSON.stringify({ sub: "user-1", role }));
    localStorage.setItem("cuppie-token", `header.${payload}.signature`);
    localStorage.setItem("cuppie-user", JSON.stringify({ id: "user-1", name: "Test User", role }));
  }

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/login" element={<h1>Login page</h1>} />
          <Route path="/" element={<h1>Home page</h1>} />
          <Route path="/admin" element={<AdminRoute><h1>Admin page</h1></AdminRoute>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

afterEach(() => localStorage.clear());

test("redirects logged-out visitors to login", () => {
  renderAdminRoute({ loggedIn: false, role: "member" });
  expect(screen.getByRole("heading", { name: "Login page" })).toBeInTheDocument();
});

test("redirects a logged-in non-admin member to home", () => {
  renderAdminRoute({ loggedIn: true, role: "member" });
  expect(screen.getByRole("heading", { name: "Home page" })).toBeInTheDocument();
});

test("allows an admin to access the admin page", () => {
  renderAdminRoute({ loggedIn: true, role: "admin" });
  expect(screen.getByRole("heading", { name: "Admin page" })).toBeInTheDocument();
});
