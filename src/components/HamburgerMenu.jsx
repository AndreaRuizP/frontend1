import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function HamburgerMenu({ open, onClose }) {
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const prev = document.activeElement;
        const first = ref.current?.querySelector('a, button');
        first?.focus();

        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
            prev?.focus?.();
        };
    }, [open, onClose]);

    return (
        <div className={`fixed inset-0 z-[3000] ${open ? "" : "pointer-events-none"}`}>
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            <aside
                ref={ref}
                className={`absolute top-0 left-0 h-full bg-white dark:bg-slate-900 w-[78vw] max-w-sm shadow-2xl p-6 z-[3001] flex flex-col gap-6 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} rounded-r-2xl border-r border-transparent dark:border-slate-800`}
                aria-label="Menú principal"
                role="dialog"
                aria-modal={open}
            >
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                            CleanPoints
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        aria-label="Cerrar menú"
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition text-gray-700 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <nav className="flex-1 flex flex-col gap-2 -mt-2" aria-label="Enlaces principales">
                    <MenuLink to="/dashboard" label="Inicio" icon={HomeIcon} onClick={onClose} />
                    <MenuLink to="/map" label="Mapa" icon={MapIcon} onClick={onClose} />
                    <MenuLink to="/retos" label="Retos" icon={FireIcon} onClick={onClose} />
                    <MenuLink to="/marketplace" label="Marketplace" icon={CartIcon} onClick={onClose} />
                </nav>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                    <Link to="/profile" onClick={onClose} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-bold">
                            U
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-slate-200">Usuario</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Ver perfil</p>
                        </div>
                    </Link>
                </div>
            </aside>
        </div>
    );
}

function MenuLink({ to, label, icon: Icon, onClick }) {
    return (
        <Link 
            to={to} 
            onClick={onClick} 
            className="flex items-center gap-4 px-3 py-3 rounded-xl text-gray-900 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800/60 transition focus:outline-none focus:ring-2 focus:ring-green-600"
        >
            <span className="text-emerald-600 dark:text-emerald-400 w-10 h-10 flex items-center justify-center bg-emerald-50/50 dark:bg-slate-800 rounded-xl shrink-0">
                <Icon />
            </span>
            <span className="text-base font-semibold">{label}</span>
        </Link>
    );
}

function HomeIcon() {
    return <i className="fi fi-rr-home text-xl"></i>;
}

function MapIcon() {
    return <i className="fi fi-rr-map text-xl"></i>;
}

function FireIcon() {
    return <i className="fi fi-rr-flame text-xl"></i>;
}

function CartIcon() {
    return <i className="fi fi-rr-shopping-cart text-xl"></i>;
}