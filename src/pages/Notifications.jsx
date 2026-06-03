import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import HamburgerMenu from "../components/HamburgerMenu";
import Sidebar from "../components/Sidebar";
import { getNotifications, markAsRead, markAllAsRead } from "../api/notifications";

const TYPE_STYLE = {
  REPORT_VALIDATED:   { icon: "bi bi-recycle",           bg: "bg-emerald-50 dark:bg-emerald-950/30",  color: "text-emerald-600 dark:text-emerald-400" },
  CHALLENGE_COMPLETED:{ icon: "bi bi-trophy-fill",        bg: "bg-amber-50 dark:bg-amber-950/30",      color: "text-amber-500 dark:text-amber-400"    },
  POINTS_EARNED:      { icon: "bi bi-lightning-charge-fill", bg: "bg-blue-50 dark:bg-blue-950/30",    color: "text-blue-500 dark:text-blue-400"       },
  ITEM_REDEEMED:      { icon: "bi bi-bag-check-fill",     bg: "bg-purple-50 dark:bg-purple-950/30",    color: "text-purple-500 dark:text-purple-400"  },
};

const DEFAULT_STYLE = { icon: "bi bi-bell-fill", bg: "bg-gray-50 dark:bg-slate-800", color: "text-gray-500 dark:text-slate-400" };

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)    return "Hace un momento";
  if (diff < 3600)  return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  const days = Math.floor(diff / 86400);
  return days === 1 ? "Ayer" : `Hace ${days} días`;
}

function groupByDate(notifications) {
  const today     = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  const groups = { Hoy: [], Ayer: [], Anteriores: [] };
  for (const n of notifications) {
    const d = new Date(n.createdAt); d.setHours(0, 0, 0, 0);
    if (d >= today)           groups.Hoy.push(n);
    else if (d >= yesterday)  groups.Ayer.push(n);
    else                      groups.Anteriores.push(n);
  }
  return Object.entries(groups).filter(([, list]) => list.length > 0);
}

export default function Notifications() {
  const [menuOpen, setMenuOpen]           = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread]               = useState(0);
  const [loading, setLoading]             = useState(true);
  const [markingAll, setMarkingAll]       = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getNotifications()
      .then(({ notifications: ns, unread: u }) => {
        setNotifications(ns);
        setUnread(u);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleMarkAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnread((u) => Math.max(0, u - 1));
    await markAsRead(id).catch(() => {});
  }

  async function handleMarkAllAsRead() {
    if (unread === 0) return;
    setMarkingAll(true);
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    } catch {
    } finally {
      setMarkingAll(false);
    }
  }

  const grouped = groupByDate(notifications);

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

        <main className="w-full max-w-md lg:max-w-3xl mx-auto px-4 lg:px-8 pt-4 lg:pt-6 pb-8 flex-1">

          {/* Cabecera */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 transition lg:hidden"
              >
                <i className="bi bi-arrow-left text-slate-700 dark:text-slate-300"></i>
              </button>
              <div>
                <h1 className="text-xl font-black text-slate-800 dark:text-slate-100">Notificaciones</h1>
                {!loading && (
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    {unread > 0 ? `${unread} sin leer` : "Todo al día"}
                  </p>
                )}
              </div>
            </div>

            {unread > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition disabled:opacity-50"
              >
                {markingAll ? "Marcando…" : "Marcar todo como leído"}
              </button>
            )}
          </div>

          {/* Contenido */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E0E5EB] dark:border-slate-800 p-4 flex gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-full" />
                    <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-4 border border-[#E0E5EB] dark:border-slate-800">
                <i className="bi bi-bell text-3xl text-gray-300 dark:text-slate-600"></i>
              </div>
              <p className="font-bold text-slate-500 dark:text-slate-400">Sin notificaciones</p>
              <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
                Escanea un contenedor o completa un reto para recibir notificaciones.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.map(([label, items]) => (
                <div key={label}>
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-1">{label}</p>
                  <div className="space-y-2">
                    {items.map((n) => {
                      const s = TYPE_STYLE[n.type] ?? DEFAULT_STYLE;
                      return (
                        <div
                          key={n.id}
                          onClick={() => !n.read && handleMarkAsRead(n.id)}
                          className={`flex gap-3 p-4 rounded-2xl border transition-all cursor-pointer
                            ${n.read
                              ? "bg-white dark:bg-slate-900 border-[#E0E5EB] dark:border-slate-800 opacity-70"
                              : "bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/60 shadow-sm"
                            }`}
                        >
                          <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}>
                            <i className={`${s.icon} ${s.color} text-base`}></i>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-bold leading-snug ${n.read ? "text-slate-500 dark:text-slate-400" : "text-slate-800 dark:text-slate-100"}`}>
                                {n.title}
                              </p>
                              {!n.read && (
                                <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-1.5"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium mt-1.5">{timeAgo(n.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
