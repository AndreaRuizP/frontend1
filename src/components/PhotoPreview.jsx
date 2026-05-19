import { useEffect, useState } from "react";

function parseContainerQR(text) {
    const extract = (label, nextLabels) => {
        const pattern = new RegExp(
            `${label}:\\s*(.+?)(?=\\s*(?:${nextLabels.join("|")}):|\s*$)`,
            "i"
        );
        const match = text.match(pattern);
        return match ? match[1].trim() : null;
    };
    return {
        codigo: extract("Código Contenedor", ["Nombre del Contenedor", "Dirección", "Sector", "Coordenadas"]),
        nombre: extract("Nombre del Contenedor", ["Dirección", "Sector", "Coordenadas"]),
        direccion: extract("Dirección", ["Sector", "Coordenadas"]),
        sector: extract("Sector", ["Coordenadas"]),
        coordenadas: extract("Coordenadas", []),
    };
}

export default function PhotoPreview({ photo, qrCode, onRetake, onValidate, isValidating }) {
    const containerInfo = qrCode ? parseContainerQR(qrCode) : null;
    const hasInfo = containerInfo && Object.values(containerInfo).some(Boolean);

    const rows = hasInfo ? [
        { label: "Código", value: containerInfo.codigo, mono: true },
        { label: "Nombre", value: containerInfo.nombre },
        { label: "Dirección", value: containerInfo.direccion },
        { label: "Sector", value: containerInfo.sector },
        { label: "Coordenadas", value: containerInfo.coordenadas, mono: true },
    ].filter(r => r.value) : [];

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-[#E0E5EB] dark:border-slate-800 p-5 lg:p-6 transition-colors duration-300">
                <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Vista Previa</p>
                    <h2 className="text-xl lg:text-2xl font-black text-[#141B21] dark:text-slate-100 mt-1">Tu Foto</h2>
                </div>
                
                <div className="rounded-2xl border border-[#E0E5EB] dark:border-slate-800 overflow-hidden mb-5 bg-gray-100 dark:bg-slate-950 flex items-center justify-center h-64 lg:h-80 transition-colors duration-300">
                    <img src={photo} alt="Captura" className="w-full h-full object-cover" />
                </div>
                
                <div className="flex gap-3">
                    <button
                        onClick={onRetake}
                        className="flex-1 border border-[#D0D7DE] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#374151] dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                    >
                        Retomar Foto
                    </button>
                    
                    <button
                        onClick={onValidate}
                        disabled={isValidating}
                        className="flex-1 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:bg-gray-300 dark:disabled:bg-slate-800 disabled:text-gray-500 dark:disabled:text-slate-600 text-white font-bold py-3 rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isValidating ? (
                            <>
                                <i className="bi bi-hourglass-split animate-spin"></i>
                                Validando...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg"></i>
                                Validar Reciclaje
                            </>
                        )}
                    </button>
                </div>
            </div>

            {rows.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-[#E0E5EB] dark:border-slate-800 p-5 lg:p-6 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center shrink-0">
                            <i className="bi bi-geo-alt-fill text-emerald-600 dark:text-emerald-400 text-sm"></i>
                        </div>
                        <p className="font-bold text-[#141B21] dark:text-slate-200 text-sm">Información del contenedor</p>
                    </div>
                    
                    <div className="space-y-2.5">
                        {rows.map(({ label, value, mono }) => (
                            <div key={label} className="flex gap-2 items-start">
                                <span className="text-xs font-semibold text-[#6B7280] dark:text-slate-400 w-24 shrink-0 pt-0.5">{label}:</span>
                                <span className={`text-xs text-[#141B21] dark:text-slate-200 leading-relaxed ${mono ? "font-mono text-emerald-700 dark:text-emerald-400" : ""}`}>
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}