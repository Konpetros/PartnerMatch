import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const CONSENT_KEY = 'partnermatch_cookie_consent';

interface CookieConsentBannerProps {
  onNavigate: (view: string) => void;
}

export default function CookieConsentBanner({ onNavigate }: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'granted' || stored === 'denied') {
      window.gtag?.('consent', 'update', { analytics_storage: stored });
    } else {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: 'granted' | 'denied') => {
    localStorage.setItem(CONSENT_KEY, choice);
    window.gtag?.('consent', 'update', { analytics_storage: choice });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 shadow-xl p-4 sm:p-5 animate-fade-in">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <Cookie className="w-6 h-6 text-brand-primary shrink-0 hidden sm:block" />
        <p className="text-xs sm:text-sm text-slate-600 font-medium flex-1 text-center sm:text-left">
          We use essential cookies to run PartnerMatch, and optional analytics cookies to understand how the platform is used. You can accept or decline analytics cookies below.{' '}
          <button
            onClick={() => onNavigate('cookie-policy')}
            className="text-brand-primary font-semibold hover:underline cursor-pointer"
          >
            Read our Cookie Policy
          </button>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleChoice('denied')}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            Decline
          </button>
          <button
            onClick={() => handleChoice('granted')}
            className="px-4 py-2 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary-hover rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
