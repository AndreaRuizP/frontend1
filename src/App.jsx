import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";

const Home           = lazy(() => import("./pages/Home"));
const Login          = lazy(() => import("./auth/Login"));
const Registre       = lazy(() => import("./auth/Register"));
const DashboardHome  = lazy(() => import("./pages/DashboardHome"));
const Map            = lazy(() => import("./pages/Map"));
const Challenge      = lazy(() => import("./pages/Challenge"));
const Marketplace    = lazy(() => import("./pages/Marketplace"));
const ScanQR         = lazy(() => import("./pages/ScanQR"));
const CapturePhoto   = lazy(() => import("./pages/CapturePhoto"));
const Profile        = lazy(() => import("./pages/Profile"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/register"      element={<Registre />} />
        <Route path="/dashboard"     element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
        <Route path="/map"           element={<ProtectedRoute><Map /></ProtectedRoute>} />
        <Route path="/retos"         element={<ProtectedRoute><Challenge /></ProtectedRoute>} />
        <Route path="/marketplace"   element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/scan"          element={<ProtectedRoute><ScanQR /></ProtectedRoute>} />
        <Route path="/capture-photo" element={<ProtectedRoute><CapturePhoto /></ProtectedRoute>} />
        <Route path="/profile"       element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin"         element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="*"              element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </Suspense>
  );
}

export default App;
