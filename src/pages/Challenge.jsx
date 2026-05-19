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
  Fácil: "bg-green-100 text-green-700",
  Media: "bg-yellow-100 text-yellow-700",
  Difícil: "bg-red-100 text-red-700",
};

export default function Challenge() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtro, setFiltro] = useState("Todos");

  const resultado = challenges.filter((r) =>
    filtro === "Todos" || r.tipo === filtro
  );

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

        <main className="w-full max-w-md lg:max-w-6xl mx-auto px-4 lg:px-8 pt-4 lg:pt-6 pb-6 flex-1">
            <div className="bg-white rounded-2xl border border-[#E0E5EB] px-5 py-3 mb-4 lg:mb-6">
              <span className="font-semibold text-[#141B21]" style={{ fontSize: 15 }}>
                Nivel 3: Reciclador Activo
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4 lg:grid lg:grid-cols-4 lg:gap-2 lg:mb-6">
              {["Todos", "Individuales", "Grupales", "Referidos"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFiltro(tab)}
                  className={`flex-1 lg:flex-none lg:w-full py-2 rounded-xl border text-xs font-semibold transition
                ${filtro === tab
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-[#141B21] border-[#E0E5EB]"
                    }`}
                  style={{ fontSize: 13, minHeight: 36 }}
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
                    className="bg-white rounded-2xl shadow-sm border border-[#E0E5EB] p-4 lg:p-5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="font-bold text-[#141B21] leading-tight" style={{ fontSize: 17 }}>
                        {r.titulo}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold shrink-0 ${difficultyStyle[r.dificultad]}`}
                        style={{ fontSize: 13 }}
                      >
                        {r.dificultad}
                      </span>
                    </div>

                    <p className="text-[#7D8797] text-sm mb-3" style={{ fontSize: 15, lineHeight: 1.5 }}>
                      {r.descripcion}
                    </p>

                    <div className="flex items-center mb-2">
                      <span className="text-xs font-semibold mr-2 text-[#141B21]" style={{ fontSize: 12 }}>
                        Progreso: {r.progreso}/{r.total}
                      </span>
                      <span className="ml-auto text-xs text-[#7D8797]" style={{ fontSize: 12 }}>
                        {porcentaje}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 h-2 rounded mb-2">
                      <div
                        className="bg-green-500 h-2 rounded transition-all duration-300"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#7D8797] flex items-center gap-1" style={{ fontSize: 12 }}>
                        <i className="fi fi-rr-clock-three text-xs"></i>
                        {r.diasRestantes} día{r.diasRestantes !== 1 ? "s" : ""} restante{r.diasRestantes !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1 text-lg font-bold text-[#FFC400]" style={{ fontSize: 18 }}>
                        <i className="bi bi-award" style={{ fontSize: 22 }}></i>
                        +{r.puntos} pts
                      </span>
                    </div>

                    <button
                      type="button"
                      className={`mt-4 w-full py-3 rounded-lg text-white font-semibold text-sm transition active:scale-95 ${
                        r.progreso > 0
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-[#141B21] hover:bg-[#0f172a]"
                      }`}
                      style={{ minHeight: 44 }}
                    >
                      {r.progreso > 0 ? "Continuar Reto" : "Iniciar Reto"}
                    </button>
                  </div>
                );
              })}
            </div>
        </main>
      </div>
    </div>
  );
}