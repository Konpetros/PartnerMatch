import React, { useState } from 'react';
import { Listing, AdminUser } from '../../types';
import { ProfileWithUid } from '../../hooks/useProfiles';
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Globe2,
  ShieldOff,
  ShieldCheck,
  BarChart3
} from 'lucide-react';

interface AdminDashboardProps {
  listings: Listing[];
  users: AdminUser[];
  profiles: ProfileWithUid[];
}

type DashboardTab = 'listings' | 'organisations';

export default function AdminDashboard({
  listings,
  users,
  profiles,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('listings');

  // ===== LISTINGS STATS =====
  const totalListings = listings.length;
  const pendingApproval = listings.filter(l => l.status === 'pending').length;
  const activeListings = listings.filter(l => l.status === 'active').length;
  const expiredListings = listings.filter(l => l.status === 'expired').length;
  const uniqueCountries = new Set(listings.map(l => l.country).filter(Boolean));
  const countryCount = uniqueCountries.size;

  // ===== ORGANISATION STATS =====
  const totalUsers = users.length;
  const bannedUsers = users.filter(u => u.status === 'banned').length;
  const adminCount = users.filter(u => u.isAdmin).length;
  const avgListingsPerOrg = totalUsers > 0 ? (totalListings / totalUsers).toFixed(1) : '0.0';

  // ===== Chart: Listings by Month =====
  const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthCounts: Record<string, number> = {};
  monthsList.forEach(m => { monthCounts[m] = 0; });
  listings.forEach(l => {
    if (l.createdAt) {
      const date = new Date(l.createdAt);
      if (!isNaN(date.getTime())) {
        monthCounts[monthsList[date.getMonth()]]++;
      }
    }
  });
  const maxMonthValue = Math.max(...Object.values(monthCounts), 1);

  // ===== Chart: Top Countries (listings) =====
  const countryCounts: Record<string, { count: number; flag: string }> = {};
  listings.forEach(l => {
    if (l.country) {
      if (!countryCounts[l.country]) {
        countryCounts[l.country] = { count: 0, flag: l.countryFlag || '🇪🇺' };
      }
      countryCounts[l.country].count++;
    }
  });
  const sortedCountries = Object.keys(countryCounts)
    .map(name => ({ name, count: countryCounts[name].count, flag: countryCounts[name].flag }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const maxCountryValue = Math.max(...sortedCountries.map(c => c.count), 1);

  // ===== Chart: Organisation Types (derived from listings' submitter type) =====
  const orgTypeCounts: Record<string, number> = {
    'NGO / Association': 0,
    'Foundation': 0,
    'Youth Organisation': 0,
    'National Youth Council': 0,
    'Higher Education Institution': 0,
    'School': 0,
    'Educational Centre': 0,
    'Research Institute / Centre': 0,
    'Public Body': 0,
    'Private Enterprise': 0,
    'Social Partner': 0,
    'Representative Body': 0,
    'Sport Organisation': 0,
    'Public Service Provider': 0,
    'Other': 0
  };
  listings.forEach(l => {
    if (l.type && l.type in orgTypeCounts) {
      orgTypeCounts[l.type]++;
    }
  });
  const maxOrgTypeValue = Math.max(...Object.values(orgTypeCounts), 1);

  // ===== Chart: Key Actions =====
  const keyActionCounts: Record<string, number> = { 'KA1': 0, 'KA2': 0, 'KA3': 0 };
  listings.forEach(l => {
    (l.keyActions || []).forEach(ka => {
      if (ka in keyActionCounts) keyActionCounts[ka]++;
    });
  });
  const maxKeyActionValue = Math.max(...Object.values(keyActionCounts), 1);

  // ===== Chart: Erasmus+ Sectors (listings) =====
  const sectorCounts: Record<string, number> = {};
  listings.forEach(l => {
    (l.sectors || []).forEach(s => {
      sectorCounts[s] = (sectorCounts[s] || 0) + 1;
    });
  });
  const sortedSectors = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]);
  const maxSectorValue = Math.max(...sortedSectors.map(s => s[1]), 1);

  // ===== Chart: Main Thematic Topics =====
  const thematicCounts: Record<string, number> = {};
  listings.forEach(l => {
    (l.thematicAreas || []).forEach(t => {
      thematicCounts[t] = (thematicCounts[t] || 0) + 1;
    });
  });
  const sortedThematics = Object.entries(thematicCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxThematicValue = Math.max(...sortedThematics.map(t => t[1]), 1);

  // ===== Chart: Partnership Preferences (Role) =====
  const roleCounts: Record<string, number> = { 'Coordinator': 0, 'Partner': 0, 'Both': 0 };
  listings.forEach(l => {
    if (l.projectRole && l.projectRole in roleCounts) {
      roleCounts[l.projectRole]++;
    }
  });
  const maxRoleValue = Math.max(...Object.values(roleCounts), 1);

  // ===== Chart: Experience Level (real profile data) =====
  const experienceLevelCounts: Record<string, number> = {
    'First-timer': 0,
    'Experienced': 0,
    'Advanced': 0,
    'Expert Coordinator': 0,
  };
  profiles.forEach(p => {
    if (p.experienceLevel && p.experienceLevel in experienceLevelCounts) {
      experienceLevelCounts[p.experienceLevel]++;
    }
  });
  const maxExperienceLevelValue = Math.max(...Object.values(experienceLevelCounts), 1);

  // ===== Chart: Erasmus+ Sectors (real profile data) =====
  const profileSectorCounts: Record<string, number> = {};
  profiles.forEach(p => {
    (p.sectors || []).forEach(s => {
      profileSectorCounts[s] = (profileSectorCounts[s] || 0) + 1;
    });
  });
  const sortedProfileSectors = Object.entries(profileSectorCounts).sort((a, b) => b[1] - a[1]);
  const maxProfileSectorValue = Math.max(...sortedProfileSectors.map(s => s[1]), 1);

  // ===== Chart: Languages Spoken (real profile data) =====
  const languageCounts: Record<string, number> = {};
  profiles.forEach(p => {
    (p.languagesSpoken || []).forEach(l => {
      languageCounts[l] = (languageCounts[l] || 0) + 1;
    });
  });
  const sortedLanguages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxLanguageValue = Math.max(...sortedLanguages.map(l => l[1]), 1);

  // ===== Chart: Thematic Topics (real profile data) =====
  const profileThematicCounts: Record<string, number> = {};
  profiles.forEach(p => {
    (p.thematicAreas || []).forEach(t => {
      profileThematicCounts[t] = (profileThematicCounts[t] || 0) + 1;
    });
  });
  const sortedProfileThematics = Object.entries(profileThematicCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxProfileThematicValue = Math.max(...sortedProfileThematics.map(t => t[1]), 1);

  // ===== Chart: New Organisations by Month =====
  const userMonthCounts: Record<string, number> = {};
  monthsList.forEach(m => { userMonthCounts[m] = 0; });
  users.forEach(u => {
    if (u.joinedAt) {
      const date = new Date(u.joinedAt);
      if (!isNaN(date.getTime())) {
        userMonthCounts[monthsList[date.getMonth()]]++;
      }
    }
  });
  const maxUserMonthValue = Math.max(...Object.values(userMonthCounts), 1);

  return (
    <div className="space-y-8 pb-12">
      {/* Upper Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 font-medium">Real-time indicators, country distributions, and audit trails</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span>System Live (UTC)</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/50 p-1 rounded-xl max-w-fit space-x-1">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'listings' ? 'bg-white text-slate-850 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Listings
        </button>
        <button
          onClick={() => setActiveTab('organisations')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'organisations' ? 'bg-white text-slate-850 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Organisations
        </button>
      </div>

      {activeTab === 'listings' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Listings</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><FileText className="w-4 h-4" /></div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">{totalListings}</p>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Cumulative submissions</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Pending</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl animate-pulse"><Clock className="w-4 h-4" /></div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">{pendingApproval}</p>
                <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Awaiting validation</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Active</span>
                <div className="p-2 bg-green-50 text-green-600 rounded-xl"><CheckCircle className="w-4 h-4" /></div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">{activeListings}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Live on platforms</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Expired</span>
                <div className="p-2 bg-red-50 text-red-600 rounded-xl"><XCircle className="w-4 h-4" /></div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">{expiredListings}</p>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Archive listings</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Countries</span>
                <div className="p-2 bg-teal-50 text-teal-600 rounded-xl"><Globe2 className="w-4 h-4" /></div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">{countryCount}</p>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Erasmus+ Countries</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Listings by Month</h2>
                <p className="text-xs text-slate-400 mb-6">Submissions over the last 12 months</p>
              </div>
              <div className="space-y-4">
                {monthsList.map(month => {
                  const val = monthCounts[month] || 0;
                  const percent = (val / maxMonthValue) * 100;
                  return (
                    <div key={month} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>{month}</span>
                        <span>{val} {val === 1 ? 'listing' : 'listings'}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="bg-brand-primary h-full rounded-full transition-all duration-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Top Countries</h2>
                <p className="text-xs text-slate-400 mb-6">Active matches by country</p>
              </div>
              <div className="space-y-3.5">
                {sortedCountries.length > 0 ? sortedCountries.map(c => {
                  const percent = (c.count / maxCountryValue) * 100;
                  return (
                    <div key={c.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span className="flex items-center space-x-1.5"><span>{c.flag}</span><span>{c.name}</span></span>
                        <span>{c.count}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="bg-brand-accent h-full rounded-full transition-all duration-500" />
                      </div>
                    </div>
                  );
                }) : <div className="text-xs text-slate-400 py-12 text-center">No listings found.</div>}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Key Actions Target Projects</h2>
                <p className="text-xs text-slate-400 mb-6">Listings by Erasmus+ Key Action</p>
              </div>
              <div className="space-y-3.5">
                {Object.entries(keyActionCounts).map(([ka, val]) => {
                  const percent = (val / maxKeyActionValue) * 100;
                  return (
                    <div key={ka} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>{ka}</span><span>{val}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="bg-blue-500 h-full rounded-full transition-all duration-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Erasmus+ Sectors</h2>
                <p className="text-xs text-slate-400 mb-6">Listings by sector</p>
              </div>
              <div className="space-y-3.5">
                {sortedSectors.length > 0 ? sortedSectors.map(([sector, val]) => {
                  const percent = (val / maxSectorValue) * 100;
                  return (
                    <div key={sector} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>{sector}</span><span>{val}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="bg-emerald-500 h-full rounded-full transition-all duration-500" />
                      </div>
                    </div>
                  );
                }) : <div className="text-xs text-slate-400 py-12 text-center">No listings found.</div>}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Main Thematic Topics</h2>
                <p className="text-xs text-slate-400 mb-6">Top 8 thematic areas across listings</p>
              </div>
              <div className="space-y-3.5">
                {sortedThematics.length > 0 ? sortedThematics.map(([topic, val]) => {
                  const percent = (val / maxThematicValue) * 100;
                  return (
                    <div key={topic} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span className="truncate pr-2">{topic}</span><span className="shrink-0">{val}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="bg-brand-primary h-full rounded-full transition-all duration-500" />
                      </div>
                    </div>
                  );
                }) : <div className="text-xs text-slate-400 py-12 text-center">No listings found.</div>}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Partnership Preferences</h2>
                <p className="text-xs text-slate-400 mb-6">Roles being offered across listings</p>
              </div>
              <div className="space-y-3.5">
                {Object.entries(roleCounts).map(([role, val]) => {
                  const percent = (val / maxRoleValue) * 100;
                  return (
                    <div key={role} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>{role === 'Both' ? 'Open (Either)' : role}</span><span>{val}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="bg-violet-500 h-full rounded-full transition-all duration-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'organisations' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Orgs</span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Users className="w-4 h-4" /></div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">{totalUsers}</p>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Joined profiles</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Banned</span>
                <div className="p-2 bg-red-50 text-red-600 rounded-xl"><ShieldOff className="w-4 h-4" /></div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">{bannedUsers}</p>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Suspended accounts</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Admins</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><ShieldCheck className="w-4 h-4" /></div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">{adminCount}</p>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Global administrators</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Avg Listings/Org</span>
                <div className="p-2 bg-teal-50 text-teal-600 rounded-xl"><BarChart3 className="w-4 h-4" /></div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">{avgListingsPerOrg}</p>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Engagement rate</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">New Organisations by Month</h2>
                <p className="text-xs text-slate-400 mb-6">Signups over the last 12 months</p>
              </div>
              <div className="space-y-4">
                {monthsList.map(month => {
                  const val = userMonthCounts[month] || 0;
                  const percent = (val / maxUserMonthValue) * 100;
                  return (
                    <div key={month} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>{month}</span><span>{val} {val === 1 ? 'org' : 'orgs'}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="bg-purple-500 h-full rounded-full transition-all duration-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Submitting Organisation Types</h2>
                <p className="text-xs text-slate-400 mb-6">Based on organisations with at least one listing</p>
              </div>
              <div className="space-y-3.5">
                {Object.entries(orgTypeCounts).map(([type, val]) => {
                  const percent = (val / maxOrgTypeValue) * 100;
                  return (
                    <div key={type} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>{type}</span><span>{val}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="bg-emerald-500 h-full rounded-full transition-all duration-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Experience Level</h2>
                <p className="text-xs text-slate-400 mb-6">Organisation profiles by declared experience</p>
              </div>
              <div className="space-y-3.5">
                {Object.entries(experienceLevelCounts).map(([level, val]) => {
                  const percent = (val / maxExperienceLevelValue) * 100;
                  return (
                    <div key={level} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>{level}</span><span>{val}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="bg-amber-500 h-full rounded-full transition-all duration-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Erasmus+ Sectors</h2>
                <p className="text-xs text-slate-400 mb-6">Organisation profiles by sector</p>
              </div>
              <div className="space-y-3.5">
                {sortedProfileSectors.length > 0 ? sortedProfileSectors.map(([sector, val]) => {
                  const percent = (val / maxProfileSectorValue) * 100;
                  return (
                    <div key={sector} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>{sector}</span><span>{val}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="bg-green-500 h-full rounded-full transition-all duration-500" />
                      </div>
                    </div>
                  );
                }) : <div className="text-xs text-slate-400 py-12 text-center">No organisation profiles found.</div>}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Languages Spoken</h2>
                <p className="text-xs text-slate-400 mb-6">Top 8 languages across organisation profiles</p>
              </div>
              <div className="space-y-3.5">
                {sortedLanguages.length > 0 ? sortedLanguages.map(([lang, val]) => {
                  const percent = (val / maxLanguageValue) * 100;
                  return (
                    <div key={lang} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>{lang}</span><span>{val}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="bg-violet-500 h-full rounded-full transition-all duration-500" />
                      </div>
                    </div>
                  );
                }) : <div className="text-xs text-slate-400 py-12 text-center">No organisation profiles found.</div>}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Thematic Topics</h2>
                <p className="text-xs text-slate-400 mb-6">Top 8 thematic areas across organisation profiles</p>
              </div>
              <div className="space-y-3.5">
                {sortedProfileThematics.length > 0 ? sortedProfileThematics.map(([topic, val]) => {
                  const percent = (val / maxProfileThematicValue) * 100;
                  return (
                    <div key={topic} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span className="truncate pr-2">{topic}</span><span className="shrink-0">{val}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="bg-brand-primary h-full rounded-full transition-all duration-500" />
                      </div>
                    </div>
                  );
                }) : <div className="text-xs text-slate-400 py-12 text-center">No organisation profiles found.</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
