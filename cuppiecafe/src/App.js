import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import CafeDetail from "./pages/CafeDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import WriteReview from "./pages/WriteReview";

import AdminDashboard from "./pages/AdminDashboard";
import AdminMembers from "./pages/AdminMembers";
import AdminCafes from "./pages/AdminCafes";
import AdminReviews from "./pages/AdminReviews";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cafes" element={<Explore />} />
            <Route path="/cafes/:id" element={<CafeDetail />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cafes/:id/review"
              element={
                <ProtectedRoute>
                  <WriteReview />
                </ProtectedRoute>
              }
            />

            {/* ADMIN ROUTES */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/members"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminMembers />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/cafes"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminCafes />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/reviews"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminReviews />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="*"
              element={
                <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center">
                  <h1 className="text-4xl font-bold text-amber-900">404</h1>
                  <p className="text-gray-600 mt-3">
                    ไม่พบหน้าที่คุณต้องการ
                  </p>
                  <LinkHome />
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

function LinkHome() {
  return (
    <a href="/" className="mt-5 text-amber-900 underline">
      กลับหน้าหลัก
    </a>
  );
}

export default App;