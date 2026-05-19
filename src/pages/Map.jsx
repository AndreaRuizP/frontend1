import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import UserHeader from "../components/UserHeader";
import HamburgerMenu from "../components/HamburgerMenu";
import Sidebar from "../components/Sidebar";

const contenedores = [
  {
    nombre: "Contenedor Plaza Central",
    direccion: "Cra. 5 con Calle 22",
    km: 0.3,
    estado: "Disponible",
    tipo: "Plástico",
    lat: 11.241210, lng: -74.211022
  },
  {
    nombre: "Contenedor Parque Norte",
    direccion: "Calle 29 con Cra. 4",
    km: 0.7,
    estado: "Disponible",
    tipo: "Papel y Cartón",
    lat: 11.244350, lng: -74.213100
  },
  {
    nombre: "Contenedor Centro Comercial",
    direccion: "Av. Libertador con Cra. 16",
    km: 1.2,
    estado: "Lleno",
    tipo: "Vidrio",
    lat: 11.243000, lng: -74.220200
  },
  {
    nombre: "Contenedor Biblioteca Pública",
    direccion: "Calle 17 con Cra. 3",
    km: 1.5,
    estado: "Disponible",
    tipo: "Orgánicos",
    lat: 11.246499, lng: -74.210140
  },
  {
    nombre: "Contenedor Calle 10",
    direccion: "Calle 10 con Av. El Rio",
    km: 1.6,
    estado: "Lleno",
    tipo: "Plástico",
    lat: 11.250000, lng: -74.218000
  },
  {
    nombre: "Contenedor Calle 25",
    direccion: "Calle 25 con Cra. 15",
    km: 2.0,
    estado: "Disponible",
    tipo: "Vidrio",
    lat: 11.255000, lng: -74.220000
  },
  {
    nombre: "Contenedor Las Delicias",
    direccion: "Cra. 12 con Calle 41",
    km: 2.3,
    estado: "Disponible",
    tipo: "Orgánicos",
    lat: 11.251150, lng: -74.212000
  }
];

const PAGE_SIZE_MOBILE = 3;
const PAGE_SIZE_DESKTOP = 4;

export default function Map() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 1024);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageSize = isDesktop ? PAGE_SIZE_DESKTOP : PAGE_SIZE_MOBILE;

  const resultado = contenedores.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.direccion.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(resultado.length / pageSize);
  const contenedoresPagina = resultado.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(resultado.length / pageSize));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [resultado.length, pageSize, page]);

  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(1);
  }

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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
            <div>
              <div className="font-bold text-[#141B21]" style={{ fontSize: 22 }}>
                Contenedores Cercanos
              </div>
              <div className="text-xs text-[#7D8797]" style={{ fontSize: 15 }}>
                Basado en tu ubicación actual
              </div>
            </div>
            <div className="flex justify-start lg:justify-end">
              <Link
                to="/scan"
                className="flex items-center gap-2 border border-[#ddd] px-4 py-2 rounded-xl bg-green-600 font-semibold active:bg-gray-50 transition text-white"
                style={{ minHeight: 44 }}
              >
                <i className="bi bi-qr-code-scan" style={{ fontSize: 20, color: "#ffffff" }}></i>
                Escanear QR
              </Link>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden w-full mb-4 border border-[#E0E5EB] shadow h-[210px] lg:h-[340px]">
            <MapContainer
              center={[11.241210, -74.211022]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                attribution='© OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {contenedores.map((c, i) => (
                <Marker position={[c.lat, c.lng]} key={i}>
                  <Popup>
                    <b>{c.nombre}</b><br />
                    {c.direccion}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="mb-4">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <i className="fi fi-rr-search"></i>
              </span>
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Buscar contenedor"
                className="w-full pl-9 pr-3 py-2 bg-[#F7FAFC] border border-[#E0E5EB] rounded-xl text-[16px] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-4">
            {contenedoresPagina.length > 0 ? contenedoresPagina.map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#E0E5EB] flex justify-between items-center px-6 py-5 shadow-sm"
                style={{ boxShadow: "0 2px 8px 0 #f1f4f9" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#222] text-[17px] truncate">{c.nombre}</div>
                  <div className="text-[#7D8797] text-[14px] truncate">{c.direccion}</div>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="rounded-full bg-[#F1F5F9] text-[#364152] border border-[#E0E5EB] text-xs px-3 py-0.5 font-medium">{c.tipo}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end ml-6 shrink-0">
                  <span className={`inline-block font-bold px-3 py-1 rounded-lg text-xs mb-2
                ${c.estado === "Disponible"
                    ? "bg-[#12B76A] text-white"
                    : "bg-[#F04438] text-white"}`}
                    style={{ minWidth: 80, textAlign: "center" }}
                  >
                    {c.estado}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-[#818181]">
                    <i className="fi fi-rr-marker" />
                    <span style={{ fontSize: 15 }}>{c.km} km</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-400 py-8 lg:col-span-2">Sin resultados</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-6">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`px-3 py-1 rounded-lg border text-base font-bold transition
              ${page === 1
                    ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                    : "bg-white text-[#141B21] border-[#E0E5EB] hover:bg-[#F7FAFC]"
                  }`}
              >&lt;</button>
              <span className="text-sm text-gray-700">{page} / {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`px-3 py-1 rounded-lg border text-base font-bold transition
              ${page === totalPages
                    ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                    : "bg-white text-[#141B21] border-[#E0E5EB] hover:bg-[#F7FAFC]"
                  }`}
              >&gt;</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}