/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { formatDate } from '../utils/formatDate';
import { Listing, SearchFilters, KeyAction, OrganisationProfile } from '../types';
import FavouriteButton from './FavouriteButton';
import { getFavourites, getSentRequests } from '../services/firebase/firestore';
import ExpressInterestButton from './ExpressInterestButton';
import { COUNTRIES, ORGANISATION_TYPES, THEMATIC_AREAS, ERASMUS_SECTORS } from '../data';
import { 
  Search, 
  RefreshCcw, 
  Layers, 
  Inbox,
  LayoutGrid,
  List,
  ChevronRight
} from 'lucide-react';

interface BrowseViewProps {
  listings: Listing[];
  onNavigate: (view: string) => void;
  onSelectListing: (id: string) => void;
  currentUserUid?: string | null;
  currentUserProfile?: OrganisationProfile | null;
}

const LISTINGS_PER_PAGE = 15;

export default function BrowseDirectoryView({ listings, onNavigate, onSelectListing, currentUserUid, currentUserProfile }: BrowseViewProps) {
  // Search & Filter State
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: '',
    country: '',
    organisationType: '',
    keyActions: [],
    thematicArea: '',
    sector: '',
    projectRole: ''
  });

  const [sortBy, setSortBy] = useState<'newest' | 'deadline' | 'views'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);
  const [sentListingIds, setSentListingIds] = useState<string[]>([]);

  useEffect(() => {
    if (currentUserUid) {
      getFavourites(currentUserUid).then(setFavouriteIds);
      getSentRequests(currentUserUid).then(requests =>
        setSentListingIds(requests.map(r => r.listingId))
      );
    }
  }, [currentUserUid]);

  const handleInterestSent = (listingId: string) => {
    setSentListingIds(prev => [...prev, listingId]);
  };

  const handleToggleFavourite = (listingId: string) => {
    setFavouriteIds(prev =>
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const isAnyFilterActive = 
    filters.searchQuery !== '' ||
    filters.country !== '' ||
    filters.organisationType !== '' ||
    filters.thematicArea !== '' ||
    filters.sector !== '' ||
    filters.keyActions.length > 0 ||
    filters.projectRole !== '';


  // Filter & Sort Logic on-the-fly using useMemo
  const filteredAndSorted = useMemo(() => {
    const query = filters.searchQuery.toLowerCase().trim();
    const filtered = listings.filter((item) => {
      // Query search matches name, city, or description
      const cityValue = item.submitterProfile?.city || (item as any).city || '';
      const matchesQuery = !query || 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        cityValue.toLowerCase().includes(query);

      // Country match
      const matchesCountry = !filters.country || item.country === filters.country;

      // Org type match
      const matchesOrgType = !filters.organisationType || item.type === filters.organisationType;

      // Key Actions match
      const matchesKeyAction = filters.keyActions.length === 0 || 
        filters.keyActions.some(action => item.keyActions.includes(action));

      // Thematic Area match
      const matchesThematic = !filters.thematicArea || item.thematicAreas.includes(filters.thematicArea);

      // Project Role match
      const matchesProjectRole = !filters.projectRole || item.projectRole === filters.projectRole;

      // Sector match
      const matchesSector = !filters.sector || item.submitterProfile?.sector === filters.sector;

      return matchesQuery && matchesCountry && matchesOrgType && matchesKeyAction && matchesThematic && matchesSector && matchesProjectRole;
    });

    // Apply sorting
    return [...filtered].sort((a, b) => {
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
  }, [filters, sortBy, listings]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSorted.length / LISTINGS_PER_PAGE);
  const paginatedListings = useMemo(() => {
    return filteredAndSorted.slice(
      (currentPage - 1) * LISTINGS_PER_PAGE,
      currentPage * LISTINGS_PER_PAGE
    );
  }, [filteredAndSorted, currentPage]);

  // Reset to page 1 when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Abbreviated pagination helper function
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

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

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sector: e.target.value }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      country: '',
      organisationType: '',
      keyActions: [],
      thematicArea: '',
      sector: '',
      projectRole: ''
    });
  };

  // Badge styler helper for Key Actions
  const getKeyActionBadgeStyle = (action: KeyAction) => {
    switch (action) {
      case 'KA1':
        return 'ka1';
      case 'KA2':
        return 'ka210';
      case 'KA3':
        return 'ka220';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  return (
    <div className="space-y-6 pb-16 pt-8">
      {/* HEADER SECTION */}
      <section className="bg-brand-bg py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Browse Partner Listings
          </h1>
          <p className="text-base text-slate-500 font-medium max-w-2xl mx-auto mt-3">
            Find Erasmus+ listings from organisations across Europe looking for partners.
          </p>
        </div>
      </section>

      {/* FILTER STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-[24px] border border-blue-50/80 shadow-sm space-y-5">
          <div className="space-y-4 border-b border-gray-100 pb-4">
            {/* Top row — title + count + clear */}
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-brand-primary" />
                <span>Filter Directory Results</span>
                <span className="bg-blue-50 text-brand-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'listing' : 'listings'} found
                </span>
              </h2>
              <div className="flex items-center space-x-4">
                <div className="inline-flex items-center bg-slate-100 rounded-lg p-1 gap-1">
                  <button
                    id="view-mode-grid-btn"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    id="view-mode-list-btn"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <button
                  id="clear-filters-btn"
                  onClick={handleClearFilters}
                  className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-brand-primary transition-colors cursor-pointer"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>

            {/* Search bar */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 gap-3 focus-within:border-brand-primary transition-colors">
              <Search className="text-slate-400 w-4 h-4 shrink-0" />
              <input
                id="search-input-field"
                type="text"
                placeholder="Search by organisation name, city, keywords..."
                value={filters.searchQuery}
                onChange={handleSearchChange}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* Erasmus+ Sector Select */}
            <div className="space-y-2">
              <label htmlFor="sector-select" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Erasmus+ Sector
              </label>
              <div className="relative">
                <select
                  id="sector-select"
                  value={filters.sector}
                  onChange={handleSectorChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">🎯 All Sectors</option>
                  {ERASMUS_SECTORS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <span className="text-xs">▼</span>
                </div>
              </div>
            </div>

            {/* Key Action Select */}
            <div className="space-y-2">
              <label htmlFor="ka-select" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                KEY ACTION
              </label>
              <div className="relative">
                <select
                  id="ka-select"
                  value={filters.keyActions[0] || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFilters(prev => ({ ...prev, keyActions: val ? [val as KeyAction] : [] }));
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">⚡ All Key Actions</option>
                  <option value="KA1">KA1 — Learning Mobility</option>
                  <option value="KA2">KA2 — Cooperation Partnerships</option>
                  <option value="KA3">KA3 — Policy Support</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <span className="text-xs">▼</span>
                </div>
              </div>
            </div>

            {/* Project Role Select */}
            <div className="space-y-2">
              <label htmlFor="role-select" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                PROJECT ROLE
              </label>
              <div className="relative">
                <select
                  id="role-select"
                  value={filters.projectRole}
                  onChange={(e) => setFilters(prev => ({ ...prev, projectRole: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">🎭 All Roles</option>
                  <option value="Coordinator">🎯 Coordinator</option>
                  <option value="Partner">🤝 Partner</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <span className="text-xs">▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          {isAnyFilterActive && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active:</span>
              
              {filters.country && (
                <span className="inline-flex items-center space-x-1.5 bg-brand-primary/10 text-brand-primary text-xs font-bold px-3 py-1.5 rounded-full">
                  <span>🌍 {filters.country}</span>
                  <button onClick={() => setFilters(prev => ({ ...prev, country: '' }))} className="hover:text-red-500 transition-colors cursor-pointer">✕</button>
                </span>
              )}
              
              {filters.organisationType && (
                <span className="inline-flex items-center space-x-1.5 bg-brand-primary/10 text-brand-primary text-xs font-bold px-3 py-1.5 rounded-full">
                  <span>🏢 {filters.organisationType}</span>
                  <button onClick={() => setFilters(prev => ({ ...prev, organisationType: '' }))} className="hover:text-red-500 transition-colors cursor-pointer">✕</button>
                </span>
              )}
              
              {filters.thematicArea && (
                <span className="inline-flex items-center space-x-1.5 bg-brand-primary/10 text-brand-primary text-xs font-bold px-3 py-1.5 rounded-full">
                  <span>🎓 {filters.thematicArea}</span>
                  <button onClick={() => setFilters(prev => ({ ...prev, thematicArea: '' }))} className="hover:text-red-500 transition-colors cursor-pointer">✕</button>
                </span>
              )}
              
              {filters.sector && (
                <span className="inline-flex items-center space-x-1.5 bg-brand-primary/10 text-brand-primary text-xs font-bold px-3 py-1.5 rounded-full">
                  <span>🎯 {filters.sector}</span>
                  <button onClick={() => setFilters(prev => ({ ...prev, sector: '' }))} className="hover:text-red-500 transition-colors cursor-pointer">✕</button>
                </span>
              )}
              
              {filters.keyActions.length > 0 && filters.keyActions.map(ka => (
                <span key={ka} className="inline-flex items-center space-x-1.5 bg-brand-primary/10 text-brand-primary text-xs font-bold px-3 py-1.5 rounded-full">
                  <span>⚡ {ka}</span>
                  <button onClick={() => setFilters(prev => ({ ...prev, keyActions: prev.keyActions.filter(k => k !== ka) }))} className="hover:text-red-500 transition-colors cursor-pointer">✕</button>
                </span>
              ))}
              
              {filters.projectRole && (
                <span className="inline-flex items-center space-x-1.5 bg-brand-primary/10 text-brand-primary text-xs font-bold px-3 py-1.5 rounded-full">
                  <span>{filters.projectRole === 'Coordinator' ? '🎯' : '🤝'} {filters.projectRole}</span>
                  <button onClick={() => setFilters(prev => ({ ...prev, projectRole: '' }))} className="hover:text-red-500 transition-colors cursor-pointer">✕</button>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* DISCOVERY GRID PORTAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
              Active Proposals
            </h2>
            <p className="text-sm text-slate-500 font-semibold mt-0.5">
              Showing {paginatedListings.length} of {filteredAndSorted.length} matching proposals
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

        {/* LISTINGS RESULT CONTAINER */}
        {filteredAndSorted.length === 0 ? (
          /* EMPTY STATE */
          <div id="listings-empty-state" className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-[24px] border border-dashed border-gray-200 text-center space-y-4 max-w-lg mx-auto">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
              <Inbox className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Listings Match Your Search</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              We couldn't find any Erasmus+ listings matching your active filters. Try clearing your search query or selecting other values.
            </p>
            <button
              id="empty-reset-btn"
              onClick={handleClearFilters}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white px-5 py-2.5 rounded-brand font-bold text-sm transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* LISTING CARDS GRID */
          <>
            {viewMode === 'list' && (
              <div className="space-y-3">
                {paginatedListings.map((listing) => {
                  const flag = listing.countryFlag || '🇪🇺';
                  return (
                    <div
                      key={listing.id}
                      onClick={() => onSelectListing(listing.id)}
                      className="group bg-white rounded-2xl border border-blue-50/50 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer p-4 flex items-center gap-4"
                    >
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
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                          <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-brand-primary transition-colors">
                            {listing.title || listing.name}
                          </h3>
                          <span className="bg-slate-100 text-slate-600 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider shrink-0">
                            {listing.type}
                          </span>
                          {listing.projectRole && (
                            <>
                              {(listing.projectRole === 'Coordinator' || listing.projectRole === 'Both') && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-violet-100 text-violet-800 shrink-0">
                                  Coordinator
                                </span>
                              )}
                              {(listing.projectRole === 'Partner' || listing.projectRole === 'Both') && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-violet-100 text-violet-800 shrink-0">
                                  Partner
                                </span>
                              )}
                            </>
                          )}
                          {listing.keyActions.map((action) => (
                            <span
                              key={action}
                              className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0"
                            >
                              {action}
                            </span>
                          ))}
                          {listing.sectors && listing.sectors.map((sector) => (
                            <span
                              key={sector}
                              className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0"
                            >
                              {sector}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1.5 truncate">
                          <span>{flag}</span>
                          <span className="truncate">
                            {listing.country}{(listing.submitterProfile?.city || (listing as any).city) ? `, ${listing.submitterProfile?.city || (listing as any).city}` : ''}
                          </span>
                        </p>
                        {listing.thematicAreas && listing.thematicAreas.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {listing.thematicAreas.slice(0, 2).map((area) => (
                              <span key={area} className="text-[9px] font-bold text-brand-primary/80 bg-blue-50/40 px-2 py-0.5 rounded-full">
                                #{area}
                              </span>
                            ))}
                            {listing.thematicAreas.length > 2 && (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">
                                +{listing.thematicAreas.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center shrink-0">
                        <ExpressInterestButton
                          listing={listing}
                          currentUserUid={currentUserUid ?? null}
                          currentUserProfile={currentUserProfile ?? null}
                          alreadySent={sentListingIds.includes(listing.id)}
                          onSent={handleInterestSent}
                        />
                      </div>
                      <div className="hidden sm:flex flex-col items-end text-right shrink-0">
                        <span className="text-orange-600 font-bold text-[11px]">
                          🗓 {formatDate(listing.partnerSearchDeadline)}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-primary transition-colors shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
            {viewMode === 'grid' && (
            <div id="listings-real-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedListings.map((listing) => {
                const flag = listing.countryFlag || '🇪🇺';
                return (
                  <div
                    id={`listing-card-${listing.id}`}
                    key={listing.id}
                    onClick={() => onSelectListing(listing.id)}
                    className="group bg-white rounded-[20px] border border-blue-50/50 hover:border-blue-300 hover:shadow-md overflow-hidden card-shadow flex flex-col cursor-pointer"
                  >
                    {/* Body Details */}
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
                            <span className="truncate">
                              {listing.country}{(listing.submitterProfile?.city || (listing as any).city) ? `, ${listing.submitterProfile?.city || (listing as any).city}` : ''}
                            </span>
                          </span>
                        </div>
                        <FavouriteButton listingId={listing.id} currentUserUid={currentUserUid ?? null} isFavourited={favouriteIds.includes(listing.id)} onToggle={handleToggleFavourite} />
                      </div>

                      {listing.title && (
                        <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">
                          {listing.title}
                        </h3>
                      )}
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 break-words">
                        {listing.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
                      </p>

                      <div className="flex flex-col">
                        {listing.keyActions.length > 0 && (
                          <div className="flex items-center gap-2 py-1.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[44px] shrink-0">Key Action</span>
                            <div className="flex flex-wrap gap-1">
                              {listing.keyActions.map((action) => (
                                <span key={action} className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                  {action}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {listing.projectRole && (
                          <div className="border-t border-slate-100 flex items-center gap-2 py-1.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[44px] shrink-0">Role</span>
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
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[44px] shrink-0">Sector</span>
                            <div className="flex flex-wrap gap-1">
                              {listing.sectors.map((sector) => (
                                <span key={sector} className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                  {sector}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="border-t border-slate-100 flex items-center gap-2 py-1.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[44px] shrink-0">Deadline</span>
                          <span className="text-[9px] font-extrabold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                            {formatDate(listing.partnerSearchDeadline)}
                          </span>
                        </div>
                      </div>

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
                      <ExpressInterestButton
                        listing={listing}
                        currentUserUid={currentUserUid ?? null}
                        currentUserProfile={currentUserProfile ?? null}
                        alreadySent={sentListingIds.includes(listing.id)}
                        onSent={handleInterestSent}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6">
                <div className="flex items-center justify-center space-x-2 mt-10">
                  {/* Previous button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    ← Previous
                  </button>

                  {/* Page numbers */}
                  {getPageNumbers().map((page, idx) => {
                    if (page === '...') {
                      return (
                        <span key={`dots-${idx}`} className="text-slate-400 font-bold px-2 selection:bg-transparent">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`w-9 h-9 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                          currentPage === page
                            ? 'bg-brand-primary text-white shadow-sm'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Next button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    Next →
                  </button>
                </div>

                {/* Page info */}
                <p className="text-center text-xs text-slate-400 font-semibold mt-3">
                  Page {currentPage} of {totalPages} · Showing {paginatedListings.length} of {filteredAndSorted.length} listings
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
