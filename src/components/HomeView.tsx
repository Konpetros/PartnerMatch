/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Listing, SearchFilters, KeyAction } from '../types';
import { COUNTRIES, ORGANISATION_TYPES, THEMATIC_AREAS, KEY_ACTIONS } from '../data';
import { 
  Search, 
  MapPin, 
  Building2, 
  BookOpen, 
  RefreshCcw, 
  ArrowRight, 
  Users, 
  Globe2, 
  Layers, 
  Sparkles,
  Inbox
} from 'lucide-react';

interface HomeViewProps {
  listings: Listing[];
  onNavigate: (view: string) => void;
  onSelectListing: (id: string) => void;
}

export default function HomeView({ listings, onNavigate, onSelectListing }: HomeViewProps) {
  // Search & Filter State
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: '',
    country: '',
    organisationType: '',
    keyActions: [],
    thematicArea: ''
  });

  const [sortBy, setSortBy] = useState<'newest' | 'deadline' | 'views'>('newest');

  const [isLoading, setIsLoading] = useState(false);
  const [displayedListings, setDisplayedListings] = useState<Listing[]>(listings);

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

  // Trigger simulated loading skeleton when filters/sorting modify
  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      // Perform client-side filter logic
      const filtered = listings.filter((item) => {
        // Query search matches name, city, or description
        const query = filters.searchQuery.toLowerCase().trim();
        const cityValue = item.submitterProfile?.city || (item as any).city || '';
        const matchesQuery = !query || 
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          cityValue.toLowerCase().includes(query);

        // Country match
        const matchesCountry = !filters.country || item.country === filters.country;

        // Org type match
        const matchesOrgType = !filters.organisationType || item.type === filters.organisationType;

        // Key Actions match (item has all of the selected active filters, or any, let's do matching any selected key action, or if no filter selected, match all)
        const matchesKeyAction = filters.keyActions.length === 0 || 
          filters.keyActions.some(action => item.keyActions.includes(action));

        // Thematic Area match
        const matchesThematic = !filters.thematicArea || item.thematicAreas.includes(filters.thematicArea);

        return matchesQuery && matchesCountry && matchesOrgType && matchesKeyAction && matchesThematic;
      });

      // Apply sorting AFTER filtering
      const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'newest') {
          const dateA = a.createdAt || '';
          const dateB = b.createdAt || '';
          if (dateA !== dateB) {
            return dateB.localeCompare(dateA); // descending
          }
          return a.id.localeCompare(b.id);
        } else if (sortBy === 'deadline') {
          const dlA = a.partnerSearchDeadline || '';
          const dlB = b.partnerSearchDeadline || '';
          return dlA.localeCompare(dlB); // ascending
        } else if (sortBy === 'views') {
          const viewsA = a.views ?? 0;
          const viewsB = b.views ?? 0;
          return viewsB - viewsA; // descending
        }
        return 0;
      });

      setDisplayedListings(sorted);
      setIsLoading(false);
    }, 500); // 500ms feel-good delay

    return () => clearTimeout(handler);
  }, [filters, sortBy, listings]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, country: e.target.value }));
  };

  const handleOrgTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, organisationType: e.target.value }));
  };

  const handleThematicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, thematicArea: e.target.value }));
  };

  const toggleKeyAction = (action: KeyAction) => {
    setFilters(prev => {
      const active = prev.keyActions.includes(action)
        ? prev.keyActions.filter(a => a !== action)
        : [...prev.keyActions, action];
      return { ...prev, keyActions: active };
    });
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      country: '',
      organisationType: '',
      keyActions: [],
      thematicArea: ''
    });
  };

  // Badge styler helper for Key Actions
  const getKeyActionBadgeStyle = (action: KeyAction) => {
    switch (action) {
      case 'KA1':
        return 'ka1';
      case 'KA210':
        return 'ka210';
      case 'KA220':
        return 'ka220';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SECTION */}
      <section className="bg-brand-bg py-20 px-4 relative">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          {/* Small pill badge at the top */}
          <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-xs font-bold text-slate-600 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-accent" />
            <span>Free Erasmus+ Partner Search · KA1 · KA210 · KA220</span>
          </div>

          {/* Large heading — two lines */}
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight text-center text-slate-900">
            Find Your <span className="text-brand-primary">Erasmus+</span> Partner
          </h1>

          {/* Subheading below */}
          <p className="text-base sm:text-lg text-slate-500 font-medium text-center max-w-2xl mx-auto mt-4">
            Browse organisations across Europe looking for KA1, KA210 and KA220 partners. Connect, share knowledge, and build consortia.
          </p>

          {/* Search bar + CTA button in one row below */}
          <div className="w-full mt-8">
            <div className="flex items-center bg-white border border-slate-200 rounded-full shadow-md px-4 py-2 max-w-2xl mx-auto gap-3">
              <Search className="text-slate-400 w-4 h-4 shrink-0" />
              <input
                id="search-input-field"
                type="text"
                placeholder="Filter by organisation name, city, keywords..."
                value={filters.searchQuery}
                onChange={handleSearchChange}
                className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
              />
              <button
                id="hero-submit-cta"
                onClick={() => onNavigate('submit')}
                className="bg-brand-accent hover:bg-orange-500 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Submit Your Listing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Trust row below the search bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-sm font-bold text-slate-500">
            <span>✓ Free to browse</span>
            <span>✓ Free to list</span>
            <span>✓ No subscription</span>
            <span>✓ Pan-European</span>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY & FILTER STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-[24px] border border-blue-50/80 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-brand-primary" />
              <span>Refine Directory Results</span>
            </h2>
            <button
              id="clear-filters-btn"
              onClick={handleClearFilters}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-brand-primary transition-colors hover:underline"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Country Select */}
            <div className="space-y-2">
              <label htmlFor="country-select" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Partner Country
              </label>
              <div className="relative">
                <select
                  id="country-select"
                  value={filters.country}
                  onChange={handleCountryChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">🌍 All Countries</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <span className="text-xs">▼</span>
                </div>
              </div>
            </div>

            {/* Organisation Type Select */}
            <div className="space-y-2">
              <label htmlFor="orgtype-select" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Organisation Type
              </label>
              <div className="relative">
                <select
                  id="orgtype-select"
                  value={filters.organisationType}
                  onChange={handleOrgTypeChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">🏢 All Types</option>
                  {ORGANISATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <span className="text-xs">▼</span>
                </div>
              </div>
            </div>

            {/* Thematic Area Select */}
            <div className="space-y-2">
              <label htmlFor="thematic-select" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Thematic Area
              </label>
              <div className="relative">
                <select
                  id="thematic-select"
                  value={filters.thematicArea}
                  onChange={handleThematicChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">🎓 All Thematics</option>
                  {THEMATIC_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <span className="text-xs">▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Actions filter */}
          <div className="pt-2">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Key Actions (KA) Looking For:</span>
            <div id="ka-filters" className="flex flex-wrap gap-2.5">
              {['KA1', 'KA210', 'KA220'].map((action) => {
                const isActive = filters.keyActions.includes(action as KeyAction);
                return (
                  <button
                    id={`ka-pill-${action}`}
                    key={action}
                    type="button"
                    onClick={() => toggleKeyAction(action as KeyAction)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border cursor-pointer ${
                      isActive 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{action}</span>
                    {action === 'KA1' && <span className="ml-1.5 opacity-60 font-light">KA1</span>}
                    {action === 'KA210' && <span className="ml-1.5 opacity-60 font-light">Small</span>}
                    {action === 'KA220' && <span className="ml-1.5 opacity-60 font-light">Coop</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. LISTING GRID / DISCOVERY PORTAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
              Active Partner Proposals
            </h2>
            <p className="text-sm text-slate-500">
              Found {displayedListings.length} matching partner request{displayedListings.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort By:</span>
            <div className="relative min-w-[185px]">
              <select
                id="listing-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-8 py-2.5 text-xs font-bold text-slate-750 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="newest">🗓 Newest First</option>
                <option value="deadline">⏳ Deadline Soonest</option>
                <option value="views">🔥 Most Viewed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <span className="text-[10px]">▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* LOADING SKELETON CARDS */}
        {isLoading ? (
          <div id="grid-loader-skeletons" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white rounded-[20px] border border-gray-100 overflow-hidden shadow-sm h-[400px] flex flex-col p-5 space-y-4 animate-pulse">
                <div className="w-full h-44 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="flex space-x-2">
                  <div className="h-5 bg-slate-200 rounded-full w-12" />
                  <div className="h-5 bg-slate-200 rounded-full w-16" />
                </div>
                <div className="space-y-2 flex-1 pt-2">
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-4/5" />
                </div>
                <div className="h-10 bg-slate-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : displayedListings.length === 0 ? (
          /* EMPTY STATE */
          <div id="listings-empty-state" className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-[24px] border border-dashed border-gray-200 text-center space-y-4 max-w-lg mx-auto">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
              <Inbox className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Listings Match Your Search</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              We couldn't find any Erasmus+ listings matching your active filters. Try clearing your search query or selecting other countries.
            </p>
            <button
              id="empty-reset-btn"
              onClick={handleClearFilters}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white px-5 py-2.5 rounded-brand font-bold text-sm transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* LISTING CARDS GRID */
          <div id="listings-real-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedListings.map((listing) => {
              const flag = listing.countryFlag || '🇪🇺';
              return (
                <div
                  id={`listing-card-${listing.id}`}
                  key={listing.id}
                  className="group bg-white rounded-[20px] border border-blue-50/50 hover:border-blue-200/85 overflow-hidden card-shadow flex flex-col"
                >
                  {/* Card Header Image */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={listing.thumbnailUrl}
                      alt={listing.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center space-x-1.5 shadow-sm">
                      <span>{flag}</span>
                      <span>{listing.country}</span>
                    </div>

                    {(listing.submitterProfile?.city || (listing as any).city) && (
                      <div className="absolute bottom-3 left-3 bg-slate-900/40 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-white tracking-wide">
                        📍 {listing.submitterProfile?.city || (listing as any).city || ''}
                      </div>
                    )}
                  </div>

                  {/* Body Details */}
                  <div className="p-5 flex-1 flex flex-col space-y-3.5">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase px-2 py-1 rounded-md tracking-wider">
                        {listing.type}
                      </span>
                      {listing.keyActions.map((action) => (
                        <span
                          key={action}
                          className={`text-[10px] font-extrabold px-2 py-1 rounded-md ${getKeyActionBadgeStyle(action)}`}
                        >
                          {action}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-bold text-slate-800 text-lg leading-snug group-hover:text-brand-primary transition-colors line-clamp-1">
                      {listing.name}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      <span className="bg-orange-50 text-orange-600 font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                        🗓 Deadline: {formatDate(listing.partnerSearchDeadline)}
                      </span>
                      <span className="bg-slate-100 text-slate-600 font-bold text-[11px] px-2.5 py-1 rounded-full shrink-0">
                        {listing.submitterProfile?.experienceLevel || ''}
                      </span>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed flex-1 line-clamp-3">
                      {listing.description}
                    </p>

                    {/* Highly aesthetic metadata snippet */}
                    <div className="pt-2.5 border-t border-gray-100 flex flex-wrap gap-1">
                      {listing.thematicAreas.slice(0, 2).map((area) => (
                        <span key={area} className="text-[10px] font-bold text-brand-primary/80 bg-blue-50/40 px-2 py-0.5 rounded-full">
                          #{area.replace(' & ', '')}
                        </span>
                      ))}
                      {listing.thematicAreas.length > 2 && (
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">
                          +{listing.thematicAreas.length - 2} more
                        </span>
                      )}
                    </div>

                    <button
                      id={`view-profile-btn-${listing.id}`}
                      onClick={() => onSelectListing(listing.id)}
                      className="w-full mt-2 inline-flex items-center justify-center space-x-2 bg-slate-50 group-hover:bg-brand-primary text-slate-700 group-hover:text-white py-3 rounded-brand text-xs font-extrabold transition-all duration-300 pointer-events-auto border border-slate-150 group-hover:border-brand-primary cursor-pointer active:scale-95"
                    >
                      <span>View Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. THEMATIC STATS BAR */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-b border-indigo-100/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-[20px] shadow-sm flex items-center space-x-4 border border-blue-100/30">
            <div className="p-3 bg-blue-100 text-brand-primary rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">120+ Listings</p>
              <p className="text-slate-500 text-xs font-semibold">Organisations Registered</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[20px] shadow-sm flex items-center space-x-4 border border-blue-100/30">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <Globe2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">30+ Countries</p>
              <p className="text-slate-500 text-xs font-semibold">Active across the EU</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[20px] shadow-sm flex items-center space-x-4 border border-blue-100/30">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">3 Key Actions</p>
              <p className="text-slate-500 text-xs font-semibold">KA1, KA210 & KA220 Supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. "HOW IT WORKS" SECTION */}
      <section id="how-it-works-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-black text-slate-800">How It Works</h2>
          <p className="text-slate-500 max-w-sm mx-auto text-sm font-semibold">
            Simple 3-step collaboration methodology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 text-center space-y-4 hover:shadow-lg transition-all relative">
            <div className="absolute -top-4 left-1/2 -transtype-x-1/2 transform translate-x-3/4 bg-brand-accent text-white font-black text-sm w-8 h-8 rounded-full flex items-center justify-center">
              1
            </div>
            <div className="mx-auto w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-primary">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Create your free account</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Register your institution profile, describe your credentials, previous experience, and general research mission statement.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 text-center space-y-4 hover:shadow-lg transition-all relative">
            <div className="absolute -top-4 left-1/2 -transtype-x-1/2 transform translate-x-3/4 bg-brand-accent text-white font-black text-sm w-8 h-8 rounded-full flex items-center justify-center">
              2
            </div>
            <div className="mx-auto w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <RefreshCcw className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Submit your organisation</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Fill out our partnership form. Highlight the theme, key actions (KA1/2) you are targeting, and write down an informative summary.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 text-center space-y-4 hover:shadow-lg transition-all relative">
            <div className="absolute -top-4 left-1/2 -transtype-x-1/2 transform translate-x-3/4 bg-brand-accent text-white font-black text-sm w-8 h-8 rounded-full flex items-center justify-center">
              3
            </div>
            <div className="mx-auto w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
              <Globe2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Get discovered</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Consortium aggregators and project leaders can filter listings and reach out using secure email keys directly. Easy as that.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
