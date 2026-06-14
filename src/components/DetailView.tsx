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
  ExternalLink 
} from 'lucide-react';

interface DetailViewProps {
  listing: Listing;
  onBack: () => void;
}

export default function DetailView({ listing, onBack }: DetailViewProps) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Back to Directory Button */}
      <div>
        <button
          id="detail-back-button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-bold text-slate-600 hover:text-brand-primary bg-white px-4 py-2.5 rounded-xl border border-blue-50 hover:border-blue-150 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[24px] border border-blue-50/80 shadow-sm overflow-hidden">
        {/* Full-width Image top banner */}
        <div className="relative h-64 sm:h-96 w-full bg-slate-100">
          <img
            src={listing.thumbnailUrl}
            alt={listing.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
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
            {listing.website && (
              <a
                href={listing.website}
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
                About the Organisation
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
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
                {listing.languagesSpoken.map((lang) => (
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

                {/* Country */}
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-white text-slate-500 rounded-xl shadow-sm">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Location</p>
                    <p className="text-slate-800 font-bold">
                      {listing.city ? `${listing.city}, ` : ''}{listing.country}
                    </p>
                  </div>
                </div>

                {/* Founded */}
                {listing.foundedYear && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-white text-slate-500 rounded-xl shadow-sm">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Founded In</p>
                      <p className="text-slate-800 font-bold">{listing.foundedYear}</p>
                    </div>
                  </div>
                )}
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
              </div>

              {/* CTA Mailto Contact button */}
              <div className="pt-4 border-t border-slate-200">
                <a
                  id="contact-mailto-button"
                  href={`mailto:${listing.contactEmail}?subject=Erasmus+ Partnership Enquiry via ErasmusMatch`}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white py-3.5 rounded-brand font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 text-center cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-brand-accent animate-pulse" />
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
