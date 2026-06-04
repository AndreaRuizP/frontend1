import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import UserHeader from "../components/UserHeader";
import HamburgerMenu from "../components/HamburgerMenu";
import Sidebar from "../components/Sidebar";
import { getContainers } from "../api/containers";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const SANTA_MARTA_CENTER = [11.2408, -74.2027];
const PAGE_SIZE_MOBILE  = 3;
const PAGE_SIZE_DESKTOP = 4;

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function statusLabel(status) {
  return status === "active" ? "Disponible" : status === "full" ? "Lleno" : "Inactivo";
}

function statusColor(status) {
  if (status === "active") return "bg-emerald-600 dark:bg-emerald-500";
  if (status === "full")   return "bg-red-500 dark:bg-red-600";
  return "bg-gray-400 dark:bg-gray-600";
}

function typeLabel(type) {
  const map = { recycling: "Reciclaje", organic: "Orgánico", general: "General" };
  return map[type] || type;
}

function MapFocus({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 16, { duration: 0.8 });
  }, [center, map]);
  return null;
}

export default function Map() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [search, setSearch]           = useState("");
  const [page, setPage]               = useState(1);
  const [containers, setContainers]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [userPos, setUserPos]         = useState(null);
  const [focused, setFocused]         = useState(null);
  const [isDesktop, setIsDesktop]     = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  useEffect(() => {
    getContainers()
      .then((data) => setContainers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageSize = isDesktop ? PAGE_SIZE_DESKTOP : PAGE_SIZE_MOBILE;

  const enriched = containers.map((c) => ({
    ...c,
    km: userPos
      ? haversineKm(userPos.lat, userPos.lng, c.latitude, c.longitude).toFixed(1)
      : null,
  }));

  const resultado = enriched
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        typeLabel(c.type).toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (a.km ?? 999) - (b.km ?? 999));

  const totalPages = Math.ceil(resultado.length / pageSize);
  const paginated  = resultado.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(resultado.length / pageSize));
    if (page > maxPage) setPage(maxPage);
  }, [resultado.length, pageSize, page]);

  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  const mapCenter = focused
    ? [focused.latitude, focused.longitude]
    : userPos
    ? [userPos.lat, userPos.lng]
    : SANTA_MARTA_CENTER;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <div className="flex justify-between items-center pt-3 px-4 lg:hidden">
          <UserHeader onMenu={() => setMenuOpen(true)} />
        </div>

        <div className="hidden lg:flex items-center justify-end px-6 py-4 border-b border-[#E0E5EB] dark:border-slate-800">
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
                {loading
                  ? "Cargando contenedores..."
                  : `${containers.length} contenedor${containers.length !== 1 ? "es" : ""} en Santa Marta`}
              </div>
            </div>
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 self-start lg:self-auto px-5 py-2.5 rounded-xl bg-emerald-600 dark:bg-emerald-500 font-semibold text-sm text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
            >
              <i className="bi bi-qr-code-scan text-base leading-none"></i>
              Escanear QR
            </Link>
          </div>

          <div className="rounded-2xl overflow-hidden w-full mb-5 border border-[#E0E5EB] dark:border-slate-800 shadow-sm h-[210px] lg:h-[380px] dark:invert-[90%] dark:hue-rotate-180 transition-all duration-300">
            <MapContainer
              center={SANTA_MARTA_CENTER}
              zoom={13}
              scrollWheelZoom={true}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                attribution='© OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapFocus center={focused ? [focused.latitude, focused.longitude] : null} />

              {containers.map((c) => (
                <Marker key={c.id} position={[c.latitude, c.longitude]}>
                  <Popup>
                    <div style={{ minWidth: 160 }}>
                      <p className="font-bold text-slate-900 mb-1">{c.name}</p>
                      <p className="text-xs text-slate-600 mb-1">{typeLabel(c.type)}</p>
                      <span className={`text-xs text-white px-2 py-0.5 rounded-full font-semibold ${statusColor(c.status)}`}>
                        {statusLabel(c.status)}
                      </span>
                    </div>
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
                placeholder="Buscar contenedor por nombre o tipo"
                className="w-full pl-9 pr-3 py-2 bg-[#F7FAFC] dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-xl text-[16px] text-slate-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E0E5EB] dark:border-slate-800 h-24 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
              {paginated.length > 0 ? paginated.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFocused(c)}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border flex justify-between items-center px-5 py-4 shadow-sm transition-all text-left w-full
                    ${focused?.id === c.id
                      ? "border-emerald-400 dark:border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900"
                      : "border-[#E0E5EB] dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700"
                    }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#222] dark:text-slate-200 text-[16px] truncate">{c.name}</div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="rounded-full bg-[#F1F5F9] dark:bg-slate-800 text-[#364152] dark:text-slate-300 border border-[#E0E5EB] dark:border-slate-700 text-xs px-2.5 py-0.5 font-medium">
                        {typeLabel(c.type)}
                      </span>
                      <span className="rounded-full bg-[#F1F5F9] dark:bg-slate-800 text-[#364152] dark:text-slate-300 border border-[#E0E5EB] dark:border-slate-700 text-xs px-2.5 py-0.5 font-medium">
                        Cap. {c.capacity} L
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end ml-4 shrink-0 gap-2">
                    <span className={`inline-block font-bold px-2.5 py-1 rounded-xl text-xs text-white shadow-sm ${statusColor(c.status)}`}
                      style={{ minWidth: 84, textAlign: "center" }}>
                      {statusLabel(c.status)}
                    </span>
                    {c.km !== null && (
                      <div className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-slate-400">
                        <i className="fi fi-rr-marker text-emerald-600 dark:text-emerald-400" />
                        <span>{c.km} km</span>
                      </div>
                    )}
                  </div>
                </button>
              )) : (
                <div className="text-center text-gray-400 dark:text-slate-500 py-8 lg:col-span-2">
                  {containers.length === 0 ? "No hay contenedores registrados" : "Sin resultados"}
                </div>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mb-6 mt-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`px-3 py-1 rounded-lg border text-base font-bold transition
                  ${page === 1
                    ? "bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-slate-600 border-gray-200 dark:border-slate-700 cursor-not-allowed"
                    : "bg-white dark:bg-slate-900 text-[#141B21] dark:text-slate-200 border-[#E0E5EB] dark:border-slate-800 hover:bg-[#F7FAFC] dark:hover:bg-slate-800"}`}
              >{"<"}</button>
              <span className="text-sm font-medium text-gray-600 dark:text-slate-400">{page} / {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`px-3 py-1 rounded-lg border text-base font-bold transition
                  ${page === totalPages
                    ? "bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-slate-600 border-gray-200 dark:border-slate-700 cursor-not-allowed"
                    : "bg-white dark:bg-slate-900 text-[#141B21] dark:text-slate-200 border-[#E0E5EB] dark:border-slate-800 hover:bg-[#F7FAFC] dark:hover:bg-slate-800"}`}
              >{">"}</button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
