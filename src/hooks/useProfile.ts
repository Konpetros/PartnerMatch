import { useState, useEffect } from 'react';
import { OrganisationProfile } from '../types';
import { getProfile, saveProfile } from '../services/firebase/firestore';
import { uploadLogo } from '../services/firebase/storage';

/**
 * Converts a base64 data URL into a File object so it can be uploaded to Storage.
 */
const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

/**
 * If the profile's logoUrl is a base64 data URL (freshly selected in the form),
 * upload it to Firebase Storage and return the profile with logoUrl replaced by
 * the real Storage download URL. If it's already a normal URL (or empty), return
 * the profile unchanged.
 */
const uploadLogoIfNeeded = async (
  userId: string,
  profile: OrganisationProfile
): Promise<OrganisationProfile> => {
  if (profile.logoUrl && profile.logoUrl.startsWith('data:')) {
    try {
      const file = await dataUrlToFile(profile.logoUrl, 'logo');
      const storageUrl = await uploadLogo(userId, file);
      return { ...profile, logoUrl: storageUrl };
    } catch (error) {
      console.error('Logo upload failed, saving profile without new logo:', error);
      // Fall back to keeping the existing/previous logo rather than saving a huge base64 blob
      return { ...profile, logoUrl: '' };
    }
  }
  return profile;
};

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
    try {
      const profileWithLogo = await uploadLogoIfNeeded(currentUserUid, profile);
      setOrganisationProfile(profileWithLogo);
      await saveProfile(currentUserUid, profileWithLogo);
    } catch (error) {
      console.error('saveProfile error (handleProfileComplete):', error);
    }
  };

  const handleUpdateProfile = async (profile: OrganisationProfile) => {
    if (!currentUserUid) return;
    try {
      const profileWithLogo = await uploadLogoIfNeeded(currentUserUid, profile);
      setOrganisationProfile(profileWithLogo);
      await saveProfile(currentUserUid, profileWithLogo);
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
