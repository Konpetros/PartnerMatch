import { useState, useEffect } from 'react';
import { Listing } from '../types';
import {
  subscribeToListings,
  submitListing as firestoreSubmitListing,
  deleteListing as firestoreDeleteListing,
  updateListingStatus as firestoreUpdateListingStatus,
  updateListing,
} from '../services/firebase/firestore';

export const useListings = (currentUserUid: string | null) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToListings((data) => {
      setListings(data);
      setListingsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmitListing = async (newListing: Omit<Listing, 'id'>) => {
    if (!currentUserUid) return;
    await firestoreSubmitListing(newListing, currentUserUid);
  };

  const handleDeleteListing = async (id: string) => {
    await firestoreDeleteListing(id);
  };

  const handleUpdateListingStatus = async (
    id: string,
    status: 'active' | 'pending' | 'expired' | 'partnership-found'
  ) => {
    await firestoreUpdateListingStatus(id, status);
  };

  const handleApproveListing = async (id: string) => {
    await firestoreUpdateListingStatus(id, 'active');
  };

  const handleRejectListing = async (id: string, reason: string) => {
    await updateListing(id, { status: 'expired', rejectionReason: reason });
  };

  return {
    listings,
    listingsLoading,
    handleSubmitListing,
    handleDeleteListing,
    handleUpdateListingStatus,
    handleApproveListing,
    handleRejectListing,
  };
};
