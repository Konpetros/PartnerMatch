import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export type AppView =
  | 'home'
  | 'browse'
  | 'organisations'
  | 'org-profile'
  | 'detail'
  | 'submit'
  | 'about'
  | 'contact'
  | 'my-listings'
  | 'my-profile'
  | 'profile-setup'
  | 'admin'
  | 'admin-pending'
  | 'admin-listings'
  | 'admin-users'
  | 'admin-announcements'
  | 'privacy-policy'
  | 'terms'
  | 'settings'
  | 'gdpr'
  | 'cookie-policy'
  | 'announcements'
  | 'favourites'
  | 'partner-requests'
  | 'messages';

export interface NavigationState {
  currentView: AppView;
  selectedListingId: string | null;
  selectedOrgId: string | null;
}

// Only the simple, non-parameterized views get a real URL for now.
// Everything else (detail, org-profile, dashboard sections, admin) stays
// on whatever URL is currently set, unchanged, until a later step.
const VIEW_TO_PATH: Partial<Record<AppView, string>> = {
  'home': '/',
  'browse': '/browse',
  'organisations': '/organisations',
  'about': '/about',
  'contact': '/contact',
  'submit': '/submit',
  'privacy-policy': '/privacy',
  'terms': '/terms',
  'gdpr': '/gdpr',
  'cookie-policy': '/cookies',
};

const PATH_TO_VIEW: Record<string, AppView> = Object.fromEntries(
  Object.entries(VIEW_TO_PATH).map(([view, path]) => [path, view as AppView])
);

export const useNavigation = (isAuthenticated: boolean, isAdmin: boolean, openSignIn: () => void) => {
  const routerNavigate = useNavigate();
  const location = useLocation();

  const [currentView, setCurrentView] = useState<AppView>(
    PATH_TO_VIEW[location.pathname] || 'home'
  );
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);

  // Keep currentView in sync with the URL for browser back/forward and direct URL entry,
  // but only for the views that currently have a real mapped path.
  useEffect(() => {
    const matchedView = PATH_TO_VIEW[location.pathname];
    if (matchedView && matchedView !== currentView) {
      setCurrentView(matchedView);
    }
  }, [location.pathname]);

  const handleNavigate = useCallback((view: string) => {
    setEditingListingId(null);
    if (view === 'submit' && !isAuthenticated) {
      openSignIn();
      return;
    }
    if ((view === 'admin' || view === 'admin-pending' || view === 'admin-listings' || view === 'admin-users' || view === 'admin-announcements') && !isAuthenticated) {
      return; // silent redirect — don't expose admin panel exists
    }
    const path = VIEW_TO_PATH[view as AppView];
    if (path) {
      routerNavigate(path);
    }
    if (view === 'home') {
      setCurrentView('home');
      setSelectedListingId(null);
    } else {
      setCurrentView(view as AppView);
      setSelectedListingId(null);
    }
  }, [isAuthenticated, openSignIn, routerNavigate]);

  const handleSelectListing = (id: string) => {
    setSelectedListingId(id);
    setCurrentView('detail');
  };

  const handleEditListing = (id: string) => {
    setEditingListingId(id);
    setCurrentView('submit');
  };

  const handleSelectOrganisation = (id: string) => {
    setSelectedOrgId(id);
    setCurrentView('org-profile');
  };

  const handleViewListingFromOrg = (id: string) => {
    setSelectedListingId(id);
    setCurrentView('detail');
  };

  const handleViewOrgProfile = (listingId: string) => {
    setSelectedListingId(listingId);
    setSelectedOrgId(null);
    setCurrentView('org-profile');
  };

  return {
    currentView,
    selectedListingId,
    selectedOrgId,
    editingListingId,
    handleNavigate,
    handleSelectListing,
    handleEditListing,
    handleSelectOrganisation,
    handleViewListingFromOrg,
    handleViewOrgProfile,
  };
};
