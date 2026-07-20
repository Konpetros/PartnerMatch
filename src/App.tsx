import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignInModal from './components/SignInModal';
import AppRouter from './router/AppRouter';
import CookieConsentBanner from './components/CookieConsentBanner';
import NewPlatformBanner from './components/NewPlatformBanner';

import { useAuth } from './hooks/useAuth';
import { useListings } from './hooks/useListings';
import { useProfile } from './hooks/useProfile';
import { useProfiles } from './hooks/useProfiles';
import { useUsers } from './hooks/useUsers';
import { useNavigation } from './hooks/useNavigation';
import { useToast } from './hooks/useToast';
import { Listing } from './types';
import { trackPageView } from './utils/analytics';
import { updateUserBanStatus, promoteUserToAdmin, demoteUserFromAdmin } from './services/firebase/firestore';

export default function App() {
  const { toastMessage, showToast } = useToast(5000);

  // Auth — includes real Firebase user UID
  const {
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
  } = useAuth(() => {
    // onFirstLogin — navigation is handled by the useEffect below
    // once the profile has finished loading from Firestore
  });

  // Listings — pass UID for write operations
  const {
    listings,
    listingsLoading,
    handleSubmitListing,
    handleDeleteListing,
    handleUpdateListingStatus,
    handleApproveListing,
    handleRejectListing,
    handleUpdateListing,
  } = useListings(currentUserUid);

  // Profile — pass UID to load/save from Firestore
  const {
    organisationProfile,
    hasProfile,
    profileLoading,
    handleProfileComplete,
    handleUpdateProfile,
  } = useProfile(currentUserUid);

  // All registered organisation profiles for the directory
  const { profiles, profilesLoading } = useProfiles();

  // All registered users for the admin panel
  const { adminUsers } = useUsers(isAdmin);

  // Navigation
  const {
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
  } = useNavigation(!!currentUser, isAdmin, handleOpenSignIn);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPageView(selectedListingId ? `${currentView}/${selectedListingId}` : currentView);
  }, [currentView, selectedListingId]);

  // Track whether we have already navigated after this login session
  const hasNavigatedAfterLogin = useRef(false);

  // Reset the navigation flag when user signs out
  useEffect(() => {
    if (!currentUserUid) {
      hasNavigatedAfterLogin.current = false;
    }
  }, [currentUserUid]);

  // Navigate once after sign-in, but only after profile has finished loading
  useEffect(() => {
    if (currentUserUid && !profileLoading && !hasNavigatedAfterLogin.current) {
      hasNavigatedAfterLogin.current = true;
      if (!hasProfile) {
        // Only redirect to profile setup if genuinely no profile exists
        handleNavigate('profile-setup');
      }
      // If profile exists, stay on whatever page the user is already on
    }
  }, [currentUserUid, profileLoading, hasProfile]);

  // Wrap profile complete
  const onProfileComplete = async (profile: Parameters<typeof handleProfileComplete>[0]) => {
    await handleProfileComplete(profile);
    showToast('Profile saved! You can now submit your first listing.');
    handleNavigate('home');
  };

  // Wrap submit listing — strip local ID before sending to Firestore
  const onSubmitListing = async (listing: Listing) => {
    const { id: _id, ...listingWithoutId } = listing;
    try {
      await handleSubmitListing(listingWithoutId);
      showToast('Listing submitted! It will appear after admin approval.');
    } catch {
      showToast('Failed to submit listing. Please try again.');
    }
  };

  const onUpdateListing = async (id: string, data: import('./types').Listing | Partial<import('./types').Listing>) => {
    try {
      await handleUpdateListing(id, data as Partial<import('./types').Listing>);
      showToast('Listing updated! It will reappear after admin approval.');
    } catch {
      showToast('Failed to update listing. Please try again.');
    }
  };

  // Wrap sign out
  const onSignOut = async () => {
    await handleSignOut();
    handleNavigate('home');
  };

  // Admin action handlers
  const onApproveListing = async (id: string) => {
    await handleApproveListing(id);
    showToast('Listing approved successfully!');
  };

  const onRejectListing = async (id: string, reason: string) => {
    await handleRejectListing(id, reason);
    showToast('Listing rejected.');
  };

  const handleBanUser = async (uid: string) => {
    if (uid === currentUserUid) {
      showToast('You cannot ban your own account.');
      return;
    }
    try {
      await updateUserBanStatus(uid, 'banned');
      showToast('User banned.');
    } catch (error) {
      console.error('Failed to ban user:', error);
      showToast('Failed to ban user. Please try again.');
    }
  };

  const handleUnbanUser = async (uid: string) => {
    try {
      await updateUserBanStatus(uid, 'active');
      showToast('User unbanned.');
    } catch (error) {
      console.error('Failed to unban user:', error);
      showToast('Failed to unban user. Please try again.');
    }
  };

  const handlePromoteToAdmin = async (uid: string) => {
    try {
      await promoteUserToAdmin(uid);
      showToast('User promoted to admin.');
    } catch (error) {
      console.error('Failed to promote user:', error);
      showToast('Failed to promote user. Please try again.');
    }
  };

  const handleDemoteFromAdmin = async (uid: string) => {
    if (uid === currentUserUid) {
      showToast('You cannot remove your own admin privileges.');
      return;
    }
    try {
      await demoteUserFromAdmin(uid);
      showToast('Admin privileges removed.');
    } catch (error) {
      console.error('Failed to demote user:', error);
      showToast('Failed to remove admin privileges. Please try again.');
    }
  };

  // Show full-screen loading spinner while Firebase checks auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading PartnerMatch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg relative font-sans text-slate-800 antialiased selection:bg-brand-primary/20">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-fade-in">
          <div className="flex items-center space-x-2 bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <NewPlatformBanner isLoggedIn={!!currentUser} onOpenSignIn={handleOpenSignIn} />

      {/* Navbar */}
      {!['admin', 'admin-pending', 'admin-listings', 'admin-users', 'admin-announcements'].includes(currentView) && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenSignIn={handleOpenSignIn}
          currentUser={currentUser}
          onSignOut={onSignOut}
          isAdmin={isAdmin}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        <AppRouter
          currentView={currentView}
          selectedListingId={selectedListingId}
          selectedOrgId={selectedOrgId}
          listings={listings}
          profiles={profiles}
          currentUser={currentUser}
          currentUserUid={currentUserUid}
          emailVerified={emailVerified}
          organisationProfile={organisationProfile}
          onNavigate={handleNavigate}
          onSelectListing={handleSelectListing}
          onSelectOrganisation={handleSelectOrganisation}
          onViewListingFromOrg={handleViewListingFromOrg}
          onViewOrgProfile={handleViewOrgProfile}
          onSubmitListing={onSubmitListing}
          editingListingId={editingListingId}
          onUpdateListing={onUpdateListing}
          onEditListing={handleEditListing}
          onDeleteListing={handleDeleteListing}
          onUpdateListingStatus={handleUpdateListingStatus}
          onProfileComplete={onProfileComplete}
          onUpdateProfile={handleUpdateProfile}
          onOpenSignIn={handleOpenSignIn}
          onSignOut={onSignOut}
          isAdmin={isAdmin}
          adminUsers={adminUsers}
          onApproveListing={onApproveListing}
          onRejectListing={onRejectListing}
           onBanUser={handleBanUser}
          onUnbanUser={handleUnbanUser}
          onPromoteToAdmin={handlePromoteToAdmin}
          onDemoteFromAdmin={handleDemoteFromAdmin}
        />
      </main>

      {/* Footer */}
      {!['admin', 'admin-pending', 'admin-listings', 'admin-users', 'admin-announcements'].includes(currentView) && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Cookie Consent Banner */}
      <CookieConsentBanner onNavigate={handleNavigate} />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={handleCloseSignIn}
        onSuccessSignIn={handleSignInSuccess}
      />
    </div>
  );
}
