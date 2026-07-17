/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import SettingsPanel from './SettingsPanel';
import PartnerMatchLogo from '../assets/PartnerMatchLogo';
import { 
  Lock, 
  LogIn, 
  LayoutDashboard, 
  PlusCircle, 
  ClipboardList, 
  User, 
  Settings, 
  LogOut, 
  X,
  Megaphone,
  Heart,
  Handshake,
  MessageSquare
} from 'lucide-react';
import { Listing, OrganisationProfile } from '../types';
import { subscribeToAnnouncements, saveDismissedAnnouncements, getDismissedAnnouncements, getFavourites, getIncomingRequests, getSentRequests, markConversationRead, archiveConversation, unarchiveConversation } from '../services/firebase/firestore';
import { PartnerRequest } from '../types/partnerRequest';
import { ProfileWithUid } from '../hooks/useProfiles';
import { resendVerificationEmail } from '../services/firebase/auth';
import AnnouncementsSection from './dashboard/AnnouncementsSection';
import FavouritesSection from './dashboard/FavouritesSection';
import ProfileSection from './dashboard/ProfileSection';
import PartnerRequestsSection from './dashboard/PartnerRequestsSection';
import MessagesSection from './dashboard/MessagesSection';
import ListingsSection from './dashboard/ListingsSection';

interface MyListingsViewProps {
  onOpenSignIn: () => void;
  onNavigate: (view: string) => void;
  currentUser: string | null;
  currentUserUid?: string | null;
  emailVerified: boolean;
  listings: Listing[];
  onDeleteListing: (id: string) => void;
  onUpdateListingStatus: (id: string, status: 'active' | 'pending' | 'expired' | 'partnership-found' | 'rejected') => void;
  onSignOut: () => void;
  initialSection?: 'listings' | 'settings' | 'announcements' | 'profile' | 'favourites' | 'partner-requests' | 'messages';
  organisationProfile?: OrganisationProfile | null;
  onUpdateProfile?: (profile: OrganisationProfile) => void;
  onSelectListing?: (id: string) => void;
  onEditListing: (id: string) => void;
  profiles?: ProfileWithUid[];
}

