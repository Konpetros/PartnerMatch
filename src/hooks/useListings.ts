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
    try {
      await firestoreSubmitListing(newListing, currentUserUid);
    } catch (error) {
      console.error('submitListing error:', error);
      throw error;
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      await firestoreDeleteListing(id);
    } catch (error) {
      console.error('deleteListing error:', error);
      throw error;
    }
  };

  const handleUpdateListingStatus = async (
    id: string,
    status: 'active' | 'pending' | 'expired' | 'partnership-found' | 'rejected'
  ) => {
    try {
      await firestoreUpdateListingStatus(id, status);
    } catch (error) {
      console.error('updateListingStatus error:', error);
      throw error;
    }
  };

  const handleApproveListing = async (id: string) => {
    try {
      await firestoreUpdateListingStatus(id, 'active');
    } catch (error) {
      console.error('approveListing error:', error);
      throw error;
    }
  };

  const handleRejectListing = async (id: string, reason: string) => {
    try {
      await updateListing(id, { status: 'rejected', rejectionReason: reason });
    } catch (error) {
      console.error('rejectListing error:', error);
      throw error;
    }
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
