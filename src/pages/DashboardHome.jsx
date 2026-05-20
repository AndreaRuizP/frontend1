import { useState } from "react";
import { Link } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu";
import UserHeader from "../components/UserHeader";
import Sidebar from "../components/Sidebar";
import ScanQR from "./ScanQR";
import Map from "./Map";
import Profile from "./Profile";

export default function DashboardHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTipIndex, setActiveTipIndex] = useState(0);

  const retoDestacado = {
    titulo: "Recolecta 5 botellas plásticas",
    descripcion: "Encuentra y deposita 5 botellas de plástico en los contenedores designados.",
    dificultad: "Fácil",
    progreso: 3,
    total: 5,
    diasRestantes: 1,
    puntos: 50,
  };

  const tips = [
    {
      title: "Separa plástico y cartón",
      desc: "Evita mezclar materiales para mejorar la clasificación y aumentar la tasa de reciclaje.",
      impact: "Hasta 30% más eficiencia en reciclaje.",
    },
    {
      title: "Enjuaga envases antes de reciclar",
      desc: "Quitar restos de comida evita contaminar otros residuos aprovechables.",
      impact: "Reduce rechazos en plantas de tratamiento.",
    },
    {
      title: "Compacta botellas plásticas",
      desc: "Aplastar las botellas ahorra espacio y facilita el transporte de residuos.",
      impact: "Más capacidad por contenedor y menos viajes.",
    },
  ];

  const activeTip = tips[activeTipIndex];
  const progressPercent = Math.round((retoDestacado.progreso / retoDestacado.total) * 100);
  const difficultyStyle = {
    Fácil: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        
        <div className="flex justify-between items-center pt-3 px-4 lg:hidden">
          <UserHeader onMenu={() => setMenuOpen(true)} />
        </div>
        
        <div className="hidden lg:flex items-center justify-end px-6 py-4 border-b border-[#E0E5EB] dark:border-slate-800">
          <UserHeader onMenu={() => setMenuOpen(true)} showMenu={false} showDarkMode={true} />
        </div>
        
        <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="w-full max-w-md lg:max-w-6xl mx-auto px-4 lg:px-8 py-4 lg:py-6 flex-1">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)] gap-6">
            <section className="space-y-4 lg:space-y-6">
              
              <div className="rounded-3xl bg-gradient-to-r from-green-50 to-green-50 dark:from-slate-900 dark:to-green-950/30 border border-green-100 dark:border-green-900/30 shadow-sm px-5 py-5 lg:px-6 lg:py-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-[#58716a] dark:text-green-400 font-medium">Tu saldo actual</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-[2.1rem] lg:text-[2.4rem] font-black text-green-600 dark:text-green-400 leading-none">150</span>
                    <span className="text-lg lg:text-xl text-slate-700 dark:text-slate-300 font-semibold">CleanPoints</span>
                  </div>
                  <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-400">350 pts para el nivel 2</p>
                </div>
                <span className="shrink-0 rounded-full border border-green-200 dark:border-green-800 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-bold text-green-700 dark:text-green-400 shadow-sm">
                  Nivel 1
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-4">
                <Link to="/map" className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-[#E0E5EB] dark:border-slate-800 shadow-sm items-center py-5 lg:py-6 px-3 lg:px-4 min-h-[104px] lg:min-h-[124px] justify-center transition hover:-translate-y-0.5 hover:shadow-md hover:bg-green-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100">
                  <i className="fi fi-rr-map text-2xl lg:text-4xl mb-2 text-green-600 dark:text-green-400"></i>
                  <span className="text-[15px] lg:text-base font-semibold mb-0 text-center">Contenedores</span>
                  <span className="text-xs text-[#7D8797] dark:text-slate-400 text-center">cercanos</span>
                </Link>
                <Link to="/scan" className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-[#E0E5EB] dark:border-slate-800 shadow-sm items-center py-5 lg:py-6 px-3 lg:px-4 min-h-[104px] lg:min-h-[124px] justify-center transition hover:-translate-y-0.5 hover:shadow-md hover:bg-green-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100">
                  <i className="bi bi-qr-code-scan text-2xl lg:text-4xl mb-2 text-green-600 dark:text-green-400"></i>
                  <span className="text-[15px] lg:text-base font-semibold mb-0 text-center">Escanear QR</span>
                  <span className="text-xs text-[#7D8797] dark:text-slate-400 text-center">Valida acción</span>
                </Link>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-[#E0E5EB] dark:border-slate-800 p-4 lg:p-5 text-slate-800 dark:text-slate-100">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="font-bold text-[#141B21] dark:text-slate-100 leading-tight" style={{ fontSize: 17 }}>
                    {retoDestacado.titulo}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold shrink-0 ${difficultyStyle[retoDestacado.dificultad]}`}
                    style={{ fontSize: 13 }}
                  >
                    {retoDestacado.dificultad}
                  </span>
                </div>

                <p className="text-[#7D8797] dark:text-slate-400 text-sm mb-3" style={{ fontSize: 15, lineHeight: 1.5 }}>
                  {retoDestacado.descripcion}
                </p>

                <div className="flex items-center mb-2">
                  <span className="text-xs font-semibold mr-2 text-[#141B21] dark:text-slate-300" style={{ fontSize: 12 }}>
                    Progreso: {retoDestacado.progreso}/{retoDestacado.total}
                  </span>
                  <span className="ml-auto text-xs text-[#7D8797] dark:text-slate-400" style={{ fontSize: 12 }}>
                    {progressPercent}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded mb-2">
                  <div
                    className="bg-green-500 h-2 rounded transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#7D8797] dark:text-slate-400 flex items-center gap-1" style={{ fontSize: 12 }}>
                    <i className="fi fi-rr-clock-three text-xs"></i>
                    {retoDestacado.diasRestantes} día{retoDestacado.diasRestantes !== 1 ? "s" : ""} restante{retoDestacado.diasRestantes !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1 text-lg font-bold text-[#FFC400]" style={{ fontSize: 18 }}>
                    <i className="bi bi-award" style={{ fontSize: 22 }}></i>
                    +{retoDestacado.puntos} pts
                  </span>
                </div>

                <button
                  type="button"
                  className={`mt-4 w-full py-3 rounded-lg text-white font-semibold text-sm transition active:scale-95 ${
                    retoDestacado.progreso > 0
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-[#141B21] hover:bg-[#0f172a] dark:bg-green-600 dark:hover:bg-green-700"
                  }`}
                  style={{ minHeight: 44 }}
                >
                  {retoDestacado.progreso > 0 ? "Continuar Reto" : "Iniciar Reto"}
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 lg:hidden rounded-2xl shadow-sm border border-[#E0E5EB] dark:border-slate-800 px-5 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <i className="bi bi-lightbulb text-xl text-[#FFD300]"></i>
                  <span className="inline-block font-semibold text-sm bg-[#dbfce7] dark:bg-green-950 text-[#008236] dark:text-green-400 px-2 py-[2px] rounded-full" style={{ fontSize: 13 }}>
                    Tip del día
                  </span>
                </div>
                <p className="text-sm text-[#7D8797] dark:text-slate-400 leading-snug mt-1" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  Separa el cartón del plástico antes de depositarlo.<br />
                  Mejora la tasa de reciclaje hasta un 30%.
                </p>
              </div>
            </section>

            <aside className="space-y-4 lg:space-y-6">
              <div id="tip" className="hidden lg:block bg-[#fffbea] dark:bg-slate-900 border border-[#F5E7A3] dark:border-slate-800 rounded-3xl px-5 py-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#FFF3B0] dark:bg-slate-800 flex items-center justify-center shrink-0 border border-[#F5E7A3] dark:border-slate-700">
                      <i className="bi bi-lightbulb text-xl" style={{ color: "#D97706" }}></i>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide font-semibold text-[#A16207] dark:text-amber-400">Tip del día</p>
                      <h4 className="text-base font-bold text-[#141B21] dark:text-slate-100 mt-1">{activeTip.title}</h4>
                      <p className="text-sm text-[#6B7280] dark:text-slate-400 mt-2 leading-6">{activeTip.desc}</p>
                      <p className="text-sm font-semibold text-[#15803D] dark:text-green-400 mt-2">{activeTip.impact}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTipIndex((prev) => (prev + 1) % tips.length)}
                    className="shrink-0 rounded-lg border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-[#374151] dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                  >
                    Siguiente tip
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="font-bold text-gray-700 dark:text-slate-300 text-sm">Actividad reciente</span>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 divide-y divide-gray-50 dark:divide-slate-800">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 bg-green-50 dark:bg-green-950/50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fi fi-rr-check-circle text-green-500 text-lg"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-slate-200 truncate">Botella plástica validada</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">Hace 2 horas</p>
                    </div>
                    <span className="text-green-600 dark:text-green-400 font-black text-sm whitespace-nowrap">+10 pts</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fi fi-rr-star text-amber-500 text-lg"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-slate-200 truncate">Reto completado</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">Ayer</p>
                    </div>
                    <span className="text-green-600 dark:text-green-400 font-black text-sm whitespace-nowrap">+50 pts</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}