import { useState, useEffect } from "react";
import NotificationPanel from "./NotificationPanel";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../api/notifications";

export default function NotificationBell() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications]         = useState([]);
  const [loading, setLoading]                     = useState(false);

  useEffect(() => {
    setLoading(true);
    getNotifications()
      .then(({ notifications: ns }) => setNotifications(ns))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleMarkAsRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await markAsRead(id).catch(() => {});
  }

  async function handleMarkAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllAsRead().catch(() => {});
  }

  async function handleDeleteNotification(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await deleteNotification(id).catch(() => {});
  }

  async function handleClearAll() {
    setNotifications([]);
    await clearAllNotifications().catch(() => {});
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative flex items-center justify-center w-11 h-11 p-0 m-0 bg-transparent text-slate-700 dark:text-slate-200 border-0 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 active:scale-95 transition-all leading-none focus:outline-none"
        style={{ minWidth: 44, minHeight: 44 }}
        aria-label="Notificaciones"
      >
        <i className="bi bi-bell text-xl leading-[0]"></i>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center leading-none ring-2 ring-white dark:ring-slate-900 transition-all">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          loading={loading}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDeleteNotification={handleDeleteNotification}
          onClearAll={handleClearAll}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}
