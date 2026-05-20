import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import UserHeader from "../components/UserHeader";
import HamburgerMenu from "../components/HamburgerMenu";
import Sidebar from "../components/Sidebar";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

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
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <div className="flex justify-between items-center pt-3 px-4 lg:hidden">
          <UserHeader onMenu={() => setMenuOpen(true)} />
        </div>
        
        <div className="hidden lg:flex items-center justify-end px-4 lg:px-8 pt-4 pb-2">
          <UserHeader onMenu={() => setMenuOpen(true)} showMenu={false} showDarkMode={true} />
        </div>

        <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="w-full max-w-md lg:max-w-6xl mx-auto px-4 lg:px-8 pt-4 lg:pt-6 pb-6 flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
            <div>
              <div className="font-bold text-[#141B21] dark:text-slate-100" style={{ fontSize: 22 }}>
                Contenedores Cercanos
              </div>
              <div className="text-xs text-[#7D8797] dark:text-slate-400 mt-0.5" style={{ fontSize: 14 }}>
                Basado en tu ubicación actual
              </div>
            </div>
            <div className="flex justify-start lg:justify-end">
              <Link
                to="/scan"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 dark:bg-green-500 font-bold hover:bg-green-700 dark:hover:bg-green-600 transition text-white shadow-sm shadow-green-600/10"
                style={{ minHeight: 44 }}
              >
                <i className="bi bi-qr-code-scan" style={{ fontSize: 18, color: "#ffffff" }}></i>
                Escanear QR
              </Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden w-full mb-5 border border-[#E0E5EB] dark:border-slate-800 shadow-sm h-[210px] lg:h-[360px] dark:invert-[90%] dark:hue-rotate-180 transition-all duration-300">
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
                    <b className="text-slate-900">{c.nombre}</b><br />
                    <span className="text-slate-700">{c.direccion}</span>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="mb-5">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-500">
                <i className="fi fi-rr-search"></i>
              </span>
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Buscar contenedor"
                className="w-full pl-9 pr-3 py-2 bg-[#F7FAFC] dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-xl text-[16px] text-slate-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
            {contenedoresPagina.length > 0 ? contenedoresPagina.map((c, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E0E5EB] dark:border-slate-800 flex justify-between items-center px-5 py-4 shadow-sm transition-colors duration-300"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#222] dark:text-slate-200 text-[16px] truncate">{c.nombre}</div>
                  <div className="text-[#7D8797] dark:text-slate-400 text-[13px] truncate mt-0.5">{c.direccion}</div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="rounded-full bg-[#F1F5F9] dark:bg-slate-800 text-[#364152] dark:text-slate-300 border border-[#E0E5EB] dark:border-slate-700 text-xs px-2.5 py-0.5 font-medium">{c.tipo}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end ml-4 shrink-0">
                  <span className={`inline-block font-bold px-2.5 py-1 rounded-xl text-xs mb-2 text-white text-center shadow-sm
                  ${c.estado === "Disponible"
                      ? "bg-green-600 dark:bg-green-500"
                      : "bg-red-500 dark:bg-red-600"}`}
                    style={{ minWidth: 84 }}
                  >
                    {c.estado}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-slate-400">
                    <i className="fi fi-rr-marker text-green-600 dark:text-green-400" />
                    <span>{c.km} km</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-400 dark:text-slate-500 py-8 lg:col-span-2">Sin resultados</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mb-6 mt-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`px-3 py-1 rounded-lg border text-base font-bold transition
                ${page === 1
                    ? "bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-slate-600 border-gray-200 dark:border-slate-700 cursor-not-allowed"
                    : "bg-white dark:bg-slate-900 text-[#141B21] dark:text-slate-200 border-[#E0E5EB] dark:border-slate-800 hover:bg-[#F7FAFC] dark:hover:bg-slate-800"
                  }`}
              >{"<"}</button>
              <span className="text-sm font-medium text-gray-600 dark:text-slate-400">{page} / {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`px-3 py-1 rounded-lg border text-base font-bold transition
                ${page === totalPages
                    ? "bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-slate-600 border-gray-200 dark:border-slate-700 cursor-not-allowed"
                    : "bg-white dark:bg-slate-900 text-[#141B21] dark:text-slate-200 border-[#E0E5EB] dark:border-slate-800 hover:bg-[#F7FAFC] dark:hover:bg-slate-800"
                  }`}
              >{">"}</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}