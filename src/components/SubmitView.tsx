/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Listing, OrganisationType, KeyAction } from '../types';
import { COUNTRIES, ORGANISATION_TYPES, THEMATIC_AREAS, LANGUAGES } from '../data';
import { 
  CloudUpload, 
  Sparkles, 
  MapPin, 
  Users, 
  Mail, 
  Check, 
  TrendingUp, 
  PlusCircle, 
  ArrowRight, 
  FileCheck,
  Building,
  AlertCircle,
  Info
} from 'lucide-react';

interface SubmitViewProps {
  onSubmitListing: (listing: Listing) => void;
  onNavigate: (view: string) => void;
  onSelectListing: (id: string) => void;
}

export default function SubmitView({ onSubmitListing, onNavigate, onSelectListing }: SubmitViewProps) {
  // Form values
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [type, setType] = useState<OrganisationType>('NGO');
  const [selectedKeyActions, setSelectedKeyActions] = useState<KeyAction[]>([]);
  const [selectedThematics, setSelectedThematics] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [contactEmail, setContactEmail] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [website, setWebsite] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  const [oid, setOid] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('First-timer (no previous projects)');
  const [previousProjects, setPreviousProjects] = useState('0 — this will be our first');
  const [partnerSearchDeadline, setPartnerSearchDeadline] = useState('');

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
    setSelectedKeyActions(prev => 
      prev.includes(action) ? prev.filter(x => x !== action) : [...prev, action]
    );
  };

  const handleThematicToggle = (area: string) => {
    setSelectedThematics(prev => 
      prev.includes(area) ? prev.filter(x => x !== area) : [...prev, area]
    );
  };

  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) ? prev.filter(x => x !== lang) : [...prev, lang]
    );
  };

  // Validation & Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!name.trim()) errors.push('Organisation name is required.');
    if (!country) errors.push('Please select a country.');
    if (!contactEmail.trim() || !contactEmail.includes('@')) errors.push('A valid contact email is required.');
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
    if (!description.trim()) errors.push('Please provide a short description.');
    if (selectedKeyActions.length === 0) errors.push('Select at least one Key Action (e.g. KA1, KA210, KA220).');

    if (errors.length > 0) {
      setFormErrors(errors);
      // Scroll to error alert
      document.getElementById('form-error-alert')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setFormErrors([]);

    // Generate unique index matching listing ID
    const newId = `user-org-${Date.now()}`;
    const flagMeta = COUNTRIES.find(c => c.name === country)?.flag || '🇪🇺';

    // Construct listing
    const userListing: Listing = {
      id: newId,
      name: name.trim(),
      type: type,
      country: country,
      countryFlag: flagMeta,
      keyActions: selectedKeyActions,
      thematicAreas: selectedThematics.length > 0 ? selectedThematics : ['General Exchange'],
      languagesSpoken: selectedLanguages.length > 0 ? selectedLanguages : ['English'],
      contactEmail: contactEmail.trim(),
      description: description.trim(),
      thumbnailUrl: previewUrl || `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 100)}`,
      city: city.trim() || undefined,
      website: website.trim() || undefined,
      foundedYear: foundedYear.trim() || undefined,
      oid: oid.trim() || undefined,
      experienceLevel: experienceLevel,
      previousProjects: previousProjects,
      partnerSearchDeadline: partnerSearchDeadline,
    };

    onSubmitListing(userListing);
    setCreatedId(newId);
    setIsSuccess(true);
  };

  const resetFormState = () => {
    setName('');
    setCountry('');
    setType('NGO');
    setSelectedKeyActions([]);
    setSelectedThematics([]);
    setSelectedLanguages([]);
    setContactEmail('');
    setDescription('');
    setCity('');
    setWebsite('');
    setFoundedYear('');
    setOid('');
    setExperienceLevel('First-timer (no previous projects)');
    setPreviousProjects('0 — this will be our first');
    setPartnerSearchDeadline('');
    setPreviewUrl(null);
    setIsSuccess(false);
    setCreatedId('');
    setFormErrors([]);
  };

  // Key action color badge helper
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

  // Success output
  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8 animate-fade-in">
        <div className="mx-auto w-20 h-20 bg-green-150 text-green-600 rounded-full flex items-center justify-center shadow-md">
          <FileCheck className="w-10 h-10" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-800">Proposal Published!</h1>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Your Erasmus+ organisation profile has been successfully generated and compiled into our client directory. Other partners can locate you now.
          </p>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-blue-10/40 shadow-sm flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            id="success-view-proposal"
            onClick={() => onSelectListing(createdId)}
            className="flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-3 rounded-brand font-bold text-sm transition-all"
          >
            <span>View Published Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            id="success-create-new"
            onClick={resetFormState}
            className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-brand font-bold text-sm border border-slate-200 transition-all"
          >
            <span>Submit Another</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
        <h1 className="text-3xl font-black text-slate-800">Submit Your Erasmus+ Listing</h1>
        <p className="text-sm text-slate-500">
          Make your organisation searchable by hundreds of other institutions preparing European project proposals. It takes less than 3 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Panel (8 Columns on Large Screens) */}
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

          {/* Section 1: Basic Information */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <span className="w-5 h-5 text-sm font-black bg-brand-primary/10 text-brand-primary rounded-full inline-flex items-center justify-center">1</span>
              <span>Institution Information</span>
            </h2>

            {/* Name */}
            <div className="space-y-1">
              <label htmlFor="form-org-name" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Organisation Name *
              </label>
              <input
                id="form-org-name"
                type="text"
                placeholder="e.g. European Institute of Educational Progress"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Type Option */}
              <div className="space-y-1">
                <label htmlFor="form-org-type" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Organisation Type *
                </label>
                <div className="relative">
                  <select
                    id="form-org-type"
                    value={type}
                    onChange={(e) => setType(e.target.value as OrganisationType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {ORGANISATION_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* Country Select */}
              <div className="space-y-1">
                <label htmlFor="form-org-country" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Country *
                </label>
                <div className="relative">
                  <select
                    id="form-org-country"
                    value={country}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="">-- Choose Country --</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* City */}
              <div className="space-y-1">
                <label htmlFor="form-org-city" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  City
                </label>
                <input
                  id="form-org-city"
                  type="text"
                  placeholder="e.g. Athens"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all"
                />
              </div>

              {/* Website */}
              <div className="space-y-1">
                <label htmlFor="form-org-web" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Website URL
                </label>
                <input
                  id="form-org-web"
                  type="url"
                  placeholder="https://..."
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all"
                />
              </div>

              {/* Founded */}
              <div className="space-y-1">
                <label htmlFor="form-org-founded" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Founded Year
                </label>
                <input
                  id="form-org-founded"
                  type="number"
                  placeholder="e.g. 2015"
                  value={foundedYear}
                  onChange={(e) => setFoundedYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* OID Number */}
            <div className="space-y-1">
              <label htmlFor="form-org-oid" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 uppercase tracking-wide">
                <span>OID Number (Erasmus+ Organisation ID)</span>
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </label>
              <input
                id="form-org-oid"
                type="text"
                placeholder="e.g. E10123456"
                value={oid}
                onChange={(e) => setOid(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
              />
              <p className="text-[11px] text-slate-450 font-medium">
                Your Organisation ID from the EU Login portal. Optional but recommended.
              </p>
            </div>

            {/* Experience Level & Previous Projects side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Experience Level */}
              <div className="space-y-1">
                <label htmlFor="form-org-experience" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Experience Level
                </label>
                <div className="relative">
                  <select
                    id="form-org-experience"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="First-timer (no previous projects)">First-timer (no previous projects)</option>
                    <option value="Experienced (1–3 projects)">Experienced (1–3 projects)</option>
                    <option value="Advanced (4–10 projects)">Advanced (4–10 projects)</option>
                    <option value="Expert Coordinator (10+ projects)">Expert Coordinator (10+ projects)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* Number of Previous Projects */}
              <div className="space-y-1">
                <label htmlFor="form-org-previous" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Previous Erasmus+ Projects
                </label>
                <div className="relative">
                  <select
                    id="form-org-previous"
                    value={previousProjects}
                    onChange={(e) => setPreviousProjects(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="0 — this will be our first">0 — this will be our first</option>
                    <option value="1–3 projects">1–3 projects</option>
                    <option value="4–10 projects">4–10 projects</option>
                    <option value="10+ projects">10+ projects</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Image Publication */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <span className="w-5 h-5 text-sm font-black bg-brand-primary/10 text-brand-primary rounded-full inline-flex items-center justify-center">2</span>
              <span>Banner Visual Thumbnail</span>
            </h2>

            {/* Thumbnail Drag and Drop */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Landscape Thumbnail Image</span>
              
              <div
                id="drag-and-drop-container"
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

          {/* Section 3: Key Actions, Thematic, & Languages */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <span className="w-5 h-5 text-sm font-black bg-brand-primary/10 text-brand-primary rounded-full inline-flex items-center justify-center">3</span>
              <span>Project Target Preferences</span>
            </h2>

            {/* Key Actions checkboxes */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Key Actions Target Projects * (Select at least 1)</span>
              <div id="form-ka-options" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['KA1', 'KA210', 'KA220'].map((action) => {
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
                          {action === 'KA210' && 'Small-Scale'}
                          {action === 'KA220' && 'Cooperation'}
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

            {/* Thematic Areas Checkboxes */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Main Thematic Areas (Select multiple)</span>
              <div id="form-thematics-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 h-64 overflow-y-auto pr-2 border border-slate-150 rounded-xl bg-slate-50 p-4">
                {THEMATIC_AREAS.map((area) => {
                  const isChecked = selectedThematics.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
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

            {/* Languages spoken */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Languages Spoken</span>
              <div id="form-languages-badgerow" className="flex flex-wrap gap-1.5 p-3.5 border border-slate-150 bg-slate-50 rounded-xl max-h-40 overflow-y-auto">
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageToggle(lang)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-green-600 text-white font-bold scale-102' 
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span>{lang}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Bio Description & Contact */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <span className="w-5 h-5 text-sm font-black bg-brand-primary/10 text-brand-primary rounded-full inline-flex items-center justify-center">4</span>
              <span>Contact & Bio Description</span>
            </h2>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="form-org-email" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Contact Email Address *
              </label>
              <input
                id="form-org-email"
                type="email"
                required
                placeholder="e.g. erasmus@institution.org"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
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
              <p className="text-[11px] text-slate-450 font-medium">
                The date you need to find a partner by. Your listing will expire automatically on this date.
              </p>
            </div>

            {/* Description with live character counter */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600 uppercase tracking-wide">
                <label htmlFor="form-org-desc">Institutional Narrative Profile Description *</label>
                <span className={`text-[10px] ${description.length > 500 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                  {description.length} / 500 characters
                </span>
              </div>
              <textarea
                id="form-org-desc"
                rows={4}
                maxLength={500}
                required
                placeholder="Give details about your institution, past cooperative project credentials, specific ideas, and what roles you want to play..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Submission Trigger button */}
          <div className="pt-4">
            <button
              id="form-submit-trigger"
              type="submit"
              className="w-full inline-flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white py-4 rounded-brand font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-brand-accent animate-spin-slow" />
              <span>Publish Erasmus+ Listing</span>
            </button>
          </div>
        </form>

        {/* Live Card Preview Panel (5 Columns) */}
        <div id="live-preview-panel-column" className="lg:col-span-12 xl:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-[11px] text-slate-700 font-medium">
            💡 <span className="font-bold text-slate-800">Dynamic Card Compilation:</span> Below is a live rendering of how your partner listing card compiles in the catalog index as you type.
          </div>

          {/* The Compiled Card */}
          <div className="bg-white rounded-[20px] border border-blue-105 overflow-hidden shadow-lg border-2 border-brand-primary max-w-sm mx-auto">
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
                <span>{COUNTRIES.find(c => c.name === country)?.flag || '🇪🇺'}</span>
                <span>{country || 'Select Country'}</span>
              </div>

              {(city || country) && (
                <div className="absolute bottom-3 left-3 bg-slate-900/40 backdrop-blur-sm px-2.5 py-0.5 rounded-md text-[9px] font-bold text-white uppercase tracking-wide">
                  📍 {city || 'City Draft'}
                </div>
              )}
            </div>

            {/* Visual Body */}
            <div className="p-5 space-y-3">
              <div className="flex flex-wrap gap-1 items-center">
                <span className="bg-slate-100 text-slate-700 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md tracking-wider">
                  {type}
                </span>
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
                {name || 'Institution Name Draft'}
              </h3>

              <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3 h-[48px]">
                {description || 'Provide a profile description to preview the live rendering text of how potential european partners learn about your priorities and experience...'}
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
