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
            <div className="bg-white rounded-3xl shadow-sm border border-[#E0E5EB] p-5 lg:p-6">
                <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600">Vista Previa</p>
                    <h2 className="text-xl lg:text-2xl font-black text-[#141B21] mt-1">Tu Foto</h2>
                </div>
                <div className="rounded-2xl border border-[#E0E5EB] overflow-hidden mb-5 bg-gray-100 flex items-center justify-center h-64 lg:h-80">
                    <img src={photo} alt="Captura" className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onRetake}
                        className="flex-1 border border-[#D0D7DE] bg-white text-[#374151] font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
                    >
                        Retomar Foto
                    </button>
                    <button
                        onClick={onValidate}
                        disabled={isValidating}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
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
                <div className="bg-white rounded-3xl shadow-sm border border-[#E0E5EB] p-5 lg:p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                            <i className="bi bi-geo-alt-fill text-green-600 text-sm"></i>
                        </div>
                        <p className="font-bold text-[#141B21] text-sm">Información del contenedor</p>
                    </div>
                    <div className="space-y-2">
                        {rows.map(({ label, value, mono }) => (
                            <div key={label} className="flex gap-2">
                                <span className="text-xs font-semibold text-[#6B7280] w-24 shrink-0">{label}:</span>
                                <span className={`text-xs text-[#141B21] ${mono ? "font-mono" : ""}`}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
