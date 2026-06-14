import { OrganisationType } from './listing';

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
  logoUrl?: string;
  description: string;
}
