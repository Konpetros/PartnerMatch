import React, { useState } from 'react';
import { AppView } from '../../hooks/useNavigation';
import PartnerMatchLogo from '../../assets/PartnerMatchLogo';
import {
  LayoutDashboard,
  Clock,
  List,
  Users,
  LogOut,
  ChevronRight,
  Shield,
  Megaphone
} from 'lucide-react';

interface AdminLayoutProps {
  currentView: AppView;
  onNavigate: (view: string) => void;
  onSignOut: () => void;
  currentUser: string | null;
  children: React.ReactNode;
  pendingCount: number;
}

export default function AdminLayout({
  currentView,
  onNavigate,
  onSignOut,
  currentUser,
  children,
  pendingCount,
}: AdminLayoutProps) {
  const navItems = [
    { id: 'admin', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-pending', label: 'Pending', icon: Clock, badge: pendingCount },
    { id: 'admin-listings', label: 'All Listings', icon: List },
    { id: 'admin-users', label: 'Users', icon: Users },
    { id: 'admin-announcements', label: 'Announcements', icon: Megaphone },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col fixed h-full z-20">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-2">
            <PartnerMatchLogo size={28} />
            <div>
              <p className="text-white font-black text-sm">PartnerMatch</p>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Admin badge */}
        <div className="px-4 py-3 border-b border-slate-700/50">
          <div className="flex items-center space-x-2 bg-brand-primary/20 rounded-xl px-3 py-2">
            <Shield className="w-3.5 h-3.5 text-brand-primary" />
            <span className="text-xs font-bold text-brand-primary">Administrator</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3 h-3" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
          >
            ← Back to Site
          </button>
          <button
            onClick={onSignOut}
            className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8 min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
