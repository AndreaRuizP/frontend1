import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu";
import UserHeader from "../components/UserHeader";
import Sidebar from "../components/Sidebar";
import { getBalance, getTransactions, getChallengesProgress } from "../api/gamification";

const LEVELS = [
  { level: 1, min: 0,    max: 499,  next: 500  },
  { level: 2, min: 500,  max: 999,  next: 1000 },
  { level: 3, min: 1000, max: 1999, next: 2000 },
  { level: 4, min: 2000, max: null, next: null  },
];

function getLevel(balance) {
  const lvl = LEVELS.slice().reverse().find((l) => balance >= l.min) || LEVELS[0];
  return {
    level: lvl.level,
    ptsToNext: lvl.next ? lvl.next - balance : 0,
    isMax: lvl.next === null,
  };
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return "Ahora";
  if (m < 60) return `Hace ${m} min`;
  if (h < 24) return `Hace ${h} hora${h > 1 ? "s" : ""}`;
  return `Hace ${d} día${d > 1 ? "s" : ""}`;
}

function txIcon(type) {
  if (type === "QR_SCAN")  return { bg: "bg-green-50 dark:bg-green-950/50",  icon: "fi fi-rr-check-circle text-green-500" };
  if (type === "CHALLENGE") return { bg: "bg-amber-50 dark:bg-amber-950/50",  icon: "fi fi-rr-star text-amber-500" };
  return                          { bg: "bg-blue-50 dark:bg-blue-950/50",     icon: "bi bi-bag-check text-blue-500" };
}

const tips = [
  { title: "Separa plástico y cartón",       desc: "Evita mezclar materiales para mejorar la clasificación.",     impact: "Hasta 30% más eficiencia en reciclaje." },
  { title: "Enjuaga envases antes de reciclar", desc: "Quitar restos de comida evita contaminar otros residuos.", impact: "Reduce rechazos en plantas de tratamiento." },
  { title: "Compacta botellas plásticas",    desc: "Aplastar las botellas ahorra espacio en el contenedor.",      impact: "Más capacidad por contenedor y menos viajes." },
];

