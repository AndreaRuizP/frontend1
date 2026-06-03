import { useState, useEffect } from "react";
import { sanitizeInput } from "../../utils/security";
import { getChallengesAdmin, createChallenge, updateChallenge, deleteChallenge } from "../../api/admin";

const emptyForm = { name: "", description: "", pointsReward: "", criteria: "QR_SCAN", target: "", active: true };

export default function ChallengesList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [challenges, setChallenges] = useState([]);
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
        getChallengesAdmin()
            .then(setChallenges)
            .catch(() => setApiError("No se pudieron cargar los retos"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = challenges.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreate = () => { setEditing(null); setForm(emptyForm); setErrors({}); setApiError(""); setShowForm(true); };
    const openEdit = (c) => {
        setEditing(c);
        setForm({ name: c.name, description: c.description, pointsReward: c.pointsReward, criteria: c.criteria, target: c.target, active: c.active });
        setErrors({});
        setApiError("");
        setShowForm(true);
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "El nombre es requerido";
        if (!form.description.trim()) e.description = "La descripción es requerida";
        if (!form.pointsReward || isNaN(form.pointsReward) || Number(form.pointsReward) <= 0) e.pointsReward = "Los puntos deben ser positivos";
        if (!form.target || isNaN(form.target) || Number(form.target) <= 0) e.target = "El objetivo debe ser positivo";
        return e;
    };

    const handleSave = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        setSaving(true);
        setApiError("");
        const body = {
            name: form.name.trim(),
            description: form.description.trim(),
            pointsReward: Number(form.pointsReward),
            criteria: form.criteria,
            target: Number(form.target),
            active: Boolean(form.active),
        };
        try {
            if (editing) {
                const updated = await updateChallenge(editing.id, body);
                setChallenges(prev => prev.map(c => c.id === editing.id ? { ...c, ...updated } : c));
            } else {
                const created = await createChallenge(body);
                setChallenges(prev => [created, ...prev]);
            }
            setShowForm(false);
        } catch {
            setApiError("No se pudo guardar el reto");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteChallenge(toDelete.id);
            setChallenges(prev => prev.filter(c => c.id !== toDelete.id));
            setToDelete(null);
        } catch {
            setApiError("No se pudo eliminar el reto");
            setToDelete(null);
        } finally {
            setDeleting(false);
        }
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: field === "criteria" || field === "active" ? value : sanitizeInput(String(value)) }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array(4).fill(null).map((_, i) => (
                    <div key={i} className="h-36 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
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
                    <input type="text" placeholder="Buscar reto..." value={searchTerm} onChange={(e) => setSearchTerm(sanitizeInput(e.target.value))} className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#199A61] dark:text-white" />
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-3 bg-[#199A61] hover:bg-[#178353] text-white font-semibold rounded-xl transition">
                    <i className="bi bi-plus-lg"></i> Crear Reto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(c => (
                    <div key={c.id} className="bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#199A61]/10 flex items-center justify-center shrink-0">
                                    <i className="bi bi-trophy text-[#199A61] text-lg"></i>
                                </div>
                                <div>
                                    <p className="font-bold text-[#141B21] dark:text-white">{c.name}</p>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.active ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400"}`}>
                                        {c.active ? "Activo" : "Inactivo"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <span className="font-bold text-[#199A61]">{Number(c.pointsReward).toLocaleString()}</span>
                                <span className="text-xs text-[#6B7280] dark:text-slate-400">pts</span>
                            </div>
                        </div>
                        <p className="text-sm text-[#6B7280] dark:text-slate-400">{c.description}</p>
                        <div className="flex items-center gap-4 text-xs text-[#6B7280] dark:text-slate-500">
                            <span><i className="bi bi-qr-code mr-1"></i>{c.criteria}</span>
                            <span><i className="bi bi-bullseye mr-1"></i>Meta: {c.target}</span>
                        </div>
                        <div className="flex items-center gap-3 pt-2 border-t border-[#E0E5EB] dark:border-slate-800">
                            <button onClick={() => openEdit(c)} className="text-[#199A61] font-semibold text-sm"><i className="bi bi-pencil mr-1"></i>Editar</button>
                            <button onClick={() => setToDelete(c)} className="text-red-500 font-semibold text-sm"><i className="bi bi-trash mr-1"></i>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="text-center text-[#6B7280] dark:text-slate-400 py-8">No se encontraron retos</p>
            )}

            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-4">
                <p className="text-[#199A61] font-semibold">Mostrando {filtered.length} de {challenges.length} retos</p>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#141B21] dark:text-white">{editing ? "Editar Reto" : "Crear Reto"}</h3>
                            <button onClick={() => setShowForm(false)} className="text-[#6B7280] dark:text-slate-400"><i className="bi bi-x-lg text-xl"></i></button>
                        </div>
                        {apiError && <p className="mb-4 text-sm text-red-500">{apiError}</p>}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Nombre *</label>
                                <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-xl" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Descripción *</label>
                                <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-xl" rows={3} />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Puntos de recompensa *</label>
                                    <input type="number" value={form.pointsReward} onChange={(e) => handleChange("pointsReward", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-xl" />
                                    {errors.pointsReward && <p className="text-red-500 text-xs mt-1">{errors.pointsReward}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Meta (escaneos) *</label>
                                    <input type="number" value={form.target} onChange={(e) => handleChange("target", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-xl" />
                                    {errors.target && <p className="text-red-500 text-xs mt-1">{errors.target}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Criterio</label>
                                    <select value={form.criteria} onChange={(e) => handleChange("criteria", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-xl">
                                        <option value="QR_SCAN">QR_SCAN</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Estado</label>
                                    <select value={String(form.active)} onChange={(e) => handleChange("active", e.target.value === "true")} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-xl">
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} disabled={saving} className="flex-1 py-3 border border-[#E0E5EB] dark:border-slate-700 dark:text-white rounded-xl disabled:opacity-50">Cancelar</button>
                            <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-[#199A61] text-white rounded-xl disabled:opacity-50">
                                {saving ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-6 text-center">
                        <h3 className="text-xl font-bold text-[#141B21] dark:text-white mb-4">¿Eliminar Reto?</h3>
                        <p className="text-[#6B7280] dark:text-slate-400 mb-6">¿Estás seguro de eliminar "<strong>{toDelete.name}</strong>"?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setToDelete(null)} disabled={deleting} className="flex-1 py-3 border border-[#E0E5EB] dark:border-slate-700 dark:text-white rounded-xl disabled:opacity-50">Cancelar</button>
                            <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 bg-red-500 text-white rounded-xl disabled:opacity-50">
                                {deleting ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
