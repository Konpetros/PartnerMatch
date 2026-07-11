import { useState } from 'react';

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
  | 'partner-requests';

export interface NavigationState {
  currentView: AppView;
  selectedListingId: string | null;
  selectedOrgId: string | null;
}

export const useNavigation = (isAuthenticated: boolean, isAdmin: boolean, openSignIn: () => void) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);

  const handleNavigate = (view: string) => {
    setEditingListingId(null);
    if (view === 'submit' && !isAuthenticated) {
      openSignIn();
      return;
    }
    if ((view === 'admin' || view === 'admin-pending' || view === 'admin-listings' || view === 'admin-users' || view === 'admin-announcements') && !isAuthenticated) {
      return; // silent redirect — don't expose admin panel exists
    }
    if (view === 'home') {
      setCurrentView('home');
      setSelectedListingId(null);
    } else {
      setCurrentView(view as AppView);
      setSelectedListingId(null);
    }
  };

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
