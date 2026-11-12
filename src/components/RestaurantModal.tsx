import React from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  Tag,
  Star,
  Sparkles,
  Flame,
  CheckCircle2,
  Bookmark,
  Share2,
  ExternalLink
} from 'lucide-react';
import { Restaurant, UserTasteProfile } from '../types';

interface RestaurantModalProps {
  restaurant: Restaurant | null;
  userProfile: UserTasteProfile;
  onClose: () => void;
  onLogMeal: (restaurant: Restaurant) => void;
  onToggleBookmark: (restaurantId: string) => void;
}

export const RestaurantModal: React.FC<RestaurantModalProps> = ({
  restaurant,
  userProfile,
  onClose,
  onLogMeal,
  onToggleBookmark,
}) => {
  if (!restaurant) return null;

  const isBookmarked = userProfile.bookmarkedSpotIds.includes(restaurant.id);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-72 w-full bg-stone-100">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

          <div className="absolute bottom-4 left-6 right-6 text-white">
            {/* Unboxed metadata */}
            <div className="flex items-center gap-2 text-xs text-stone-200 mb-1">
              <span>{restaurant.cuisine}</span>
              <span aria-hidden="true">·</span>
              <span>{restaurant.neighborhood}</span>
              <span aria-hidden="true">·</span>
              <span>{restaurant.price}</span>
              <span aria-hidden="true">·</span>
              <span>★ {restaurant.rating} ({restaurant.reviewCount} reviews)</span>
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl font-bold leading-tight">
              {restaurant.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Tagline & Vibe */}
          <div className="flex items-center justify-between text-xs text-stone-600 pb-4 border-b border-stone-100">
            <span className="italic">"{restaurant.tagline}"</span>
            <span className="font-semibold text-stone-900">{restaurant.vibe}</span>
          </div>

          {/* Exclusive Offer Banner */}
          {restaurant.isExclusiveOffer && restaurant.offerDetails && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3">
              <Tag className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-orange-900 uppercase tracking-wide">
                  Exclusive BiteMatch Dining Perk
                </p>
                <p className="text-xs text-orange-950 font-medium mt-0.5">
                  {restaurant.offerDetails}
                </p>
              </div>
            </div>
          )}

          {/* Signature Dish Spotlight */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Recommended Signature Order
            </h3>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="flex items-center justify-between text-sm font-bold text-stone-900 mb-1">
                <span>{restaurant.signatureDish}</span>
                <span className="text-orange-700 font-extrabold">
                  ${restaurant.signatureDishPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {restaurant.signatureDishDesc}
              </p>
            </div>
          </div>

          {/* Flavor Profile Matrix */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Sensory Flavor Radar
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-stone-500 text-[11px]">Spice</p>
                <p className="font-bold text-stone-900 mt-1">{restaurant.flavorProfile.spice}/5</p>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-stone-500 text-[11px]">Umami</p>
                <p className="font-bold text-stone-900 mt-1">{restaurant.flavorProfile.umami}/5</p>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-stone-500 text-[11px]">Richness</p>
                <p className="font-bold text-stone-900 mt-1">{restaurant.flavorProfile.richness}/5</p>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-stone-500 text-[11px]">Freshness</p>
                <p className="font-bold text-stone-900 mt-1">{restaurant.flavorProfile.freshness}/5</p>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 col-span-2 sm:col-span-1">
                <p className="text-stone-500 text-[11px]">Sweetness</p>
                <p className="font-bold text-stone-900 mt-1">{restaurant.flavorProfile.sweetness}/5</p>
              </div>
            </div>
          </div>

          {/* Influencer Review if available */}
          {restaurant.influencerPick && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Food Critic & Influencer Verdict
              </h3>
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3">
                <img
                  src={restaurant.influencerPick.avatar}
                  alt={restaurant.influencerPick.author}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-amber-300"
                />
                <div className="text-xs">
                  <p className="font-bold text-stone-900">
                    {restaurant.influencerPick.author}{' '}
                    <span className="text-stone-500 font-normal">
                      {restaurant.influencerPick.handle}
                    </span>
                  </p>
                  <p className="text-stone-700 italic mt-1 leading-relaxed">
                    "{restaurant.influencerPick.quote}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Practical Info: Address, Hours, Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-400 shrink-0" />
              <span>{restaurant.hours}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-stone-400 shrink-0" />
              <span>{restaurant.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-stone-400 shrink-0" />
              <span>{restaurant.crowdLevel} right now</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
            <button
              onClick={() => onToggleBookmark(restaurant.id)}
              className="p-3 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-700 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? 'fill-orange-600 text-orange-600' : ''}`}
              />
              <span>{isBookmarked ? 'Bookmarked' : 'Save'}</span>
            </button>

            <button
              onClick={() => {
                onLogMeal(restaurant);
                onClose();
              }}
              className="flex-1 py-3 px-6 bg-stone-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Log as Today's Meal (+25 BitePoints)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
