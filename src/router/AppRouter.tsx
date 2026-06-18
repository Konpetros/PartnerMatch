import React from 'react';
import { AppView } from '../hooks/useNavigation';
import { Listing, OrganisationProfile, AdminUser, ActivityLog } from '../types';
import { ProfileWithUid } from '../hooks/useProfiles';
import OrganisationProfileView from '../components/OrganisationProfileView';
import HomeView from '../components/HomeView';
import BrowseDirectoryView from '../components/BrowseDirectoryView';
import ListingDetailView from '../components/ListingDetailView';
import PostListingView from '../components/PostListingView';
import MyListingsDashboardView from '../components/MyListingsDashboardView';
import AboutView from '../components/AboutView';
import ContactView from '../components/ContactView';
import OrganisationSetupView from '../components/OrganisationSetupView';
import MyOrganisationProfileView from '../components/MyOrganisationProfileView';
import OrganisationsDirectoryView from '../components/OrganisationsDirectoryView';
import ListingOrgProfileView from '../components/ListingOrgProfileView';
import PrivacyPolicyView from '../components/PrivacyPolicyView';
import TermsAndConditionsView from '../components/TermsAndConditionsView';
import GDPRView from '../components/GDPRView';

import {
  AdminLayout,
  AdminDashboard,
  AdminPendingListings,
  AdminAllListings,
  AdminUsers
} from '../features/admin';

interface AppRouterProps {
  currentView: AppView;
  selectedListingId: string | null;
  selectedOrgId: string | null;
  listings: Listing[];
  profiles: ProfileWithUid[];
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

  isAdmin: boolean;
  adminUsers: AdminUser[];
  activityLog: ActivityLog[];
  onApproveListing: (id: string) => void;
  onRejectListing: (id: string, reason: string) => void;
  onBanUser: (uid: string) => void;
  onUnbanUser: (uid: string) => void;
  onDeleteUser: (uid: string) => void;
  onPromoteToAdmin: (uid: string) => void;
}

export default function AppRouter({
  currentView,
  selectedListingId,
  selectedOrgId,
  listings,
  profiles,
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

  isAdmin,
  adminUsers,
  activityLog,
  onApproveListing,
  onRejectListing,
  onBanUser,
  onUnbanUser,
  onDeleteUser,
  onPromoteToAdmin,
}: AppRouterProps) {

  // Admin Views Switch Routing Guard
  const adminViews: AppView[] = ['admin', 'admin-pending', 'admin-listings', 'admin-users'];

  if (adminViews.includes(currentView)) {
    if (!isAdmin) {
      // Not admin — redirect to home silently
      return (
        <HomeView
          listings={listings}
          onNavigate={onNavigate}
          onSelectListing={onSelectListing}
        />
      );
    }

    const pendingCount = listings.filter(l => l.status === 'pending').length;

    return (
      <AdminLayout
        currentView={currentView}
        onNavigate={onNavigate}
        onSignOut={onSignOut}
        currentUser={currentUser}
        pendingCount={pendingCount}
      >
        {currentView === 'admin' && (
          <AdminDashboard
            listings={listings}
            users={adminUsers}
            activityLog={activityLog}
          />
        )}
        {currentView === 'admin-pending' && (
          <AdminPendingListings
            listings={listings.filter(l => l.status === 'pending')}
            onApprove={onApproveListing}
            onReject={onRejectListing}
            onEdit={(id) => alert(`Edit is coming soon for listing: ${id}`)}
            onDelete={onDeleteListing}
          />
        )}
        {currentView === 'admin-listings' && (
          <AdminAllListings
            listings={listings}
            onDelete={onDeleteListing}
            onUpdateStatus={onUpdateListingStatus}
          />
        )}
        {currentView === 'admin-users' && (
          <AdminUsers
            users={adminUsers}
            onDeleteUser={onDeleteUser}
            onBanUser={onBanUser}
            onUnbanUser={onUnbanUser}
            onPromoteToAdmin={onPromoteToAdmin}
          />
        )}
      </AdminLayout>
    );
  }

  // Standard Public & Organisation Views
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
      <BrowseDirectoryView
        listings={listings}
        onNavigate={onNavigate}
        onSelectListing={onSelectListing}
      />
    );
  }

  if (currentView === 'organisations') {
    return (
      <OrganisationsDirectoryView
        listings={profiles}
        onSelectOrganisation={onSelectOrganisation}
        onNavigate={onNavigate}
      />
    );
  }

  if (currentView === 'org-profile' && selectedOrgId) {
    const activeProfile = profiles.find(p => p.uid === selectedOrgId);
    if (activeProfile) {
      return (
        <OrganisationProfileView
          profile={activeProfile}
          listings={listings}
          onBack={() => onNavigate('organisations')}
          onViewListing={onViewListingFromOrg}
        />
      );
    }
  }

  if (currentView === 'profile-setup') {
    return (
      <OrganisationSetupView
        onProfileComplete={onProfileComplete}
      />
    );
  }

  if (currentView === 'my-profile') {
    return (
      <MyOrganisationProfileView
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
        <ListingDetailView
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
      <PostListingView
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

  if (currentView === 'privacy-policy') {
    return <PrivacyPolicyView onNavigate={onNavigate} />;
  }

  if (currentView === 'terms') {
    return <TermsAndConditionsView onNavigate={onNavigate} />;
  }

  if (currentView === 'gdpr') {
    return <GDPRView onNavigate={onNavigate} />;
  }

  if (currentView === 'my-listings' || currentView === 'settings') {
    return (
      <MyListingsDashboardView
        onOpenSignIn={onOpenSignIn}
        onNavigate={onNavigate}
        currentUser={currentUser}
        listings={listings}
        onDeleteListing={onDeleteListing}
        onUpdateListingStatus={onUpdateListingStatus}
        onSignOut={onSignOut}
        initialSection={currentView === 'settings' ? 'settings' : 'listings'}
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
