import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Pencil, Check, X, AlertCircle } from 'lucide-react';
import { subscribeToAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../services/firebase/firestore';

interface AdminAnnouncementsProps {
  currentAdminUid: string;
}

export default function AdminAnnouncements({ currentAdminUid }: AdminAnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editMessage, setEditMessage] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToAnnouncements((data) => {
      setAnnouncements(data);
    });
    return () => unsubscribe();
  }, []);

  const handleCreate = async () => {
    if (!title.trim() || !message.trim()) {
      setError('Both title and message are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createAnnouncement(title.trim(), message.trim(), currentAdminUid);
      setTitle('');
      setMessage('');
    } catch {
      setError('Failed to create announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement: any) => {
    setEditingId(announcement.id);
    setEditTitle(announcement.title);
    setEditMessage(announcement.message);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim() || !editMessage.trim()) return;
    try {
      await updateAnnouncement(id, editTitle.trim(), editMessage.trim());
      setEditingId(null);
    } catch {
      setError('Failed to update announcement.');
    }
  };

  const handleDelete = async (id: string) => {
    await deleteAnnouncement(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800">Announcements</h2>
        <p className="text-xs text-slate-400 mt-1">Create and manage announcements visible to all registered users in their dashboard.</p>
      </div>

      {/* Create New Announcement */}
      <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
          <Plus className="w-4 h-4 text-brand-primary" />
          <span>New Announcement</span>
        </h3>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all"
          />
          <textarea
            placeholder="Announcement message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all resize-none"
          />
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-primary-hover disabled:bg-slate-300 text-white py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
          >
            {loading ? 'Publishing...' : 'Publish Announcement'}
          </button>
        </div>
      </div>

      {/* Existing Announcements */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700">Published Announcements ({announcements.length})</h3>
        {announcements.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-slate-200 p-10 text-center space-y-2">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-500">No announcements yet</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-[20px] border border-slate-200 shadow-sm p-5 space-y-3">
              {editingId === announcement.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all"
                  />
                  <textarea
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all resize-none"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSaveEdit(announcement.id)}
                      className="flex items-center space-x-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between space-x-3">
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-bold text-slate-800">{announcement.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{announcement.message}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {new Date(announcement.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {announcement.updatedAt && ' · Edited'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-2 text-slate-400 hover:text-brand-primary hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
