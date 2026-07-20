import { useState, useEffect } from 'react';
import { Rocket, X } from 'lucide-react';

const BANNER_KEY = 'partnermatch_new_platform_banner_dismissed';

interface NewPlatformBannerProps {
  isLoggedIn: boolean;
  onOpenSignIn: () => void;
}

export default function NewPlatformBanner({ isLoggedIn, onOpenSignIn }: NewPlatformBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoggedIn) return;
    const dismissed = localStorage.getItem(BANNER_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, [isLoggedIn]);

  const handleDismiss = () => {
    localStorage.setItem(BANNER_KEY, 'true');
    setVisible(false);
  };

  if (!visible || isLoggedIn) return null;

  return (
    <div className="relative z-[90] bg-brand-primary animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-center">
        <Rocket className="w-4 h-4 text-white shrink-0 hidden sm:block" />
        <p className="text-xs sm:text-sm text-white font-semibold">
          New platform, growing fast — be among the first organisations listed on PartnerMatch.
        </p>
        <button
          onClick={onOpenSignIn}
          className="shrink-0 px-3 py-1 text-xs font-bold text-brand-primary bg-white hover:bg-slate-100 rounded-lg transition-all cursor-pointer whitespace-nowrap"
        >
          Get Started
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="shrink-0 p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
