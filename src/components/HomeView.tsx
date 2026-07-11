/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { formatDate } from '../utils/formatDate';
import { Listing, KeyAction, OrganisationProfile } from '../types';
import FavouriteButton from './FavouriteButton';
import { getFavourites, getSentRequests } from '../services/firebase/firestore';
import ExpressInterestButton from './ExpressInterestButton';
import { 
  Search, 
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
      <section ref={heroRef} className="bg-brand-bg pt-8 pb-16 sm:pt-12 sm:pb-20 px-4 relative overflow-hidden min-h-[calc(90vh-72px)]">
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

          {/* Search bar in one row below */}
          <div className="w-full mt-10">
            <div className="flex items-center bg-white border border-slate-200 rounded-full shadow-md px-4 py-2 max-w-2xl mx-auto gap-3">
              <Search className="text-slate-400 w-4 h-4 shrink-0" />
              <input
                id="search-input-field"
                type="text"
                placeholder="Filter by organisation name, city, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer shrink-0"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

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
              {recentActiveListings.map((listing) => {
                const flag = listing.countryFlag || '🇪🇺';
                return (
                  <div
                    key={listing.id}
                    onClick={() => onSelectListing(listing.id)}
                    className="group bg-white rounded-2xl border border-blue-50/50 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer p-4 flex items-center gap-4"
                  >
                    {listing.submitterProfile?.logoUrl ? (
                      <img
                        src={listing.submitterProfile.logoUrl}
                        alt={`${listing.name} logo`}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-contain border border-slate-100 bg-white p-1.5 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-base shrink-0">
                        {listing.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                        <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-brand-primary transition-colors">
                          {listing.title || listing.name}
                        </h3>
                        <span className="bg-slate-100 text-slate-700 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider shrink-0">
                          {listing.type}
                        </span>
                        {listing.projectRole && (
                          <>
                            {(listing.projectRole === 'Coordinator' || listing.projectRole === 'Both') && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-violet-100 text-violet-800 shrink-0">
                                Coordinator
                              </span>
                            )}
                            {(listing.projectRole === 'Partner' || listing.projectRole === 'Both') && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-violet-100 text-violet-800 shrink-0">
                                Partner
                              </span>
                            )}
                          </>
                        )}
                        {listing.keyActions.map((action) => (
                          <span
                            key={action}
                            className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0"
                          >
                            {action}
                          </span>
                        ))}
                        {listing.sectors && listing.sectors.map((sector) => (
                          <span
                            key={sector}
                            className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0"
                          >
                            {sector}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1.5 truncate">
                        <span>{flag}</span>
                        <span className="truncate">
                          {listing.country}{(listing.submitterProfile?.city || (listing as any).city) ? `, ${listing.submitterProfile?.city || (listing as any).city}` : ''}
                        </span>
                      </p>
                      {listing.thematicAreas && listing.thematicAreas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {listing.thematicAreas.slice(0, 2).map((area) => (
                            <span key={area} className="text-[9px] font-bold text-brand-primary/80 bg-blue-50/40 px-2 py-0.5 rounded-full">
                              #{area}
                            </span>
                          ))}
                          {listing.thematicAreas.length > 2 && (
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">
                              +{listing.thematicAreas.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center shrink-0">
                      <ExpressInterestButton
                        listing={listing}
                        currentUserUid={currentUserUid ?? null}
                        currentUserProfile={currentUserProfile ?? null}
                        alreadySent={sentListingIds.includes(listing.id)}
                        onSent={handleInterestSent}
                      />
                    </div>
                    <div className="hidden sm:flex flex-col items-end text-right shrink-0">
                      <span className="text-orange-600 font-bold text-[11px]">
                        🗓 {formatDate(listing.partnerSearchDeadline)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-primary transition-colors shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
          {viewMode === 'grid' && (
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
                  {/* Body Details */}
                  <div className="p-5 flex-1 flex flex-col space-y-3.5">
                    <div className="flex items-center gap-3">
                      {listing.submitterProfile?.logoUrl ? (
                        <img
                          src={listing.submitterProfile.logoUrl}
                          alt={`${listing.name} logo`}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-contain border border-slate-100 bg-white p-1.5 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-base shrink-0">
                          {listing.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {listing.name}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1 mt-0.5">
                          <span>{flag}</span>
                          <span className="truncate">
                            {listing.country}{(listing.submitterProfile?.city || (listing as any).city) ? `, ${listing.submitterProfile?.city || (listing as any).city}` : ''}
                          </span>
                        </span>
                      </div>
                      <FavouriteButton listingId={listing.id} currentUserUid={currentUserUid ?? null} isFavourited={favouriteIds.includes(listing.id)} onToggle={handleToggleFavourite} />
                    </div>

                    {listing.title && (
                      <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">
                        {listing.title}
                      </h3>
                    )}
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 break-words flex-1">
                      {listing.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
                    </p>

                    <div className="flex flex-col">
                      {listing.keyActions.length > 0 && (
                        <div className="flex items-center gap-2 py-1.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[44px] shrink-0">Key Action</span>
                          <div className="flex flex-wrap gap-1">
                            {listing.keyActions.map((action) => (
                              <span key={action} className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                {action}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {listing.projectRole && (
                        <div className="border-t border-slate-100 flex items-center gap-2 py-1.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[44px] shrink-0">Role</span>
                          <div className="flex flex-wrap gap-1">
                            {(listing.projectRole === 'Coordinator' || listing.projectRole === 'Both') && (
                              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-violet-100 text-violet-800">Coordinator</span>
                            )}
                            {(listing.projectRole === 'Partner' || listing.projectRole === 'Both') && (
                              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-violet-100 text-violet-800">Partner</span>
                            )}
                          </div>
                        </div>
                      )}
                      {listing.sectors && listing.sectors.length > 0 && (
                        <div className="border-t border-slate-100 flex items-center gap-2 py-1.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[44px] shrink-0">Sector</span>
                          <div className="flex flex-wrap gap-1">
                            {listing.sectors.map((sector) => (
                              <span key={sector} className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                {sector}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="border-t border-slate-100 flex items-center gap-2 py-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[44px] shrink-0">Deadline</span>
                        <span className="text-[9px] font-extrabold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                          {formatDate(listing.partnerSearchDeadline)}
                        </span>
                      </div>
                    </div>

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
                    <ExpressInterestButton
                      listing={listing}
                      currentUserUid={currentUserUid ?? null}
                      currentUserProfile={currentUserProfile ?? null}
                      alreadySent={sentListingIds.includes(listing.id)}
                      onSent={handleInterestSent}
                    />
                  </div>
                </div>
              );
            })}
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
