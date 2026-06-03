<<<<<<< HEAD
﻿import { useState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> prueba
import { sanitizeInput } from "../../utils/security";
import { getUsers, deleteUser } from "../../api/admin";

export default function UsersList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch(() => setError("No se pudieron cargar los usuarios"))
            .finally(() => setLoading(false));
    }, []);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteUser(userToDelete.id);
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            setUserToDelete(null);
        } catch {
            setError("No se pudo eliminar el usuario");
        } finally {
            setDeleting(false);
        }
    };

    const roleLabel = (role) => {
        if (role === "admin") return { text: "Admin", cls: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" };
        if (role === "collector") return { text: "Recolector", cls: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
        return { text: "Usuario", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
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
            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="relative">
                <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]"></i>
                <input
                    type="text"
                    placeholder="Buscar usuario por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(sanitizeInput(e.target.value))}
                    maxLength={100}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#199A61] dark:text-white"
                />
            </div>

            <div className="flex flex-col gap-3 sm:hidden">
                {filteredUsers.map(user => {
                    const role = roleLabel(user.role);
                    return (
                        <div key={user.id} className="bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-2xl shadow-sm p-4">
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div>
                                    <p className="font-semibold text-[#141B21] dark:text-white">{user.name}</p>
                                    <p className="text-xs text-[#6B7280] dark:text-slate-400">{user.email}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${role.cls}`}>{role.text}</span>
                            </div>
<<<<<<< HEAD
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.status === "active" ? "bg-green-50 text-green-700 dark:bg-green-900/30" : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-400"}`}>
                                {user.status === "active" ? "Activo" : "Inactivo"}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                            <div className="bg-[#F9FAFB] dark:bg-slate-800 rounded-xl p-2">
                                <p className="text-xs text-[#6B7280] dark:text-slate-400">QR</p>
                                <p className="font-bold text-[#199A61]">{user.qrsScanned}</p>
=======
                            <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                                <div className="bg-[#F9FAFB] dark:bg-slate-800 rounded-xl p-2">
                                    <p className="text-xs text-[#6B7280] dark:text-slate-400">ID</p>
                                    <p className="font-bold text-[#141B21] dark:text-white">#{user.id}</p>
                                </div>
                                <div className="bg-[#F9FAFB] dark:bg-slate-800 rounded-xl p-2">
                                    <p className="text-xs text-[#6B7280] dark:text-slate-400">Registro</p>
                                    <p className="font-bold text-[#141B21] dark:text-white text-xs">{new Date(user.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })}</p>
                                </div>
>>>>>>> prueba
                            </div>
                            <div className="flex gap-3 border-t border-[#E0E5EB] dark:border-slate-800 pt-3">
                                <button onClick={() => setSelectedUser(user)} className="flex-1 text-center text-[#199A61] font-semibold text-sm">Ver Detalles</button>
                                <button onClick={() => setUserToDelete(user)} className="flex-1 text-center text-red-500 font-semibold text-sm">Eliminar</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="hidden sm:block bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#F9FAFB] dark:bg-slate-950 border-b border-[#E0E5EB] dark:border-slate-800">
                            <tr>
                                {["Usuario", "Email", "Rol", "Fecha de Registro", "Acciones"].map(h => (
                                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] dark:text-slate-400 uppercase">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E0E5EB] dark:divide-slate-800">
<<<<<<< HEAD
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-[#F9FAFB] dark:hover:bg-slate-800 transition">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-[#141B21] dark:text-white">{user.name}</p>
                                        <p className="text-sm text-[#6B7280] dark:text-slate-400">{user.email}</p>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-[#199A61]">{user.qrsScanned}</td>
                                    <td className="px-6 py-4 font-semibold text-[#141B21] dark:text-white">{user.pointsEarned.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-[#6B7280] dark:text-slate-400">{new Date(user.joinDate).toLocaleDateString("es-ES")}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === "active" ? "bg-green-50 text-green-700 dark:bg-green-900/30" : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400"}`}>
                                            {user.status === "active" ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setSelectedUser(user)} className="text-[#199A61] hover:text-[#178353] font-semibold text-sm">Ver Detalles</button>
                                            <button onClick={() => setUserToDelete(user)} className="text-red-500 hover:text-red-700 font-semibold text-sm">Eliminar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
=======
                            {filteredUsers.map(user => {
                                const role = roleLabel(user.role);
                                return (
                                    <tr key={user.id} className="hover:bg-[#F9FAFB] dark:hover:bg-slate-800 transition">
                                        <td className="px-6 py-4 font-semibold text-[#141B21] dark:text-white">{user.name}</td>
                                        <td className="px-6 py-4 text-sm text-[#6B7280] dark:text-slate-400">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${role.cls}`}>{role.text}</span>
                                        </td>
                                        <td className="px-6 py-4 text-[#6B7280] dark:text-slate-400">{new Date(user.createdAt).toLocaleDateString("es-ES")}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => setSelectedUser(user)} className="text-[#199A61] hover:text-[#178353] font-semibold text-sm">Ver Detalles</button>
                                                <button onClick={() => setUserToDelete(user)} className="text-red-500 hover:text-red-700 font-semibold text-sm">Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
>>>>>>> prueba
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredUsers.length === 0 && !loading && (
                <p className="text-center text-[#6B7280] dark:text-slate-400 py-8">No se encontraron usuarios</p>
            )}

            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#141B21] dark:text-white">Detalles del Usuario</h3>
                            <button onClick={() => setSelectedUser(null)} className="text-[#6B7280] dark:text-slate-400">
                                <i className="bi bi-x-lg text-xl"></i>
                            </button>
                        </div>
                        <div className="flex items-center gap-4 mb-6">
<<<<<<< HEAD
                            <div className="w-16 h-16 rounded-full bg-[#199A61]/10 dark:bg-green-900/30 flex items-center justify-center">
                                <i className="bi bi-person text-3xl text-[#199A61]"></i>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-[#141B21] dark:text-white">{selectedUser.name}</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedUser.status === "active" ? "bg-green-50 text-green-700 dark:bg-green-900/30" : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400"}`}>
                                    {selectedUser.status === "active" ? "Activo" : "Inactivo"}
                                </span>
=======
                            {selectedUser.avatarUrl ? (
                                <img src={selectedUser.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-[#199A61]/10 dark:bg-emerald-900/30 flex items-center justify-center">
                                    <i className="bi bi-person text-3xl text-[#199A61]"></i>
                                </div>
                            )}
                            <div>
                                <p className="text-lg font-bold text-[#141B21] dark:text-white">{selectedUser.name}</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleLabel(selectedUser.role).cls}`}>{roleLabel(selectedUser.role).text}</span>
>>>>>>> prueba
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[
                                { icon: "envelope", label: "Email", val: selectedUser.email },
                                { icon: "person-badge", label: "ID", val: `#${selectedUser.id}` },
                                { icon: "calendar", label: "Fecha de Registro", val: new Date(selectedUser.createdAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" }) },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-[#F9FAFB] dark:bg-slate-800 rounded-xl">
                                    <i className={`bi bi-${item.icon} text-[#199A61]`}></i>
                                    <div>
                                        <p className="text-xs text-[#6B7280] dark:text-slate-400">{item.label}</p>
                                        <p className="text-sm font-semibold text-[#141B21] dark:text-white">{item.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setSelectedUser(null)} className="mt-6 w-full py-3 bg-[#199A61] text-white font-semibold rounded-xl transition">Cerrar</button>
                    </div>
                </div>
            )}

            {userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                            <i className="bi bi-trash text-3xl text-red-500"></i>
                        </div>
                        <h3 className="text-xl font-bold text-[#141B21] dark:text-white mb-2">Eliminar Usuario</h3>
                        <p className="text-[#6B7280] dark:text-slate-400 mb-6">¿Estás seguro de eliminar a <strong>{userToDelete.name}</strong>? Esta acción no se puede deshacer.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setUserToDelete(null)} disabled={deleting} className="flex-1 py-3 border border-[#E0E5EB] dark:border-slate-700 text-[#141B21] dark:text-white font-semibold rounded-xl disabled:opacity-50">Cancelar</button>
                            <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl disabled:opacity-50">
                                {deleting ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
