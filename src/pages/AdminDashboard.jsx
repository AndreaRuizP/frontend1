import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminStats from "../components/admin/AdminStats";
import UsersList from "../components/admin/UsersList";
import ReportsList from "../components/admin/ReportsList";
import ContainersList from "../components/admin/ContainersList";
import ChallengesList from "../components/admin/ChallengesList";
import ProductsList from "../components/admin/ProductsList";
import { authStorage } from "../utils/security";
import "../assets/logo.png";

const tabs = [
    { id: "overview", label: "Resumen", icon: "bi-bar-chart" },
    { id: "users", label: "Usuarios", icon: "bi-people" },
    { id: "containers", label: "Contenedores", icon: "bi-trash" },
    { id: "challenges", label: "Retos", icon: "bi-trophy" },
    { id: "products", label: "Marketplace", icon: "bi-bag" },
    { id: "reports", label: "Reportes", icon: "bi-flag" },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const navigate = useNavigate();

    const handleLogout = () => {
        authStorage.clear();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <div className="bg-white border-b border-[#E0E5EB] sticky top-0 z-50">
                <div className="flex items-center justify-between py-3 sm:py-4 border-b border-[#E0E5EB] px-4 sm:px-8">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
                            <img src="../src/assets/logo.png" alt="" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-lg sm:text-2xl font-bold text-[#141B21] truncate">CleanPoints</h1>
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#199A61] text-white text-xs font-bold rounded-full shrink-0">
                            ADMIN
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition shrink-0 ml-2"
                    >
                        <i className="bi bi-box-arrow-right"></i>
                        <span className="hidden sm:inline">Cerrar Sesión</span>
                    </button>
                </div>
                <div className="py-3 sm:py-6 px-4 sm:px-8">
                    <h2 className="text-xl sm:text-3xl font-bold text-[#141B21]">Panel de Administración</h2>
                    <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">
                        Gestiona usuarios, contenedores, retos, productos y reportes de CleanPoints
                    </p>
                </div>
                <div
                    className="scrollbar-hide border-t border-[#E0E5EB]"
                    style={{
                        display: 'flex',
                        overflowX: 'scroll',
                        overflowY: 'hidden',
                        WebkitOverflowScrolling: 'touch',
                        touchAction: 'pan-x',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`shrink-0 flex items-center gap-2 px-5 py-3 font-semibold border-b-2 transition whitespace-nowrap text-sm ${
                                activeTab === tab.id
                                    ? "border-[#199A61] text-[#199A61]"
                                    : "border-transparent text-[#6B7280] hover:text-[#141B21]"
                            }`}
                        >
                            <i className={`bi ${tab.icon}`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="w-full px-4 sm:px-8 py-6 sm:py-8">
                {activeTab === "overview" && <AdminStats />}
                {activeTab === "users" && <UsersList />}
                {activeTab === "containers" && <ContainersList />}
                {activeTab === "challenges" && <ChallengesList />}
                {activeTab === "products" && <ProductsList />}
                {activeTab === "reports" && <ReportsList />}
            </main>
        </div>
    );
}
