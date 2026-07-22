import { useState, useRef, useEffect } from 'react';
import { Bell, MessageSquare, Handshake, Megaphone, FileText } from 'lucide-react';

interface NotificationBellProps {
  unreadMessagesCount: number;
  pendingRequestsCount: number;
  unreadAnnouncementsCount: number;
  pendingListingsCount: number;
  totalCount: number;
  onNavigate: (view: string) => void;
}

export default function NotificationBell({
  unreadMessagesCount,
  pendingRequestsCount,
  unreadAnnouncementsCount,
  pendingListingsCount,
  totalCount,
  onNavigate,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const items = [
    { key: 'messages', count: unreadMessagesCount, label: 'unread message', icon: MessageSquare, view: 'messages', color: 'text-blue-600 bg-blue-50' },
    { key: 'requests', count: pendingRequestsCount, label: 'pending partner request', icon: Handshake, view: 'partner-requests', color: 'text-violet-600 bg-violet-50' },
    { key: 'announcements', count: unreadAnnouncementsCount, label: 'new announcement', icon: Megaphone, view: 'announcements', color: 'text-amber-600 bg-amber-50' },
    { key: 'listings', count: pendingListingsCount, label: 'listing awaiting review', icon: FileText, view: 'admin-pending', color: 'text-red-600 bg-red-50' },
  ].filter((item) => item.count > 0);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-brand-primary transition-all cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-[18px] h-[18px]" />
        {totalCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full">
            {totalCount > 9 ? '9+' : totalCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 bg-white rounded-[16px] border border-slate-200 shadow-xl w-72 z-50 animate-fade-in overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-800">Notifications</p>
          </div>
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-xs font-semibold text-slate-400">You're all caught up.</p>
            </div>
          ) : (
            <div className="py-1">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => { onNavigate(item.view); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      {item.count} {item.label}{item.count > 1 ? 's' : ''}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
