/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { formatDate } from '../utils/formatDate';
import { stripHtml } from '../utils/stripHtml';
import ListingCard from './ListingCard';
import { Listing, KeyAction, OrganisationProfile } from '../types';
import FavouriteButton from './FavouriteButton';
import { getFavourites, getSentRequests } from '../services/firebase/firestore';
import ExpressInterestButton from './ExpressInterestButton';
import { 
  ArrowRight, 
  Users, 
  Globe2, 
  Layers, 
  BookOpen, 
  RefreshCcw,
  LayoutGrid,
  List,
  ChevronRight
} from 'lucide-react';

interface HomeViewProps {
  listings: Listing[];
  onNavigate: (view: string) => void;
  onSelectListing: (id: string) => void;
  currentUserUid?: string | null;
  currentUserProfile?: OrganisationProfile | null;
}

export default function HomeView({ listings, onNavigate, onSelectListing, currentUserUid, currentUserProfile }: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);
  const [sentListingIds, setSentListingIds] = useState<string[]>([]);

  useEffect(() => {
    if (currentUserUid) {
      getFavourites(currentUserUid).then(setFavouriteIds);
      getSentRequests(currentUserUid).then(requests =>
        setSentListingIds(requests.map(r => r.listingId))
      );
    }
  }, [currentUserUid]);

  const handleInterestSent = (listingId: string) => {
    setSentListingIds(prev => [...prev, listingId]);
  };

  const handleToggleFavourite = (listingId: string) => {
    setFavouriteIds(prev =>
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };
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
    .filter(l => l.status === 'active')
    .filter(l => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.country.toLowerCase().includes(q) ||
        l.description.replace(/<[^>]*>/g, '').toLowerCase().includes(q) ||
        (l.submitterProfile?.city || (l as any).city || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dateA = a.createdAt || '';
      const dateB = b.createdAt || '';
      return dateB.localeCompare(dateA);
    })
    .slice(0, 9);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SECTION */}
      <section ref={heroRef} className="bg-brand-bg pt-8 pb-16 sm:pt-12 sm:pb-20 px-4 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        />
        <div className="relative z-10 max-w-7xl mx-auto text-center flex flex-col items-center">
          {/* Small pill badge at the top */}
          <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-xs font-bold text-slate-600 shadow-sm mb-10">
            <span className="w-2 h-2 rounded-full bg-brand-accent" />
            <span>Free Erasmus+ Partner Search · KA1 · KA2 · KA3</span>
          </div>

          {/* Large heading — two lines */}
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight text-center text-slate-900">
            Find Your Ideal <span className="text-brand-primary">Erasmus+</span> <span className="text-brand-accent">Match</span>
          </h1>

          {/* Subheading below */}
          <p className="text-base sm:text-lg text-slate-500 font-medium text-center max-w-2xl mx-auto mt-8">
            Free directory for Erasmus+ organisations across Europe. Find partners for KA1, KA2, and KA3 projects, or list your organisation in minutes.
          </p>

          {/* Trust row below the search bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-10 text-base sm:text-lg text-slate-500 font-medium">
            <span>✓ Free to browse</span>
            <span>✓ Free to list</span>
            <span>✓ Pan-European</span>
            <span>✓ Independent</span>
          </div>
        </div>
      </section>

      {/* 2. RECENT PARTNER CALLS SECTION */}
      {recentActiveListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1 text-center">
              <h2 className="text-3xl font-black text-slate-850">Recent Partner Calls</h2>
              <p className="text-slate-500 text-sm font-semibold">
                The latest Erasmus+ partner calls from organisations across Europe
              </p>
            </div>
            <div className="inline-flex items-center bg-slate-100 rounded-lg p-1 gap-1 shrink-0">
              <button
                id="home-view-mode-grid-btn"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="home-view-mode-list-btn"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {viewMode === 'list' && (
            <div className="space-y-3">
              {recentActiveListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  variant="list"
                  currentUserUid={currentUserUid ?? null}
                  currentUserProfile={currentUserProfile ?? null}
                  isFavourited={favouriteIds.includes(listing.id)}
                  alreadySent={sentListingIds.includes(listing.id)}
                  onSelect={onSelectListing}
                  onToggleFavourite={handleToggleFavourite}
                  onInterestSent={handleInterestSent}
                />
              ))}
            </div>
          )}
          {viewMode === 'grid' && (
          <div id="listings-recent-real-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentActiveListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                variant="grid"
                currentUserUid={currentUserUid ?? null}
                currentUserProfile={currentUserProfile ?? null}
                isFavourited={favouriteIds.includes(listing.id)}
                alreadySent={sentListingIds.includes(listing.id)}
                onSelect={onSelectListing}
                onToggleFavourite={handleToggleFavourite}
                onInterestSent={handleInterestSent}
              />
            ))}
          </div>
          )}
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



      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-b border-indigo-100/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-[20px] shadow-sm flex items-center space-x-4 border border-blue-100/30">
            <div className="p-3 bg-blue-100 text-brand-primary rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">{listings.filter(l => l.status === 'active').length}</p>
              <p className="text-slate-500 text-xs font-semibold">Active Partner Calls</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[20px] shadow-sm flex items-center space-x-4 border border-blue-100/30">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <Globe2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">{new Set(listings.filter(l => l.status === 'active').map(l => l.country)).size}</p>
              <p className="text-slate-500 text-xs font-semibold">Countries Represented</p>
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
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform translate-x-3/4 bg-brand-accent text-white font-black text-sm w-8 h-8 rounded-full flex items-center justify-center">
              1
            </div>
            <div className="mx-auto w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-primary">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Set your organisation profile</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Create your free account and build your organisation profile so potential partners can learn about you.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 text-center space-y-4 hover:shadow-lg transition-all relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform translate-x-3/4 bg-brand-accent text-white font-black text-sm w-8 h-8 rounded-full flex items-center justify-center">
              2
            </div>
            <div className="mx-auto w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <RefreshCcw className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Submit your partner search listing</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Post a listing describing your project idea, Key Actions, topics, and the type of partners you are looking for.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 text-center space-y-4 hover:shadow-lg transition-all relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform translate-x-3/4 bg-brand-accent text-white font-black text-sm w-8 h-8 rounded-full flex items-center justify-center">
              3
            </div>
            <div className="mx-auto w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
              <Globe2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Get discovered by other organisations</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Other Erasmus+ organisations across Europe browse the directory, find your listing, and reach out to you directly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
