import { useState, useEffect } from 'react';
import { OrganisationProfile } from '../types';
import { getProfile, saveProfile } from '../services/firebase/firestore';

export const useProfile = (currentUserUid: string | null) => {
  const [organisationProfile, setOrganisationProfile] = useState<OrganisationProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(currentUserUid ? true : false);
  const [prevUid, setPrevUid] = useState<string | null>(currentUserUid);

  // Instantly sync transition during the render phase to avoid 1-render lag
  if (currentUserUid !== prevUid) {
    setPrevUid(currentUserUid);
    setProfileLoading(currentUserUid ? true : false);
    if (!currentUserUid) {
      setOrganisationProfile(null);
    }
  }

  useEffect(() => {
    if (!currentUserUid) {
      return;
    }

    getProfile(currentUserUid)
      .then((profile) => {
        setOrganisationProfile(profile);
        setProfileLoading(false);
      })
      .catch(() => {
        setOrganisationProfile(null);
        setProfileLoading(false);
      });
  }, [currentUserUid]);

  const handleProfileComplete = async (profile: OrganisationProfile) => {
    if (!currentUserUid) return;
    setOrganisationProfile(profile);
    try {
      await saveProfile(currentUserUid, profile);
    } catch (error) {
      console.error('saveProfile error (handleProfileComplete):', error);
    }
  };

  const handleUpdateProfile = async (profile: OrganisationProfile) => {
    if (!currentUserUid) return;
    setOrganisationProfile(profile);
    try {
      await saveProfile(currentUserUid, profile);
    } catch (error) {
      console.error('saveProfile error (handleUpdateProfile):', error);
    }
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
