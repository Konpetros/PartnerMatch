import { useState, useEffect } from 'react';
import { OrganisationProfile } from '../types';
import { subscribeToProfiles } from '../services/firebase/firestore';

export type ProfileWithUid = OrganisationProfile & { uid: string };

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<ProfileWithUid[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToProfiles((data) => {
      setProfiles(data);
      setProfilesLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    profiles,
    profilesLoading,
  };
};
