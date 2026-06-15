import React from 'react';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Globe,
  Languages,
  Building2,
  Hash,
  Award,
  FolderOpen,
  FileText,
  Calendar,
} from 'lucide-react';
import { Listing, KeyAction } from '../types';
import { ProfileWithUid } from '../hooks/useProfiles';

interface OrgProfileFromProfileProps {
  profile: ProfileWithUid;
  listings: Listing[];
  onBack: () => void;
  onViewListing: (id: string) => void;
}

export default function OrgProfileFromProfile({
  profile,
  listings,
  onBack,
  onViewListing,
}: OrgProfileFromProfileProps) {

  // Only show active listings for this organisation
  const orgListings = listings.filter(
    (l) => (l as any).submittedBy === profile.uid && l.status === 'active'
  );

  const getKeyActionBadgeStyle = (action: KeyAction) => {
    switch (action) {
      case 'KA1':
        return 'bg-blue-100 text-blue-800 border-blue-200 font-extrabold';
      case 'KA210':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 font-extrabold';
      case 'KA220':
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
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="org-profile-from-profile-root">
      {/* Back button */}
      <button
        id="btn-back-to-orgs"
        onClick={onBack}
        className="flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-brand-primary transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Organisations</span>
      </button>

      <div className="bg-white rounded-[24px] border border-blue-50/80 shadow-md overflow-hidden" id="org-profile-card">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-brand-primary to-blue-700 p-8 text-white">
          {profile.logoUrl && (
            <div className="absolute -bottom-8 left-8 w-16 h-16 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
              <img src={profile.logoUrl} alt={profile.organisationName} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
            </div>
          )}
          <div className={profile.logoUrl ? 'pl-0' : ''}>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-2xl">{profile.countryFlag}</span>
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">{profile.organisationType}</span>
            </div>
            <h1 className="text-2xl font-extrabold">{profile.organisationName}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-blue-100">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.city}, {profile.country}</span>
              </span>
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{profile.contactEmail}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-8 ${profile.logoUrl ? 'pt-12' : ''}`}>

          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-brand-primary shrink-0" />
                <span>About This Organisation</span>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {profile.description}
              </p>
            </div>

            {/* Active Listings */}
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
                            {listing.description.slice(0, 100)}{listing.description.length > 100 ? '...' : ''}
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
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">

            {/* Quick Facts */}
            <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Organisation Details</h3>
              <div className="space-y-2.5 text-sm">
                {profile.foundedYear && (
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Founded {profile.foundedYear}</span>
                  </div>
                )}
                {profile.oid && (
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Hash className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>OID: {profile.oid}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-slate-600">
                  <Award className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{profile.experienceLevel}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <FolderOpen className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{profile.previousProjects} previous projects</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{profile.sector}</span>
                </div>
              </div>
            </div>

            {/* Languages */}
            {profile.languagesSpoken && profile.languagesSpoken.length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center space-x-2">
                  <Languages className="w-4 h-4" />
                  <span>Languages</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.languagesSpoken.map((lang) => (
                    <span
                      key={lang}
                      className="text-xs font-semibold bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <a
              id="btn-contact-organisation"
              href={`mailto:${profile.contactEmail}`}
              className="flex items-center justify-center space-x-2 w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Organisation</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
