/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Listing, KeyAction, OrganisationProfile } from '../types';
import { ProfileWithUid } from '../hooks/useProfiles';
import { ArrowLeft, Mail, MapPin, Globe, Calendar, Languages, Building2, Hash, Award, FolderOpen, FileText, Linkedin, Facebook, Instagram, Twitter, LayoutGrid, List } from 'lucide-react';
import { stripHtml } from '../utils';

interface BaseProps {
  onBack: () => void;
  onViewListing: (id: string) => void;
}

interface ModeAListingProps extends BaseProps {
  listing: Listing;
  profile?: never;
  listings?: never;
}

interface ModeBProfileProps extends BaseProps {
  listing?: never;
  profile: ProfileWithUid;
  listings: Listing[];
}

export type OrgProfileViewProps = ModeAListingProps | ModeBProfileProps;

export default function OrgProfileView(props: OrgProfileViewProps) {
  const { onBack, onViewListing } = props;
  const [orgViewMode, setOrgViewMode] = useState<'grid' | 'list'>('grid');

  // Determine active listings filter for Mode B
  const orgListings = props.listings
    ? props.listings.filter(
        (l) => (l as any).submittedBy === props.profile.uid && l.status === 'active'
      )
    : [];

  // Graceful fallback helper to support sub-profile architectures
  const activeProfile: OrganisationProfile = props.listing
    ? (props.listing.submitterProfile || {
        organisationName: props.listing.name,
        organisationType: props.listing.type,
        country: props.listing.country,
        countryFlag: props.listing.countryFlag,
        city: (props.listing as any).city || 'Athens',
        website: (props.listing as any).website || '',
        foundedYear: (props.listing as any).foundedYear || '',
        oid: (props.listing as any).oid || '',
        experienceLevel: (props.listing as any).experienceLevel || 'First-timer',
        previousProjects: (props.listing as any).previousProjects || '0',
        languagesSpoken: (props.listing as any).languagesSpoken || ['English'],
        contactEmail: props.listing.contactEmail,
        sector: 'Youth',
        description: props.listing.description || '',
      })
    : props.profile;

  // Derive active listing status in Mode A
  const activeStatus = props.listing ? (props.listing.status || 'active') : 'active';

  // The organisation profile banner always uses the brand gradient, regardless
  // of which entry path was used to reach it, so every organisation has one
  // consistent visual identity rather than borrowing a specific listing's photo.
  const bannerImage = undefined;

  // Badge styler helper for Key Actions
  const getKeyActionBadgeStyle = (action: KeyAction) => {
    switch (action) {
      case 'KA1':
        return 'bg-blue-100 text-blue-800 border-blue-200 font-extrabold';
      case 'KA2':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 font-extrabold';
      case 'KA3':
        return 'bg-purple-100 text-purple-800 border-purple-200 font-extrabold';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
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

  // Status rendering for Mode A
  const renderStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Seeking Partner';
      case 'partnership-found':
        return 'Partnership Found';
      case 'pending':
        return 'Pending Approval';
      case 'expired':
        return 'Partnership Call Expired';
      default:
        return 'Seeking Partner';
    }
  };

  const renderStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500 border-emerald-600 text-white';
      case 'partnership-found':
        return 'bg-blue-500 border-blue-600 text-white';
      case 'pending':
        return 'bg-amber-500 border-amber-600 text-white';
      case 'expired':
        return 'bg-slate-500 border-slate-600 text-white';
      default:
        return 'bg-emerald-500 border-emerald-600 text-white';
    }
  };

  const renderStatusBadge = () => {
    if (props.listing) {
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${renderStatusBadgeClass(activeStatus)} shadow-xs`}>
          {renderStatusLabel(activeStatus)}
        </span>
      );
    } else {
      const hasActive = orgListings.length > 0;
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${
          hasActive 
            ? 'bg-emerald-500 border-emerald-600 text-white' 
            : 'bg-slate-500 border-slate-600 text-white'
        } shadow-xs`}>
          {hasActive ? 'Seeking Partners' : 'Member Organisation'}
        </span>
      );
    }
  };

  if (activeProfile.profilePublic === false) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-fade-in font-sans text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
          <Building2 className="w-6 h-6 text-slate-400" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800">Profile is Private</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">This organisation has set their profile to private and it is not publicly visible.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-bold text-brand-primary hover:underline cursor-pointer mt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4 animate-fade-in font-sans" id="org-profile-view-root">

      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-sm font-bold text-slate-600 hover:text-brand-primary bg-white px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-200 shadow-sm transition-all cursor-pointer"
        id="btn-back-to-orgs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Organisations</span>
      </button>

      {/* 1. Identity card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center gap-4">
          {activeProfile.logoUrl ? (
            <div className="w-16 h-16 rounded-xl border border-slate-100 bg-white flex items-center justify-center shrink-0 overflow-hidden p-1.5">
              <img
                src={activeProfile.logoUrl}
                alt={`${activeProfile.organisationName} logo`}
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-2xl shrink-0">
              {activeProfile.organisationName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h1 className="text-xl font-extrabold text-slate-900">
                {activeProfile.organisationName}
              </h1>
              {renderStatusBadge()}
            </div>
            <p className="text-sm text-slate-500 font-medium">
              {activeProfile.countryFlag || '🇪🇺'} {activeProfile.country}{activeProfile.city ? `, ${activeProfile.city}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {activeProfile.website && (
              <a
                href={activeProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-sm font-bold text-brand-primary bg-slate-50 hover:bg-blue-50 border border-slate-200 px-4 py-2 rounded-xl transition-all shrink-0"
              >
                <span>Visit Website</span>
                <Globe className="w-4 h-4" />
              </a>
            )}
            {activeProfile.linkedinUrl && (
              <a href={activeProfile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-700 border border-slate-200 transition-all" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {activeProfile.facebookUrl && (
              <a href={activeProfile.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 transition-all" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {activeProfile.instagramUrl && (
              <a href={activeProfile.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-50 hover:bg-pink-50 text-slate-500 hover:text-pink-600 border border-slate-200 transition-all" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {activeProfile.twitterUrl && (
              <a href={activeProfile.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-all" title="X (Twitter)">
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. Organisation Details */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 pb-3 border-b border-slate-100">
          Organisation Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Type</p>
              <p className="text-sm font-bold text-slate-800">{activeProfile.organisationType}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Primary Erasmus+ Sector</p>
              <p className="text-sm font-bold text-slate-800">{activeProfile.sector}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Location</p>
              <p className="text-sm font-bold text-slate-800">{activeProfile.city ? `${activeProfile.city}, ` : ''}{activeProfile.country}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience</p>
              <p className="text-sm font-bold text-slate-800">{activeProfile.experienceLevel}</p>
            </div>
          </div>
          {activeProfile.foundedYear && (
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Founded</p>
                <p className="text-sm font-bold text-slate-800">{activeProfile.foundedYear}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <FolderOpen className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Past Projects</p>
              <p className="text-sm font-bold text-slate-800">{activeProfile.previousProjects}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Hash className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">OID Number</p>
              <p className={activeProfile.oid ? "text-sm font-bold text-slate-800" : "text-sm italic text-slate-400 font-medium"}>
                {activeProfile.oid || 'Not provided'}
              </p>
            </div>
          </div>
          {(activeProfile.showEmailOnProfile ?? true) && activeProfile.contactEmail && (
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email</p>
                <a href={`mailto:${activeProfile.contactEmail}`} className="text-sm font-bold text-brand-primary hover:underline">
                  {activeProfile.contactEmail}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. About */}
      {activeProfile.description && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" />
            About This Organisation
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {activeProfile.description}
          </p>
        </div>
      )}

      {/* 4. Working Languages */}
      {activeProfile.languagesSpoken && activeProfile.languagesSpoken.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Languages className="w-3.5 h-3.5" />
            Working Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeProfile.languagesSpoken.map((lang) => (
              <span key={lang} className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-lg">
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 5. Mode A: Thematic Areas + CTA (viewed from a listing) */}
      {props.listing && (
        <>
          {props.listing.thematicAreas && props.listing.thematicAreas.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 pb-3 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                Thematic Focus Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {props.listing.thematicAreas.map((area) => (
                  <span key={area} className="bg-blue-50/70 text-brand-primary text-xs font-bold px-4 py-2 rounded-xl border border-blue-100/40">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
          {activeStatus === 'active' ? (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-blue-900 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>This organisation is actively looking for partners</span>
                  </h4>
                  <p className="text-xs text-blue-700 font-semibold">
                    Expiring Soon. Submit your partnership inquiry to secure a matching role.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {props.listing.keyActions.map((action) => (
                    <span key={action} className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-md border ${getKeyActionBadgeStyle(action)}`}>
                      {action}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-blue-200/40 text-xs">
                <div className="text-blue-700 font-bold flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Partner search deadline: <strong className="text-blue-900 font-black">{formatDate(props.listing.partnerSearchDeadline)}</strong></span>
                </div>
                <button
                  onClick={() => onViewListing(props.listing!.id)}
                  className="inline-flex items-center justify-center space-x-1 bg-brand-primary hover:bg-brand-primary-hover text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
                >
                  <span>View Full Partner Call</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
              <p className="text-sm font-semibold text-slate-500">🔒 This organisation is not currently seeking partners</p>
            </div>
          )}
        </>
      )}

      {/* 5. Mode B: Active Partner Searches (viewed from org directory) */}
      {props.listings && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Active Partner Searches
            </h3>
            <div className="flex items-center gap-2">
              {orgListings.length > 0 && (
                <span className="text-xs font-bold bg-blue-50 text-brand-primary px-2.5 py-0.5 rounded-full">
                  {orgListings.length} active
                </span>
              )}
              {orgListings.length > 0 && (
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setOrgViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${orgViewMode === 'grid' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setOrgViewMode('list')}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${orgViewMode === 'list' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    title="List view"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          {orgListings.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4 font-medium">No active partner searches at the moment.</p>
          ) : orgViewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {orgListings.map((listing) => {
                const flag = listing.countryFlag || '🇪🇺';
                return (
                  <div
                    key={listing.id}
                    onClick={() => onViewListing(listing.id)}
                    className="group bg-white rounded-[20px] border border-blue-50/50 hover:border-blue-300 hover:shadow-md card-shadow flex flex-col cursor-pointer"
                  >
                    <div className="p-5 flex-1 flex flex-col space-y-3.5">
                      <div className="flex items-center gap-3">
                        {listing.submitterProfile?.logoUrl ? (
                          <img src={listing.submitterProfile.logoUrl} alt={listing.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-lg object-contain border border-slate-100 bg-white p-1.5 shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-base shrink-0">
                            {listing.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{listing.name}</span>
                          <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1 mt-0.5">
                            <span>{flag}</span>
                            <span className="truncate">{listing.country}{listing.submitterProfile?.city ? `, ${listing.submitterProfile.city}` : ''}</span>
                          </span>
                        </div>
                      </div>
                      {listing.title && (
                        <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">{listing.title}</h3>
                      )}
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 break-words">
                        {stripHtml(listing.description)}
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
                              {(listing.projectRole === 'Coordinator' || listing.projectRole === 'Both') && <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-violet-100 text-violet-800">Coordinator</span>}
                              {(listing.projectRole === 'Partner' || listing.projectRole === 'Both') && <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-violet-100 text-violet-800">Partner</span>}
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
                            <span className="text-[9px] font-extrabold bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-1 rounded-full">{formatDate(listing.partnerSearchDeadline)}</span>
                          </div>
                        )}
                      </div>
                      {listing.thematicAreas && listing.thematicAreas.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                          {listing.thematicAreas.slice(0, 2).map((area) => (
                            <span key={area} className="text-[9.5px] font-bold text-brand-primary/80 bg-blue-50/40 px-2 py-0.5 rounded-full">#{area}</span>
                          ))}
                          {listing.thematicAreas.length > 2 && (
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">+{listing.thematicAreas.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {orgListings.map((listing) => {
                const flag = listing.countryFlag || '🇪🇺';
                return (
                  <div
                    key={listing.id}
                    onClick={() => onViewListing(listing.id)}
                    className="group bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm p-4 cursor-pointer transition-all flex items-center gap-4"
                  >
                    {listing.submitterProfile?.logoUrl ? (
                      <img src={listing.submitterProfile.logoUrl} alt={listing.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-contain border border-slate-100 bg-white p-1 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                        {listing.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-slate-800 text-sm">{listing.title || listing.name}</p>
                        {listing.keyActions.map((ka) => (
                          <span key={ka} className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">{ka}</span>
                        ))}
                        {listing.projectRole && (listing.projectRole === 'Coordinator' || listing.projectRole === 'Both') && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-violet-100 text-violet-800">Coordinator</span>
                        )}
                        {listing.projectRole && (listing.projectRole === 'Partner' || listing.projectRole === 'Both') && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-violet-100 text-violet-800">Partner</span>
                        )}
                        {listing.sectors && listing.sectors.map((sector) => (
                          <span key={sector} className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">{sector}</span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
                        <span>{flag}</span>
                        <span>{listing.country}{listing.submitterProfile?.city ? `, ${listing.submitterProfile.city}` : ''}</span>
                      </p>
                      {listing.thematicAreas && listing.thematicAreas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {listing.thematicAreas.slice(0, 2).map((area) => (
                            <span key={area} className="text-[9px] font-bold text-brand-primary/80 bg-blue-50/40 px-2 py-0.5 rounded-full">#{area}</span>
                          ))}
                          {listing.thematicAreas.length > 2 && (
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">+{listing.thematicAreas.length - 2} more</span>
                          )}
                        </div>
                      )}
                    </div>
                    {listing.partnerSearchDeadline && (
                      <span className="text-[9px] font-extrabold bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-1 rounded-full shrink-0">
                        {formatDate(listing.partnerSearchDeadline)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
