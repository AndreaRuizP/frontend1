export default function QRChart() {
    const data = [
        { day: "Lun", qrs: 2400 },
        { day: "Mar", qrs: 2800 },
        { day: "Mié", qrs: 2200 },
        { day: "Jue", qrs: 3100 },
        { day: "Vie", qrs: 3500 },
        { day: "Sáb", qrs: 2900 },
        { day: "Dom", qrs: 1800 }
    ];

    const maxValue = Math.max(...data.map(d => d.qrs));

    return (
        <div className="bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 p-6 rounded-2xl shadow-sm transition-colors duration-300">
            <h3 className="text-lg font-bold text-[#141B21] dark:text-white mb-6">
                QR Escaneados por Día
            </h3>
            
            <div className="flex items-end justify-between h-64 gap-2">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                            className="w-full bg-emerald-100 dark:bg-emerald-900/60 rounded-t-lg relative group transition-colors duration-300" 
                            style={{ height: `${(item.qrs / maxValue) * 100}%` }}
                        >
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#141B21] dark:bg-slate-100 text-white dark:text-slate-900 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                {item.qrs.toLocaleString()}
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