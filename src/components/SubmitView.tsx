/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Listing, KeyAction, OrganisationProfile } from '../types';
import { COUNTRIES, THEMATIC_AREAS, ERASMUS_SECTORS } from '../data';
import RichTextEditor from './RichTextEditor';
import { 
  CloudUpload, 
  Sparkles, 
  MapPin, 
  Mail, 
  Check, 
  PlusCircle, 
  ArrowRight, 
  FileCheck,
  Building,
  AlertCircle,
  Info
} from 'lucide-react';

interface SubmitViewProps {
  organisationProfile: OrganisationProfile | null;
  onSubmitListing: (listing: Listing) => void;
  onNavigate: (view: string) => void;
  onSelectListing: (id: string) => void;
}

export default function SubmitView({ 
  organisationProfile, 
  onSubmitListing, 
  onNavigate, 
  onSelectListing 
}: SubmitViewProps) {
  // Safe fallback if profile is somehow null (e.g., initial render of preview)
  const profile = organisationProfile;

  // Form values specific to listings
  const [selectedKeyActions, setSelectedKeyActions] = useState<KeyAction[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedThematics, setSelectedThematics] = useState<string[]>([]);
  const [partnerSearchDeadline, setPartnerSearchDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [projectRole, setProjectRole] = useState<'Coordinator' | 'Partner' | 'Both' | ''>('');

  // Pre-fill contact email once profile loads
  useEffect(() => {
    if (profile) {
      setContactEmail(profile.contactEmail);
    }
  }, [profile]);

  // Image upload
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Success states
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdId, setCreatedId] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Local file change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Checkbox state toggles
  const handleKeyActionToggle = (action: KeyAction) => {
    setSelectedKeyActions((prev) => 
      prev.includes(action) ? prev.filter((x) => x !== action) : [...prev, action]
    );
  };

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((x) => x !== sector) : [...prev, sector]
    );
  };

  const handleThematicToggle = (area: string) => {
    setSelectedThematics((prev) => 
      prev.includes(area) ? prev.filter((x) => x !== area) : [...prev, area]
    );
  };

  // Validation & Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!profile) {
      errors.push('No active organisation profile found. Please set up your profile first.');
      setFormErrors(errors);
      return;
    }

    if (selectedKeyActions.length === 0) {
      errors.push('Select at least one Key Action (e.g. KA1, KA2, KA3).');
    }
    if (!projectRole) {
      errors.push('Please select your role in this project.');
    }
    if (selectedSectors.length === 0) {
      errors.push('Select at least one Erasmus+ Sector.');
    }
    if (selectedThematics.length === 0) {
      errors.push('Select at least one Thematic Area.');
    }
    if (!partnerSearchDeadline) {
      errors.push('Please select a partner search deadline.');
    } else {
      const selectedDate = new Date(partnerSearchDeadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        errors.push('Partner search deadline must be a future date.');
      }
    }
    if (!description.trim()) {
      errors.push('Please provide a partner search description.');
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      errors.push('A valid contact email is required.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      document.getElementById('form-error-alert')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setFormErrors([]);

    const newId = `user-org-${Date.now()}`;

    // Construct listing matching specs in Part 4
    const newListing: Listing = {
      id: newId,
      name: profile.organisationName,
      type: profile.organisationType,
      country: profile.country,
      countryFlag: profile.countryFlag,
      keyActions: selectedKeyActions,
      sectors: selectedSectors,
      thematicAreas: selectedThematics,
      contactEmail: contactEmail.trim(),
      thumbnailUrl: previewUrl || `https://picsum.photos/800/600?random=${Date.now()}`,
      description: description.trim(),
      partnerSearchDeadline: partnerSearchDeadline,
      views: 0,
      createdAt: new Date().toISOString(),
      status: 'pending',
      projectRole: projectRole as 'Coordinator' | 'Partner' | 'Both',
      submitterProfile: profile,
    };

    onSubmitListing(newListing);
    setCreatedId(newId);
    setIsSuccess(true);
  };

  const resetFormState = () => {
    setSelectedKeyActions([]);
    setSelectedSectors([]);
    setSelectedThematics([]);
    setDescription('');
    setPartnerSearchDeadline('');
    setProjectRole('');
    setPreviewUrl(null);
    setIsSuccess(false);
    setCreatedId('');
    setFormErrors([]);
    if (profile) {
      setContactEmail(profile.contactEmail);
    }
  };

  // Key action color badge helper
  const getKeyActionBadgeStyle = (action: KeyAction) => {
    switch (action) {
      case 'KA1':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'KA2':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'KA3':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  // Success output
  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8 animate-fade-in">
        <div className="mx-auto w-20 h-20 bg-green-150 text-green-600 rounded-full flex items-center justify-center shadow-md">
          <FileCheck className="w-10 h-10" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-800">Partner Call Published!</h1>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Your Erasmus+ partner search listing has been successfully generated and compiled into our client directory. Other partners can locate you now.
          </p>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-blue-10/40 shadow-sm flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            id="success-view-proposal"
            onClick={() => onSelectListing(createdId)}
            className="flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-3 rounded-brand font-bold text-sm transition-all cursor-pointer"
          >
            <span>View Partner Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            id="success-create-new"
            onClick={resetFormState}
            className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-brand font-bold text-sm border border-slate-200 transition-all cursor-pointer"
          >
            <span>Submit Another</span>
          </button>
        </div>
      </div>
    );
  }

  // Guard view if profile not loaded
  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-850">Profile Setup Required</h2>
        <p className="text-slate-500 text-sm">
          You need an active Organisation Profile to submit partner searches.
        </p>
        <button
          onClick={() => onNavigate('profile-setup')}
          className="bg-brand-primary text-white text-xs px-4 py-2 rounded-brand font-bold cursor-pointer"
        >
          Set Up Profile Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <section className="bg-brand-bg py-6 px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Post a Partner Search Listing</h1>
          <p className="text-base text-slate-500 font-medium max-w-2xl mx-auto mt-3">
            Publish your project details to find the exact European partners you need.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Panel (7 Columns) */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[24px] border border-blue-50/80 shadow-sm space-y-8">
          
          {/* Form Error Panel */}
          {formErrors.length > 0 && (
            <div id="form-error-alert" className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm space-y-1">
              <div className="flex items-center space-x-2 font-bold mb-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>Please fix the following issues:</span>
              </div>
              <ul className="list-disc pl-5 text-xs">
                {formErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 1 — Organisation Preview (read-only, locked) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <Building className="w-5 h-5 text-brand-primary" />
              <span>Submitting As</span>
            </h2>

            <div className="bg-slate-50 border border-slate-205 rounded-[16px] p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-850 text-base">{profile.organisationName}</h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5 flex items-center space-x-1">
                    <span>{profile.countryFlag}</span>
                    <span>{profile.city}, {profile.country}</span>
                  </p>
                </div>
                <span className="bg-brand-primary text-white text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                  {profile.organisationType}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 pt-2 border-t border-slate-100 text-xs text-slate-650 font-medium">
                <div>
                  <span className="text-slate-400 font-bold">Sector:</span> {profile.sector}
                </div>
                <div>
                  <span className="text-slate-400 font-bold">OID:</span> {profile.oid || 'Not Provided'}
                </div>
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="text-slate-400 font-bold">Experience:</span>
                  <span>{profile.experienceLevel}</span>
                  <span className="bg-blue-50 text-brand-primary text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {profile.sector}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => onNavigate('my-profile')}
                  className="text-xs font-bold text-brand-primary hover:underline cursor-pointer"
                >
                  Not correct? Update your profile
                </button>
              </div>
            </div>
          </div>

          {/* Section 2 — Listing Visual */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <span className="w-5 h-5 text-sm font-black bg-brand-primary/10 text-brand-primary rounded-full inline-flex items-center justify-center">1</span>
              <span>Banner Visual Thumbnail</span>
            </h2>

            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Landscape Thumbnail Image</span>
              
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-brand-primary rounded-[20px] p-8 text-center bg-slate-50 hover:bg-blue-50/10 cursor-pointer transition-all duration-300 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="relative max-w-xs mx-auto rounded-lg overflow-hidden border shadow-sm">
                    <img
                      src={previewUrl}
                      alt="Uploaded Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 hover:bg-slate-900/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold">Replace Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-white text-slate-400 rounded-xl flex items-center justify-center shadow-xs group-hover:text-brand-primary group-hover:scale-110 transition-transform">
                      <CloudUpload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Drag & drop your files, or <span className="text-brand-primary hover:underline">browse</span></p>
                      <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG landscapes up to 5MB. Self-generated fallback used if left blank.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3 — Partner Search Details */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <span className="w-5 h-5 text-sm font-black bg-brand-primary/10 text-brand-primary rounded-full inline-flex items-center justify-center">2</span>
              <span>Partner Search Details</span>
            </h2>

            {/* Project Role Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Your Role in This Project *
              </label>
              <p className="text-[11px] text-slate-400 font-medium">
                Are you looking for partners to join your project, or are you open to joining someone else's project?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (projectRole === 'Coordinator') setProjectRole('');
                    else if (projectRole === 'Partner') setProjectRole('Both');
                    else if (projectRole === 'Both') setProjectRole('Partner');
                    else setProjectRole('Coordinator');
                  }}
                  className={`p-4 rounded-[16px] border-2 text-left transition-all cursor-pointer ${
                    projectRole === 'Coordinator' || projectRole === 'Both'
                      ? 'border-brand-primary bg-blue-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${projectRole === 'Coordinator' || projectRole === 'Both' ? 'bg-brand-primary border-brand-primary' : 'border-slate-300'}`}>
                      {(projectRole === 'Coordinator' || projectRole === 'Both') && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                    </div>
                    <div className="font-bold text-sm text-slate-800">🎯 Coordinator</div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">I am leading a project and looking for partner organisations to join my consortium</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (projectRole === 'Partner') setProjectRole('');
                    else if (projectRole === 'Coordinator') setProjectRole('Both');
                    else if (projectRole === 'Both') setProjectRole('Coordinator');
                    else setProjectRole('Partner');
                  }}
                  className={`p-4 rounded-[16px] border-2 text-left transition-all cursor-pointer ${
                    projectRole === 'Partner' || projectRole === 'Both'
                      ? 'border-brand-primary bg-blue-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-305'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${projectRole === 'Partner' || projectRole === 'Both' ? 'bg-brand-primary border-brand-primary' : 'border-slate-300'}`}>
                      {(projectRole === 'Partner' || projectRole === 'Both') && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                    </div>
                    <div className="font-bold text-sm text-slate-800">🤝 Partner</div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">I am open to joining another organisation's project as a partner in their consortium</div>
                </button>
              </div>
            </div>

            {/* Key Actions KeyAction toggle representation */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Key Actions Target Projects * (Select at least 1)</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['KA1', 'KA2', 'KA3'].map((action) => {
                  const isChecked = selectedKeyActions.includes(action as KeyAction);
                  return (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleKeyActionToggle(action as KeyAction)}
                      className={`px-4 py-3 rounded-xl text-xs font-bold border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{action}</span>
                        <span className={`text-[10px] mt-0.5 font-normal opacity-80 ${isChecked ? 'text-slate-200' : 'text-slate-400'}`}>
                          {action === 'KA1' && 'Mobility'}
                          {action === 'KA2' && 'Cooperation'}
                          {action === 'KA3' && 'Policy'}
                        </span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isChecked ? 'border-brand-accent bg-brand-accent text-white' : 'border-slate-350'}`}>
                        {isChecked && <Check className="w-3 h-3 text-slate-900 stroke-[4px]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Erasmus+ Sectors */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Erasmus+ Sectors * (Select at least 1)</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {ERASMUS_SECTORS.map((sector) => {
                  const isChecked = selectedSectors.includes(sector);
                  return (
                    <button
                      key={sector}
                      type="button"
                      title={sector}
                      onClick={() => handleSectorToggle(sector)}
                      className={`px-3 py-2.5 rounded-lg text-xs font-semibold text-left flex items-center space-x-2 border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-brand-primary border-brand-primary text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-white border-white' : 'border-slate-300'
                      }`}>
                        {isChecked && (
                          <Check className="w-2.5 h-2.5 text-brand-primary stroke-[3px]" />
                        )}
                      </div>
                      <span>{sector}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Thematics Selection checkboxes */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Main Thematic Topics * (Select at least 1)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 h-64 overflow-y-auto pr-2 border border-slate-150 rounded-xl bg-slate-50 p-4">
                {THEMATIC_AREAS.map((area) => {
                  const isChecked = selectedThematics.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
                      title={area}
                      onClick={() => handleThematicToggle(area)}
                      className={`px-3 py-2.5 rounded-lg text-xs font-semibold text-left flex items-center space-x-2 border transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-brand-primary border-brand-primary text-white' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-white text-brand-primary border-white' : 'border-slate-350'}`}>
                        {isChecked && <Check className="w-2.5 h-2.5 text-brand-primary stroke-[4px]" />}
                      </div>
                      <span className="truncate">{area}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Deadline Date picker */}
            <div className="space-y-1">
              <label htmlFor="form-org-deadline" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Partner Search Deadline *
              </label>
              <input
                id="form-org-deadline"
                type="date"
                required
                value={partnerSearchDeadline}
                onChange={(e) => setPartnerSearchDeadline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-400 font-medium">
                The date you need to find a partner by. Your listing will expire automatically on this date.
              </p>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-605 uppercase tracking-wide">
                  Project Description & Partner Requirements *
                </label>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Describe your project idea, what kind of partner you are looking for, their expected role, and any specific requirements.
              </p>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Describe your project idea, what kind of partner you are looking for, their expected role, and any specific requirements."
              />
            </div>

            {/* Editable Contact Email */}
            <div className="space-y-1">
              <label htmlFor="form-listing-email" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Contact Email Address for this Listing *
              </label>
              <input
                id="form-listing-email"
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder=" erasmus@yourinstitution.org"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-400 font-medium">
                Pre-filled from profile. You can change this if you want specific submissions sent to a different inbox.
              </p>
            </div>
          </div>

          <button
            id="publish-listing-trigger"
            type="submit"
            className="w-full inline-flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white py-4 rounded-brand font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Submit Listing</span>
          </button>
        </form>

        {/* Live Card Preview Panel */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-[11px] text-slate-700 font-medium">
            💡 <span className="font-bold text-slate-800">Dynamic Card Compilation:</span> Below is a live rendering of how your partner listing card compiles in the catalog index as you type.
          </div>

          <div className="bg-white rounded-[20px] overflow-hidden shadow-lg border-2 border-brand-primary max-w-sm mx-auto">
            {/* Visual Header */}
            <div className="relative h-44 bg-slate-150">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Live Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-400">
                  <CloudUpload className="w-10 h-10 mb-1" />
                  <span className="text-[10px] font-bold">Image Preview Placed Here</span>
                </div>
              )}
              {/* Flag Overlay */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-800 flex items-center space-x-1 shadow-sm">
                <span>{profile.countryFlag}</span>
                <span>{profile.country}</span>
              </div>

              <div className="absolute bottom-3 left-3 bg-slate-900/40 backdrop-blur-sm px-2.5 py-0.5 rounded-md text-[9px] font-bold text-white uppercase tracking-wide">
                📍 {profile.city}
              </div>
            </div>

            {/* Visual Body */}
            <div className="p-5 space-y-3">
              <div className="flex flex-wrap gap-1 items-center">
                <span className="bg-slate-100 text-slate-700 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md tracking-wider">
                  {profile.organisationType}
                </span>
                {projectRole && (
                  <>
                    {(projectRole === 'Coordinator' || projectRole === 'Both') && (
                      <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">
                        🎯 Coordinator
                      </span>
                    )}
                    {(projectRole === 'Partner' || projectRole === 'Both') && (
                      <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-700">
                        🤝 Partner
                      </span>
                    )}
                  </>
                )}
                {selectedKeyActions.map((action) => (
                  <span
                    key={action}
                    className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md ${getKeyActionBadgeStyle(action)}`}
                  >
                    {action}
                  </span>
                ))}
              </div>

              <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-1">
                {profile.organisationName}
              </h3>

              <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3 h-[48px]">
                {description.replace(/<[^>]*>/g, '').trim() || 'Provide a partner search description to preview the live rendering text of how potential European partners learn about your priorities and requirements...'}
              </p>

              {/* Tag row */}
              <div className="pt-2.5 border-t border-gray-100 flex flex-wrap gap-1 min-h-[22px]">
                {selectedThematics.slice(0, 2).map((area) => (
                  <span key={area} className="text-[9.5px] font-bold text-brand-primary/80 bg-blue-50/40 px-2 py-0.5 rounded-full">
                    #{area.replace(' & ', '')}
                  </span>
                ))}
                {selectedThematics.length > 2 && (
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1 py-0.5 rounded-full">
                    +{selectedThematics.length - 2}
                  </span>
                )}
              </div>

              <div className="w-full mt-2 inline-flex items-center justify-center space-x-2 bg-brand-primary text-white py-2.5 rounded-brand text-[11px] font-extrabold transition-all shadow-md">
                <span>View Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
