import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { getFavourites, toggleFavourite } from '../services/firebase/firestore';

interface FavouriteButtonProps {
  listingId: string;
  currentUserUid: string | null;
  size?: 'sm' | 'md';
}

export default function FavouriteButton({ listingId, currentUserUid, size = 'sm' }: FavouriteButtonProps) {
  const [isFavourited, setIsFavourited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUserUid) return;
    getFavourites(currentUserUid).then((favs) => {
      setIsFavourited(favs.includes(listingId));
    });
  }, [currentUserUid, listingId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserUid || loading) return;
    setLoading(true);
    try {
      const updated = await toggleFavourite(currentUserUid, listingId);
      setIsFavourited(updated.includes(listingId));
    } finally {
      setLoading(false);
    }
  };

  if (!currentUserUid) return null;

  const iconSize = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  const btnSize = size === 'md' ? 'p-2' : 'p-1.5';

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={isFavourited ? 'Remove from favourites' : 'Save to favourites'}
      className={`${btnSize} rounded-full transition-all cursor-pointer shrink-0 ${
        isFavourited
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-red-400'
      } ${loading ? 'opacity-50' : ''}`}
    >
      <Heart
        className={`${iconSize} transition-all ${isFavourited ? 'fill-red-500' : ''}`}
      />
    </button>
  );
}
