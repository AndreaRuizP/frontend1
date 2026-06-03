import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import HamburgerMenu from "../components/HamburgerMenu";
import Sidebar from "../components/Sidebar";
import { authStorage } from "../utils/security";
import { getUser, uploadAvatar } from "../api/users";
import { getBalance, getTransactions, getChallengesProgress } from "../api/gamification";

const LEVELS = [
  { level: 1, name: "Principiante Verde",   min: 0,    max: 499  },
  { level: 2, name: "Reciclador Activo",    min: 500,  max: 999  },
  { level: 3, name: "Guardián Ambiental",   min: 1000, max: 1999 },
  { level: 4, name: "Leyenda Ecológica",    min: 2000, max: Infinity },
];

function getLevel(pts) {
  return LEVELS.findLast((l) => pts >= l.min) ?? LEVELS[0];
}

function getLevelProgress(pts) {
  const current = getLevel(pts);
  if (current.level === 4) return { pct: 100, falta: 0, nextName: null, nextMin: null };
  const next = LEVELS[current.level]; // level es 1-based, índice es level-1, siguiente es level
  const pct  = Math.round(((pts - current.min) / (next.min - current.min)) * 100);
  return { pct, falta: next.min - pts, nextName: next.name, nextMin: next.min };
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)   return "Hace un momento";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return `Hace ${Math.floor(diff / 86400)} días`;
}

function txStyle(type) {
  if (type === "QR_SCAN")  return { icon: "bi bi-qr-code-scan",  bg: "bg-emerald-50 dark:bg-emerald-950/30",  color: "text-emerald-600 dark:text-emerald-400" };
  if (type === "CHALLENGE") return { icon: "bi bi-trophy-fill",   bg: "bg-amber-50 dark:bg-amber-950/30",     color: "text-amber-500 dark:text-amber-400"    };
  if (type === "REDEEM")    return { icon: "bi bi-bag-check-fill", bg: "bg-blue-50 dark:bg-blue-950/30",      color: "text-blue-500 dark:text-blue-400"      };
  return { icon: "bi bi-arrow-left-right", bg: "bg-gray-50 dark:bg-slate-800", color: "text-gray-500 dark:text-slate-400" };
}

function txLabel(tx) {
  if (tx.description) return tx.description;
  if (tx.type === "QR_SCAN")   return "Escaneo de contenedor";
  if (tx.type === "CHALLENGE") return "Reto completado";
  if (tx.type === "REDEEM")    return "Canje en marketplace";
  return "Transacción";
}

