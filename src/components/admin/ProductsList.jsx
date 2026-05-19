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

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setErrors({});
        setShowForm(true);
    };

    const openEdit = (product) => {
        setEditing(product);
        setForm({ name: product.name, description: product.description, pointsCost: product.pointsCost, stock: product.stock, category: product.category, status: product.status });
        setErrors({});
        setShowForm(true);
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "El nombre es requerido";
        if (!form.description.trim()) e.description = "La descripción es requerida";
        if (!form.pointsCost || isNaN(form.pointsCost) || Number(form.pointsCost) <= 0) e.pointsCost = "El costo en puntos debe ser un número positivo";
        if (form.stock === "" || isNaN(form.stock) || Number(form.stock) < 0) e.stock = "El stock debe ser un número mayor o igual a 0";
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

    const handleDelete = () => {
        setProducts(prev => prev.filter(p => p.id !== toDelete.id));
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
                        placeholder="Buscar por nombre o categoría..."
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
                    <span className="hidden sm:inline">Registrar Producto</span>
                    <span className="sm:hidden">Registrar</span>
                </button>
            </div>

            {/* Mobile: card list */}
            <div className="flex flex-col gap-3 sm:hidden">
                {filtered.map(p => (
                    <div key={p.id} className="bg-white rounded-2xl border border-[#E0E5EB] shadow-sm p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                                <p className="font-semibold text-[#141B21]">{p.name}</p>
                                <p className="text-xs text-[#6B7280] truncate">{p.description}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${p.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                                {p.status === "active" ? "Activo" : "Inactivo"}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                            <div className="bg-[#F9FAFB] rounded-xl p-2">
                                <p className="text-xs text-[#6B7280]">Puntos</p>
                                <p className="font-bold text-[#199A61] text-sm">{Number(p.pointsCost).toLocaleString()}</p>
                            </div>
                            <div className="bg-[#F9FAFB] rounded-xl p-2">
                                <p className="text-xs text-[#6B7280]">Stock</p>
                                <p className={`font-bold text-sm ${p.stock === 0 ? "text-red-500" : p.stock <= 10 ? "text-amber-500" : "text-[#141B21]"}`}>{p.stock}</p>
                            </div>
                            <div className="bg-[#F9FAFB] rounded-xl p-2">
                                <p className="text-xs text-[#6B7280]">Categoría</p>
                                <p className="font-semibold text-[#141B21] text-xs">{p.category}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 border-t border-[#E0E5EB] pt-3">
                            <button onClick={() => openEdit(p)} className="flex-1 text-center text-[#199A61] font-semibold text-sm">Editar</button>
                            <button onClick={() => setToDelete(p)} className="flex-1 text-center text-red-500 font-semibold text-sm">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden sm:block bg-white rounded-2xl border border-[#E0E5EB] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#F9FAFB] border-b border-[#E0E5EB]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase">Producto</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase">Categoría</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase">Costo (pts)</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase">Stock</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase">Estado</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} className="border-b border-[#E0E5EB] hover:bg-[#F9FAFB] transition">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-[#141B21]">{p.name}</p>
                                        <p className="text-sm text-[#6B7280] max-w-xs truncate">{p.description}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-[#F9FAFB] border border-[#E0E5EB] rounded-full text-xs font-semibold text-[#6B7280]">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-[#199A61]">{Number(p.pointsCost).toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${p.stock === 0 ? "text-red-500" : p.stock <= 10 ? "text-amber-500" : "text-[#141B21]"}`}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                                            {p.status === "active" ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => openEdit(p)}
                                                className="text-[#199A61] hover:text-[#178353] font-semibold text-sm transition"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => setToDelete(p)}
                                                className="text-red-500 hover:text-red-700 font-semibold text-sm transition"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <p className="text-[#199A61] font-semibold">
                    Mostrando {filtered.length} de {products.length} productos
                </p>
            </div>

            {/* Modal: Formulario Registro/Edición */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#141B21]">
                                {editing ? "Editar Producto" : "Registrar Producto"}
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
                                    placeholder="Ej. Café Gratis"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent ${errors.name ? "border-red-400" : "border-[#E0E5EB]"}`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#141B21] mb-1">Descripción *</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    maxLength={300}
                                    rows={3}
                                    placeholder="Describe el producto..."
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent resize-none ${errors.description ? "border-red-400" : "border-[#E0E5EB]"}`}
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] mb-1">Costo en Puntos *</label>
                                    <input
                                        type="number"
                                        value={form.pointsCost}
                                        onChange={(e) => handleChange("pointsCost", e.target.value)}
                                        min={1}
                                        placeholder="Ej. 500"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent ${errors.pointsCost ? "border-red-400" : "border-[#E0E5EB]"}`}
                                    />
                                    {errors.pointsCost && <p className="text-red-500 text-xs mt-1">{errors.pointsCost}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] mb-1">Stock *</label>
                                    <input
                                        type="number"
                                        value={form.stock}
                                        onChange={(e) => handleChange("stock", e.target.value)}
                                        min={0}
                                        placeholder="Ej. 100"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent ${errors.stock ? "border-red-400" : "border-[#E0E5EB]"}`}
                                    />
                                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#141B21] mb-1">Categoría</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-4 py-3 border border-[#E0E5EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] focus:border-transparent bg-white"
                                    >
                                        {categories.map(cat => <option key={cat}>{cat}</option>)}
                                    </select>
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
                        <h3 className="text-xl font-bold text-[#141B21] text-center mb-2">Eliminar Producto</h3>
                        <p className="text-[#6B7280] text-center mb-6">
                            ¿Estás seguro de que deseas eliminar <span className="font-semibold text-[#141B21]">"{toDelete.name}"</span>? Esta acción no se puede deshacer.
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
