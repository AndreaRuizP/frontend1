import { useEffect, useRef } from "react";
import NotificationItem from "./NotificationItem";

export default function NotificationPanel({
    notifications,
    unreadCount,
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
            className="fixed right-3 top-16 w-[min(24rem,calc(100vw-1.5rem))] bg-white rounded-2xl shadow-2xl border border-[#E0E5EB] z-[3000] flex flex-col overflow-hidden max-h-[calc(100dvh-4.75rem)] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:bottom-auto sm:w-96 sm:max-h-96"
        >
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-[#E0E5EB] shrink-0">
                <h2 className="text-base sm:text-lg font-bold text-[#141B21]">Notificaciones</h2>
                {unreadCount > 0 && (
                    <button
                        onClick={onMarkAllAsRead}
                        className="text-[11px] sm:text-xs font-semibold text-green-600 hover:underline text-right leading-tight"
                    >
                        <span className="sm:hidden">Marcar todas</span>
                        <span className="hidden sm:inline">Marcar todas como leídas</span>
                    </button>
                )}
            </div>
            {notifications.length > 0 ? (
                <div className={`flex-1 ${useScrollableList ? "max-h-72 overflow-y-auto overscroll-contain" : "overflow-visible"}`}>
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
                <div className="flex items-center justify-center py-8 px-5 text-center">
                    <div>
                        <i className="bi bi-inbox text-3xl text-[#D0D7DE] mb-2 block"></i>
                        <p className="text-[#6B7280] font-medium text-sm">No hay notificaciones</p>
                    </div>
                </div>
            )}
            {notifications.length > 0 && (
                <div className="border-t border-[#E0E5EB] px-4 sm:px-5 py-3 text-center shrink-0">
                    <button
                        onClick={onClearAll}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 transition"
                    >
                        Limpiar todo
                    </button>
                </div>
            )}
        </div>
    );
}