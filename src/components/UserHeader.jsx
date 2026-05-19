import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext"; 
import DarkMode from "./DarkMode";
import NotificationBell from "./NotificationBell";

function UserHeader({
  onMenu,
  onBell,
  showMenu = true,
  showDarkMode = true,
  showBell = true,
  showUser = true,
  className = "",
}) {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <header
      className={`w-full mx-auto flex items-center justify-between px-0 mb-0 bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300 ${className}`}
      style={{ minHeight: 48 }}
    >
      {showMenu ? (
        <button
          aria-label="Menú"
          onClick={onMenu}
          className="flex items-center justify-center p-0 m-0 w-11 h-11 text-current hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          style={{ minWidth: 44, minHeight: 44 }}
        >
          <i className="fi fi-rr-menu-burger text-xl leading-none block"></i>
        </button>
      ) : (
        <div style={{ minWidth: 44, minHeight: 44 }} />
      )}

      <div className="flex items-center gap-2 sm:gap-4">
        {showDarkMode && (
          <div className="flex items-center justify-center w-14 h-11 shrink-0">
            <DarkMode checked={darkMode} onChange={toggleDarkMode} />
          </div>
        )}

        {showBell && (
          <div onClick={(e) => e.stopPropagation()} className="w-11 h-11 flex items-center justify-center">
            <NotificationBell onBell={onBell} />
          </div>
        )}

        {showUser && (
          <button
            aria-label="Cuenta"
            onClick={() => navigate("/profile")}
            className="flex items-center justify-center bg-transparent border-0 p-0 m-0 w-11 h-11 text-current hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-none leading-none"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <i className="fi fi-rr-user text-xl leading-none block"></i>
          </button>
        )}
      </div>
    </header>
  );
}

export default React.memo(UserHeader);