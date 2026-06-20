/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Listing, KeyAction } from '../types';
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Globe, 
  Calendar, 
  Languages, 
  Tags, 
  Building2, 
  ExternalLink,
  Hash,
  Award,
  FolderOpen,
  Target
} from 'lucide-react';

interface DetailViewProps {
  listing: Listing;
  onBack: () => void;
}

export default function ListingDetailView({ listing, onBack }: DetailViewProps) {
  // Graceful fallback helper to support migrated/sub-profile architecture gracefully
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
    
    // Set both to midnight to count whole days accurately
    deadline.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <span className="text-red-600 font-bold">Expired</span>;
    } else if (diffDays === 0) {
      return <span className="text-orange-600 font-bold">Expires Today</span>;
    } else if (diffDays === 1) {
      return <span className="text-slate-600 font-semibold">1 day remaining</span>;
    }
    return <span className="text-slate-600 font-semibold">{diffDays} days remaining</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in font-sans">
      {/* Back to Directory Button */}
      <div>
        <button
          id="detail-back-button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-bold text-slate-600 hover:text-brand-primary bg-white px-4 py-2.5 rounded-xl border border-blue-50 hover:border-blue-150 shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[24px] border border-blue-50/80 shadow-sm overflow-hidden">
        {/* Full-width Image top banner */}
        <div className="relative h-64 sm:h-96 w-full bg-slate-100">
          {listing.thumbnailUrl ? (
            <img
              src={listing.thumbnailUrl}
              alt={listing.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-primary to-blue-700" />
          )}
          {/* Cover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          
          {/* Floating badge inside banner */}
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center space-x-1.5 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                <span>{listing.countryFlag || '🇪🇺'}</span>
                <span>{listing.country}</span>
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {listing.name}
              </h1>
            </div>

            {/* Quick URL shortcut */}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-sm transition-all"
              >
                <span>Visit Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Content Section Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-8">
          {/* Main Side - Left (2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">
                Project Call Description
              </h2>
              <div
                className="text-slate-600 text-sm leading-relaxed prose prose-sm max-w-none prose-headings:text-slate-800 prose-a:text-brand-primary prose-strong:text-slate-800"
                dangerouslySetInnerHTML={{ __html: listing.description }}
              />
            </div>

            {/* Thematic Areas */}
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

            {/* Languages Spoken */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <Languages className="w-5 h-5 text-green-600" />
                <span>Working Languages Spoken</span>
              </h3>
              <div id="detail-languages" className="flex flex-wrap gap-2">
                {profile.languagesSpoken.map((lang) => (
                  <span
                    key={lang}
                    className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-100"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Side - Right (1 Column) */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-[20px] p-6 border border-slate-150 space-y-6">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-200 pb-3">
                Key Credentials
              </h3>

              {/* Specs */}
              <div className="space-y-4 text-sm font-medium text-slate-600">
                {/* Org Type */}
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-white text-slate-500 rounded-xl shadow-sm">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Type</p>
                    <p className="text-slate-800 font-bold">{listing.type}</p>
                  </div>
                </div>

                {/* Project Role */}
                {listing.projectRole && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-white text-slate-500 rounded-xl shadow-sm">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Project Role</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {(listing.projectRole === 'Coordinator' || listing.projectRole === 'Both') && (
                          <span className="text-xs font-bold text-purple-700">🎯 Coordinator</span>
                        )}
                        {(listing.projectRole === 'Partner' || listing.projectRole === 'Both') && (
                          <span className="text-xs font-bold text-teal-700">🤝 Partner</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Country */}
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-white text-slate-500 rounded-xl shadow-sm">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Location</p>
                    <p className="text-slate-800 font-bold">
                      {profile.city ? `${profile.city}, ` : ''}{listing.country}
                    </p>
                  </div>
                </div>

                {/* Founded */}
                {profile.foundedYear && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-white text-slate-500 rounded-xl shadow-sm">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Founded In</p>
                      <p className="text-slate-800 font-bold">{profile.foundedYear}</p>
                    </div>
                  </div>
                )}

                {/* OID Number */}
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-white text-slate-500 rounded-xl shadow-sm">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">OID Number</p>
                    <p className={profile.oid ? "text-slate-800 font-bold animate-fade-in" : "text-slate-400 italic text-sm"}>
                      {profile.oid || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Experience Level */}
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-white text-slate-500 rounded-xl shadow-sm">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience</p>
                    <p className="text-slate-800 font-bold">{profile.experienceLevel}</p>
                  </div>
                </div>

                {/* Previous Projects */}
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-white text-slate-500 rounded-xl shadow-sm">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Past Projects</p>
                    <p className="text-slate-800 font-bold">{profile.previousProjects}</p>
                  </div>
                </div>
              </div>

              {/* Target Key Actions badge row */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Target Erasmus+ Projects
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {listing.keyActions.map((action) => (
                    <span
                      key={action}
                      className={`text-xs font-extrabold px-3 py-1.5 rounded-lg ${getKeyActionBadgeStyle(action)}`}
                    >
                      {action}
                    </span>
                  ))}
                </div>
                {listing.sectors && listing.sectors.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Erasmus+ Sectors</p>
                    <div className="flex flex-wrap gap-1.5">
                      {listing.sectors.map((sector) => (
                        <span
                          key={sector}
                          className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200"
                        >
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Partner Search Deadline Info Box */}
              {listing.partnerSearchDeadline && (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-orange-700">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wide">Partner Search Deadline</span>
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold text-sm">
                      {formatDate(listing.partnerSearchDeadline)}
                    </p>
                    <p className="text-xs mt-1">
                      {getDeadlineCountdown(listing.partnerSearchDeadline)}
                    </p>
                  </div>
                </div>
              )}

              {/* CTA Mailto Contact button */}
              <div className="pt-4 border-t border-slate-200">
                <a
                  id="contact-mailto-button"
                  href={`mailto:${listing.contactEmail}?subject=Erasmus+ Partnership Enquiry via PartnerMatch`}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white py-3.5 rounded-brand font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 text-center cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-brand-accent shrink-0" />
                  <span>Initiate Inquiry</span>
                </a>
                <p className="text-center text-[10px] text-slate-400 mt-2">
                  Send directly to: <span className="font-semibold">{listing.contactEmail}</span>
                </p>
              </div>
            </div>

            {/* Safety/Cooperation Guidelines Advice */}
            <div className="bg-blue-50/40 rounded-xl p-4 border border-blue-100 text-xs text-slate-500 leading-relaxed space-y-2">
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
