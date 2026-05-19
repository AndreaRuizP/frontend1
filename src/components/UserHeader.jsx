import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DarkMode from "./DarkMode";
import NotificationBell from "./NotificationBell";

export default function UserHeader({
  onMenu,
  onBell,
  showMenu = true,
  showDarkMode = true,
  showBell = true,
  showUser = true,
  className = "",
}) {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  return (
    <header
      className={`w-full mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-0 ${className}`}
      style={{ minHeight: 48 }}
    >
      {showMenu ? (
        <button
          aria-label="Menú"
          onClick={onMenu}
          className="flex items-center justify-center p-0 m-0 w-11 h-11"
          style={{ minWidth: 44, minHeight: 44 }}
        >
          <i className="fi fi-rr-menu-burger text-xl leading-none block"></i>
        </button>
      ) : (
        <div style={{ minWidth: 44, minHeight: 44 }} />
      )}

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          aria-label="Modo claro"
          className="flex items-center justify-center bg-transparent border-0 p-0 m-0 w-11 h-11 leading-none"
          style={{ minWidth: 44, minHeight: 44 }}
        >
          <i className="bi bi-sun text-2xl leading-none block"></i>
        </button>

        {showBell && (
          <div onClick={(e) => e.stopPropagation()} className="w-11 h-11 flex items-center justify-center">
            <NotificationBell onBell={onBell} />
          </div>
        )}

        {showUser && (
          <button
            aria-label="Cuenta"
            onClick={() => navigate("/profile")}
            className="flex items-center justify-center bg-transparent border-0 p-0 m-0 w-11 h-11 mt-2 leading-none"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <i className="fi fi-rr-user text-xl leading-none block -translate-y-[1px]"></i>
          </button>
        )}
      </div>
    </header>
  );
}
