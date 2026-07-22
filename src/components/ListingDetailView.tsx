/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import DOMPurify from 'dompurify';
import { stripHtml } from '../utils';
import { Listing, KeyAction, OrganisationProfile } from '../types';
import FavouriteButton from './FavouriteButton';
import { formatDate } from '../utils/formatDate';
import ExpressInterestModal from './ExpressInterestModal';
import { checkExistingRequest } from '../services/firebase/firestore';
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Globe, 
  Calendar, 
  Languages, 
  Tags,
  Share2,
  Link2,
  Check,
  Zap,
  Target,
  Users
} from 'lucide-react';
import IconBadge from './IconBadge';

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
  const [shareMenuOpen, setShareMenuOpen] = React.useState(false);
  const [linkCopied, setLinkCopied] = React.useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = listing.title || listing.name;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

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
                <div className="flex items-center gap-2 shrink-0">
                  <FavouriteButton listingId={listing.id} currentUserUid={currentUserUid ?? null} size="md" />
                  <div className="relative">
                    <button
                      onClick={() => setShareMenuOpen(!shareMenuOpen)}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-brand-primary transition-all cursor-pointer"
                      title="Share this listing"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    {shareMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShareMenuOpen(false)} />
                        <div className="absolute right-0 top-12 z-20 bg-white rounded-2xl border border-slate-100 shadow-lg p-2 w-52 space-y-0.5">
                          <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-[#0A66C2] font-black text-sm w-4 text-center">in</span>
                            LinkedIn
                          </a>
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-[#1877F2] font-black text-sm w-4 text-center">f</span>
                            Facebook
                          </a>
                          <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-slate-900 font-black text-sm w-4 text-center">𝕏</span>
                            X
                          </a>
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#25D366">
                              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.75 7.85 19L7.55 18.82L4.43 19.65L5.27 16.61L5.08 16.29C4.24 14.98 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.27 16.46 16.57 20.15 12.04 20.15ZM16.56 13.99C16.32 13.87 15.13 13.28 14.9 13.2C14.68 13.11 14.51 13.07 14.35 13.31C14.19 13.55 13.71 14.11 13.56 14.28C13.42 14.44 13.27 14.46 13.03 14.34C12.79 14.22 12 13.95 11.08 13.13C10.36 12.49 9.87 11.7 9.73 11.46C9.59 11.22 9.71 11.09 9.83 10.97C9.94 10.86 10.08 10.68 10.2 10.53C10.32 10.39 10.36 10.28 10.44 10.11C10.52 9.95 10.48 9.81 10.42 9.69C10.36 9.57 9.87 8.38 9.67 7.89C9.47 7.4 9.27 7.47 9.12 7.47C8.98 7.47 8.81 7.47 8.65 7.47C8.49 7.47 8.24 7.53 8.02 7.77C7.8 8.01 7.19 8.58 7.19 9.77C7.19 10.96 8.04 12.11 8.16 12.28C8.29 12.44 9.87 14.89 12.29 15.94C12.87 16.19 13.32 16.34 13.68 16.45C14.26 16.63 14.79 16.6 15.21 16.54C15.68 16.47 16.65 15.96 16.85 15.4C17.05 14.83 17.05 14.35 16.99 14.24C16.93 14.14 16.8 14.11 16.56 13.99Z"/>
                            </svg>
                            WhatsApp
                          </a>
                          <div className="border-t border-slate-100 my-1" />
                          <button
                            onClick={() => { handleCopyLink(); setShareMenuOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            {linkCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4 text-slate-400" />}
                            {linkCopied ? 'Copied!' : 'Copy Link'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-semibold">
                {getRelativeTime(listing.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {listing.keyActions.map((action) => (
                <IconBadge key={action} icon={Zap} color="blue">{action}</IconBadge>
              ))}
              {listing.sectors && listing.sectors.map((sector) => (
                <IconBadge key={sector} icon={Target} color="emerald">{sector}</IconBadge>
              ))}
              {listing.projectRole && (
                <>
                  {(listing.projectRole === 'Coordinator' || listing.projectRole === 'Both') && (
                    <IconBadge icon={Users} color="violet">Coordinator</IconBadge>
                  )}
                  {(listing.projectRole === 'Partner' || listing.projectRole === 'Both') && (
                    <IconBadge icon={Users} color="violet">Partner</IconBadge>
                  )}
                </>
              )}
              {listing.partnerSearchDeadline && (
                <IconBadge icon={Calendar} color="orange">{formatDate(listing.partnerSearchDeadline)}</IconBadge>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">
                Project Call Description
              </h2>
              <div
                className="text-slate-600 text-sm leading-relaxed prose prose-sm max-w-none prose-headings:text-slate-800 prose-a:text-brand-primary prose-strong:text-slate-800 font-medium"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(listing.description, {
                    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'h2', 'h3', 'ul', 'ol', 'li', 'mark', 'span'],
                    ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'class'],
                  }),
                }}
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
                onClose={() => setInterestModalOpen(false)}
                onSuccess={() => setAlreadySent(true)}
                listingId={listing.id}
                listingTitle={listing.title || listing.name}
                toOrgUid={(listing as any).submittedBy || ''}
                toOrgName={listing.name}
                toOrgEmail={listing.contactEmail}
                toOrgLogo={listing.submitterProfile?.logoUrl || ''}
                toOrgCountry={listing.country}
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

            {profile.description && (() => {
              const plainDescription = stripHtml(profile.description);
              return (
                <div className="bg-white rounded-[20px] p-6 border border-slate-100 space-y-3">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
                    About the Organisation
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {plainDescription.length > 200 ? plainDescription.slice(0, 200) + '...' : plainDescription}
                  </p>
                </div>
              );
            })()}

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


          </div>

        </div>
      </div>
    </div>
  );
}
