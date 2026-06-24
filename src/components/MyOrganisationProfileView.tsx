/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Building, 
  AlertCircle, 
  Check, 
  Info, 
  ClipboardList, 
  User, 
  Settings, 
  PlusCircle, 
  LogOut, 
  X, 
  Sparkles,
  Upload
} from 'lucide-react';
import PartnerMatchLogo from '../assets/PartnerMatchLogo';
import { OrganisationProfile, OrganisationType, Listing } from '../types';
import { COUNTRIES, ORGANISATION_TYPES, LANGUAGES, ERASMUS_SECTORS } from '../data';

interface MyProfileViewProps {
  currentUser: string | null;
  profile: OrganisationProfile | null;
  onUpdateProfile: (profile: OrganisationProfile) => void;
  onNavigate: (view: string) => void;
  onSignOut: () => void;
  listings: Listing[];
}

export default function MyOrganisationProfileView({
  currentUser,
  profile,
  onUpdateProfile,
  onNavigate,
  onSignOut,
  listings
}: MyProfileViewProps) {
  // Form fields
  const [organisationName, setOrganisationName] = useState(profile?.organisationName || '');
  const [organisationType, setOrganisationType] = useState<OrganisationType>(profile?.organisationType || 'NGO');
  const [country, setCountry] = useState(profile?.country || '');
  const [city, setCity] = useState(profile?.city || '');
  const [website, setWebsite] = useState(profile?.website || '');
  const [foundedYear, setFoundedYear] = useState(profile?.foundedYear || '');
  const [oid, setOid] = useState(profile?.oid || '');
  const [experienceLevel, setExperienceLevel] = useState(profile?.experienceLevel || 'First-timer');
  const [previousProjects, setPreviousProjects] = useState(profile?.previousProjects || '0');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(profile?.languagesSpoken || []);
  const [contactEmail, setContactEmail] = useState(profile?.contactEmail || '');
  const [sector, setSector] = useState(profile?.sector || 'Youth');
  const [description, setDescription] = useState(profile?.description || '');

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(profile?.logoUrl || null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((x) => x !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!organisationName.trim()) {
      errors.push('Organisation Name is required.');
    }
    if (!organisationType) {
      errors.push('Organisation Type is required.');
    }
    if (!country) {
      errors.push('Please select a country.');
    }
    if (!city.trim()) {
      errors.push('City is required.');
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      errors.push('A valid Contact Email is required.');
    }
    if (selectedLanguages.length === 0) {
      errors.push('Please select at least one language.');
    }
    if (!sector) {
      errors.push('Please select your Erasmus+ sector');
    }
    if (!description.trim()) {
      errors.push('Please add a description of your organisation.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      document.getElementById('my-profile-container')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setFormErrors([]);

    const selectedCountryObj = COUNTRIES.find((c) => c.name === country);
    const flag = selectedCountryObj ? selectedCountryObj.flag : '🇪🇺';

    const updatedProfile: OrganisationProfile = {
      organisationName: organisationName.trim(),
      organisationType,
      country,
      countryFlag: flag,
      city: city.trim(),
      website: website.trim(),
      foundedYear: foundedYear.trim(),
      oid: oid.trim(),
      experienceLevel,
      previousProjects,
      languagesSpoken: selectedLanguages,
      contactEmail: contactEmail.trim(),
      sector,
      logoUrl: logoPreview || '',
      description: description.trim(),
    };

    onUpdateProfile(updatedProfile);
    showToast('Profile updated successfully');
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-sm font-bold text-red-500">You must be signed in to view this page.</p>
        <button
          onClick={() => onNavigate('home')}
          className="bg-brand-primary text-white text-xs px-4 py-2 rounded-brand font-bold"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const initials = currentUser.trim().charAt(0).toUpperCase() || 'E';
  const allCount = listings.length;

  return (
    <div id="my-profile-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT SIDEBAR (Desktop) */}
        <aside className="w-full lg:w-[260px] bg-white rounded-[24px] border border-blue-50/80 p-6 shadow-sm space-y-6 shrink-0 lg:sticky lg:top-8 hidden md:block">
          {/* User Info Block */}
          <div className="flex flex-col items-center text-center space-y-3 pb-5 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-brand-primary text-white font-extrabold text-xl flex items-center justify-center shadow-sm">
              {initials}
            </div>
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{currentUser}</h3>
              <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">Erasmus+ Member</p>
            </div>
          </div>

          {/* Nav menu items */}
          <nav className="space-y-1.5 flex flex-col">
            <button
              onClick={() => onNavigate('my-listings')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-any text-left"
            >
              <span className="flex items-center space-x-2.5">
                <ClipboardList className="w-4 h-4 shrink-0 text-slate-450" />
                <span>My Listings</span>
              </span>
              <span className="bg-slate-200 text-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                {allCount}
              </span>
            </button>

            <button
              onClick={() => {}}
              className="w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all bg-blue-50 text-brand-primary"
            >
              <User className="w-4 h-4 shrink-0 text-brand-primary" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => showToast('Coming soon')}
              className="w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-any text-left"
            >
              <Settings className="w-4 h-4 shrink-0 text-slate-450" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('submit')}
              className="w-full inline-flex items-center justify-center space-x-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white py-3 rounded-xl font-bold text-xs transition-any shadow-sm active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-brand-accent shrink-0" />
              <span>Submit New Listing</span>
            </button>

            <button
              onClick={onSignOut}
              className="w-full inline-flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold text-xs transition-any cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Profile bar wrapper */}
        <div className="block md:hidden w-full bg-white rounded-[20px] p-5 border border-blue-50/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
              {initials}
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-slate-800 text-xs">{currentUser}</h3>
              <p className="text-[10px] text-slate-455 font-bold uppercase tracking-wider">Erasmus+ Member</p>
            </div>
            <button
              onClick={onSignOut}
              className="p-2 text-slate-400 hover:text-red-500 rounded-full bg-slate-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('my-listings')}
              className="flex-1 inline-flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2.5 rounded-xl font-bold text-[11px]"
            >
              My Listings
            </button>
            <button
              onClick={() => onNavigate('submit')}
              className="flex-1 inline-flex items-center justify-center space-x-1 bg-brand-primary text-white py-2.5 rounded-xl font-bold text-[11px]"
            >
              <PlusCircle className="w-3.5 h-3.5 text-brand-accent" />
              <span>Submit New</span>
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 w-full bg-white p-6 sm:p-8 rounded-[24px] border border-blue-50/80 shadow-sm space-y-6">
          <div className="border-b border-slide-100 pb-4">
            <h1 className="text-2xl font-extrabold text-slate-800">My Organisation Profile</h1>
            <p className="text-xs text-slate-500 mt-1">
              Update your organisation details. Changes will apply to future listings only.
            </p>
          </div>

          {/* Form Errors */}
          {formErrors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm space-y-1">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organisation Logo Section */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-800">Organisation Logo</h3>
                <p className="text-xs text-slate-400">Upload your organisation's logo. Optional but recommended.</p>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Organisation Logo <span className="text-slate-400 font-medium normal-case">(optional)</span>
                </label>
                
                {/* Logo preview or upload area */}
                {logoPreview ? (
                  <div className="flex items-center space-x-4">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-20 h-20 rounded-[16px] object-contain border border-slate-200 bg-white p-2 shadow-sm"
                    />
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700">Logo uploaded</p>
                      <button
                        type="button"
                        onClick={() => { setLogoPreview(null); setLogoFile(null); }}
                        className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Remove logo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-brand-primary rounded-[20px] p-6 text-center bg-slate-50 hover:bg-blue-50/10 cursor-pointer transition-all duration-300 group max-w-xs"
                  >
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-50 transition-colors">
                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-brand-primary transition-colors" />
                    </div>
                    <p className="text-xs font-bold text-slate-600">Click to upload logo</p>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, SVG up to 2MB · Square format recommended</p>
                  </div>
                )}
              </div>
            </div>

            {/* Organisation Name */}
            <div className="space-y-1">
              <label htmlFor="modal-org-name" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Organisation Name *
              </label>
              <input
                id="modal-org-name"
                type="text"
                placeholder="e.g. Active European Youths Association"
                value={organisationName}
                onChange={(e) => setOrganisationName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Type Option */}
              <div className="space-y-1">
                <label htmlFor="modal-org-type" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Organisation Type *
                </label>
                <div className="relative">
                  <select
                    id="modal-org-type"
                    value={organisationType}
                    onChange={(e) => setOrganisationType(e.target.value as OrganisationType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {ORGANISATION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* Country */}
              <div className="space-y-1">
                <label htmlFor="modal-org-country" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Country *
                </label>
                <div className="relative">
                  <select
                    id="modal-org-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="">-- Choose Country --</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.flag} {c.name}
                      </option>
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
                <label htmlFor="modal-org-city" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  City *
                </label>
                <input
                  id="modal-org-city"
                  type="text"
                  placeholder="e.g. Athens"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all"
                />
              </div>

              {/* Website */}
              <div className="space-y-1">
                <label htmlFor="modal-org-web" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Website URL (Optional)
                </label>
                <input
                  id="modal-org-web"
                  type="url"
                  placeholder="https://..."
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all"
                />
              </div>

              {/* Founded */}
              <div className="space-y-1">
                <label htmlFor="modal-org-founded" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Founded Year (Optional)
                </label>
                <input
                  id="modal-org-founded"
                  type="number"
                  placeholder="e.g. 2018"
                  value={foundedYear}
                  onChange={(e) => setFoundedYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* OID */}
            <div className="space-y-1">
              <label htmlFor="modal-org-oid" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 uppercase tracking-wide">
                <span>OID Number (Erasmus+ Organisation ID)</span>
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </label>
              <input
                id="modal-org-oid"
                type="text"
                placeholder="e.g. E10123456"
                value={oid}
                onChange={(e) => setOid(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
              />
              <p className="text-[11px] text-slate-405 font-medium">
                Your Organisation ID from the EU Login portal. Optional but recommended.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Experience Level */}
              <div className="space-y-1">
                <label htmlFor="modal-org-experience" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Experience Level *
                </label>
                <div className="relative">
                  <select
                    id="modal-org-experience"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="First-timer">First-timer</option>
                    <option value="Experienced">Experienced</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert Coordinator">Expert Coordinator</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* Previous Projects */}
              <div className="space-y-1">
                <label htmlFor="modal-org-previous" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Previous Erasmus+ Projects *
                </label>
                <div className="relative">
                  <select
                    id="modal-org-previous"
                    value={previousProjects}
                    onChange={(e) => setPreviousProjects(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="0">0</option>
                    <option value="1–3">1–3</option>
                    <option value="4–10">4–10</option>
                    <option value="10+">10+</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Erasmus+ Sector */}
            <div className="space-y-1">
              <label htmlFor="modal-org-sector" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Primary Erasmus+ Sector *
              </label>
              <div className="relative">
                <select
                  id="modal-org-sector"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {ERASMUS_SECTORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <span className="text-xs">▼</span>
                </div>
              </div>
            </div>

            {/* Languages spoken */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Languages Spoken * (Select at least 1)
              </span>
              <div className="flex flex-wrap gap-1.5 p-3.5 border border-slate-150 bg-slate-50 rounded-xl max-h-40 overflow-y-auto">
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageToggle(lang)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-green-600 text-white font-bold'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span>{lang}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Email */}
            <div className="space-y-1">
              <label htmlFor="modal-org-email" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Contact Email Address *
              </label>
              <input
                id="modal-org-email"
                type="email"
                placeholder="e.g. erasmus@myinstitution.org"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>

            {/* About Your Organisation */}
            <div className="space-y-1">
              <label htmlFor="modal-org-description" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                About Your Organisation *
              </label>
              <p className="text-[11px] text-slate-400 font-medium">
                Describe your organisation, your mission, your experience, and what kind of partnerships you are looking for. This will appear on your public profile.
              </p>
              <textarea
                id="modal-org-description"
                rows={5}
                maxLength={800}
                placeholder="e.g. We are a youth NGO based in Athens, Greece, with 10 years of experience in non-formal education and European mobility projects. We specialise in..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400 resize-none"
              />
              <p className="text-[10px] text-slate-400 font-medium text-right">
                {description.length}/800 characters
              </p>
            </div>

            {/* Warning notice */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                ⚠️ Editing your profile does not update listings you have already submitted.
              </p>
            </div>

            {/* Save Button */}
            <button
              id="myprofile-submit-trigger"
              type="submit"
              className="w-full inline-flex items-center justify-center bg-brand-primary hover:bg-brand-primary-hover text-white py-3 border border-brand-primary hover:border-brand-primary-hover rounded-brand font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              Save Changes
            </button>
          </form>
        </main>
      </div>

      {/* TOAST PANEL */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start space-x-3.5 animate-fade-in animate-slide-in">
          <div className="p-1.5 bg-brand-primary/10 rounded-lg shrink-0">
            <PartnerMatchLogo size={20} />
          </div>
          <div className="flex-1 space-y-0.5">
            <p className="text-sm font-bold">Success</p>
            <p className="text-xs text-slate-450 leading-relaxed">{toast}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-450 hover:text-white transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
