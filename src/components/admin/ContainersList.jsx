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
    active: { label: "Activo", classes: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    full: { label: "Lleno", classes: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    inactive: { label: "Inactivo", classes: "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400" },
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

    const openCreate = () => { setEditing(null); setForm(emptyForm); setErrors({}); setShowForm(true); };
    const openEdit = (container) => { setEditing(container); setForm(container); setErrors({}); setShowForm(true); };

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
            setContainers(prev => [...prev, { id: Date.now(), ...form, capacity: Number(form.capacity), currentLevel: 0 }]);
        }
        setShowForm(false);
    };

    const handleDelete = () => { setContainers(prev => prev.filter(c => c.id !== toDelete.id)); setToDelete(null); };
    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: sanitizeInput(value) }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="relative flex-1 min-w-0">
                    <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]"></i>
                    <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(sanitizeInput(e.target.value))} className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#199A61] dark:text-white" />
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-3 bg-[#199A61] hover:bg-[#178353] text-white font-semibold rounded-xl transition">
                    <i className="bi bi-plus-lg"></i> Agregar
                </button>
            </div>

            <div className="hidden sm:block bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#F9FAFB] dark:bg-slate-950 border-b border-[#E0E5EB] dark:border-slate-800">
                        <tr>
                            {["Contenedor", "Tipo", "Nivel", "QR", "Estado", "Acciones"].map(h => (
                                <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] dark:text-slate-400 uppercase">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E5EB] dark:divide-slate-800">
                        {filtered.map(c => (
                            <tr key={c.id} className="hover:bg-[#F9FAFB] dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4"><p className="font-semibold text-[#141B21] dark:text-white">{c.name}</p><p className="text-sm text-[#6B7280] dark:text-slate-400">{c.location}</p></td>
                                <td className="px-6 py-4 text-[#6B7280] dark:text-slate-400">{c.type}</td>
                                <td className="px-6 py-4 text-[#6B7280] dark:text-slate-400">{Math.round((c.currentLevel / c.capacity) * 100)}%</td>
                                <td className="px-6 py-4 font-mono text-sm text-[#141B21] dark:text-white">{c.qrCode}</td>
                                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[c.status].classes}`}>{statusConfig[c.status].label}</span></td>
                                <td className="px-6 py-4 flex gap-3">
                                    <button onClick={() => openEdit(c)} className="text-[#199A61] font-semibold text-sm">Editar</button>
                                    <button onClick={() => setToDelete(c)} className="text-red-500 font-semibold text-sm">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#141B21] dark:text-white">{editing ? "Editar Contenedor" : "Registrar Contenedor"}</h3>
                            <button onClick={() => setShowForm(false)} className="text-[#6B7280] dark:text-slate-400"><i className="bi bi-x-lg"></i></button>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Nombre *</label><input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#199A61] outline-none" /></div>
                            <div><label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Ubicación *</label><input value={form.location} onChange={(e) => handleChange("location", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#199A61] outline-none" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Tipo</label><select value={form.type} onChange={(e) => setForm(p => ({...p, type: e.target.value}))} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#199A61]"><option>Reciclaje</option><option>Orgánico</option><option>General</option></select></div>
                                <div><label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Capacidad *</label><input type="number" value={form.capacity} onChange={(e) => handleChange("capacity", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#199A61] outline-none" /></div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-[#E0E5EB] dark:border-slate-700 dark:text-white rounded-xl">Cancelar</button>
                            <button onClick={handleSave} className="flex-1 py-3 bg-[#199A61] hover:bg-[#178353] text-white rounded-xl">Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            {toDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-6 text-center">
                        <h3 className="text-xl font-bold text-[#141B21] dark:text-white mb-2">Eliminar</h3>
                        <p className="text-[#6B7280] dark:text-slate-400 mb-6">¿Seguro de eliminar {toDelete.name}?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setToDelete(null)} className="flex-1 py-3 border border-[#E0E5EB] dark:border-slate-700 dark:text-white rounded-xl">Cancelar</button>
                            <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}