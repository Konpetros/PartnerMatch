/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, PlusCircle, Compass, LogIn, Users, LayoutDashboard, User, LogOut, Settings, Megaphone } from 'lucide-react';
import PartnerMatchLogo from '../assets/PartnerMatchLogo';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSignIn: () => void;
  currentUser: string | null;
  onSignOut: () => void;
  isAdmin: boolean;
}

export default function Navbar({
  currentView,
  onNavigate,
  onOpenSignIn,
  currentUser,
  onSignOut,
  isAdmin,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close standard dropdown menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { id: 'browse', label: 'Browse Directory', icon: Compass },
    { id: 'organisations', label: 'Organisations', icon: Users },
    { id: 'submit', label: 'Submit Listing', icon: PlusCircle },
  ];

  const truncatedName = currentUser && currentUser.length > 12 
    ? `${currentUser.slice(0, 12)}...` 
    : currentUser;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-50/50 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            id="nav-logo-container"
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <PartnerMatchLogo size={32} />
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-brand-primary">
              Partner<span className="text-brand-accent">Match</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  id={`nav-link-${item.id}`}
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50/85 text-brand-primary'
                      : 'text-gray-600 hover:text-brand-primary hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sign In CTA or Profile Dropdown */}
          <div className="hidden md:flex items-center relative" ref={dropdownRef}>
            {/* Admin panel button — only visible to admin users */}
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="text-xs font-bold text-slate-400 hover:text-brand-primary transition-colors cursor-pointer border border-slate-200 px-3 py-1.5 rounded-full mr-3"
              >
                ⚙ Admin
              </button>
            )}
            {!currentUser ? (
              <button
                id="desktop-signin-btn"
                onClick={onOpenSignIn}
                className="flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-5 py-2.5 rounded-brand font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="flex items-center">
                <button
                  id="navbar-avatar-btn"
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className="flex items-center space-x-2 cursor-pointer focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-primary text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {currentUser.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-sm text-slate-700 max-w-[120px] truncate">
                    {truncatedName}
                  </span>
                </button>

                {avatarMenuOpen && (
                  <div className="absolute right-0 top-12 bg-white rounded-[16px] border border-slate-200 shadow-xl py-2 w-48 z-50 animate-fade-in">
                    <button
                      id="dropdown-my-listings"
                      onClick={() => {
                        onNavigate('my-listings');
                        setAvatarMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer w-full text-left"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      <span>My Listings</span>
                    </button>
                    <button
                      id="dropdown-my-profile"
                      onClick={() => {
                        onNavigate('my-profile');
                        setAvatarMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer w-full text-left"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>My Organisation</span>
                    </button>
                    <button
                      id="dropdown-announcements"
                      onClick={() => {
                        onNavigate('announcements');
                        setAvatarMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer w-full text-left"
                    >
                      <Megaphone className="w-4 h-4 text-slate-500" />
                      <span>Announcements</span>
                    </button>
                    <button
                      id="dropdown-settings"
                      onClick={() => {
                        onNavigate('settings');
                        setAvatarMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer w-full text-left"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Settings</span>
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      id="dropdown-signout"
                      onClick={() => {
                        onSignOut();
                        setAvatarMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-slate-50 transition-colors cursor-pointer w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Handheld/Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-500 hover:text-brand-primary hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  id={`mobile-nav-link-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-brand-primary'
                      : 'text-gray-600 hover:text-brand-primary hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            {!currentUser ? (
              <div className="pt-4 pb-2 border-t border-gray-100 px-4">
                <button
                  id="mobile-signin-btn"
                  onClick={() => {
                    onOpenSignIn();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-3 rounded-brand font-semibold transition-all cursor-pointer"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 pb-2 border-t border-gray-100 px-4 space-y-1">
                <div className="flex items-center space-x-3 px-4 py-2 border-b border-gray-50 mb-2">
                  <div className="w-9 h-9 rounded-full bg-brand-primary text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {currentUser.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-sm text-slate-700">
                    {truncatedName}
                  </span>
                </div>
                <button
                  id="mobile-my-listings"
                  onClick={() => {
                    onNavigate('my-listings');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-semibold text-gray-600 hover:text-brand-primary hover:bg-gray-50 transition-all cursor-pointer text-left"
                >
                  <LayoutDashboard className="w-5 h-5 text-gray-400" />
                  <span>My Listings</span>
                </button>
                <button
                  id="mobile-my-profile"
                  onClick={() => {
                    onNavigate('my-profile');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-semibold text-gray-600 hover:text-brand-primary hover:bg-gray-50 transition-all cursor-pointer text-left"
                >
                  <User className="w-5 h-5 text-gray-400" />
                  <span>My Profile</span>
                </button>
                <button
                  id="mobile-signout"
                  onClick={() => {
                    onSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-semibold text-red-500 hover:bg-red-50 transition-all cursor-pointer text-left"
                >
                  <LogOut className="w-5 h-5 text-red-450" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
