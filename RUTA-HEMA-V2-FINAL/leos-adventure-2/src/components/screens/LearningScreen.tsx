import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSharedGameState } from "@/contexts/GameStateContext";
import { getPatientPassport, recordLearning } from "@/lib/ruta-hema-sync";
import { ArrowLeftIcon, CheckCircleIcon, FolderOpenIcon, PlayIcon, VideoCameraIcon } from "@phosphor-icons/react/ssr";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type VideoGuide = {
  id: string;
  icon: string;
  title: string;
  duration: string;
  description: string;
  objective: string;
  file: string;
  mimeType?: string;
  poster?: string;
  enabled?: boolean;
};

const defaultGuides: VideoGuide[] = [
  { id: "antes", icon: "🎒", title: "Antes de mi tratamiento", duration: "2–4 min", description: "Una guía para conocer el lugar, al equipo y expresar cómo me siento.", objective: "Preparación y seguridad emocional", file: "media/videos/antes-del-tratamiento.mp4", mimeType: "video/mp4" },
  { id: "durante", icon: "🏥", title: "Durante mi visita", duration: "3–5 min", description: "Explica con lenguaje sencillo quién acompaña y qué puede preguntar el niño.", objective: "Acompañamiento y comunicación", file: "media/videos/durante-la-visita.mp4", mimeType: "video/mp4" },
  { id: "despues", icon: "🏠", title: "Después del tratamiento", duration: "2–4 min", description: "Ayuda a reconocer emociones y conversar con el adulto responsable después de la atención.", objective: "Expresión emocional", file: "media/videos/despues-del-tratamiento.mp4", mimeType: "video/mp4" },
];

function projectUrl(path: string) {
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("blob:") || path.startsWith("data:")) return path;
  if (path.startsWith("/")) return path;
  const cleanPath = path.replace(/^\/+/, "");
  const prefix = window.location.pathname.includes("/leos-adventure-2/") ? "/leos-adventure-2/" : "/";
  return `${prefix}${cleanPath}`;
}

