import { useRef, useState, useEffect } from "react";
import { Camera, Upload, MapPin, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PhotoCaptureBoxProps {
  label?: string;
  hint?: string;
  onPhotoCapture?: (file: File, location?: { lat: number; lng: number }) => void;
  showLocation?: boolean;
}

interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: Date;
}

export function PhotoCaptureBox({
  label = "Câmera ou galeria",
  hint = "JPG ou PNG",
  onPhotoCapture,
  showLocation = false,
}: PhotoCaptureBoxProps) {
  const cameraRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  // Iniciar câmera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Câmera traseira em mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      toast.error("Não foi possível acessar a câmera", {
        description: "Verifique as permissões do navegador.",
      });
    }
  };

  // Parar câmera
  const stopCamera = () => {
    if (cameraRef.current?.srcObject) {
      const tracks = (cameraRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  // Capturar foto da câmera
  const capturePhoto = () => {
    if (cameraRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        canvasRef.current.width = cameraRef.current.videoWidth;
        canvasRef.current.height = cameraRef.current.videoHeight;
        ctx.drawImage(cameraRef.current, 0, 0);

        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const file = new File([blob], `photo-${timestamp}.jpg`, {
              type: "image/jpeg",
            });
            setPhotos((prev) => [...prev, file]);
            onPhotoCapture?.(file, location || undefined);

            toast.success("Foto capturada!", {
              description: "Foto salva com sucesso.",
            });

            stopCamera();
          }
        }, "image/jpeg");
      }
    }
  };

  // Obter localização GPS
  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não disponível neste navegador");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const locationData: LocationData = {
          lat: latitude,
          lng: longitude,
          accuracy: accuracy,
          timestamp: new Date(),
        };
        setLocation(locationData);
        setLocationInput(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setGettingLocation(false);

        toast.success("Localização capturada!", {
          description: `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`,
        });
      },
      (error) => {
        setGettingLocation(false);
        toast.error("Erro ao obter localização", {
          description: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Tratar upload de arquivo
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        setPhotos((prev) => [...prev, file]);
        onPhotoCapture?.(file, location || undefined);
      } else {
        toast.error("Formato inválido", {
          description: "Selecione apenas arquivos de imagem.",
        });
      }
    });
  };

  return (
    <div className="space-y-3">
      {/* Camera Preview */}
      {cameraActive && (
        <div className="relative w-full bg-black rounded-lg overflow-hidden">
          <video
            ref={cameraRef}
            autoPlay
            playsInline
            className="w-full h-auto aspect-video"
          />
          <canvas ref={canvasRef} className="hidden" />

          <div className="absolute inset-0 flex flex-col justify-between p-4">
            <div className="flex justify-end">
              <Button
                onClick={stopCamera}
                variant="secondary"
                size="sm"
                className="gap-1.5"
              >
                <X className="h-4 w-4" /> Fechar
              </Button>
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={capturePhoto} size="lg" className="gap-2">
                <Camera className="h-5 w-5" /> Capturar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Controls - visible quando câmera não ativa */}
      {!cameraActive && (
        <div className="space-y-3">
          {/* Main Upload Area */}
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-6 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-6 w-6 text-slate-600" strokeWidth={1.5} />
              <div className="text-sm font-medium text-slate-900">{label}</div>
              <div className="text-xs text-slate-600">{hint}</div>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={false}
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Button
              type="button"
              onClick={startCamera}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
            >
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Câmera</span>
            </Button>

            <Button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
            >
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Galeria</span>
            </Button>

            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>

            {showLocation && (
              <Button
                type="button"
                onClick={getLocation}
                disabled={gettingLocation}
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs sm:col-span-3"
              >
                {gettingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {gettingLocation ? "Buscando..." : "Localização GPS"}
              </Button>
            )}
          </div>

          {/* Location Display */}
          {showLocation && location && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <div className="font-semibold text-blue-900">Localização capturada</div>
                  <div className="text-blue-700 font-mono text-[10px]">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </div>
                  <div className="text-blue-600 text-[10px] mt-1">
                    Precisão: {location.accuracy.toFixed(0)}m
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location Input (Manual) */}
          {showLocation && (
            <div>
              <label className="text-xs font-semibold text-slate-900 mb-1 block">
                Localização (opcional)
              </label>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Latitude, Longitude ou endereço"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
              <div className="mt-1 text-[10px] text-slate-500">
                Preencha manualmente se o GPS não funcionar
              </div>
            </div>
          )}
        </div>
      )}

      {/* Photos List */}
      {photos.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-900">
            {photos.length} {photos.length === 1 ? "foto" : "fotos"} capturada{photos.length !== 1 ? "s" : ""}
          </div>
          <ul className="space-y-1">
            {photos.map((file, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
              >
                <span className="text-slate-700">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-slate-400 hover:text-red-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
