import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { to: "/dashboard",   label: "Home",        icon: "fi fi-rr-home text-emerald-600 dark:text-emerald-400"          },
    { to: "/map",         label: "Mapa",        icon: "fi fi-rr-map-marker text-emerald-600 dark:text-emerald-400"    },
    { to: "/retos",       label: "Retos",       icon: "fi fi-rr-flame text-emerald-600 dark:text-emerald-400"         },
    { to: "/marketplace", label: "Marketplace", icon: "fi fi-rr-shopping-cart text-emerald-600 dark:text-emerald-400" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-[#E0E5EB] dark:border-slate-800 h-screen fixed left-0 top-0 pt-6 px-6 transition-colors duration-300">

      <div className="flex items-center gap-2 mb-8 pb-6 border-b border-[#E0E5EB] dark:border-slate-800">
        <img src={logo} alt="Logo CleanPoints" className="h-8" />
        <span className="font-bold text-xl text-[#141B21] dark:text-slate-100">CleanPoints</span>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base transition ${
              isActive(link.to)
                ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                : "text-[#141B21] dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60"
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
