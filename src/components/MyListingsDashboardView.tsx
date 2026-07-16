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
  Pencil, 
  Trash2, 
  CheckCircle, 
  Check,
  X,
  AlertCircle,
  Megaphone,
  Upload,
  Heart,
  Handshake,
  Mail,
  Clock,
  CheckCheck,
  XCircle,
  MessageSquare,
  Send,
  ArrowLeft
} from 'lucide-react';
import { Listing, OrganisationProfile, OrganisationType, FeaturedProject } from '../types';
import { COUNTRIES, ORGANISATION_TYPES, LANGUAGES, ERASMUS_SECTORS, THEMATIC_AREAS } from '../data';
import { subscribeToAnnouncements, saveDismissedAnnouncements, getDismissedAnnouncements, getFavourites, getIncomingRequests, getSentRequests, updateRequestStatus, hideRequestForUser, withdrawPartnerRequest, sendMessage, subscribeToMessages, markConversationRead } from '../services/firebase/firestore';
import { PartnerRequest } from '../types/partnerRequest';
import { Message } from '../types/message';
import { ProfileWithUid } from '../hooks/useProfiles';
import FavouriteButton from './FavouriteButton';
import { resendVerificationEmail } from '../services/firebase/auth';
import { stripHtml, formatDate } from '../utils';
import FeaturedProjectsEditor from './FeaturedProjectsEditor';
import MultiSelectDropdown from './MultiSelectDropdown';
import RichTextEditor from './RichTextEditor';
import AnnouncementsSection from './dashboard/AnnouncementsSection';
import FavouritesSection from './dashboard/FavouritesSection';
import ProfileSection from './dashboard/ProfileSection';

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
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSending, setChatSending] = useState(false);

  const conversations = [...incomingRequests, ...sentRequests]
    .filter(r => r.status === 'accepted')
    .filter((r, idx, arr) => arr.findIndex(x => x.id === r.id) === idx)
    .sort((a, b) => (b.lastMessageAt || b.createdAt).localeCompare(a.lastMessageAt || a.createdAt));

  const isConversationUnread = (req: PartnerRequest): boolean => {
    if (!req.lastMessageAt || !currentUserUid) return false;
    const myLastRead = req.readStatus?.[currentUserUid];
    return !myLastRead || req.lastMessageAt > myLastRead;
  };

  const unreadCount = conversations.filter(isConversationUnread).length;

  const getOtherParty = (req: PartnerRequest) => {
    const iAmSender = req.fromOrgUid === currentUserUid;
    return {
      uid: iAmSender ? req.toOrgUid : req.fromOrgUid,
      name: iAmSender ? req.toOrgName : req.fromOrgName,
      logo: iAmSender ? req.toOrgLogo : req.fromOrgLogo,
    };
  };

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
    if (activeChatRequest && currentUserUid) {
      const unsubscribe = subscribeToMessages(activeChatRequest.id, currentUserUid, setChatMessages);
      return () => unsubscribe();
    } else {
      setChatMessages([]);
    }
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




  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-800">Messages</h2>
                <p className="text-sm text-slate-500 mt-1">Your conversations with accepted partners.</p>
              </div>
              {requestsLoading ? (
                <div className="text-center py-12 text-slate-400 text-sm font-medium">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <MessageSquare className="w-10 h-10 text-slate-200 mx-auto" />
                  <p className="text-sm font-semibold text-slate-400">No conversations yet</p>
                  <p className="text-xs text-slate-400">Once a partner request is accepted, you can message each other here.</p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-4 bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ minHeight: '520px' }}>

                  {/* LEFT: conversation list */}
                  <div className={`md:w-72 md:border-r border-slate-100 md:shrink-0 overflow-y-auto ${activeChatRequest ? 'hidden md:block' : 'block'}`}>
                    <div className="divide-y divide-slate-100">
                      {conversations.map(req => {
                        const other = getOtherParty(req);
                        const isSelected = activeChatRequest?.id === req.id;
                        return (
                          <div
                            key={req.id}
                            onClick={() => setActiveChatRequest(req)}
                            className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border-l-2 border-brand-primary' : 'hover:bg-slate-50 border-l-2 border-transparent'}`}
                          >
                            {other.logo ? (
                              <img src={other.logo} alt={other.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-xl object-contain border border-slate-100 bg-white p-1 shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                                {other.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-bold text-slate-800 truncate">{other.name}</p>
                                {isConversationUnread(req) && !isSelected && (
                                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 font-medium truncate">Re: {req.listingTitle}</p>
                              <p className={`text-xs truncate mt-0.5 ${isConversationUnread(req) && !isSelected ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>{req.lastMessageText || 'No messages yet — say hello'}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT: active chat pane */}
                  <div className={`flex-1 flex-col min-w-0 ${activeChatRequest ? 'flex' : 'hidden md:flex'}`}>
                    {!activeChatRequest ? (
                      <div className="flex-1 flex items-center justify-center text-center px-6 py-16">
                        <div className="space-y-2">
                          <MessageSquare className="w-10 h-10 text-slate-200 mx-auto" />
                          <p className="text-sm font-semibold text-slate-400">Select a conversation</p>
                        </div>
                      </div>
                    ) : (() => {
                      const other = getOtherParty(activeChatRequest);
                      return (
                        <>
                          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 shrink-0">
                            <button onClick={() => setActiveChatRequest(null)} className="md:hidden p-1.5 -ml-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer shrink-0">
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                            {other.logo ? (
                              <img src={other.logo} alt={other.name} referrerPolicy="no-referrer" className="w-9 h-9 rounded-lg object-contain border border-slate-100 bg-white p-0.5 shrink-0" />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-xs shrink-0">
                                {other.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate">{other.name}</p>
                              <p className="text-[11px] text-slate-400 font-medium truncate">Re: {activeChatRequest.listingTitle}</p>
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 bg-slate-50 min-h-[300px]">
                            {chatMessages.length === 0 ? (
                              <p className="text-center text-xs text-slate-400 font-medium py-8">No messages yet. Say hello to start the conversation.</p>
                            ) : (
                              chatMessages.map(msg => {
                                const mine = msg.fromUid === currentUserUid;
                                const avatarLogo = mine ? organisationProfile?.logoUrl : other.logo;
                                const avatarName = mine ? (organisationProfile?.organisationName || currentUser || '?') : other.name;
                                const avatar = avatarLogo ? (
                                  <img src={avatarLogo} alt={avatarName} referrerPolicy="no-referrer" className="w-7 h-7 rounded-lg object-contain border border-slate-100 bg-white p-0.5 shrink-0" />
                                ) : (
                                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-[10px] shrink-0">
                                    {(avatarName || '?').charAt(0).toUpperCase()}
                                  </div>
                                );
                                return (
                                  <div key={msg.id} className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                                    {!mine && avatar}
                                    <div className={`max-w-[70%] px-3.5 py-2 rounded-2xl ${mine ? 'bg-brand-primary text-white rounded-br-md' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-md'}`}>
                                      <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                                    </div>
                                    {mine && avatar}
                                  </div>
                                );
                              })
                            )}
                          </div>

                          <div className="flex items-center gap-2 px-3 py-3 border-t border-slate-100 shrink-0">
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !chatSending && chatInput.trim() && currentUserUid) {
                                  e.preventDefault();
                                  const other2 = getOtherParty(activeChatRequest);
                                  const text = chatInput.trim();
                                  setChatInput('');
                                  setChatSending(true);
                                  sendMessage(activeChatRequest.id, currentUserUid, other2.uid, text)
                                    .catch(() => showToast('Failed to send message.'))
                                    .finally(() => setChatSending(false));
                                }
                              }}
                              placeholder="Write a message"
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all"
                            />
                            <button
                              disabled={chatSending || !chatInput.trim()}
                              onClick={() => {
                                if (!chatInput.trim() || !currentUserUid) return;
                                const other2 = getOtherParty(activeChatRequest);
                                const text = chatInput.trim();
                                setChatInput('');
                                setChatSending(true);
                                sendMessage(activeChatRequest.id, currentUserUid, other2.uid, text)
                                  .catch(() => showToast('Failed to send message.'))
                                  .finally(() => setChatSending(false));
                              }}
                              className="w-10 h-10 flex items-center justify-center bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all cursor-pointer shrink-0"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                </div>
              )}
            </div>
          ) : activeSection === 'partner-requests' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-800">Partner Requests</h2>
                <p className="text-sm text-slate-500 mt-1">Manage incoming interest and track requests you've sent.</p>
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setRequestsTab('received')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${requestsTab === 'received' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Received {incomingRequests.length > 0 && `(${incomingRequests.length})`}
                </button>
                <button
                  onClick={() => setRequestsTab('sent')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${requestsTab === 'sent' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sent {sentRequests.length > 0 && `(${sentRequests.length})`}
                </button>
              </div>

              {requestsLoading ? (
                <div className="text-center py-12 text-slate-400 text-sm font-medium">Loading requests...</div>
              ) : requestsTab === 'received' ? (
                incomingRequests.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <Handshake className="w-10 h-10 text-slate-200 mx-auto" />
                    <p className="text-sm font-semibold text-slate-400">No incoming requests yet</p>
                    <p className="text-xs text-slate-400">When organisations express interest in your listings, they'll appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {incomingRequests.map(req => (
                      <div key={req.id} onClick={() => onSelectListing?.(req.listingId)} className={`bg-white rounded-2xl border p-5 space-y-4 transition-all cursor-pointer hover:border-blue-300 hover:shadow-md ${req.status === 'pending' ? 'border-blue-100 shadow-sm' : 'border-slate-100'}`}>
                        <div className="flex items-center gap-3">
                          {req.fromOrgLogo ? (
                            <img src={req.fromOrgLogo} alt={req.fromOrgName} className="w-11 h-11 rounded-xl object-contain border border-slate-100 bg-white p-1 shrink-0" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                              {req.fromOrgName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-slate-800 truncate">{req.fromOrgName}</span>
                              <span className="text-xs text-slate-400 font-medium shrink-0">· {req.fromOrgCountry}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              interested in <span className="text-brand-primary font-bold">{req.listingTitle}</span>
                            </p>
                          </div>
                          <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ${
                            req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {req.status}
                          </span>
                        </div>

                        {req.message && (
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Their message</p>
                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-xl px-4 py-3">{req.message}</p>
                          </div>
                        )}

                        {req.status === 'accepted' && (
                          <div className="space-y-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveChatRequest(req); setActiveSection('messages'); }}
                              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              Open chat
                            </button>
                          </div>
                        )}

                        {req.status === 'pending' && (
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await updateRequestStatus(req.id, 'accepted');
                                setIncomingRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'accepted' } : r));
                                showToast('Request accepted! Contact details revealed.');
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              Accept
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await updateRequestStatus(req.id, 'declined');
                                setIncomingRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'declined' } : r));
                                showToast('Request declined.');
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Decline
                            </button>
                          </div>
                        )}

                        {req.status !== 'pending' && (
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!currentUserUid) return;
                                await hideRequestForUser(req.id, currentUserUid);
                                setIncomingRequests(prev => prev.filter(r => r.id !== req.id));
                                showToast('Request cleared.');
                              }}
                              className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              ) : (
                sentRequests.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <Clock className="w-10 h-10 text-slate-200 mx-auto" />
                    <p className="text-sm font-semibold text-slate-400">No sent requests yet</p>
                    <p className="text-xs text-slate-400">Express interest in partner calls to see them here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sentRequests.map(req => (
                      <div key={req.id} onClick={() => onSelectListing?.(req.listingId)} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          {req.toOrgLogo ? (
                            <img src={req.toOrgLogo} alt={req.toOrgName} className="w-11 h-11 rounded-xl object-contain border border-slate-100 bg-white p-1 shrink-0" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                              {req.toOrgName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-slate-800 truncate">{req.toOrgName}</span>
                              {req.toOrgCountry && <span className="text-xs text-slate-400 font-medium shrink-0">· {req.toOrgCountry}</span>}
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              you applied to <span className="text-brand-primary font-bold">{req.listingTitle}</span>
                            </p>
                          </div>
                          <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ${
                            req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {req.status}
                          </span>
                        </div>

                        {req.message && (
                          <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 italic">"{req.message}"</p>
                        )}

                        {req.status === 'accepted' && (
                          <div className="space-y-2">
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 space-y-1">
                              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5" /> Partnership Interest Accepted
                              </p>
                              <p className="text-[10px] text-emerald-600 font-medium">Message them using the chat below.</p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveChatRequest(req); setActiveSection('messages'); }}
                              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              Open chat
                            </button>
                          </div>
                        )}

                        {req.status === 'pending' && (
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await withdrawPartnerRequest(req.id);
                                setSentRequests(prev => prev.filter(r => r.id !== req.id));
                                showToast('Interest withdrawn.');
                              }}
                              className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              Withdraw Interest
                            </button>
                          </div>
                        )}

                        {req.status !== 'pending' && (
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!currentUserUid) return;
                                await hideRequestForUser(req.id, currentUserUid);
                                setSentRequests(prev => prev.filter(r => r.id !== req.id));
                                showToast('Request cleared.');
                              }}
                              className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
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
            <>
              {/* Mobile Profile bar wrapper (rendered on mobile since desktop sidebar is hidden) */}
          <div className="block md:hidden bg-white rounded-[20px] p-5 border border-blue-50/80 shadow-xs space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                {initials}
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-800 text-xs">{currentUser}</h3>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Erasmus+ Member</p>
              </div>
              <button
                onClick={onSignOut}
                className="p-2 text-slate-400 hover:text-red-500 rounded-full bg-slate-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('submit')}
                className="flex-1 inline-flex items-center justify-center space-x-1 bg-brand-primary text-white py-2.5 rounded-xl font-bold text-[11px]"
              >
                <PlusCircle className="w-3.5 h-3.5 text-brand-accent" />
                <span>Submit New</span>
              </button>
              <button
                onClick={() => setActiveSection('profile')}
                className="flex-1 border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 py-2.5 rounded-xl font-bold text-[11px]"
              >
                Profile Settings
              </button>
            </div>
          </div>

          {/* Action Navigation Header: Tabs & Search query controls */}
          <div className="bg-white rounded-[24px] border border-blue-50/80 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-3">
              
              {/* Tab options rows */}
              <div className="flex items-center space-x-1.5 overflow-x-auto scroller-hide bg-slate-50 p-1 rounded-xl">
                {(['All', 'Active', 'Pending', 'Expired', 'Rejected', 'Partnerships'] as const).map(tab => {
                  const isActive = activeTab === tab;
                  const itemCounter = tabCounts[tab];
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center space-x-2 ${
                        isActive 
                          ? 'bg-white text-brand-primary shadow-xs font-extrabold' 
                          : 'text-slate-500 hover:text-slate-850'
                      }`}
                    >
                      <span>{tab}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-50 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                        {itemCounter}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* LISTINGS DISPLAY GRID or TABLE */}
            {filteredListings.length === 0 ? (
              /* Empty state section per tab requirement */
              <div className="text-center py-16 px-6 max-w-md mx-auto space-y-4 animate-fade-in">
                <div className="mx-auto w-14 h-14 bg-indigo-50 text-brand-primary rounded-full flex items-center justify-center shadow-xs">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-800">No Listings Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-semibold">
                    We couldn't find any {activeTab !== 'All' ? activeTab.toLowerCase() : ''} listings matching your search. Try adjusting your query or publish a new one.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('submit')}
                  className="px-5 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer inline-flex items-center space-x-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Your First Listing</span>
                </button>
              </div>
            ) : (
              /* Desktop and tablet table layout (hidden on mobile, mapped into rows) */
              <div className="overflow-x-auto">
                
                {/* Desktop and Tablet table */}
                <table className="w-full text-left border-collapse hidden sm:table">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 pl-2">Organisation</th>
                      <th className="pb-3 text-center">Deadline</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListings.map(listing => {
                      const statusVal = listing.status || 'active';
                      return (
                        <tr 
                          key={listing.id}
                          className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors group"
                        >
                          {/* Organisation metadata col */}
                          <td className="py-4 pl-2">
                            <div className="flex items-center space-x-3.5">
                              {listing.submitterProfile?.logoUrl ? (
                                <img 
                                  src={listing.submitterProfile.logoUrl} 
                                  className="w-12 h-12 object-contain rounded-xl shrink-0 border border-slate-100 shadow-xs bg-white p-1" 
                                  alt={listing.name} 
                                  referrerPolicy="no-referrer" 
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl shrink-0 border border-slate-100 shadow-xs bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-sm">
                                  {listing.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="space-y-0.5">
                                {listing.title && (
                                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 group-hover:text-brand-primary transition-colors">
                                    {listing.title}
                                  </h4>
                                )}
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1">
                                  {listing.name}
                                </p>
                                <p className="text-[11px] text-slate-500 font-medium flex items-center space-x-1">
                                  <span>{listing.countryFlag}</span>
                                  <span>{listing.submitterProfile?.city || (listing as any).city ? `${listing.submitterProfile?.city || (listing as any).city}, ` : ''}{listing.country}</span>
                                </p>
                              </div>
                            </div>
                            {listing.status === 'rejected' && listing.rejectionReason && (
                              <div className="mt-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 max-w-lg">
                                <p className="text-[10px] font-bold text-red-700 uppercase tracking-wide mb-0.5">Rejection Reason</p>
                                <p className="text-xs text-red-600 font-medium leading-relaxed">{listing.rejectionReason}</p>
                              </div>
                            )}
                          </td>

                          {/* Deadline Date col */}
                          <td className="py-4 text-center font-bold text-xs text-slate-700">
                            {formatDate(listing.partnerSearchDeadline)}
                          </td>

                          {/* Status pill col */}
                          <td className="py-4 text-center">
                            {statusVal === 'active' && (
                              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                Active
                              </span>
                            )}
                            {statusVal === 'pending' && (
                              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                Pending
                              </span>
                            )}
                            {statusVal === 'expired' && (
                              <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                Expired
                              </span>
                            )}
                            {statusVal === 'rejected' && (
                              <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                Rejected
                              </span>
                            )}
                            {statusVal === 'partnership-found' && (
                              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                Partnership Found
                              </span>
                            )}
                          </td>

                          {/* Actions button col */}
                          <td className="py-4 text-right pr-2 relative">
                            <div className="inline-flex items-center space-x-2.5">
                              {/* Edit Button */}
                              <button
                                onClick={() => onEditListing(listing.id)}
                                className="p-2 text-slate-500 hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Edit Proposal"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              {/* Delete button */}
                              <button
                                onClick={() => setConfirmDeleteId(listing.id)}
                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Delete Proposal"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>


                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Mobile Cards listing format (hidden on larger devices) */}
                <div className="block sm:hidden space-y-4">
                  {filteredListings.map(listing => {
                    const statusVal = listing.status || 'active';
                    return (
                      <div 
                        key={listing.id}
                        className="p-4 bg-slate-50/70 rounded-2xl border border-slate-150/40 space-y-3.5 relative"
                      >
                        <div className="flex items-start space-x-3">
                          {listing.submitterProfile?.logoUrl ? (
                            <img 
                              src={listing.submitterProfile.logoUrl} 
                              className="w-11 h-11 object-contain rounded-xl border border-slate-100 bg-white p-1" 
                              alt={listing.name} 
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl border border-slate-100 bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-sm">
                              {listing.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            {listing.title && (
                              <h4 className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug">
                                {listing.title}
                              </h4>
                            )}
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {listing.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5 flex items-center space-x-1">
                              <span>{listing.countryFlag}</span>
                              <span>{listing.submitterProfile?.city || (listing as any).city ? `${listing.submitterProfile?.city || (listing as any).city}, ` : ''}{listing.country}</span>
                            </p>
                          </div>
                        </div>

                        {listing.status === 'rejected' && listing.rejectionReason && (
                          <div className="mt-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                            <p className="text-[10px] font-bold text-red-700 uppercase tracking-wide mb-0.5">Rejection Reason</p>
                            <p className="text-xs text-red-600 font-medium leading-relaxed">{listing.rejectionReason}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-150/40">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Deadline</span>
                            <span className="font-bold text-slate-700 text-[11px]">
                              {formatDate(listing.partnerSearchDeadline)}
                            </span>
                          </div>

                          <div>
                            <span className="text-[9px] text-slate-400 font-bold uppercase block text-right tracking-wider mb-0.5">Status</span>
                            {statusVal === 'active' && (
                              <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Active
                              </span>
                            )}
                            {statusVal === 'pending' && (
                              <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Pending
                              </span>
                            )}
                            {statusVal === 'expired' && (
                              <span className="bg-red-100 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Expired
                              </span>
                            )}
                            {statusVal === 'rejected' && (
                              <span className="bg-red-50 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Rejected
                              </span>
                            )}
                            {statusVal === 'partnership-found' && (
                              <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Found
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons list in mobile context */}
                        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-150/40">
                          <button
                            onClick={() => onEditListing(listing.id)}
                            className="p-1 px-2 border border-slate-200 rounded-lg text-slate-600 font-semibold text-[10px] hover:bg-slate-100 flex items-center space-x-1"
                          >
                            <Pencil className="w-3 h-3 text-slate-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(listing.id)}
                            className="p-1 px-2 border border-slate-200 rounded-lg text-red-600 font-semibold text-[10px] hover:bg-red-50 flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3 text-slate-400" />
                            <span>Delete</span>
                          </button>
                          

                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            )}
          </div>
          </>
          )}

        </main>
      </div>

      {/* 3. DELETION CONFIRMATION MODAL PROMPT */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-slide-in">
            <div className="p-3 bg-red-50 text-red-600 w-12 h-12 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                Are you sure you want to delete this listing?
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
                Are you sure you want to delete this listing? This cannot be undone.
              </p>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onDeleteListing(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
