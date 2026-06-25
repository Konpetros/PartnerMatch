import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  resetPassword,
} from '../services/firebase/auth';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSignIn: () => void;
}

type Mode = 'signin' | 'register';

export default function SignInModal({ isOpen, onClose, onSuccessSignIn }: SignInModalProps) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your email address first.');
      return;
    }
    setResetLoading(true);
    setErrorMsg('');
    try {
      await resetPassword(email.trim());
      setResetSent(true);
    } catch {
      setErrorMsg('Could not send reset email. Please check the address and try again.');
    } finally {
      setResetLoading(false);
    }
  };

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setErrorMsg('');
    setShowPassword(false);
    setAgreedToTerms(false);
    setAgreedToPrivacy(false);
    setResetSent(false);
    setResetLoading(false);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    resetForm();
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await signInWithGoogle();
      onSuccessSignIn();
      onClose();
    } catch (err: any) {
      setErrorMsg('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        if (!displayName.trim()) {
          setErrorMsg('Please enter your organisation or full name.');
          setIsLoading(false);
          return;
        }
        if (!agreedToPrivacy || !agreedToTerms) {
          setErrorMsg('Please accept the Privacy Policy and Terms & Conditions to continue.');
          setIsLoading(false);
          return;
        }
        await registerWithEmail(email, password, displayName.trim());
      }
      onSuccessSignIn();
      onClose();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorMsg('Incorrect email or password.');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already registered. Please sign in instead.');
      } else if (code === 'auth/weak-password') {
        setErrorMsg('Password must be at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        setErrorMsg('Please enter a valid email address.');
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="relative bg-white rounded-[24px] max-w-xl w-full mx-4 p-6 shadow-2xl z-10 animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-slate-800">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === 'signin'
                ? 'Sign in to manage your listings and find partners.'
                : 'Join PartnerMatch and start finding Erasmus+ partners.'}
            </p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 border-2 border-slate-200 hover:border-brand-primary text-slate-700 hover:text-brand-primary py-3 rounded-brand text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Google consent note */}
          <p className="text-center text-[11px] text-slate-400 leading-relaxed -mt-2">
            By continuing with Google you agree to our{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-500 hover:text-brand-primary hover:underline"
            >
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-500 hover:text-brand-primary hover:underline"
            >
              Privacy Policy
            </a>
          </p>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-1 border-t border-slate-200" />
            <span className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">or</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Organisation / Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Helios Youth Association"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organisation.eu"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-2.5">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={agreedToPrivacy}
                      onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      onClick={() => setAgreedToPrivacy(!agreedToPrivacy)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                        agreedToPrivacy ? 'bg-brand-primary border-brand-primary' : 'border-slate-300 hover:border-brand-primary'
                      }`}
                    >
                      {agreedToPrivacy && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 leading-relaxed">
                    I have read and agree to the{' '}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-brand-primary hover:underline cursor-pointer"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer group">
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      onClick={() => setAgreedToTerms(!agreedToTerms)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                        agreedToTerms ? 'bg-brand-primary border-brand-primary' : 'border-slate-300 hover:border-brand-primary'
                      }`}
                    >
                      {agreedToTerms && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 leading-relaxed">
                    I have read and agree to the{' '}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-brand-primary hover:underline cursor-pointer"
                    >
                      Terms & Conditions
                    </a>
                  </span>
                </label>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-red-700">{errorMsg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover disabled:bg-slate-300 text-white py-3 rounded-brand text-sm font-bold transition-all cursor-pointer"
            >
              {isLoading
                ? 'Please wait...'
                : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          {mode === 'signin' && (
            <>
              {resetSent ? (
                <p className="text-center text-xs text-emerald-600 font-semibold bg-emerald-50 rounded-xl px-4 py-3">
                  ✓ Password reset email sent. Check your inbox.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="text-center text-xs text-slate-400 hover:text-brand-primary font-semibold w-full cursor-pointer transition-colors"
                >
                  {resetLoading ? 'Sending...' : 'Forgot your password?'}
                </button>
              )}
              <p className="text-center text-xs text-slate-500 font-medium">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-bold text-brand-primary hover:underline cursor-pointer"
                >
                  Create one
                </button>
              </p>
            </>
          )}

          {mode === 'register' && (
            <p className="text-center text-xs text-slate-500 font-medium">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="font-bold text-brand-primary hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
