import { useState, useEffect } from "react";
import { sanitizeInput } from "../../utils/security";
import { getContainers, createContainer, updateContainer, deleteContainer } from "../../api/admin";

const emptyForm = { name: "", type: "", capacity: "", latitude: "", longitude: "", status: "active" };

const statusConfig = {
    active: { label: "Activo", classes: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    full: { label: "Lleno", classes: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    inactive: { label: "Inactivo", classes: "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400" },
};

const typeLabels = { recycling: "Reciclaje", organic: "Orgánico", general: "General" , paper: "Papel", plastic: "Plástico", glass: "Vidrio", metal: "Metal", other: "Otro" };

export default function ContainersList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [toDelete, setToDelete] = useState(null);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        getContainers()
            .then(setContainers)
            .catch(() => setApiError("No se pudieron cargar los contenedores"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = containers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreate = () => { setEditing(null); setForm(emptyForm); setErrors({}); setApiError(""); setShowForm(true); };
    const openEdit = (c) => {
        setEditing(c);
        setForm({ name: c.name, type: c.type, capacity: c.capacity, latitude: c.latitude, longitude: c.longitude, status: c.status });
        setErrors({});
        setApiError("");
        setShowForm(true);
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "El nombre es requerido";
        if (!form.latitude || isNaN(form.latitude)) e.latitude = "Latitud inválida";
        if (!form.longitude || isNaN(form.longitude)) e.longitude = "Longitud inválida";
        if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) <= 0) e.capacity = "Capacidad debe ser positiva";
        return e;
    };

    const handleSave = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        setSaving(true);
        setApiError("");
        const body = {
            name: form.name.trim(),
            type: form.type,
            capacity: Number(form.capacity),
            latitude: Number(form.latitude),
            longitude: Number(form.longitude),
            status: form.status,
        };
        try {
            if (editing) {
                const updated = await updateContainer(editing.id, body);
                setContainers(prev => prev.map(c => c.id === editing.id ? { ...c, ...updated } : c));
            } else {
                const created = await createContainer(body);
                setContainers(prev => [created, ...prev]);
            }
            setShowForm(false);
        } catch {
            setApiError("No se pudo guardar el contenedor");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteContainer(toDelete.id);
            setContainers(prev => prev.filter(c => c.id !== toDelete.id));
            setToDelete(null);
        } catch {
            setApiError("No se pudo eliminar el contenedor");
            setToDelete(null);
        } finally {
            setDeleting(false);
        }
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: field === "type" || field === "status" ? value : sanitizeInput(value) }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {Array(4).fill(null).map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {apiError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">{apiError}</div>
            )}

            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="relative flex-1 min-w-0">
                    <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]"></i>
                    <input type="text" placeholder="Buscar contenedor..." value={searchTerm} onChange={(e) => setSearchTerm(sanitizeInput(e.target.value))} className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#199A61] dark:text-white" />
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-3 bg-[#199A61] hover:bg-[#178353] text-white font-semibold rounded-xl transition">
                    <i className="bi bi-plus-lg"></i> Agregar
                </button>
            </div>

            <div className="hidden sm:block bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#F9FAFB] dark:bg-slate-950 border-b border-[#E0E5EB] dark:border-slate-800">
                        <tr>
                            {["Contenedor", "Tipo", "Capacidad", "Coordenadas", "Estado", "Acciones"].map(h => (
                                <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] dark:text-slate-400 uppercase">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E5EB] dark:divide-slate-800">
                        {filtered.map(c => (
                            <tr key={c.id} className="hover:bg-[#F9FAFB] dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4 font-semibold text-[#141B21] dark:text-white">{c.name}</td>
                                <td className="px-6 py-4 text-[#6B7280] dark:text-slate-400">{typeLabels[c.type] ?? c.type}</td>
                                <td className="px-6 py-4 text-[#6B7280] dark:text-slate-400">{c.capacity}</td>
                                <td className="px-6 py-4 font-mono text-xs text-[#6B7280] dark:text-slate-400">{c.latitude?.toFixed(4)}, {c.longitude?.toFixed(4)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[c.status]?.classes ?? statusConfig.active.classes}`}>
                                        {statusConfig[c.status]?.label ?? c.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-3">
                                    <button onClick={() => openEdit(c)} className="text-[#199A61] font-semibold text-sm">Editar</button>
                                    <button onClick={() => setToDelete(c)} className="text-red-500 font-semibold text-sm">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-3 sm:hidden">
                {filtered.map(c => (
                    <div key={c.id} className="bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-[#141B21] dark:text-white">{c.name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig[c.status]?.classes ?? ""}`}>{statusConfig[c.status]?.label ?? c.status}</span>
                        </div>
                        <p className="text-sm text-[#6B7280] dark:text-slate-400 mb-3">{typeLabels[c.type] ?? c.type} · Cap. {c.capacity}</p>
                        <div className="flex gap-3 border-t border-[#E0E5EB] dark:border-slate-800 pt-3">
                            <button onClick={() => openEdit(c)} className="flex-1 text-center text-[#199A61] font-semibold text-sm">Editar</button>
                            <button onClick={() => setToDelete(c)} className="flex-1 text-center text-red-500 font-semibold text-sm">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && !loading && (
                <p className="text-center text-[#6B7280] dark:text-slate-400 py-8">No se encontraron contenedores</p>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#141B21] dark:text-white">{editing ? "Editar Contenedor" : "Registrar Contenedor"}</h3>
                            <button onClick={() => setShowForm(false)} className="text-[#6B7280] dark:text-slate-400"><i className="bi bi-x-lg"></i></button>
                        </div>
                        {apiError && <p className="mb-4 text-sm text-red-500">{apiError}</p>}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Nombre *</label>
                                <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#199A61] outline-none" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Tipo</label>
                                    <select value={form.type} onChange={(e) => handleChange("type", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#199A61]">
                                        <option value="recycling">Reciclaje</option>
                                        <option value="organic">Orgánico</option>
                                        <option value="general">General</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Capacidad *</label>
                                    <input type="number" value={form.capacity} onChange={(e) => handleChange("capacity", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#199A61] outline-none" />
                                    {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Latitud *</label>
                                    <input type="number" step="any" value={form.latitude} onChange={(e) => handleChange("latitude", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#199A61] outline-none" />
                                    {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Longitud *</label>
                                    <input type="number" step="any" value={form.longitude} onChange={(e) => handleChange("longitude", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#199A61] outline-none" />
                                    {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Estado</label>
                                <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#199A61]">
                                    <option value="active">Activo</option>
                                    <option value="inactive">Inactivo</option>
                                    <option value="full">Lleno</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} disabled={saving} className="flex-1 py-3 border border-[#E0E5EB] dark:border-slate-700 dark:text-white rounded-xl disabled:opacity-50">Cancelar</button>
                            <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-[#199A61] hover:bg-[#178353] text-white rounded-xl disabled:opacity-50">
                                {saving ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-6 text-center">
                        <h3 className="text-xl font-bold text-[#141B21] dark:text-white mb-2">Eliminar</h3>
                        <p className="text-[#6B7280] dark:text-slate-400 mb-6">¿Seguro de eliminar <strong>{toDelete.name}</strong>?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setToDelete(null)} disabled={deleting} className="flex-1 py-3 border border-[#E0E5EB] dark:border-slate-700 dark:text-white rounded-xl disabled:opacity-50">Cancelar</button>
                            <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50">
                                {deleting ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
