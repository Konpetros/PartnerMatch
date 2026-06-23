/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle, 
  X,
  AlertCircle,
  Megaphone,
  Upload,
  Heart
} from 'lucide-react';
import { Listing, OrganisationProfile, OrganisationType } from '../types';
import { COUNTRIES, ORGANISATION_TYPES, LANGUAGES, ERASMUS_SECTORS } from '../data';
import { subscribeToAnnouncements, saveDismissedAnnouncements, getDismissedAnnouncements, getFavourites } from '../services/firebase/firestore';
import FavouriteButton from './FavouriteButton';

interface MyListingsViewProps {
  onOpenSignIn: () => void;
  onNavigate: (view: string) => void;
  currentUser: string | null;
  currentUserUid?: string | null;
  listings: Listing[];
  onDeleteListing: (id: string) => void;
  onUpdateListingStatus: (id: string, status: 'active' | 'pending' | 'expired' | 'partnership-found') => void;
  onSignOut: () => void;
  initialSection?: 'listings' | 'settings' | 'announcements' | 'profile' | 'favourites';
  organisationProfile?: OrganisationProfile | null;
  onUpdateProfile?: (profile: OrganisationProfile) => void;
  onSelectListing?: (id: string) => void;
}

export default function MyListingsDashboardView({ 
  onOpenSignIn, 
  onNavigate, 
  currentUser, 
  currentUserUid,
  listings, 
  onDeleteListing, 
  onUpdateListingStatus, 
  onSignOut,
  initialSection = 'listings',
  organisationProfile,
  onUpdateProfile,
  onSelectListing
}: MyListingsViewProps) {
  // Local state for toast notification
  const [toast, setToast] = useState<string | null>(null);
  
  // Tab control state
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Pending' | 'Expired' | 'Partnership Found'>('All');
  
  // Search bar query state
  const [searchQuery, setSearchQuery] = useState('');

  // Active section to toggle between 'listings', 'settings' and 'announcements'
  const [activeSection, setActiveSection] = useState<'listings' | 'settings' | 'announcements' | 'profile' | 'favourites'>(initialSection);
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    if (currentUserUid) {
      getFavourites(currentUserUid).then(setFavouriteIds);
    }
  }, [currentUserUid]);

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

  // Profile form state
  const [profileName, setProfileName] = useState(organisationProfile?.organisationName || '');
  const [profileType, setProfileType] = useState<OrganisationType>(organisationProfile?.organisationType || 'NGO');
  const [profileCountry, setProfileCountry] = useState(organisationProfile?.country || '');
  const [profileCity, setProfileCity] = useState(organisationProfile?.city || '');
  const [profileWebsite, setProfileWebsite] = useState(organisationProfile?.website || '');
  const [profileFoundedYear, setProfileFoundedYear] = useState(organisationProfile?.foundedYear || '');
  const [profileOid, setProfileOid] = useState(organisationProfile?.oid || '');
  const [profileExperience, setProfileExperience] = useState(organisationProfile?.experienceLevel || 'First-timer');
  const [profilePreviousProjects, setProfilePreviousProjects] = useState(organisationProfile?.previousProjects || '0');
  const [profileLanguages, setProfileLanguages] = useState<string[]>(organisationProfile?.languagesSpoken || []);
  const [profileContactEmail, setProfileContactEmail] = useState(organisationProfile?.contactEmail || '');
  const [profileSector, setProfileSector] = useState(organisationProfile?.sector || 'Youth');
  const [profileDescription, setProfileDescription] = useState(organisationProfile?.description || '');
  const [profileLogoPreview, setProfileLogoPreview] = useState<string | null>(organisationProfile?.logoUrl || null);
  const [profileFormErrors, setProfileFormErrors] = useState<string[]>([]);
  const profileLogoInputRef = useRef<HTMLInputElement | null>(null);

  const handleProfileLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleProfileLanguageToggle = (lang: string) => {
    setProfileLanguages((prev) =>
      prev.includes(lang) ? prev.filter((x) => x !== lang) : [...prev, lang]
    );
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!profileName.trim()) errors.push('Organisation Name is required.');
    if (!profileCountry) errors.push('Please select a country.');
    if (!profileCity.trim()) errors.push('City is required.');
    if (!profileContactEmail.trim() || !profileContactEmail.includes('@')) errors.push('A valid Contact Email is required.');
    if (profileLanguages.length === 0) errors.push('Please select at least one language.');
    if (!profileSector) errors.push('Please select your Erasmus+ sector.');
    if (!profileDescription.trim()) errors.push('Please add a description of your organisation.');
    if (errors.length > 0) { setProfileFormErrors(errors); return; }
    setProfileFormErrors([]);
    const selectedCountryObj = COUNTRIES.find((c) => c.name === profileCountry);
    const flag = selectedCountryObj ? selectedCountryObj.flag : '🇪🇺';
    const updatedProfile: OrganisationProfile = {
      organisationName: profileName.trim(),
      organisationType: profileType,
      country: profileCountry,
      countryFlag: flag,
      city: profileCity.trim(),
      website: profileWebsite.trim(),
      foundedYear: profileFoundedYear.trim(),
      oid: profileOid.trim(),
      experienceLevel: profileExperience,
      previousProjects: profilePreviousProjects,
      languagesSpoken: profileLanguages,
      contactEmail: profileContactEmail.trim(),
      sector: profileSector,
      logoUrl: profileLogoPreview || '',
      description: profileDescription.trim(),
    };
    if (onUpdateProfile) onUpdateProfile(updatedProfile);
    showToast('Profile updated successfully!');
  };


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
          {activeSection === 'favourites' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-800">Saved Listings</h2>
                <p className="text-sm text-slate-500 mt-1">Partner calls you've saved for later.</p>
              </div>
              {favouriteIds.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <Heart className="w-10 h-10 text-slate-200 mx-auto" />
                  <p className="text-sm font-semibold text-slate-400">No saved listings yet</p>
                  <p className="text-xs text-slate-400">Press the heart icon on any listing to save it here.</p>
                </div>
              ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {listings
                    .filter(l => favouriteIds.includes(l.id) && (l.status === 'active' || !l.status))
                    .map(listing => {
                      const flag = listing.countryFlag || '🇪🇺';
                      return (
                        <div
                          key={listing.id}
                          onClick={() => onSelectListing && onSelectListing(listing.id)}
                          className="group bg-white rounded-[20px] border border-blue-50/50 hover:border-blue-300 hover:shadow-md card-shadow flex flex-col cursor-pointer"
                        >
                          <div className="p-5 flex-1 flex flex-col space-y-3.5">
                            <div className="flex items-center gap-3">
                              {listing.submitterProfile?.logoUrl ? (
                                <img
                                  src={listing.submitterProfile.logoUrl}
                                  alt={`${listing.name} logo`}
                                  referrerPolicy="no-referrer"
                                  className="w-12 h-12 rounded-lg object-contain border border-slate-100 bg-white p-1.5 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-base shrink-0">
                                  {listing.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  {listing.name}
                                </span>
                                <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1 mt-0.5">
                                  <span>{flag}</span>
                                  <span className="truncate">{listing.country}{listing.submitterProfile?.city ? `, ${listing.submitterProfile.city}` : ''}</span>
                                </span>
                              </div>
                              <FavouriteButton listingId={listing.id} currentUserUid={currentUserUid ?? null} />
                            </div>

                            {listing.title && (
                              <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">
                                {listing.title}
                              </h3>
                            )}

                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 flex-1">
                              {listing.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
                            </p>

                            <div className="flex flex-col">
                              {listing.keyActions.length > 0 && (
                                <div className="flex items-center gap-2 py-1.5">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[68px] shrink-0">Key Action</span>
                                  <div className="flex flex-wrap gap-1">
                                    {listing.keyActions.map((action) => (
                                      <span key={action} className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">{action}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {listing.projectRole && (
                                <div className="border-t border-slate-100 flex items-center gap-2 py-1.5">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[68px] shrink-0">Role</span>
                                  <div className="flex flex-wrap gap-1">
                                    {(listing.projectRole === 'Coordinator' || listing.projectRole === 'Both') && (
                                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-violet-100 text-violet-800">Coordinator</span>
                                    )}
                                    {(listing.projectRole === 'Partner' || listing.projectRole === 'Both') && (
                                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-violet-100 text-violet-800">Partner</span>
                                    )}
                                  </div>
                                </div>
                              )}
                              {listing.sectors && listing.sectors.length > 0 && (
                                <div className="border-t border-slate-100 flex items-center gap-2 py-1.5">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[68px] shrink-0">Sector</span>
                                  <div className="flex flex-wrap gap-1">
                                    {listing.sectors.map((sector) => (
                                      <span key={sector} className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">{sector}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {listing.partnerSearchDeadline && (
                                <div className="border-t border-slate-100 flex items-center gap-2 py-1.5">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[68px] shrink-0">Deadline</span>
                                  <span className="text-[9px] font-extrabold bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-1 rounded-full">
                                    {formatDate(listing.partnerSearchDeadline)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {listing.thematicAreas && listing.thematicAreas.length > 0 && (
                              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                                {listing.thematicAreas.slice(0, 2).map((area) => (
                                  <span key={area} className="text-[9.5px] font-bold text-brand-primary/80 bg-blue-50/40 px-2 py-0.5 rounded-full">
                                    #{area}
                                  </span>
                                ))}
                                {listing.thematicAreas.length > 2 && (
                                  <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">
                                    +{listing.thematicAreas.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          ) : activeSection === 'settings' ? (
            <SettingsPanel
              currentUserUid={currentUser || ''}
              onAccountDeleted={() => { onSignOut(); onNavigate('home'); }}
            />
          ) : activeSection === 'profile' ? (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-black text-slate-800">My Organisation</h2>
                <p className="text-xs text-slate-500 mt-1">Update your organisation details visible to potential partners.</p>
              </div>
              <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-sm">
                {profileFormErrors.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs space-y-1">
                    <ul className="list-disc pl-4 space-y-1">
                      {profileFormErrors.map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                  </div>
                )}

                {/* Logo */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Organisation Logo <span className="text-slate-400 font-normal normal-case">(optional)</span></label>
                  <div className="flex items-center space-x-4">
                    {profileLogoPreview ? (
                      <img src={profileLogoPreview} alt="Logo" className="w-16 h-16 rounded-xl object-contain border border-slate-200 p-1" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                        <Upload className="w-6 h-6" />
                      </div>
                    )}
                    <button type="button" onClick={() => profileLogoInputRef.current?.click()} className="text-xs font-bold text-brand-primary hover:underline cursor-pointer">
                      {profileLogoPreview ? 'Change Logo' : 'Upload Logo'}
                    </button>
                    <input ref={profileLogoInputRef} type="file" accept="image/*" onChange={handleProfileLogoChange} className="hidden" />
                  </div>
                </div>

                {/* Organisation Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Organisation Name *</label>
                  <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all" />
                </div>

                {/* Organisation Type */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Organisation Type *</label>
                  <select value={profileType} onChange={(e) => setProfileType(e.target.value as OrganisationType)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all">
                    {ORGANISATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Country & City */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Country *</label>
                    <select value={profileCountry} onChange={(e) => setProfileCountry(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all">
                      <option value="">Select country</option>
                      {COUNTRIES.map((c) => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">City *</label>
                    <input type="text" value={profileCity} onChange={(e) => setProfileCity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all" />
                  </div>
                </div>

                {/* Website & OID */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Website</label>
                    <input type="text" value={profileWebsite} onChange={(e) => setProfileWebsite(e.target.value)} placeholder="https://" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">OID</label>
                    <input type="text" value={profileOid} onChange={(e) => setProfileOid(e.target.value)} placeholder="E10012345" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all" />
                  </div>
                </div>

                {/* Contact Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Contact Email *</label>
                  <input type="email" value={profileContactEmail} onChange={(e) => setProfileContactEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all" />
                </div>

                {/* Sector */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Erasmus+ Sector *</label>
                  <select value={profileSector} onChange={(e) => setProfileSector(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all">
                    {ERASMUS_SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Languages */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Languages Spoken *</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => (
                      <button key={lang} type="button" onClick={() => handleProfileLanguageToggle(lang)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${profileLanguages.includes(lang) ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">About Your Organisation *</label>
                  <textarea value={profileDescription} onChange={(e) => setProfileDescription(e.target.value)} rows={5} maxLength={800} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all resize-none" />
                  <p className="text-[10px] text-slate-400 text-right">{profileDescription.length}/800</p>
                </div>

                <button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-3 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-sm">
                  Save Profile
                </button>
              </form>
            </div>
          ) : activeSection === 'announcements' ? (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-lg font-black text-slate-800">Announcements</h2>
                <p className="text-xs text-slate-500 mt-1">Latest updates and news from PartnerMatch.</p>
              </div>
              {visibleAnnouncements.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center space-y-3">
                  <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-500">No announcements</p>
                  <p className="text-xs text-slate-400">Check back later for updates from PartnerMatch.</p>
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
