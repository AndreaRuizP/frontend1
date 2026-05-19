import { useState } from "react";
import UserHeader from "../components/UserHeader";
import HamburgerMenu from "../components/HamburgerMenu";
import Sidebar from "../components/Sidebar";

const challenges = [
  {
    titulo: "Recolecta 5 botellas plásticas",
    descripcion: "Encuentra y deposita 5 botellas de plástico en los contenedores designados.",
    dificultad: "Fácil",
    progreso: 3,
    total: 5,
    diasRestantes: 1,
    puntos: 50,
    tipo: "Individuales",
  },
  {
    titulo: "Recicla papel durante una semana",
    descripcion: "Deposita papel para reciclar durante 7 días consecutivos.",
    dificultad: "Media",
    progreso: 3,
    total: 7,
    diasRestantes: 4,
    puntos: 100,
    tipo: "Grupales",
  },
  {
    titulo: "Recolectar residuos electrónicos",
    descripcion: "Deposita al menos 2 residuos electrónicos en puntos especiales.",
    dificultad: "Difícil",
    progreso: 0,
    total: 2,
    diasRestantes: 5,
    puntos: 150,
    tipo: "Referidos",
  },
];

const difficultyStyle = {
  Fácil: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  Media: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  Difícil: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

export default function Challenge() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtro, setFiltro] = useState("Todos");

  const resultado = challenges.filter((r) =>
    filtro === "Todos" || r.tipo === filtro
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <div className="flex justify-between items-center pt-3 px-4 lg:hidden">
          <UserHeader onMenu={() => setMenuOpen(true)} showDarkMode={true} />
        </div>
        
        <div className="hidden lg:flex items-center justify-end px-6 py-4 border-b border-[#E0E5EB] dark:border-slate-800">
          <UserHeader 
            onMenu={() => setMenuOpen(true)} 
            showMenu={false} 
            showDarkMode={true} 
          />
        </div>
        
        <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="w-full max-w-md lg:max-w-6xl mx-auto px-4 lg:px-8 pt-4 lg:pt-6 pb-6 flex-1">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E0E5EB] dark:border-slate-800 px-5 py-3.5 mb-4 lg:mb-6 shadow-sm transition-colors duration-300">
              <span className="font-bold text-[#141B21] dark:text-slate-200 flex items-center gap-2" style={{ fontSize: 15 }}>
                <i className="bi bi-star-fill text-amber-500"></i>
                Nivel 3: Reciclador Activo
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4 lg:grid lg:grid-cols-4 lg:gap-2 lg:mb-6">
              {["Todos", "Individuales", "Grupales", "Referidos"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFiltro(tab)}
                  className={`flex-1 lg:flex-none lg:w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition active:scale-95 focus:outline-none
                ${filtro === tab
                    ? "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500 shadow-sm"
                    : "bg-white dark:bg-slate-900 text-[#141B21] dark:text-slate-300 border-[#E0E5EB] dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`}
                  style={{ fontSize: 13, minHeight: 40 }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
              {resultado.map((r, i) => {
                const porcentaje = Math.round((r.progreso / r.total) * 100);
                return (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-[#E0E5EB] dark:border-slate-800 p-5 flex flex-col justify-between transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="font-black text-[#141B21] dark:text-slate-100 leading-tight" style={{ fontSize: 17 }}>
                          {r.titulo}
                        </span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold shrink-0 ${difficultyStyle[r.dificultad]}`}
                          style={{ fontSize: 12 }}
                        >
                          {r.dificultad}
                        </span>
                      </div>

                      <p className="text-[#7D8797] dark:text-slate-400 text-sm mb-4 leading-relaxed" style={{ fontSize: 14 }}>
                        {r.descripcion}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-bold mr-2 text-[#141B21] dark:text-slate-300" style={{ fontSize: 12 }}>
                          Progreso: {r.progreso}/{r.total}
                        </span>
                        <span className="ml-auto text-xs font-bold text-[#7D8797] dark:text-slate-400" style={{ fontSize: 12 }}>
                          {porcentaje}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-100 dark:bg-slate-950 h-2 rounded-full mb-3 overflow-hidden">
                        <div
                          className="bg-emerald-500 dark:bg-emerald-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-50 dark:border-slate-800/60 pt-3">
                        <span className="text-xs text-[#7D8797] dark:text-slate-400 flex items-center gap-1.5 font-medium" style={{ fontSize: 12 }}>
                          <i className="bi bi-clock text-xs"></i>
                          {r.diasRestantes} día{r.diasRestantes !== 1 ? "s" : ""} restante{r.diasRestantes !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1 text-lg font-black text-amber-500 dark:text-amber-400" style={{ fontSize: 18 }}>
                          <i className="bi bi-award-fill text-xl"></i>
                          +{r.puntos} pts
                        </span>
                      </div>

                      <button
                        type="button"
                        className={`mt-4 w-full py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-95 focus:outline-none shadow-sm ${
                          r.progreso > 0
                            ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                            : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-100"
                        }`}
                        style={{ minHeight: 44 }}
                      >
                        {r.progreso > 0 ? "Continuar Reto" : "Iniciar Reto"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
        </main>
      </div>
    </div>
  );
}