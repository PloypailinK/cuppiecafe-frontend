import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";

function renderProtectedRoute(loggedIn) {
  localStorage.clear();
  if (loggedIn) {
    const payload = btoa(JSON.stringify({ sub: "member-1", role: "member" }));
    localStorage.setItem("cuppie-token", `header.${payload}.signature`);
    localStorage.setItem("cuppie-user", JSON.stringify({ id: "member-1", name: "Test Member" }));
  }

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/favorites"]}>
        <Routes>
          <Route path="/login" element={<h1>Login page</h1>} />
          <Route path="/favorites" element={<ProtectedRoute><h1>Favorites page</h1></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

afterEach(() => localStorage.clear());

test("redirects logged-out visitors to the login page", () => {
  renderProtectedRoute(false);
  expect(screen.getByRole("heading", { name: "Login page" })).toBeInTheDocument();
});

test("allows logged-in members to access a protected page", () => {
  renderProtectedRoute(true);
  expect(screen.getByRole("heading", { name: "Favorites page" })).toBeInTheDocument();
});
