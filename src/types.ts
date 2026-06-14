/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OrganisationType =
  | 'NGO'
  | 'School'
  | 'VET Provider'
  | 'University'
  | 'Youth Organisation'
  | 'Other';

export type KeyAction = 'KA1' | 'KA210' | 'KA220';

export interface OrganisationProfile {
  organisationName: string;
  organisationType: OrganisationType;
  country: string;
  countryFlag: string;
  city: string;
  website: string;
  foundedYear: string;
  oid: string;
  experienceLevel: string;
  previousProjects: string;
  languagesSpoken: string[];
  contactEmail: string;
  sector: string;
}

export interface Listing {
  id: string;
  name: string;
  type: OrganisationType;
  country: string;
  countryFlag: string;
  keyActions: KeyAction[];
  thematicAreas: string[];
  contactEmail: string;
  description: string;
  thumbnailUrl: string;
  partnerSearchDeadline: string;
  views?: number;
  createdAt?: string;
  status?: 'active' | 'pending' | 'expired' | 'partnership-found';
  projectRole?: 'Coordinator' | 'Partner';
  submitterProfile?: OrganisationProfile;
}

export interface SearchFilters {
  searchQuery: string;
  country: string;
  organisationType: string;
  keyActions: KeyAction[];
  thematicArea: string;
  sector: string;
  projectRole: string;
}
