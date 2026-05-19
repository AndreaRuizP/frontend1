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
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <div className="flex justify-between items-center pt-3 px-0 lg:hidden">
          <UserHeader onMenu={() => setMenuOpen(true)} />
        </div>
        <div className="hidden lg:flex items-center justify-end px-6 py-4 border-b border-[#E0E5EB]">
          <UserHeader onMenu={() => setMenuOpen(true)} showMenu={false} showDarkMode={false} />
        </div>
        <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="w-full max-w-md lg:max-w-6xl mx-auto px-4 lg:px-8 pt-4 lg:pt-6 pb-6 flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E0E5EB] px-5 py-4 flex items-center justify-between mb-4 lg:mb-6">
              <div>
                <div className="text-[#666] text-base" style={{ fontSize: 16 }}>
                  Tu saldo disponible
                </div>
                <div className="flex items-baseline gap-2 mt-0">
                  <span className="text-[#12B76A] font-bold text-xl" style={{ fontSize: 25 }}>
                    350
                  </span>
                  <span className="text-[#666] text-base" style={{ fontSize: 16 }}>
                    CleanPoints
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[#666] text-base" style={{ fontSize: 16 }}>
                  Canjeados
                </div>
                <span className="text-[#666] font-bold text-xl" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  120
                </span>
                <span className="ml-2 text-[#666] text-base" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  pts
                </span>
              </div>
            </div>

            <div className="mb-2 relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <i className="fi fi-rr-search"></i>
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full pl-9 pr-3 py-2 bg-[#F7FAFC] border border-[#E0E5EB] rounded-xl text-[16px] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 mb-4 lg:grid lg:grid-cols-4 lg:gap-3 lg:mb-6">
              {["Todos", "Hogar", "Comida", "Moda"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFiltro(tab)}
                  className={`flex-1 lg:flex-none lg:w-full py-2 rounded-xl border text-xs font-semibold transition
                ${filtro === tab
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-[#141B21] border-[#E0E5EB]"
                    }`}
                  style={{ fontSize: 13, minHeight: 36 }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
              {resultado.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-[#E0E5EB] p-3 lg:p-4 flex flex-col">
                  <div className="w-full bg-gray-100 rounded-xl mb-2 flex items-center justify-center" style={{ height: 110 }}>
                    <i className="fi fi-rr-picture text-3xl text-gray-300"></i>
                  </div>
                  <span className="font-semibold text-[#222] leading-snug mb-1" style={{ fontSize: 15 }}>
                    {p.nombre}
                  </span>
                  <span className="text-[#757575] mb-2" style={{ fontSize: 13 }}>
                    {p.origen}
                  </span>
                  <span className="font-bold text-[#FFC400] mb-3" style={{ fontSize: 15 }}>
                    {p.puntos} pts
                  </span>
                  <button
                    className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold transition hover:bg-green-700 active:scale-95 mt-auto"
                    style={{ minHeight: 36, fontSize: 14 }}
                  >
                    Canjear
                  </button>
                </div>
              ))}
            </div>
        </main>
      </div>
    </div>
  )
}