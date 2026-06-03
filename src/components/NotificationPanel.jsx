import { useEffect, useRef } from "react";
import NotificationItem from "./NotificationItem";

export default function NotificationPanel({
    notifications,
    unreadCount,
    loading = false,
    onMarkAsRead,
    onMarkAllAsRead,
    onDeleteNotification,
    onClearAll,
    onClose
}) {
    const panelRef = useRef(null);
    const useScrollableList = notifications.length > 3;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={panelRef}
            className="fixed right-3 top-16 w-[min(24rem,calc(100vw-1.5rem))] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#E0E5EB] dark:border-slate-800 z-[3000] flex flex-col overflow-hidden max-h-[calc(100dvh-4.75rem)] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:bottom-auto sm:w-96 sm:max-h-96 transition-all duration-300"
        >
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-[#E0E5EB] dark:border-slate-800 shrink-0">
                <h2 className="text-base sm:text-lg font-bold text-[#141B21] dark:text-slate-100">Notificaciones</h2>
                {unreadCount > 0 && (
                    <button
                        onClick={onMarkAllAsRead}
                        className="text-[11px] sm:text-xs font-bold text-green-600 dark:text-green-400 hover:underline text-right leading-tight focus:outline-none"
                    >
                        <span className="sm:hidden">Marcar todas</span>
                        <span className="hidden sm:inline">Marcar todas como leídas</span>
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-10 px-5">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : notifications.length > 0 ? (
                <div className={`flex-1 ${useScrollableList ? "max-h-72 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800" : "overflow-visible"}`}>
                    {notifications.map(notification => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={onMarkAsRead}
                            onDelete={onDeleteNotification}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center py-10 px-5 text-center">
                    <div>
                        <i className="bi bi-inbox text-3xl text-[#D0D7DE] dark:text-slate-700 mb-2 block"></i>
                        <p className="text-[#6B7280] dark:text-slate-400 font-medium text-sm">No hay notificaciones</p>
                    </div>
                </div>
            )}

            {notifications.length > 0 && (
                <div className="border-t border-[#E0E5EB] dark:border-slate-800 px-4 sm:px-5 py-3 text-center shrink-0">
                    <button
                        onClick={onClearAll}
                        className="text-xs font-bold text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition focus:outline-none"
                    >
                        Limpiar todo
                    </button>
                </div>
            )}
        </div>
    );
}