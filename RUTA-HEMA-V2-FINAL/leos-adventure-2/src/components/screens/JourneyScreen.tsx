import { AvatarDisplay } from "@/components/avatar/AvatarDisplay";
import { JourneyMap } from "@/components/journey/JourneyMap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSharedGameState } from "@/contexts/GameStateContext";
import { getPatientPassport } from "@/lib/ruta-hema-sync";
import { ArrowLeftIcon, BookOpenIcon, GameControllerIcon, GiftIcon, HeartIcon, SmileyIcon } from "@phosphor-icons/react/ssr";
import { toast } from "sonner";

export function JourneyScreen() {
  const { gameState, updateCurrentScreen, updateJourneyStep, awardBadge } = useSharedGameState();
  const childProfile = gameState?.childProfile;
  const journeySteps = gameState?.journeySteps;
  const passport = getPatientPassport(gameState.patientId);

  if (!childProfile) return (
    <div className="passport-shell min-h-screen grid place-items-center p-4"><Card className="passport-page p-8 max-w-md text-center"><h2 className="text-2xl font-fredoka font-bold">Primero crea tu compañero de bitácora</h2><Button size="lg" onClick={() => updateCurrentScreen("welcome")} className="w-full mt-5">Comenzar</Button></Card></div>
  );

  const currentStep = journeySteps?.find(step => step.current);
  const completedCount = journeySteps?.filter(step => step.completed).length ?? 0;
  const totalSteps = journeySteps?.length ?? 0;
  const progress = totalSteps ? Math.round((completedCount / totalSteps) * 100) : 0;
  const handleStepComplete = (stepId: string) => {
    updateJourneyStep(stepId, true); awardBadge("step-completed");
    toast.success("¡Nuevo sello en tu pasaporte!");
    const stepIndex = journeySteps?.findIndex(step => step.id === stepId) ?? -1;
    if (stepIndex === (journeySteps?.length ?? 0) - 1) setTimeout(() => updateCurrentScreen("celebration"), 1200);
  };

  return (
    <div className="passport-shell min-h-screen">
      <header className="passport-header p-4"><div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => updateCurrentScreen("welcome")}><ArrowLeftIcon className="w-5 h-5 mr-2" />Inicio</Button>
        <div className="text-center"><p className="passport-kicker">Pasaporte {gameState.patientId}</p><h1 className="text-lg font-fredoka font-bold">Bitácora de {childProfile.name}</h1></div>
        <span className="coin-chip">🪙 {passport?.coins || 0}</span>
      </div></header>

      <main className="max-w-5xl mx-auto p-4 space-y-5">
        <Card className="passport-page p-6"><div className="grid md:grid-cols-[130px_1fr_120px] gap-5 items-center">
          <div className="passport-photo-lg"><AvatarDisplay avatar={childProfile.avatar} size="lg" /></div>
          <div><p className="passport-kicker">Sello actual · {passport?.ageLabel}</p><div className="flex items-center gap-2"><span className="text-3xl">{currentStep?.icon}</span><h2 className="text-2xl font-fredoka font-bold">{currentStep?.title}</h2></div><p className="text-foreground/80 mt-2">{currentStep?.description}</p><div className="passport-progress mt-4"><i style={{width:`${progress}%`}} /></div><p className="text-xs text-muted-foreground mt-1">{completedCount} de {totalSteps} sellos completados</p></div>
          <div className="passport-stamp">RUTA<br/>{progress}%</div>
        </div></Card>

        <div className="grid sm:grid-cols-3 gap-3">
          <button className="passport-action" onClick={() => updateCurrentScreen("learning")}><BookOpenIcon size={28} /><span><b>Mis videos</b><small>Conozco mi tratamiento</small></span></button>
          <button className="passport-action" onClick={() => updateCurrentScreen("games")}><GameControllerIcon size={28} /><span><b>Juegos</b><small>Una pausa para mí</small></span></button>
          <button className="passport-action" onClick={() => updateCurrentScreen("rewards")}><GiftIcon size={28} /><span><b>Avatares</b><small>Uso mis monedas</small></span></button>
        </div>

        <Card className="passport-page p-6"><p className="passport-kicker text-center">Páginas y sellos</p><h3 className="text-xl font-fredoka font-semibold text-center mb-4">Mi recorrido</h3>{currentStep&&<div className="bg-primary/10 p-3 rounded-lg text-center mb-4"><p className="text-sm font-medium">Toca el paso resaltado cuando el equipo confirme que terminó.</p></div>}<JourneyMap steps={journeySteps ?? []} onStepComplete={handleStepComplete} /></Card>

        <div className="grid grid-cols-2 gap-3"><Button variant="outline" size="lg" onClick={() => updateCurrentScreen("check-in")} className="touch-target"><SmileyIcon className="w-5 h-5 mr-2" weight="fill" />Cómo me siento</Button><Button variant="outline" size="lg" onClick={() => updateCurrentScreen("check-in")} className="touch-target"><HeartIcon className="w-5 h-5 mr-2" weight="fill" />Necesito contar algo</Button></div>

        {childProfile.badges.length>0&&<Card className="p-4"><h3 className="font-fredoka font-semibold mb-3 text-center">Sellos ganados</h3><div className="flex flex-wrap justify-center gap-2">{childProfile.badges.slice(-4).map(id=><span key={id} className="passport-chip">🏆 {id.split("-").join(" ")}</span>)}</div></Card>}
      </main>
    </div>
  );
}
