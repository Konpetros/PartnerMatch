/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Listing, KeyAction } from '../types';
import { 
  Search, 
  ArrowRight, 
  Users, 
  Globe2, 
  Layers, 
  BookOpen, 
  RefreshCcw 
} from 'lucide-react';

interface HomeViewProps {
  listings: Listing[];
  onNavigate: (view: string) => void;
  onSelectListing: (id: string) => void;
}

export default function HomeView({ listings, onNavigate, onSelectListing }: HomeViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const isMobile = window.innerWidth < 768;
    const NUM_STARS = isMobile ? 15 : 30;
    const MOUSE_REPEL_DISTANCE = 120;
    const MOUSE_REPEL_FORCE = 3;

    const resize = () => {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: null as number | null, y: null as number | null };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const stars = Array.from({ length: NUM_STARS }, () => {
      const baseSpeedX = (Math.random() - 0.5) * 0.4;
      const baseSpeedY = (Math.random() - 0.5) * 0.4;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 10 + 8,
        opacity: Math.random() * 0.4 + 0.15,
        speedX: baseSpeedX,
        speedY: baseSpeedY,
        baseSpeedX,
        baseSpeedY,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.005,
      };
    });

    const drawStar = (x: number, y: number, size: number, rotation: number, glowing: boolean) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      if (glowing) {
        ctx.shadowColor = '#FFCC00';
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const innerAngle = outerAngle + (2 * Math.PI) / 10;
        ctx.lineTo(Math.cos(outerAngle) * size, Math.sin(outerAngle) * size);
        ctx.lineTo(Math.cos(innerAngle) * (size * 0.4), Math.sin(innerAngle) * (size * 0.4));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        let isGlowing = false;
        if (mouse.x !== null && mouse.y !== null) {
          const dx = star.x - mouse.x;
          const dy = star.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_REPEL_DISTANCE) {
            const force = (MOUSE_REPEL_DISTANCE - dist) / MOUSE_REPEL_DISTANCE;
            star.speedX += (dx / dist) * force * MOUSE_REPEL_FORCE * 0.1;
            star.speedY += (dy / dist) * force * MOUSE_REPEL_FORCE * 0.1;
            isGlowing = true;
          }
        }
        star.speedX += (star.baseSpeedX - star.speedX) * 0.05;
        star.speedY += (star.baseSpeedY - star.speedY) * 0.05;
        star.rotation += star.rotSpeed;
        star.x += star.speedX;
        star.y += star.speedY;
        if (star.x < -20) star.x = canvas.width + 20;
        if (star.x > canvas.width + 20) star.x = -20;
        if (star.y < -20) star.y = canvas.height + 20;
        if (star.y > canvas.height + 20) star.y = -20;

        let drawSize = star.size;
        if (mouse.x !== null && mouse.y !== null) {
          const dx = star.x - mouse.x;
          const dy = star.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_REPEL_DISTANCE) {
            drawSize = star.size * (1 + (1 - dist / MOUSE_REPEL_DISTANCE) * 0.8);
          }
        }
        ctx.globalAlpha = isGlowing ? Math.min(star.opacity * 2, 1) : star.opacity;
        ctx.fillStyle = '#FFCC00';
        drawStar(star.x, star.y, drawSize, star.rotation, isGlowing);
      });
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Badge styler helper for Key Actions
  const getKeyActionBadgeStyle = (action: KeyAction) => {
    switch (action) {
      case 'KA1':
        return 'ka1';
      case 'KA2':
        return 'ka210';
      case 'KA3':
        return 'ka220';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  // Filter listings where status === 'active', sort by createdAt descending, slice to 9
  const recentActiveListings = [...listings]
    .filter(item => item.status === 'active')
    .sort((a, b) => {
      const dateA = a.createdAt || '';
      const dateB = b.createdAt || '';
      return dateB.localeCompare(dateA);
    })
    .slice(0, 9);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SECTION */}
      <section ref={heroRef} className="bg-brand-bg py-20 px-4 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        />
        <div className="relative z-10 max-w-7xl mx-auto text-center flex flex-col items-center">
          {/* Small pill badge at the top */}
          <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-xs font-bold text-slate-600 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-accent" />
            <span>Free Erasmus+ Partner Search · KA1 · KA2 · KA3</span>
          </div>

          {/* Large heading — two lines */}
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight text-center text-slate-900">
            Find Your Ideal <span className="text-brand-primary">Erasmus+</span> <span className="text-brand-accent">Match</span>
          </h1>

          {/* Subheading below */}
          <p className="text-base sm:text-lg text-slate-500 font-medium text-center max-w-2xl mx-auto mt-4">
            Browse organisations across Europe looking for Erasmus+ partners and submit your own listings. Connect, share knowledge, and build consortia.
          </p>

          {/* Search bar + CTA button in one row below */}
          <div className="w-full mt-8">
            <div className="flex items-center bg-white border border-slate-200 rounded-full shadow-md px-4 py-2 max-w-2xl mx-auto gap-3">
              <Search className="text-slate-400 w-4 h-4 shrink-0" />
              <input
                id="search-input-field"
                type="text"
                placeholder="Filter by organisation name, city, keywords..."
                readOnly
                onClick={() => onNavigate('browse')}
                className="flex-1 bg-transparent实时 outline-none text-sm font-medium text-slate-705 placeholder:text-slate-400 cursor-pointer"
              />
              <button
                id="hero-submit-cta"
                onClick={() => onNavigate('submit')}
                className="bg-brand-accent hover:bg-orange-500 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Submit Your Listing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Trust row below the search bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-base sm:text-lg text-slate-500 font-medium">
            <span>✓ Free to browse</span>
            <span>✓ Free to list</span>
            <span>✓ No subscription</span>
            <span>✓ Pan-European</span>
          </div>
        </div>
      </section>

      {/* 2. RECENT PARTNER CALLS SECTION */}
      {recentActiveListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-850">Recent Partner Calls</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm font-semibold">
              The latest organisations looking for Erasmus+ partners
            </p>
          </div>

          <div id="listings-recent-real-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentActiveListings.map((listing) => {
              const flag = listing.countryFlag || '🇪🇺';
              return (
                <div
                  id={`listing-card-${listing.id}`}
                  key={listing.id}
                  onClick={() => onSelectListing(listing.id)}
                  className="group bg-white rounded-[20px] border border-blue-50/50 hover:border-blue-300 hover:shadow-md overflow-hidden card-shadow flex flex-col cursor-pointer"
                >
                  {/* Card Header Image */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={listing.thumbnailUrl}
                      alt={listing.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center space-x-1.5 shadow-sm">
                      <span>{flag}</span>
                      <span>{listing.country}</span>
                    </div>

                    {(listing.submitterProfile?.city || (listing as any).city) && (
                      <div className="absolute bottom-3 left-3 bg-slate-900/40 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-white tracking-wide">
                        📍 {listing.submitterProfile?.city || (listing as any).city || ''}
                      </div>
                    )}
                  </div>

                  {/* Body Details */}
                  <div className="p-5 flex-1 flex flex-col space-y-3.5">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase px-2 py-1 rounded-md tracking-wider">
                        {listing.type}
                      </span>
                      {listing.projectRole && (
                        <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md ${
                          listing.projectRole === 'Coordinator'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-teal-100 text-teal-700'
                        }`}>
                          {listing.projectRole === 'Coordinator' ? '🎯 Coordinator' : '🤝 Partner'}
                        </span>
                      )}
                      {listing.keyActions.map((action) => (
                        <span
                          key={action}
                          className={`text-[10px] font-extrabold px-2 py-1 rounded-md ${getKeyActionBadgeStyle(action)}`}
                        >
                          {action}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-bold text-slate-800 text-lg leading-snug group-hover:text-brand-primary transition-colors line-clamp-1">
                      {listing.name}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      <span className="bg-orange-50 text-orange-600 font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                        🗓 Deadline: {formatDate(listing.partnerSearchDeadline)}
                      </span>
                      <span className="bg-slate-100 text-slate-600 font-bold text-[11px] px-2.5 py-1 rounded-full shrink-0">
                        {listing.submitterProfile?.experienceLevel || ''}
                      </span>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed flex-1 line-clamp-3">
                      {listing.description}
                    </p>

                    {/* Highly aesthetic metadata snippet */}
                    <div className="pt-2.5 border-t border-gray-100 flex flex-wrap gap-1">
                      {listing.thematicAreas.slice(0, 2).map((area) => (
                        <span key={area} className="text-[10px] font-bold text-brand-primary/80 bg-blue-50/40 px-2 py-0.5 rounded-full">
                          #{area.replace(' & ', '')}
                        </span>
                      ))}
                      {listing.thematicAreas.length > 2 && (
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">
                          +{listing.thematicAreas.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => onNavigate('browse')}
              className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-bold py-3.5 px-8 rounded-full transition-all text-sm cursor-pointer"
            >
              Browse All Partner Listings →
            </button>
          </div>
        </section>
      )}

      {/* 3. THEMATIC STATS BAR */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-b border-indigo-100/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-[20px] shadow-sm flex items-center space-x-4 border border-blue-100/30">
            <div className="p-3 bg-blue-100 text-brand-primary rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">120+ Listings</p>
              <p className="text-slate-500 text-xs font-semibold">Organisations Registered</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[20px] shadow-sm flex items-center space-x-4 border border-blue-100/30">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <Globe2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">30+ Countries</p>
              <p className="text-slate-500 text-xs font-semibold">Active across the EU</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[20px] shadow-sm flex items-center space-x-4 border border-blue-100/30">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">3 Key Actions</p>
              <p className="text-slate-500 text-xs font-semibold">KA1, KA2 & KA3 Supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "HOW IT WORKS" SECTION */}
      <section id="how-it-works-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-black text-slate-800">How It Works</h2>
          <p className="text-slate-500 max-w-sm mx-auto text-sm font-semibold">
            Simple 3-step collaboration methodology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 text-center space-y-4 hover:shadow-lg transition-all relative">
            <div className="absolute -top-4 left-1/2 -transtype-x-1/2 transform translate-x-3/4 bg-brand-accent text-white font-black text-sm w-8 h-8 rounded-full flex items-center justify-center">
              1
            </div>
            <div className="mx-auto w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-primary">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Create your free account</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Register your institution profile, describe your credentials, previous experience, and general research mission statement.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 text-center space-y-4 hover:shadow-lg transition-all relative">
            <div className="absolute -top-4 left-1/2 -transtype-x-1/2 transform translate-x-3/4 bg-brand-accent text-white font-black text-sm w-8 h-8 rounded-full flex items-center justify-center">
              2
            </div>
            <div className="mx-auto w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <RefreshCcw className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Submit your organisation</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Fill out our partnership form. Highlight the theme, key actions (KA1/2) you are targeting, and write down an informative summary.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 text-center space-y-4 hover:shadow-lg transition-all relative">
            <div className="absolute -top-4 left-1/2 -transtype-x-1/2 transform translate-x-3/4 bg-brand-accent text-white font-black text-sm w-8 h-8 rounded-full flex items-center justify-center">
              3
            </div>
            <div className="mx-auto w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
              <Globe2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Get discovered</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Consortium aggregators and project leaders can filter listings and reach out using secure email keys directly. Easy as that.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
