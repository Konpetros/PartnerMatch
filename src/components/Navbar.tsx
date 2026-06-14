/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Menu, X, PlusCircle, Compass, FolderHeart, LogIn, Info, Mail, Users } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSignIn: () => void;
}

export default function Navbar({ currentView, onNavigate, onOpenSignIn }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Browse Directory', icon: Compass },
    { id: 'organisations', label: 'Organisations', icon: Users },
    { id: 'submit', label: 'Submit Listing', icon: PlusCircle },
    { id: 'my-listings', label: 'My Listings', icon: FolderHeart },
  ];

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
            <div className="p-2 bg-brand-primary text-white rounded-xl transition-all duration-300 group-hover:rotate-6">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-brand-primary">
              Erasmus<span className="text-brand-accent">Match</span>
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

          {/* Sign In CTA */}
          <div className="hidden md:flex items-center">
            <button
              id="desktop-signin-btn"
              onClick={onOpenSignIn}
              className="flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-5 py-2.5 rounded-brand font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
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
            <div className="pt-4 pb-2 border-t border-gray-100 px-4">
              <button
                id="mobile-signin-btn"
                onClick={() => {
                  onOpenSignIn();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-2 w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-3 rounded-brand font-semibold transition-all"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
