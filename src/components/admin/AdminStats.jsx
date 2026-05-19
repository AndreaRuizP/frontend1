import StatCard from "./StatCard";
import QRChart from "./QRChart";
import PointsChart from "./PointsChart";

export default function AdminStats() {
    const stats = [
        {
            title: "Usuarios Totales",
            value: "2,543",
            icon: "bi-people-fill",
            color: "emerald",
            change: "+12% este mes"
        },
        {
            title: "QR Escaneados",
            value: "18,492",
            icon: "bi-qr-code-scan",
            color: "blue",
            change: "+234 hoy"
        },
        {
            title: "Puntos Entregados",
            value: "856,340",
            icon: "bi-star-fill",
            color: "yellow",
            change: "+45,230 hoy"
        },
        {
            title: "Productos Canjeados",
            value: "1,247",
            icon: "bi-bag-check-fill",
            color: "purple",
            change: "+89 hoy"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QRChart />
                <PointsChart />
            </div>
        </div>
    );
}