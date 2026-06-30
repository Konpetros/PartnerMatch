import React from 'react';
import { Listing, AdminUser } from '../../types';
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Globe2
} from 'lucide-react';

interface AdminDashboardProps {
  listings: Listing[];
  users: AdminUser[];
}

export default function AdminDashboard({
  listings,
  users,
}: AdminDashboardProps) {

  // 1. Calculate Stats
  const totalListings = listings.length;
  const pendingApproval = listings.filter(l => l.status === 'pending').length;
  const activeListings = listings.filter(l => l.status === 'active').length;
  const expiredListings = listings.filter(l => l.status === 'expired').length;
  const totalUsers = users.length;
  
  const uniqueCountries = new Set(listings.map(l => l.country).filter(Boolean));
  const countryCount = uniqueCountries.size;



  // 3. Chart 1 — Listings by Month
  const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthCounts: Record<string, number> = {};
  monthsList.forEach(m => { monthCounts[m] = 0; });
  listings.forEach(l => {
    if (l.createdAt) {
      const date = new Date(l.createdAt);
      if (!isNaN(date.getTime())) {
        const mIdx = date.getMonth();
        const mName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][mIdx];
        if (mName in monthCounts) {
          monthCounts[mName]++;
        }
      }
    }
  });
  const maxMonthValue = Math.max(...Object.values(monthCounts), 1);

  // 4. Chart 2 — Top Countries
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

  // 5. Chart 3 — Organisation Types
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

      {/* 6 Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-5">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Listings</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{totalListings}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Cumulative submissions</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Pending</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl animate-pulse">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{pendingApproval}</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Awaiting validation</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Active</span>
            <div className="p-2 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{activeListings}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Live on platforms</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Expired</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{expiredListings}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Archive listings</p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Users</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{totalUsers}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Joined profiles</p>
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Countries</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Globe2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{countryCount}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Erasmus+ Countries</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Chart 1: Listings by Month */}
        <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Listings by Month</h2>
            <p className="text-xs text-slate-400 mb-6">Submissions over the last 6 months</p>
          </div>
          <div className="space-y-4">
            {monthsList.map(month => {
              const val = monthCounts[month] || 0;
              const percent = (val / maxMonthValue) * 100;
              return (
                <div key={month} className="space-y-1.5Packed">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>{month}</span>
                    <span>{val} {val === 1 ? 'listing' : 'listings'}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className="bg-brand-primary h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Top Countries */}
        <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Top Countries</h2>
            <p className="text-xs text-slate-400 mb-6">Active matches by country</p>
          </div>
          <div className="space-y-3.5">
            {sortedCountries.length > 0 ? (
              sortedCountries.map(c => {
                const percent = (c.count / maxCountryValue) * 100;
                return (
                  <div key={c.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span className="flex items-center space-x-1.5">
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </span>
                      <span>{c.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="bg-brand-accent h-full rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-400 py-12 text-center">No listings found.</div>
            )}
          </div>
        </div>

        {/* Chart 3: Organisation Types */}
        <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Organisation Types</h2>
            <p className="text-xs text-slate-400 mb-6">Submitting entity distributions</p>
          </div>
          <div className="space-y-3.5">
            {Object.entries(orgTypeCounts).map(([type, val]) => {
              const percent = (val / maxOrgTypeValue) * 100;
              return (
                <div key={type} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>{type}</span>
                    <span>{val}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


    </div>
  );
}
