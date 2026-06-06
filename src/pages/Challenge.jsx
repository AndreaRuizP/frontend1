import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import HamburgerMenu from "../components/HamburgerMenu";
import Sidebar from "../components/Sidebar";
import { getChallengesProgress } from "../api/gamification";
import { getBalance } from "../api/gamification";

function getDifficulty(target) {
  if (target <= 3)  return "Fácil";
  if (target <= 10) return "Media";
  return "Difícil";
}

const difficultyStyle = {
  Fácil:   "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  Media:   "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  Difícil: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

const FILTERS = ["Todos", "Individual", "Grupales", "Referidos"];

const typeMap = {
  Individual:   "individual",
  Grupales:     "group",
  Referidos:    "referral",
};

export default function Challenge() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [filtro, setFiltro]       = useState("Todos");
  const [challenges, setChallenges] = useState([]);
  const [balance, setBalance]     = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([getChallengesProgress(), getBalance()])
      .then(([chs, bal]) => {
        setChallenges(chs);
        setBalance(bal);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const resultado = challenges.filter((c) => {
    if (filtro === "Todos") return true;
    return c.challenge?.type === typeMap[filtro];
  });

  const completados = challenges.filter((c) => c.completed).length;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <div className="flex justify-between items-center pt-3 px-4 lg:hidden">
          <UserHeader onMenu={() => setMenuOpen(true)} showDarkMode={true} />
        </div>

        <div className="hidden lg:flex items-center justify-end px-6 py-4 border-b border-[#E0E5EB] dark:border-slate-800">
          <UserHeader onMenu={() => setMenuOpen(true)} showMenu={false} showDarkMode={true} />
        </div>

        <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="w-full max-w-md lg:max-w-6xl mx-auto px-4 lg:px-8 pt-4 lg:pt-6 pb-6 flex-1">

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E0E5EB] dark:border-slate-800 px-5 py-3.5 mb-4 lg:mb-6 shadow-sm flex items-center justify-between transition-colors duration-300">
            <span className="font-bold text-[#141B21] dark:text-slate-200 flex items-center gap-2" style={{ fontSize: 15 }}>
              {loading ? "Cargando..." : `${completados} de ${challenges.length} retos completados`}
            </span>
            {balance && (
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {balance.balance} pts
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4 lg:grid lg:grid-cols-4 lg:mb-6">
            {FILTERS.map((tab) => (
              <button
                key={tab}
                onClick={() => setFiltro(tab)}
                className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition focus:outline-none
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

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E0E5EB] dark:border-slate-800 h-52 animate-pulse" />
              ))}
            </div>
          ) : resultado.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
              <i className="bi bi-trophy text-4xl mb-3 block"></i>
              <p className="font-medium">No hay retos en esta categoría</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
              {resultado.map((r) => {
                const ch         = r.challenge ?? {};
                const progress   = r.progress ?? 0;
                const target     = ch.target ?? 1;
                const completed  = r.completed ?? false;
                const porcentaje = Math.min(100, Math.round((progress / target) * 100));
                const difficulty = getDifficulty(target);

                return (
                  <div
                    key={r.challengeId}
                    className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border p-5 flex flex-col justify-between transition-all duration-300
                      ${completed
                        ? "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/10"
                        : "border-[#E0E5EB] dark:border-slate-800"
                      }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="font-black text-[#141B21] dark:text-slate-100 leading-tight flex items-center gap-2" style={{ fontSize: 17 }}>
                          {completed && <i className="bi bi-patch-check-fill text-emerald-500 text-base shrink-0"></i>}
                          {ch.name}
                        </span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold shrink-0 ${difficultyStyle[difficulty]}`}
                          style={{ fontSize: 12 }}
                        >
                          {difficulty}
                        </span>
                      </div>

                      <p className="text-[#7D8797] dark:text-slate-400 text-sm mb-4 leading-relaxed" style={{ fontSize: 14 }}>
                        {ch.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-bold mr-2 text-[#141B21] dark:text-slate-300" style={{ fontSize: 12 }}>
                          Progreso: {progress}/{target}
                        </span>
                        <span className="ml-auto text-xs font-bold text-[#7D8797] dark:text-slate-400" style={{ fontSize: 12 }}>
                          {porcentaje}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-100 dark:bg-slate-950 h-2 rounded-full mb-3 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${completed ? "bg-emerald-500" : "bg-emerald-500 dark:bg-emerald-400"}`}
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-50 dark:border-slate-800/60 pt-3">
                        <span className="text-xs text-[#7D8797] dark:text-slate-400 font-medium flex items-center gap-1" style={{ fontSize: 12 }}>
                          <i className="bi bi-qr-code-scan text-xs"></i>
                          {target} escaneo{target !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1 font-black text-amber-500 dark:text-amber-400" style={{ fontSize: 18 }}>
                          <i className="bi bi-award-fill text-xl"></i>
                          +{ch.pointsReward} pts
                        </span>
                      </div>

                      {completed ? (
                        <div className="mt-4 w-full py-3 rounded-xl text-sm font-bold text-center bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                          ✓ Completado
                        </div>
                      ) : (
                        <Link
                          to="/scan"
                          className={`mt-4 w-full py-3 rounded-xl text-sm font-bold text-center block text-white transition hover:opacity-90 active:scale-95
                            ${progress > 0
                              ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                              : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
                            }`}
                        >
                          <i className="bi bi-qr-code-scan mr-1.5"></i>
                          {progress > 0 ? "Continuar reto" : "Iniciar reto"}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
