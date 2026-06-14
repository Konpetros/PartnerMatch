/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lock, Sparkles, LogIn, LayoutDashboard, PlusCircle } from 'lucide-react';

interface MyListingsViewProps {
  onOpenSignIn: () => void;
  onNavigate: (view: string) => void;
}

export default function MyListingsView({ onOpenSignIn, onNavigate }: MyListingsViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12 animate-fade-in">
      {/* Visual Header */}
      <div className="bg-white rounded-[24px] border border-blue-50/80 shadow-sm overflow-hidden p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6">
        
        {/* Animated Visual lock */}
        <div className="relative mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-brand-accent">
          {/* Subtle surrounding ring */}
          <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-25 scale-125" />
          <Lock className="w-10 h-10 relative z-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
            Sign In to Manage Your Listings
          </h1>
          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
            Authenticating allows you to edit previous submissions, toggle active research states, or publish new proposals linked to your organization.
          </p>
        </div>

        {/* Action button */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            id="mylistings-signin-trigger"
            onClick={onOpenSignIn}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-3 rounded-brand font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-brand-accent" />
            <span>Sign In Now</span>
          </button>

          <button
            id="mylistings-browse-trigger"
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-brand font-bold text-sm border border-slate-250 transition-all cursor-pointer"
          >
            <span>Browse Active Proposals</span>
          </button>
        </div>
      </div>

      {/* Simulated Preview Dashboard - Adds ultimate craftsmanship and polish */}
      <div className="opacity-50 select-none pointer-events-none space-y-4">
        <div className="flex justify-between items-center px-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            <span>My Project Control Center (Draft Preview)</span>
          </h2>
          <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-bold">Offline Mode</span>
        </div>

        <div className="bg-white border border-gray-150 rounded-[20px] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xs">
          <div className="p-4 border border-dashed border-gray-200 rounded-xl space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Consortia Requests</p>
            <p className="text-2xl font-black text-slate-700">--</p>
          </div>
          <div className="p-4 border border-dashed border-gray-200 rounded-xl space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Weekly Views</p>
            <p className="text-2xl font-black text-slate-700">--</p>
          </div>
          <div className="p-4 border border-dashed border-gray-200 rounded-xl space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Active Action Items</p>
            <p className="text-2xl font-black text-slate-700">--</p>
          </div>
        </div>
      </div>
    </div>
  );
}
