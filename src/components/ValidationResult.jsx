import { useNavigate } from "react-router-dom";

export default function ValidationResult({ success = true, points = 0, title = "Resultado", message = "" }) {
    const navigate = useNavigate();

    const ok = success;

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className={`bg-white dark:bg-slate-900 rounded-3xl shadow-sm border p-8 lg:p-10 text-center transition-colors duration-300 ${
                ok ? "border-green-100 dark:border-slate-800" : "border-red-100 dark:border-red-900/30"
            }`}>

                <h2 className={`text-3xl lg:text-4xl font-black mb-2 ${
                    ok ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}>
                    Resultado de Validación
                </h2>
                <p className={`text-lg font-bold mb-6 ${
                    ok ? "text-green-600 dark:text-green-500" : "text-red-500 dark:text-red-400"
                }`}>
                    {ok ? "¡Felicitaciones!" : "No fue posible validar"}
                </p>

                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    {ok ? (
                        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="45" className="stroke-green-600 dark:stroke-green-400" strokeWidth="3" />
                            <path d="M35 50L45 60L65 40" className="stroke-green-600 dark:stroke-green-400" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="45" className="stroke-red-500 dark:stroke-red-400" strokeWidth="3" />
                            <path d="M35 35L65 65M65 35L35 65" className="stroke-red-500 dark:stroke-red-400" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                    )}
                </div>

                <h3 className={`text-2xl lg:text-3xl font-bold mb-6 ${
                    ok ? "text-green-950 dark:text-slate-100" : "text-red-700 dark:text-slate-100"
                }`}>
                    {title}
                </h3>

                {ok && (
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-200 dark:border-green-900/40 px-6 py-4 mb-6 inline-block transition-colors duration-300">
                        <p className="text-green-700 dark:text-green-400 font-bold text-lg flex items-center justify-center gap-2">
                            <i className="bi bi-trophy-fill text-xl text-amber-500 dark:text-amber-400 animate-bounce"></i>
                            +{points} CleanPoints
                        </p>
                    </div>
                )}

                <p className={`font-medium mb-8 max-w-md mx-auto leading-relaxed ${
                    ok ? "text-green-800 dark:text-slate-300" : "text-red-600 dark:text-slate-300"
                }`}>
                    {message}
                </p>

                <div className="flex flex-col gap-3 max-w-sm mx-auto">
                    <button
                        onClick={() => navigate("/scan")}
                        className={`w-full text-white font-bold py-3.5 rounded-xl transition active:scale-95 flex items-center justify-center gap-2 focus:outline-none shadow-sm ${
                            ok
                                ? "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600"
                                : "bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-600"
                        }`}
                    >
                        <i className="bi bi-arrow-repeat text-base"></i>
                        {ok ? "Escanear Otro" : "Intentar de Nuevo"}
                    </button>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className={`w-full font-bold py-3.5 rounded-xl transition active:scale-95 flex items-center justify-center gap-2 focus:outline-none border ${
                            ok
                                ? "bg-green-50 dark:bg-slate-800/50 hover:bg-green-100 dark:hover:bg-slate-800 text-green-700 dark:text-slate-200 border-green-200 dark:border-slate-700"
                                : "bg-red-50 dark:bg-slate-800/50 hover:bg-red-100 dark:hover:bg-slate-800 text-red-600 dark:text-slate-200 border-red-200 dark:border-slate-700"
                        }`}
                    >
                        <i className="bi bi-house"></i>
                        Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
}
