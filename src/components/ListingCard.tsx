import { ChevronRight, Zap, Target, Users, Calendar } from 'lucide-react';
import { Listing } from '../types/listing';
import { OrganisationProfile } from '../types/profile';
import { formatDate, stripHtml } from '../utils';
import FavouriteButton from './FavouriteButton';
import ExpressInterestButton from './ExpressInterestButton';
import IconBadge from './IconBadge';

interface ListingCardProps {
  listing: Listing;
  currentUserUid: string | null;
  currentUserProfile: OrganisationProfile | null;
  isFavourited: boolean;
  alreadySent: boolean;
  onSelect: (id: string) => void;
  onToggleFavourite: (id: string) => void;
  onInterestSent: (id: string) => void;
}

export default function ListingCard({
  listing,
  currentUserUid,
  currentUserProfile,
  isFavourited,
  alreadySent,
  onSelect,
  onToggleFavourite,
  onInterestSent,
}: ListingCardProps) {
  const flag = listing.countryFlag || '🇪🇺';
  const cityPart = (listing.submitterProfile?.city || (listing as any).city)
    ? `, ${listing.submitterProfile?.city || (listing as any).city}`
    : '';

  const logo = listing.submitterProfile?.logoUrl ? (
    <img
      src={listing.submitterProfile.logoUrl}
      alt={`${listing.name} logo`}
      referrerPolicy="no-referrer"
      className="w-12 h-12 rounded-lg object-contain border border-slate-100 bg-white p-1.5 shrink-0"
    />
  ) : (
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-black text-base shrink-0">
      {listing.name.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <div
      id={`listing-card-${listing.id}`}
      onClick={() => onSelect(listing.id)}
      className="group bg-white rounded-2xl border border-blue-50/50 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer p-4 sm:p-5"
    >
      <div className="flex items-center gap-3">
        {logo}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate group-hover:text-brand-primary transition-colors">
            {listing.title || listing.name}
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center gap-1.5 truncate">
            <span className="truncate">{listing.name}</span>
            <span>·</span>
            <span>{flag}</span>
            <span className="truncate">{listing.country}{cityPart}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <FavouriteButton listingId={listing.id} currentUserUid={currentUserUid} isFavourited={isFavourited} onToggle={onToggleFavourite} />
          <ExpressInterestButton
            listing={listing}
            currentUserUid={currentUserUid}
            currentUserProfile={currentUserProfile}
            alreadySent={alreadySent}
            onSent={onInterestSent}
          />
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-primary transition-colors shrink-0 hidden sm:block" />
      </div>

      {listing.description && (
        <p className="text-xs text-slate-500 leading-relaxed mt-3 break-words">
          {stripHtml(listing.description)}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap border-t border-slate-100 mt-3 pt-3">
        {listing.keyActions.map((action) => (
          <IconBadge key={action} icon={Zap} color="blue">{action}</IconBadge>
        ))}
        {listing.sectors && listing.sectors.map((sector) => (
          <IconBadge key={sector} icon={Target} color="emerald">{sector}</IconBadge>
        ))}
        {listing.projectRole && (
          <>
            {(listing.projectRole === 'Coordinator' || listing.projectRole === 'Both') && (
              <IconBadge icon={Users} color="violet">Coordinator</IconBadge>
            )}
            {(listing.projectRole === 'Partner' || listing.projectRole === 'Both') && (
              <IconBadge icon={Users} color="violet">Partner</IconBadge>
            )}
          </>
        )}
        <IconBadge icon={Calendar} color="orange">{formatDate(listing.partnerSearchDeadline)}</IconBadge>
      </div>

      {listing.thematicAreas && listing.thematicAreas.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-slate-100 mt-3 pt-3">
          {listing.thematicAreas.map((area) => (
            <span key={area} className="text-[10px] font-bold text-brand-primary/80 bg-blue-50/40 px-2.5 py-1 rounded-full">
              #{area}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
