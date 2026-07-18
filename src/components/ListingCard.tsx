import { ChevronRight } from 'lucide-react';
import { Listing } from '../types/listing';
import { OrganisationProfile } from '../types/profile';
import { formatDate, stripHtml } from '../utils';
import FavouriteButton from './FavouriteButton';
import ExpressInterestButton from './ExpressInterestButton';

interface ListingCardProps {
  listing: Listing;
  variant: 'grid' | 'list';
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
  variant,
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

  if (variant === 'list') {
    return (
      <div
        onClick={() => onSelect(listing.id)}
        className="group bg-white rounded-2xl border border-blue-50/50 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer p-4 flex items-center gap-4"
      >
        {logo}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-brand-primary transition-colors">
            {listing.title || listing.name}
          </h3>
          {listing.description && (
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              {stripHtml(listing.description)}
            </p>
          )}
          <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1.5 truncate">
            <span>{flag}</span>
            <span className="truncate">{listing.country}{cityPart}</span>
          </p>
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1.5">
            {listing.keyActions.map((action) => (
              <span key={action} className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">
                {action}
              </span>
            ))}
            {listing.sectors && listing.sectors.map((sector) => (
              <span key={sector} className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                {sector}
              </span>
            ))}
            {listing.projectRole && (
              <>
                {(listing.projectRole === 'Coordinator' || listing.projectRole === 'Both') && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-violet-100 text-violet-800 shrink-0">
                    Coordinator
                  </span>
                )}
                {(listing.projectRole === 'Partner' || listing.projectRole === 'Both') && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-violet-100 text-violet-800 shrink-0">
                    Partner
                  </span>
                )}
              </>
            )}
            <span className="bg-orange-50 text-orange-600 border border-orange-100 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">
              🗓 {formatDate(listing.partnerSearchDeadline)}
            </span>
          </div>
          {listing.thematicAreas && listing.thematicAreas.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {listing.thematicAreas.slice(0, 2).map((area) => (
                <span key={area} className="text-[9px] font-bold text-brand-primary/80 bg-blue-50/40 px-2 py-0.5 rounded-full">
                  #{area}
                </span>
              ))}
              {listing.thematicAreas.length > 2 && (
                <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">
                  +{listing.thematicAreas.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <FavouriteButton listingId={listing.id} currentUserUid={currentUserUid} isFavourited={isFavourited} onToggle={onToggleFavourite} />
          <ExpressInterestButton
            listing={listing}
            currentUserUid={currentUserUid}
            currentUserProfile={currentUserProfile}
            alreadySent={alreadySent}
            onSent={onInterestSent}
          />
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-primary transition-colors shrink-0" />
      </div>
    );
  }

  return (
    <div
      id={`listing-card-${listing.id}`}
      onClick={() => onSelect(listing.id)}
      className="group bg-white rounded-[20px] border border-blue-50/50 hover:border-blue-300 hover:shadow-md overflow-hidden card-shadow flex flex-col cursor-pointer"
    >
      <div className="p-5 flex-1 flex flex-col space-y-3.5">
        <div className="flex items-center gap-3">
          {logo}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {listing.name}
            </span>
            <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1 mt-0.5">
              <span>{flag}</span>
              <span className="truncate">{listing.country}{cityPart}</span>
            </span>
          </div>
          <FavouriteButton listingId={listing.id} currentUserUid={currentUserUid} isFavourited={isFavourited} onToggle={onToggleFavourite} />
        </div>

        {listing.title && (
          <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">
            {listing.title}
          </h3>
        )}
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 break-words">
          {stripHtml(listing.description)}
        </p>

        <div className="flex flex-col">
          {listing.keyActions.length > 0 && (
            <div className="flex items-center gap-2 py-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[62px] shrink-0">Key Action</span>
              <div className="flex flex-wrap gap-1">
                {listing.keyActions.map((action) => (
                  <span key={action} className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {action}
                  </span>
                ))}
              </div>
            </div>
          )}
          {listing.sectors && listing.sectors.length > 0 && (
            <div className="border-t border-slate-100 flex items-center gap-2 py-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[62px] shrink-0">Sector</span>
              <div className="flex flex-wrap gap-1">
                {listing.sectors.map((sector) => (
                  <span key={sector} className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {sector}
                  </span>
                ))}
              </div>
            </div>
          )}
          {listing.projectRole && (
            <div className="border-t border-slate-100 flex items-center gap-2 py-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[62px] shrink-0">Role</span>
              <div className="flex flex-wrap gap-1">
                {(listing.projectRole === 'Coordinator' || listing.projectRole === 'Both') && (
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-violet-100 text-violet-800">Coordinator</span>
                )}
                {(listing.projectRole === 'Partner' || listing.projectRole === 'Both') && (
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-violet-100 text-violet-800">Partner</span>
                )}
              </div>
            </div>
          )}
          <div className="border-t border-slate-100 flex items-center gap-2 py-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider min-w-[62px] shrink-0">Deadline</span>
            <span className="text-[9px] font-extrabold bg-orange-50 text-orange-600 px-2 py-0.5 rounded">
              {formatDate(listing.partnerSearchDeadline)}
            </span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-gray-100 flex flex-wrap gap-1">
          {listing.thematicAreas.slice(0, 2).map((area) => (
            <span key={area} className="text-[10px] font-bold text-brand-primary/80 bg-blue-50/40 px-2 py-0.5 rounded-full">
              #{area.replace(' & ', '')}
            </span>
          ))}
          {listing.thematicAreas.length > 2 && (
            <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">
              +{listing.thematicAreas.length - 2} more
            </span>
          )}
        </div>
        <ExpressInterestButton
          listing={listing}
          currentUserUid={currentUserUid}
          currentUserProfile={currentUserProfile}
          alreadySent={alreadySent}
          onSent={onInterestSent}
        />
      </div>
    </div>
  );
}
