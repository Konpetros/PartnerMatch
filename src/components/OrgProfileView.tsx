/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Listing, KeyAction, OrganisationProfile } from '../types';
import { ProfileWithUid } from '../hooks/useProfiles';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Globe,
  Calendar,
  Languages,
  Building2,
  Hash,
  Award,
  FolderOpen,
  FileText
} from 'lucide-react';

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

  // Determine standard cover/banner image
  const bannerImage = props.listing
    ? props.listing.thumbnailUrl
    : orgListings[0]?.thumbnailUrl;

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in font-sans" id="org-profile-view-root">
      {/* 1. BACK BUTTON */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-bold text-slate-600 hover:text-brand-primary bg-white px-4 py-2.5 rounded-xl border border-blue-50 hover:border-blue-150 shadow-sm transition-all cursor-pointer"
          id="btn-back-to-orgs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Organisations</span>
        </button>
      </div>

      {/* 2. DEDICATED PROFILE CARD CONTAINER */}
      <div className="bg-white rounded-[24px] border border-blue-50/80 shadow-sm overflow-hidden" id="org-profile-card">
        {/* Dynamic Image Hero Banner */}
        <div className="relative h-72 sm:h-96 w-full bg-slate-100">
          {bannerImage ? (
            <img
              src={bannerImage}
              alt={activeProfile.organisationName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-primary to-blue-700" />
          )}
          {/* Cover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Floating tags overlay */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center space-x-1.5 shadow-sm">
            <span>{activeProfile.countryFlag || '🇪🇺'}</span>
            <span>{activeProfile.country}</span>
          </div>

          <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
            {activeProfile.organisationType}
          </div>

          {/* Bottom aligned Overlay headings — logo on the left, text content alongside it */}
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              {/* Organisation Logo box sitting inside the banner, left of the text */}
              {activeProfile.logoUrl && (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-[3px] border-white shadow-xl flex items-center justify-center overflow-hidden p-2.5 shrink-0 ring-1 ring-slate-200/60">
                  <img
                    src={activeProfile.logoUrl}
                    alt={`${activeProfile.organisationName} logo`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}

              <div className="space-y-2 max-w-2xl">
                {renderStatusBadge()}
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {activeProfile.organisationName}
                </h1>
              </div>
            </div>

            {/* Submitter specific website block shortcut layout */}
            {activeProfile.website && (
              <a
                href={activeProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2.5 rounded-xl backdrop-blur-xs transition-all w-max shrink-0"
              >
                <span>Visit Website</span>
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* 3. TWO-COLUMN GRID SEPARATION BELOW HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-8">
          {/* Main Left Columns (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-brand-primary shrink-0" />
                <span>About This Organisation</span>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {activeProfile.description}
              </p>
            </div>

            {/* Render Mode A features: Thematic Areas, Deadlines and Call partner CTA */}
            {props.listing && (
              <>
                {/* Thematics focus block */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>Thematic Focus Areas</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {props.listing.thematicAreas.map((area) => (
                      <span
                        key={area}
                        className="bg-blue-50/70 hover:bg-blue-100/70 text-brand-primary text-xs font-bold px-4 py-2 rounded-xl transition-colors border border-blue-100/40 shadow-2xs"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Call to action container */}
                <div className="pt-2">
                  {activeStatus === 'active' ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-[20px] p-6 space-y-4 shadow-2xs animate-fade-in">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <h4 className="text-base font-extrabold text-blue-900 flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            <span>This organisation is actively looking for partners</span>
                          </h4>
                          <p className="text-xs text-blue-700 font-semibold">
                            Expiring Soon. Submit your partnership inquiry to secure a matching role.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {props.listing.keyActions.map((action) => (
                            <span
                              key={action}
                              className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-md border ${getKeyActionBadgeStyle(action)}`}
                            >
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-blue-200/40 text-xs">
                        <div className="text-blue-700 font-bold flex items-center space-x-1.5">
                          <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                          <span>
                            Partner search deadline: <strong className="text-blue-900 font-black">{formatDate(props.listing.partnerSearchDeadline)}</strong>
                          </span>
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
                    <div className="bg-slate-50 border border-slate-200 rounded-[20px] p-6 text-center shadow-2xs animate-fade-in">
                      <p className="text-sm font-semibold text-slate-500">
                        🔒 This organisation is not currently seeking partners
                      </p>
                      <p className="text-xs text-slate-404 mt-1">
                        Their consortium status is offline or partner vacancies are full.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Render Mode B features: Full list of other active partner calls */}
            {props.profile && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>Active Partner Searches</span>
                  {orgListings.length > 0 && (
                    <span className="ml-auto text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      {orgListings.length} active
                    </span>
                  )}
                </h2>

                {orgListings.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No active partner searches at the moment.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orgListings.map((listing) => (
                      <div
                        key={listing.id}
                        onClick={() => onViewListing(listing.id)}
                        className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl cursor-pointer transition-all group"
                        id={`active-listing-card-${listing.id}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <p className="text-sm font-bold text-slate-800 group-hover:text-brand-primary transition-colors">
                              {(() => {
                                const plain = listing.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                                return plain.length > 100 ? plain.slice(0, 100) + '...' : plain;
                              })()}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {listing.keyActions.map((ka) => (
                                <span
                                  key={ka}
                                  className={`text-[10px] px-2 py-0.5 rounded-full border ${getKeyActionBadgeStyle(ka)}`}
                                >
                                  {ka}
                                </span>
                              ))}
                            </div>
                          </div>
                          {listing.partnerSearchDeadline && (
                            <div className="flex items-center space-x-1 text-xs text-slate-400 shrink-0">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(listing.partnerSearchDeadline)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right sidebar column (1/3 width) */}
          <div className="space-y-6">
            {/* Quick Facts Details Card */}
            <div className="bg-slate-50 rounded-[22px] p-6 border border-slate-100 space-y-6 shadow-2xs">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-200 pb-3">
                Organisation Details
              </h3>

              {/* Dynamic sidebar stats */}
              <div className="space-y-4 text-sm font-medium text-slate-600">
                {/* Org Type */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white text-slate-400 rounded-lg shadow-2xs">
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Type</span>
                    <span className="text-slate-800 font-bold text-xs">{activeProfile.organisationType}</span>
                  </div>
                </div>

                {/* Sector */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white text-slate-400 rounded-lg shadow-2xs">
                    <FileText className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Primary Erasmus+ Sector</span>
                    <span className="text-slate-800 font-bold text-xs">{activeProfile.sector}</span>
                  </div>
                </div>

                {/* City + Country */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white text-slate-400 rounded-lg shadow-2xs">
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Location</span>
                    <span className="text-slate-800 font-bold text-xs">
                      {activeProfile.city ? `${activeProfile.city}, ` : ''}{activeProfile.country}
                    </span>
                  </div>
                </div>

                {/* Founded */}
                {activeProfile.foundedYear && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white text-slate-400 rounded-lg shadow-2xs">
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Founded In</span>
                      <span className="text-slate-800 font-bold text-xs">{activeProfile.foundedYear}</span>
                    </div>
                  </div>
                )}

                {/* OID identifier */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white text-slate-400 rounded-lg shadow-2xs">
                    <Hash className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">OID Number</span>
                    <span className={activeProfile.oid ? "text-slate-800 font-bold text-xs" : "text-slate-400 italic text-xs font-semibold"}>
                      {activeProfile.oid || 'Not provided'}
                    </span>
                  </div>
                </div>

                {/* Experience rating */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white text-slate-400 rounded-lg shadow-2xs">
                    <Award className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Experience</span>
                    <span className="text-slate-800 font-bold text-xs">{activeProfile.experienceLevel}</span>
                  </div>
                </div>

                {/* Past operations projects */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white text-slate-400 rounded-lg shadow-2xs">
                    <FolderOpen className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Past Projects</span>
                    <span className="text-slate-800 font-bold text-xs">{activeProfile.previousProjects}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Languages Sidebar Card */}
            {activeProfile.languagesSpoken && activeProfile.languagesSpoken.length > 0 && (
              <div className="bg-slate-50 rounded-[22px] p-6 border border-slate-100 space-y-4 shadow-2xs">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-3 flex items-center space-x-2">
                  <Languages className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Working Languages</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {activeProfile.languagesSpoken.map((lang) => (
                    <span
                      key={lang}
                      className="text-xs font-bold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl shadow-xs"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Organisation Secure mailto action link */}
            {activeProfile.contactEmail && (
              <div className="bg-slate-50 rounded-[22px] p-6 border border-slate-100 space-y-4 shadow-2xs">
                <a
                  id="btn-contact-organisation"
                  href={`mailto:${activeProfile.contactEmail}?subject=Partnership Inquiry on PartnerMatch`}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white py-3.5 rounded-xl font-bold text-xs transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer text-center"
                >
                  <Mail className="w-4 h-4 text-brand-accent shrink-0" />
                  <span>Contact Organisation</span>
                </a>
                <p className="text-center text-[10px] text-slate-400 mt-1 truncate">
                  Email: <span className="font-semibold">{activeProfile.contactEmail}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
