/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { OrganisationType } from '../types';
import { ProfileWithUid } from '../hooks/useProfiles';
import { COUNTRIES, ORGANISATION_TYPES, LANGUAGES, THEMATIC_AREAS, ERASMUS_SECTORS } from '../data';
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
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedThematic, setSelectedThematic] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  useEffect(() => {
    setIsLoading(false);
  }, [searchQuery, selectedCountry, selectedType, selectedLetter, selectedExperience, selectedLanguage, selectedThematic, selectedSector]);

  // Derive unique organisations list — only show public profiles
  const uniqueOrganisations = listings.filter(org => org.profilePublic !== false);

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

    // 5. Experience level
    const matchesExperience = !selectedExperience || org.experienceLevel === selectedExperience;

    // 6. Languages
    const matchesLanguage = !selectedLanguage || (org.languagesSpoken || []).includes(selectedLanguage);

    // 7. Thematic topics
    const matchesThematic = !selectedThematic || (org.thematicAreas || []).includes(selectedThematic);

    // 8. Erasmus+ Sector
    const matchesSector = !selectedSector || (org.sectors || []).includes(selectedSector);

    return matchesSearch && matchesCountry && matchesType && matchesLetter && matchesExperience && matchesLanguage && matchesThematic && matchesSector;
  });

  const isAnyFilterActive =
    searchQuery !== '' ||
    selectedCountry !== '' ||
    selectedType !== '' ||
    selectedLetter !== 'All' ||
    selectedExperience !== '' ||
    selectedLanguage !== '' ||
    selectedThematic !== '' ||
    selectedSector !== '';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCountry('');
    setSelectedType('');
    setSelectedLetter('All');
    setSelectedExperience('');
    setSelectedLanguage('');
    setSelectedThematic('');
    setSelectedSector('');
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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

          {/* Erasmus+ Sector dropdown */}
          <div className="relative">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="">🎯 All Sectors</option>
              {ERASMUS_SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <span className="text-xs">▼</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Experience Level dropdown */}
          <div className="relative">
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="">🎖 All Experience Levels</option>
              <option value="First-timer">First-timer</option>
              <option value="Experienced">Experienced</option>
              <option value="Advanced">Advanced</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <span className="text-xs">▼</span>
            </div>
          </div>

          {/* Languages dropdown */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="">🗣 All Languages</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <span className="text-xs">▼</span>
            </div>
          </div>

          {/* Thematic Topics dropdown */}
          <div className="relative">
            <select
              value={selectedThematic}
              onChange={(e) => setSelectedThematic(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="">🎓 All Thematic Topics</option>
              {THEMATIC_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
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
                  <div className="p-5 flex flex-col space-y-3.5">

                    <div className="flex items-center gap-3">
                      {org.logoUrl ? (
                        <img
                          src={org.logoUrl}
                          alt={`${org.organisationName} logo`}
                          className="w-12 h-12 rounded-lg object-contain border border-slate-100 bg-white p-1.5 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-base shrink-0">
                          {org.organisationName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate group-hover:text-brand-primary transition-colors">
                          {org.organisationName}
                        </h3>
                        <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1 mt-0.5">
                          <span>{org.countryFlag || '🇪🇺'}</span>
                          <span className="truncate">{org.country}{cityValue ? `, ${cityValue}` : ''}</span>
                        </span>
                      </div>
                    </div>

                    {org.description && (
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                        {org.description}
                      </p>
                    )}

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 py-1.5 border-b border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[60px] shrink-0">Type</span>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          {org.organisationType}
                        </span>
                      </div>
                      {org.experienceLevel && (
                        <div className="flex items-center gap-2 py-1.5 border-b border-slate-100">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[60px] shrink-0">Experience</span>
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                            {org.experienceLevel}
                          </span>
                        </div>
                      )}
                      {org.sectors && org.sectors.length > 0 && (
                        <div className="flex items-center gap-2 py-1.5 border-b border-slate-100">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[60px] shrink-0">Sector</span>
                          <div className="flex flex-wrap gap-1">
                            {org.sectors.slice(0, 3).map((s) => (
                              <span key={s} className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-green-100 text-green-800">
                                {s}
                              </span>
                            ))}
                            {org.sectors.length > 3 && (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                                +{org.sectors.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {org.languagesSpoken && org.languagesSpoken.length > 0 && (
                        <div className="flex items-center gap-2 py-1.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[60px] shrink-0">Languages</span>
                          <div className="flex flex-wrap gap-1">
                            {org.languagesSpoken.slice(0, 3).map((lang) => (
                              <span key={lang} className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 border border-violet-200">
                                {lang}
                              </span>
                            ))}
                            {org.languagesSpoken.length > 3 && (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                                +{org.languagesSpoken.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {org.thematicAreas && org.thematicAreas.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2 mt-1 border-t border-slate-100">
                        {org.thematicAreas.slice(0, 3).map((area) => (
                          <span key={area} className="text-[9px] font-bold text-brand-primary/80 bg-blue-50/40 px-2 py-0.5 rounded-full">
                            #{area}
                          </span>
                        ))}
                        {org.thematicAreas.length > 3 && (
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">
                            +{org.thematicAreas.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      {renderStatusBadge('active')}
                      <span className="text-xs font-bold text-brand-primary group-hover:underline">
                        View Profile →
                      </span>
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
