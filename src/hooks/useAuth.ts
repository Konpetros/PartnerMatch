import { useState, useEffect } from 'react';
import { AuthUser, onAuthStateChanged, signOut } from '../services/firebase/auth';
import { checkIsAdmin, upsertUser } from '../services/firebase/firestore';

export interface AuthState {
  currentUser: string | null;
  currentUserUid: string | null;
  isSignInOpen: boolean;
}

export const useAuth = (onFirstLogin: () => void) => {
  const [firebaseUser, setFirebaseUser] = useState<AuthUser | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [hasCalledFirstLogin, setHasCalledFirstLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (user) {
        setFirebaseUser(user);
        const displayName = user.displayName || user.email?.split('@')[0] || 'Member';
        setCurrentUser(displayName);
        setCurrentUserUid(user.uid);
        setEmailVerified(user.emailVerified);

        // Save/update user record in Firestore
        try {
          await upsertUser(user.uid, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
        } catch {
          // Non-critical — don't block auth flow
        }

        // Check admin status
        try {
          const adminStatus = await checkIsAdmin(user.uid);
          setIsAdmin(adminStatus);
        } catch {
          setIsAdmin(false);
        }

        // Only trigger onFirstLogin once per session when user first signs in
        if (!hasCalledFirstLogin) {
          setHasCalledFirstLogin(true);
          onFirstLogin();
        }
      } else {
        setFirebaseUser(null);
        setCurrentUser(null);
        setCurrentUserUid(null);
        setEmailVerified(false);
        setIsAdmin(false);
        setHasCalledFirstLogin(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenSignIn = () => setIsSignInOpen(true);
  const handleCloseSignIn = () => setIsSignInOpen(false);

  const handleSignInSuccess = () => {
    setIsSignInOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentUser(null);
    setCurrentUserUid(null);
    setEmailVerified(false);
    setIsAdmin(false);
  };

  return {
    currentUser,
    currentUserUid,
    emailVerified,
    isAdmin,
    isSignInOpen,
    authLoading,
    handleOpenSignIn,
    handleCloseSignIn,
    handleSignInSuccess,
    handleSignOut,
  };
};
