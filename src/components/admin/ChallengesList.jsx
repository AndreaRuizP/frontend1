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

    const openCreate = () => { setEditing(null); setForm(emptyForm); setErrors({}); setShowForm(true); };
    const openEdit = (challenge) => { setEditing(challenge); setForm({ ...challenge }); setErrors({}); setShowForm(true); };

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

    const handleDelete = () => { setChallenges(prev => prev.filter(c => c.id !== toDelete.id)); setToDelete(null); };

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
                        placeholder="Buscar reto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(sanitizeInput(e.target.value))}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#199A61] dark:text-white"
                    />
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
                                    <p className="font-bold text-[#141B21] dark:text-white">{c.title}</p>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.status === "active" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400"}`}>
                                        {c.status === "active" ? "Activo" : "Inactivo"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <span className="font-bold text-[#199A61]">{Number(c.points).toLocaleString()}</span>
                                <span className="text-xs text-[#6B7280] dark:text-slate-400">pts</span>
                            </div>
                        </div>
                        <p className="text-sm text-[#6B7280] dark:text-slate-400">{c.description}</p>
                        <div className="flex items-center gap-4 text-xs text-[#6B7280] dark:text-slate-500">
                            <span><i className="bi bi-calendar mr-1"></i>{new Date(c.startDate).toLocaleDateString("es-ES")}</span>
                            <span><i className="bi bi-arrow-right mr-1"></i>{new Date(c.endDate).toLocaleDateString("es-ES")}</span>
                        </div>
                        <div className="flex items-center gap-3 pt-2 border-t border-[#E0E5EB] dark:border-slate-800">
                            <button onClick={() => openEdit(c)} className="text-[#199A61] font-semibold text-sm"><i className="bi bi-pencil mr-1"></i>Editar</button>
                            <button onClick={() => setToDelete(c)} className="text-red-500 font-semibold text-sm"><i className="bi bi-trash mr-1"></i>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-xl p-4">
                <p className="text-[#199A61] font-semibold">Mostrando {filtered.length} de {challenges.length} retos</p>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#141B21] dark:text-white">{editing ? "Editar Reto" : "Crear Reto"}</h3>
                            <button onClick={() => setShowForm(false)} className="text-[#6B7280] dark:text-slate-400"><i className="bi bi-x-lg text-xl"></i></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Título *</label>
                                <input value={form.title} onChange={(e) => handleChange("title", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Descripción *</label>
                                <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-xl" rows={3} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Puntos *</label><input type="number" value={form.points} onChange={(e) => handleChange("points", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-xl" /></div>
                                <div><label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Estado</label><select value={form.status} onChange={(e) => setForm(p => ({...p, status: e.target.value}))} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-xl"><option value="active">Activo</option><option value="inactive">Inactivo</option></select></div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-[#E0E5EB] dark:border-slate-700 dark:text-white rounded-xl">Cancelar</button>
                            <button onClick={handleSave} className="flex-1 py-3 bg-[#199A61] text-white rounded-xl">Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            {toDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-6 text-center">
                        <h3 className="text-xl font-bold text-[#141B21] dark:text-white mb-4">¿Eliminar Reto?</h3>
                        <p className="text-[#6B7280] dark:text-slate-400 mb-6">¿Estás seguro de que deseas eliminar "{toDelete.title}"?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setToDelete(null)} className="flex-1 py-3 border border-[#E0E5EB] dark:border-slate-700 dark:text-white rounded-xl">Cancelar</button>
                            <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}