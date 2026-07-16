import { useState, useRef } from 'react';
import { Upload, Check } from 'lucide-react';
import { OrganisationProfile, OrganisationType, FeaturedProject } from '../../types';
import { COUNTRIES, ORGANISATION_TYPES, LANGUAGES, ERASMUS_SECTORS, THEMATIC_AREAS } from '../../data';
import FeaturedProjectsEditor from '../FeaturedProjectsEditor';
import MultiSelectDropdown from '../MultiSelectDropdown';
import RichTextEditor from '../RichTextEditor';

interface ProfileSectionProps {
  organisationProfile: OrganisationProfile | null;
  onUpdateProfile?: (profile: OrganisationProfile) => void;
  showToast: (message: string) => void;
}

export default function ProfileSection({ organisationProfile, onUpdateProfile, showToast }: ProfileSectionProps) {
  const [profileName, setProfileName] = useState(organisationProfile?.organisationName || '');
  const [profileType, setProfileType] = useState<OrganisationType>(organisationProfile?.organisationType || 'NGO / Association');
  const [profileCountry, setProfileCountry] = useState(organisationProfile?.country || '');
  const [profileCity, setProfileCity] = useState(organisationProfile?.city || '');
  const [profileWebsite, setProfileWebsite] = useState(organisationProfile?.website || '');
  const [profileFoundedYear, setProfileFoundedYear] = useState(organisationProfile?.foundedYear || '');
  const [profileOid, setProfileOid] = useState(organisationProfile?.oid || '');
  const [profileExperience, setProfileExperience] = useState(organisationProfile?.experienceLevel || 'First-timer');
  const [profilePreviousProjects, setProfilePreviousProjects] = useState(organisationProfile?.previousProjects || '0');
  const [profileFeaturedProjects, setProfileFeaturedProjects] = useState<FeaturedProject[]>(organisationProfile?.featuredProjects || []);
  const [profileLanguages, setProfileLanguages] = useState<string[]>(organisationProfile?.languagesSpoken || []);
  const [profileContactEmail, setProfileContactEmail] = useState(organisationProfile?.contactEmail || '');
  const [profileSectors, setProfileSectors] = useState<string[]>(organisationProfile?.sectors || ['Youth']);
  const [profileThematicAreas, setProfileThematicAreas] = useState<string[]>(organisationProfile?.thematicAreas || []);
  const [profileDescription, setProfileDescription] = useState(organisationProfile?.description || '');
  const [profileLinkedin, setProfileLinkedin] = useState(organisationProfile?.linkedinUrl || '');
  const [profileFacebook, setProfileFacebook] = useState(organisationProfile?.facebookUrl || '');
  const [profileInstagram, setProfileInstagram] = useState(organisationProfile?.instagramUrl || '');
  const [profileTwitter, setProfileTwitter] = useState(organisationProfile?.twitterUrl || '');
  const [profileLogoPreview, setProfileLogoPreview] = useState<string | null>(organisationProfile?.logoUrl || null);
  const [profileFormErrors, setProfileFormErrors] = useState<string[]>([]);
  const profileLogoInputRef = useRef<HTMLInputElement | null>(null);

  const handleProfileLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleProfileSectorToggle = (s: string) => {
    setProfileSectors((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!profileName.trim()) errors.push('Organisation Name is required.');
    if (!profileCountry) errors.push('Please select a country.');
    if (!profileCity.trim()) errors.push('City is required.');
    if (!profileContactEmail.trim() || !profileContactEmail.includes('@')) errors.push('A valid Contact Email is required.');
    if (profileLanguages.length === 0) errors.push('Please select at least one language.');
    if (profileSectors.length === 0) errors.push('Please select at least one Erasmus+ sector.');
    if (!profileDescription.trim() || profileDescription.replace(/<[^>]*>/g, '').trim() === '') errors.push('Please add a description of your organisation.');
    if (errors.length > 0) { setProfileFormErrors(errors); return; }
    setProfileFormErrors([]);
    const selectedCountryObj = COUNTRIES.find((c) => c.name === profileCountry);
    const flag = selectedCountryObj ? selectedCountryObj.flag : '🇪🇺';
    const updatedProfile: OrganisationProfile = {
      organisationName: profileName.trim(),
      organisationType: profileType,
      country: profileCountry,
      countryFlag: flag,
      city: profileCity.trim(),
      website: profileWebsite.trim(),
      foundedYear: profileFoundedYear.trim(),
      oid: profileOid.trim(),
      experienceLevel: profileExperience,
      previousProjects: profilePreviousProjects,
      featuredProjects: profileFeaturedProjects,
      languagesSpoken: profileLanguages,
      contactEmail: profileContactEmail.trim(),
      sectors: profileSectors,
      thematicAreas: profileThematicAreas,
      logoUrl: profileLogoPreview || '',
      description: profileDescription.trim(),
      linkedinUrl: profileLinkedin.trim(),
      facebookUrl: profileFacebook.trim(),
      instagramUrl: profileInstagram.trim(),
      twitterUrl: profileTwitter.trim(),
      profilePublic: organisationProfile?.profilePublic ?? true,
      showEmailOnProfile: organisationProfile?.showEmailOnProfile ?? true,
      showLocationOnProfile: organisationProfile?.showLocationOnProfile ?? true,
    };
    if (onUpdateProfile) onUpdateProfile(updatedProfile);
    showToast('Profile updated successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-black text-slate-800">My Organisation</h2>
        <p className="text-xs text-slate-500 mt-1">Update your organisation details visible to potential partners.</p>
      </div>
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-sm">
        {profileFormErrors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs space-y-1">
            <ul className="list-disc pl-4 space-y-1">
              {profileFormErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        {/* Logo */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Organisation Logo <span className="text-slate-400 font-normal normal-case">(optional)</span></label>
          <div className="flex items-center space-x-4">
            {profileLogoPreview ? (
              <img src={profileLogoPreview} alt="Logo" className="w-16 h-16 rounded-xl object-contain border border-slate-200 p-1" />
            ) : (
              <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                <Upload className="w-6 h-6" />
              </div>
            )}
            <button type="button" onClick={() => profileLogoInputRef.current?.click()} className="text-xs font-bold text-brand-primary hover:underline cursor-pointer">
              {profileLogoPreview ? 'Change Logo' : 'Upload Logo'}
            </button>
            <input ref={profileLogoInputRef} type="file" accept="image/*" onChange={handleProfileLogoChange} className="hidden" />
          </div>
        </div>

        {/* Organisation Name */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Organisation Name *</label>
          <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all" />
        </div>

        {/* Organisation Type */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Organisation Type *</label>
          <select value={profileType} onChange={(e) => setProfileType(e.target.value as OrganisationType)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all">
            {ORGANISATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Country & City */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Country *</label>
            <select value={profileCountry} onChange={(e) => setProfileCountry(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all">
              <option value="">Select country</option>
              {COUNTRIES.map((c) => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">City *</label>
            <input type="text" value={profileCity} onChange={(e) => setProfileCity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all" />
          </div>
        </div>

        {/* Website & OID */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Website</label>
            <input type="text" value={profileWebsite} onChange={(e) => setProfileWebsite(e.target.value)} placeholder="https://" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all" />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">OID</label>
            <input type="text" value={profileOid} onChange={(e) => setProfileOid(e.target.value)} placeholder="E10012345" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all" />
          </div>
        </div>

        {/* Experience Level & Previous Projects */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Experience Level *</label>
            <div className="relative">
              <select
                value={profileExperience}
                onChange={(e) => setProfileExperience(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary transition-all appearance-none cursor-pointer"
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
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Past Erasmus+ Projects</label>
            <select
              value={profilePreviousProjects}
              onChange={(e) => setProfilePreviousProjects(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary transition-all appearance-none cursor-pointer"
            >
              <option value="0">0</option>
              <option value="1-2">1–2</option>
              <option value="3-5">3–5</option>
              <option value="6-10">6–10</option>
              <option value="10+">10+</option>
            </select>
          </div>
        </div>

        {/* Featured Projects */}
        <FeaturedProjectsEditor projects={profileFeaturedProjects} onChange={setProfileFeaturedProjects} />

        {/* Contact Email */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Contact Email *</label>
          <input type="email" value={profileContactEmail} onChange={(e) => setProfileContactEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all" />
        </div>

        {/* Sectors */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Erasmus+ Sectors * (Select at least 1)</label>
          <div className="flex flex-wrap gap-1.5 p-3.5 border border-slate-200 bg-slate-50 rounded-xl">
            {ERASMUS_SECTORS.map((s) => {
              const isChecked = profileSectors.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleProfileSectorToggle(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-brand-primary border-brand-primary text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-white border-white' : 'border-slate-300'}`}>
                    {isChecked && <Check className="w-2 h-2 text-brand-primary stroke-[3px]" />}
                  </div>
                  <span>{s}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Thematic Topics */}
        <MultiSelectDropdown
          label="Thematic Topics"
          options={THEMATIC_AREAS}
          selected={profileThematicAreas}
          onChange={setProfileThematicAreas}
        />

        {/* Languages */}
        <MultiSelectDropdown
          label="Languages Spoken"
          options={LANGUAGES}
          selected={profileLanguages}
          onChange={setProfileLanguages}
          required
        />

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">About Your Organisation *</label>
          <RichTextEditor value={profileDescription} onChange={setProfileDescription} placeholder="Describe your organisation, your mission, your experience, and what kind of partnerships you are looking for." />
        </div>

        {/* Social Media */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Social Media <span className="text-slate-400 font-normal normal-case">(optional)</span></label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-700 shrink-0">in</span>
              <input
                type="url"
                value={profileLinkedin}
                onChange={(e) => setProfileLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/your-org"
                className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 min-w-0"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-600 shrink-0">f</span>
              <input
                type="url"
                value={profileFacebook}
                onChange={(e) => setProfileFacebook(e.target.value)}
                placeholder="https://facebook.com/your-org"
                className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 min-w-0"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-pink-600 shrink-0">ig</span>
              <input
                type="url"
                value={profileInstagram}
                onChange={(e) => setProfileInstagram(e.target.value)}
                placeholder="https://instagram.com/your-org"
                className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 min-w-0"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-slate-800 shrink-0">𝕏</span>
              <input
                type="url"
                value={profileTwitter}
                onChange={(e) => setProfileTwitter(e.target.value)}
                placeholder="https://x.com/your-org"
                className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 min-w-0"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-3 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-sm">
          Save Profile
        </button>
      </form>
    </div>
  );
}
