/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { OrganisationType } from '../types';
import { ProfileWithUid } from '../hooks/useProfiles';
import { COUNTRIES, ORGANISATION_TYPES } from '../data';
import { MapPin, Inbox, Search } from 'lucide-react';

interface OrganisationsViewProps {
  listings: ProfileWithUid[];
  onSelectOrganisation: (id: string) => void;
  onNavigate: (view: string) => void;
}

export default function OrganisationsDirectoryView({
  listings,
  onSelectOrganisation,
  onNavigate,
}: OrganisationsViewProps) {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('All');

  // Trigger loading state briefly whenever filters change to show beautiful skeleton loading animation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCountry, selectedType, selectedLetter]);

  // Derive unique organisations list based on name to avoid duplicate registry profiles
  const uniqueOrganisations = listings;

  // Dynamic stats calculation from underlying lists
  const totalOrgs = uniqueOrganisations.length;
  const totalCountries = new Set(uniqueOrganisations.map((item) => item.country)).size;
  const totalTypes = new Set(uniqueOrganisations.map((item) => item.organisationType)).size;

  // Filter logic
  const filteredOrganisations = uniqueOrganisations.filter((org) => {
    // 1. Search Query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || org.organisationName.toLowerCase().includes(query);

    // 2. Country
    const matchesCountry = !selectedCountry || org.country === selectedCountry;

    // 3. Organisation Type
    const matchesType = !selectedType || org.organisationType === selectedType;

    // 4. Alphabet letter
    const matchesLetter =
      selectedLetter === 'All' ||
      org.organisationName.trim().charAt(0).toUpperCase() === selectedLetter;

    return matchesSearch && matchesCountry && matchesType && matchesLetter;
  });

  const isAnyFilterActive =
    searchQuery !== '' ||
    selectedCountry !== '' ||
    selectedType !== '' ||
    selectedLetter !== 'All';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCountry('');
    setSelectedType('');
    setSelectedLetter('All');
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Status Badge Builder Helper
  const renderStatusBadge = (status?: string) => {
    const activeStatus = status || 'active';
    switch (activeStatus) {
      case 'active':
        return (
          <span className="bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
            Seeking Partner
          </span>
        );
      case 'partnership-found':
        return (
          <span className="bg-blue-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
            Partnership Found
          </span>
        );
      case 'pending':
        return (
          <span className="bg-amber-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
            Pending
          </span>
        );
      case 'expired':
        return (
          <span className="bg-slate-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
            Expired
          </span>
        );
      default:
        return (
          <span className="bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
            Seeking Partner
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8 font-sans">
      {/* HERO SECTION */}
      <section className="bg-brand-bg py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Erasmus+ Organisations
          </h1>
          <p className="text-base text-slate-500 font-medium max-w-2xl mx-auto mt-3">
            Discover, filter, and connect with all organisations registered on PartnerMatch
          </p>
        </div>
      </section>

      {/* 2. FILTER & SEARCH COMPRESSED CONTROL PANEL */}
      <div className="bg-white rounded-[24px] border border-blue-50/80 shadow-sm p-4 sm:p-6 space-y-4">
          {/* Stats + count row */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <p className="text-xl font-black text-brand-primary">{totalOrgs}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Organisations</p>
              </div>
              <div className="w-px h-7 bg-slate-200" />
              <div className="text-center">
                <p className="text-xl font-black text-brand-primary">{totalCountries}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Countries</p>
              </div>
              <div className="w-px h-7 bg-slate-200" />
              <div className="text-center">
                <p className="text-xl font-black text-brand-primary">{totalTypes}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Types</p>
              </div>
            </div>
            {isAnyFilterActive && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-slate-500 hover:text-brand-primary transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <span>✕</span>
                  <span>Clear filters</span>
                </button>
              </div>
            )}
          </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search bar inputs */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search organisations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-405"
            />
          </div>

          {/* Country select */}
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="">🇪🇺 All Countries</option>
              {COUNTRIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <span className="text-xs">▼</span>
            </div>
          </div>

          {/* Type dropdown */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="">🏢 All Types</option>
              {ORGANISATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <span className="text-xs">▼</span>
            </div>
          </div>
        </div>

        {/* 3. ALPHABET MINIMAL FILTER BAR */}
        <div className="border-t border-slate-100 pt-3 flex items-center space-x-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block grow-0 shrink-0">
            Index:
          </span>
          <div className="flex-1 overflow-x-auto select-none no-scrollbar flex items-center space-x-1.5 py-1">
            <button
              onClick={() => setSelectedLetter('All')}
              className={`px-3 py-1 rounded-md text-xs transition-all shrink-0 cursor-pointer ${
                selectedLetter === 'All'
                  ? 'text-brand-primary border-b-2 border-brand-primary font-bold bg-blue-50/50'
                  : 'text-slate-500 hover:text-brand-primary bg-transparent font-medium'
              }`}
            >
              All
            </button>
            {alphabet.map((letter) => {
              const active = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-xs transition-all shrink-0 cursor-pointer ${
                    active
                      ? 'text-brand-primary border-b-2 border-brand-primary font-bold bg-blue-50/70'
                      : 'text-slate-500 hover:text-brand-primary hover:bg-slate-50 font-medium'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. RESULTS SECTION FOR CARDS */}
      <div>
        {/* Toggleable clear filters button */}
        {isAnyFilterActive && (
          <div className="flex justify-between items-center mb-5 animate-fade-in bg-blue-50/40 p-3 rounded-xl border border-blue-50">
            <p className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-700 font-bold">{filteredOrganisations.length}</strong> matching organisations
            </p>
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Conditional Cards Renderer with skeletal loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-[20px] border border-gray-100 overflow-hidden shadow-sm h-[380px] flex flex-col p-5 space-y-4 animate-pulse animate-repeat-infinite"
              >
                <div className="w-full h-44 bg-slate-200 rounded-xl animate-pulse" />
                <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
                <div className="h-6 bg-slate-200 rounded w-3/4 animate-pulse" />
                <div className="space-y-2 flex-1 pt-2 animate-pulse">
                  <div className="h-3 bg-slate-200 rounded w-full animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-4/5 animate-pulse" />
                </div>
                <div className="h-10 bg-slate-200 rounded-xl w-full animate-pulse" />
              </div>
            ))}
          </div>
        ) : filteredOrganisations.length === 0 ? (
          /* Empty Search and Alpha state */
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-[24px] border border-dashed border-gray-200 text-center space-y-4 max-w-lg mx-auto">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
              <Inbox className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Organisations Found</h3>
            <p className="text-slate-500 text-sm max-w-sm">
              No registered organizations match your active filters or alphabetical index constraint. Try removing filter parameters.
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white px-5 py-2.5 rounded-brand font-bold text-sm transition-all cursor-pointer"
            >
              Reset Directories
            </button>
          </div>
        ) : (
          /* Active Results grid block */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganisations.map((org) => {
              const cityValue = org.city || 'Greece';
              return (
                <div
                  key={org.uid}
                  id={`org-card-${org.uid}`}
                  onClick={() => onSelectOrganisation(org.uid)}
                  className="bg-white rounded-[20px] overflow-hidden border border-blue-50/80 shadow-sm hover:border-blue-200 transition-all flex flex-col group hover:shadow-md cursor-pointer"
                >
                  {/* Card image — logo if available, or initials avatar */}
                  <div className="relative h-44 bg-slate-50 overflow-hidden flex items-center justify-center">
                    {org.logoUrl ? (
                      <img
                        src={org.logoUrl}
                        alt={`${org.organisationName} logo`}
                        className="w-28 h-28 object-contain p-2"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-[20px] bg-brand-primary flex items-center justify-center shadow-sm">
                        <span className="text-white font-black text-3xl">
                          {org.organisationName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Status badge Overlay */}
                    <div className="absolute top-3 right-3">
                      {renderStatusBadge('active')}
                    </div>

                    {/* Flag and country Overlay */}
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-800 flex items-center space-x-1 shadow-xs">
                      <span>{org.countryFlag || '🇪🇺'}</span>
                      <span>{org.country}</span>
                    </div>
                  </div>

                  {/* Body Text portion */}
                  <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="bg-slate-100 text-slate-600 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                          {org.organisationType}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-850 text-base leading-snug line-clamp-1 group-hover:text-brand-primary transition-colors">
                        {org.organisationName}
                      </h3>

                      <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {cityValue}, {org.country}
                        </span>
                      </div>
                    </div>

                    {/* Button trigger profiles */}
                    <div
                      className="w-full py-2.5 border border-brand-primary text-brand-primary group-hover:bg-brand-primary group-hover:text-white rounded-brand font-bold text-xs transition-all duration-200 text-center"
                    >
                      View Profile
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
