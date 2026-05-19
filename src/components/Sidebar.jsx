import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Home", icon: "fi fi-rr-home text-green-600" },
    { to: "/map", label: "Mapa", icon: "fi fi-rr-map-marker text-green-600" },
    { to: "/retos", label: "Retos", icon: "fi fi-rr-flame text-green-600" },
    { to: "/marketplace", label: "Marketplace", icon: "fi fi-rr-shopping-cart text-green-600" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E0E5EB] h-screen fixed left-0 top-0 pt-6 px-6">
      <div className="flex items-center gap-2 mb-8 pb-6 border-b border-[#E0E5EB]">
        <img src={logo} alt="Logo CleanPoints" className="h-8" />
        <span className="font-bold text-xl text-[#141B21]">CleanPoints</span>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base transition ${
              isActive(link.to)
                ? "bg-emerald-50 text-emerald-700"
                : "text-[#141B21] hover:bg-gray-50"
            }`}
          >
            <i className={link.icon + " text-lg"}></i>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
