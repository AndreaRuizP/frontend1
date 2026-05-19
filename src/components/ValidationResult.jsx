import { useNavigate } from "react-router-dom";

export default function ValidationResult({ points = 46, title = "¡Reciclaje Validado!", message = "Material reciclable detectado correctamente" }) {
    const navigate = useNavigate();

    const handleNewScan = () => {
        navigate("/scan-qr");
    };

    const handleGoHome = () => {
        navigate("/dashboard");
    };

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-green-100 dark:border-slate-800 p-8 lg:p-10 text-center transition-colors duration-300">
                
                <h2 className="text-3xl lg:text-4xl font-black text-emerald-700 dark:text-emerald-400 mb-2">
                    Resultado de Validación
                </h2>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-500 mb-6">¡Felicitaciones!</p>
                
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="45" className="stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="3" />
                        <path d="M35 50L45 60L65 40" className="stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-green-950 dark:text-slate-100 mb-6">
                    {title}
                </h3>

                <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 px-6 py-4 mb-6 inline-block transition-colors duration-300">
                    <p className="text-emerald-700 dark:text-emerald-400 font-bold text-lg flex items-center justify-center gap-2">
                        <i className="bi bi-trophy-fill text-xl text-amber-500 dark:text-amber-400 animate-bounce"></i>
                        +{points} CleanPoints
                    </p>
                </div>

                <p className="text-emerald-800 dark:text-slate-300 font-medium mb-8 max-w-md mx-auto leading-relaxed">{message}</p>

                <div className="flex flex-col gap-3 max-w-sm mx-auto">
                    <button
                        onClick={handleNewScan}
                        className="w-full bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition active:scale-95 flex items-center justify-center gap-2 focus:outline-none shadow-sm"
                    >
                        <i className="bi bi-arrow-repeat text-base"></i>
                        Escanear Otro
                    </button>
                    
                    <button
                        onClick={handleGoHome}
                        className="w-full bg-emerald-50 dark:bg-slate-800/50 hover:bg-emerald-100 dark:hover:bg-slate-800 text-emerald-700 dark:text-slate-200 border border-emerald-200 dark:border-slate-700 font-bold py-3.5 rounded-xl transition active:scale-95 flex items-center justify-center gap-2 focus:outline-none"
                    >
                        <i className="bi bi-house"></i>
                        Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
}