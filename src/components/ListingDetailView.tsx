/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Listing, KeyAction, OrganisationProfile } from '../types';
import FavouriteButton from './FavouriteButton';
import ExpressInterestModal from './ExpressInterestModal';
import { checkExistingRequest } from '../services/firebase/firestore';
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Globe, 
  Calendar, 
  Languages, 
  Tags
} from 'lucide-react';

interface ListingDetailProps {
  listing: Listing;
  onBack: () => void;
  onViewOrganisation: (listingId: string) => void;
  currentUserUid?: string | null;
  currentUserProfile?: OrganisationProfile | null;
}

export default function ListingDetailView({ listing, onBack, onViewOrganisation, currentUserUid, currentUserProfile }: ListingDetailProps) {
  const [interestModalOpen, setInterestModalOpen] = React.useState(false);
  const [alreadySent, setAlreadySent] = React.useState(false);

  React.useEffect(() => {
    if (!currentUserUid || !listing.id) return;
    checkExistingRequest(listing.id, currentUserUid).then(setAlreadySent);
  }, [currentUserUid, listing.id]);

  const isOwnListing = currentUserUid && (listing as any).submittedBy === currentUserUid;
  const canExpressInterest = currentUserUid && currentUserProfile && !isOwnListing && listing.status === 'active';
  const profile = listing.submitterProfile || {
    organisationName: listing.name,
    organisationType: listing.type,
    country: listing.country,
    countryFlag: listing.countryFlag,
    city: (listing as any).city || '',
    website: (listing as any).website || '',
    foundedYear: (listing as any).foundedYear || '',
    oid: (listing as any).oid || '',
    experienceLevel: (listing as any).experienceLevel || 'First-timer',
    previousProjects: (listing as any).previousProjects || '0',
    languagesSpoken: (listing as any).languagesSpoken || ['English'],
    contactEmail: listing.contactEmail,
    logoUrl: '',
    description: '',
    showEmailOnProfile: true,
    showLocationOnProfile: true,
    profilePublic: true,
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

  const getDeadlineCountdown = (deadlineStr: string) => {
    if (!deadlineStr) return null;
    const deadline = new Date(deadlineStr);
    const today = new Date();
    deadline.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return <span className="text-red-600 font-bold">Expired</span>;
    } else if (diffDays === 0) {
      return <span className="text-orange-600 font-bold">Expires today</span>;
    } else if (diffDays === 1) {
      return <span className="text-slate-600 font-semibold">1 day remaining</span>;
    }
    return <span className="text-slate-600 font-semibold">{diffDays} days remaining</span>;
  };

  const getRelativeTime = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    const diffMs = Date.now() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Posted today';
    if (diffDays === 1) return 'Posted 1 day ago';
    if (diffDays < 30) return `Posted ${diffDays} days ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return 'Posted 1 month ago';
    return `Posted ${diffMonths} months ago`;
  };

  const getInitials = (name: string) => {
    if (!name) return 'EU';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in font-sans">
        <button
          id="detail-back-button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-bold text-slate-600 hover:text-brand-primary bg-white px-4 py-2.5 rounded-xl border border-blue-50 hover:border-blue-150 shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>

      <div className="bg-white rounded-[24px] border border-blue-50/80 shadow-sm overflow-hidden p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                  {listing.title || listing.name}
                </h1>
                <FavouriteButton listingId={listing.id} currentUserUid={currentUserUid ?? null} size="md" />
              </div>
              <p className="text-xs text-slate-400 font-semibold">
                {getRelativeTime(listing.createdAt)}
                {listing.createdAt && listing.partnerSearchDeadline ? ' · ' : ''}
                {listing.partnerSearchDeadline ? `Deadline ${formatDate(listing.partnerSearchDeadline)}` : ''}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-100 px-4 py-1 flex flex-col">
              {listing.keyActions.length > 0 && (
                <div className="flex items-center gap-3 py-2.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[52px] shrink-0">Key Action</span>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.keyActions.map((action) => (
                      <span key={action} className="text-[9px] font-extrabold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {listing.projectRole && (
                <div className="border-t border-slate-100 flex items-center gap-3 py-2.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[52px] shrink-0">Role</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(listing.projectRole === 'Coordinator' || listing.projectRole === 'Both') && (
                      <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-md bg-violet-100 text-violet-800">Coordinator</span>
                    )}
                    {(listing.projectRole === 'Partner' || listing.projectRole === 'Both') && (
                      <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-md bg-violet-100 text-violet-800">Partner</span>
                    )}
                  </div>
                </div>
              )}
              {listing.sectors && listing.sectors.length > 0 && (
                <div className="border-t border-slate-100 flex items-center gap-3 py-2.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[52px] shrink-0">Sector</span>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.sectors.map((sector) => (
                      <span key={sector} className="text-[9px] font-extrabold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">
                Project Call Description
              </h2>
              <div
                className="text-slate-600 text-sm leading-relaxed prose prose-sm max-w-none prose-headings:text-slate-800 prose-a:text-brand-primary prose-strong:text-slate-800 font-medium"
                dangerouslySetInnerHTML={{ __html: listing.description }}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <Tags className="w-5 h-5 text-brand-primary" />
                <span>Selected Thematic Focus</span>
              </h3>
              <div id="detail-thematics" className="flex flex-wrap gap-2">
                {listing.thematicAreas.map((area) => (
                  <span
                    key={area}
                    className="bg-blue-50/70 hover:bg-blue-100/70 text-brand-primary text-xs font-bold px-4 py-2 rounded-xl transition-colors border border-blue-100/40"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>


          </div>

          <div className="space-y-6 lg:sticky lg:top-8">
            <div className="bg-slate-50 rounded-[20px] p-6 border border-slate-100 space-y-5">
              <div className="flex items-center space-x-3">
                {profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt={`${profile.organisationName} logo`}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-white shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-brand-primary font-bold text-sm flex items-center justify-center shrink-0">
                    {getInitials(profile.organisationName)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{profile.organisationName}</p>
                  <p className="text-xs text-slate-500 font-medium">{listing.type} · {listing.country}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 font-medium">
                {(profile.showEmailOnProfile ?? true) && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{listing.contactEmail}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:underline truncate"
                    >
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-1">
                {(profile.showEmailOnProfile ?? true) ? (
                  <a
                    id="contact-mailto-button"
                    href={`mailto:${listing.contactEmail}?subject=Erasmus+ Partnership Enquiry via PartnerMatch`}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white py-3 rounded-brand font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 text-center cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-brand-accent shrink-0" />
                    <span>Contact Organisation</span>
                  </a>
                ) : (
                  <div className="w-full flex items-center justify-center py-3 rounded-xl text-sm text-slate-400 border border-dashed border-slate-200 font-medium">
                    Contact details hidden by organisation
                  </div>
                )}
            {canExpressInterest && (
              <button
                onClick={() => setInterestModalOpen(true)}
                disabled={alreadySent}
                className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border-2 ${
                  alreadySent
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600 cursor-not-allowed'
                    : 'border-brand-primary bg-white text-brand-primary hover:bg-blue-50'
                }`}
              >
                {alreadySent ? (
                  <span>✓ Interest Already Sent</span>
                ) : (
                  <span>🤝 Express Interest</span>
                )}
              </button>
            )}

            {interestModalOpen && currentUserProfile && (
              <ExpressInterestModal
                isOpen={interestModalOpen}
                onClose={() => { setInterestModalOpen(false); setAlreadySent(true); }}
                listingId={listing.id}
                listingTitle={listing.title || listing.name}
                toOrgUid={(listing as any).submittedBy || ''}
                toOrgName={listing.name}
                toOrgEmail={listing.contactEmail}
                fromOrgUid={currentUserUid!}
                fromProfile={currentUserProfile}
              />
            )}

                <button
                  type="button"
                  onClick={() => onViewOrganisation(listing.id)}
                  className="w-full inline-flex items-center justify-center py-3 rounded-brand font-bold text-sm text-slate-600 border border-slate-200 hover:bg-white transition-all cursor-pointer"
                >
                  View Full Profile
                </button>
              </div>
            </div>

            {profile.description && (
              <div className="bg-white rounded-[20px] p-6 border border-slate-100 space-y-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
                  About the Organisation
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {profile.description.length > 200 ? profile.description.slice(0, 200) + '...' : profile.description}
                </p>
              </div>
            )}

            <div className="bg-white rounded-[20px] p-6 border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
                Organisation Details
              </h3>
              <div className="space-y-3">
                {listing.sectors && listing.sectors.length > 0 && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wide shrink-0">Sector</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {listing.sectors.map((sector) => (
                        <span key={sector} className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">Location</span>
                  <span className="text-slate-800 font-bold text-xs">
                    {(profile.showLocationOnProfile ?? true) && profile.city
                      ? `${profile.city}, ${listing.country}`
                      : listing.country}
                  </span>
                </div>
                {profile.experienceLevel && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">Experience</span>
                    <span className="text-slate-800 font-bold text-xs">{profile.experienceLevel}</span>
                  </div>
                )}
              </div>
            </div>

            {profile.languagesSpoken && profile.languagesSpoken.length > 0 && (
              <div className="bg-white rounded-[20px] p-6 border border-slate-100 space-y-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
                  Working Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.languagesSpoken.map((lang) => (
                    <span key={lang} className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-100">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50/40 rounded-xl p-4 border border-blue-100 text-xs text-slate-500 leading-relaxed space-y-2 font-medium">
              <span className="font-bold text-brand-primary">💡 Partnership Advice</span>
              <p>
                When contacting potential Erasmus+ partners, remember to attach your organisation's PIF (Partner Information Form) and clearly outline the draft idea or role you expect them to fulfill inside the consortia.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
