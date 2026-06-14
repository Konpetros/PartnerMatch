import { useState } from 'react';

export interface AuthState {
  currentUser: string | null;
  isSignInOpen: boolean;
}

export const useAuth = (onFirstLogin: () => void) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const handleOpenSignIn = () => setIsSignInOpen(true);
  const handleCloseSignIn = () => setIsSignInOpen(false);

  const handleSignInSuccess = (username: string) => {
    setCurrentUser(username);
    setIsSignInOpen(false);
    onFirstLogin();
  };

  const handleSignOut = () => {
    setCurrentUser(null);
  };

  return {
    currentUser,
    isSignInOpen,
    handleOpenSignIn,
    handleCloseSignIn,
    handleSignInSuccess,
    handleSignOut,
  };
};
