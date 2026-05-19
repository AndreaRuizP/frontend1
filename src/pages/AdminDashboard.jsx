import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminStats from "../components/admin/AdminStats";
import UsersList from "../components/admin/UsersList";
import ReportsList from "../components/admin/ReportsList";
import ContainersList from "../components/admin/ContainersList";
import ChallengesList from "../components/admin/ChallengesList";
import ProductsList from "../components/admin/ProductsList";
import { authStorage } from "../utils/security";
import logo from "../assets/logo.png";

const tabs = [
    { id: "overview",    label: "Resumen",      icon: "bi-bar-chart",  iconActive: "bi-bar-chart-fill" },
    { id: "users",       label: "Usuarios",     icon: "bi-people",     iconActive: "bi-people-fill" },
    { id: "containers",  label: "Contenedores", icon: "bi-trash",      iconActive: "bi-trash-fill" },
    { id: "challenges",  label: "Retos",        icon: "bi-trophy",     iconActive: "bi-trophy-fill" },
    { id: "products",    label: "Marketplace",  icon: "bi-bag",        iconActive: "bi-bag-fill" },
    { id: "reports",     label: "Reportes",     icon: "bi-flag",       iconActive: "bi-flag-fill" },
];

const tabContent = {
    overview:   AdminStats,
    users:      UsersList,
    containers: ContainersList,
    challenges: ChallengesList,
    products:   ProductsList,
    reports:    ReportsList,
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [prevTab, setPrevTab]     = useState(null);
    const [animating, setAnimating] = useState(false);
    const navigate   = useNavigate();
    const topNavRef  = useRef(null);

    const handleLogout = () => {
        authStorage.clear();
        navigate("/login");
    };

    const changeTab = (id) => {
        if (id === activeTab || animating) return;
        setPrevTab(activeTab);
        setAnimating(true);
        setActiveTab(id);
    };

    useEffect(() => {
        if (!animating) return;
        const t = setTimeout(() => setAnimating(false), 260);
        return () => clearTimeout(t);
    }, [animating]);

    useEffect(() => {
        if (!topNavRef.current) return;
        const btn = topNavRef.current.querySelector(`[data-tab="${activeTab}"]`);
        if (btn) btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }, [activeTab]);

    const ActiveComponent = tabContent[activeTab];

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <div className="bg-white border-b border-[#E0E5EB] sticky top-0 z-50">
                <div className="flex items-center justify-between py-3 sm:py-4 border-b border-[#E0E5EB] px-4 sm:px-8">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
                            <img src={logo} alt="Logo CleanPoints" className="w-full h-full object-contain" />
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

                {/* Title row */}
                <div className="py-3 sm:py-6 px-4 sm:px-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl sm:text-3xl font-bold text-[#141B21]">Panel de Administración</h2>
                        <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">
                            Gestiona usuarios, contenedores, retos, productos y reportes de CleanPoints
                        </p>
                    </div>
                    {/* Mobile: current section label */}
                    <span className="sm:hidden text-xs font-semibold text-[#199A61] bg-green-50 px-2 py-1 rounded-full">
                        {tabs.find(t => t.id === activeTab)?.label}
                    </span>
                </div>

                {/* ── Top horizontal tabs (desktop + tablet) ── */}
                <div
                    ref={topNavRef}
                    className="border-t border-[#E0E5EB] hidden sm:flex"
                    style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            data-tab={tab.id}
                            onClick={() => changeTab(tab.id)}
                            className={`shrink-0 flex items-center gap-2 px-5 py-3 font-semibold border-b-2 transition whitespace-nowrap text-sm ${
                                activeTab === tab.id
                                    ? "border-[#199A61] text-[#199A61]"
                                    : "border-transparent text-[#6B7280] hover:text-[#141B21]"
                            }`}
                        >
                            <i className={`bi ${activeTab === tab.id ? tab.iconActive : tab.icon}`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Mobile scrollable pill tabs ── */}
                <div
                    ref={topNavRef}
                    className="sm:hidden border-t border-[#E0E5EB] flex gap-2 px-3 py-2"
                    style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
                >
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            data-tab={tab.id}
                            onClick={() => changeTab(tab.id)}
                            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                                activeTab === tab.id
                                    ? "bg-[#199A61] text-white shadow-md scale-105"
                                    : "bg-gray-100 text-[#6B7280]"
                            }`}
                        >
                            <i className={`bi ${activeTab === tab.id ? tab.iconActive : tab.icon}`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Main content with fade transition ── */}
            <main
                className="w-full px-4 sm:px-8 py-6 sm:py-8 pb-24 sm:pb-8"
                style={{
                    animation: animating ? "fadeSlideIn 0.26s ease" : "none",
                }}
            >
                <ActiveComponent />
            </main>

            {/* ── Bottom nav bar (mobile only) ── */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E0E5EB] shadow-lg">
                <div className="flex">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => changeTab(tab.id)}
                            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all duration-200 relative ${
                                activeTab === tab.id ? "text-[#199A61]" : "text-[#9CA3AF]"
                            }`}
                        >
                            {/* Active indicator dot */}
                            {activeTab === tab.id && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#199A61] rounded-b-full" />
                            )}
                            <i
                                className={`bi ${activeTab === tab.id ? tab.iconActive : tab.icon} text-lg leading-none transition-transform duration-200 ${
                                    activeTab === tab.id ? "scale-110" : "scale-100"
                                }`}
                            />
                            <span className="text-[9px] font-semibold leading-none">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Keyframe for content transition */}
            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}
