import React from 'react';
import { AppView } from '../hooks/useNavigation';
import { Listing, OrganisationProfile } from '../types';

import HomeView from '../components/HomeView';
import BrowseView from '../components/BrowseView';
import DetailView from '../components/DetailView';
import SubmitView from '../components/SubmitView';
import MyListingsView from '../components/MyListingsView';
import AboutView from '../components/AboutView';
import ContactView from '../components/ContactView';
import ProfileSetupView from '../components/ProfileSetupView';
import MyProfileView from '../components/MyProfileView';
import OrganisationsView from '../components/OrganisationsView';
import OrgProfileView from '../components/OrgProfileView';

interface AppRouterProps {
  currentView: AppView;
  selectedListingId: string | null;
  selectedOrgId: string | null;
  listings: Listing[];
  currentUser: string | null;
  organisationProfile: OrganisationProfile | null;
  onNavigate: (view: string) => void;
  onSelectListing: (id: string) => void;
  onSelectOrganisation: (id: string) => void;
  onViewListingFromOrg: (id: string) => void;
  onSubmitListing: (listing: Listing) => void;
  onDeleteListing: (id: string) => void;
  onUpdateListingStatus: (id: string, status: 'active' | 'pending' | 'expired' | 'partnership-found') => void;
  onProfileComplete: (profile: OrganisationProfile) => void;
  onUpdateProfile: (profile: OrganisationProfile) => void;
  onOpenSignIn: () => void;
  onSignOut: () => void;
}

export default function AppRouter({
  currentView,
  selectedListingId,
  selectedOrgId,
  listings,
  currentUser,
  organisationProfile,
  onNavigate,
  onSelectListing,
  onSelectOrganisation,
  onViewListingFromOrg,
  onSubmitListing,
  onDeleteListing,
  onUpdateListingStatus,
  onProfileComplete,
  onUpdateProfile,
  onOpenSignIn,
  onSignOut,
}: AppRouterProps) {

  if (currentView === 'home') {
    return (
      <HomeView
        listings={listings}
        onNavigate={onNavigate}
        onSelectListing={onSelectListing}
      />
    );
  }

  if (currentView === 'browse') {
    return (
      <BrowseView
        listings={listings}
        onNavigate={onNavigate}
        onSelectListing={onSelectListing}
      />
    );
  }

  if (currentView === 'organisations') {
    return (
      <OrganisationsView
        listings={listings}
        onSelectOrganisation={onSelectOrganisation}
        onNavigate={onNavigate}
      />
    );
  }

  if (currentView === 'org-profile' && selectedOrgId) {
    const activeOrg = listings.find(item => item.id === selectedOrgId);
    if (activeOrg) {
      return (
        <OrgProfileView
          listing={activeOrg}
          onBack={() => onNavigate('organisations')}
          onViewListing={onViewListingFromOrg}
        />
      );
    }
  }

  if (currentView === 'profile-setup') {
    return (
      <ProfileSetupView
        onProfileComplete={onProfileComplete}
      />
    );
  }

  if (currentView === 'my-profile') {
    return (
      <MyProfileView
        currentUser={currentUser}
        profile={organisationProfile}
        onUpdateProfile={onUpdateProfile}
        onNavigate={onNavigate}
        onSignOut={onSignOut}
        listings={listings}
      />
    );
  }

  if (currentView === 'detail' && selectedListingId) {
    const activeItem = listings.find(item => item.id === selectedListingId);
    if (activeItem) {
      return (
        <DetailView
          listing={activeItem}
          onBack={() => onNavigate('home')}
        />
      );
    }
    return (
      <HomeView
        listings={listings}
        onNavigate={onNavigate}
        onSelectListing={onSelectListing}
      />
    );
  }

  if (currentView === 'submit') {
    return (
      <SubmitView
        organisationProfile={organisationProfile}
        onSubmitListing={onSubmitListing}
        onNavigate={onNavigate}
        onSelectListing={onSelectListing}
      />
    );
  }

  if (currentView === 'about') {
    return <AboutView onNavigate={onNavigate} />;
  }

  if (currentView === 'contact') {
    return <ContactView onNavigate={onNavigate} />;
  }

  if (currentView === 'my-listings') {
    return (
      <MyListingsView
        onOpenSignIn={onOpenSignIn}
        onNavigate={onNavigate}
        currentUser={currentUser}
        listings={listings}
        onDeleteListing={onDeleteListing}
        onUpdateListingStatus={onUpdateListingStatus}
        onSignOut={onSignOut}
      />
    );
  }

  // Default fallback
  return (
    <HomeView
      listings={listings}
      onNavigate={onNavigate}
      onSelectListing={onSelectListing}
    />
  );
}
