import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu";
import UserHeader from "../components/UserHeader";
import Sidebar from "../components/Sidebar";

function parseContainerQR(text) {
    const extract = (label, nextLabels) => {
        const pattern = new RegExp(`${label}:\\s*(.+?)(?=\\s*(?:${nextLabels.join("|")}):|\s*$)`, "i");
        const match = text.match(pattern);
        return match ? match[1].trim() : null;
    };
    return {
        codigo: extract("Código Contenedor", ["Nombre del Contenedor", "Dirección", "Sector", "Coordenadas"]),
        nombre: extract("Nombre del Contenedor", ["Dirección", "Sector", "Coordenadas"]),
        direccion: extract("Dirección", ["Sector", "Coordenadas"]),
        sector: extract("Sector", ["Coordenadas"]),
        coordenadas: extract("Coordenadas", []),
    };
}

export default function ScanQR() {
    const [showScanner, setShowScanner] = useState(false);
    const [qrResult, setQrResult] = useState(null);
    const [containerInfo, setContainerInfo] = useState(null);
    const [scannerError, setScannerError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const scannerRef = useRef(null);

    const playBeep = () => {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = 1800;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
        gain.gain.setValueAtTime(0.5, ctx.currentTime + 0.07);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.09);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    };

    const handleQRDetected = (qrValue) => {
        if (!qrValue) return;
        playBeep();
        setQrResult(qrValue);
        setContainerInfo(parseContainerQR(qrValue));
        setScannerError(null);
        setShowScanner(false);
        setTimeout(() => {
            navigate(`/capture-photo?qr=${encodeURIComponent(qrValue)}`);
        }, 800);
    };

    useEffect(() => {
        if (!showScanner) return;

        const scanner = new Html5Qrcode("html5-qr-reader");
        scannerRef.current = scanner;

        scanner
            .start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => handleQRDetected(decodedText),
                () => {}
            )
            .catch((err) => {
                setScannerError(
                    err?.message ||
                    "No se pudo abrir la cámara. Revisa los permisos del navegador."
                );
            });

        return () => {
            scanner.stop().catch(() => {});
        };
    }, [showScanner]); 

    const handleReset = () => {
        setQrResult(null);
        setContainerInfo(null);
        setScannerError(null);
        setShowScanner(false);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
            <Sidebar />

            <div className="flex-1 flex flex-col lg:ml-64">
                <div className="flex justify-between items-center pt-3 px-4 lg:hidden">
                    <UserHeader onMenu={() => setMenuOpen(true)} />
                </div>
                
                {/* CORRECCIÓN: Limpieza de barra rígida superior y activación de showDarkMode */}
                <div className="hidden lg:flex items-center justify-end px-4 lg:px-8 pt-4 pb-2">
                    <UserHeader onMenu={() => setMenuOpen(true)} showMenu={false} showDarkMode={true} />
                </div>

                <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

                <main className="w-full max-w-md lg:max-w-4xl mx-auto px-4 lg:px-8 py-4 lg:py-6 flex-1">
                    <div className="space-y-4 lg:space-y-6">
                        {/* CORRECCIÓN: Tarjeta principal con bg-white dark:bg-slate-900 y bordes sutiles */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-[#E0E5EB] dark:border-slate-800 p-5 lg:p-6 transition-colors duration-300">
                            <div className="flex items-start justify-between gap-4 mb-5">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">Lector QR</p>
                                    {/* CORRECCIÓN: Título adaptable dark:text-slate-100 */}
                                    <h2 className="text-xl lg:text-2xl font-black text-[#141B21] dark:text-slate-100 mt-1">Escanea el Código QR</h2>
                                    {/* CORRECCIÓN: Texto descriptivo adaptable dark:text-slate-400 */}
                                    <p className="text-sm lg:text-base text-[#6B7280] dark:text-slate-400 mt-2 leading-6 max-w-xl">
                                        Coloca el QR del contenedor dentro del marco para detectarlo automáticamente.
                                    </p>
                                </div>
                                {/* CORRECCIÓN: Icono superior derecho con soporte nocturno */}
                                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900/60 items-center justify-center shrink-0">
                                    <i className="bi bi-qr-code-scan text-xl text-green-600 dark:text-green-400"></i>
                                </div>
                            </div>

                            {!showScanner ? (
                                <div className="rounded-3xl border border-dashed border-[#C9D3DD] dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-950/50 px-5 py-8 lg:py-10 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 border border-green-100 dark:border-green-900/40 shadow-sm flex items-center justify-center mb-4">
                                        <i className="bi bi-qr-code-scan text-3xl text-green-600 dark:text-green-400"></i>
                                    </div>
                                    <p className="font-bold text-[#141B21] dark:text-slate-200 text-base lg:text-lg">Prepara tu cámara</p>
                                    <p className="text-sm text-[#6B7280] dark:text-slate-400 mt-1.5 max-w-md leading-5">
                                        Toca el botón para abrir el lector y apuntar al código QR del contenedor.
                                    </p>

                                    <button
                                        onClick={() => setShowScanner(true)}
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 dark:bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 dark:hover:bg-green-600 active:scale-95"
                                        style={{ minHeight: 44 }}
                                    >
                                        <i className="bi bi-qr-code-scan text-base"></i>
                                        Activar Escáner
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center w-full">
                                    <div
                                        className="w-full rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-800 mb-5 shadow-sm bg-black"
                                        style={{
                                            aspectRatio: "1/1",
                                            maxHeight: 420,
                                        }}
                                    >
                                        <div
                                            id="html5-qr-reader"
                                            className="w-full h-full"
                                        />
                                    </div>

                                    {scannerError && (
                                        <div className="mb-4 w-full rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                                            {scannerError}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                        <button
                                            onClick={handleReset}
                                            className="inline-flex items-center gap-2 rounded-xl border border-[#D0D7DE] dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-bold text-[#374151] dark:text-slate-300 transition hover:bg-gray-50 dark:hover:bg-slate-800"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={() => handleQRDetected("Código Contenedor: C-000001 Nombre del Contenedor: Bahía - Comuna 2 Dirección: Cra. 1c #10c-18 a 10c-78 Sector: Comuna 2 - Santa Marta Coordenadas: 11.247087, -74.213905")}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#141B21] dark:bg-slate-100 px-5 py-2.5 text-sm font-bold text-white dark:text-slate-950 transition hover:bg-black dark:hover:bg-white"
                                        >
                                            Simular lectura
                                        </button>
                                    </div>
                                </div>
                            )}

                            {qrResult && (
                                <div className="mt-5 rounded-2xl border border-green-100 dark:border-green-900/30 bg-green-50 dark:bg-green-950/20 px-4 py-3 flex items-center gap-3">
                                    <i className="bi bi-patch-check-fill text-green-600 dark:text-green-400 text-xl shrink-0"></i>
                                    <div>
                                        <p className="font-bold text-green-800 dark:text-green-400 text-sm">¡Contenedor detectado!</p>
                                        <p className="text-xs text-green-700 dark:text-green-500/90 mt-0.5">Redirigiendo a captura de foto...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}