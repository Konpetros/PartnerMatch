import React, { useEffect } from 'react';
import { CheckCircle2, LogOut } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignInModal from './components/SignInModal';
import AppRouter from './router/AppRouter';

import { useAuth } from './hooks/useAuth';
import { useListings } from './hooks/useListings';
import { useProfile } from './hooks/useProfile';
import { useNavigation } from './hooks/useNavigation';
import { useToast } from './hooks/useToast';

export default function App() {

  // Toast notifications
  const { toastMessage, showToast } = useToast(5000);

  // Auth
  const {
    currentUser,
    isSignInOpen,
    handleOpenSignIn,
    handleCloseSignIn,
    handleSignInSuccess,
    handleSignOut,
  } = useAuth(() => {
    // On first login — check if profile exists, redirect accordingly
    if (!hasProfile) {
      handleNavigate('profile-setup');
    } else {
      handleNavigate('home');
    }
  });

  // Listings
  const {
    listings,
    handleSubmitListing,
    handleDeleteListing,
    handleUpdateListingStatus,
  } = useListings();

  // Profile
  const {
    organisationProfile,
    hasProfile,
    handleProfileComplete,
    handleUpdateProfile,
  } = useProfile();

  // Navigation
  const {
    currentView,
    selectedListingId,
    selectedOrgId,
    handleNavigate,
    handleSelectListing,
    handleSelectOrganisation,
    handleViewListingFromOrg,
  } = useNavigation(!!currentUser, handleOpenSignIn);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedListingId]);

  // Wrap profile complete to show toast + navigate
  const onProfileComplete = (profile: Parameters<typeof handleProfileComplete>[0]) => {
    handleProfileComplete(profile);
    showToast('Profile saved! You can now submit your first listing.');
    handleNavigate('home');
  };

  // Wrap submit listing to show toast
  const onSubmitListing = (listing: Parameters<typeof handleSubmitListing>[0]) => {
    handleSubmitListing(listing);
    showToast(`Listing submitted successfully! Pending admin approval.`);
  };

  // Wrap sign out to navigate home
  const onSignOut = () => {
    handleSignOut();
    handleNavigate('home');
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg relative font-sans text-slate-800 antialiased selection:bg-brand-primary/10 select-none">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start space-x-3.5 animate-fade-in">
          <div className="p-1.5 bg-green-500/10 text-emerald-400 rounded-lg shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-0.5">
            <p className="text-sm font-bold">Notification</p>
            <p className="text-xs text-slate-400 leading-relaxed">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Auth bar when logged in */}
      {currentUser && (
        <div className="bg-slate-900 text-slate-300 py-2.5 px-4 sm:px-6 lg:px-8 text-xs flex justify-between items-center border-b border-slate-800 tracking-wide font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Authenticated: <strong className="text-white font-semibold">{currentUser}</strong></span>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSignIn={handleOpenSignIn}
        currentUser={currentUser}
        onSignOut={onSignOut}
      />

      {/* Main Content — Router */}
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
        />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={handleCloseSignIn}
        onSuccessSignIn={handleSignInSuccess}
      />

    </div>
  );
}
