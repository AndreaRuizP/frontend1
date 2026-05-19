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
            <div className="bg-white rounded-3xl shadow-sm border border-green-100 p-8 lg:p-10 text-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-green-700 mb-2">
                    Resultado de Validación
                </h2>
                <p className="text-lg text-green-600 mb-6">¡Felicitaciones!</p>
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="45" stroke="#16a34a" strokeWidth="3" />
                        <path d="M35 50L45 60L65 40" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-green-950 mb-6">
                    {title}
                </h3>

                {/* Puntos */}
                <div className="bg-green-50 rounded-2xl border border-green-200 px-4 py-4 mb-6 inline-block">
                    <p className="text-green-700 font-semibold text-lg">
                        <i className="bi bi-trophy mr-2"></i>
                        +{points} CleanPoints
                    </p>
                </div>

                <p className="text-green-800 mb-8">{message}</p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleNewScan}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
                    >
                        <i className="bi bi-arrow-repeat"></i>
                        Escanear Otro
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="w-full bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-semibold py-3 rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
                    >
                        <i className="bi bi-house"></i>
                        Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
}