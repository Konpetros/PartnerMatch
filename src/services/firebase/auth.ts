import { OrganisationProfile } from '../../types';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<AuthUser> => {
  // TODO: implement Firebase Google Auth
  throw new Error('Firebase Auth not yet implemented');
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<AuthUser> => {
  // TODO: implement Firebase Email Auth
  throw new Error('Firebase Auth not yet implemented');
};

// Register with email and password
export const registerWithEmail = async (email: string, password: string, displayName: string): Promise<AuthUser> => {
  // TODO: implement Firebase Email Registration
  throw new Error('Firebase Auth not yet implemented');
};

// Sign out
export const signOut = async (): Promise<void> => {
  // TODO: implement Firebase Sign Out
  throw new Error('Firebase Auth not yet implemented');
};

// Listen to auth state changes
export const onAuthStateChanged = (callback: (user: AuthUser | null) => void): (() => void) => {
  // TODO: implement Firebase onAuthStateChanged listener
  // Returns unsubscribe function
  return () => {};
};
