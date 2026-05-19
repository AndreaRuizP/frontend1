import { useState } from "react";
import { sanitizeInput } from "../../utils/security";

export default function ReportsList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [reports] = useState([
        {
            id: 1,
            title: "Contenedor lleno",
            description: "El contenedor verde en la Cra. 5 está completamente lleno.",
            user: "Juan García",
            email: "juan@email.com",
            location: "Cra. 5 #10-45",
            date: "2024-02-18",
            status: "pending",
            priority: "high"
        },
        {
            id: 2,
            title: "Material incorrecto detectado",
            description: "Se detectó material peligroso en contenedor de plástico.",
            user: "María López",
            email: "maria@email.com",
            location: "Calle 8 #2-30",
            date: "2024-02-18",
            status: "in-progress",
            priority: "urgent"
        },
        {
            id: 3,
            title: "QR dañado",
            description: "El código QR del contenedor está rayado y no se puede escanear.",
            user: "Carlos Rodríguez",
            email: "carlos@email.com",
            location: "Av. Principal #50",
            date: "2024-02-17",
            status: "resolved",
            priority: "medium"
        },
        {
            id: 4,
            title: "Contenedor desaparecido",
            description: "El contenedor de la esquina no se encuentra en su ubicación.",
            user: "Ana Martínez",
            email: "ana@email.com",
            location: "Parque Central",
            date: "2024-02-16",
            status: "pending",
            priority: "urgent"
        }
    ]);

    const filteredReports = reports.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-50 text-yellow-700 border-yellow-100";
            case "in-progress":
                return "bg-blue-50 text-blue-700 border-blue-100";
            case "resolved":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            default:
                return "bg-gray-50 text-gray-700 border-gray-100";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "pending":
                return "Pendiente";
            case "in-progress":
                return "En Progreso";
            case "resolved":
                return "Resuelto";
            default:
                return status;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "urgent":
                return "text-red-600";
            case "high":
                return "text-orange-600";
            case "medium":
                return "text-yellow-600";
            default:
                return "text-gray-600";
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case "urgent":
                return "Urgente";
            case "high":
                return "Alta";
            case "medium":
                return "Media";
            default:
                return priority;
        }
    };

    return (
        <div className="space-y-6">
            <div className="relative">
                <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]"></i>
                <input
                    type="text"
                    placeholder="Buscar reporte por título o usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(sanitizeInput(e.target.value))}
                    maxLength={100}
                    className="w-full pl-12 pr-4 py-3 border border-[#E0E5EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent"
                />
            </div>
            <div className="space-y-4">
                {filteredReports.map(report => (
                    <div key={report.id} className="bg-white rounded-2xl border border-[#E0E5EB] p-4 sm:p-6 hover:shadow-md transition">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-bold text-[#141B21] mb-1 sm:mb-2">{report.title}</h3>
                                <p className="text-[#6B7280] text-sm sm:text-base mb-3 sm:mb-4">{report.description}</p>
                                <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
                                    <div>
                                        <p className="text-[#9CA3AF] text-xs">Usuario</p>
                                        <p className="font-semibold text-[#141B21]">{report.user}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#9CA3AF] text-xs">Ubicación</p>
                                        <p className="font-semibold text-[#141B21]">{report.location}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#9CA3AF] text-xs">Fecha</p>
                                        <p className="font-semibold text-[#141B21]">{new Date(report.date).toLocaleDateString("es-ES")}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row sm:flex-col gap-2 sm:ml-4 shrink-0">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)} text-center whitespace-nowrap`}>
                                    {getStatusLabel(report.status)}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-center whitespace-nowrap border ${
                                    report.priority === "urgent" ? "bg-red-50 border-red-100" :
                                    report.priority === "high" ? "bg-orange-50 border-orange-100" :
                                    "bg-yellow-50 border-yellow-100"
                                }`}>
                                    <i className={`bi bi-exclamation-circle mr-1 ${getPriorityColor(report.priority)}`}></i>
                                    {getPriorityLabel(report.priority)}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 sm:gap-3">
                            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-[#199A61] text-white font-semibold rounded-lg hover:bg-[#178353] transition text-xs sm:text-sm text-center">
                                Ver Detalles
                            </button>
                            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-[#D0D7DE] text-[#141B21] font-semibold rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm text-center">
                                Contactar Usuario
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {filteredReports.length === 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                    <p className="text-blue-700 font-semibold">No se encontraron reportes</p>
                </div>
            )}
        </div>
    );
}