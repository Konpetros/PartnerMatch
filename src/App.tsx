/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MOCK_LISTINGS } from './data';
import { Listing, OrganisationProfile } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import DetailView from './components/DetailView';
import SubmitView from './components/SubmitView';
import MyListingsView from './components/MyListingsView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import SignInModal from './components/SignInModal';
import ProfileSetupView from './components/ProfileSetupView';
import MyProfileView from './components/MyProfileView';
import OrganisationsView from './components/OrganisationsView';
import OrgProfileView from './components/OrgProfileView';
import { Sparkles, CheckCircle2, LogOut } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  // Core Data State (Pre-seeded with 9 premium entries)
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);

  // User Profile State
  const [organisationProfile, setOrganisationProfile] = useState<OrganisationProfile | null>(null);

  // Authentication Mock State
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Banner Notification Alert State
  const [sessionNotification, setSessionNotification] = useState<string | null>(null);

  // Auto Scroll back to top on navigation to emulate a real multi-page site
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedListingId]);

  // Navigate utility - Guard the submit route
  const handleNavigate = (view: string) => {
    if (view === 'submit' && !currentUser) {
      setIsSignInOpen(true);
      setCurrentView('home');
      setSelectedListingId(null);
    } else {
      setCurrentView(view);
      setSelectedListingId(null);
    }
  };

  // View individual listing
  const handleSelectListing = (id: string) => {
    setSelectedListingId(id);
    setCurrentView('detail');
  };

  const handleSelectOrganisation = (id: string) => {
    setSelectedOrgId(id);
    setCurrentView('org-profile');
  };

  const handleViewListingFromOrg = (id: string) => {
    setSelectedListingId(id);
    setCurrentView('detail');
  };

  // Submission handler adds new proposal to the top of the mock database immediately
  const handleSubmitListing = (newListing: Listing) => {
    setListings((prev) => [newListing, ...prev]);
    
    // Smooth custom notification block
    setSessionNotification(`Successfully added listing: "${newListing.name}"!`);
    setTimeout(() => {
      setSessionNotification(null);
    }, 5000);
  };

  // Sign in handlers
  const handleSignInSuccess = (username: string) => {
    setCurrentUser(username);
    setSessionNotification(`Welcome back, ${username}! Access granted.`);
    setTimeout(() => {
      setSessionNotification(null);
    }, 4000);

    // If no organisation profile set up yet, route to profile-setup immediately
    if (!organisationProfile) {
      setCurrentView('profile-setup');
    } else {
      setCurrentView('home');
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setSessionNotification('Successfully logged out.');
    setTimeout(() => {
      setSessionNotification(null);
    }, 4000);
    setCurrentView('home');
  };

  const handleDeleteListing = (id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    setSessionNotification('Listing removed successfully.');
    setTimeout(() => {
      setSessionNotification(null);
    }, 4000);
  };

  const handleUpdateListingStatus = (id: string, newStatus: 'active' | 'pending' | 'expired' | 'partnership-found') => {
    setListings((prev) => prev.map((item) => item.id === id ? { ...item, status: newStatus } : item));
    setSessionNotification('Listing status updated successfully.');
    setTimeout(() => {
      setSessionNotification(null);
    }, 4000);
  };

  const handleProfileComplete = (profile: OrganisationProfile) => {
    setOrganisationProfile(profile);
    setSessionNotification('Profile saved! You can now submit your first listing.');
    setTimeout(() => {
      setSessionNotification(null);
    }, 4000);
    handleNavigate('home');
  };

  const handleUpdateProfile = (profile: OrganisationProfile) => {
    setOrganisationProfile(profile);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg relative font-sans text-slate-800 antialiased selection:bg-brand-primary/10 select-none">
      
      {/* 1. Global Interactive Notifications Banner */}
      {sessionNotification && (
        <div id="session-toast-banner" className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start space-x-3.5 animate-fade-in">
          <div className="p-1.5 bg-green-500/10 text-emerald-400 rounded-lg shrink-0">
            <CheckCircle2 className="w-5 h-5 animate-bounce-slow" />
          </div>
          <div className="flex-1 space-y-0.5">
            <p className="text-sm font-bold">Operational Logs</p>
            <p className="text-xs text-slate-405 leading-relaxed">{sessionNotification}</p>
          </div>
        </div>
      )}

      {/* 2. Authentication Bar greeting when logged in */}
      {currentUser && (
        <div id="auth-header-bar" className="bg-slate-900 text-slate-300 py-2.5 px-4 sm:px-6 lg:px-8 text-xs flex justify-between items-center border-b border-slate-800 tracking-wide font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Authenticated session: <strong className="text-white font-semibold">{currentUser}</strong></span>
          </div>
          <button 
            id="signout-header-btn"
            onClick={handleSignOut}
            className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Clear Session</span>
          </button>
        </div>
      )}

      {/* 3. Common Header Navigation Menu */}
      <Navbar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onOpenSignIn={() => setIsSignInOpen(true)} 
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* 4. Active Router View Render Switcher */}
      <main className="flex-1">
        {(() => {
          if (currentView === 'home') {
            return (
              <HomeView 
                listings={listings} 
                onNavigate={handleNavigate} 
                onSelectListing={handleSelectListing} 
              />
            );
          }

          if (currentView === 'organisations') {
            return (
              <OrganisationsView
                listings={listings}
                onSelectOrganisation={handleSelectOrganisation}
                onNavigate={handleNavigate}
              />
            );
          }

          if (currentView === 'org-profile' && selectedOrgId) {
            const activeOrg = listings.find(item => item.id === selectedOrgId);
            if (activeOrg) {
              return (
                <OrgProfileView
                  listing={activeOrg}
                  onBack={() => handleNavigate('organisations')}
                  onViewListing={handleViewListingFromOrg}
                />
              );
            }
          }

          if (currentView === 'profile-setup') {
            return <ProfileSetupView onProfileComplete={handleProfileComplete} />;
          }

          if (currentView === 'my-profile') {
            return (
              <MyProfileView
                currentUser={currentUser}
                profile={organisationProfile}
                onUpdateProfile={handleUpdateProfile}
                onNavigate={handleNavigate}
                onSignOut={handleSignOut}
                listings={listings}
              />
            );
          }

          if (currentView === 'detail' && selectedListingId) {
            const activeItem = listings.find((item) => item.id === selectedListingId);
            if (activeItem) {
              return (
                <DetailView 
                  listing={activeItem} 
                  onBack={() => handleNavigate('home')} 
                />
              );
            }
            // fallback
            return (
              <HomeView 
                listings={listings} 
                onNavigate={handleNavigate} 
                onSelectListing={handleSelectListing} 
              />
            );
          }

          if (currentView === 'submit') {
            return (
              <SubmitView 
                organisationProfile={organisationProfile}
                onSubmitListing={handleSubmitListing} 
                onNavigate={handleNavigate}
                onSelectListing={handleSelectListing}
              />
            );
          }

          if (currentView === 'about') {
            return (
              <AboutView onNavigate={handleNavigate} />
            );
          }

          if (currentView === 'contact') {
            return (
              <ContactView onNavigate={handleNavigate} />
            );
          }

          if (currentView === 'my-listings') {
            return (
              <MyListingsView 
                onOpenSignIn={() => setIsSignInOpen(true)} 
                onNavigate={handleNavigate}
                currentUser={currentUser}
                listings={listings}
                onDeleteListing={handleDeleteListing}
                onUpdateListingStatus={handleUpdateListingStatus}
                onSignOut={handleSignOut}
              />
            );
          }

          return null;
        })()}
      </main>

      {/* 5. Common Footer Navigation */}
      <Footer onNavigate={handleNavigate} />

      {/* 6. Sign In Modal Overlay */}
      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
        onSuccessSignIn={handleSignInSuccess} 
      />
    </div>
  );
}
