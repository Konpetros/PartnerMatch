import { Listing, SearchFilters } from '../../types';
import { OrganisationProfile } from '../../types';

// LISTINGS
export const getListings = async (): Promise<Listing[]> => {
  // TODO: fetch all listings from Firestore collection 'listings'
  throw new Error('Firestore not yet implemented');
};

export const getListingById = async (id: string): Promise<Listing | null> => {
  // TODO: fetch single listing by ID from Firestore
  throw new Error('Firestore not yet implemented');
};

export const submitListing = async (listing: Omit<Listing, 'id'>, userId: string): Promise<string> => {
  // TODO: add new listing to Firestore, return generated ID
  // Status defaults to 'pending' until admin approves
  throw new Error('Firestore not yet implemented');
};

export const updateListing = async (id: string, data: Partial<Listing>): Promise<void> => {
  // TODO: update listing fields in Firestore
  throw new Error('Firestore not yet implemented');
};

export const deleteListing = async (id: string): Promise<void> => {
  // TODO: delete listing from Firestore
  throw new Error('Firestore not yet implemented');
};

export const getUserListings = async (userId: string): Promise<Listing[]> => {
  // TODO: fetch all listings where submittedBy === userId
  throw new Error('Firestore not yet implemented');
};

export const updateListingStatus = async (
  id: string,
  status: 'active' | 'pending' | 'expired' | 'partnership-found'
): Promise<void> => {
  // TODO: update listing status field in Firestore
  throw new Error('Firestore not yet implemented');
};

// ORGANISATION PROFILES
export const getProfile = async (userId: string): Promise<OrganisationProfile | null> => {
  // TODO: fetch profile from Firestore collection 'profiles' by userId
  throw new Error('Firestore not yet implemented');
};

export const saveProfile = async (userId: string, profile: OrganisationProfile): Promise<void> => {
  // TODO: save or update profile in Firestore collection 'profiles'
  throw new Error('Firestore not yet implemented');
};

// VIEWS COUNTER
export const incrementListingViews = async (id: string): Promise<void> => {
  // TODO: increment views field on listing document using Firestore increment
  throw new Error('Firestore not yet implemented');
};
