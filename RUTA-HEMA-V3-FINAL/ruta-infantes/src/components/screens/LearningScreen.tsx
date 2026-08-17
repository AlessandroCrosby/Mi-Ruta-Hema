import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSharedGameState } from "@/contexts/GameStateContext";
import { getPatientPassport, recordLearning } from "@/lib/ruta-hema-sync";
import { ArrowLeftIcon, CheckCircleIcon, PlayIcon } from "@phosphor-icons/react/ssr";
import { useState } from "react";
import { toast } from "sonner";

const lessons = [
  { id: "antes", icon: "🎒", title: "Antes de mi tratamiento", duration: "2 min", slides: ["Hoy conocerás tu siguiente paso.", "Tu equipo te explicará lo que sucederá.", "Puedes preguntar y decir cómo te sientes."] },
  { id: "durante", icon: "🏥", title: "Durante mi visita", duration: "3 min", slides: ["Registra tu llegada.", "Conoce al equipo que te acompañará.", "Descansa y avisa si necesitas ayuda."] },
  { id: "despues", icon: "🏠", title: "Después del tratamiento", duration: "2 min", slides: ["Revisa la próxima cita con tu adulto.", "Sigue solo las indicaciones de tu equipo.", "Comunica cualquier dificultad para regresar."] },
];

export function LearningScreen() {
  const { gameState, updateCurrentScreen } = useSharedGameState();
  const passport = getPatientPassport(gameState.patientId);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const active = lessons.find(item => item.id === activeId);

  const open = (id: string) => { setActiveId(id); setSlide(0); };
  const next = () => {
    if (!active || !gameState.patientId) return;
    if (slide < active.slides.length - 1) setSlide(value => value + 1);
    else {
      recordLearning(gameState.patientId, "video", active.id);
      toast.success("¡Video guardado en tu bitácora!");
      setActiveId(null);
    }
  };

  return (
    <div className="passport-shell min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => updateCurrentScreen("journey")}><ArrowLeftIcon className="w-5 h-5 mr-2" />Mi pasaporte</Button>
          <span className="passport-chip">{passport?.ageLabel}</span>
        </div>
        <div><p className="passport-kicker">Biblioteca de viaje</p><h1 className="text-3xl font-fredoka font-bold">Videos: conozco mi tratamiento</h1><p className="text-muted-foreground mt-1">El mismo recorrido, explicado con un diseño y lenguaje adecuados para tu edad.</p></div>

        {active ? (
          <Card className="passport-page p-6">
            <div className="lesson-player">
              <div className="text-5xl mb-4">{active.icon}</div>
              <p className="passport-kicker text-white/70">Video guía · escena {slide + 1} de {active.slides.length}</p>
              <h2 className="text-2xl font-fredoka font-bold max-w-lg">{active.slides[slide]}</h2>
              <div className="lesson-progress"><i style={{ width: `${((slide + 1) / active.slides.length) * 100}%` }} /></div>
            </div>
            <p className="text-sm text-muted-foreground my-4">Contenido demostrativo sin indicaciones clínicas. Los materiales finales se sustituirán por videos validados por el servicio.</p>
            <div className="flex gap-3 justify-end"><Button variant="outline" onClick={() => setActiveId(null)}>Cerrar</Button><Button onClick={next}>{slide === active.slides.length - 1 ? <><CheckCircleIcon className="mr-2" />Terminar</> : "Siguiente escena"}</Button></div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {lessons.map(item => (
              <Card key={item.id} className="passport-page p-5 flex flex-col gap-3 hover-lift">
                <div className="lesson-cover">{item.icon}</div><div><span className="passport-chip">{item.duration}</span><h2 className="font-fredoka text-xl font-semibold mt-3">{item.title}</h2></div>
                <Button className="mt-auto" onClick={() => open(item.id)}><PlayIcon className="mr-2" weight="fill" />Reproducir guía</Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
