export default function StatCard({ title, value, icon, color, change }) {
    const colorStyles = {
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100"
    };

    return (
        <div className="bg-white rounded-2xl border border-[#E0E5EB] p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#6B7280]">{title}</h3>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorStyles[color]}`}>
                    <i className={`bi ${icon} text-xl`}></i>
                </div>
            </div>
            <div className="mb-2">
                <p className="text-3xl font-bold text-[#141B21]">{value}</p>
            </div>
            <p className="text-xs text-[#9CA3AF]">{change}</p>
        </div>
    );
}