export interface PartnerRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  toOrgUid: string;
  toOrgName: string;
  fromOrgUid: string;
  fromOrgName: string;
  fromOrgLogo: string;
  fromOrgCountry: string;
  fromOrgEmail: string;
  toOrgEmail: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}
