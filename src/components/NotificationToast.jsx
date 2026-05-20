import { useEffect, useState } from "react";

export default function NotificationToast({ message, type = "success", duration = 3000, onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getStyles = (type) => {
        switch (type) {
            case "success":
                return "bg-green-50 dark:bg-slate-900 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400";
            case "error":
                return "bg-red-50 dark:bg-slate-900 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400";
            case "warning":
                return "bg-yellow-50 dark:bg-slate-900 border-yellow-200 dark:border-yellow-900/50 text-yellow-700 dark:text-yellow-400";
            case "info":
            default:
                return "bg-blue-50 dark:bg-slate-900 border-blue-200 dark:border-sky-900/50 text-blue-700 dark:text-sky-400";
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "success":
                return "bi-check-circle";
            case "error":
                return "bi-exclamation-circle";
            case "warning":
                return "bi-exclamation-triangle";
            case "info":
            default:
                return "bi-info-circle";
        }
    };

    if (!isVisible) return null;

    return (
        <div 
            className={`fixed bottom-4 left-4 max-w-sm px-4 py-3.5 rounded-xl border ${getStyles(type)} shadow-lg dark:shadow-black/40 flex items-center gap-3 z-[9999] animate-fade-in transition-all duration-300`}
        >
            <i className={`bi ${getIcon(type)} text-lg shrink-0`}></i>
            <p className="font-bold text-sm leading-snug">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false);
                    onClose?.();
                }}
                className="ml-auto text-xs opacity-50 hover:opacity-100 transition shrink-0 p-1"
                aria-label="Cerrar aviso"
            >
                <i className="bi bi-x-lg"></i>
            </button>
        </div>
    );
}