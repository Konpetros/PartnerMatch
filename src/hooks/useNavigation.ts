import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Listing } from '../types';
import { ProfileWithUid } from './useProfiles';

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
  'profile-setup': '/profile-setup',
  'my-listings': '/dashboard',
  'settings': '/dashboard/settings',
  'my-profile': '/dashboard/profile',
  'announcements': '/dashboard/announcements',
  'favourites': '/dashboard/favourites',
  'partner-requests': '/dashboard/partner-requests',
  'messages': '/dashboard/messages',
  'admin': '/admin',
  'admin-pending': '/admin/pending',
  'admin-listings': '/admin/listings',
  'admin-users': '/admin/users',
  'admin-announcements': '/admin/announcements',
};

const PATH_TO_VIEW: Record<string, AppView> = Object.fromEntries(
  Object.entries(VIEW_TO_PATH).map(([view, path]) => [path, view as AppView])
);

export const useNavigation = (
  isAuthenticated: boolean,
  isAdmin: boolean,
  openSignIn: () => void,
  listings: Listing[] = [],
  profiles: ProfileWithUid[] = []
) => {
  const routerNavigate = useNavigate();
  const location = useLocation();

  const resolveInitialView = (): AppView => {
    if (location.pathname.startsWith('/organisation/')) return 'org-profile';
    if (location.pathname.startsWith('/listing/')) return 'detail';
    return PATH_TO_VIEW[location.pathname] || 'home';
  };

  const [currentView, setCurrentView] = useState<AppView>(resolveInitialView());
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    location.pathname.startsWith('/listing/') ? location.pathname.split('/listing/')[1] : null
  );
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(
    location.pathname.startsWith('/organisation/') ? location.pathname.split('/organisation/')[1] : null
  );
  const [editingListingId, setEditingListingId] = useState<string | null>(null);

  // Keep state in sync with the URL for browser back/forward and direct URL entry.
  useEffect(() => {
    if (location.pathname.startsWith('/organisation/')) {
      const id = location.pathname.split('/organisation/')[1];
      setSelectedOrgId(id);
      setSelectedListingId(null);
      setCurrentView('org-profile');
      return;
    }
    if (location.pathname.startsWith('/listing/')) {
      const id = location.pathname.split('/listing/')[1];
      setSelectedListingId(id);
      setCurrentView('detail');
      return;
    }
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

  const handleSelectListing = useCallback((id: string) => {
    setSelectedListingId(id);
    setCurrentView('detail');
    routerNavigate(`/listing/${id}`);
  }, [routerNavigate]);

  const handleEditListing = (id: string) => {
    setEditingListingId(id);
    setCurrentView('submit');
    routerNavigate('/submit');
  };

  const handleSelectOrganisation = useCallback((id: string) => {
    setSelectedOrgId(id);
    setSelectedListingId(null);
    setCurrentView('org-profile');
    routerNavigate(`/organisation/${id}`);
  }, [routerNavigate]);

  // Resolves the submitting organisation's real ID up front, then behaves
  // exactly like handleSelectOrganisation — collapsing what used to be two
  // divergent code paths (selectedOrgId vs selectedListingId) into one.
  const handleViewOrgProfile = useCallback((listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    const submittedBy = listing ? (listing as any).submittedBy : null;
    if (submittedBy) {
      handleSelectOrganisation(submittedBy);
    }
  }, [listings, handleSelectOrganisation]);

  const handleViewListingFromOrg = (id: string) => {
    handleSelectListing(id);
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
