import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import HamburgerMenu from "../components/HamburgerMenu";
import Sidebar from "../components/Sidebar";
import { authStorage } from "../utils/security";

const history = [
  { icon: "fi fi-rr-recycle", label: "Botella plástica validada", time: "Hace 2 horas", points: "+10" },
  { icon: "fi fi-rr-box-alt", label: "Cartón depositado", time: "Ayer", points: "+8" },
  { icon: "fi fi-rr-trophy", label: "Reto completado: 5 latas", time: "Hace 3 días", points: "+50" },
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
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <div className="flex justify-between items-center pt-3 px-0 lg:hidden">
          <UserHeader onMenu={() => setMenuOpen(true)} />
        </div>
        <div className="hidden lg:flex items-center justify-end px-6 py-4 border-b border-[#E0E5EB]">
          <UserHeader onMenu={() => setMenuOpen(true)} showMenu={false} showDarkMode={false} />
        </div>
        <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="w-full max-w-md lg:max-w-6xl mx-auto px-4 lg:px-8 pt-4 lg:pt-6 pb-8 flex-1">
          <div className="flex items-center justify-between px-1 mb-4 lg:mb-6">
            <h1 className="text-2xl font-black text-gray-800">Mi Perfil</h1>
          </div>
          <div className="mb-4 lg:mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center">
              <div
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-3 border-4 border-green-200 overflow-hidden relative cursor-pointer"
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
                  <i className="fi fi-rr-user text-green-600" style={{ fontSize: 36 }}></i>
                )}
                <span className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center border border-green-100">
                  <i className="fi fi-rr-camera text-green-600" style={{ fontSize: 14 }}></i>
                </span>
              </div>
              <h2 className="font-black text-gray-800 text-lg">Nombre_Usuario</h2>
              <p className="text-gray-400 text-xs mb-3">tu@gmail.com</p>
              <span className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
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
                className="bg-white rounded-2xl px-2 py-2.5 lg:px-3 lg:py-3 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[78px] lg:min-h-0"
              >
                <span className="text-[18px] lg:text-xl font-black text-gray-900 leading-none tracking-tight">{value}</span>
                <span className="mt-1 h-6 flex items-center justify-center text-[9px] lg:text-[10px] text-gray-400 font-semibold leading-none max-w-[8ch]">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="mb-4 lg:mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-gray-800 text-sm">Progreso al siguiente nivel</h3>
                <i className="fi fi-rr-angle-right text-gray-400"></i>
              </div>
              <p className="text-xs text-gray-400 mb-3">Nivel 4: Reciclador Experto — faltan 150 pts</p>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                  style={{ width: "70%" }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-gray-400 font-semibold">350 pts</span>
                <span className="text-[10px] text-gray-400 font-semibold">500 pts</span>
              </div>
            </div>
          </div>

          <div className="mb-4 lg:mb-6">
            <h3 className="font-bold text-gray-700 text-sm mb-2 px-1">Historial reciente</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
              {history.map(({ icon, label, time, points }, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className={`${icon} text-green-500 text-lg`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{label}</p>
                    <p className="text-[10px] text-gray-400">{time}</p>
                  </div>
                  <span className="text-green-600 font-black text-sm whitespace-nowrap">{points} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-red-600 border border-red-600 text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-red-700 hover:border-red-700 transition-colors"
            >
              <i className="fi fi-rr-sign-out text-lg"></i>
              Cerrar Sesión
            </button>
          </div>

        </main>
      </div>

    </div>
  );
}