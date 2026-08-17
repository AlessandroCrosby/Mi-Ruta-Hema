import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSharedGameState } from "@/contexts/GameStateContext";
import { getPatientPassport } from "@/lib/ruta-hema-sync";
import { GearIcon, HeartIcon } from "@phosphor-icons/react/ssr";
import { useEffect } from "react";

export function WelcomeScreen() {
  const { updateCurrentScreen, toggleStaffAccess, gameState, createTestProfiles, setPatientId } = useSharedGameState();
  const passport = getPatientPassport(gameState?.patientId);

  useEffect(() => {
    const fromLink = new URLSearchParams(window.location.search).get("patient")?.toUpperCase();
    if (fromLink && /^H-\d{3}$/.test(fromLink) && fromLink !== gameState?.patientId) setPatientId(fromLink);
  }, [gameState?.patientId, setPatientId]);

  return (
    <div className="passport-shell min-h-screen flex flex-col items-center justify-center p-4">
      <Button variant="ghost" size="sm" onClick={toggleStaffAccess} className="absolute top-4 right-4 opacity-20 hover:opacity-100" aria-label="Acceso de demostración">
        <GearIcon className="w-5 h-5" />
      </Button>

      <div className="max-w-xl w-full space-y-6 text-center">
        <div className="space-y-2">
          <div className="text-6xl animate-bounce-gentle">🛂</div>
          <p className="passport-kicker">Bitácora infantil de cuidado</p>
          <h1 className="text-4xl font-fredoka font-bold text-foreground">Mi Pasaporte Ruta Hema</h1>
          <p className="text-lg text-muted-foreground">Cada visita deja un sello. Cada avance cuenta.</p>
        </div>

        <Card className="passport-page p-7 space-y-6 hover-lift text-left">
          <div className="flex items-start gap-4">
            <div className="passport-photo">{passport?.selectedAvatar === "tuntung" ? "🪵" : "🦁"}</div>
            <div className="flex-1">
              <p className="passport-kicker">Pasaporte de aventura</p>
              <h2 className="text-2xl font-fredoka font-semibold">{gameState?.patientId ? `Hola, ${gameState.patientId}` : "¡Hola, aventurero!"}</h2>
              {passport ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="passport-chip">{passport.age} años</span>
                  <span className="passport-chip">{passport.ageLabel}</span>
                  <span className="coin-chip">🪙 {passport.coins}</span>
                </div>
              ) : <p className="text-sm text-muted-foreground mt-1">Elige tu código ficticio para personalizar la experiencia.</p>}
            </div>
          </div>

          <Select value={gameState?.patientId || ""} onValueChange={setPatientId}>
            <SelectTrigger className="w-full touch-target font-fredoka"><SelectValue placeholder="Elige tu código DEMO" /></SelectTrigger>
            <SelectContent>{["H-001", "H-002", "H-003", "H-004", "H-005", "H-006"].map(id => <SelectItem key={id} value={id}>{id}</SelectItem>)}</SelectContent>
          </Select>

          <div className="rounded-xl bg-primary/10 p-4 flex gap-3">
            <HeartIcon className="w-7 h-7 text-destructive shrink-0" weight="fill" />
            <p className="text-sm leading-relaxed">Conocerás tu recorrido, podrás decir cómo te sientes, ver videos y jugar. Si algo te preocupa, avisa a tu adulto o al equipo.</p>
          </div>

          <Button size="lg" onClick={() => updateCurrentScreen("avatar-creation")} disabled={!gameState?.patientId} className="w-full touch-target font-fredoka text-lg hover-lift">
            Abrir mi pasaporte <span className="text-xl ml-2">✨</span>
          </Button>
          <p className="text-xs text-center text-muted-foreground">Usa solo códigos de demostración. Pide ayuda a un adulto si la necesitas.</p>
        </Card>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="passport-mini">🎬<span>Videos</span></div>
          <div className="passport-mini">🎮<span>Juegos</span></div>
          <div className="passport-mini">🪙<span>Recompensas</span></div>
        </div>
      </div>

      {gameState?.showStaffAccess && (
        <Button variant="outline" size="sm" onClick={() => { createTestProfiles(); updateCurrentScreen("staff-dashboard"); }} className="fixed bottom-4 left-4">Panel interno de la demo</Button>
      )}
    </div>
  );
}
