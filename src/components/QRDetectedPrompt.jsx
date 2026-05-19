export default function QRDetectedPrompt({ onOpenCamera }) {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-[#E0E5EB] p-5 lg:p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600">Siguiente Paso</p>
                    <h2 className="text-xl lg:text-2xl font-black text-[#141B21] mt-1">Captura tu reciclaje</h2>
                    <p className="text-sm lg:text-base text-[#6B7280] mt-2 leading-6 max-w-xl">
                        Contenedor verificado. Ahora toma una foto de tu residuo para validar la acción.
                    </p>
                </div>
                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-green-50 border border-green-100 items-center justify-center shrink-0">
                    <i className="bi bi-camera text-2xl text-green-600"></i>
                </div>
            </div>

            <div className="rounded-3xl border border-dashed border-[#C9D3DD] bg-[#f8fafc] px-5 py-8 lg:py-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-white border border-green-100 shadow-sm flex items-center justify-center mb-4">
                    <i className="bi bi-camera text-4xl text-green-600"></i>
                </div>
                <p className="font-bold text-[#141B21] text-base lg:text-lg">Abre la cámara</p>
                <p className="text-sm text-[#6B7280] mt-2 max-w-md leading-6">
                    Toma una foto clara de tu reciclaje para que sea validada correctamente.
                </p>

                <button
                    onClick={onOpenCamera}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-95"
                    style={{ minHeight: 44 }}
                >
                    <i className="bi bi-camera-fill text-lg"></i>
                    Abrir Cámara
                </button>
            </div>
        </div>
    );
}