export default function MyListingsDashboardView({ 
  onOpenSignIn, 
  onNavigate, 
  currentUser, 
  currentUserUid,
  emailVerified,
  listings, 
  onDeleteListing, 
  onUpdateListingStatus, 
  onSignOut,
  initialSection = 'listings',
  organisationProfile,
  onUpdateProfile,
  onSelectListing,
  onEditListing,
  profiles = []
}: MyListingsViewProps) {
  // Local state for toast notification
  const [toast, setToast] = useState<string | null>(null);
  
  // Tab control state
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Pending' | 'Expired' | 'Rejected' | 'Partnerships'>('All');
  
  // Search bar query state
  const [searchQuery, setSearchQuery] = useState('');

  // Active section to toggle between 'listings', 'settings' and 'announcements'
  const [activeSection, setActiveSection] = useState<'listings' | 'settings' | 'announcements' | 'profile' | 'favourites' | 'partner-requests' | 'messages'>(initialSection);
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);
  const [dashSentListingIds, setDashSentListingIds] = useState<string[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<PartnerRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<PartnerRequest[]>([]);
  const [requestsTab, setRequestsTab] = useState<'received' | 'sent'>('received');
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [activeChatRequest, setActiveChatRequest] = useState<PartnerRequest | null>(null);

  const acceptedConversations = [...incomingRequests, ...sentRequests]
    .filter(r => r.status === 'accepted')
    .filter((r, idx, arr) => arr.findIndex(x => x.id === r.id) === idx)
    .sort((a, b) => (b.lastMessageAt || b.createdAt).localeCompare(a.lastMessageAt || a.createdAt));

  const conversations = acceptedConversations.filter(
    r => !(r.archivedBy || []).includes(currentUserUid || '')
  );

  const archivedConversations = acceptedConversations.filter(
    r => (r.archivedBy || []).includes(currentUserUid || '')
  );

  const handleArchiveToggle = (requestId: string) => {
    if (!currentUserUid) return;
    const isArchived = archivedConversations.some(r => r.id === requestId);
    const action = isArchived ? unarchiveConversation : archiveConversation;
    action(requestId, currentUserUid).catch(() => showToast('Failed to update archive status.'));
    const patch = (list: PartnerRequest[]) =>
      list.map(r => {
        if (r.id !== requestId) return r;
        const current = r.archivedBy || [];
        return {
          ...r,
          archivedBy: isArchived ? current.filter(id => id !== currentUserUid) : [...current, currentUserUid],
        };
      });
    setIncomingRequests(prev => patch(prev));
    setSentRequests(prev => patch(prev));
  };

  const isConversationUnread = (req: PartnerRequest): boolean => {
    if (!req.lastMessageAt || !currentUserUid) return false;
    const myLastRead = req.readStatus?.[currentUserUid];
    return !myLastRead || req.lastMessageAt > myLastRead;
  };

  const unreadCount = conversations.filter(isConversationUnread).length;

  const isEmailPublic = (orgUid: string): boolean => {
    const p = profiles.find(pr => pr.uid === orgUid);
    return p?.showEmailOnProfile ?? true;
  };

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    if (currentUserUid) {
      getFavourites(currentUserUid).then(setFavouriteIds);
      getSentRequests(currentUserUid).then(requests =>
        setDashSentListingIds(requests.map(r => r.listingId))
      );
    }
  }, [currentUserUid]);

  const handleDashToggleFavourite = (listingId: string) => {
    setFavouriteIds(prev =>
      prev.includes(listingId) ? prev.filter(id => id !== listingId) : [...prev, listingId]
    );
  };

  const handleDashInterestSent = (listingId: string) => {
    setDashSentListingIds(prev => [...prev, listingId]);
  };

  useEffect(() => {
    if (currentUserUid && activeSection === 'partner-requests') {
      setRequestsLoading(true);
      Promise.all([
        getIncomingRequests(currentUserUid),
        getSentRequests(currentUserUid),
      ]).then(([incoming, sent]) => {
        setIncomingRequests(incoming.filter(r => !(r.hiddenBy || []).includes(currentUserUid)));
        setSentRequests(sent.filter(r => !(r.hiddenBy || []).includes(currentUserUid)));
        setRequestsLoading(false);
      });
    }
  }, [currentUserUid, activeSection]);

  useEffect(() => {
    if (currentUserUid && activeSection === 'messages') {
      setRequestsLoading(true);
      Promise.all([
        getIncomingRequests(currentUserUid),
        getSentRequests(currentUserUid),
      ]).then(([incoming, sent]) => {
        setIncomingRequests(incoming.filter(r => !(r.hiddenBy || []).includes(currentUserUid)));
        setSentRequests(sent.filter(r => !(r.hiddenBy || []).includes(currentUserUid)));
      }).finally(() => setRequestsLoading(false));
    }
  }, [currentUserUid, activeSection]);

  useEffect(() => {
    if (currentUserUid) {
      Promise.all([
        getIncomingRequests(currentUserUid),
        getSentRequests(currentUserUid),
      ]).then(([incoming, sent]) => {
        setIncomingRequests(incoming.filter(r => !(r.hiddenBy || []).includes(currentUserUid)));
        setSentRequests(sent.filter(r => !(r.hiddenBy || []).includes(currentUserUid)));
      }).catch(() => {});
    }
  }, [currentUserUid]);

  useEffect(() => {
    if (activeSection === 'messages' && !activeChatRequest && conversations.length > 0) {
      setActiveChatRequest(conversations[0]);
    }
  }, [activeSection, conversations, activeChatRequest]);

  useEffect(() => {
    if (activeChatRequest && currentUserUid && isConversationUnread(activeChatRequest)) {
      const now = new Date().toISOString();
      markConversationRead(activeChatRequest.id, currentUserUid).catch(() => {});
      const patch = (list: PartnerRequest[]) =>
        list.map(r => r.id === activeChatRequest.id
          ? { ...r, readStatus: { ...(r.readStatus || {}), [currentUserUid]: now } }
          : r);
      setIncomingRequests(prev => patch(prev));
      setSentRequests(prev => patch(prev));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatRequest, currentUserUid]);

  useEffect(() => {
    setActiveSection(initialSection as any);
  }, [initialSection]);

  useEffect(() => {
    const unsubscribe = subscribeToAnnouncements((data) => {
      setAnnouncements(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUserUid) return;
    getDismissedAnnouncements(currentUserUid).then((ids) => {
      setDismissedIds(ids);
    });
  }, [currentUserUid]);

  const handleDismiss = async (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    if (currentUserUid) {
      await saveDismissedAnnouncements(currentUserUid, updated);
    }
  };

  const visibleAnnouncements = announcements.filter(a => !dismissedIds.includes(a.id));




  const showToast = (message: string) => {
    setToast(message);
    const id = setTimeout(() => {
      setToast(null);
    }, 4000);
  };



  // 1. UNAUTHENTICATED LOCKED STATE
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12 animate-fade-in">
        {/* Visual Header */}
        <div className="bg-white rounded-[24px] border border-blue-50/80 shadow-sm overflow-hidden p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6">
          
          <div className="relative mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-brand-accent">
            <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-25 scale-125" />
            <Lock className="w-10 h-10 relative z-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
              Sign In to Manage Your Listings
            </h1>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
              Authenticating allows you to edit previous submissions, toggle active research states, or publish new proposals linked to your organization.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              id="mylistings-signin-trigger"
              onClick={onOpenSignIn}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-3 rounded-brand font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-brand-accent" />
              <span>Sign In Now</span>
            </button>

            <button
              id="mylistings-browse-trigger"
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-brand font-bold text-sm border border-slate-250 transition-all cursor-pointer"
            >
              <span>Browse Active Proposals</span>
            </button>
          </div>
        </div>

        {/* Simulated Preview Dashboard - Offline Mode */}
        <div className="opacity-50 select-none pointer-events-none space-y-4">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span>My Project Control Center (Draft Preview)</span>
            </h2>
            <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-bold">Offline Mode</span>
          </div>

          <div className="bg-white border border-gray-150 rounded-[20px] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xs">
            <div className="p-4 border border-dashed border-gray-200 rounded-xl space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Consortia Requests</p>
              <p className="text-2xl font-black text-slate-700">--</p>
            </div>
            <div className="p-4 border border-dashed border-gray-200 rounded-xl space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Weekly Views</p>
              <p className="text-2xl font-black text-slate-700">--</p>
            </div>
            <div className="p-4 border border-dashed border-gray-200 rounded-xl space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Active Action Items</p>
              <p className="text-2xl font-black text-slate-700">--</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED DASHBOARD STATE
  const initials = currentUser.trim().charAt(0).toUpperCase() || 'E';

  // Only show current user's own listings
  const userListings = listings.filter(l => (l as any).submittedBy === currentUserUid);

  // Compute stats for listing items
  const allCount = userListings.length;
  const activeCount = userListings.filter(l => l.status === 'active' || !l.status).length; // fallback to active if not set
  const pendingCount = userListings.filter(l => l.status === 'pending').length;
  const expiredCount = userListings.filter(l => l.status === 'expired').length;
  const rejectedCount = userListings.filter(l => l.status === 'rejected').length;
  const partnershipFoundCount = userListings.filter(l => l.status === 'partnership-found').length;

  const tabCounts = {
    'All': allCount,
    'Active': activeCount,
    'Pending': pendingCount,
    'Expired': expiredCount,
    'Rejected': rejectedCount,
    'Partnerships': partnershipFoundCount
  };

  // Perform filtering
  const filteredListings = userListings.filter(listing => {
    // Search query matches organisation name index
    const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tab filtering status check
    const statusVal = listing.status || 'active'; // fallback to active
    let matchesTab = true;
    if (activeTab === 'Active') {
      matchesTab = statusVal === 'active';
    } else if (activeTab === 'Pending') {
      matchesTab = statusVal === 'pending';
    } else if (activeTab === 'Expired') {
      matchesTab = statusVal === 'expired';
    } else if (activeTab === 'Rejected') {
      matchesTab = statusVal === 'rejected';
    } else if (activeTab === 'Partnerships') {
      matchesTab = statusVal === 'partnership-found';
    }

    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative">
      {!emailVerified && (
        <div className="mb-6 flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <p className="text-xs font-semibold text-amber-800">
            Please verify your email address. Check your inbox for a verification link.
          </p>
          <button
            onClick={async () => {
              try {
                await resendVerificationEmail();
                showToast('Verification email sent.');
              } catch {
                showToast('Failed to send verification email. Please try again.');
              }
            }}
            className="shrink-0 text-xs font-bold text-amber-800 hover:underline cursor-pointer whitespace-nowrap"
          >
            Resend email
          </button>
        </div>
      )}
      


      {/* Main Grid Wrapper */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT SIDEBAR (Desktop: Fixed 260px, Mobile: hidden-like collapse) */}
        <aside className="w-full lg:w-[260px] bg-white rounded-[24px] border border-blue-50/80 p-6 shadow-sm space-y-6 shrink-0 lg:sticky lg:top-8 hidden md:block">
          
          {/* User Info Block */}
          <div className="flex flex-col items-center text-center space-y-3 pb-5 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-brand-primary text-white font-extrabold text-xl flex items-center justify-center shadow-sm">
              {initials}
            </div>
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{currentUser}</h3>
              <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">Erasmus+ Member</p>
            </div>
          </div>

          {/* Nav menu items */}
          <nav className="space-y-1.5 flex flex-col">
            <button
              onClick={() => setActiveSection('listings')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-any text-left ${activeSection === 'listings' ? 'bg-blue-50 text-brand-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="flex items-center space-x-2.5">
                <ClipboardList className="w-4 h-4 shrink-0" />
                <span>My Listings</span>
              </span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${activeSection === 'listings' ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                {allCount}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition-any text-left ${activeSection === 'profile' ? 'bg-blue-50 text-brand-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>My Organisation</span>
            </button>

            <button
              onClick={() => setActiveSection('favourites')}
              className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition-any text-left cursor-pointer ${activeSection === 'favourites' ? 'bg-blue-50 text-brand-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Heart className="w-4 h-4 shrink-0" />
              <span>Favourites</span>
            </button>

            <button
              onClick={() => setActiveSection('partner-requests')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-any text-left cursor-pointer ${activeSection === 'partner-requests' ? 'bg-blue-50 text-brand-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="flex items-center space-x-2.5">
                <Handshake className="w-4 h-4 shrink-0" />
                <span>Partner Requests</span>
              </span>
              {incomingRequests.filter(r => r.status === 'pending').length > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {incomingRequests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSection('messages')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-any text-left cursor-pointer ${activeSection === 'messages' ? 'bg-blue-50 text-brand-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="flex items-center space-x-2.5">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Messages</span>
              </span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shrink-0">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSection('settings')}
              className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition-any text-left ${activeSection === 'settings' ? 'bg-blue-50 text-brand-primary' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => setActiveSection('announcements')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-any text-left ${activeSection === 'announcements' ? 'bg-blue-50 text-brand-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="flex items-center space-x-2.5">
                <Megaphone className="w-4 h-4 shrink-0" />
                <span>Announcements</span>
              </span>
              {visibleAnnouncements.length > 0 && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${activeSection === 'announcements' ? 'bg-brand-primary text-white' : 'bg-red-100 text-red-600'}`}>
                  {visibleAnnouncements.length}
                </span>
              )}
            </button>
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('submit')}
              className="w-full inline-flex items-center justify-center space-x-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white py-3 rounded-xl font-bold text-xs transition-any shadow-sm active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-brand-accent shrink-0" />
              <span>Submit New Listing</span>
            </button>

            <button
              onClick={onSignOut}
              className="w-full inline-flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold text-xs transition-any cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>

        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 w-full space-y-6">
          {activeSection === 'messages' ? (
            <MessagesSection
              conversations={conversations}
              archivedConversations={archivedConversations}
              onArchiveToggle={handleArchiveToggle}
              activeChatRequest={activeChatRequest}
              setActiveChatRequest={setActiveChatRequest}
              isConversationUnread={isConversationUnread}
              requestsLoading={requestsLoading}
              currentUserUid={currentUserUid ?? null}
              currentUser={currentUser ?? null}
              organisationProfile={organisationProfile ?? null}
              showToast={showToast}
            />
          ) : activeSection === 'partner-requests' ? (
            <PartnerRequestsSection
              incomingRequests={incomingRequests}
              sentRequests={sentRequests}
              requestsTab={requestsTab}
              setRequestsTab={setRequestsTab}
              requestsLoading={requestsLoading}
              currentUserUid={currentUserUid ?? null}
              onSelectListing={onSelectListing}
              setActiveChatRequest={setActiveChatRequest}
              setActiveSection={setActiveSection}
              setIncomingRequests={setIncomingRequests}
              setSentRequests={setSentRequests}
              showToast={showToast}
            />
          ) : activeSection === 'favourites' ? (
            <FavouritesSection
              listings={listings}
              favouriteIds={favouriteIds}
              currentUserUid={currentUserUid ?? null}
              currentUserProfile={organisationProfile ?? null}
              sentListingIds={dashSentListingIds}
              onSelectListing={onSelectListing}
              onToggleFavourite={handleDashToggleFavourite}
              onInterestSent={handleDashInterestSent}
            />
          ) : activeSection === 'settings' ? (
            <SettingsPanel
              currentUserUid={currentUserUid || ''}
              onAccountDeleted={() => { onSignOut(); onNavigate('home'); }}
            />
          ) : activeSection === 'profile' ? (
            <ProfileSection
              organisationProfile={organisationProfile}
              onUpdateProfile={onUpdateProfile}
              showToast={showToast}
            />
          ) : activeSection === 'announcements' ? (
            <AnnouncementsSection visibleAnnouncements={visibleAnnouncements} onDismiss={handleDismiss} />
          ) : (
            <ListingsSection
              listings={listings}
              filteredListings={filteredListings}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabCounts={tabCounts}
              currentUser={currentUser}
              initials={initials}
              onSignOut={onSignOut}
              onNavigate={onNavigate}
              setActiveSection={setActiveSection}
              onEditListing={onEditListing}
              onDeleteListing={onDeleteListing}
            />
          )}

        </main>
      </div>

      {/* 4. TOAST BANNER NOTIFICATION (Coming soon or dynamic action response status) */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start space-x-3.5 animate-fade-in">
          <div className="p-1.5 bg-brand-primary/10 rounded-lg shrink-0">
            <PartnerMatchLogo size={20} />
          </div>
          <div className="flex-1 space-y-0.5">
            <p className="text-sm font-bold">Feedback Info</p>
            <p className="text-xs text-slate-400 leading-relaxed">{toast}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-450 hover:text-white transition-colors cursor-pointer" title="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
