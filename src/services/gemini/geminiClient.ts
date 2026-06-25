import { Listing, OrganisationProfile } from '../../types';

export interface PartnerSuggestion {
  listingId: string;
  matchScore: number;
  reasons: string[];
}

export interface ListingOptimisation {
  improvedDescription: string;
  suggestions: string[];
}

// AI Partner Matching — not yet implemented
export const getPartnerSuggestions = async (
  _profile: OrganisationProfile,
  _listings: Listing[]
): Promise<PartnerSuggestion[]> => {
  return [];
};

// AI Listing Optimiser — not yet implemented
export const optimiseListing = async (
  _listing: Partial<Listing>
): Promise<ListingOptimisation> => {
  return { improvedDescription: '', suggestions: [] };
};

// AI Proposal Outline — not yet implemented
export const generateProposalOutline = async (
  _listing: Listing
): Promise<string> => {
  return '';
};
