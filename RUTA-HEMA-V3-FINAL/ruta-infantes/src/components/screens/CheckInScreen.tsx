import { AvatarDisplay } from "@/components/avatar/AvatarDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSharedGameState } from "@/contexts/GameStateContext";
import { EMOTIONS, PAIN_LEVELS } from "@/lib/constants";
import { EmotionEntry, PainEntry } from "@/types";
import {
  ArrowLeftIcon,
  HeartIcon,
  SmileyIcon,
} from "@phosphor-icons/react/ssr";
import { useState } from "react";
import { toast } from "sonner";

export function CheckInScreen() {
  const {
    gameState,
    updateCurrentScreen,
    addEmotionEntry,
    addPainEntry,
    awardBadge,
  } = useSharedGameState();
  const [checkInType, setCheckInType] = useState<"emotion" | "pain" | null>(
    null
  );
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [selectedPain, setSelectedPain] = useState<number | null>(null);

  const childProfile = gameState?.childProfile;
  const journeySteps = gameState?.journeySteps;

  if (!childProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-primary/20 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <Card className="p-8 space-y-6">
            <h2 className="text-2xl font-fredoka font-bold text-foreground">
              Let's start your adventure first!
            </h2>
            <Button
              size="lg"
              onClick={() => updateCurrentScreen("welcome")}
              className="w-full touch-target font-fredoka text-lg hover-lift"
            >
              Go to Welcome
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const currentStep = journeySteps?.find((step) => step.current);

  const handleEmotionSubmit = () => {
    if (!selectedEmotion) return;

    const emotionEntry: EmotionEntry = {
      id: `emotion-${Date.now()}`,
      emotion: selectedEmotion as EmotionEntry["emotion"],
      timestamp: new Date(),
      journeyStep: currentStep?.id || "unknown",
    };

    addEmotionEntry(emotionEntry);
    awardBadge("emotion-sharer");

    const emotion = EMOTIONS.find((e) => e.id === selectedEmotion);
    toast.success(
      `Thanks for sharing! ${
        emotion?.emoji
      } I understand you're feeling ${emotion?.name.toLowerCase()}.`
    );

    setTimeout(() => updateCurrentScreen("journey"), 1500);
  };

  const handlePainSubmit = () => {
    if (selectedPain === null) return;

    const painEntry: PainEntry = {
      id: `pain-${Date.now()}`,
      level: selectedPain as PainEntry["level"],
      timestamp: new Date(),
      journeyStep: currentStep?.id || "unknown",
    };

    addPainEntry(painEntry);
    awardBadge("pain-reporter");

    const painLevel = PAIN_LEVELS.find((p) => p.level === selectedPain);
    toast.success(
      `Thank you for telling me! ${painLevel?.emoji} The nurses will help you feel better.`
    );

    setTimeout(() => updateCurrentScreen("journey"), 1500);
  };

  if (!checkInType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-destructive/10 via-background to-accent/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateCurrentScreen("journey")}
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-fredoka font-bold text-foreground">
            Cuéntame cómo estás
          </h1>
          <div className="w-16" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
          {/* Avatar Greeting */}
          <Card className="p-6 text-center hover-lift">
            <div className="space-y-4">
              <AvatarDisplay avatar={childProfile.avatar} size="lg" />
              <div className="space-y-2">
                <h2 className="text-2xl font-fredoka font-bold text-foreground">
                  Hi {childProfile.name}!
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  ¿Cómo te sientes hoy? Puedes contármelo con una carita.
                </p>
              </div>
            </div>
          </Card>

          {/* Check-in Options */}
          <div className="max-w-md w-full space-y-4">
            <Button
              size="lg"
              onClick={() => setCheckInType("emotion")}
              className="w-full touch-target font-fredoka text-lg hover-lift"
              variant="outline"
            >
              <SmileyIcon className="w-6 h-6 mr-3" weight="fill" />
              Cómo me siento
            </Button>

            <Button
              size="lg"
              onClick={() => setCheckInType("pain")}
              className="w-full touch-target font-fredoka text-lg hover-lift"
              variant="outline"
            >
              <HeartIcon className="w-6 h-6 mr-3" weight="fill" />
              Quiero comunicar algo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/10 via-background to-accent/10">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Button variant="ghost" size="sm" onClick={() => setCheckInType(null)}>
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-fredoka font-bold text-foreground">
          {checkInType === "emotion"
            ? "¿Cómo te sientes hoy?"
            : "¿Qué quieres contarme?"}
        </h1>
        <div className="w-16" />
      </div>

      <div className="p-4 space-y-6">
        {/* Avatar Question */}
        <Card className="p-6 text-center">
          <div className="space-y-4">
            <AvatarDisplay avatar={childProfile.avatar} size="md" />
            <p className="text-lg font-fredoka text-foreground">
              {checkInType === "emotion"
                ? "Toca la carita que muestra cómo te sientes:"
                : "Toca lo que quieres comunicar:"}
            </p>
          </div>
        </Card>

        {/* Emotion Selection */}
        {checkInType === "emotion" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {EMOTIONS.map((emotion) => (
                <Card
                  key={emotion.id}
                  className={`p-4 cursor-pointer touch-target hover-lift transition-all ${
                    selectedEmotion === emotion.id
                      ? "ring-2 ring-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => setSelectedEmotion(emotion.id)}
                >
                  <div className="text-center space-y-2">
                    <div className="text-4xl">{emotion.emoji}</div>
                    <p className="text-sm font-fredoka font-medium">
                      {emotion.name}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              size="lg"
              onClick={handleEmotionSubmit}
              disabled={!selectedEmotion}
              className="w-full touch-target font-fredoka text-lg hover-lift"
            >
              Compartir cómo me siento
            </Button>
          </div>
        )}

        {/* Pain Level Selection */}
        {checkInType === "pain" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {PAIN_LEVELS.map((level) => (
                <Card
                  key={level.level}
                  className={`p-4 cursor-pointer touch-target hover-lift transition-all ${
                    selectedPain === level.level
                      ? "ring-2 ring-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => setSelectedPain(level.level)}
                >
                  <div className="text-center space-y-2">
                    <div className="text-4xl">{level.emoji}</div>
                    <p className="text-xs font-fredoka font-medium leading-tight">
                      {level.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              size="lg"
              onClick={handlePainSubmit}
              disabled={selectedPain === null}
              className="w-full touch-target font-fredoka text-lg hover-lift"
            >
              Enviar mi mensaje
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
