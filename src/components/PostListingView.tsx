/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// PostListingView - Submits or edits partner search calls for Erasmus+ projects
import React, { useState, useRef, useEffect } from 'react';
import { Listing, KeyAction, OrganisationProfile } from '../types';
import { COUNTRIES, THEMATIC_AREAS, ERASMUS_SECTORS } from '../data';
import RichTextEditor from './RichTextEditor';
import { 
  Mail, 
  Check, 
  ArrowRight, 
  FileCheck,
  Building,
  AlertCircle
} from 'lucide-react';

interface SubmitViewProps {
  organisationProfile: OrganisationProfile | null;
  onSubmitListing: (listing: Listing) => void;
  onUpdateListing?: (id: string, data: Partial<Listing>) => void;
  editingListing?: Listing | null;
  onNavigate: (view: string) => void;
  onSelectListing: (id: string) => void;
}

export default function PostListingView({ 
  organisationProfile, 
  onSubmitListing, 
  onUpdateListing,
  editingListing,
  onNavigate, 
  onSelectListing 
}: SubmitViewProps) {
  // Safe fallback if profile is somehow null (e.g., initial render of preview)
  const profile = organisationProfile;

  const isEditMode = !!editingListing;

  // Form values specific to listings
  const [selectedKeyActions, setSelectedKeyActions] = useState<KeyAction[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedThematics, setSelectedThematics] = useState<string[]>([]);
  const [partnerSearchDeadline, setPartnerSearchDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [projectRole, setProjectRole] = useState<'Coordinator' | 'Partner' | 'Both' | ''>('');
  const [title, setTitle] = useState('');

  // Pre-fill contact email from profile only when creating a new listing
  useEffect(() => {
    if (profile && !editingListing) {
      setContactEmail(profile.contactEmail);
    }
  }, [profile, editingListing]);

  // Pre-fill all fields when editing an existing listing
  useEffect(() => {
    if (editingListing) {
      setTitle(editingListing.title || '');
      setDescription(editingListing.description || '');
      setSelectedKeyActions(editingListing.keyActions || []);
      setSelectedSectors(editingListing.sectors || []);
      setSelectedThematics(editingListing.thematicAreas || []);
      setPartnerSearchDeadline(editingListing.partnerSearchDeadline || '');
      setProjectRole(editingListing.projectRole || '');
      setContactEmail(editingListing.contactEmail || '');
    }
  }, [editingListing]);

  // Success states
  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
    if (!title.trim()) {
      errors.push('Please provide a title for your partner search listing.');
    }
    if (!description.trim()) {
      errors.push('Please provide a partner search description.');
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      errors.push('A valid contact email is required.');
    }

    if (!agreedToTerms) {
      errors.push('Please agree to the Terms & Conditions and Privacy Policy to submit your listing.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      document.getElementById('form-error-alert')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setFormErrors([]);

    const newListing: Omit<Listing, 'id'> = {
      name: profile.organisationName,
      title: title.trim(),
      type: profile.organisationType,
      country: profile.country,
      countryFlag: profile.countryFlag,
      keyActions: selectedKeyActions,
      sectors: selectedSectors,
      thematicAreas: selectedThematics,
      contactEmail: contactEmail.trim(),
      thumbnailUrl: '',
      description: description.trim(),
      partnerSearchDeadline: partnerSearchDeadline,
      views: 0,
      createdAt: new Date().toISOString(),
      status: 'pending',
      projectRole: projectRole as 'Coordinator' | 'Partner' | 'Both',
      submitterProfile: profile,
    };

    if (isEditMode && editingListing && onUpdateListing) {
      const updatedData: Partial<Listing> = {
        name: profile.organisationName,
        title: title.trim(),
        type: profile.organisationType,
        country: profile.country,
        countryFlag: profile.countryFlag,
        keyActions: selectedKeyActions,
        sectors: selectedSectors,
        thematicAreas: selectedThematics,
        contactEmail: contactEmail.trim(),
        description: description.trim(),
        partnerSearchDeadline: partnerSearchDeadline,
        status: 'pending',
        projectRole: projectRole as 'Coordinator' | 'Partner' | 'Both',
        submitterProfile: profile,
        rejectionReason: '',
      };
      onUpdateListing(editingListing.id, updatedData);
    } else {
      onSubmitListing(newListing as Listing);
    }
    setIsSuccess(true);
  };

  const resetFormState = () => {
    setSelectedKeyActions([]);
    setSelectedSectors([]);
    setSelectedThematics([]);
    setDescription('');
    setPartnerSearchDeadline('');
    setProjectRole('');
    setTitle('');
    setIsSuccess(false);
    setFormErrors([]);
    setAgreedToTerms(false);
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
          <h1 className="text-3xl font-black text-slate-800">{isEditMode ? 'Listing Updated!' : 'Partner Call Submitted!'}</h1>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Your partner search listing has been {isEditMode ? 'updated' : 'submitted'} and is <span className="font-bold text-amber-600">pending admin review</span>. It will appear in the directory once approved — usually within 24 hours.
          </p>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-blue-10/40 shadow-sm flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            id="success-view-proposal"
            onClick={() => onNavigate('my-listings')}
            className="flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-3 rounded-brand font-bold text-sm transition-all cursor-pointer"
          >
            <span>View My Listings</span>
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
        <form onSubmit={handleFormSubmit} className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-[24px] border border-blue-50/80 shadow-sm space-y-8">
          
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

            <div className="bg-slate-50 border border-slate-200 rounded-[16px] p-5 space-y-3">
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

          {/* Section 1 — About the Project */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <span className="w-5 h-5 text-sm font-black bg-brand-primary/10 text-brand-primary rounded-full inline-flex items-center justify-center">1</span>
              <span>About the Project</span>
            </h2>

            {/* Partner Call Title */}
            <div className="space-y-1">
              <label htmlFor="form-listing-title" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Partner Call Title *
              </label>
              <input
                id="form-listing-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Seeking VET partners for KA220 project on green skills"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-400 font-medium">
                A short, descriptive title that tells potential partners what your project is about.
              </p>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Project Description & Partner Requirements *
              </label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Describe your project idea, what kind of partner you are looking for, their expected role, and any specific requirements."
              />
            </div>

            {/* Partner Search Deadline */}
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
          </div>

          {/* Section 2 — Partnership Preferences */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <span className="w-5 h-5 text-sm font-black bg-brand-primary/10 text-brand-primary rounded-full inline-flex items-center justify-center">2</span>
              <span>Partnership Preferences</span>
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
                      : 'border-slate-200 bg-white hover:border-slate-305'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${projectRole === 'Coordinator' || projectRole === 'Both' ? 'bg-brand-primary border-brand-primary' : 'border-slate-300'}`}>
                      {(projectRole === 'Coordinator' || projectRole === 'Both') && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                    </div>
                    <div className="font-bold text-sm text-slate-800">🎯 Coordinator</div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">I am seeking partners to join my project consortium</div>
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

            {/* Key Actions */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Key Actions Target Projects * (Select at least 1)</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['KA1', 'KA2', 'KA3'] as KeyAction[]).map((action) => {
                  const isChecked = selectedKeyActions.includes(action);
                  return (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleKeyActionToggle(action)}
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
                      className={`px-3 py-2.5 rounded-lg text-xs font-semibold text-left flex items-center space-x-2 border transition-all cursor-pointer h-12 ${
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

            {/* Thematics Selection */}
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
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-white border-white' : 'border-slate-300'}`}>
                        {isChecked && <Check className="w-2.5 h-2.5 text-brand-primary stroke-[3px]" />}
                      </div>
                      <span className="truncate">{area}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3 — Contact */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <span className="w-5 h-5 text-sm font-black bg-brand-primary/10 text-brand-primary rounded-full inline-flex items-center justify-center">3</span>
              <span>Contact</span>
            </h2>

            {/* Contact Email */}
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
                placeholder="partners@yourinstitution.org"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-400 font-medium">
                Pre-filled from profile. You can change this if you want specific submissions sent to a different inbox.
              </p>
            </div>
          </div>

            {/* Consent checkbox */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <div className="relative mt-0.5 shrink-0">
                <div
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                    agreedToTerms ? 'bg-brand-primary border-brand-primary' : 'border-slate-300 hover:border-brand-primary'
                  }`}
                >
                  {agreedToTerms && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-slate-500 leading-relaxed">
                I agree to the{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-primary hover:underline hover:text-brand-primary-hover"
                >
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-primary hover:underline hover:text-brand-primary-hover"
                >
                  Privacy Policy
                </a>
                {' '}<span className="text-red-500 font-bold">*</span>
              </span>
            </label>

            <button
              id="publish-listing-trigger"
              type="submit"
              className="w-full inline-flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white py-4 rounded-brand font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>{isEditMode ? 'Save Changes' : 'Submit Listing'}</span>
            </button>
        </form>

        {/* Live Card Preview Panel */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-4 lg:sticky lg:top-24">
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-[11px] text-slate-700 font-medium">
            💡 <span className="font-bold text-slate-800">Dynamic Card Compilation:</span> Below is a live rendering of how your partner listing card compiles in the catalog index as you type.
          </div>

          <div className="bg-white rounded-[20px] overflow-hidden shadow-lg border-2 border-brand-primary max-w-sm mx-auto">
            <div className="p-5 flex flex-col space-y-3.5">

              {/* Header: logo + org name + location + type/experience */}
              <div className="flex items-center gap-3">
                {profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt="Organisation logo"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-contain border border-slate-100 bg-white p-1.5 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-base shrink-0">
                    {profile.organisationName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {profile.organisationName}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1 mt-0.5">
                    <span>{profile.countryFlag}</span>
                    <span className="truncate">{profile.country}{profile.city ? `, ${profile.city}` : ''}</span>
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[9px] font-extrabold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wide">
                    {profile.organisationType}
                  </span>
                  {profile.experienceLevel && (
                    <span className="text-[9px] font-extrabold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                      {profile.experienceLevel}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              {title ? (
                <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
                  {title}
                </h3>
              ) : (
                <p className="text-slate-300 text-xs italic">Your partner call title will appear here...</p>
              )}

              {/* Description */}
              <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">
                {description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || 'Provide a partner search description to preview the live rendering text of how potential European partners learn about your priorities and requirements...'}
              </p>

              {/* Labelled badge rows */}
              <div className="flex flex-col">
                {selectedKeyActions.length > 0 && (
                  <div className="flex items-center gap-2 py-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[68px] shrink-0">Key Action</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedKeyActions.map((action) => (
                        <span key={action} className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">{action}</span>
                      ))}
                    </div>
                  </div>
                )}
                {projectRole && (
                  <div className="border-t border-slate-100 flex items-center gap-2 py-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[68px] shrink-0">Role</span>
                    <div className="flex flex-wrap gap-1">
                      {(projectRole === 'Coordinator' || projectRole === 'Both') && (
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-violet-100 text-violet-800">Coordinator</span>
                      )}
                      {(projectRole === 'Partner' || projectRole === 'Both') && (
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-violet-100 text-violet-800">Partner</span>
                      )}
                    </div>
                  </div>
                )}
                {selectedSectors.length > 0 && (
                  <div className="border-t border-slate-100 flex items-center gap-2 py-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[68px] shrink-0">Sector</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedSectors.map((sector) => (
                        <span key={sector} className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">{sector}</span>
                      ))}
                    </div>
                  </div>
                )}
                {partnerSearchDeadline && (
                  <div className="border-t border-slate-100 flex items-center gap-2 py-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[68px] shrink-0">Deadline</span>
                    <span className="text-[9px] font-extrabold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{partnerSearchDeadline}</span>
                  </div>
                )}
              </div>

              {/* Thematic tags */}
              {selectedThematics.length > 0 && (
                <div className="pt-2.5 border-t border-gray-100 flex flex-wrap gap-1">
                  {selectedThematics.slice(0, 2).map((area) => (
                    <span key={area} className="text-[9.5px] font-bold text-brand-primary/80 bg-blue-50/40 px-2 py-0.5 rounded-full">
                      #{area.replace(' & ', '')}
                    </span>
                  ))}
                  {selectedThematics.length > 2 && (
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">
                      +{selectedThematics.length - 2} more
                    </span>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