export function LearningScreen() {
  const { gameState, updateCurrentScreen } = useSharedGameState();
  const passport = getPatientPassport(gameState.patientId);
  const [guides, setGuides] = useState<VideoGuide[]>(defaultGuides);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<"loading" | "ready" | "missing" | "finished">("loading");
  const active = guides.find(item => item.id === activeId);

  useEffect(() => {
    fetch(projectUrl("media/videos/catalogo-videos.json"), { cache: "no-store" })
      .then(response => {
        if (!response.ok) throw new Error("Catálogo no disponible");
        return response.json();
      })
      .then((items: VideoGuide[]) => {
        const validItems = items.filter(item => item.enabled !== false && item.id && item.title && item.file);
        if (validItems.length) setGuides(validItems);
      })
      .catch(() => setGuides(defaultGuides));
  }, []);

  const open = (id: string) => {
    setActiveId(id);
    setPlayerState("loading");
  };

  const finish = () => {
    if (!active || !gameState.patientId) return;
    recordLearning(gameState.patientId, "video", active.id);
    setPlayerState("finished");
    toast.success("¡Video terminado y guardado en tu bitácora!");
  };

  return (
    <div className="passport-shell min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => updateCurrentScreen("journey")}><ArrowLeftIcon className="w-5 h-5 mr-2" />Mi pasaporte</Button>
          <span className="passport-chip">{passport?.ageLabel}</span>
        </div>
        <div>
          <p className="passport-kicker">Biblioteca de preparación</p>
          <h1 className="text-3xl font-fredoka font-bold">Videos instructivos</h1>
          <p className="text-muted-foreground mt-1">Reproductores reales preparados para los videos validados por el equipo.</p>
        </div>

        {active ? (
          <Card className="passport-page p-5 md:p-6">
            <div className="video-heading">
              <span className="video-heading-icon">{active.icon}</span>
              <div><p className="passport-kicker">Video guía · {active.duration}</p><h2 className="text-2xl font-fredoka font-bold">{active.title}</h2><p className="text-sm text-muted-foreground mt-1">{active.description}</p></div>
            </div>

            <div className={`video-player-frame ${playerState === "missing" ? "is-missing" : ""}`}>
              <video
                key={active.id}
                className="video-player-element"
                controls
                controlsList="nodownload"
                playsInline
                preload="metadata"
                poster={active.poster ? projectUrl(active.poster) : undefined}
                onLoadedMetadata={() => setPlayerState("ready")}
                onError={() => setPlayerState("missing")}
                onEnded={finish}
              >
                <source src={projectUrl(active.file)} type={active.mimeType || "video/mp4"} />
                Tu navegador no puede reproducir este video.
              </video>
              {playerState === "loading" && <div className="video-player-status"><VideoCameraIcon size={34} /><b>Cargando reproductor…</b></div>}
              {playerState === "missing" && (
                <div className="video-missing-panel">
                  <FolderOpenIcon size={42} weight="duotone" />
                  <h3>Falta copiar el archivo de video</h3>
                  <p>Coloca el MP4 con este nombre:</p>
                  <code>{active.file.split("/").pop()}</code>
                  <p className="video-missing-route">en <b>leos-adventure-2\media\videos\</b></p>
                </div>
              )}
            </div>

            <div className="video-meta-row">
              <span><b>Objetivo:</b> {active.objective}</span>
              <span className={`video-status-badge ${playerState}`}>{playerState === "missing" ? "Archivo pendiente" : playerState === "finished" ? "✓ Terminado" : "Formato MP4 · 16:9"}</span>
            </div>
            <p className="text-sm text-muted-foreground my-4">El video se registra en la bitácora únicamente cuando llega al final. Utilicen solo material revisado por el equipo responsable.</p>
            <div className="flex gap-3 justify-end"><Button variant="outline" onClick={() => setActiveId(null)}>Volver a los videos</Button>{playerState === "finished" && <Button onClick={() => setActiveId(null)}><CheckCircleIcon className="mr-2" />Continuar</Button>}</div>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4">
              {guides.map(item => (
                <Card key={item.id} className="passport-page p-5 flex flex-col gap-3 hover-lift">
                  <div className="lesson-cover"><span>{item.icon}</span><i><PlayIcon weight="fill" /></i></div>
                  <div><span className="passport-chip">{item.duration}</span><h2 className="font-fredoka text-xl font-semibold mt-3">{item.title}</h2><p className="text-sm text-muted-foreground mt-2">{item.description}</p></div>
                  <Button className="mt-auto" onClick={() => open(item.id)}><PlayIcon className="mr-2" weight="fill" />Abrir reproductor</Button>
                </Card>
              ))}
            </div>

            <details className="video-upload-guide">
              <summary><FolderOpenIcon size={22} /> Ruta y formato para colocar los videos</summary>
              <div className="video-upload-body">
                <p><b>Carpeta exacta dentro del proyecto:</b></p>
                <code>RUTA-HEMA-V2-FINAL\leos-adventure-2\media\videos\</code>
                <div className="video-tech-grid">
                  <div><b>Formato recomendado</b><span>MP4 · video H.264 · audio AAC</span></div>
                  <div><b>Proporción</b><span>16:9 · 1280×720 o 1920×1080</span></div>
                  <div><b>Nombres</b><span>Minúsculas, sin espacios ni tildes</span></div>
                </div>
                <ol>
                  <li>Copien los archivos MP4 en esa carpeta.</li>
                  <li>Usen los nombres indicados en cada reproductor o editen <code>catalogo-videos.json</code>.</li>
                  <li>Vuelvan a abrir la aplicación o presionen <b>Ctrl + F5</b>. No es necesario recompilar.</li>
                </ol>
                <p className="text-sm">La guía completa está en <b>leos-adventure-2\media\videos\LEEME-COMO-AGREGAR-VIDEOS.md</b>.</p>
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
}
