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
  const favouriteListings = listings.filter(
    (l) => favouriteIds.includes(l.id) && (l.status === 'active' || !l.status)
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-extrabold text-slate-800">Saved Listings</h2>
        <p className="text-sm text-slate-500 mt-1">Partner calls you've saved for later.</p>
      </div>
      {favouriteListings.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Heart className="w-10 h-10 text-slate-200 mx-auto" />
          <p className="text-sm font-semibold text-slate-400">No saved listings yet</p>
          <p className="text-xs text-slate-400">Press the heart icon on any listing to save it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favouriteListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              variant="grid"
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
