import { OrganisationType } from './listing';

export interface FeaturedProject {
  title: string;
  kaType: string;
  year: string;
  role: string;
  description?: string;
  link?: string;
}

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
  featuredProjects?: FeaturedProject[];
  languagesSpoken: string[];
  contactEmail: string;
  sectors: string[];
  logoUrl?: string;
  description: string;
  showEmailOnProfile?: boolean;
  showLocationOnProfile?: boolean;
  profilePublic?: boolean;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
}
