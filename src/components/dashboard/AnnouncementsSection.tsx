import { Megaphone, X } from 'lucide-react';

interface AnnouncementsSectionProps {
  visibleAnnouncements: any[];
  onDismiss: (id: string) => void;
}

export default function AnnouncementsSection({ visibleAnnouncements, onDismiss }: AnnouncementsSectionProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-lg font-black text-slate-800">Announcements</h2>
        <p className="text-xs text-slate-500 mt-1">Latest updates and news from PartnerMatch.</p>
      </div>
      {visibleAnnouncements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center space-y-3">
          <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-500">No announcements</p>
          <p className="text-xs text-slate-400">Check back later for updates from PartnerMatch.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-xl shrink-0">
                  <Megaphone className="w-4 h-4 text-brand-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-bold text-slate-800">{announcement.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{announcement.message}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    {new Date(announcement.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => onDismiss(announcement.id)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
