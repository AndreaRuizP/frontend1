import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import QRChart from "./QRChart";
import PointsChart from "./PointsChart";
import { getKPIs, getDailyStats } from "../../api/admin";

export default function AdminStats() {
    const [kpis, setKpis] = useState(null);
    const [dailyData, setDailyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getKPIs(), getDailyStats(7)])
            .then(([k, d]) => {
                console.log("Daily data received:", d);
                console.log("Is array:", Array.isArray(d));
                console.log("Data length:", d?.length);
                console.log("First item:", d?.[0]);
                setKpis(k);
                setDailyData(d);
            })
            .catch(err => {
                console.error("Error fetching stats:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    const stats = kpis
        ? [
            { title: "Usuarios Activos", value: kpis.activeUsers.toLocaleString(), icon: "bi-people-fill", color: "emerald" },
            { title: "QR Escaneados", value: kpis.totalQRScans.toLocaleString(), icon: "bi-qr-code-scan", color: "blue" },
            { title: "Puntos Entregados", value: kpis.totalPointsDistributed.toLocaleString(), icon: "bi-star-fill", color: "yellow" },
            { title: "Productos Canjeados", value: kpis.totalItemsRedeemed.toLocaleString(), icon: "bi-bag-check-fill", color: "purple" },
        ]
        : Array(4).fill(null);

    return (
        <div className="p-4 lg:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) =>
                    loading || !stat ? (
                        <div key={index} className="h-28 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                    ) : (
                        <StatCard key={index} {...stat} />
                    )
                )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QRChart data={dailyData} loading={loading} />
                <PointsChart data={dailyData} loading={loading} />
            </div>
        </div>
    );
}
