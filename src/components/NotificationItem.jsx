export default function NotificationItem({ notification, onMarkAsRead, onDelete }) {
    const getTypeStyles = (type) => {
        switch (type) {
            case "success":
                return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "text-emerald-600" };
            case "warning":
                return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: "text-yellow-600" };
            case "error":
                return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "text-red-600" };
            case "info":
            default:
                return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "text-blue-600" };
        }
    };

    const styles = getTypeStyles(notification.type);

    return (
        <div
            className={`px-4 sm:px-5 py-3 sm:py-4 border-b border-[#E0E5EB] hover:bg-gray-50 transition cursor-pointer ${
                !notification.read ? "bg-blue-50" : ""
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
                            <p className="font-semibold text-[#141B21] text-sm sm:text-sm leading-tight">
                                {notification.title}
                            </p>
                            <p className="text-[11px] sm:text-xs text-[#6B7280] mt-1 line-clamp-2 sm:line-clamp-2 leading-snug">
                                {notification.message}
                            </p>
                        </div>
                        {!notification.read && (
                            <div className="w-2 h-2 bg-green-600 rounded-full shrink-0 mt-1"></div>
                        )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#9CA3AF] mt-2">{notification.timestamp}</p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                    }}
                    className="text-[#D0D7DE] hover:text-red-500 transition shrink-0 p-1"
                    title="Eliminar"
                >
                    <i className="bi bi-x-lg text-sm sm:text-base"></i>
                </button>
            </div>
        </div>
    );
}