export default function Profile() {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [avatarUrl, setAvatarUrl]       = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError]   = useState(null);
  const [user, setUser]                 = useState(authStorage.getUser());
  const [balance, setBalance]           = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [completados, setCompletados]   = useState(0);
  const [loading, setLoading]           = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const session = authStorage.getUser();
    if (!session?.id) return;

    Promise.all([
      getUser(session.id),
      getBalance(),
      getTransactions(),
      getChallengesProgress(),
    ])
      .then(([userData, bal, txs, progress]) => {
        setUser({ ...session, ...userData });
        if (userData.avatarUrl) setAvatarUrl(userData.avatarUrl);
        setBalance(bal);
        setTransactions(txs.slice(0, 5));
        setCompletados(progress.filter((p) => p.completed).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local inmediato
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setAvatarUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Subir al backend
    const session = authStorage.getUser();
    if (!session?.id) return;
    setUploadingAvatar(true);
    setAvatarError(null);
    try {
      const { avatarUrl: url } = await uploadAvatar(session.id, file);
      setAvatarUrl(url);
    } catch (err) {
      setAvatarError("No se pudo guardar la foto. Intenta de nuevo.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  function handleLogout() {
    authStorage.clear();
    navigate("/login");
  }

  const pts         = balance?.balance ?? 0;
  const totalPts    = balance?.total   ?? 0;
  const lvl         = getLevel(pts);
  const { pct, falta, nextName, nextMin } = getLevelProgress(pts);
  const acciones    = transactions.length > 0
    ? transactions.filter((t) => t.type === "QR_SCAN").length
    : 0;

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

        <main className="w-full max-w-md lg:max-w-6xl mx-auto px-4 lg:px-8 pt-4 lg:pt-6 pb-8 flex-1">

          <div className="flex items-center justify-between px-1 mb-4 lg:mb-6">
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Mi Perfil</h1>
          </div>

          {/* Tarjeta de usuario */}
          <div className="mb-4 lg:mb-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center transition-colors duration-300">
              <div
                className="w-20 h-20 bg-emerald-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-3 border-4 border-emerald-100 dark:border-slate-800 overflow-hidden relative cursor-pointer group"
                onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !uploadingAvatar) fileInputRef.current?.click(); }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                  <i className="bi bi-person text-green-600 dark:text-green-400 text-3xl"></i>
                )}
                {uploadingAvatar ? (
                  <span className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                    <i className="bi bi-arrow-repeat text-white text-lg animate-spin"></i>
                  </span>
                ) : (
                  <>
                    <span className="absolute bottom-0 left-0 right-0 h-6 bg-black/40 text-white text-[9px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Editar
                    </span>
                    <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow flex items-center justify-center border border-emerald-100 dark:border-slate-700">
                      <i className="bi bi-camera text-emerald-600 dark:text-emerald-400 text-xs"></i>
                    </span>
                  </>
                )}
              </div>

              {avatarError && (
                <p className="text-xs text-red-500 mb-2 text-center">{avatarError}</p>
              )}

              {loading ? (
                <>
                  <div className="h-5 w-32 bg-gray-100 dark:bg-slate-800 rounded animate-pulse mb-2" />
                  <div className="h-3 w-44 bg-gray-100 dark:bg-slate-800 rounded animate-pulse mb-4" />
                </>
              ) : (
                <>
                  <h2 className="font-black text-slate-800 dark:text-slate-100 text-lg">{user?.name ?? "—"}</h2>
                  <p className="text-gray-400 dark:text-slate-400 text-xs mb-4">{user?.email ?? "—"}</p>
                </>
              )}

              <span className="bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                {loading ? "Cargando…" : `Nivel ${lvl.level}: ${lvl.name}`}
              </span>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-4 lg:mb-6">
            {[
              { value: loading ? "…" : pts,        label: "CleanPoints"    },
              { value: loading ? "…" : totalPts,   label: "Pts acumulados" },
              { value: loading ? "…" : completados, label: "Retos logrados" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-white dark:bg-slate-900 rounded-2xl px-2 py-3 lg:px-4 lg:py-4 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center text-center min-h-[78px] transition-colors duration-300"
              >
                <span className="text-[19px] lg:text-2xl font-black text-slate-900 dark:text-slate-100 leading-none tracking-tight">{value}</span>
                <span className="mt-1.5 text-[9px] lg:text-[11px] text-gray-400 dark:text-slate-400 font-bold leading-none max-w-[10ch]">{label}</span>
              </div>
            ))}
          </div>

          {/* Barra de nivel */}
          <div className="mb-4 lg:mb-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-300">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Progreso al siguiente nivel</h3>
              </div>
              {loading ? (
                <div className="h-3 w-48 bg-gray-100 dark:bg-slate-800 rounded animate-pulse mb-3.5" />
              ) : lvl.level === 4 ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-3.5">¡Nivel máximo alcanzado!</p>
              ) : (
                <p className="text-xs text-gray-400 dark:text-slate-400 mb-3.5">
                  Nivel {lvl.level + 1}: {nextName} — faltan <span className="font-bold text-emerald-600 dark:text-emerald-400">{falta} pts</span>
                </p>
              )}

              <div className="h-2.5 bg-gray-100 dark:bg-slate-950 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${loading ? 0 : pct}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-gray-400 dark:text-slate-400 font-bold">{loading ? "…" : pts} pts</span>
                {lvl.level < 4 && (
                  <span className="text-[10px] text-gray-400 dark:text-slate-400 font-bold">{nextMin} pts</span>
                )}
              </div>
            </div>
          </div>

          {/* Historial reciente */}
          <div className="mb-6">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-2.5 px-1">Historial reciente</h3>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 divide-y divide-gray-50 dark:divide-slate-800/50 overflow-hidden transition-colors duration-300">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
                    <div className="w-9 h-9 bg-gray-100 dark:bg-slate-800 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-3/4" />
                      <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded w-1/3" />
                    </div>
                    <div className="h-4 w-12 bg-gray-100 dark:bg-slate-800 rounded" />
                  </div>
                ))
              ) : transactions.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-400 dark:text-slate-500">
                  Aún no hay actividad registrada
                </div>
              ) : (
                transactions.map((tx, i) => {
                  const s = txStyle(tx.type);
                  return (
                    <div key={i} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}>
                        <i className={`${s.icon} ${s.color} text-base`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{txLabel(tx)}</p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-400 font-medium mt-0.5">{timeAgo(tx.createdAt)}</p>
                      </div>
                      <span className={`font-black text-sm whitespace-nowrap ${tx.amount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                        {tx.amount >= 0 ? "+" : ""}{tx.amount} pts
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Cerrar sesión */}
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
