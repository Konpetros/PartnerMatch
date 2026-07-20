import React, { useState } from 'react';
import { Listing } from '../../types';
import { 
  Search, 
  Trash2, 
  ChevronDown, 
  X, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

interface AdminAllListingsProps {
  listings: Listing[];
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: 'active' | 'pending' | 'expired' | 'partnership-found' | 'rejected') => void;
}

type TabType = 'all' | 'active' | 'pending' | 'expired' | 'rejected' | 'partnership-found';

export default function AdminAllListings({
  listings,
  onDelete,
  onUpdateStatus,
}: AdminAllListingsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 1. Tab Counts
  const counts = {
    all: listings.length,
    active: listings.filter(l => l.status === 'active' || !l.status).length,
    pending: listings.filter(l => l.status === 'pending').length,
    expired: listings.filter(l => l.status === 'expired').length,
    rejected: listings.filter(l => l.status === 'rejected').length,
    'partnership-found': listings.filter(l => l.status === 'partnership-found').length,
  };

  // 2. Filters
  const filteredListings = listings.filter(item => {
    // Tab filter
    const statusVal = item.status || 'active';
    if (activeTab !== 'all' && statusVal !== activeTab) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(query);
      const matchCountry = item.country.toLowerCase().includes(query);
      const matchEmail = item.contactEmail.toLowerCase().includes(query);
      return matchName || matchCountry || matchEmail;
    }
    return true;
  });

  // 3. Selection
  const isAllSelected = filteredListings.length > 0 && selectedIds.length === filteredListings.length;
  
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredListings.map(l => l.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // 4. Bulk Delete
  const handleBulkDelete = () => {
    const count = selectedIds.length;
    if (count === 0) return;

    const confirmed = window.confirm(`Are you absolutely sure you want to permanently delete the ${count} selected listing(s)? This action is irreversible.`);
    if (confirmed) {
      selectedIds.forEach(id => onDelete(id));
      setSelectedIds([]);
    }
  };

  const handleDeleteOne = (id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (confirmed) {
      onDelete(id);
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  // 5. Render Status Badge Helper
  const getStatusBadge = (status: string) => {
    const s = status || 'active';
    switch (s) {
      case 'active':
        return (
          <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Active</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full text-xs font-bold font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
            <span>Pending</span>
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center space-x-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-bold font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>Expired</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1.5 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold font-sans border border-red-100">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>Rejected</span>
          </span>
        );
      case 'partnership-found':
        return (
          <span className="inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full text-xs font-bold font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
            <span>Matched</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">All Listings</h1>
        <p className="text-sm text-slate-500 font-medium">Bulk modify, change active status, or prune listing records</p>
      </div>

      {/* Filtering & Actions bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/50 rounded-xl max-w-fit">
          {(['all', 'active', 'pending', 'expired', 'rejected', 'partnership-found'] as TabType[]).map(tab => {
            const isActive = activeTab === tab;
            const label = tab === 'partnership-found' ? 'Matched' : tab.charAt(0).toUpperCase() + tab.slice(1);
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedIds([]);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                  isActive
                    ? 'bg-white text-slate-850 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{label}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                  isActive ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/60 text-slate-500'
                }`}>
                  {counts[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative max-w-sm md:w-[320px] w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, country..."
            className="w-full text-xs font-bold rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-2.5 focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-150 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Bulk Delete Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2 text-orange-850 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-orange-600" />
            <span>Selected {selectedIds.length} item(s) to process.</span>
          </div>
          <button
            onClick={handleBulkDelete}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Selected</span>
          </button>
        </div>
      )}

      {/* Results Table */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-slate-200 p-16 text-center shadow-sm max-w-md mx-auto">
          <p className="text-sm font-bold text-slate-500">No listings found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                  <th className="py-4 px-6 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-6 w-20">Org. Logo</th>
                  <th className="py-4 px-6">Listing</th>
                  <th className="py-4 px-6">Country</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Deadline</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-semibold">
                {filteredListings.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  const statusVal = item.status || 'active';
                  return (
                    <tr 
                      key={item.id} 
                      className={`transition-colors duration-150 ${isChecked ? 'bg-brand-primary/5/50' : 'hover:bg-slate-50/30'}`}
                    >
                      {/* Checkbox */}
                      <td className="py-4.5 px-6 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(item.id)}
                          className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                        />
                      </td>

                      {/* Org Logo */}
                      <td className="py-4.5 px-6">
                        {item.submitterProfile?.logoUrl ? (
                          <img
                            src={item.submitterProfile.logoUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-contain rounded-lg border border-slate-200 bg-white p-1 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg border border-slate-200 shrink-0 bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-sm">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>

                      {/* Listing */}
                      <td className="py-4.5 px-6 max-w-xs">
                        <div>
                          <p className="text-slate-800 font-bold truncate">
                            {item.title || item.name}
                          </p>
                          <p className="text-xs text-slate-450 font-semibold truncate">{item.name} · {item.contactEmail}</p>
                        </div>
                      </td>

                      {/* Country */}
                      <td className="py-4.5 px-6">
                        <span className="flex items-center space-x-1 border border-slate-150/60 rounded-lg px-2 py-0.5 max-w-fit bg-slate-50 text-xs font-bold text-slate-600">
                          <span>{item.countryFlag || '🇪🇺'}</span>
                          <span>{item.country}</span>
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-4.5 px-6">
                        <span className="text-xs text-slate-450 uppercase font-black tracking-wider">
                          {item.type}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4.5 px-6">
                        {getStatusBadge(statusVal)}
                      </td>

                      {/* Deadline */}
                      <td className="py-4.5 px-6 text-xs text-slate-500 font-medium whitespace-nowrap">
                        {formatDate(item.partnerSearchDeadline)}
                      </td>

                      {/* Actions */}
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end space-x-3.5">
                          {/* Inline status select customizer */}
                          <div className="relative inline-block text-left">
                            <select
                              value={statusVal}
                              onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                              className="text-xs font-bold bg-slate-100 hover:bg-slate-150 border-0 outline-none text-slate-700 py-1.5 pl-3 pr-8 rounded-lg cursor-pointer appearance-none text-center"
                            >
                              <option value="active">Active</option>
                              <option value="pending">Pending</option>
                              <option value="expired">Expired</option>
                              <option value="rejected">Rejected</option>
                              <option value="partnership-found">Matched</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>

                          {/* Delete Item button */}
                          <button
                            onClick={() => handleDeleteOne(item.id, item.name)}
                            title="Delete Records"
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
