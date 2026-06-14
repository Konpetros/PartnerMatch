import React, { useState } from 'react';
import { AdminUser } from '../../types';
import { 
  Search, 
  Shield, 
  LogOut, 
  Trash2, 
  AlertTriangle,
  UserCheck, 
  X,
  FileText,
  UserMinus
} from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

interface AdminUsersProps {
  users: AdminUser[];
  onDeleteUser: (uid: string) => void;
  onBanUser: (uid: string) => void;
  onUnbanUser: (uid: string) => void;
  onPromoteToAdmin: (uid: string) => void;
}

type TabType = 'all' | 'admins' | 'banned';

export default function AdminUsers({
  users,
  onDeleteUser,
  onBanUser,
  onUnbanUser,
  onPromoteToAdmin,
}: AdminUsersProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  // Show generic toast since we can just use native confirm/alerts where fits or keep it dynamic
  const handleViewListings = (displayName: string) => {
    alert(`Filter for "${displayName}" is coming with live Firebase synchronization.`);
  };

  // Tab Filtering counts
  const counts = {
    all: users.length,
    admins: users.filter(u => u.isAdmin).length,
    banned: users.filter(u => u.status === 'banned').length,
  };

  // Filters application
  const filteredUsers = users.filter(user => {
    // Tab checks
    if (activeTab === 'admins' && !user.isAdmin) return false;
    if (activeTab === 'banned' && user.status !== 'banned') return false;

    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = user.displayName.toLowerCase().includes(q);
      const matchEmail = user.email.toLowerCase().includes(q);
      return matchName || matchEmail;
    }
    return true;
  });

  const handleDeleteTrigger = (user: AdminUser) => {
    setDeletingUser(user);
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      onDeleteUser(deletingUser.uid);
      setDeletingUser(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">User Directory</h1>
        <p className="text-sm text-slate-500 font-medium">Verify credentials, toggle bans, or elevate administrative privileges</p>
      </div>

      {/* Filter and search row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Selection */}
        <div className="flex bg-slate-200/50 p-1 rounded-xl max-w-fit space-x-1">
          {(['all', 'admins', 'banned'] as TabType[]).map(tab => {
            const isActive = activeTab === tab;
            const label = tab === 'all' ? 'All Accounts' : tab === 'admins' ? 'Administrators' : 'Banned';
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                  isActive
                    ? 'bg-white text-slate-850 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{label}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                  isActive ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/60 text-slate-400'
                }`}>
                  {counts[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search tool */}
        <div className="relative max-w-sm md:w-[320px] w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
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

      {/* Users table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-slate-200 p-16 text-center shadow-sm max-w-md mx-auto">
          <p className="text-sm font-bold text-slate-500">No users found matching your query.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-center">Listings</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Privileges</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-semibold">
                {filteredUsers.map((user) => {
                  const initials = user.displayName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <tr key={user.uid} className="hover:bg-slate-50/30 transition-colors">
                      {/* Avatar & Display Name */}
                      <td className="py-4.5 px-6">
                        <div className="flex items-center space-x-3.5">
                          <div className={`w-9 h-9 rounded-full ${user.isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'} font-black text-xs flex items-center justify-center shrink-0`}>
                            {initials}
                          </div>
                          <div>
                            <p className="text-slate-800 font-bold truncate">
                              {user.displayName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">UID: {user.uid}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4.5 px-6 font-semibold text-slate-600">
                        {user.email}
                      </td>

                      {/* Joined */}
                      <td className="py-4.5 px-6 text-slate-500 font-medium text-xs whitespace-nowrap">
                        {formatDate(user.joinedAt)}
                      </td>

                      {/* ListingCount */}
                      <td className="py-4.5 px-6 text-center font-bold">
                        <span className="p-1 px-2.5 bg-slate-100 rounded-lg text-xs font-black text-slate-700">
                          {user.listingCount}
                        </span>
                      </td>

                      {/* Status Badges */}
                      <td className="py-4.5 px-6">
                        {user.status === 'active' ? (
                          <span className="inline-flex items-center space-x-1 bg-green-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span>Banned</span>
                          </span>
                        )}
                      </td>

                      {/* Role Badges */}
                      <td className="py-4.5 px-6">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center space-x-1 bg-indigo-50 text-indigo-650 px-2.5 py-1 rounded-full text-xs font-bold">
                            <Shield className="w-3.5 h-3.5 shrink-0" />
                            <span>Admin</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full text-xs font-bold">
                            <span>User</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* View Listings */}
                          <button
                            onClick={() => handleViewListings(user.displayName)}
                            title="View Listings"
                            className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-700 hover:text-white rounded-xl transition-all cursor-pointer"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Ban Toggle */}
                          {user.status === 'active' ? (
                            <button
                              onClick={() => {
                                const confirmed = window.confirm(`Are you sure you want to suspend/ban ${user.displayName}? They will lock out of features.`);
                                if (confirmed) onBanUser(user.uid);
                              }}
                              title="Ban User"
                              className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-505 hover:text-red-500 rounded-xl transition-all cursor-pointer"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onUnbanUser(user.uid)}
                              title="Unban User"
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-all cursor-pointer"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}

                          {/* Promote to Admin */}
                          <button
                            onClick={() => {
                              const confirmed = window.confirm(`Elevate ${user.displayName} to Global Administrator? This grants complete site powers.`);
                              if (confirmed) onPromoteToAdmin(user.uid);
                            }}
                            disabled={user.isAdmin}
                            title={user.isAdmin ? 'Already admin' : 'Promote to Admin'}
                            className={`p-2 rounded-xl transition-all ${
                              user.isAdmin 
                                ? 'bg-slate-50 text-slate-300 pointer-events-none' 
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white cursor-pointer'
                            }`}
                          >
                            <Shield className="w-4 h-4" />
                          </button>

                          {/* Permanently delete user */}
                          <button
                            onClick={() => handleDeleteTrigger(user)}
                            title="Delete Account Records"
                            className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all cursor-pointer"
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

      {/* Account Deletion Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6 shrink-0 animate-bounce" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-800">Prune User Account</h3>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                  You are about to delete <strong className="text-slate-800 font-bold">{deletingUser.displayName}</strong>. This will permanently delete the user and all their listings. This cannot be undone.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setDeletingUser(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-650 shadow-sm transition-colors cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
