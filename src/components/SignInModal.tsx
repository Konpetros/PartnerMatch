/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSignIn: (username: string) => void;
}

export default function SignInModal({ isOpen, onClose, onSuccessSignIn }: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        setIsLoading(false);
        return;
      }
      if (password.length < 4) {
        setErrorMsg('Password should contain at least 4 characters.');
        setIsLoading(false);
        return;
      }

      // Successful fake authentication update
      const username = email.split('@')[0];
      const capitalised = username.charAt(0).toUpperCase() + username.slice(1);
      onSuccessSignIn(capitalised);
      setIsLoading(false);
      onClose();
    }, 600);
  };

  const handleDemoSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      onSuccessSignIn('EU Representative');
      setIsLoading(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        id="signin-modal-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
      />

      {/* Main Panel Content */}
      <div 
        id="signin-modal-content"
        className="relative bg-white rounded-[24px] max-w-md w-full mx-4 p-6 sm:p-8 border border-blue-50/10 shadow-2xl z-10 animate-fade-in"
      >
        {/* Close Button */}
        <button
          id="signin-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-blue-50 text-brand-primary rounded-2xl">
              <Sparkles className="w-6 h-6 text-brand-accent animate-pulse" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">ErasmusMatch Portal</h2>
            <p className="text-xs text-slate-400">Access European partner lookup and listing directory services.</p>
          </div>

          {errorMsg && (
            <div id="signin-error-alert" className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="signin-email" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Account Email
              </label>
              <div className="relative">
                <input
                  id="signin-email"
                  type="email"
                  required
                  placeholder="name@organisation.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-primary focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-700 outline-none transition-all"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="signin-password" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Secure Password
              </label>
              <div className="relative">
                <input
                  id="signin-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-primary focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-700 outline-none transition-all"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              id="signin-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover disabled:bg-slate-300 text-white py-3 rounded-brand text-xs font-bold transition-all shadow-md cursor-pointer active:scale-97"
            >
              {isLoading ? 'Verifying Coordinates...' : 'Authenticate Account'}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-1 border-t border-slate-100" />
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">or</span>
              <div className="flex-1 border-t border-slate-100" />
            </div>

            <button
              type="button"
              onClick={() => {
                onSuccessSignIn('Petros');
                onClose();
              }}
              className="w-full border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white py-2.5 rounded-brand text-xs font-bold transition-all cursor-pointer"
            >
              ⚡ Quick Sign In as Admin (Testing Only)
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Or Quick-Start</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            id="demo-signin-btn"
            onClick={handleDemoSignIn}
            disabled={isLoading}
            className="w-full bg-slate-50 hover:bg-slate-100 disabled:bg-slate-300 text-slate-700 py-3 rounded-brand text-xs font-bold border border-slate-250 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Use Demonstration Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
