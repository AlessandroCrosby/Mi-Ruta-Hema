import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSharedGameState } from "@/contexts/GameStateContext";
import { AVATAR_TYPES } from "@/lib/constants";
import { getPatientPassport, purchaseAvatar, selectPatientAvatar } from "@/lib/ruta-hema-sync";
import { Avatar } from "@/types";
import { ArrowLeftIcon, LockIcon } from "@phosphor-icons/react/ssr";
import { useState } from "react";
import { toast } from "sonner";

const shop = [
  { id: "tuntung", name: "Tuntung Sajur", emoji: "🪵", cost: 60, note: "Compañero de ritmo y valentía" },
  { id: "astronaut", name: "Explorador Estelar", emoji: "🧑‍🚀", cost: 90, note: "Para misiones de grandes pasos" },
  { id: "guardian", name: "Guardián Hema", emoji: "🦸", cost: 120, note: "Protector de la bitácora" },
];

export function RewardsScreen() {
  const { gameState, updateCurrentScreen, equipAvatar } = useSharedGameState();
  const [revision, setRevision] = useState(0);
  const passport = getPatientPassport(gameState.patientId);
  void revision;

  const equip = (id: string) => {
    if (!gameState.patientId) return;
    const option = AVATAR_TYPES.find(item => item.id === id); if (!option) return;
    selectPatientAvatar(gameState.patientId, id);
    const avatar: Avatar = { id: `${id}-${Date.now()}`, name: option.name, type: id as Avatar["type"], color: "yellow" };
    equipAvatar(avatar); setRevision(value => value + 1); toast.success("¡Avatar equipado!");
  };
  const buy = (id: string, cost: number) => {
    if (!gameState.patientId) return;
    const needsApproval = passport?.parentalControls.purchasesRequireApproval;
    const approved = !needsApproval || window.confirm("Adulto responsable: ¿apruebas usar las monedas para desbloquear este avatar?");
    if (!approved) return;
    try { purchaseAvatar(gameState.patientId, id, cost, approved); equip(id); }
    catch (error) { toast.error(error instanceof Error ? error.message : "No se pudo desbloquear"); }
  };

  return (
    <div className="passport-shell min-h-screen p-4"><div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between"><Button variant="ghost" onClick={() => updateCurrentScreen("journey")}><ArrowLeftIcon className="w-5 h-5 mr-2" />Mi pasaporte</Button><span className="coin-chip text-base">🪙 {passport?.coins || 0}</span></div>
      <div><p className="passport-kicker">Oficina de recompensas</p><h1 className="font-fredoka text-3xl font-bold">Avatares para desbloquear</h1><p className="text-muted-foreground mt-1">El equipo registra una llegada puntual y entrega 20 monedas. Las monedas solo sirven dentro de esta demostración.</p></div>
      <div className="grid md:grid-cols-3 gap-4">{shop.map(item=>{const owned=passport?.ownedAvatars.includes(item.id);const selected=passport?.selectedAvatar===item.id;return <Card key={item.id} className={`passport-page p-5 text-center ${selected?"ring-2 ring-primary":""}`}><div className="text-7xl py-5">{item.emoji}</div><h2 className="font-fredoka text-xl font-bold">{item.name}</h2><p className="text-sm text-muted-foreground min-h-10">{item.note}</p><div className="coin-chip my-4 mx-auto w-fit">🪙 {item.cost}</div>{owned?<Button className="w-full" variant={selected?"secondary":"default"} disabled={selected} onClick={()=>equip(item.id)}>{selected?"✓ En uso":"Usar avatar"}</Button>:<Button className="w-full" onClick={()=>buy(item.id,item.cost)}><LockIcon className="mr-2" />Desbloquear</Button>}</Card>})}</div>
      <Card className="p-4 bg-primary/10"><b>Control parental activo:</b> {passport?.parentalControls.purchasesRequireApproval ? "cada compra pide confirmación de un adulto." : "las compras con monedas están habilitadas por la familia."}</Card>
    </div></div>
  );
}
