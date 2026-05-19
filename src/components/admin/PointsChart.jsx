export default function PointsChart() {
    const data = [
        { day: "Lun", points: 45200 },
        { day: "Mar", points: 52300 },
        { day: "Mié", points: 48900 },
        { day: "Jue", points: 61200 },
        { day: "Vie", points: 72400 },
        { day: "Sáb", points: 58600 },
        { day: "Dom", points: 38900 }
    ];

    const maxValue = Math.max(...data.map(d => d.points));

    return (
        <div className="bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 p-6 rounded-2xl shadow-sm transition-colors duration-300">
            <h3 className="text-lg font-bold text-[#141B21] dark:text-white mb-6">
                Puntos Entregados por Día
            </h3>
            
            <div className="flex items-end justify-between h-64 gap-2">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                            className="w-full bg-yellow-100 dark:bg-amber-900/60 rounded-t-lg relative group transition-colors duration-300" 
                            style={{ height: `${(item.points / maxValue) * 100}%` }}
                        >
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#141B21] dark:bg-slate-100 text-white dark:text-slate-900 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                {item.points.toLocaleString()}
                            </div>
                        </div>
                        <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium">
                            {item.day}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}