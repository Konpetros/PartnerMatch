import { useState } from 'react';

export interface AuthState {
  currentUser: string | null;
  isSignInOpen: boolean;
}

export const useAuth = (onFirstLogin: () => void) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const handleOpenSignIn = () => setIsSignInOpen(true);
  const handleCloseSignIn = () => setIsSignInOpen(false);

  const handleSignInSuccess = (username: string) => {
    setCurrentUser(username);
    setIsSignInOpen(false);
    const mockIsAdmin = username.toLowerCase().includes('admin') || username.toLowerCase().includes('petros');
    setIsAdmin(mockIsAdmin);
    onFirstLogin();
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setIsAdmin(false);
  };

  return {
    currentUser,
    isAdmin,
    isSignInOpen,
    handleOpenSignIn,
    handleCloseSignIn,
    handleSignInSuccess,
    handleSignOut,
  };
};
