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

export interface Listing {
  id: string;
  name: string;
  type: OrganisationType;
  country: string;
  countryFlag: string;
  keyActions: KeyAction[];
  thematicAreas: string[];
  languagesSpoken: string[];
  contactEmail: string;
  description: string;
  thumbnailUrl: string;
  city?: string;
  website?: string;
  foundedYear?: string;
  oid?: string;
  experienceLevel: string;
  previousProjects: string;
  partnerSearchDeadline: string;
}

export interface SearchFilters {
  searchQuery: string;
  country: string;
  organisationType: string;
  keyActions: KeyAction[];
  thematicArea: string;
}
