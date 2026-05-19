export default function QRDetectedPrompt({ onOpenCamera }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-[#E0E5EB] dark:border-slate-800 p-5 lg:p-6 transition-colors duration-300">
            <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Siguiente Paso</p>
                    <h2 className="text-xl lg:text-2xl font-black text-[#141B21] dark:text-slate-100 mt-1">Captura tu reciclaje</h2>
                    <p className="text-sm lg:text-base text-[#6B7280] dark:text-slate-400 mt-2 leading-6 max-w-xl">
                        Contenedor verificado. Ahora toma una foto de tu residuo para validar la acción.
                    </p>
                </div>
                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 items-center justify-center shrink-0">
                    <i className="bi bi-camera text-2xl text-emerald-600 dark:text-emerald-400"></i>
                </div>
            </div>

            <div className="rounded-3xl border border-dashed border-[#C9D3DD] dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-950/40 px-5 py-8 lg:py-10 flex flex-col items-center text-center transition-colors duration-300">
                <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-800 shadow-sm flex items-center justify-center mb-4">
                    <i className="bi bi-camera text-4xl text-emerald-600 dark:text-emerald-400"></i>
                </div>
                <p className="font-bold text-[#141B21] dark:text-slate-200 text-base lg:text-lg">Abre la cámara</p>
                <p className="text-sm text-[#6B7280] dark:text-slate-400 mt-2 max-w-md leading-6">
                    Toma una foto clara de tu reciclaje para que sea validada correctamente.
                </p>

                <button
                    onClick={onOpenCamera}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 dark:bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 dark:hover:bg-emerald-600 active:scale-95 focus:outline-none"
                    style={{ minHeight: 44 }}
                >
                    <i className="bi bi-camera-fill text-lg"></i>
                    Abrir Cámara
                </button>
            </div>
        </div>
    );
}