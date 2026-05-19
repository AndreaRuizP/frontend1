import logo from "../assets/logo.png";
import DarkMode from "./DarkMode";
import { useState } from "react";

export default function Header({
    showDarkMode = true,
  }) {

  const [darkMode, setDarkMode] = useState(false);

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-[0_1px_0_#EDF7F2]">
      <button className="ml-3">
        <img src={logo} alt="Logo" className="h-8" />
      </button>
      <button className="mr-3">
        <i className="bi bi-sun text-2xl"></i>
      </button>
    </header>
  );
}
