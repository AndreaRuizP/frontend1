import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header"
import Home from "./pages/Home";
import DashboardHome from "./pages/DashboardHome";
import Login from "./auth/Login";
import Registre from "./auth/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./components/Footer";
import Map from "./pages/Map";
import Challenge from "./pages/Challenge";
import Marketplace from "./pages/Marketplace";
import DarkMode from "./components/DarkMode";
import ScanQR from "./pages/ScanQR";
import Profile from "./pages/Profile";
import CapturePhoto from "./pages/CapturePhoto";

function App() {
  const location = useLocation();
  const hideFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registre />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><Map /></ProtectedRoute>} />
        <Route path="/retos" element={<ProtectedRoute><Challenge /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/scan" element={<ProtectedRoute><ScanQR /></ProtectedRoute>} />
        <Route path="/capture-photo" element={<ProtectedRoute><CapturePhoto /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </>
  );
}

export default App;