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
                className="relative flex items-center justify-center w-11 h-11 p-0 m-0 bg-transparent border-0 rounded-lg transition leading-none"
                style={{ minWidth: 44, minHeight: 44 }}
                aria-label="Notificaciones"
            >
                <i className="bi bi-bell text-xl leading-none block"></i>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
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