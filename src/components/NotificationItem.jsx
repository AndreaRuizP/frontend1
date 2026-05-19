export default function NotificationItem({ notification, onMarkAsRead, onDelete }) {
    const getTypeStyles = (type) => {
        switch (type) {
            case "success":
                return { 
                    bg: "bg-emerald-50 dark:bg-emerald-950/40", 
                    text: "text-emerald-700 dark:text-emerald-400", 
                    icon: "text-emerald-600 dark:text-emerald-400" 
                };
            case "warning":
                return { 
                    bg: "bg-yellow-50 dark:bg-yellow-950/40", 
                    text: "text-yellow-700 dark:text-yellow-400", 
                    icon: "text-yellow-600 dark:text-yellow-400" 
                };
            case "error":
                return { 
                    bg: "bg-red-50 dark:bg-red-950/40", 
                    text: "text-red-700 dark:text-red-400", 
                    icon: "text-red-600 dark:text-red-400" 
                };
            case "info":
            default:
                return { 
                    bg: "bg-blue-50 dark:bg-sky-950/40", 
                    text: "text-blue-700 dark:text-sky-400", 
                    icon: "text-blue-600 dark:text-sky-400" 
                };
        }
    };

    const styles = getTypeStyles(notification.type);

    return (
        <div
            className={`px-4 sm:px-5 py-3 sm:py-4 border-b border-[#E0E5EB] dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition cursor-pointer ${
                !notification.read ? "bg-blue-50/50 dark:bg-slate-800/40" : "bg-white dark:bg-slate-900"
            }`}
            onClick={() => onMarkAsRead(notification.id)}
        >
            <div className="flex items-start gap-3 sm:gap-3.5">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${styles.bg} flex items-center justify-center shrink-0`}>
                    <i className={`bi ${notification.icon} ${styles.icon} text-base sm:text-lg`}></i>
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <p className="font-semibold text-[#141B21] dark:text-slate-200 text-sm leading-tight">
                                {notification.title}
                            </p>
                            <p className="text-[11px] sm:text-xs text-[#6B7280] dark:text-slate-400 mt-1 line-clamp-2 leading-snug">
                                {notification.message}
                            </p>
                        </div>
                        {!notification.read && (
                            <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full shrink-0 mt-1"></div>
                        )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#9CA3AF] dark:text-slate-500 mt-2">{notification.timestamp}</p>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                    }}
                    className="text-[#D0D7DE] dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition shrink-0 p-1"
                    title="Eliminar"
                >
                    <i className="bi bi-x-lg text-xs sm:text-sm"></i>
                </button>
            </div>
        </div>
    );
}