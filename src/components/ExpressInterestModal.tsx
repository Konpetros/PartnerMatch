import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, CheckCircle } from 'lucide-react';
import { submitPartnerRequest, checkExistingRequest } from '../services/firebase/firestore';
import { OrganisationProfile } from '../types';
import { PartnerRequest } from '../types/partnerRequest';

interface ExpressInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  listingId: string;
  listingTitle: string;
  toOrgUid: string;
  toOrgName: string;
  toOrgEmail: string;
  fromOrgUid: string;
  fromProfile: OrganisationProfile;
}

export default function ExpressInterestModal({
  isOpen,
  onClose,
  onSuccess,
  listingId,
  listingTitle,
  toOrgUid,
  toOrgName,
  toOrgEmail,
  fromOrgUid,
  fromProfile,
}: ExpressInterestModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const alreadySent = await checkExistingRequest(listingId, fromOrgUid);
      if (alreadySent) {
        setError('You have already expressed interest in this listing.');
        setLoading(false);
        return;
      }

      const request: Omit<PartnerRequest, 'id'> = {
        listingId,
        listingTitle,
        toOrgUid,
        toOrgName,
        toOrgEmail,
        fromOrgUid,
        fromOrgName: fromProfile.organisationName,
        fromOrgLogo: fromProfile.logoUrl || '',
        fromOrgCountry: fromProfile.country,
        fromOrgEmail: fromProfile.contactEmail,
        message: message.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await submitPartnerRequest(request);
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError('Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-md p-6 space-y-5 animate-fade-in">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">Express Interest</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Applying to: <span className="text-brand-primary font-bold">{listingTitle}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-800 text-base">Interest Sent!</p>
            <p className="text-xs text-slate-500 font-medium">
              <span className="font-bold text-slate-700">{toOrgName}</span> has been notified. You'll be able to see the status in your <span className="text-brand-primary font-bold">Partner Requests</span> dashboard.
            </p>
            <button onClick={onClose} className="mt-4 px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-brand-primary-hover transition-all">
              Close
            </button>
          </div>
        ) : (
          <>
            {/* From org info */}
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
              {fromProfile.logoUrl ? (
                <img src={fromProfile.logoUrl} alt={fromProfile.organisationName} className="w-10 h-10 rounded-lg object-contain border border-slate-100 bg-white p-1 shrink-0" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                  {fromProfile.organisationName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-slate-800">{fromProfile.organisationName}</p>
                <p className="text-[10px] text-slate-500 font-medium">{fromProfile.country} · {fromProfile.organisationType}</p>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Message <span className="text-slate-400 font-normal normal-case">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Briefly describe why your organisation is a good fit for this partnership..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all resize-none"
                maxLength={500}
              />
              <p className="text-[10px] text-slate-400 text-right">{message.length}/500</p>
            </div>

            {error && (
              <p className="text-xs text-red-600 font-semibold bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-2 ${loading ? 'bg-brand-primary/60' : 'bg-brand-primary hover:bg-brand-primary-hover'}`}
              >
                {loading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
