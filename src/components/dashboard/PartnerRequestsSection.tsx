import { Handshake, MessageSquare, CheckCheck, XCircle, Clock, CheckCircle } from 'lucide-react';
import { PartnerRequest } from '../../types/partnerRequest';
import { updateRequestStatus, hideRequestForUser, withdrawPartnerRequest } from '../../services/firebase/firestore';

interface PartnerRequestsSectionProps {
  incomingRequests: PartnerRequest[];
  sentRequests: PartnerRequest[];
  requestsTab: 'received' | 'sent';
  setRequestsTab: (tab: 'received' | 'sent') => void;
  requestsLoading: boolean;
  currentUserUid: string | null;
  onSelectListing?: (id: string) => void;
  setActiveChatRequest: (req: PartnerRequest) => void;
  setActiveSection: (section: any) => void;
  setIncomingRequests: (updater: (prev: PartnerRequest[]) => PartnerRequest[]) => void;
  setSentRequests: (updater: (prev: PartnerRequest[]) => PartnerRequest[]) => void;
  showToast: (message: string) => void;
}

export default function PartnerRequestsSection({
  incomingRequests,
  sentRequests,
  requestsTab,
  setRequestsTab,
  requestsLoading,
  currentUserUid,
  onSelectListing,
  setActiveChatRequest,
  setActiveSection,
  setIncomingRequests,
  setSentRequests,
  showToast,
}: PartnerRequestsSectionProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-extrabold text-slate-800">Partner Requests</h2>
        <p className="text-sm text-slate-500 mt-1">Manage incoming interest and track requests you've sent.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
        <button
          onClick={() => setRequestsTab('received')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${requestsTab === 'received' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Received {incomingRequests.length > 0 && `(${incomingRequests.length})`}
        </button>
        <button
          onClick={() => setRequestsTab('sent')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${requestsTab === 'sent' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Sent {sentRequests.length > 0 && `(${sentRequests.length})`}
        </button>
      </div>

      {requestsLoading ? (
        <div className="text-center py-12 text-slate-400 text-sm font-medium">Loading requests...</div>
      ) : requestsTab === 'received' ? (
        incomingRequests.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Handshake className="w-10 h-10 text-slate-200 mx-auto" />
            <p className="text-sm font-semibold text-slate-400">No incoming requests yet</p>
            <p className="text-xs text-slate-400">When organisations express interest in your listings, they'll appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incomingRequests.map(req => (
              <div key={req.id} onClick={() => onSelectListing?.(req.listingId)} className={`bg-white rounded-2xl border p-5 space-y-4 transition-all cursor-pointer hover:border-blue-300 hover:shadow-md ${req.status === 'pending' ? 'border-blue-100 shadow-sm' : 'border-slate-100'}`}>
                <div className="flex items-center gap-3">
                  {req.fromOrgLogo ? (
                    <img src={req.fromOrgLogo} alt={req.fromOrgName} className="w-11 h-11 rounded-xl object-contain border border-slate-100 bg-white p-1 shrink-0" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                      {req.fromOrgName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-800 truncate">{req.fromOrgName}</span>
                      <span className="text-xs text-slate-400 font-medium shrink-0">· {req.fromOrgCountry}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      interested in <span className="text-brand-primary font-bold">{req.listingTitle}</span>
                    </p>
                  </div>
                  <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ${
                    req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {req.status}
                  </span>
                </div>

                {req.message && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Their message</p>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-xl px-4 py-3">{req.message}</p>
                  </div>
                )}

                {req.status === 'accepted' && (
                  <div className="space-y-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveChatRequest(req); setActiveSection('messages'); }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Open chat
                    </button>
                  </div>
                )}

                {req.status === 'pending' && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await updateRequestStatus(req.id, 'accepted');
                        setIncomingRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'accepted' } : r));
                        showToast('Request accepted! Contact details revealed.');
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Accept
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await updateRequestStatus(req.id, 'declined');
                        setIncomingRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'declined' } : r));
                        showToast('Request declined.');
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Decline
                    </button>
                  </div>
                )}

                {req.status !== 'pending' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!currentUserUid) return;
                        await hideRequestForUser(req.id, currentUserUid);
                        setIncomingRequests(prev => prev.filter(r => r.id !== req.id));
                        showToast('Request cleared.');
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        sentRequests.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Clock className="w-10 h-10 text-slate-200 mx-auto" />
            <p className="text-sm font-semibold text-slate-400">No sent requests yet</p>
            <p className="text-xs text-slate-400">Express interest in partner calls to see them here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sentRequests.map(req => (
              <div key={req.id} onClick={() => onSelectListing?.(req.listingId)} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  {req.toOrgLogo ? (
                    <img src={req.toOrgLogo} alt={req.toOrgName} className="w-11 h-11 rounded-xl object-contain border border-slate-100 bg-white p-1 shrink-0" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                      {req.toOrgName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-800 truncate">{req.toOrgName}</span>
                      {req.toOrgCountry && <span className="text-xs text-slate-400 font-medium shrink-0">· {req.toOrgCountry}</span>}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      you applied to <span className="text-brand-primary font-bold">{req.listingTitle}</span>
                    </p>
                  </div>
                  <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ${
                    req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {req.status}
                  </span>
                </div>

                {req.message && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">My message</p>
                    <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 italic">"{req.message}"</p>
                  </div>
                )}

                {req.status === 'accepted' && (
                  <div className="space-y-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveChatRequest(req); setActiveSection('messages'); }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Open chat
                    </button>
                  </div>
                )}

                {req.status === 'pending' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await withdrawPartnerRequest(req.id);
                        setSentRequests(prev => prev.filter(r => r.id !== req.id));
                        showToast('Interest withdrawn.');
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      Withdraw Interest
                    </button>
                  </div>
                )}

                {req.status !== 'pending' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!currentUserUid) return;
                        await hideRequestForUser(req.id, currentUserUid);
                        setSentRequests(prev => prev.filter(r => r.id !== req.id));
                        showToast('Request cleared.');
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
