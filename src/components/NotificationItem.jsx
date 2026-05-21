const TYPE_MAP = {
  REPORT_VALIDATED:    { bg: "bg-emerald-50 dark:bg-emerald-950/40",  icon: "bi-recycle",            color: "text-emerald-600 dark:text-emerald-400" },
  CHALLENGE_COMPLETED: { bg: "bg-amber-50 dark:bg-amber-950/40",      icon: "bi-trophy-fill",         color: "text-amber-500 dark:text-amber-400"    },
  POINTS_EARNED:       { bg: "bg-blue-50 dark:bg-sky-950/40",         icon: "bi-lightning-charge-fill",color: "text-blue-600 dark:text-sky-400"       },
  ITEM_REDEEMED:       { bg: "bg-purple-50 dark:bg-purple-950/40",    icon: "bi-bag-check-fill",      color: "text-purple-500 dark:text-purple-400"  },
};

const DEFAULT_STYLE = { bg: "bg-gray-50 dark:bg-slate-800", icon: "bi-bell-fill", color: "text-gray-500 dark:text-slate-400" };

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)    return "Hace un momento";
  if (diff < 3600)  return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  const days = Math.floor(diff / 86400);
  return days === 1 ? "Ayer" : `Hace ${days} días`;
}

export default function NotificationItem({ notification, onMarkAsRead, onDelete }) {
  const s = TYPE_MAP[notification.type] ?? DEFAULT_STYLE;

  return (
    <div
      className={`px-4 sm:px-5 py-3 sm:py-4 border-b border-[#E0E5EB] dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition cursor-pointer ${
        !notification.read ? "bg-blue-50/50 dark:bg-slate-800/40" : "bg-white dark:bg-slate-900"
      }`}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-3 sm:gap-3.5">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${s.bg} flex items-center justify-center shrink-0`}>
          <i className={`bi ${s.icon} ${s.color} text-base sm:text-lg`}></i>
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
          <p className="text-[11px] sm:text-xs text-[#9CA3AF] dark:text-slate-500 mt-2">
            {notification.createdAt ? timeAgo(notification.createdAt) : ""}
          </p>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
          className="text-[#D0D7DE] dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition shrink-0 p-1"
          title="Eliminar"
        >
          <i className="bi bi-x-lg text-xs sm:text-sm"></i>
        </button>
      </div>
    </div>
  );
}
