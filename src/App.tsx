import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RapidDecider } from './components/RapidDecider';
import { RestaurantCatalogue } from './components/RestaurantCatalogue';
import { PerksClub } from './components/PerksClub';
import { TasteProfileModal } from './components/TasteProfileModal';
import { CommunityGemsModal } from './components/CommunityGemsModal';
import { RestaurantModal } from './components/RestaurantModal';
import { MealFeedbackCard } from './components/MealFeedbackCard';
import { WeeklyDigestModal } from './components/WeeklyDigestModal';
import { MealtimeNudgeModal } from './components/MealtimeNudgeModal';
import {
  INITIAL_RESTAURANTS,
  INITIAL_USER_PROFILE,
  AVAILABLE_PERKS,
  INITIAL_BADGES,
  INITIAL_COMMUNITY_POSTS,
} from './data/restaurants';
import { Restaurant, UserTasteProfile, PerkItem, Badge, CommunityPost } from './types';
import { Flame, Sparkles, MapPin, Check, Info, ArrowRight } from 'lucide-react';

export default function App() {
  // Persistent or stateful items
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem('bitematch_restaurants');
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANTS;
  });

  const [userProfile, setUserProfile] = useState<UserTasteProfile>(() => {
    const saved = localStorage.getItem('bitematch_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [availablePerks, setAvailablePerks] = useState<PerkItem[]>(AVAILABLE_PERKS);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<
    'decider' | 'catalogue' | 'perks' | 'profile' | 'community' | 'digest'
  >('decider');

  const [selectedRestaurantModal, setSelectedRestaurantModal] = useState<Restaurant | null>(null);
  const [lastAcceptedRestaurant, setLastAcceptedRestaurant] = useState<Restaurant | null>(null);
  const [showFeedbackCard, setShowFeedbackCard] = useState(false);
  const [showWeeklyDigest, setShowWeeklyDigest] = useState(false);
  const [showMealtimeNudge, setShowMealtimeNudge] = useState(false);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const [showStrategyDrawer, setShowStrategyDrawer] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bitematch_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('bitematch_restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  const showToast = (message: string) => {
    setToastNotification(message);
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Actions
  const handleAcceptMeal = (restaurant: Restaurant) => {
    setLastAcceptedRestaurant(restaurant);
    setShowFeedbackCard(true);

    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + 25,
      mealsLogged: prev.mealsLogged + 1,
      streakDays: prev.streakDays + 1,
      likedSpotIds: Array.from(new Set([...prev.likedSpotIds, restaurant.id])),
    }));

    showToast(`🎉 Accepted ${restaurant.name}! +25 BitePoints awarded. Streak is now ${userProfile.streakDays + 1} days!`);
  };

  const handleFeedbackSubmit = (restaurantId: string, liked: boolean, tags: string[]) => {
    setUserProfile((prev) => {
      const accuracyBoost = Math.min(99, prev.algorithmAccuracy + 2);
      const updatedLiked = liked
        ? Array.from(new Set([...prev.likedSpotIds, restaurantId]))
        : prev.likedSpotIds.filter((id) => id !== restaurantId);
      const updatedDisliked = !liked
        ? Array.from(new Set([...prev.dislikedSpotIds, restaurantId]))
        : prev.dislikedSpotIds.filter((id) => id !== restaurantId);

      // Adjust sensory dials slightly based on feedback
      let newSpice = prev.spiceTolerance;
      if (tags.some((t) => t.includes('Wanted more kick'))) {
        newSpice = Math.min(5, newSpice + 1);
      }

      return {
        ...prev,
        algorithmAccuracy: accuracyBoost,
        points: prev.points + 15,
        spiceTolerance: newSpice,
        likedSpotIds: updatedLiked,
        dislikedSpotIds: updatedDisliked,
      };
    });

    showToast('✨ Engine calibrated! +15 BitePoints added.');
  };

  const handleDailyCheckIn = () => {
    if (hasCheckedInToday) return;
    setHasCheckedInToday(true);
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + 10,
    }));
    showToast('⚡ Daily meal check-in recorded! +10 BitePoints claimed.');
  };

  const handleRedeemPerk = (perk: PerkItem) => {
    if (userProfile.points < perk.pointsCost) return;

    setUserProfile((prev) => ({
      ...prev,
      points: prev.points - perk.pointsCost,
      redeemedPerkIds: [...prev.redeemedPerkIds, perk.id],
    }));

    // Unlock secret taster badge
    setBadges((prev) =>
      prev.map((b) => (b.id === 'badge-secret-taster' ? { ...b, unlocked: true, progress: '1/1' } : b))
    );

    showToast(`🎁 Redeemed "${perk.title}"! Voucher code: ${perk.code}`);
  };

  const handleToggleBookmark = (restaurantId: string) => {
    setUserProfile((prev) => {
      const isBookmarked = prev.bookmarkedSpotIds.includes(restaurantId);
      const nextBookmarks = isBookmarked
        ? prev.bookmarkedSpotIds.filter((id) => id !== restaurantId)
        : [...prev.bookmarkedSpotIds, restaurantId];
      return {
        ...prev,
        bookmarkedSpotIds: nextBookmarks,
      };
    });
  };

  const handleUpdateProfile = (updated: Partial<UserTasteProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updated,
    }));
    showToast('Taste preferences updated.');
  };

  const handleUpvotePost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextUpvoted = !p.hasUpvoted;
          return {
            ...p,
            upvotes: nextUpvoted ? p.upvotes + 1 : p.upvotes - 1,
            hasUpvoted: nextUpvoted,
          };
        }
        return p;
      })
    );
  };

  const handleSubmitNewGem = (
    newPost: Partial<CommunityPost>,
    newRestaurant?: Partial<Restaurant>
  ) => {
    const newRestId = `gem-${Date.now()}`;

    if (newRestaurant && newRestaurant.name) {
      const createdRestaurant: Restaurant = {
        id: newRestId,
        name: newRestaurant.name,
        tagline: newRestaurant.tagline || 'Community discovered hidden gem',
        cuisine: newRestaurant.cuisine || 'Local Gastronomy',
        neighborhood: newRestaurant.neighborhood || 'Metro District',
        distanceMiles: 1.5,
        walkingTimeMin: 24,
        price: '$$',
        rating: 5.0,
        reviewCount: 1,
        image:
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
        signatureDish: newRestaurant.signatureDish || 'Chef Special',
        signatureDishDesc: 'Crowdsourced community favorite recommended by verified foodies.',
        signatureDishPrice: 16.0,
        dietary: [],
        vibe: 'Cozy Counter · Hidden Gem',
        isExclusiveOffer: false,
        isHiddenGem: true,
        tags: ['Hidden Gem', 'Community Curated', 'Comfort Food'],
        flavorProfile: { spice: 3, sweetness: 2, umami: 4, richness: 4, freshness: 3 },
        hours: '11:30 AM – 10:00 PM',
        address: 'Downtown Metro Quarter',
        phone: '(555) 019-4821',
        crowdLevel: 'Low wait',
      };
      setRestaurants((prev) => [createdRestaurant, ...prev]);
    }

    const createdPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: userProfile.name,
      authorRole: 'Community Food Scout',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      restaurantName: newPost.restaurantName || 'Secret Spot',
      restaurantId: newRestId,
      dishName: newPost.dishName || 'Signature Order',
      review: newPost.review || 'Incredible flavor and authentic recipe.',
      upvotes: 1,
      hasUpvoted: true,
      badge: 'Community Submitted',
      timestamp: 'Just now',
    };

    setCommunityPosts((prev) => [createdPost, ...prev]);

    // Reward points & unlock community curator badge
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + 50,
    }));

    setBadges((prev) =>
      prev.map((b) =>
        b.id === 'badge-community-curator' ? { ...b, unlocked: true, progress: '1/1' } : b
      )
    );

    showToast('🌟 Hidden gem added to BiteMatch! +50 BitePoints earned.');
  };

  const handleLaunchDeciderForMeal = (mealType: 'lunch' | 'dinner') => {
    setActiveTab('decider');
    showToast(`Activated ${mealType} mode in 10-second decider!`);
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-stone-900 flex flex-col font-sans selection:bg-orange-500/20 selection:text-orange-950">
      {/* Toast Banner */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        userProfile={userProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNudge={() => setShowMealtimeNudge(true)}
        onOpenDigest={() => setShowWeeklyDigest(true)}
      />

      {/* Main Tab Views */}
      <main className="flex-1">
        {/* Interactive Feedback Card if a meal was recently accepted */}
        {showFeedbackCard && lastAcceptedRestaurant && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
            <MealFeedbackCard
              lastAcceptedRestaurant={lastAcceptedRestaurant}
              userProfile={userProfile}
              onSubmitFeedback={handleFeedbackSubmit}
              onDismiss={() => setShowFeedbackCard(false)}
            />
          </div>
        )}

        {activeTab === 'decider' && (
          <RapidDecider
            restaurants={restaurants}
            userProfile={userProfile}
            onAcceptMeal={handleAcceptMeal}
            onViewRestaurant={(r) => setSelectedRestaurantModal(r)}
          />
        )}

        {activeTab === 'catalogue' && (
          <RestaurantCatalogue
            restaurants={restaurants}
            userProfile={userProfile}
            onSelectRestaurant={(r) => setSelectedRestaurantModal(r)}
            onToggleBookmark={handleToggleBookmark}
            onQuickPickMeal={handleAcceptMeal}
          />
        )}

        {activeTab === 'perks' && (
          <PerksClub
            userProfile={userProfile}
            availablePerks={availablePerks}
            badges={badges}
            onRedeemPerk={handleRedeemPerk}
            onDailyCheckIn={handleDailyCheckIn}
            hasCheckedInToday={hasCheckedInToday}
          />
        )}

        {activeTab === 'profile' && (
          <TasteProfileModal
            userProfile={userProfile}
            restaurants={restaurants}
            onUpdateProfile={handleUpdateProfile}
            onViewRestaurant={(r) => setSelectedRestaurantModal(r)}
          />
        )}

        {activeTab === 'community' && (
          <CommunityGemsModal
            posts={communityPosts}
            restaurants={restaurants}
            onUpvotePost={handleUpvotePost}
            onSubmitNewGem={handleSubmitNewGem}
            onViewRestaurant={(r) => setSelectedRestaurantModal(r)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-stone-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-orange-600 flex items-center justify-center text-white text-xs font-bold">
                  B
                </div>
                <span className="font-editorial text-lg font-bold text-stone-900">
                  BiteMatch
                </span>
                <span className="text-stone-400 text-xs">·</span>
                <span className="text-xs text-stone-600">The 10-Second Food Recommender & Taste Club</span>
              </div>
              <p className="text-xs text-stone-700 mt-1">
                Ending decision fatigue, revealing neighborhood culinary gems, and rewarding every bite.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-stone-600">
              <button
                onClick={() => setShowStrategyDrawer(true)}
                className="hover:text-stone-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-orange-600" />
                <span>Strategy Canvas & Business Model</span>
              </button>
              <span>·</span>
              <button
                onClick={() => setShowWeeklyDigest(true)}
                className="hover:text-stone-900 hover:underline cursor-pointer"
              >
                Weekly Digest
              </button>
              <span>·</span>
              <button
                onClick={() => setShowMealtimeNudge(true)}
                className="hover:text-stone-900 hover:underline cursor-pointer"
              >
                Mealtime Nudge
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RestaurantModal
        restaurant={selectedRestaurantModal}
        userProfile={userProfile}
        onClose={() => setSelectedRestaurantModal(null)}
        onLogMeal={handleAcceptMeal}
        onToggleBookmark={handleToggleBookmark}
      />

      <WeeklyDigestModal
        userProfile={userProfile}
        isOpen={showWeeklyDigest}
        onClose={() => setShowWeeklyDigest(false)}
      />

      <MealtimeNudgeModal
        isOpen={showMealtimeNudge}
        onClose={() => setShowMealtimeNudge(false)}
        onLaunchDeciderForMeal={handleLaunchDeciderForMeal}
        restaurants={restaurants}
      />

      {/* Strategy Canvas Modal (showing the user's uploaded sticky notes map) */}
      {showStrategyDrawer && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative my-auto p-6 sm:p-8">
            <button
              onClick={() => setShowStrategyDrawer(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Blueprint Implementation</span>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-stone-900 mb-2">
              Aligned with Your Strategy Canvas
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-6">
              BiteMatch directly brings to life each key proposition and customer relationship loop from your roadmap:
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl">
                <h4 className="font-bold text-amber-950 text-sm mb-1">
                  ⚡ End Decision Fatigue in under 10 seconds
                </h4>
                <p className="text-amber-900 leading-relaxed">
                  Implemented via the 10-Second Rapid Craving Decider with real-time mood, weather, distance, and budget synthesis.
                </p>
              </div>

              <div className="p-4 bg-orange-50/80 border border-orange-200 rounded-xl">
                <h4 className="font-bold text-orange-950 text-sm mb-1">
                  💎 Hidden Gems & Exclusive Offers
                </h4>
                <p className="text-orange-900 leading-relaxed">
                  Curated catalogue highlighting off-the-beaten-path counters, secret dishes, and partner discounts (15% off tonkotsu, free horchata, etc.).
                </p>
              </div>

              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                <h4 className="font-bold text-emerald-950 text-sm mb-1">
                  🔥 Continuous Engagement & Meal Streaks
                </h4>
                <p className="text-emerald-900 leading-relaxed">
                  BitePoints loyalty wallet, daily check-in bonuses, meal streaks, and claimable reward vouchers.
                </p>
              </div>

              <div className="p-4 bg-stone-100 border border-stone-200 rounded-xl">
                <h4 className="font-bold text-stone-900 text-sm mb-1">
                  🧠 Smarter With Every Bite (Feedback Loop)
                </h4>
                <p className="text-stone-700 leading-relaxed">
                  Every thumbs up or down tunes the user's neural taste matrix, boosting engine accuracy (+2%) and refining future pairings.
                </p>
              </div>

              <div className="p-4 bg-stone-100 border border-stone-200 rounded-xl">
                <h4 className="font-bold text-stone-900 text-sm mb-1">
                  ⏰ Mealtime Nudges & Weekly Digest
                </h4>
                <p className="text-stone-700 leading-relaxed">
                  Smart opt-in lunch & dinner alerts and weekly infographics analyzing your culinary persona and money saved.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setShowStrategyDrawer(false)}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
