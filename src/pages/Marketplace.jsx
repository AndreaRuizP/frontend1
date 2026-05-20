import { useState } from "react";
import UserHeader from "../components/UserHeader";
import HamburgerMenu from "../components/HamburgerMenu";
import Sidebar from "../components/Sidebar";

const productos = [
  {
    nombre: "Bolsa reutilizable de fique",
    origen: "Artesanal · Santa Marta",
    puntos: 80,
    categoria: "Hogar",
  },
  {
    nombre: "Miel orgánica local",
    origen: "Apicultura · Magdalena",
    puntos: 120,
    categoria: "Comida",
  },
  {
    nombre: "Cuaderno de papel reciclado",
    origen: "Papelería · Colombia",
    puntos: 60,
    categoria: "Hogar",
  },
  {
    nombre: "Vela artesanal de seda",
    origen: "Hecho a mano · Barranquilla",
    puntos: 90,
    categoria: "Hogar",
  }
];

export default function Marketplace() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtro, setFiltro] = useState("Todos");
  const [search, setSearch] = useState("");

  const resultado = productos.filter(p =>
    (filtro === "Todos" || p.categoria === filtro) &&
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <div className="flex justify-between items-center pt-3 px-4 lg:hidden">
          <UserHeader onMenu={() => setMenuOpen(true)} showDarkMode={true} />
        </div>
        
        <div className="hidden lg:flex items-center justify-end px-6 py-4 border-b border-[#E0E5EB] dark:border-slate-800">
          <UserHeader 
            onMenu={() => setMenuOpen(true)} 
            showMenu={false} 
            showDarkMode={true} 
          />
        </div>
        <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="w-full max-w-md lg:max-w-6xl mx-auto px-4 lg:px-8 pt-4 lg:pt-6 pb-6 flex-1">
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-[#E0E5EB] dark:border-slate-800 px-5 py-4 flex items-center justify-between mb-4 lg:mb-6 transition-colors duration-300">
              <div>
                <div className="text-gray-500 dark:text-slate-400 font-medium text-sm" style={{ fontSize: 14 }}>
                  Tu saldo disponible
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-green-600 dark:text-green-400 font-black text-2xl" style={{ fontSize: 26 }}>
                    350
                  </span>
                  <span className="text-gray-500 dark:text-slate-400 text-sm font-medium" style={{ fontSize: 14 }}>
                    CleanPoints
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 dark:text-slate-500 text-sm font-medium" style={{ fontSize: 14 }}>
                  Canjeados
                </div>
                <div className="mt-1">
                  <span className="text-gray-600 dark:text-slate-300 font-bold text-lg" style={{ fontSize: 18 }}>
                    120
                  </span>
                  <span className="ml-1 text-gray-400 dark:text-slate-500 text-sm" style={{ fontSize: 14 }}>
                    pts
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4 relative">
              <span className="absolute left-3.5 top-3 text-gray-400 dark:text-slate-500">
                <i className="bi bi-search text-sm"></i>
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-green-500 dark:focus:border-green-400 shadow-sm transition-all"
                style={{ fontSize: 15 }}
              />
            </div>

            <div className="flex items-center gap-2 mb-4 lg:grid lg:grid-cols-4 lg:gap-3 lg:mb-6">
              {["Todos", "Hogar", "Comida", "Moda"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFiltro(tab)}
                  className={`flex-1 lg:flex-none lg:w-full py-2.5 rounded-xl border text-xs font-bold transition active:scale-95 focus:outline-none
                ${filtro === tab
                      ? "bg-green-600 text-white border-green-600 dark:bg-green-500 dark:border-green-500 shadow-sm"
                      : "bg-white dark:bg-slate-900 text-[#141B21] dark:text-slate-300 border-[#E0E5EB] dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`}
                  style={{ fontSize: 13, minHeight: 40 }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
              {resultado.map((p, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-[#E0E5EB] dark:border-slate-800 p-3.5 flex flex-col justify-between transition-all duration-300">
                  <div>
                    <div className="w-full bg-gray-50 dark:bg-slate-950/60 rounded-xl mb-3 flex items-center justify-center border border-gray-100 dark:border-slate-800/50" style={{ height: 120 }}>
                      <i className="bi bi-image text-3xl text-gray-300 dark:text-slate-700"></i>
                    </div>
                    
                    <span className="font-bold text-slate-800 dark:text-slate-100 leading-snug mb-1 block" style={{ fontSize: 15 }}>
                      {p.nombre}
                    </span>
                    <span className="text-gray-400 dark:text-slate-400 block mb-2 font-medium" style={{ fontSize: 13 }}>
                      {p.origen}
                    </span>
                  </div>

                  <div>
                    <span className="font-black text-amber-500 dark:text-amber-400 block mb-3 flex items-center gap-1" style={{ fontSize: 16 }}>
                      <i className="bi bi-lightning-charge-fill text-sm"></i>
                      {p.puntos} pts
                    </span>
                    
                    <button
                      className="w-full py-2.5 rounded-xl bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold transition active:scale-95 shadow-sm focus:outline-none"
                      style={{ minHeight: 38, fontSize: 14 }}
                    >
                      Canjear
                    </button>
                  </div>
                </div>
              ))}
            </div>
        </main>
      </div>
    </div>
  );
}