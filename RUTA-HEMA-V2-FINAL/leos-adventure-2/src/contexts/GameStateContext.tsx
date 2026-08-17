import React, { createContext, useContext } from "react";
import { useGameState } from "@/hooks/use-game-state";
import { useAllProfiles } from "@/hooks/use-all-profiles";

// Combine the return types of both hooks
type GameStateContextType = ReturnType<typeof useGameState> &
  ReturnType<typeof useAllProfiles>;

const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined
);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const gameStateValue = useGameState();
  const profiles = useAllProfiles();
  return (
    <GameStateContext.Provider value={{ ...gameStateValue, ...profiles }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useSharedGameState = () => {
  const context = useContext(GameStateContext);
  if (!context)
    throw new Error("useSharedGameState must be used within GameStateProvider");
  return context;
};
