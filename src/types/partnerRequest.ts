export interface PartnerRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  toOrgUid: string;
  toOrgName: string;
  toOrgLogo: string;
  toOrgCountry: string;
  fromOrgUid: string;
  fromOrgName: string;
  fromOrgLogo: string;
  fromOrgCountry: string;
  fromOrgEmail: string;
  toOrgEmail: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  hiddenBy?: string[];
  archivedBy?: string[];
  clearedBy?: Record<string, string>;
  lastMessageText?: string;
  lastMessageAt?: string;
  readStatus?: { [uid: string]: string };
}
