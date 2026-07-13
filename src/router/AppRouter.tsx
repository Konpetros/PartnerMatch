import React from 'react';
import { AppView } from '../hooks/useNavigation';
import { Listing, OrganisationProfile, AdminUser } from '../types';
import { ProfileWithUid } from '../hooks/useProfiles';
import OrgProfileView from '../components/OrgProfileView';
import HomeView from '../components/HomeView';
import BrowseDirectoryView from '../components/BrowseDirectoryView';
import ListingDetailView from '../components/ListingDetailView';
import PostListingView from '../components/PostListingView';
import MyListingsDashboardView from '../components/MyListingsDashboardView';
import AboutView from '../components/AboutView';
import ContactView from '../components/ContactView';
import OrganisationSetupView from '../components/OrganisationSetupView';
import OrganisationsDirectoryView from '../components/OrganisationsDirectoryView';
import PrivacyPolicyView from '../components/PrivacyPolicyView';
import TermsAndConditionsView from '../components/TermsAndConditionsView';
import GDPRView from '../components/GDPRView';
import CookiePolicyView from '../components/CookiePolicyView';

import {
  AdminLayout,
  AdminDashboard,
  AdminPendingListings,
  AdminAllListings,
  AdminUsers,
  AdminAnnouncements
} from '../features/admin';

interface AppRouterProps {
  currentView: AppView;
  selectedListingId: string | null;
  selectedOrgId: string | null;
  listings: Listing[];
  profiles: ProfileWithUid[];
  currentUser: string | null;
  currentUserUid: string | null;
  emailVerified: boolean;
  organisationProfile: OrganisationProfile | null;
  onNavigate: (view: string) => void;
  onSelectListing: (id: string) => void;
  onSelectOrganisation: (id: string) => void;
  onViewListingFromOrg: (id: string) => void;
  onViewOrgProfile: (id: string) => void;
  onSubmitListing: (listing: Listing) => void;
  editingListingId: string | null;
  onUpdateListing: (id: string, data: Partial<Listing>) => void;
  onEditListing: (id: string) => void;
  onDeleteListing: (id: string) => void;
  onUpdateListingStatus: (id: string, status: 'active' | 'pending' | 'expired' | 'partnership-found' | 'rejected') => void;
  onProfileComplete: (profile: OrganisationProfile) => void;
  onUpdateProfile: (profile: OrganisationProfile) => void;
  onOpenSignIn: () => void;
  onSignOut: () => void;

  isAdmin: boolean;
  adminUsers: AdminUser[];
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
  currentUserUid,
  emailVerified,
  organisationProfile,
  onNavigate,
  onSelectListing,
  onSelectOrganisation,
  onViewListingFromOrg,
  onViewOrgProfile,
  onSubmitListing,
  editingListingId,
  onUpdateListing,
  onEditListing,
  onDeleteListing,
  onUpdateListingStatus,
  onProfileComplete,
  onUpdateProfile,
  onOpenSignIn,
  onSignOut,

