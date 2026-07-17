import { useState } from 'react';
import { LogOut, PlusCircle, ClipboardList, Pencil, Trash2, AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react';
import { Listing } from '../../types';
import { formatDate } from '../../utils';

interface ListingsSectionProps {
  listings: Listing[];
  filteredListings: Listing[];
  onUpdateListingStatus: (id: string, status: 'active' | 'pending' | 'expired' | 'partnership-found' | 'rejected') => void;
  activeTab: 'All' | 'Active' | 'Pending' | 'Expired' | 'Rejected' | 'Partnerships';
  setActiveTab: (tab: 'All' | 'Active' | 'Pending' | 'Expired' | 'Rejected' | 'Partnerships') => void;
  tabCounts: Record<string, number>;
  currentUser: string | null;
  initials: string;
  onSignOut: () => void;
  onNavigate: (view: string) => void;
  setActiveSection: (section: any) => void;
  onEditListing: (id: string) => void;
  onDeleteListing: (id: string) => void;
}

export default function ListingsSection({
  listings,
  filteredListings,
  onUpdateListingStatus,
  activeTab,
  setActiveTab,
  tabCounts,
  currentUser,
  initials,
  onSignOut,
  onNavigate,
  setActiveSection,
  onEditListing,
  onDeleteListing,
}: ListingsSectionProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmPartnershipId, setConfirmPartnershipId] = useState<string | null>(null);

  return (
    <>
      {/* Mobile Profile bar wrapper (rendered on mobile since desktop sidebar is hidden) */}
      <div className="block md:hidden bg-white rounded-[20px] p-5 border border-blue-50/80 shadow-xs space-y-4 animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
            {initials}
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-slate-800 text-xs">{currentUser}</h3>
            <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Erasmus+ Member</p>
          </div>
          <button
            onClick={onSignOut}
            className="p-2 text-slate-400 hover:text-red-500 rounded-full bg-slate-50 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('submit')}
            className="flex-1 inline-flex items-center justify-center space-x-1 bg-brand-primary text-white py-2.5 rounded-xl font-bold text-[11px] cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-brand-accent" />
            <span>Submit New</span>
          </button>
          <button
            onClick={() => setActiveSection('profile')}
            className="flex-1 border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 py-2.5 rounded-xl font-bold text-[11px] cursor-pointer"
          >
            Profile Settings
          </button>
        </div>
      </div>

      {/* Action Navigation Header: Tabs & Search query controls */}
      <div className="bg-white rounded-[24px] border border-blue-50/80 p-5 sm:p-6 shadow-sm space-y-5 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          
          {/* Tab options rows */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scroller-hide bg-slate-50 p-1 rounded-xl">
            {(['All', 'Active', 'Pending', 'Expired', 'Rejected', 'Partnerships'] as const).map(tab => {
              const isActive = activeTab === tab;
              const itemCounter = tabCounts[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center space-x-2 ${
                    isActive 
                      ? 'bg-white text-brand-primary shadow-xs font-extrabold' 
                      : 'text-slate-500 hover:text-slate-850'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-50 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                    {itemCounter}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* LISTINGS DISPLAY GRID or TABLE */}
        {filteredListings.length === 0 ? (
          /* Empty state section per tab requirement */
          <div className="text-center py-16 px-6 max-w-md mx-auto space-y-4 animate-fade-in">
            <div className="mx-auto w-14 h-14 bg-indigo-50 text-brand-primary rounded-full flex items-center justify-center shadow-xs">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-800">No Listings Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-semibold">
                We couldn't find any {activeTab !== 'All' ? activeTab.toLowerCase() : ''} listings matching your search. Try adjusting your query or publish a new one.
              </p>
            </div>
            <button
              onClick={() => onNavigate('submit')}
              className="px-5 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer inline-flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Your First Listing</span>
            </button>
          </div>
        ) : (
          /* Desktop and tablet table layout (hidden on mobile, mapped into rows) */
          <div className="overflow-x-auto">
            
            {/* Desktop and Tablet table */}
            <table className="w-full text-left border-collapse hidden sm:table">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Organisation</th>
                  <th className="pb-3 text-center">Deadline</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map(listing => {
                  const statusVal = listing.status || 'active';
                  return (
                    <tr 
                      key={listing.id}
                      className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors group"
                    >
                      {/* Organisation metadata col */}
                      <td className="py-4 pl-2">
                        <div className="flex items-center space-x-3.5">
                          {listing.submitterProfile?.logoUrl ? (
                            <img 
                              src={listing.submitterProfile.logoUrl} 
                              className="w-12 h-12 object-contain rounded-xl shrink-0 border border-slate-100 shadow-xs bg-white p-1" 
                              alt={listing.name} 
                              referrerPolicy="no-referrer" 
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl shrink-0 border border-slate-100 shadow-xs bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-sm">
                              {listing.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="space-y-0.5">
                            {listing.title && (
                              <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 group-hover:text-brand-primary transition-colors">
                                {listing.title}
                              </h4>
                            )}
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1">
                              {listing.name}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium flex items-center space-x-1">
                              <span>{listing.countryFlag}</span>
                              <span>{listing.submitterProfile?.city || (listing as any).city ? `${listing.submitterProfile?.city || (listing as any).city}, ` : ''}{listing.country}</span>
                            </p>
                          </div>
                        </div>
                        {listing.status === 'rejected' && listing.rejectionReason && (
                          <div className="mt-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 max-w-lg">
                            <p className="text-[10px] font-bold text-red-700 uppercase tracking-wide mb-0.5">Rejection Reason</p>
                            <p className="text-xs text-red-600 font-medium leading-relaxed">{listing.rejectionReason}</p>
                          </div>
                        )}
                      </td>

                      {/* Deadline Date col */}
                      <td className="py-4 text-center font-bold text-xs text-slate-700">
                        {formatDate(listing.partnerSearchDeadline)}
                      </td>

                      {/* Status pill col */}
                      <td className="py-4 text-center">
                        {statusVal === 'active' && (
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                            Active
                          </span>
                        )}
                        {statusVal === 'pending' && (
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                            Pending
                          </span>
                        )}
                        {statusVal === 'expired' && (
                          <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                            Expired
                          </span>
                        )}
                        {statusVal === 'rejected' && (
                          <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                            Rejected
                          </span>
                        )}
                        {statusVal === 'partnership-found' && (
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                            Partnership Found
                          </span>
                        )}
                      </td>

                      {/* Actions button col */}
                      <td className="py-4 text-right pr-2 relative">
                        <div className="inline-flex items-center space-x-2.5">
                          {statusVal === 'active' && (
                            <button
                              onClick={() => setConfirmPartnershipId(listing.id)}
                              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Mark as Partnership Found"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {statusVal === 'partnership-found' && (
                            <button
                              onClick={() => onUpdateListingStatus(listing.id, 'active')}
                              className="p-2 text-slate-500 hover:text-green-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Mark as Active Again"
                            >
                              <RefreshCcw className="w-4 h-4" />
                            </button>
                          )}
                          {/* Edit Button */}
                          <button
                            onClick={() => onEditListing(listing.id)}
                            className="p-2 text-slate-500 hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Proposal"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => setConfirmDeleteId(listing.id)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Delete Proposal"
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

            {/* Mobile Cards listing format (hidden on larger devices) */}
            <div className="block sm:hidden space-y-4">
              {filteredListings.map(listing => {
                const statusVal = listing.status || 'active';
                return (
                  <div 
                    key={listing.id}
                    className="p-4 bg-slate-50/70 rounded-2xl border border-slate-150/40 space-y-3.5 relative"
                  >
                    <div className="flex items-start space-x-3">
                      {listing.submitterProfile?.logoUrl ? (
                        <img 
                          src={listing.submitterProfile.logoUrl} 
                          className="w-11 h-11 object-contain rounded-xl border border-slate-100 bg-white p-1" 
                          alt={listing.name} 
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl border border-slate-100 bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-sm">
                          {listing.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        {listing.title && (
                          <h4 className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug">
                            {listing.title}
                          </h4>
                        )}
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {listing.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5 flex items-center space-x-1">
                          <span>{listing.countryFlag}</span>
                          <span>{listing.submitterProfile?.city || (listing as any).city ? `${listing.submitterProfile?.city || (listing as any).city}, ` : ''}{listing.country}</span>
                        </p>
                      </div>
                    </div>

                    {listing.status === 'rejected' && listing.rejectionReason && (
                      <div className="mt-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                        <p className="text-[10px] font-bold text-red-700 uppercase tracking-wide mb-0.5">Rejection Reason</p>
                        <p className="text-xs text-red-600 font-medium leading-relaxed">{listing.rejectionReason}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-150/40">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Deadline</span>
                        <span className="font-bold text-slate-700 text-[11px]">
                          {formatDate(listing.partnerSearchDeadline)}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block text-right tracking-wider mb-0.5">Status</span>
                        {statusVal === 'active' && (
                          <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Active
                          </span>
                        )}
                        {statusVal === 'pending' && (
                          <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Pending
                          </span>
                        )}
                        {statusVal === 'expired' && (
                          <span className="bg-red-100 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Expired
                          </span>
                        )}
                        {statusVal === 'rejected' && (
                          <span className="bg-red-50 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Rejected
                          </span>
                        )}
                        {statusVal === 'partnership-found' && (
                          <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Found
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons list in mobile context */}
                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-150/40">
                      {statusVal === 'active' && (
                        <button
                          onClick={() => setConfirmPartnershipId(listing.id)}
                          className="p-1 px-2 border border-slate-200 rounded-lg text-blue-600 font-semibold text-[10px] hover:bg-blue-50 flex items-center space-x-1 cursor-pointer"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Found</span>
                        </button>
                      )}
                      {statusVal === 'partnership-found' && (
                        <button
                          onClick={() => onUpdateListingStatus(listing.id, 'active')}
                          className="p-1 px-2 border border-slate-200 rounded-lg text-green-600 font-semibold text-[10px] hover:bg-green-50 flex items-center space-x-1 cursor-pointer"
                        >
                          <RefreshCcw className="w-3 h-3" />
                          <span>Reactivate</span>
                        </button>
                      )}
                      <button
                        onClick={() => onEditListing(listing.id)}
                        className="p-1 px-2 border border-slate-200 rounded-lg text-slate-600 font-semibold text-[10px] hover:bg-slate-100 flex items-center space-x-1 cursor-pointer"
                      >
                        <Pencil className="w-3 h-3 text-slate-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(listing.id)}
                        className="p-1 px-2 border border-slate-200 rounded-lg text-red-600 font-semibold text-[10px] hover:bg-red-50 flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 text-slate-400" />
                        <span>Delete</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>

      {/* 3. DELETION CONFIRMATION MODAL PROMPT */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-slide-in">
            <div className="p-3 bg-red-50 text-red-600 w-12 h-12 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                Are you sure you want to delete this listing?
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
                Are you sure you want to delete this listing? This cannot be undone.
              </p>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onDeleteListing(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PARTNERSHIP FOUND CONFIRMATION MODAL */}
      {confirmPartnershipId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-slide-in">
            <div className="p-3 bg-blue-50 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                Partnership Found! 🎉
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
                Congratulations! This listing will be removed from public view and kept as a private record in your dashboard's Partnerships tab. You can still find it there anytime.
              </p>
            </div>
            <div className="flex flex-col space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onUpdateListingStatus(confirmPartnershipId, 'partnership-found');
                  setConfirmPartnershipId(null);
                }}
                className="w-full px-4 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmPartnershipId(null)}
                className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
