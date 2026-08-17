import { ChildProfile } from '@/types';
import { useState } from 'react';

export function useAllProfiles() {
  const [allProfiles, setAllProfiles] = useState<ChildProfile[]>([]);

  const addOrUpdateProfile = (profile: ChildProfile) => {
    setAllProfiles(current => {
      const safeCurrent = current ?? [];
      const existing = safeCurrent.find(p => p.id === profile.id);
      if (existing) {
        return safeCurrent.map(p => p.id === profile.id ? profile : p);
      }
      return [...safeCurrent, profile];
    });
  };

  const removeProfile = (profileId: string) => {
    setAllProfiles(current => (current ?? []).filter(p => p.id !== profileId));
  };

  return {
    allProfiles,
    addOrUpdateProfile,
    removeProfile
  };
}