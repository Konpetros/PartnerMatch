import { OrganisationProfile } from './profile';

export type OrganisationType =
  | 'NGO / Association'
  | 'Foundation'
  | 'Youth Organisation'
  | 'National Youth Council'
  | 'Higher Education Institution'
  | 'School'
  | 'Educational Centre'
  | 'Research Institute / Centre'
  | 'Public Body'
  | 'Private Enterprise'
  | 'Social Partner'
  | 'Representative Body'
  | 'Sport Organisation'
  | 'Public Service Provider'
  | 'Other';

export type KeyAction = 'KA1' | 'KA2' | 'KA3';

export interface Listing {
  id: string;
  name: string;
  title: string;
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
  projectRole?: 'Coordinator' | 'Partner' | 'Both';
  sectors?: string[];
  submitterProfile?: OrganisationProfile;
  rejectionReason?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  joinedAt: string;
  listingCount: number;
  status: 'active' | 'banned';
  isAdmin: boolean;
}

export interface ActivityLog {
  id: string;
  action: 'submitted' | 'approved' | 'rejected' | 'deleted' | 'signup';
  listingName?: string;
  userName?: string;
  timestamp: string;
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
