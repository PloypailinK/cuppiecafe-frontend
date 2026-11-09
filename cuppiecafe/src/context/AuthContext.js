
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const API_URL = (
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8080"
).replace(/\/+$/, "");

// อ่านข้อมูลจาก JWT
function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// สร้าง Error พร้อม HTTP Status
function createLoginError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("cuppie-token")
  );

  const [user, setUser] = useState(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem("cuppie-user")
      );

      const savedToken = localStorage.getItem("cuppie-token");
      const claims = savedToken ? decodeToken(savedToken) : null;

      if (!savedUser || !claims) return null;

      return {
        ...savedUser,
        id: claims.sub,
        role: claims.role,
      };
    } catch {
      return null;
    }
  });

  // Login
  const login = async (email, password) => {
    let response;

    try {
      response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });
    } catch (err) {
      throw err;
    }

    if (!response.ok) {
      const message = await response.text();

      // รหัสผ่านผิด หรือไม่พบอีเมล
      if (response.status === 401) {
        throw createLoginError(
          401,
          "Invalid email or password"
        );
      }

      // บัญชีถูกปิดใช้งานจริง
      if (response.status === 403) {
        throw createLoginError(
          403,
          "Account is deactivated"
        );
      }

      throw createLoginError(
        response.status,
        message || "Login failed"
      );
    }

    const data = await response.json();

    if (!data.token) {
      throw new Error("ไม่พบ Token จากเซิร์ฟเวอร์");
    }

    const claims = decodeToken(data.token);

    if (!claims) {
      throw new Error("Token ไม่ถูกต้อง");
    }

    // ข้อมูลสมาชิก
    const userData = {
      id: claims.sub,
      name: data.full_name || "สมาชิก",
      email: data.email || email.trim().toLowerCase(),
      role: data.role || claims.role,
    };

    // บันทึกข้อมูล
    localStorage.setItem("cuppie-token", data.token);
    localStorage.setItem(
      "cuppie-user",
      JSON.stringify(userData)
    );

    setToken(data.token);
    setUser(userData);

    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("cuppie-token");
    localStorage.removeItem("cuppie-user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: Boolean(token && user),
        isAdmin: user?.role === "admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
