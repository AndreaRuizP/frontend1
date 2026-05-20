import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import HamburgerMenu from "../components/HamburgerMenu";
import Sidebar from "../components/Sidebar";
import { authStorage } from "../utils/security";

const history = [
  { icon: "bi bi-recycle", label: "Botella plástica validada", time: "Hace 2 horas", points: "+10" },
  { icon: "bi bi-box-seam", label: "Cartón depositado", time: "Ayer", points: "+8" },
  { icon: "bi bi-trophy", label: "Reto completado: 5 latas", time: "Hace 3 días", points: "+50" },
];

const stats = [
  { value: "350", label: "CleanPoints" },
  { value: "24", label: "Acciones" },
  { value: "5", label: "Retos logrados" },
];

export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleLogout() {
    authStorage.clear();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <div className="flex justify-between items-center pt-3 px-4 lg:hidden">
          <UserHeader onMenu={() => setMenuOpen(true)} showDarkMode={true} />
        </div>
        
        <div className="hidden lg:flex items-center justify-end px-6 py-4 border-b border-[#E0E5EB] dark:border-slate-800">
          <UserHeader onMenu={() => setMenuOpen(true)} showMenu={false} showDarkMode={true} />
        </div>
        <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="w-full max-w-md lg:max-w-6xl mx-auto px-4 lg:px-8 pt-4 lg:pt-6 pb-8 flex-1">
          <div className="flex items-center justify-between px-1 mb-4 lg:mb-6">
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Mi Perfil</h1>
          </div>

          <div className="mb-4 lg:mb-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center transition-colors duration-300">
              <div
                className="w-20 h-20 bg-green-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-3 border-4 border-green-100 dark:border-slate-800 overflow-hidden relative cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    fileInputRef.current?.click();
                  }
                }}
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                  <i className="bi bi-person text-green-600 dark:text-green-400 text-3xl"></i>
                )}
                <span className="absolute bottom-0 left-0 right-0 h-6 bg-black/40 text-white text-[9px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Editar
                </span>
                <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow flex items-center justify-center border border-green-100 dark:border-slate-700">
                  <i className="bi bi-camera text-green-600 dark:text-green-400 text-xs"></i>
                </span>
              </div>
              
              <h2 className="font-black text-slate-800 dark:text-slate-100 text-lg">Nombre_Usuario</h2>
              <p className="text-gray-400 dark:text-slate-400 text-xs mb-4">tu@gmail.com</p>
              
              <span className="bg-green-600 dark:bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                Nivel 3: Reciclador Activo
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-4 lg:mb-6">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="bg-white dark:bg-slate-900 rounded-2xl px-2 py-3 lg:px-4 lg:py-4 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center text-center min-h-[78px] lg:min-h-0 transition-colors duration-300"
              >
                <span className="text-[19px] lg:text-2xl font-black text-slate-900 dark:text-slate-100 leading-none tracking-tight">{value}</span>
                <span className="mt-1.5 text-[9px] lg:text-[11px] text-gray-400 dark:text-slate-400 font-bold leading-none max-w-[10ch]">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="mb-4 lg:mb-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-300">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Progreso al siguiente nivel</h3>
                <i className="bi bi-chevron-right text-gray-400 text-xs"></i>
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-400 mb-3.5">Nivel 4: Reciclador Experto — faltan 150 pts</p>
              
              <div className="h-2.5 bg-gray-100 dark:bg-slate-950 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                  style={{ width: "70%" }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-gray-400 dark:text-slate-400 font-bold">350 pts</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-400 font-bold">500 pts</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-2.5 px-1">Historial reciente</h3>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 divide-y divide-gray-50 dark:divide-slate-800/50 overflow-hidden transition-colors duration-300">
              {history.map(({ icon, label, time, points }, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="w-9 h-9 bg-green-50 dark:bg-green-950/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className={`${icon} text-green-600 dark:text-green-400 text-base`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{label}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-400 font-medium mt-0.5">{time}</p>
                  </div>
                  <span className="text-green-600 dark:text-green-400 font-black text-sm whitespace-nowrap">{points} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm focus:outline-none"
            >
              <i className="bi bi-box-arrow-right text-base"></i>
              Cerrar Sesión
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}