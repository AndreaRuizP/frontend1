import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu";
import UserHeader from "../components/UserHeader";
import Sidebar from "../components/Sidebar";
import ValidationResult from "../components/ValidationResult";
import PhotoPreview from "../components/PhotoPreview";
import CameraCapture from "../components/CameraCapture";
import QRDetectedPrompt from "../components/QRDetectedPrompt";

function parseContainerQR(text) {
    const extract = (label, nextLabels) => {
        const pattern = new RegExp(
            `${label}:\\s*(.+?)(?=\\s*(?:${nextLabels.join("|")}):|\s*$)`,
            "i"
        );
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

function ContainerInfoCard({ info }) {
    const rows = [
        { label: "Código", value: info.codigo, mono: true },
        { label: "Nombre", value: info.nombre },
        { label: "Dirección", value: info.direccion },
        { label: "Sector", value: info.sector },
        { label: "Coordenadas", value: info.coordenadas, mono: true },
    ].filter(r => r.value);

    if (!rows.length) return null;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-[#E0E5EB] dark:border-slate-800 p-5 lg:p-6 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-950/60 flex items-center justify-center shrink-0">
                    <i className="bi bi-geo-alt-fill text-green-600 dark:text-green-400 text-sm"></i>
                </div>
                <p className="font-bold text-[#141B21] dark:text-slate-100 text-sm">Información del contenedor</p>
            </div>
            <div className="space-y-2.5">
                {rows.map(({ label, value, mono }) => (
                    <div key={label} className="flex gap-2 items-baseline">
                        <span className="text-xs font-semibold text-[#6B7280] dark:text-slate-400 w-24 shrink-0">{label}:</span>
                        <span className={`text-xs text-[#141B21] dark:text-slate-200 ${mono ? "font-mono bg-gray-50 dark:bg-slate-800 px-1.5 py-0.5 rounded text-red-500 dark:text-emerald-400" : ""}`}>{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function CapturePhoto() {
    const [searchParams] = useSearchParams();
    const qrCode = searchParams.get("qr") || "";
    const containerInfo = qrCode ? parseContainerQR(qrCode) : null;

    const [menuOpen, setMenuOpen] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [photoCapture, setPhotoCapture] = useState(null);
    const [validationResult, setValidationResult] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [cameraError, setCameraError] = useState(null);

    const handleValidatePhoto = async () => {
        setIsValidating(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setValidationResult({
            success: true,
            title: "¡Reciclaje Validado!",
            points: 46,
            message: "Material reciclable detectado correctamente"
        });
        setIsValidating(false);
    };

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

                <main className="w-full max-w-md lg:max-w-4xl mx-auto px-4 lg:px-8 py-4 lg:py-6 flex-1">
                    <div className="space-y-4 lg:space-y-6">
                        {validationResult && <ValidationResult {...validationResult} />}

                        {photoCapture && !validationResult && (
                            <PhotoPreview
                                photo={photoCapture}
                                qrCode={qrCode}
                                onRetake={() => setPhotoCapture(null)}
                                onValidate={handleValidatePhoto}
                                isValidating={isValidating}
                            />
                        )}

                        {showCamera && !photoCapture && (
                            <CameraCapture
                                onCapture={(photo) => {
                                    setPhotoCapture(photo);
                                    setShowCamera(false);
                                }}
                                onCancel={() => setShowCamera(false)}
                                cameraError={cameraError}
                                setCameraError={setCameraError}
                            />
                        )}

                        {!showCamera && !photoCapture && !validationResult && (
                            <>
                                <QRDetectedPrompt onOpenCamera={() => setShowCamera(true)} />
                                {containerInfo && <ContainerInfoCard info={containerInfo} />}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}