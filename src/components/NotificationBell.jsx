import { useState } from "react";
import NotificationPanel from "./NotificationPanel";

export default function NotificationBell() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "success",
            title: "¡Reciclaje Validado!",
            message: "Tu residuo fue validado correctamente. +46 CleanPoints",
            timestamp: "hace 5 minutos",
            read: false,
            icon: "bi-patch-check"
        },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const handleDeleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const handleClearAll = () => {
        setNotifications([]);
    };

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