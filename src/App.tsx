import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignInModal from './components/SignInModal';
import AppRouter from './router/AppRouter';

import { useAuth } from './hooks/useAuth';
import { useListings } from './hooks/useListings';
import { useProfile } from './hooks/useProfile';
import { useNavigation } from './hooks/useNavigation';
import { useToast } from './hooks/useToast';
import { Listing } from './types';

export default function App() {
  const { toastMessage, showToast } = useToast(5000);

  // Auth — includes real Firebase user UID
  const {
    currentUser,
    currentUserUid,
    isAdmin,
    isSignInOpen,
    authLoading,
    handleOpenSignIn,
    handleCloseSignIn,
    handleSignInSuccess,
    handleSignOut,
  } = useAuth(() => {
    if (!hasProfile) {
      handleNavigate('profile-setup');
    } else {
      handleNavigate('home');
    }
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
  } = useListings(currentUserUid);

  // Profile — pass UID to load/save from Firestore
  const {
    organisationProfile,
    hasProfile,
    profileLoading,
    handleProfileComplete,
    handleUpdateProfile,
  } = useProfile(currentUserUid);

  // Navigation
  const {
    currentView,
    selectedListingId,
    selectedOrgId,
    handleNavigate,
    handleSelectListing,
    handleSelectOrganisation,
    handleViewListingFromOrg,
  } = useNavigation(!!currentUser, isAdmin, handleOpenSignIn);

  // Admin users and activity log — kept in local state for now
  const [adminUsers] = useState<any[]>([]);
  const [activityLog] = useState<any[]>([]);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedListingId]);

  // Wrap profile complete
  const onProfileComplete = async (profile: Parameters<typeof handleProfileComplete>[0]) => {
    await handleProfileComplete(profile);
    showToast('Profile saved! You can now submit your first listing.');
    handleNavigate('home');
  };

  // Wrap submit listing — strip local ID before sending to Firestore
  const onSubmitListing = async (listing: Listing) => {
    const { id, ...listingWithoutId } = listing;
    await handleSubmitListing(listingWithoutId);
    showToast('Listing submitted! It will appear after admin approval.');
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

  const handleBanUser = (uid: string) => showToast('User management coming soon.');
  const handleUnbanUser = (uid: string) => showToast('User management coming soon.');
  const handleDeleteUser = (uid: string) => showToast('User management coming soon.');
  const handlePromoteToAdmin = (uid: string) => showToast('User management coming soon.');

  // Show full-screen loading spinner while Firebase checks auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading ErasmusMatch...</p>
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

      {/* Navbar */}
      {!['admin', 'admin-pending', 'admin-listings', 'admin-users'].includes(currentView) && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenSignIn={handleOpenSignIn}
          currentUser={currentUser}
          onSignOut={onSignOut}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        <AppRouter
          currentView={currentView}
          selectedListingId={selectedListingId}
          selectedOrgId={selectedOrgId}
          listings={listings}
          currentUser={currentUser}
          organisationProfile={organisationProfile}
          onNavigate={handleNavigate}
          onSelectListing={handleSelectListing}
          onSelectOrganisation={handleSelectOrganisation}
          onViewListingFromOrg={handleViewListingFromOrg}
          onSubmitListing={onSubmitListing}
          onDeleteListing={handleDeleteListing}
          onUpdateListingStatus={handleUpdateListingStatus}
          onProfileComplete={onProfileComplete}
          onUpdateProfile={handleUpdateProfile}
          onOpenSignIn={handleOpenSignIn}
          onSignOut={onSignOut}
          isAdmin={isAdmin}
          adminUsers={adminUsers}
          activityLog={activityLog}
          onApproveListing={onApproveListing}
          onRejectListing={onRejectListing}
          onBanUser={handleBanUser}
          onUnbanUser={handleUnbanUser}
          onDeleteUser={handleDeleteUser}
          onPromoteToAdmin={handlePromoteToAdmin}
        />
      </main>

      {/* Footer */}
      {!['admin', 'admin-pending', 'admin-listings', 'admin-users'].includes(currentView) && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={handleCloseSignIn}
        onSuccessSignIn={handleSignInSuccess}
      />
    </div>
  );
}
