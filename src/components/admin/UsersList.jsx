import { useState } from "react";
import { sanitizeInput } from "../../utils/security";

const initialUsers = [
    { id: 1, name: "Juan García", email: "juan@email.com", qrsScanned: 45, pointsEarned: 2250, joinDate: "2024-01-15", status: "active", phone: "+57 300 123 4567" },
    { id: 2, name: "María López", email: "maria@email.com", qrsScanned: 89, pointsEarned: 4450, joinDate: "2024-01-10", status: "active", phone: "+57 310 987 6543" },
    { id: 3, name: "Carlos Rodríguez", email: "carlos@email.com", qrsScanned: 23, pointsEarned: 1150, joinDate: "2024-02-01", status: "active", phone: "+57 320 456 7890" },
    { id: 4, name: "Ana Martínez", email: "ana@email.com", qrsScanned: 156, pointsEarned: 7800, joinDate: "2023-12-20", status: "active", phone: "+57 315 654 3210" },
    { id: 5, name: "Pedro Sánchez", email: "pedro@email.com", qrsScanned: 0, pointsEarned: 0, joinDate: "2024-02-10", status: "inactive", phone: "+57 305 111 2222" },
];

export default function UsersList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState(initialUsers);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = () => {
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        setUserToDelete(null);
    };

    return (
        <div className="space-y-6">
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
                {filteredUsers.map(user => (
                    <div key={user.id} className="bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-2xl shadow-sm p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                                <p className="font-semibold text-[#141B21] dark:text-white">{user.name}</p>
                                <p className="text-xs text-[#6B7280] dark:text-slate-400">{user.email}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.status === "active" ? "bg-green-50 text-green-700 dark:bg-green-900/30" : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-400"}`}>
                                {user.status === "active" ? "Activo" : "Inactivo"}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                            <div className="bg-[#F9FAFB] dark:bg-slate-800 rounded-xl p-2">
                                <p className="text-xs text-[#6B7280] dark:text-slate-400">QR</p>
                                <p className="font-bold text-[#199A61]">{user.qrsScanned}</p>
                            </div>
                            <div className="bg-[#F9FAFB] dark:bg-slate-800 rounded-xl p-2">
                                <p className="text-xs text-[#6B7280] dark:text-slate-400">Puntos</p>
                                <p className="font-bold text-[#141B21] dark:text-white">{user.pointsEarned.toLocaleString()}</p>
                            </div>
                            <div className="bg-[#F9FAFB] dark:bg-slate-800 rounded-xl p-2">
                                <p className="text-xs text-[#6B7280] dark:text-slate-400">Registro</p>
                                <p className="font-bold text-[#141B21] dark:text-white text-xs">{new Date(user.joinDate).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 border-t border-[#E0E5EB] dark:border-slate-800 pt-3">
                            <button onClick={() => setSelectedUser(user)} className="flex-1 text-center text-[#199A61] font-semibold text-sm">Ver Detalles</button>
                            <button onClick={() => setUserToDelete(user)} className="flex-1 text-center text-red-500 font-semibold text-sm">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden sm:block bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#F9FAFB] dark:bg-slate-950 border-b border-[#E0E5EB] dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] dark:text-slate-400 uppercase">Usuario</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] dark:text-slate-400 uppercase">QR Escaneados</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] dark:text-slate-400 uppercase">Puntos Ganados</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] dark:text-slate-400 uppercase">Fecha de Registro</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] dark:text-slate-400 uppercase">Estado</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] dark:text-slate-400 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E0E5EB] dark:divide-slate-800">
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
                        </tbody>
                    </table>
                </div>
            </div>

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
                            <div className="w-16 h-16 rounded-full bg-[#199A61]/10 dark:bg-green-900/30 flex items-center justify-center">
                                <i className="bi bi-person text-3xl text-[#199A61]"></i>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-[#141B21] dark:text-white">{selectedUser.name}</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedUser.status === "active" ? "bg-green-50 text-green-700 dark:bg-green-900/30" : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400"}`}>
                                    {selectedUser.status === "active" ? "Activo" : "Inactivo"}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[ {icon: "envelope", label: "Email", val: selectedUser.email}, {icon: "telephone", label: "Teléfono", val: selectedUser.phone}, {icon: "qr-code", label: "QR Escaneados", val: selectedUser.qrsScanned}, {icon: "star", label: "Puntos Ganados", val: selectedUser.pointsEarned.toLocaleString()}, {icon: "calendar", label: "Fecha de Registro", val: new Date(selectedUser.joinDate).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })} ].map((item, i) => (
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
                        <p className="text-[#6B7280] dark:text-slate-400 mb-6">¿Estás seguro? Esta acción no se puede deshacer.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setUserToDelete(null)} className="flex-1 py-3 border border-[#E0E5EB] dark:border-slate-700 text-[#141B21] dark:text-white font-semibold rounded-xl">Cancelar</button>
                            <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}