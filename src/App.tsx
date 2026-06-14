/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MOCK_LISTINGS } from './data';
import { Listing } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import DetailView from './components/DetailView';
import SubmitView from './components/SubmitView';
import MyListingsView from './components/MyListingsView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import SignInModal from './components/SignInModal';
import { Sparkles, CheckCircle2, LogOut, CheckSquare, PlusCircle, LayoutDashboard, Mail } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  // Core Data State (Pre-seeded with 9 premium entries)
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);

  // Authentication Mock State
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Banner Notification Alert State
  const [sessionNotification, setSessionNotification] = useState<string | null>(null);

  // Auto Scroll back to top on navigation to emulate a real multi-page site
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedListingId]);

  // Navigate utility
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedListingId(null);
  };

  // View individual listing
  const handleSelectListing = (id: string) => {
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
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setSessionNotification('Successfully logged out.');
    setTimeout(() => {
      setSessionNotification(null);
    }, 4000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg relative font-sans text-slate-800 antialiased selection:bg-brand-primary/10 select-none">
      
      {/* 1. Global Interactive Notifications Banner */}
      {sessionNotification && (
        <div id="session-toast-banner" className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start space-x-3.5 animate-fade-in">
          <div className="p-1.5 bg-green-500/10 text-emerald-400 rounded-lg shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-0.5">
            <p className="text-sm font-bold">Operational Logs</p>
            <p className="text-xs text-slate-400 leading-relaxed">{sessionNotification}</p>
          </div>
        </div>
      )}

      {/* 2. Authentication Bar greeting when logged in */}
      {currentUser && (
        <div id="auth-header-bar" className="bg-slate-900 text-slate-300 py-2.5 px-4 sm:px-6 lg:px-8 text-xs flex justify-between items-center border-b border-slate-800 tracking-wide font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Authenticated session: <strong className="text-white text-semibold">{currentUser}</strong></span>
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
            // Dynamic check: If user authenticated, show customized user center listing logs!
            if (currentUser) {
              // Extract items posted during current browser session or mock default listings for user context
              const customEntries = listings.filter(item => item.id.startsWith('user-org-'));
              return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-[24px] border border-blue-50/80 shadow-sm gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-brand-primary">
                        <LayoutDashboard className="w-5 h-5 text-brand-accent" />
                        <span className="text-xs font-black uppercase tracking-wider">Institution Controller</span>
                      </div>
                      <h1 className="text-2xl font-extrabold text-slate-800">
                        Welcome back, <span className="text-brand-primary">{currentUser}</span>
                      </h1>
                      <p className="text-xs text-slate-500">
                        Manage your active partner request proposals and view engagement statistics.
                      </p>
                    </div>

                    <button
                      id="dashboard-new-listing"
                      onClick={() => handleNavigate('submit')}
                      className="inline-flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-5 py-3 rounded-brand font-bold text-xs transition-all shadow-md cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-brand-accent" />
                      <span>Post New Ka Target Request</span>
                    </button>
                  </div>

                  {/* Operational indicators bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-5 rounded-[20px] border border-blue-50/50 shadow-xs space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Institution Proposals</p>
                      <p className="text-3xl font-black text-slate-800">{customEntries.length}</p>
                      <p className="text-[10px] text-slate-500">Active entries created this session</p>
                    </div>

                    <div className="bg-white p-5 rounded-[20px] border border-blue-50/50 shadow-xs space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unique profile loads</p>
                      <p className="text-3xl font-black text-slate-800">{customEntries.length > 0 ? '14' : '0'}</p>
                      <p className="text-[10px] text-slate-500">European searches impressions</p>
                    </div>

                    <div className="bg-white p-5 rounded-[20px] border border-blue-50/50 shadow-xs space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Consortia Inquiries Received</p>
                      <p className="text-3xl font-black text-slate-800">{customEntries.length > 0 ? '2' : '0'}</p>
                      <p className="text-[10px] text-indigo-500">Pending secure emails</p>
                    </div>
                  </div>

                  {/* Listings grid owned by user */}
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
                      Active Publications Created By You
                    </h2>

                    {customEntries.length === 0 ? (
                      <div className="p-12 text-center bg-white rounded-[24px] border border-dashed border-gray-200 max-w-lg mx-auto space-y-4">
                        <p className="text-sm text-slate-500 leading-relaxed">
                          You haven't posted any Erasmus+ partnering profiles yet. All active proposals created via "Submit Listing" will organize here during your browser session.
                        </p>
                        <button
                          id="dashboard-submit-cta"
                          onClick={() => handleNavigate('submit')}
                          className="bg-brand-primary text-white text-xs font-bold px-4 py-2 rounded-brand transition-all shadow-sm cursor-pointer"
                        >
                          Submit First Listing Now
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {customEntries.map(listing => (
                          <div 
                            key={listing.id}
                            className="bg-white rounded-[20px] border border-blue-100 overflow-hidden shadow-xs flex flex-col"
                          >
                            <div className="h-32 bg-slate-100 relative">
                              <img
                                src={listing.thumbnailUrl}
                                alt={listing.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-bold text-slate-800 line-clamp-1">{listing.name}</h3>
                                <p className="text-xs text-slate-400 font-semibold">{listing.city}, {listing.country}</p>
                              </div>

                              <button
                                onClick={() => handleSelectListing(listing.id)}
                                className="w-full mt-2 inline-flex items-center justify-center space-x-1 border border-brand-primary text-brand-primary py-2.5 rounded-brand text-xs font-bold hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                              >
                                <span>Navigate to Public Bio</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // Fallback to empty state with lock warning
            return (
              <MyListingsView 
                onOpenSignIn={() => setIsSignInOpen(true)} 
                onNavigate={handleNavigate}
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
