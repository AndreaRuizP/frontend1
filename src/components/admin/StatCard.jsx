export default function StatCard({ title, value, icon, color, change }) {
    const colorStyles = {
        emerald: "bg-green-50 text-green-600 border-green-100 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/50",
        blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-900/50",
        purple: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50"
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E0E5EB] dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#6B7280] dark:text-slate-400">
                    {title}
                </h3>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorStyles[color]}`}>
                    <i className={`bi ${icon} text-xl`}></i>
                </div>
            </div>
            
            <div className="mb-2">
                <p className="text-3xl font-bold text-[#141B21] dark:text-white">
                    {value}
                </p>
            </div>
            
            <p className="text-xs text-[#9CA3AF] dark:text-slate-500 font-medium">
                {change}
            </p>
        </div>
    );
}