export default function DashboardHome() {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [activeTipIndex, setActiveTipIndex] = useState(0);

  const [balance, setBalance]           = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [challenges, setChallenges]     = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([getBalance(), getTransactions(), getChallengesProgress()])
      .then(([bal, txs, chs]) => {
        setBalance(bal);
        setTransactions(txs.slice(0, 3));
        setChallenges(chs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const lvl = balance ? getLevel(balance.balance) : null;
  const activeTip = tips[activeTipIndex];

  // First non-completed challenge
  const featured = challenges.find((c) => !c.completed) || challenges[0] || null;
  const progressPercent = featured
    ? Math.min(100, Math.round(((featured.progress ?? 0) / (featured.challenge?.target ?? 1)) * 100))
    : 0;

  const difficultyStyle = "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">

        <div className="flex justify-between items-center pt-3 px-0 lg:hidden">
          <UserHeader onMenu={() => setMenuOpen(true)} />
        </div>

        <div className="hidden lg:flex items-center justify-end px-6 py-4 border-b border-[#E0E5EB] dark:border-slate-800">
          <UserHeader onMenu={() => setMenuOpen(true)} showMenu={false} showDarkMode={true} />
        </div>

        <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="w-full max-w-md lg:max-w-6xl mx-auto px-4 lg:px-8 py-4 lg:py-6 flex-1">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)] gap-6">
            <section className="space-y-4 lg:space-y-6">

              {/* ── Balance y nivel ── */}
              <div className="rounded-3xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-slate-900 dark:to-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 shadow-sm px-5 py-5 lg:px-6 lg:py-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-[#58716a] dark:text-green-400 font-medium">Tu saldo actual</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    {loading ? (
                      <span className="w-20 h-9 bg-emerald-100 dark:bg-emerald-900/40 rounded animate-pulse inline-block" />
                    ) : (
                      <span className="text-[2.1rem] lg:text-[2.4rem] font-black text-emerald-600 dark:text-emerald-400 leading-none">
                        {balance?.balance ?? 0}
                      </span>
                    )}
                    <span className="text-lg lg:text-xl text-slate-700 dark:text-slate-300 font-semibold">CleanPoints</span>
                  </div>
                  <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-400">
                    {lvl && !lvl.isMax ? `${lvl.ptsToNext} pts para el nivel ${lvl.level + 1}` : lvl?.isMax ? "¡Nivel máximo!" : ""}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 shadow-sm">
                  {lvl ? `Nivel ${lvl.level}` : "—"}
                </span>
              </div>

              {/* ── Botones de acceso rápido ── */}
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <Link to="/map" className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-[#E0E5EB] dark:border-slate-800 shadow-sm items-center py-5 lg:py-6 px-3 lg:px-4 min-h-[104px] lg:min-h-[124px] justify-center transition hover:-translate-y-0.5 hover:shadow-md hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100">
                  <i className="fi fi-rr-map text-2xl lg:text-4xl mb-2 text-green-600 dark:text-green-400"></i>
                  <span className="text-[15px] lg:text-base font-semibold text-center">Contenedores</span>
                  <span className="text-xs text-[#7D8797] dark:text-slate-400 text-center">cercanos</span>
                </Link>
                <Link to="/scan" className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-[#E0E5EB] dark:border-slate-800 shadow-sm items-center py-5 lg:py-6 px-3 lg:px-4 min-h-[104px] lg:min-h-[124px] justify-center transition hover:-translate-y-0.5 hover:shadow-md hover:bg-green-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100">
                  <i className="bi bi-qr-code-scan text-2xl lg:text-4xl mb-2 text-green-600 dark:text-green-400"></i>
                  <span className="text-[15px] lg:text-base font-semibold text-center">Escanear QR</span>
                  <span className="text-xs text-[#7D8797] dark:text-slate-400 text-center">Valida acción</span>
                </Link>
              </div>

              {/* ── Reto destacado ── */}
              {loading ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E0E5EB] dark:border-slate-800 p-4 lg:p-5 h-40 animate-pulse" />
              ) : featured ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-[#E0E5EB] dark:border-slate-800 p-4 lg:p-5 text-slate-800 dark:text-slate-100">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="font-bold text-[#141B21] dark:text-slate-100 leading-tight" style={{ fontSize: 17 }}>
                      {featured.challenge?.name}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold shrink-0 ${difficultyStyle}`} style={{ fontSize: 13 }}>
                      Activo
                    </span>
                  </div>

                  <p className="text-[#7D8797] dark:text-slate-400 mb-3" style={{ fontSize: 15, lineHeight: 1.5 }}>
                    {featured.challenge?.description}
                  </p>

                  <div className="flex items-center mb-2">
                    <span className="text-xs font-semibold mr-2 text-[#141B21] dark:text-slate-300" style={{ fontSize: 12 }}>
                      Progreso: {featured.progress ?? 0}/{featured.challenge?.target ?? 0}
                    </span>
                    <span className="ml-auto text-xs text-[#7D8797] dark:text-slate-400" style={{ fontSize: 12 }}>
                      {progressPercent}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded mb-2">
                    <div className="bg-green-500 h-2 rounded transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#7D8797] dark:text-slate-400" style={{ fontSize: 12 }}>
                      {featured.challenge?.criteria === "QR_SCAN" ? "Escanea contenedores" : "Completa la acción"}
                    </span>
                    <span className="flex items-center gap-1 text-lg font-bold text-[#FFC400]" style={{ fontSize: 18 }}>
                      <i className="bi bi-award" style={{ fontSize: 22 }}></i>
                      +{featured.challenge?.pointsReward} pts
                    </span>
                  </div>

                  <Link
                    to="/retos"
                    className="mt-4 w-full py-3 rounded-lg text-white font-semibold text-sm transition active:scale-95 bg-green-600 hover:bg-green-700 flex items-center justify-center"
                    style={{ minHeight: 44 }}
                  >
                    Ver todos los retos
                  </Link>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E0E5EB] dark:border-slate-800 p-5 text-center text-sm text-slate-400">
                  No hay retos activos
                </div>
              )}

              {/* ── Tip móvil ── */}
              <div className="bg-white dark:bg-slate-900 lg:hidden rounded-2xl shadow-sm border border-[#E0E5EB] dark:border-slate-800 px-5 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <i className="bi bi-lightbulb text-xl text-[#FFD300]"></i>
                  <span className="inline-block font-semibold text-sm bg-[#dbfce7] dark:bg-green-950 text-[#008236] dark:text-green-400 px-2 py-[2px] rounded-full" style={{ fontSize: 13 }}>
                    Tip del día
                  </span>
                </div>
                <p className="text-sm text-[#7D8797] dark:text-slate-400 leading-snug mt-1" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  {activeTip.desc}
                </p>
              </div>
            </section>

            <aside className="space-y-4 lg:space-y-6">
              {/* ── Tip desktop ── */}
              <div className="hidden lg:block bg-[#fffbea] dark:bg-slate-900 border border-[#F5E7A3] dark:border-slate-800 rounded-3xl px-5 py-5 shadow-sm">
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

              {/* ── Actividad reciente ── */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="font-bold text-gray-700 dark:text-slate-300 text-sm">Actividad reciente</span>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 divide-y divide-gray-50 dark:divide-slate-800">
                  {loading ? (
                    [1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-3/4" />
                          <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded w-1/3" />
                        </div>
                      </div>
                    ))
                  ) : transactions.length > 0 ? (
                    transactions.map((tx, i) => {
                      const { bg, icon } = txIcon(tx.type);
                      return (
                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                          <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <i className={`${icon} text-lg`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 dark:text-slate-200 truncate">
                              {tx.description || tx.type}
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500">{timeAgo(tx.createdAt)}</p>
                          </div>
                          <span className={`font-black text-sm whitespace-nowrap ${tx.amount > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                            {tx.amount > 0 ? "+" : ""}{tx.amount} pts
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                      Sin actividad aún. ¡Escanea tu primer QR!
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
