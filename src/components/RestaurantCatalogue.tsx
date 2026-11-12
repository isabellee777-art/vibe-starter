import React, { useState } from 'react';
import {
  Search,
  Bookmark,
  Sparkles,
  MapPin,
  Clock,
  Tag,
  Star,
  Quote,
  SlidersHorizontal,
  Flame,
  Award
} from 'lucide-react';
import { Restaurant, UserTasteProfile } from '../types';

interface RestaurantCatalogueProps {
  restaurants: Restaurant[];
  userProfile: UserTasteProfile;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onToggleBookmark: (restaurantId: string) => void;
  onQuickPickMeal: (restaurant: Restaurant) => void;
}

export const RestaurantCatalogue: React.FC<RestaurantCatalogueProps> = ({
  restaurants,
  userProfile,
  onSelectRestaurant,
  onToggleBookmark,
  onQuickPickMeal,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'hidden' | 'offers' | 'influencer' | 'walk' | 'budget'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');

  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine)));

  const filteredRestaurants = restaurants.filter((r) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchCuisine = r.cuisine.toLowerCase().includes(q);
      const matchDish = r.signatureDish.toLowerCase().includes(q);
      const matchNeigh = r.neighborhood.toLowerCase().includes(q);
      const matchDietary = r.dietary.some((d) => d.toLowerCase().includes(q));
      if (!matchName && !matchCuisine && !matchDish && !matchNeigh && !matchDietary) {
        return false;
      }
    }

    // Cuisine filter
    if (selectedCuisine !== 'all' && r.cuisine !== selectedCuisine) {
      return false;
    }

    // Category tab filter
    if (activeFilter === 'hidden' && !r.isHiddenGem) return false;
    if (activeFilter === 'offers' && !r.isExclusiveOffer) return false;
    if (activeFilter === 'influencer' && !r.influencerPick) return false;
    if (activeFilter === 'walk' && r.walkingTimeMin > 18) return false;
    if (activeFilter === 'budget' && r.price !== '$') return false;

    return true;
  });

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Local Gastronomy</span>
          </div>
          <h2 className="font-editorial text-3xl font-bold text-stone-900">
            Food Catalogue & Hidden Gems
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Hand-tested neighborhood kitchens, secret chef menus, and exclusive BiteMatch discounts.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish, ramen, tacos, vegan..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/30 focus:border-orange-600 text-stone-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs (Functional segmented controls) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-100 rounded-xl mb-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          All Spots ({restaurants.length})
        </button>
        <button
          onClick={() => setActiveFilter('hidden')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'hidden'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <span>💎 Hidden Gems</span>
        </button>
        <button
          onClick={() => setActiveFilter('offers')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'offers'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Tag className="w-3.5 h-3.5 text-orange-600" />
          <span>Exclusive Offers</span>
        </button>
        <button
          onClick={() => setActiveFilter('influencer')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'influencer'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Influencer Verified</span>
        </button>
        <button
          onClick={() => setActiveFilter('walk')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'walk'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Under 15m Walk</span>
        </button>
        <button
          onClick={() => setActiveFilter('budget')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeFilter === 'budget'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Budget Hero ($)
        </button>
      </div>

      {/* Cuisine Quick Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none text-xs">
        <span className="text-stone-500 font-medium whitespace-nowrap">Cuisines:</span>
        <button
          onClick={() => setSelectedCuisine('all')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
            selectedCuisine === 'all'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          All
        </button>
        {cuisines.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCuisine(c)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              selectedCuisine === c
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Restaurant Cards Grid */}
      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
          <p className="text-stone-500 text-sm mb-2">No spots matched your active filters or search.</p>
          <button
            onClick={() => {
              setActiveFilter('all');
              setSelectedCuisine('all');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((r) => {
            const isBookmarked = userProfile.bookmarkedSpotIds.includes(r.id);
            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-stone-300 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image banner with badges */}
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top right bookmark action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(r.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full text-stone-700 hover:text-orange-600 shadow-sm cursor-pointer transition-colors"
                      title={isBookmarked ? 'Remove bookmark' : 'Save restaurant'}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${isBookmarked ? 'fill-orange-600 text-orange-600' : ''}`}
                      />
                    </button>

                    {/* Exclusive Offer badge */}
                    {r.isExclusiveOffer && (
                      <div className="absolute top-3 left-3 bg-orange-600 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-sm">
                        {r.offerBadge || 'Special Offer'}
                      </div>
                    )}

                    {/* Hidden gem label */}
                    {r.isHiddenGem && (
                      <div className="absolute bottom-3 left-3 bg-stone-900/90 text-amber-300 text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
                        💎 Hidden Gem
                      </div>
                    )}

                    {/* Wait indicator */}
                    <div className="absolute bottom-3 right-3 bg-white/95 text-stone-800 text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                      {r.crowdLevel}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    {/* Unboxed Metadata (Zero-pill discipline) */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                      <span className="font-semibold text-stone-900">{r.cuisine}</span>
                      <span aria-hidden="true">·</span>
                      <span>{r.neighborhood}</span>
                      <span aria-hidden="true">·</span>
                      <span>{r.price}</span>
                      <span aria-hidden="true">·</span>
                      <span>{r.distanceMiles} mi ({r.walkingTimeMin}m walk)</span>
                    </div>

                    <h3 className="font-editorial text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                      {r.name}
                    </h3>

                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                      {r.tagline}
                    </p>

                    {/* Signature Dish Box */}
                    <div className="mt-3.5 p-3 bg-stone-50 rounded-xl border border-stone-150">
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-0.5">
                        <span className="text-orange-700">Signature Dish:</span>
                        <span className="font-bold">${r.signatureDishPrice.toFixed(2)}</span>
                      </div>
                      <p className="font-bold text-xs text-stone-900">
                        {r.signatureDish}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                        {r.signatureDishDesc}
                      </p>
                    </div>

                    {/* Influencer review quote if available */}
                    {r.influencerPick && (
                      <div className="mt-3 pt-3 border-t border-stone-100 flex items-start gap-2.5">
                        <img
                          src={r.influencerPick.avatar}
                          alt={r.influencerPick.author}
                          className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-stone-200"
                        />
                        <div className="text-[11px] leading-tight">
                          <p className="font-semibold text-stone-900">
                            {r.influencerPick.author}{' '}
                            <span className="text-stone-400 font-normal">
                              {r.influencerPick.handle}
                            </span>
                          </p>
                          <p className="text-stone-600 italic line-clamp-2 mt-0.5">
                            "{r.influencerPick.quote}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectRestaurant(r)}
                    className="flex-1 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onQuickPickMeal(r)}
                    className="py-2 px-3 text-xs font-bold text-white bg-stone-900 hover:bg-orange-600 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    title="Log this as today's meal"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Log Meal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
