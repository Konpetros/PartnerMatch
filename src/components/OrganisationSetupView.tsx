/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { OrganisationProfile, OrganisationType } from '../types';
import { COUNTRIES, ORGANISATION_TYPES, LANGUAGES, ERASMUS_SECTORS } from '../data';
import { Building, AlertCircle, Check, Info, Upload } from 'lucide-react';

interface ProfileSetupViewProps {
  onProfileComplete: (profile: OrganisationProfile) => void;
}

export default function OrganisationSetupView({ onProfileComplete }: ProfileSetupViewProps) {
  const [organisationName, setOrganisationName] = useState('');
  const [organisationType, setOrganisationType] = useState<OrganisationType>('NGO');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [website, setWebsite] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  const [oid, setOid] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('First-timer');
  const [previousProjects, setPreviousProjects] = useState('0');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [contactEmail, setContactEmail] = useState('');
  const [sector, setSector] = useState('Youth');
  const [description, setDescription] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
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
      document.getElementById('profile-setup-container')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setFormErrors([]);

    const selectedCountryObj = COUNTRIES.find((c) => c.name === country);
    const flag = selectedCountryObj ? selectedCountryObj.flag : '🇪🇺';

    const profile: OrganisationProfile = {
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

    onProfileComplete(profile);
  };

  return (
    <div id="profile-setup-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-blue-50/80 shadow-md space-y-8">
        {/* Header */}
        <div className="border-b border-slate-100 pb-5 space-y-2">
          <div className="flex items-center space-x-2 text-brand-primary">
            <Building className="w-5 h-5 text-brand-accent animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider">Step 1 of 1 — Organisation Details</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">Set Up Your Organisation Profile</h1>
          <p className="text-sm text-slate-500">
            This information will be used across all your partner search listings. You only need to fill this in once.
          </p>
        </div>

        {/* Form Errors */}
        {formErrors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm space-y-1">
            <div className="flex items-center space-x-2 font-bold mb-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Please fill in all mandatory fields:</span>
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
            <label htmlFor="setup-org-name" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
              Organisation Name *
            </label>
            <input
              id="setup-org-name"
              type="text"
              placeholder="e.g. Active European Youths Association"
              value={organisationName}
              onChange={(e) => setOrganisationName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Organisation Type */}
            <div className="space-y-1">
              <label htmlFor="setup-org-type" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Organisation Type *
              </label>
              <div className="relative">
                <select
                  id="setup-org-type"
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
              <label htmlFor="setup-org-country" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Country *
              </label>
              <div className="relative">
                <select
                  id="setup-org-country"
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
              <label htmlFor="setup-org-city" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                City *
              </label>
              <input
                id="setup-org-city"
                type="text"
                placeholder="e.g. Athens"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all"
              />
            </div>

            {/* Website */}
            <div className="space-y-1">
              <label htmlFor="setup-org-web" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Website URL (Optional)
              </label>
              <input
                id="setup-org-web"
                type="url"
                placeholder="https://..."
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all"
              />
            </div>

            {/* Founded Year */}
            <div className="space-y-1">
              <label htmlFor="setup-org-founded" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Founded Year (Optional)
              </label>
              <input
                id="setup-org-founded"
                type="number"
                placeholder="e.g. 2018"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* OID Number */}
          <div className="space-y-1">
            <label htmlFor="setup-org-oid" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 uppercase tracking-wide">
              <span>OID Number (Erasmus+ Organisation ID)</span>
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </label>
            <input
              id="setup-org-oid"
              type="text"
              placeholder="e.g. E10123456"
              value={oid}
              onChange={(e) => setOid(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
            />
            <p className="text-[11px] text-slate-400 font-medium">
              Your Organisation ID from the EU Login portal. Optional but recommended.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Experience Level */}
            <div className="space-y-1">
              <label htmlFor="setup-org-experience" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Experience Level *
              </label>
              <div className="relative">
                <select
                  id="setup-org-experience"
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
              <label htmlFor="setup-org-previous" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Previous Erasmus+ Projects *
              </label>
              <div className="relative">
                <select
                  id="setup-org-previous"
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
            <label htmlFor="setup-org-sector" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
              Erasmus+ Sector *
            </label>
            <div className="relative">
              <select
                id="setup-org-sector"
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
            <label htmlFor="setup-org-email" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
              Contact Email Address *
            </label>
            <input
              id="setup-org-email"
              type="email"
              placeholder="e.g. erasmus@myinstitution.org"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
            />
            <p className="text-[11px] text-slate-400 font-medium">
              This will be shown to organisations who want to contact you.
            </p>
          </div>

          <div className="space-y-1">
            <label htmlFor="setup-org-description" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
              About Your Organisation *
            </label>
            <p className="text-[11px] text-slate-400 font-medium">
              Describe your organisation, your mission, your experience, and what kind of partnerships you are looking for. This will appear on your public profile.
            </p>
            <textarea
              id="setup-org-description"
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

          {/* Submit */}
          <div className="pt-4">
            <button
              id="setup-submit-trigger"
              type="submit"
              className="w-full inline-flex items-center justify-center bg-brand-primary hover:bg-brand-primary-hover text-white py-4 rounded-brand font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Save Profile & Continue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
