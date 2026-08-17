import React, { createContext, useContext } from "react";
import { useAllProfiles } from "@/hooks/use-all-profiles";

const ProfilesContext = createContext<
  ReturnType<typeof useAllProfiles> | undefined
>(undefined);

export const ProfilesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const profilesValue = useAllProfiles();
  return (
    <ProfilesContext.Provider value={profilesValue}>
      {children}
    </ProfilesContext.Provider>
  );
};

export const useProfiles = () => {
  const context = useContext(ProfilesContext);
  if (!context)
    throw new Error("useProfiles must be used within ProfilesProvider");
  return context;
};
