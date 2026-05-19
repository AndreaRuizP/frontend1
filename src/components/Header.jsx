import logo from "../assets/logo.png";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import DarkMode from "./DarkMode";

export default function UserHeader({ className = "" }) {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <header
      className={`w-full mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-0 bg-white dark:bg-slate-900 border-b border-[#E0E5EB] dark:border-slate-800 text-slate-800 dark:text-slate-100 transition-colors duration-300 ${className}`}
      style={{ minHeight: 48 }}
    >
      <img src={logo} alt="Logo" className="h-8 w-auto" />
      <DarkMode checked={darkMode} onChange={toggleDarkMode} />
    </header>
  );
}
