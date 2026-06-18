/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import SettingsPanel from './SettingsPanel';
import { 
  Lock, 
  Sparkles, 
  LogIn, 
  LayoutDashboard, 
  PlusCircle, 
  ClipboardList, 
  User, 
  Settings, 
  LogOut, 
  Search, 
  Pencil, 
  Trash2, 
  MoreVertical, 
  CheckCircle, 
  X,
  AlertCircle,
  Megaphone
} from 'lucide-react';
import { Listing } from '../types';
import { subscribeToAnnouncements, saveDismissedAnnouncements, getDismissedAnnouncements } from '../services/firebase/firestore';

interface MyListingsViewProps {
  onOpenSignIn: () => void;
  onNavigate: (view: string) => void;
  currentUser: string | null;
  listings: Listing[];
  onDeleteListing: (id: string) => void;
  onUpdateListingStatus: (id: string, status: 'active' | 'pending' | 'expired' | 'partnership-found') => void;
  onSignOut: () => void;
  initialSection?: 'listings' | 'settings' | 'announcements';
}

export default function MyListingsDashboardView({ 
  onOpenSignIn, 
  onNavigate, 
  currentUser, 
  listings, 
  onDeleteListing, 
  onUpdateListingStatus, 
  onSignOut,
  initialSection = 'listings'
}: MyListingsViewProps) {
  // Local state for toast notification
  const [toast, setToast] = useState<string | null>(null);
  
  // Tab control state
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Pending' | 'Expired' | 'Partnership Found'>('All');
  
  // Search bar query state
  const [searchQuery, setSearchQuery] = useState('');

  // Active section to toggle between 'listings', 'settings' and 'announcements'
  const [activeSection, setActiveSection] = useState<'listings' | 'settings' | 'announcements'>(initialSection);

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToAnnouncements((data) => {
      setAnnouncements(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    getDismissedAnnouncements(currentUser).then((ids) => {
      setDismissedIds(ids);
    });
  }, [currentUser]);

  const handleDismiss = async (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    if (currentUser) {
      await saveDismissedAnnouncements(currentUser, updated);
    }
  };

  const visibleAnnouncements = announcements.filter(a => !dismissedIds.includes(a.id));

  // Dropdown menus and deletion states
  const [menuOpenListingId, setMenuOpenListingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    const id = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
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

  // Compute stats for listing items
  const allCount = listings.length;
  const activeCount = listings.filter(l => l.status === 'active' || !l.status).length; // fallback to active if not set
  const pendingCount = listings.filter(l => l.status === 'pending').length;
  const expiredCount = listings.filter(l => l.status === 'expired').length;
  const partnershipFoundCount = listings.filter(l => l.status === 'partnership-found').length;

  const tabCounts = {
    'All': allCount,
    'Active': activeCount,
    'Pending': pendingCount,
    'Expired': expiredCount,
    'Partnership Found': partnershipFoundCount
  };

  // Perform filtering
  const filteredListings = listings.filter(listing => {
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
    } else if (activeTab === 'Partnership Found') {
      matchesTab = statusVal === 'partnership-found';
    }

    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative">
      
      {/* Click-away backdrop to close open status dropdowns */}
      {menuOpenListingId && (
        <div 
          className="fixed inset-0 z-10 bg-transparent" 
          onClick={() => setMenuOpenListingId(null)} 
        />
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
              onClick={() => onNavigate('my-profile')}
              className="w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-any text-left"
            >
              <User className="w-4 h-4 shrink-0 text-slate-450" />
              <span>My Profile</span>
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
          {activeSection === 'settings' ? (
            <SettingsPanel
              currentUserUid={currentUser || ''}
              onAccountDeleted={() => { onSignOut(); onNavigate('home'); }}
            />
          ) : activeSection === 'announcements' ? (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-lg font-black text-slate-800">Announcements</h2>
                <p className="text-xs text-slate-500 mt-1">Latest updates and news from ErasmusMatch.</p>
              </div>
              {visibleAnnouncements.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center space-y-3">
                  <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-500">No announcements</p>
                  <p className="text-xs text-slate-400">Check back later for updates from ErasmusMatch.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-50 rounded-xl shrink-0">
                          <Megaphone className="w-4 h-4 text-brand-primary" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <h3 className="text-sm font-bold text-slate-800">{announcement.title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed">{announcement.message}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">
                            {new Date(announcement.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDismiss(announcement.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Dismiss"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                onClick={() => onNavigate('my-profile')}
                className="flex-1 border border-slate-205 text-slate-700 bg-slate-50 hover:bg-slate-100 py-2.5 rounded-xl font-bold text-[11px]"
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
                {(['All', 'Active', 'Pending', 'Expired', 'Partnership Found'] as const).map(tab => {
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

              {/* Search Bar Input control (Right aligned on desktop) */}
              <div className="relative w-full lg:w-64 max-w-sm">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-450 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250/70 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-705 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
                />
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
                              <img 
                                src={listing.thumbnailUrl} 
                                className="w-12 h-12 object-cover rounded-xl shrink-0 border border-slate-100 shadow-xs" 
                                alt={listing.name} 
                                referrerPolicy="no-referrer" 
                              />
                              <div className="space-y-0.5">
                                <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 group-hover:text-brand-primary transition-colors">
                                  {listing.name}
                                </h4>
                                <p className="text-[11px] text-slate-500 font-medium flex items-center space-x-1">
                                  <span>{listing.countryFlag}</span>
                                  <span>{listing.submitterProfile?.city || (listing as any).city ? `${listing.submitterProfile?.city || (listing as any).city}, ` : ''}{listing.country}</span>
                                </p>
                              </div>
                            </div>
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
                              <span className="bg-amber-105 bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                Pending
                              </span>
                            )}
                            {statusVal === 'expired' && (
                              <span className="bg-red-105 bg-red-100 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                Expired
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
                                onClick={() => showToast('Edit coming in next update')}
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

                              {/* Dropdown status toggler */}
                              <div className="relative">
                                <button
                                  onClick={() => setMenuOpenListingId(menuOpenListingId === listing.id ? null : listing.id)}
                                  className="p-2 text-slate-550 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  title="Change Status"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {/* Dropdown menu container */}
                                {menuOpenListingId === listing.id && (
                                  <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-150 rounded-xl shadow-2xl py-1.5 z-20 text-left border border-slate-100/80 animate-fade-in">
                                    <div className="px-3 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100/80 pb-1.5 mb-1 select-none">
                                      Toggle State
                                    </div>
                                    <button
                                      onClick={() => {
                                        onUpdateListingStatus(listing.id, 'active');
                                        setMenuOpenListingId(null);
                                        showToast('Status changed to Actively Seeking');
                                      }}
                                      className="w-full px-3 py-2 text-xs font-bold text-slate-755 hover:bg-slate-50/70 text-left flex items-center space-x-2"
                                    >
                                      <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 animate-pulse" />
                                      <span>Mark as Actively Seeking</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        onUpdateListingStatus(listing.id, 'partnership-found');
                                        setMenuOpenListingId(null);
                                        showToast('Status changed to Partnership Found');
                                      }}
                                      className="w-full px-3 py-2 text-xs font-bold text-slate-755 hover:bg-slate-50/70 text-left flex items-center space-x-2"
                                    >
                                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                      <span>Mark as Partnership Found</span>
                                    </button>
                                  </div>
                                )}
                              </div>
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
                          <img 
                            src={listing.thumbnailUrl} 
                            className="w-11 h-11 object-cover rounded-xl border border-slate-100" 
                            alt={listing.name} 
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug">
                              {listing.name}
                            </h4>
                            <p className="text-[10px] text-slate-505 font-semibold mt-0.5 flex items-center space-x-1">
                              <span>{listing.countryFlag}</span>
                              <span>{listing.submitterProfile?.city || (listing as any).city ? `${listing.submitterProfile?.city || (listing as any).city}, ` : ''}{listing.country}</span>
                            </p>
                          </div>
                        </div>

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
                              <span className="bg-red-100 text-red-650 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Expired
                              </span>
                            )}
                            {statusVal === 'partnership-found' && (
                              <span className="bg-blue-105 bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Found
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons list in mobile context */}
                        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-150/40">
                          <button
                            onClick={() => showToast('Edit coming in next update')}
                            className="p-1 px-2 border border-slate-200 rounded-lg text-slate-600 font-semibold text-[10px] hover:bg-slate-100 flex items-center space-x-1"
                          >
                            <Pencil className="w-3 h-3 text-slate-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(listing.id)}
                            className="p-1 px-2 border border-slate-200 rounded-lg text-red-650 text-red-650/80 font-semibold text-[10px] hover:bg-red-50 flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3 text-slate-400" />
                            <span>Delete</span>
                          </button>
                          
                          <div className="relative">
                            <button
                              onClick={() => setMenuOpenListingId(menuOpenListingId === listing.id ? null : listing.id)}
                              className="p-1 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-105 flex items-center"
                              title="More Options"
                            >
                              <MoreVertical className="w-3 h-3" />
                            </button>

                            {/* Dropdown position in mobile cards layout */}
                            {menuOpenListingId === listing.id && (
                              <div className="absolute right-0 bottom-full mb-1.5 w-48 bg-white border border-slate-150 rounded-xl shadow-2xl py-1 z-25 text-left animate-fade-in text-xs font-bold">
                                <button
                                  onClick={() => {
                                    onUpdateListingStatus(listing.id, 'active');
                                    setMenuOpenListingId(null);
                                    showToast('Status updated to Active');
                                  }}
                                  className="w-full px-3 py-2 hover:bg-slate-50 text-left flex items-center space-x-2 border-b border-slate-100"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                  <span>Actively Seeking</span>
                                </button>
                                <button
                                  onClick={() => {
                                    onUpdateListingStatus(listing.id, 'partnership-found');
                                    setMenuOpenListingId(null);
                                    showToast('Status updated to Partnership Found');
                                  }}
                                  className="w-full px-3 py-2 hover:bg-slate-50 text-left flex items-center space-x-2"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <span>Partnership Found</span>
                                </button>
                              </div>
                            )}
                          </div>
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
            <div className="p-3 bg-red-50 text-red-650 w-12 h-12 rounded-full flex items-center justify-center">
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
          <div className="p-1.5 bg-brand-primary/10 text-brand-accent rounded-lg shrink-0">
            <Sparkles className="w-5 h-5 text-brand-accent animate-pulse" />
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
