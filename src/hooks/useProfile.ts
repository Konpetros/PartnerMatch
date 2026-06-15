import { useState, useEffect } from 'react';
import { OrganisationProfile } from '../types';
import { getProfile, saveProfile } from '../services/firebase/firestore';

export const useProfile = (currentUserUid: string | null) => {
  const [organisationProfile, setOrganisationProfile] = useState<OrganisationProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!currentUserUid) {
      setOrganisationProfile(null);
      return;
    }

    setProfileLoading(true);
    getProfile(currentUserUid)
      .then((profile) => {
        setOrganisationProfile(profile);
      })
      .catch(() => {
        setOrganisationProfile(null);
      })
      .finally(() => {
        setProfileLoading(false);
      });
  }, [currentUserUid]);

  const handleProfileComplete = async (profile: OrganisationProfile) => {
    if (!currentUserUid) return;
    setOrganisationProfile(profile);
    await saveProfile(currentUserUid, profile);
  };

  const handleUpdateProfile = async (profile: OrganisationProfile) => {
    if (!currentUserUid) return;
    setOrganisationProfile(profile);
    await saveProfile(currentUserUid, profile);
  };

  const hasProfile = organisationProfile !== null;

  return {
    organisationProfile,
    hasProfile,
    profileLoading,
    handleProfileComplete,
    handleUpdateProfile,
  };
};
