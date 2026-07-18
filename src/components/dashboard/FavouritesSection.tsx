import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Listing } from '../../types/listing';
import { OrganisationProfile } from '../../types/profile';
import ListingCard from '../ListingCard';

interface FavouritesSectionProps {
  listings: Listing[];
  favouriteIds: string[];
  currentUserUid: string | null;
  currentUserProfile: OrganisationProfile | null;
  sentListingIds: string[];
  onSelectListing?: (id: string) => void;
  onToggleFavourite: (id: string) => void;
  onInterestSent: (id: string) => void;
}

export default function FavouritesSection({
  listings,
  favouriteIds,
  currentUserUid,
  currentUserProfile,
  sentListingIds,
  onSelectListing,
  onToggleFavourite,
  onInterestSent,
}: FavouritesSectionProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'deadline' | 'views'>('newest');

  const favouriteListings = listings
    .filter((l) => favouriteIds.includes(l.id) && (l.status === 'active' || !l.status))
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        return (a.partnerSearchDeadline || '').localeCompare(b.partnerSearchDeadline || '');
      }
      if (sortBy === 'views') {
        return (b.views || 0) - (a.views || 0);
      }
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Saved Listings</h2>
          <p className="text-sm text-slate-500 mt-1">Partner calls you've saved for later.</p>
        </div>
        {favouriteListings.length > 0 && (
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'deadline' | 'views')}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-slate-700 outline-none focus:border-brand-primary transition-all appearance-none cursor-pointer"
            >
              <option value="newest">🗓 Newest First</option>
              <option value="deadline">⏳ Deadline Soonest</option>
              <option value="views">🔥 Most Viewed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <span className="text-[10px]">▼</span>
            </div>
          </div>
        )}
      </div>
      {favouriteListings.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Heart className="w-10 h-10 text-slate-200 mx-auto" />
          <p className="text-sm font-semibold text-slate-400">No saved listings yet</p>
          <p className="text-xs text-slate-400">Press the heart icon on any listing to save it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {favouriteListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              currentUserUid={currentUserUid}
              currentUserProfile={currentUserProfile}
              isFavourited={favouriteIds.includes(listing.id)}
              alreadySent={sentListingIds.includes(listing.id)}
              onSelect={(id) => onSelectListing && onSelectListing(id)}
              onToggleFavourite={onToggleFavourite}
              onInterestSent={onInterestSent}
            />
          ))}
        </div>
      )}
    </div>
  );
}
