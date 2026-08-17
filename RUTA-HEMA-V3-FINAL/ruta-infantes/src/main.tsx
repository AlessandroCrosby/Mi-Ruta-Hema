import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";

import App from "./App.tsx";
import { ErrorFallback } from "./ErrorFallback.tsx";
import { GameStateProvider } from "@/contexts/GameStateContext";
import { ProfilesProvider } from "@/contexts/ProfilesContext";

import "./main.css";
import "./styles/theme.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <ProfilesProvider>
      <GameStateProvider>
        <App />
      </GameStateProvider>
    </ProfilesProvider>
  </ErrorBoundary>
);
