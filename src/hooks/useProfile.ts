import { useState } from 'react';
import { OrganisationProfile } from '../types';

export const useProfile = () => {
  const [organisationProfile, setOrganisationProfile] = useState<OrganisationProfile | null>(null);

  const handleProfileComplete = (profile: OrganisationProfile) => {
    setOrganisationProfile(profile);
  };

  const handleUpdateProfile = (profile: OrganisationProfile) => {
    setOrganisationProfile(profile);
  };

  const hasProfile = organisationProfile !== null;

  return {
    organisationProfile,
    hasProfile,
    handleProfileComplete,
    handleUpdateProfile,
  };
};
