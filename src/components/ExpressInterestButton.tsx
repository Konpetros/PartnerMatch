import React, { useState } from 'react';
import ExpressInterestModal from './ExpressInterestModal';
import { Listing, OrganisationProfile } from '../types';

interface ExpressInterestButtonProps {
  listing: Listing;
  currentUserUid: string | null;
  currentUserProfile: OrganisationProfile | null;
  alreadySent?: boolean;
  onSent?: (listingId: string) => void;
}

export default function ExpressInterestButton({
  listing,
  currentUserUid,
  currentUserProfile,
  alreadySent = false,
  onSent,
}: ExpressInterestButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const isOwnListing = currentUserUid && (listing as any).submittedBy === currentUserUid;
  const canShow = currentUserUid && currentUserProfile && !isOwnListing && listing.status === 'active';

  if (!canShow) return null;

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!alreadySent) setModalOpen(true);
        }}
        disabled={alreadySent}
        className={`w-full py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
          alreadySent
            ? 'border-emerald-200 bg-emerald-50 text-emerald-600 cursor-not-allowed'
            : 'border-brand-primary text-brand-primary bg-white hover:bg-blue-50'
        }`}
      >
        {alreadySent ? '✓ Interest Already Sent' : '🤝 Express Interest'}
      </button>

      {modalOpen && (
        <ExpressInterestModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => onSent?.(listing.id)}
          listingId={listing.id}
          listingTitle={listing.title || listing.name}
          toOrgUid={(listing as any).submittedBy || ''}
          toOrgName={listing.name}
          toOrgEmail={listing.contactEmail}
          fromOrgUid={currentUserUid!}
          fromProfile={currentUserProfile!}
        />
      )}
    </>
  );
}
