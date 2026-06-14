import React, { useState } from 'react';
import { Listing } from '../../types';
import { 
  CheckCircle, 
  XCircle, 
  Edit2, 
  Trash2, 
  Globe2, 
  AlertCircle, 
  X,
  FileSpreadsheet
} from 'lucide-react';
import { getKeyActionBadgeStyle } from '../../utils/getBadgeStyle';
import { formatDate } from '../../utils/formatDate';

interface AdminPendingListingsProps {
  listings: Listing[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AdminPendingListings({
  listings,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: AdminPendingListingsProps) {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleOpenRejectModal = (id: string) => {
    setRejectingId(id);
    setRejectionReason('');
    setErrorText('');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectionReason.trim().length < 10) {
      setErrorText('Please provide a reason of at least 10 characters.');
      return;
    }
    if (rejectingId) {
      onReject(rejectingId, rejectionReason.trim());
      setRejectingId(null);
      setRejectionReason('');
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${name}"? This action is irreversible.`);
    if (confirmed) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Pending Approval</h1>
          <p className="text-sm text-slate-500 font-medium">Review, approve, or reject new partner search listings</p>
        </div>
        <div className="bg-brand-primary/10 text-brand-primary px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center space-x-2">
          <span>{listings.length} Pending</span>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-slate-200 p-16 text-center max-w-xl mx-auto flex flex-col items-center justify-center space-y-4 shadow-sm">
          <div className="p-4 bg-emerald-50 text-emerald-500 rounded-full">
            <CheckCircle className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">No Pending Listings</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Excellent job! All submitted listings have been successfully verified and processed.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                  <th className="py-4 px-6">Thumbnail</th>
                  <th className="py-4 px-6">Organisation Name</th>
                  <th className="py-4 px-6">Country</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Key Actions</th>
                  <th className="py-4 px-6">Submitted</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-semibold">
                {listings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-4.5 px-6">
                      <img
                        src={item.thumbnailUrl || 'https://picsum.photos/800/600'}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                    </td>

                    {/* Submitter Info */}
                    <td className="py-4.5 px-6 max-w-xs">
                      <div>
                        <p className="text-slate-800 font-bold hover:text-brand-primary transition-colors truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{item.contactEmail}</p>
                      </div>
                    </td>

                    {/* CountryFlag */}
                    <td className="py-4.5 px-6">
                      <span className="flex items-center space-x-1.5 text-slate-700 font-bold">
                        <span>{item.countryFlag || '🇪🇺'}</span>
                        <span>{item.country}</span>
                      </span>
                    </td>

                    {/* Org Type */}
                    <td className="py-4.5 px-6">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {item.type}
                      </span>
                    </td>

                    {/* Key Actions */}
                    <td className="py-4.5 px-6">
                      <div className="flex flex-wrap gap-1">
                        {item.keyActions.map((act) => (
                          <span
                            key={act}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getKeyActionBadgeStyle(act)}`}
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4.5 px-6 text-xs text-slate-500 font-medium">
                      {formatDate(item.createdAt || '')}
                    </td>

                    {/* Actions Panel */}
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Approve */}
                        <button
                          onClick={() => onApprove(item.id)}
                          title="Approve Listing"
                          className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all rounded-xl cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>

                        {/* Reject */}
                        <button
                          onClick={() => handleOpenRejectModal(item.id)}
                          title="Reject Listing"
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all rounded-xl cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => onEdit(item.id)}
                          title="Edit Listing"
                          className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-700 hover:text-white transition-all rounded-xl cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteClick(item.id, item.name)}
                          title="Delete Permanently"
                          className="p-2 bg-slate-50 text-red-500 border border-slate-200/80 hover:bg-red-50 hover:border-red-200 transition-all rounded-xl cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-red-500">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h3 className="text-lg font-black text-slate-800">Reject Listing</h3>
              </div>
              <button
                onClick={() => setRejectingId(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleConfirmReject} className="p-6 space-y-4">
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Please provide a precise rejection reason. The submitter organization will view this critical note in their private listing dashboard so they can correct information.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Rejection Reason *
                </label>
                <textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (e.target.value.trim().length >= 10) setErrorText('');
                  }}
                  placeholder="e.g., The OID specified (E10123456) is currently invalid, or the description requires clarification of specific Erasmus activities..."
                  className="w-full text-sm font-semibold rounded-2xl border border-slate-200 bg-slate-50 p-4 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-slate-400"
                  required
                />
                {errorText && (
                  <p className="text-xs font-bold text-red-500 flex items-center space-x-1">
                    <span>⚠️</span> <span>{errorText}</span>
                  </p>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 shadow-sm transition-colors cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
