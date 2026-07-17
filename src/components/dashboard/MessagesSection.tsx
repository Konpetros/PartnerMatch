import { useState, useEffect } from 'react';
import { MessageSquare, ArrowLeft, Send, Archive, ArchiveRestore } from 'lucide-react';
import { PartnerRequest } from '../../types/partnerRequest';
import { Message } from '../../types/message';
import { OrganisationProfile } from '../../types/profile';
import { sendMessage, subscribeToMessages } from '../../services/firebase/firestore';

interface MessagesSectionProps {
  conversations: PartnerRequest[];
  archivedConversations: PartnerRequest[];
  onArchiveToggle: (id: string) => void;
  activeChatRequest: PartnerRequest | null;
  setActiveChatRequest: (req: PartnerRequest | null) => void;
  isConversationUnread: (req: PartnerRequest) => boolean;
  requestsLoading: boolean;
  currentUserUid: string | null;
  currentUser: string | null;
  organisationProfile: OrganisationProfile | null;
  showToast: (message: string) => void;
}

export default function MessagesSection({
  conversations,
  archivedConversations,
  onArchiveToggle,
  activeChatRequest,
  setActiveChatRequest,
  isConversationUnread,
  requestsLoading,
  currentUserUid,
  currentUser,
  organisationProfile,
  showToast,
}: MessagesSectionProps) {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const displayedConversations = showArchived ? archivedConversations : conversations;

  useEffect(() => {
    if (activeChatRequest && currentUserUid) {
      const unsubscribe = subscribeToMessages(activeChatRequest.id, currentUserUid, setChatMessages);
      return () => unsubscribe();
    } else {
      setChatMessages([]);
    }
  }, [activeChatRequest, currentUserUid]);

  const getOtherParty = (req: PartnerRequest) => {
    const iAmSender = req.fromOrgUid === currentUserUid;
    return {
      uid: iAmSender ? req.toOrgUid : req.fromOrgUid,
      name: iAmSender ? req.toOrgName : req.fromOrgName,
      logo: iAmSender ? req.toOrgLogo : req.fromOrgLogo,
    };
  };

  const handleSend = () => {
    if (!chatInput.trim() || !currentUserUid || !activeChatRequest) return;
    const other2 = getOtherParty(activeChatRequest);
    const text = chatInput.trim();
    setChatInput('');
    setChatSending(true);
    sendMessage(activeChatRequest.id, currentUserUid, other2.uid, text)
      .catch(() => showToast('Failed to send message.'))
      .finally(() => setChatSending(false));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-extrabold text-slate-800">Messages</h2>
        <p className="text-sm text-slate-500 mt-1">Your conversations with accepted partners.</p>
      </div>
      {requestsLoading ? (
        <div className="text-center py-12 text-slate-400 text-sm font-medium">Loading conversations...</div>
      ) : conversations.length === 0 && archivedConversations.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-200 mx-auto" />
          <p className="text-sm font-semibold text-slate-400">No conversations yet</p>
          <p className="text-xs text-slate-400">Once a partner request is accepted, you can message each other here.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ minHeight: '520px' }}>

          {/* LEFT: conversation list */}
          <div className={`md:w-72 md:border-r border-slate-100 md:shrink-0 overflow-y-auto ${activeChatRequest ? 'hidden md:block' : 'block'}`}>
            <div className="flex bg-slate-50 p-1 m-2 rounded-lg gap-1">
              <button
                onClick={() => setShowArchived(false)}
                className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${!showArchived ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Active ({conversations.length})
              </button>
              <button
                onClick={() => setShowArchived(true)}
                className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${showArchived ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Archived ({archivedConversations.length})
              </button>
            </div>
            {displayedConversations.length === 0 ? (
              <p className="text-center text-xs text-slate-400 font-medium py-8 px-4">
                {showArchived ? 'No archived conversations.' : 'No active conversations.'}
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {displayedConversations.map(req => {
                  const other = getOtherParty(req);
                  const isSelected = activeChatRequest?.id === req.id;
                  return (
                    <div
                      key={req.id}
                      onClick={() => setActiveChatRequest(req)}
                      className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border-l-2 border-brand-primary' : 'hover:bg-slate-50 border-l-2 border-transparent'}`}
                    >
                      {other.logo ? (
                        <img src={other.logo} alt={other.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-xl object-contain border border-slate-100 bg-white p-1 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                          {other.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-slate-800 truncate">{other.name}</p>
                          {isConversationUnread(req) && !isSelected && (
                            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium truncate">Re: {req.listingTitle}</p>
                        <p className={`text-xs truncate mt-0.5 ${isConversationUnread(req) && !isSelected ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>{req.lastMessageText || 'No messages yet — say hello'}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onArchiveToggle(req.id); }}
                        className="p-1.5 text-slate-300 hover:text-slate-500 rounded-lg transition-colors cursor-pointer shrink-0"
                        title={showArchived ? 'Unarchive' : 'Archive'}
                      >
                        {showArchived ? <ArchiveRestore className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: active chat pane */}
          <div className={`flex-1 flex-col min-w-0 ${activeChatRequest ? 'flex' : 'hidden md:flex'}`}>
            {!activeChatRequest ? (
              <div className="flex-1 flex items-center justify-center text-center px-6 py-16">
                <div className="space-y-2">
                  <MessageSquare className="w-10 h-10 text-slate-200 mx-auto" />
                  <p className="text-sm font-semibold text-slate-400">Select a conversation</p>
                </div>
              </div>
            ) : (() => {
              const other = getOtherParty(activeChatRequest);
              return (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 shrink-0">
                    <button onClick={() => setActiveChatRequest(null)} className="md:hidden p-1.5 -ml-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer shrink-0">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    {other.logo ? (
                      <img src={other.logo} alt={other.name} referrerPolicy="no-referrer" className="w-9 h-9 rounded-lg object-contain border border-slate-100 bg-white p-0.5 shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-xs shrink-0">
                        {other.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{other.name}</p>
                      <p className="text-[11px] text-slate-400 font-medium truncate">Re: {activeChatRequest.listingTitle}</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 bg-slate-50 min-h-[300px]">
                    {chatMessages.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 font-medium py-8">No messages yet. Say hello to start the conversation.</p>
                    ) : (
                      chatMessages.map(msg => {
                        const mine = msg.fromUid === currentUserUid;
                        const avatarLogo = mine ? organisationProfile?.logoUrl : other.logo;
                        const avatarName = mine ? (organisationProfile?.organisationName || currentUser || '?') : other.name;
                        const avatar = avatarLogo ? (
                          <img src={avatarLogo} alt={avatarName} referrerPolicy="no-referrer" className="w-7 h-7 rounded-lg object-contain border border-slate-100 bg-white p-0.5 shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-[10px] shrink-0">
                            {(avatarName || '?').charAt(0).toUpperCase()}
                          </div>
                        );
                        return (
                          <div key={msg.id} className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                            {!mine && avatar}
                            <div className={`max-w-[70%] px-3.5 py-2 rounded-2xl ${mine ? 'bg-brand-primary text-white rounded-br-md' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-md'}`}>
                              <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                            </div>
                            {mine && avatar}
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="flex items-center gap-2 px-3 py-3 border-t border-slate-100 shrink-0">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !chatSending && chatInput.trim() && currentUserUid) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Write a message"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all"
                    />
                    <button
                      disabled={chatSending || !chatInput.trim()}
                      onClick={handleSend}
                      className="w-10 h-10 flex items-center justify-center bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all cursor-pointer shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              );
            })()}
          </div>

        </div>
      )}
    </div>
  );
}
