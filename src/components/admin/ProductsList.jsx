import { useState } from "react";
import { sanitizeInput } from "../../utils/security";

const initialProducts = [
    { id: 1, name: "Café Gratis", description: "Redime un café en tiendas participantes.", pointsCost: 500, stock: 100, category: "Bebidas", status: "active" },
    { id: 2, name: "Bolsa Ecológica", description: "Bolsa reutilizable de tela con logo CleanPoints.", pointsCost: 1200, stock: 50, category: "Accesorios", status: "active" },
    { id: 3, name: "Descuento 10% Supermercado", description: "Cupón de descuento del 10% en compras mayores a $50.000.", pointsCost: 2000, stock: 200, category: "Cupones", status: "active" },
    { id: 4, name: "Botella Deportiva", description: "Botella reutilizable de 750ml libre de BPA.", pointsCost: 3500, stock: 30, category: "Accesorios", status: "active" },
    { id: 5, name: "Planta de Semillero", description: "Siembra tu propia planta en casa.", pointsCost: 800, stock: 0, category: "Naturaleza", status: "inactive" },
];

const emptyForm = { name: "", description: "", pointsCost: "", stock: "", category: "Bebidas", status: "active" };
const categories = ["Bebidas", "Accesorios", "Cupones", "Naturaleza", "Alimentación", "Tecnología", "Otro"];

export default function ProductsList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState(initialProducts);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [toDelete, setToDelete] = useState(null);
    const [errors, setErrors] = useState({});

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreate = () => { setEditing(null); setForm(emptyForm); setErrors({}); setShowForm(true); };
    const openEdit = (product) => { setEditing(product); setForm({ ...product }); setErrors({}); setShowForm(true); };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "El nombre es requerido";
        if (!form.description.trim()) e.description = "La descripción es requerida";
        if (!form.pointsCost || isNaN(form.pointsCost) || Number(form.pointsCost) <= 0) e.pointsCost = "El costo debe ser positivo";
        if (form.stock === "" || isNaN(form.stock) || Number(form.stock) < 0) e.stock = "El stock no puede ser negativo";
        return e;
    };

    const handleSave = () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        if (editing) {
            setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...form, pointsCost: Number(form.pointsCost), stock: Number(form.stock) } : p));
        } else {
            setProducts(prev => [...prev, { id: Date.now(), ...form, pointsCost: Number(form.pointsCost), stock: Number(form.stock) }]);
        }
        setShowForm(false);
    };

    const handleDelete = () => { setProducts(prev => prev.filter(p => p.id !== toDelete.id)); setToDelete(null); };
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
                    <i className="bi bi-plus-lg"></i> Registrar
                </button>
            </div>

            <div className="hidden sm:block bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#F9FAFB] dark:bg-slate-950 border-b border-[#E0E5EB] dark:border-slate-800">
                        <tr>
                            {["Producto", "Categoría", "Costo", "Stock", "Estado", "Acciones"].map(h => (
                                <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] dark:text-slate-400 uppercase">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E5EB] dark:divide-slate-800">
                        {filtered.map(p => (
                            <tr key={p.id} className="hover:bg-[#F9FAFB] dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4"><p className="font-semibold text-[#141B21] dark:text-white">{p.name}</p><p className="text-sm text-[#6B7280] dark:text-slate-400">{p.description}</p></td>
                                <td className="px-6 py-4"><span className="px-3 py-1 bg-gray-50 dark:bg-slate-800 border border-[#E0E5EB] dark:border-slate-700 rounded-full text-xs text-[#6B7280] dark:text-slate-400">{p.category}</span></td>
                                <td className="px-6 py-4 font-bold text-[#199A61]">{p.pointsCost.toLocaleString()}</td>
                                <td className={`px-6 py-4 font-semibold ${p.stock === 0 ? "text-red-500" : "text-[#141B21] dark:text-white"}`}>{p.stock}</td>
                                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs ${p.status === "active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400"}`}>{p.status === "active" ? "Activo" : "Inactivo"}</span></td>
                                <td className="px-6 py-4 flex gap-3">
                                    <button onClick={() => openEdit(p)} className="text-[#199A61] font-semibold text-sm">Editar</button>
                                    <button onClick={() => setToDelete(p)} className="text-red-500 font-semibold text-sm">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-[#141B21] dark:text-white mb-6">{editing ? "Editar Producto" : "Registrar Producto"}</h3>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Nombre *</label><input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white" /></div>
                            <div><label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Descripción *</label><textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Costo *</label><input type="number" value={form.pointsCost} onChange={(e) => handleChange("pointsCost", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white" /></div>
                                <div><label className="block text-sm font-semibold text-[#141B21] dark:text-white mb-1">Stock *</label><input type="number" value={form.stock} onChange={(e) => handleChange("stock", e.target.value)} className="w-full px-4 py-3 border border-[#E0E5EB] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white" /></div>
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
                            <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}