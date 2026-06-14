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

// AI Partner Matching — suggest compatible listings based on user profile
export const getPartnerSuggestions = async (
  profile: OrganisationProfile,
  listings: Listing[]
): Promise<PartnerSuggestion[]> => {
  // TODO: call Gemini API via backend proxy
  // Send profile + listings summary, receive ranked suggestions
  throw new Error('Gemini AI not yet implemented');
};

// AI Listing Optimiser — improve a listing description
export const optimiseListing = async (
  listing: Partial<Listing>
): Promise<ListingOptimisation> => {
  // TODO: call Gemini API via backend proxy
  // Send listing data, receive improved description + suggestions
  throw new Error('Gemini AI not yet implemented');
};

// AI Proposal Outline — generate a basic project outline from listing data
export const generateProposalOutline = async (
  listing: Listing
): Promise<string> => {
  // TODO: call Gemini API via backend proxy
  // Send listing data, receive a structured project outline
  throw new Error('Gemini AI not yet implemented');
};
