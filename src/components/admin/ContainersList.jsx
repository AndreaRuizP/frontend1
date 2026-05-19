import { useState } from "react";
import { sanitizeInput } from "../../utils/security";

const initialContainers = [
    { id: 1, name: "Contenedor Norte", location: "Calle 10 #5-20", type: "Reciclaje", capacity: 100, currentLevel: 75, status: "active", qrCode: "QR-001" },
    { id: 2, name: "Contenedor Centro", location: "Carrera 7 #15-30", type: "Orgánico", capacity: 80, currentLevel: 40, status: "active", qrCode: "QR-002" },
    { id: 3, name: "Contenedor Sur", location: "Av. 68 #22-10", type: "Reciclaje", capacity: 120, currentLevel: 95, status: "full", qrCode: "QR-003" },
    { id: 4, name: "Contenedor Parque", location: "Parque Principal", type: "General", capacity: 60, currentLevel: 10, status: "active", qrCode: "QR-004" },
    { id: 5, name: "Contenedor Inactivo", location: "Calle 45 #8-15", type: "Reciclaje", capacity: 100, currentLevel: 0, status: "inactive", qrCode: "QR-005" },
];

const emptyForm = { name: "", location: "", type: "Reciclaje", capacity: "", qrCode: "", status: "active" };

const statusConfig = {
    active: { label: "Activo", classes: "bg-emerald-50 text-emerald-700" },
    full: { label: "Lleno", classes: "bg-amber-50 text-amber-700" },
    inactive: { label: "Inactivo", classes: "bg-gray-100 text-gray-700" },
};

