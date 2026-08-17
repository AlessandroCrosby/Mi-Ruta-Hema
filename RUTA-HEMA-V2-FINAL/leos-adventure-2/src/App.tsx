import { AvatarCreationScreen } from "@/components/screens/AvatarCreationScreen";
import { CelebrationScreen } from "@/components/screens/CelebrationScreen";
import { CheckInScreen } from "@/components/screens/CheckInScreen";
import { JourneyScreen } from "@/components/screens/JourneyScreen";
import { JourneySetupScreen } from "@/components/screens/JourneySetupScreen";
import { LearningScreen } from "@/components/screens/LearningScreen";
import { GamesScreen } from "@/components/screens/GamesScreen";
import { RewardsScreen } from "@/components/screens/RewardsScreen";
import { StaffDashboard } from "@/components/screens/StaffDashboard";
import { WelcomeScreen } from "@/components/screens/WelcomeScreen";
import { Toaster } from "@/components/ui/sonner";
import { useSharedGameState } from "@/contexts/GameStateContext";
import { useEffect } from "react";

function App() {
  const { gameState } = useSharedGameState();

  // Debug: log gameState on every render
  console.log("App render - gameState:", gameState);

  // UseEffect Hook when currentScreen changes
  useEffect(() => {
    console.log("Current screen changed to:", gameState.currentScreen);
  }, [gameState.currentScreen]);

  const renderCurrentScreen = () => {
    switch (gameState.currentScreen) {
      case "welcome":
        return <WelcomeScreen />;
      case "avatar-creation":
        return <AvatarCreationScreen />;
      case "journey":
        return <JourneyScreen />;
      case "check-in":
        return <CheckInScreen />;
      case "celebration":
        return <CelebrationScreen />;
      case "staff-dashboard":
        return <StaffDashboard />;
      case "journey-setup":
        return <JourneySetupScreen />;
      case "learning":
        return <LearningScreen />;
      case "games":
        return <GamesScreen />;
      case "rewards":
        return <RewardsScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className={`min-h-screen bg-background font-inter age-${gameState.ageBand || "school"}`}>
      {renderCurrentScreen()}
      <Toaster />
    </div>
  );
}

export default App;
