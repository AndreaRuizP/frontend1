import { useRef, useEffect } from "react";

export default function CameraCapture({ onCapture, onCancel, cameraError, setCameraError }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            setCameraError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error al acceder a la cámara:", error);
            setCameraError("No se pudo acceder a la cámara. Verifica los permisos.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const handleTakePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            
            const photo = canvasRef.current.toDataURL("image/jpeg");
            stopCamera();
            onCapture(photo);
        }
    };

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-[#E0E5EB] p-5 lg:p-6">
                <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600">Cámara</p>
                    <h2 className="text-xl lg:text-2xl font-black text-[#141B21] mt-1">Captura el residuo</h2>
                    <p className="text-sm lg:text-base text-[#6B7280] mt-2 leading-6">
                        Apunta tu cámara al residuo que vas a reciclar para validar la acción.
                    </p>
                </div>
                {cameraError ? (
                    <div className="rounded-2xl border border-red-300 bg-red-50 p-4 mb-4 text-center">
                        <p className="text-red-700 font-semibold">{cameraError}</p>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-gray-300 overflow-hidden mb-4 bg-black h-64 lg:h-80 flex items-center justify-center relative">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            stopCamera();
                            onCancel();
                        }}
                        className="flex-1 border border-[#D0D7DE] bg-white text-[#374151] font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleTakePhoto}
                        disabled={cameraError !== null}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
                    >
                        <i className="bi bi-camera-fill"></i>
                        Capturar Foto
                    </button>
                </div>
            </div>
        </div>
    );
}