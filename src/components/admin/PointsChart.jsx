export default function PointsChart({ data = [], loading = false }) {
    const maxValue = Math.max(...data.map(d => d.pointsDistributed), 1);

    return (
        <div className="bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 p-6 rounded-2xl shadow-sm transition-colors duration-300">
            <h3 className="text-lg font-bold text-[#141B21] dark:text-white mb-6">
                Puntos Entregados por Día
            </h3>

            {loading ? (
                <div className="h-64 flex items-end justify-between gap-2">
                    {Array(7).fill(null).map((_, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-t-lg animate-pulse" style={{ height: `${30 + Math.random() * 60}%` }} />
                            <div className="h-3 w-6 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-end justify-between h-64 gap-2">
                    {data.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div
                                className="w-full bg-yellow-100 dark:bg-amber-900/60 hover:bg-yellow-200 dark:hover:bg-amber-800/70 rounded-t-lg relative group transition-colors duration-200"
                                style={{ height: `${Math.max((item.pointsDistributed / maxValue) * 100, item.pointsDistributed > 0 ? 4 : 1)}%` }}
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#141B21] dark:bg-slate-100 text-white dark:text-slate-900 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                    {item.pointsDistributed.toLocaleString()} pts
                                </div>
                            </div>
                            <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium">
                                {item.day}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {!loading && data.every(d => d.pointsDistributed === 0) && (
                <p className="text-center text-sm text-[#6B7280] dark:text-slate-400 -mt-48">Sin datos esta semana</p>
            )}
        </div>
    );
}
