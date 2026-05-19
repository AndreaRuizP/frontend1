import { useState } from "react";
import { sanitizeInput } from "../../utils/security";

const initialChallenges = [
    { id: 1, title: "Recicla 10 veces", description: "Escanea 10 contenedores esta semana para ganar puntos extra.", points: 500, startDate: "2024-03-01", endDate: "2024-03-31", status: "active" },
    { id: 2, title: "Madrugador Ecológico", description: "Realiza 3 escaneos antes de las 9am en un mismo día.", points: 300, startDate: "2024-03-01", endDate: "2024-03-15", status: "active" },
    { id: 3, title: "Guerrero del Reciclaje", description: "Acumula 5000 puntos en el mes para obtener una recompensa especial.", points: 1000, startDate: "2024-02-01", endDate: "2024-02-29", status: "inactive" },
    { id: 4, title: "Explora tu Ciudad", description: "Escanea contenedores en al menos 3 zonas diferentes.", points: 400, startDate: "2024-04-01", endDate: "2024-04-30", status: "active" },
];

const emptyForm = { title: "", description: "", points: "", startDate: "", endDate: "", status: "active" };

export default function ChallengesList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [challenges, setChallenges] = useState(initialChallenges);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [toDelete, setToDelete] = useState(null);
    const [errors, setErrors] = useState({});

    const filtered = challenges.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setErrors({});
        setShowForm(true);
    };

    const openEdit = (challenge) => {
        setEditing(challenge);
        setForm({ title: challenge.title, description: challenge.description, points: challenge.points, startDate: challenge.startDate, endDate: challenge.endDate, status: challenge.status });
        setErrors({});
        setShowForm(true);
    };

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = "El título es requerido";
        if (!form.description.trim()) e.description = "La descripción es requerida";
        if (!form.points || isNaN(form.points) || Number(form.points) <= 0) e.points = "Los puntos deben ser un número positivo";
        if (!form.startDate) e.startDate = "La fecha de inicio es requerida";
        if (!form.endDate) e.endDate = "La fecha de fin es requerida";
        if (form.startDate && form.endDate && form.endDate < form.startDate) e.endDate = "La fecha de fin debe ser posterior a la de inicio";
        return e;
    };

    const handleSave = () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }

        if (editing) {
            setChallenges(prev => prev.map(c => c.id === editing.id ? { ...c, ...form, points: Number(form.points) } : c));
        } else {
            setChallenges(prev => [...prev, { id: Date.now(), ...form, points: Number(form.points) }]);
        }
        setShowForm(false);
    };

    const handleDelete = () => {
        setChallenges(prev => prev.filter(c => c.id !== toDelete.id));
        setToDelete(null);
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: field === "startDate" || field === "endDate" ? value : sanitizeInput(value) }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="relative flex-1 min-w-0">
                    <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]"></i>
                    <input
                        type="text"
                        placeholder="Buscar reto por título o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(sanitizeInput(e.target.value))}
                        maxLength={100}
                        className="w-full pl-12 pr-4 py-3 border border-[#E0E5EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent"
                    />
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-3 bg-[#199A61] hover:bg-[#178353] text-white font-semibold rounded-xl transition shrink-0"
                >
                    <i className="bi bi-plus-lg"></i>
                    Crear Reto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(c => (
                    <div key={c.id} className="bg-white rounded-2xl border border-[#E0E5EB] shadow-sm p-5 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#199A61]/10 flex items-center justify-center shrink-0">
                                    <i className="bi bi-trophy text-[#199A61] text-lg"></i>
                                </div>
                                <div>
                                    <p className="font-bold text-[#141B21]">{c.title}</p>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                                        {c.status === "active" ? "Activo" : "Inactivo"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <span className="font-bold text-[#199A61]">{Number(c.points).toLocaleString()}</span>
                                <span className="text-xs text-[#6B7280]">pts</span>
                            </div>
                        </div>
                        <p className="text-sm text-[#6B7280]">{c.description}</p>
                        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                            <span><i className="bi bi-calendar mr-1"></i>{new Date(c.startDate).toLocaleDateString("es-ES")}</span>
                            <span><i className="bi bi-arrow-right mr-1"></i>{new Date(c.endDate).toLocaleDateString("es-ES")}</span>
                        </div>
                        <div className="flex items-center gap-3 pt-2 border-t border-[#E0E5EB]">
                            <button
                                onClick={() => openEdit(c)}
                                className="text-[#199A61] hover:text-[#178353] font-semibold text-sm transition"
                            >
                                <i className="bi bi-pencil mr-1"></i>Editar
                            </button>
                            <button
                                onClick={() => setToDelete(c)}
                                className="text-red-500 hover:text-red-700 font-semibold text-sm transition"
                            >
                                <i className="bi bi-trash mr-1"></i>Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <p className="text-[#199A61] font-semibold">
                    Mostrando {filtered.length} de {challenges.length} retos
                </p>
            </div>

            {/* Modal: Formulario Creación/Edición */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#141B21]">
                                {editing ? "Editar Reto" : "Crear Reto"}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="text-[#6B7280] hover:text-[#141B21] transition">
                                <i className="bi bi-x-lg text-xl"></i>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] mb-1">Título *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    maxLength={100}
                                    placeholder="Ej. Recicla 10 veces"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent ${errors.title ? "border-red-400" : "border-[#E0E5EB]"}`}
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] mb-1">Descripción *</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    maxLength={300}
                                    rows={3}
                                    placeholder="Describe el reto..."
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent resize-none ${errors.description ? "border-red-400" : "border-[#E0E5EB]"}`}
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] mb-1">Puntos *</label>
                                <input
                                    type="number"
                                    value={form.points}
                                    onChange={(e) => handleChange("points", e.target.value)}
                                    min={1}
                                    placeholder="Ej. 500"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent ${errors.points ? "border-red-400" : "border-[#E0E5EB]"}`}
                                />
                                {errors.points && <p className="text-red-500 text-xs mt-1">{errors.points}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] mb-1">Fecha Inicio *</label>
                                    <input
                                        type="date"
                                        value={form.startDate}
                                        onChange={(e) => handleChange("startDate", e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent ${errors.startDate ? "border-red-400" : "border-[#E0E5EB]"}`}
                                    />
                                    {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] mb-1">Fecha Fin *</label>
                                    <input
                                        type="date"
                                        value={form.endDate}
                                        onChange={(e) => handleChange("endDate", e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent ${errors.endDate ? "border-red-400" : "border-[#E0E5EB]"}`}
                                    />
                                    {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] mb-1">Estado</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full px-4 py-3 border border-[#E0E5EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent bg-white"
                                >
                                    <option value="active">Activo</option>
                                    <option value="inactive">Inactivo</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowForm(false)}
                                className="flex-1 py-3 border border-[#E0E5EB] text-[#141B21] font-semibold rounded-xl hover:bg-[#F9FAFB] transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-3 bg-[#199A61] hover:bg-[#178353] text-white font-semibold rounded-xl transition"
                            >
                                {editing ? "Guardar Cambios" : "Crear Reto"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Confirmar Eliminación */}
            {toDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                                <i className="bi bi-trash text-3xl text-red-500"></i>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-[#141B21] text-center mb-2">Eliminar Reto</h3>
                        <p className="text-[#6B7280] text-center mb-6">
                            ¿Estás seguro de que deseas eliminar el reto <span className="font-semibold text-[#141B21]">"{toDelete.title}"</span>? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setToDelete(null)}
                                className="flex-1 py-3 border border-[#E0E5EB] text-[#141B21] font-semibold rounded-xl hover:bg-[#F9FAFB] transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