export default function ContainersList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [containers, setContainers] = useState(initialContainers);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [toDelete, setToDelete] = useState(null);
    const [errors, setErrors] = useState({});

    const filtered = containers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setErrors({});
        setShowForm(true);
    };

    const openEdit = (container) => {
        setEditing(container);
        setForm({ name: container.name, location: container.location, type: container.type, capacity: container.capacity, qrCode: container.qrCode, status: container.status });
        setErrors({});
        setShowForm(true);
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "El nombre es requerido";
        if (!form.location.trim()) e.location = "La ubicación es requerida";
        if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) <= 0) e.capacity = "Capacidad debe ser un número positivo";
        if (!form.qrCode.trim()) e.qrCode = "El código QR es requerido";
        return e;
    };

    const handleSave = () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }

        if (editing) {
            setContainers(prev => prev.map(c => c.id === editing.id ? { ...c, ...form, capacity: Number(form.capacity) } : c));
        } else {
            const newContainer = { id: Date.now(), ...form, capacity: Number(form.capacity), currentLevel: 0 };
            setContainers(prev => [...prev, newContainer]);
        }
        setShowForm(false);
    };

    const handleDelete = () => {
        setContainers(prev => prev.filter(c => c.id !== toDelete.id));
        setToDelete(null);
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: sanitizeInput(value) }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="relative flex-1 min-w-0">
                    <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]"></i>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o ubicación..."
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
                    <span className="hidden sm:inline">Registrar Contenedor</span>
                    <span className="sm:hidden">Registrar</span>
                </button>
            </div>

            {/* Mobile: card list */}
            <div className="flex flex-col gap-3 sm:hidden">
                {filtered.map(c => {
                    const levelPct = Math.round((c.currentLevel / c.capacity) * 100);
                    return (
                        <div key={c.id} className="bg-white rounded-2xl border border-[#E0E5EB] shadow-sm p-4">
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div>
                                    <p className="font-semibold text-[#141B21]">{c.name}</p>
                                    <p className="text-xs text-[#6B7280]">{c.location}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${statusConfig[c.status]?.classes ?? "bg-gray-100 text-gray-700"}`}>
                                    {statusConfig[c.status]?.label ?? c.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                <div className="bg-[#F9FAFB] rounded-xl p-2">
                                    <p className="text-xs text-[#6B7280]">Tipo</p>
                                    <p className="font-semibold text-[#141B21]">{c.type}</p>
                                </div>
                                <div className="bg-[#F9FAFB] rounded-xl p-2">
                                    <p className="text-xs text-[#6B7280]">Código QR</p>
                                    <p className="font-mono font-semibold text-[#141B21]">{c.qrCode}</p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <p className="text-xs text-[#6B7280] mb-1">Nivel de llenado</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-[#E0E5EB] rounded-full h-2">
                                        <div className={`h-2 rounded-full ${levelPct >= 90 ? "bg-red-500" : levelPct >= 60 ? "bg-amber-400" : "bg-[#199A61]"}`} style={{ width: `${levelPct}%` }} />
                                    </div>
                                    <span className="text-xs font-semibold text-[#6B7280]">{levelPct}%</span>
                                </div>
                            </div>
                            <div className="flex gap-3 border-t border-[#E0E5EB] pt-3">
                                <button onClick={() => openEdit(c)} className="flex-1 text-center text-[#199A61] font-semibold text-sm">Editar</button>
                                <button onClick={() => setToDelete(c)} className="flex-1 text-center text-red-500 font-semibold text-sm">Eliminar</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop: table */}
            <div className="hidden sm:block bg-white rounded-2xl border border-[#E0E5EB] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#F9FAFB] border-b border-[#E0E5EB]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase">Contenedor</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase">Tipo</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase">Nivel</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase">Código QR</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase">Estado</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => {
                                const levelPct = Math.round((c.currentLevel / c.capacity) * 100);
                                return (
                                    <tr key={c.id} className="border-b border-[#E0E5EB] hover:bg-[#F9FAFB] transition">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-[#141B21]">{c.name}</p>
                                            <p className="text-sm text-[#6B7280]">{c.location}</p>
                                        </td>
                                        <td className="px-6 py-4 text-[#6B7280]">{c.type}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-[#E0E5EB] rounded-full h-2 min-w-[60px]">
                                                    <div
                                                        className={`h-2 rounded-full ${levelPct >= 90 ? "bg-red-500" : levelPct >= 60 ? "bg-amber-400" : "bg-[#199A61]"}`}
                                                        style={{ width: `${levelPct}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-[#6B7280]">{levelPct}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm text-[#141B21]">{c.qrCode}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[c.status]?.classes ?? "bg-gray-100 text-gray-700"}`}>
                                                {statusConfig[c.status]?.label ?? c.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => openEdit(c)}
                                                    className="text-[#199A61] hover:text-[#178353] font-semibold text-sm transition"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => setToDelete(c)}
                                                    className="text-red-500 hover:text-red-700 font-semibold text-sm transition"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <p className="text-[#199A61] font-semibold">
                    Mostrando {filtered.length} de {containers.length} contenedores
                </p>
            </div>

            {/* Modal: Formulario Registro/Edición */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#141B21]">
                                {editing ? "Editar Contenedor" : "Registrar Contenedor"}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="text-[#6B7280] hover:text-[#141B21] transition">
                                <i className="bi bi-x-lg text-xl"></i>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] mb-1">Nombre *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    maxLength={100}
                                    placeholder="Ej. Contenedor Norte"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent ${errors.name ? "border-red-400" : "border-[#E0E5EB]"}`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] mb-1">Ubicación *</label>
                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={(e) => handleChange("location", e.target.value)}
                                    maxLength={200}
                                    placeholder="Ej. Calle 10 #5-20"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent ${errors.location ? "border-red-400" : "border-[#E0E5EB]"}`}
                                />
                                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] mb-1">Tipo</label>
                                    <select
                                        value={form.type}
                                        onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
                                        className="w-full px-4 py-3 border border-[#E0E5EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent bg-white"
                                    >
                                        <option>Reciclaje</option>
                                        <option>Orgánico</option>
                                        <option>General</option>
                                        <option>Electrónico</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] mb-1">Capacidad (kg) *</label>
                                    <input
                                        type="number"
                                        value={form.capacity}
                                        onChange={(e) => handleChange("capacity", e.target.value)}
                                        min={1}
                                        placeholder="Ej. 100"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent ${errors.capacity ? "border-red-400" : "border-[#E0E5EB]"}`}
                                    />
                                    {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] mb-1">Código QR *</label>
                                <input
                                    type="text"
                                    value={form.qrCode}
                                    onChange={(e) => handleChange("qrCode", e.target.value)}
                                    maxLength={50}
                                    placeholder="Ej. QR-006"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent font-mono ${errors.qrCode ? "border-red-400" : "border-[#E0E5EB]"}`}
                                />
                                {errors.qrCode && <p className="text-red-500 text-xs mt-1">{errors.qrCode}</p>}
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
                                {editing ? "Guardar Cambios" : "Registrar"}
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
                        <h3 className="text-xl font-bold text-[#141B21] text-center mb-2">Eliminar Contenedor</h3>
                        <p className="text-[#6B7280] text-center mb-6">
                            ¿Estás seguro de que deseas eliminar <span className="font-semibold text-[#141B21]">{toDelete.name}</span>? Esta acción no se puede deshacer.
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
