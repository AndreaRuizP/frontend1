<<<<<<< HEAD
﻿import { useState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> prueba
import { sanitizeInput } from "../../utils/security";
import { getMarketplaceAdmin, createMarketplaceItem, updateMarketplaceItem, deleteMarketplaceItem } from "../../api/admin";

const emptyForm = { name: "", description: "", pointsCost: "", stock: "", active: true };

export default function ProductsList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
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
        getMarketplaceAdmin()
            .then(setProducts)
            .catch(() => setApiError("No se pudieron cargar los productos"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreate = () => { setEditing(null); setForm(emptyForm); setErrors({}); setApiError(""); setShowForm(true); };
    const openEdit = (p) => {
        setEditing(p);
        setForm({ name: p.name, description: p.description ?? "", pointsCost: p.pointsCost, stock: p.stock, active: p.active });
        setErrors({});
        setApiError("");
        setShowForm(true);
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "El nombre es requerido";
        if (!form.pointsCost || isNaN(form.pointsCost) || Number(form.pointsCost) <= 0) e.pointsCost = "El costo debe ser positivo";
        if (form.stock === "" || isNaN(form.stock) || Number(form.stock) < 0) e.stock = "El stock no puede ser negativo";
        return e;
    };

    const handleSave = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        setSaving(true);
        setApiError("");
        const body = {
            name: form.name.trim(),
            description: form.description.trim() || undefined,
            pointsCost: Number(form.pointsCost),
            stock: Number(form.stock),
            active: Boolean(form.active),
        };
        try {
            if (editing) {
                const updated = await updateMarketplaceItem(editing.id, body);
                setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...updated } : p));
            } else {
                const created = await createMarketplaceItem(body);
                setProducts(prev => [created, ...prev]);
            }
            setShowForm(false);
        } catch {
            setApiError("No se pudo guardar el producto");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteMarketplaceItem(toDelete.id);
            setProducts(prev => prev.filter(p => p.id !== toDelete.id));
            setToDelete(null);
        } catch {
            setApiError("No se pudo eliminar el producto");
            setToDelete(null);
        } finally {
            setDeleting(false);
        }
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: field === "active" ? value : sanitizeInput(String(value)) }));
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
                    <input type="text" placeholder="Buscar producto..." value={searchTerm} onChange={(e) => setSearchTerm(sanitizeInput(e.target.value))} className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#199A61] dark:text-white" />
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-3 bg-[#199A61] hover:bg-[#178353] text-white font-semibold rounded-xl transition">
                    <i className="bi bi-plus-lg"></i> Crear Producto
                </button>
            </div>

            <div className="hidden sm:block bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#F9FAFB] dark:bg-slate-950 border-b border-[#E0E5EB] dark:border-slate-800">
                        <tr>
                            {["Producto", "Costo (pts)", "Stock", "Estado", "Acciones"].map(h => (
                                <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] dark:text-slate-400 uppercase">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E5EB] dark:divide-slate-800">
                        {filtered.map(p => (
                            <tr key={p.id} className="hover:bg-[#F9FAFB] dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-[#141B21] dark:text-white">{p.name}</p>
                                    {p.description && <p className="text-sm text-[#6B7280] dark:text-slate-400">{p.description}</p>}
                                </td>
                                <td className="px-6 py-4 font-bold text-[#199A61]">{p.pointsCost.toLocaleString()}</td>
                                <td className={`px-6 py-4 font-semibold ${p.stock === 0 ? "text-red-500" : "text-[#141B21] dark:text-white"}`}>{p.stock}</td>
<<<<<<< HEAD
                                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs ${p.status === "active" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400"}`}>{p.status === "active" ? "Activo" : "Inactivo"}</span></td>
=======
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.active ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400"}`}>
                                        {p.active ? "Activo" : "Inactivo"}
                                    </span>
                                </td>
>>>>>>> prueba
                                <td className="px-6 py-4 flex gap-3">
                                    <button onClick={() => openEdit(p)} className="text-[#199A61] font-semibold text-sm">Editar</button>
                                    <button onClick={() => setToDelete(p)} className="text-red-500 font-semibold text-sm">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-3 sm:hidden">
                {filtered.map(p => (
                    <div key={p.id} className="bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-[#141B21] dark:text-white">{p.name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.active ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30" : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400"}`}>
                                {p.active ? "Activo" : "Inactivo"}
                            </span>
                        </div>
                        <p className="text-sm text-[#6B7280] dark:text-slate-400 mb-2">{p.description}</p>
                        <div className="flex items-center gap-4 text-sm mb-3">
                            <span className="font-bold text-[#199A61]">{p.pointsCost.toLocaleString()} pts</span>
                            <span className={`font-semibold ${p.stock === 0 ? "text-red-500" : "text-[#141B21] dark:text-white"}`}>Stock: {p.stock}</span>
                        </div>
                        <div className="flex gap-3 border-t border-[#E0E5EB] dark:border-slate-800 pt-3">
                            <button onClick={() => openEdit(p)} className="flex-1 text-center text-[#199A61] font-semibold text-sm">Editar</button>
                            <button onClick={() => setToDelete(p)} className="flex-1 text-center text-red-500 font-semibold text-sm">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="text-center text-[#6B7280] dark:text-slate-400 py-8">No se encontraron productos</p>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-[#141B21] dark:text-white mb-6">{editing ? "Editar Producto" : "Registrar Producto"}</h3>
                        {apiError && <p className="mb-4 text-sm text-red-500">{apiError}</p>}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Nombre *</label>
                                <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Descripción</label>
                                <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white" rows={2} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Costo (pts) *</label>
                                    <input type="number" value={form.pointsCost} onChange={(e) => handleChange("pointsCost", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white" />
                                    {errors.pointsCost && <p className="text-red-500 text-xs mt-1">{errors.pointsCost}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Stock *</label>
                                    <input type="number" value={form.stock} onChange={(e) => handleChange("stock", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white" />
                                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Estado</label>
                                <select value={String(form.active)} onChange={(e) => handleChange("active", e.target.value === "true")} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white">
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
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
