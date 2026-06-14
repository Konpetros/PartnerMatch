import React, { useEffect, useState } from 'react';
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

import { MOCK_ADMIN_USERS, MOCK_ACTIVITY_LOG } from './data/mockListings';

export default function App() {

  // Toast notifications
  const { toastMessage, showToast } = useToast(5000);

  // Auth
  const {
    currentUser,
    isAdmin,
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
    handleApproveListing,
    handleRejectListing,
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
  } = useNavigation(!!currentUser, isAdmin, handleOpenSignIn);

  // Admin users state (mutations during session)
  const [adminUsers, setAdminUsers] = useState(MOCK_ADMIN_USERS);
  const [activityLog, setActivityLog] = useState(MOCK_ACTIVITY_LOG);

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
    const newLog = {
      id: `act-${Date.now()}`,
      action: 'submitted' as const,
      listingName: listing.name,
      userName: currentUser || 'Member',
      timestamp: new Date().toISOString()
    };
    setActivityLog(prev => [newLog, ...prev]);
  };

  // Wrap sign out to navigate home
  const onSignOut = () => {
    handleSignOut();
    handleNavigate('home');
  };

  // Admin Action Handlers
  const handleBanUser = (uid: string) => {
    setAdminUsers(prev => prev.map(u => u.uid === uid ? { ...u, status: 'banned' as const } : u));
    showToast('User has been banned.');
  };

  const handleUnbanUser = (uid: string) => {
    setAdminUsers(prev => prev.map(u => u.uid === uid ? { ...u, status: 'active' as const } : u));
    showToast('User suspension lifted.');
  };

  const handleDeleteUser = (uid: string) => {
    setAdminUsers(prev => prev.filter(u => u.uid !== uid));
    showToast('User account deleted.');
  };

  const handlePromoteToAdmin = (uid: string) => {
    setAdminUsers(prev => prev.map(u => u.uid === uid ? { ...u, isAdmin: true } : u));
    showToast('User promoted to Administrator.');
  };

  const onApproveListing = (id: string) => {
    handleApproveListing(id);
    const listing = listings.find(l => l.id === id);
    if (listing) {
      showToast(`Listing "${listing.name}" approved successfully!`);
      const newLog = {
        id: `act-${Date.now()}`,
        action: 'approved' as const,
        listingName: listing.name,
        userName: currentUser || 'Admin',
        timestamp: new Date().toISOString()
      };
      setActivityLog(prev => [newLog, ...prev]);
    }
  };

  const onRejectListing = (id: string, reason: string) => {
    handleRejectListing(id, reason);
    const listing = listings.find(l => l.id === id);
    if (listing) {
      showToast(`Listing "${listing.name}" rejected.`);
      const newLog = {
        id: `act-${Date.now()}`,
        action: 'rejected' as const,
        listingName: listing.name,
        userName: currentUser || 'Admin',
        timestamp: new Date().toISOString()
      };
      setActivityLog(prev => [newLog, ...prev]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg relative font-sans text-slate-800 antialiased selection:bg-brand-primary/10 select-none">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start space-x-3.5 animate-fade-in animate-duration-300">
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
            <span>
              Authenticated: <strong className="text-white font-semibold">{currentUser}</strong> 
              {isAdmin && <span className="ml-1 px-1.5 py-0.5 bg-brand-primary text-white text-[10px] font-bold rounded">Admin</span>}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin && currentView !== 'admin' && currentView !== 'admin-pending' && currentView !== 'admin-listings' && currentView !== 'admin-users' && (
              <button
                onClick={() => handleNavigate('admin')}
                className="text-brand-primary hover:text-brand-primary-hover font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>⚙️ Open Admin Control</span>
              </button>
            )}
            <button
              onClick={onSignOut}
              className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Navbar - Only layout if not in dedicated Admin panel pages */}
      {!['admin', 'admin-pending', 'admin-listings', 'admin-users'].includes(currentView) && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenSignIn={handleOpenSignIn}
          currentUser={currentUser}
          onSignOut={onSignOut}
        />
      )}

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

      {/* Footer - Only layout if not in dedicated Admin panel pages */}
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
