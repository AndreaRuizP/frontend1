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
                return "bg-emerald-50 border-emerald-200 text-emerald-700";
            case "error":
                return "bg-red-50 border-red-200 text-red-700";
            case "warning":
                return "bg-yellow-50 border-yellow-200 text-yellow-700";
            case "info":
            default:
                return "bg-blue-50 border-blue-200 text-blue-700";
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
        <div className={`fixed bottom-4 left-4 max-w-sm px-4 py-3 rounded-lg border ${getStyles(type)} shadow-lg flex items-center gap-3 animate-fade-in`}>
            <i className={`bi ${getIcon(type)} text-lg`}></i>
            <p className="font-medium text-sm">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false);
                    onClose?.();
                }}
                className="ml-auto text-lg hover:opacity-70 transition"
            >
                <i className="bi bi-x-lg"></i>
            </button>
        </div>
    );
}