import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSharedGameState } from "@/contexts/GameStateContext";
import { getPatientPassport, recordLearning } from "@/lib/ruta-hema-sync";
import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const symbols = ["🩺", "🩺", "💧", "💧", "⭐", "⭐", "🫶", "🫶"];
const ageTitles = { little: "Encuentra los dibujos iguales", school: "Misión de memoria", teen: "Reto de conexión", "older-teen": "Pausa mental" };

export function GamesScreen() {
  const { gameState, updateCurrentScreen } = useSharedGameState();
  const passport = getPatientPassport(gameState.patientId);
  const cards = useMemo(() => [...symbols].sort(() => 0.5 - Math.random()), []);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (matched.length === cards.length && cards.length && gameState.patientId) {
      recordLearning(gameState.patientId, "game", "memory-passport");
      toast.success("¡Juego completado y registrado en tu bitácora!");
    }
  }, [matched.length, cards.length, gameState.patientId]);

  const flip = (index: number) => {
    if (open.length === 2 || open.includes(index) || matched.includes(index)) return;
    const next = [...open, index]; setOpen(next);
    if (next.length === 2) {
      setMoves(value => value + 1);
      window.setTimeout(() => {
        if (cards[next[0]] === cards[next[1]]) setMatched(value => [...value, ...next]);
        setOpen([]);
      }, 650);
    }
  };

  if (passport && !passport.parentalControls.gamesAllowed) return (
    <div className="passport-shell min-h-screen p-4 grid place-items-center"><Card className="passport-page max-w-md p-7 text-center"><div className="text-5xl">🔒</div><h1 className="font-fredoka text-2xl font-bold mt-3">Juegos en pausa</h1><p className="text-muted-foreground my-4">Tu adulto responsable desactivó temporalmente los juegos desde Mi Ruta Hema.</p><Button onClick={() => updateCurrentScreen("journey")}>Volver a mi pasaporte</Button></Card></div>
  );

  return (
    <div className="passport-shell min-h-screen p-4"><div className="max-w-2xl mx-auto space-y-5">
      <Button variant="ghost" onClick={() => updateCurrentScreen("journey")}><ArrowLeftIcon className="w-5 h-5 mr-2" />Mi pasaporte</Button>
      <Card className="passport-page p-6 text-center"><p className="passport-kicker">Juego adaptado · {passport?.ageLabel}</p><h1 className="font-fredoka text-3xl font-bold">{ageTitles[passport?.ageBand || "school"]}</h1><p className="text-muted-foreground">Encuentra las cuatro parejas. Llevas {moves} movimientos.</p>
        <div className="memory-grid">{cards.map((symbol,index)=>{const visible=open.includes(index)||matched.includes(index);return <button aria-label={visible?symbol:"Carta oculta"} className={`memory-card ${visible?"open":""}`} key={index} onClick={()=>flip(index)}>{visible?symbol:"✦"}</button>})}</div>
        {matched.length===cards.length && <div className="passport-stamp mx-auto mt-5">JUEGO<br/>COMPLETO</div>}
        <p className="text-xs text-muted-foreground mt-5">Tiempo recomendado por tu adulto: {passport?.parentalControls.dailyGameMinutes || 20} minutos al día.</p>
      </Card>
    </div></div>
  );
}
