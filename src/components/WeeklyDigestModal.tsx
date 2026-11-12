import React, { useEffect, useState } from 'react';
import {
  X,
  Sparkles,
  Flame,
  Award,
  TrendingUp,
  Tag,
  Compass,
  Share2,
  Check
} from 'lucide-react';
import { UserTasteProfile } from '../types';

interface WeeklyDigestModalProps {
  userProfile: UserTasteProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklyDigestModal: React.FC<WeeklyDigestModalProps> = ({
  userProfile,
  isOpen,
  onClose,
}) => {
  const [digestData, setDigestData] = useState<{
    foodiePersona: string;
    weeklySummary: string;
    highlightBadge: string;
    nextCulinaryQuest: string;
  }>({
    foodiePersona: 'The Umami Alchemist',
    weeklySummary:
      'You championed rich dashi and slow-simmered bone broths this week while supporting local artisan counters. Your decision velocity averaged 6.4 seconds per meal!',
    highlightBadge: 'Flame Keeper 🔥',
    nextCulinaryQuest:
      'Explore charcoal-grilled Isan pork skewers to push your spice tolerance to Level 5!',
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    // Attempt AI generated weekly digest
    fetch('/api/generate-digest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mealsLogged: userProfile.mealsLogged,
        favoriteCuisines: userProfile.favoriteCuisines,
        totalSpentSaved: '34.50',
        streakDays: userProfile.streakDays,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.digest) {
          setDigestData(data.digest);
        }
      })
      .catch(() => {
        // Fallback already in place
      });
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `Check out my foodie week on BiteMatch: I'm "${digestData.foodiePersona}" with a ${userProfile.streakDays}-day meal streak and 88% calibrated taste profile!`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative my-auto p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-700 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Weekly Engagement Digest</span>
          </div>
          <h2 className="font-editorial text-3xl font-bold text-stone-900">
            Your Week in Food
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Sunday Recap · Generated especially for {userProfile.name}
          </p>
        </div>

        {/* Persona Spotlight Banner */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-850 text-white rounded-2xl p-6 text-center border border-stone-800 shadow-md mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
            Your Culinary Persona
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white mb-2">
            "{digestData.foodiePersona}"
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed max-w-md mx-auto">
            {digestData.weeklySummary}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
            <p className="text-[11px] text-stone-500 font-medium">Meals Logged</p>
            <p className="text-xl font-bold text-stone-900 mt-0.5">
              {userProfile.mealsLogged}
            </p>
          </div>
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-center">
            <p className="text-[11px] text-amber-800 font-medium">Streak</p>
            <p className="text-xl font-bold text-amber-900 mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-600 text-amber-600" />
              <span>{userProfile.streakDays}d</span>
            </p>
          </div>
          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-center">
            <p className="text-[11px] text-emerald-800 font-medium">Perks Saved</p>
            <p className="text-xl font-bold text-emerald-900 mt-0.5">$34.50</p>
          </div>
          <div className="p-3 bg-orange-50/80 rounded-xl border border-orange-200 text-center">
            <p className="text-[11px] text-orange-800 font-medium">BitePoints</p>
            <p className="text-xl font-bold text-orange-900 mt-0.5">
              +{userProfile.streakDays * 25 + 40}
            </p>
          </div>
        </div>

        {/* Flavor Balance Breakdown */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            Weekly Palate Distribution
          </h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-stone-600 mb-1">
                <span>Rich Umami (Broths & Stews)</span>
                <span className="font-bold text-stone-900">45%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-stone-600 mb-1">
                <span>Spicy & Fiery</span>
                <span className="font-bold text-stone-900">30%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '30%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-stone-600 mb-1">
                <span>Fresh Greens & Ancient Grains</span>
                <span className="font-bold text-stone-900">25%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Next Week's Quest */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 mb-6 flex items-start gap-3">
          <Compass className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-stone-900 uppercase tracking-wide">
              Next Week Culinary Challenge
            </p>
            <p className="text-stone-600 mt-0.5 leading-relaxed">
              {digestData.nextCulinaryQuest}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handleShare}
            className="flex-1 py-3 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Summary Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Foodie Digest</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