  isAdmin,
  adminUsers,
  onApproveListing,
  onRejectListing,
  onBanUser,
  onUnbanUser,
  onDeleteUser,
  onPromoteToAdmin,
}: AppRouterProps) {

  // Admin Views Switch Routing Guard
  const adminViews: AppView[] = ['admin', 'admin-pending', 'admin-listings', 'admin-users', 'admin-announcements'];

  if (adminViews.includes(currentView)) {
    if (!isAdmin) {
      // Not admin — redirect to home silently
      return (
        <HomeView
          listings={listings}
          onNavigate={onNavigate}
          onSelectListing={onSelectListing}
          currentUserUid={currentUserUid}
          currentUserProfile={organisationProfile}
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
          />
        )}
        {currentView === 'admin-pending' && (
          <AdminPendingListings
            listings={listings.filter(l => l.status === 'pending')}
            onApprove={onApproveListing}
            onReject={onRejectListing}
            onEdit={(id) => onSelectListing(id)}
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
        {currentView === 'admin-announcements' && (
          <AdminAnnouncements
            currentAdminUid={currentUserUid || ''}
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
        currentUserUid={currentUserUid}
        currentUserProfile={organisationProfile}
      />
    );
  }

  if (currentView === 'browse') {
    return (
      <BrowseDirectoryView
        listings={listings}
        onNavigate={onNavigate}
        onSelectListing={onSelectListing}
        currentUserUid={currentUserUid}
        currentUserProfile={organisationProfile}
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

  if (currentView === 'org-profile') {
    if (selectedOrgId) {
      const activeProfile = profiles.find(p => p.uid === selectedOrgId);
      if (activeProfile) {
        return (
          <OrgProfileView
            profile={activeProfile}
            listings={listings}
            onBack={() => onNavigate('organisations')}
            onViewListing={onViewListingFromOrg}
          />
        );
      }
    } else if (selectedListingId) {
      const activeListing = listings.find(l => l.id === selectedListingId);
      if (activeListing) {
        const submittedBy = (activeListing as any).submittedBy;
        const orgProfile = submittedBy ? profiles.find(p => p.uid === submittedBy) : null;
        if (orgProfile) {
          return (
            <OrgProfileView
              profile={orgProfile}
              listings={listings}
              onBack={() => onNavigate('browse')}
              onViewListing={onViewListingFromOrg}
            />
          );
        }
        onNavigate('browse');
        return null;
      }
    }
  }

  if (currentView === 'profile-setup') {
    return (
      <OrganisationSetupView
        onProfileComplete={onProfileComplete}
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
          onViewOrganisation={onViewOrgProfile}
          currentUserUid={currentUserUid}
          currentUserProfile={organisationProfile}
        />
      );
    }
    return (
      <HomeView
        listings={listings}
        onNavigate={onNavigate}
        onSelectListing={onSelectListing}
        currentUserUid={currentUserUid}
        currentUserProfile={organisationProfile}
      />
    );
  }

  if (currentView === 'submit') {
    const editingListing = editingListingId
      ? listings.find((l) => l.id === editingListingId) ?? null
      : null;
    return (
      <PostListingView
        organisationProfile={organisationProfile}
        onSubmitListing={onSubmitListing}
        onUpdateListing={onUpdateListing}
        editingListing={editingListing}
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

  if (currentView === 'cookie-policy') {
    return <CookiePolicyView onNavigate={onNavigate} />;
  }

  if (currentView === 'my-listings' || currentView === 'settings' || currentView === 'my-profile' || currentView === 'announcements' || currentView === 'favourites' || currentView === 'partner-requests') {
    return (
      <MyListingsDashboardView
        onOpenSignIn={onOpenSignIn}
        onNavigate={onNavigate}
        currentUser={currentUser}
        currentUserUid={currentUserUid}
        emailVerified={emailVerified}
        listings={listings}
        profiles={profiles}
        onDeleteListing={onDeleteListing}
        onUpdateListingStatus={onUpdateListingStatus}
        onSignOut={onSignOut}
        organisationProfile={organisationProfile}
        onUpdateProfile={onUpdateProfile}
        onSelectListing={onSelectListing}
        onEditListing={onEditListing}
        initialSection={
          currentView === 'settings' ? 'settings' :
          currentView === 'my-profile' ? 'profile' :
          currentView === 'announcements' ? 'announcements' :
          currentView === 'favourites' ? 'favourites' :
          currentView === 'partner-requests' ? 'partner-requests' :
          'listings'
        }
      />
    );
  }

  // Default fallback
  return (
    <HomeView
      listings={listings}
      onNavigate={onNavigate}
      onSelectListing={onSelectListing}
      currentUserUid={currentUserUid}
      currentUserProfile={organisationProfile}
    />
  );
}
