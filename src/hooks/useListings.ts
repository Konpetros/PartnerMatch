import { useState } from 'react';
import { Listing } from '../types';
import { MOCK_LISTINGS } from '../data/mockListings';

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);

  const handleSubmitListing = (newListing: Listing) => {
    setListings(prev => [newListing, ...prev]);
  };

  const handleDeleteListing = (id: string) => {
    setListings(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateListingStatus = (
    id: string,
    status: 'active' | 'pending' | 'expired' | 'partnership-found'
  ) => {
    setListings(prev =>
      prev.map(item => item.id === id ? { ...item, status } : item)
    );
  };

  return {
    listings,
    handleSubmitListing,
    handleDeleteListing,
    handleUpdateListingStatus,
  };
};
