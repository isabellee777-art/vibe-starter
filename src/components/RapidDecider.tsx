import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Zap,
  RotateCcw,
  CheckCircle2,
  Clock,
  Compass,
  Tag,
  Info,
  SlidersHorizontal,
  ChevronRight,
  Flame,
  ArrowRight,
  Send,
  CloudRain,
  Sun,
  Moon,
  Wind
} from 'lucide-react';
import { Restaurant, UserTasteProfile, RecommendationDecision } from '../types';
import { calculateLocalRecommendation, fetchAiRecommendation, DecisionFilters } from '../utils/recommender';

interface RapidDeciderProps {
  restaurants: Restaurant[];
  userProfile: UserTasteProfile;
  onAcceptMeal: (restaurant: Restaurant) => void;
  onViewRestaurant: (restaurant: Restaurant) => void;
}

const MOODS = [
  { id: 'Comfort Food', label: 'Comfort Food', icon: '🍜', tip: 'Warm broths, melted cheese & hearty noodles' },
  { id: 'Savory & Crispy', label: 'Savory & Crispy', icon: '🌮', tip: 'Tacos, smash burgers, fried treats' },
  { id: 'Healthy Reset', label: 'Healthy Reset', icon: '🥗', tip: 'Nutrient-rich bowls, clean greens & grilled proteins' },
  { id: 'Spicy & Bold', label: 'Spicy & Bold', icon: '🌶️', tip: 'Isan heat, fiery chili oils & pepper spices' },
  { id: 'Quick Lunch', label: 'Quick Lunch', icon: '⏱️', tip: 'Fast service, under 15m walk from work' },
  { id: 'Date Night', label: 'Date Night', icon: '🍷', tip: 'Dim lighting, wine pairings & artisanal dishes' },
  { id: 'Guilty Pleasure', label: 'Guilty Pleasure', icon: '🍔', tip: 'Decadent burgers, rich desserts & tallow fries' },
  { id: 'Sweet Tooth', label: 'Sweet Tooth', icon: '🍵', tip: 'Matcha pastries, molten basque cakes & tea' },
];

const WEATHERS = [
  { id: 'Chilly / Rainy', label: 'Chilly / Rainy', icon: CloudRain },
  { id: 'Sunny & Crisp', label: 'Sunny & Crisp', icon: Sun },
  { id: 'Mild Evening', label: 'Mild Evening', icon: Wind },
  { id: 'Late Night', label: 'Late Night', icon: Moon },
];

export const RapidDecider: React.FC<RapidDeciderProps> = ({
  restaurants,
  userProfile,
  onAcceptMeal,
  onViewRestaurant,
}) => {
  const [selectedMood, setSelectedMood] = useState('Comfort Food');
  const [selectedWeather, setSelectedWeather] = useState('Chilly / Rainy');
  const [selectedBudget, setSelectedBudget] = useState('Any');
  const [maxDistance, setMaxDistance] = useState(3.0);
  const [cravingNote, setCravingNote] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Decider state
  const [isDeciding, setIsDeciding] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [decision, setDecision] = useState<RecommendationDecision | null>(null);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleStartDecider = async () => {
    setIsDeciding(true);
    setHasAccepted(false);
    setCountdown(3);

    const filters: DecisionFilters = {
      mood: selectedMood,
      weather: selectedWeather,
      timeOfDay: 'Current Mealtime',
      maxDistance,
      budget: selectedBudget,
      dietary: userProfile.dietaryRestrictions,
      cravingNote,
    };

    // Fast countdown animation
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 380);

    // Initial local fast recommendation
    const localMatch = calculateLocalRecommendation(restaurants, userProfile, filters);

    // Try AI enhancement in parallel if custom note exists
    if (cravingNote.trim().length > 3) {
      setIsAiLoading(true);
      fetchAiRecommendation(restaurants, userProfile, filters).then((aiMatch) => {
        setIsAiLoading(false);
        if (aiMatch) {
          setDecision(aiMatch);
        }
      });
    }

    setTimeout(() => {
      setDecision(localMatch);
      setIsDeciding(false);
    }, 1200);
  };

  const handleReroll = () => {
    const filters: DecisionFilters = {
      mood: selectedMood,
      weather: selectedWeather,
      timeOfDay: 'Current Mealtime',
      maxDistance,
      budget: selectedBudget,
      dietary: userProfile.dietaryRestrictions,
      cravingNote,
    };
    // Exclude current match
    const remaining = restaurants.filter((r) => r.id !== decision?.restaurant.id);
    const newPick = calculateLocalRecommendation(remaining, userProfile, filters);
    setDecision(newPick);
    setHasAccepted(false);
  };

  const handleAccept = () => {
    if (!decision) return;
    setHasAccepted(true);
    onAcceptMeal(decision.restaurant);
  };

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-700 mb-2">
          <Zap className="w-4 h-4 fill-orange-600 text-orange-600" />
          <span>Instant Craving Solver</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight mb-3">
          End Food Decision Fatigue.
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Get a hyper-personalized restaurant pick in under 10 seconds. Calibrated to your live taste profile, current weather, and hidden local gems.
        </p>
      </div>

      {/* Main Interactive Craving Console */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-5 sm:p-7">
        {/* Step 1: Mood Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              1. What vibe does your palate desire right now?
            </label>
            <span className="text-xs text-stone-500">
              Selected: <strong className="text-stone-900">{selectedMood}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {MOODS.map((m) => {
              const active = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMood(m.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                    active
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-white'
                  }`}
                >
                  <span className="text-xl" role="img" aria-label={m.label}>
                    {m.icon}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${active ? 'text-white' : 'text-stone-900'}`}>
                      {m.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Weather & Atmosphere Context */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              2. Weather & Dining Setting
            </label>
            <span className="text-xs text-stone-500">
              Alters soup vs crisp salads
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-100 rounded-xl">
            {WEATHERS.map((w) => {
              const Icon = w.icon;
              const active = selectedWeather === w.id;
              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedWeather(w.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-orange-600' : 'text-stone-500'}`} />
                  {w.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Filters Toggle (Budget & Distance) */}
        <div className="border-t border-stone-100 pt-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-900"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Budget & Radius' : 'Adjust Budget & Walking Radius'}</span>
              <span className="text-stone-500 font-normal">
                ({selectedBudget === 'Any' ? 'Any Price' : selectedBudget} · Within {maxDistance} mi)
              </span>
            </button>

            {userProfile.dietaryRestrictions.length > 0 && (
              <span className="text-xs text-stone-500">
                Dietary active: {userProfile.dietaryRestrictions.join(', ')}
              </span>
            )}
          </div>

          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200"
            >
              {/* Budget */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Budget Target
                </label>
                <div className="flex items-center gap-1.5">
                  {['Any', '$', '$$', '$$$'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBudget(b)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        selectedBudget === b
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {b === 'Any' ? 'Any Budget' : b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
                  <span>Max Radius</span>
                  <span className="text-orange-700">{maxDistance} miles</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                  className="w-full accent-orange-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-600 mt-1">
                  <span>0.5 mi (5m walk)</span>
                  <span>2.5 mi</span>
                  <span>5 mi (drive)</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Natural Language Craving Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={cravingNote}
              onChange={(e) => setCravingNote(e.target.value)}
              placeholder="Specific craving? e.g. 'extra garlic, crispy noodles, not too heavy, under $20'"
              className="w-full pl-4 pr-10 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/30 focus:border-orange-600 text-stone-900 placeholder-stone-500"
            />
            {cravingNote && (
              <button
                onClick={() => setCravingNote('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* THE 10-SECOND DECIDER BUTTON */}
        <button
          onClick={handleStartDecider}
          disabled={isDeciding}
          className="w-full group relative overflow-hidden py-4 px-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl font-bold text-base shadow-md shadow-orange-900/10 transition-all hover:shadow-lg hover:shadow-orange-900/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
          <span>
            {isDeciding ? 'Consulting Taste Algorithm...' : 'Decide My Meal in 10 Seconds'}
          </span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* ROULETTE / DECIDING OVERLAY */}
      <AnimatePresence>
        {isDeciding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-stone-900 border border-stone-800 text-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30 animate-pulse">
                <span className="text-3xl font-black">{countdown > 0 ? countdown : '✨'}</span>
              </div>
              <h2 className="font-editorial text-2xl font-bold mb-2">Analyzing Taste Matrix</h2>
              <p className="text-stone-400 text-xs leading-relaxed mb-4">
                Evaluating spice profile ({userProfile.spiceTolerance}/5), weather conditions ({selectedWeather}), and local chef counters...
              </p>
              <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-orange-500 h-full w-full animate-[shimmer_1s_infinite]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DECISION RESULT PRESENTATION */}
      <AnimatePresence>
        {decision && !isDeciding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 bg-white border-2 border-orange-500/40 rounded-2xl p-6 sm:p-8 shadow-xl shadow-orange-900/5 relative overflow-hidden"
          >
            {/* Top Match Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {decision.matchScore}% Taste Match
                </span>
                <span className="text-stone-300">·</span>
                <span className="text-xs text-stone-500">
                  Calculated in 0.8s
                </span>
              </div>

              {/* Tag separators (anti-slop rule: no static pill containers) */}
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>{decision.restaurant.neighborhood}</span>
                <span aria-hidden="true">·</span>
                <span>{decision.restaurant.distanceMiles} mi ({decision.restaurant.walkingTimeMin}m walk)</span>
                <span aria-hidden="true">·</span>
                <span>{decision.restaurant.price}</span>
              </div>
            </div>

            {/* Rationale Headline */}
            <div className="mt-4 mb-6">
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                {decision.headline}
              </h2>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {decision.rationale}
              </p>
            </div>

            {/* Restaurant Feature Spotlight Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-stone-50 rounded-xl p-5 border border-stone-200">
              {/* Photo */}
              <div className="md:col-span-5 relative rounded-lg overflow-hidden h-48 md:h-auto min-h-[190px]">
                <img
                  src={decision.restaurant.image}
                  alt={decision.restaurant.name}
                  className="w-full h-full object-cover"
                />
                {decision.restaurant.isExclusiveOffer && (
                  <div className="absolute top-2.5 left-2.5 bg-orange-600 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-sm">
                    {decision.restaurant.offerBadge || 'Exclusive Perk'}
                  </div>
                )}
                {decision.restaurant.isHiddenGem && (
                  <div className="absolute bottom-2.5 left-2.5 bg-stone-900/90 text-amber-300 text-[11px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                    💎 Hidden Gem
                  </div>
                )}
              </div>

              {/* Details & Signature Dish */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-editorial text-xl font-bold text-stone-900">
                      {decision.restaurant.name}
                    </h3>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      ★ {decision.restaurant.rating}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mb-3 italic">
                    "{decision.restaurant.tagline}"
                  </p>

                  {/* Signature Dish Box */}
                  <div className="bg-white p-3.5 rounded-lg border border-stone-200 mb-3">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-900 mb-1">
                      <span className="text-orange-700 font-semibold">Recommended Signature Dish:</span>
                      <span>${decision.restaurant.signatureDishPrice.toFixed(2)}</span>
                    </div>
                    <p className="font-bold text-stone-900 text-sm">
                      {decision.restaurant.signatureDish}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {decision.restaurant.signatureDishDesc}
                    </p>
                  </div>

                  {/* Insider Chef Tip & Pairing */}
                  <div className="space-y-1.5 text-xs text-stone-700">
                    <p className="flex items-start gap-1.5">
                      <strong className="text-stone-900 font-semibold whitespace-nowrap">Secret Order Tip:</strong>
                      <span>{decision.secretTip}</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <strong className="text-stone-900 font-semibold whitespace-nowrap">Suggested Pairing:</strong>
                      <span>{decision.pairing}</span>
                    </p>
                  </div>
                </div>

                {/* Exclusive Offer Banner if exists */}
                {decision.restaurant.offerDetails && (
                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between gap-2 text-xs text-orange-950 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-orange-600" />
                      <span>{decision.restaurant.offerDetails}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleAccept}
                  disabled={hasAccepted}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    hasAccepted
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-stone-900 hover:bg-stone-800 text-white shadow-md'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{hasAccepted ? 'Meal Logged! (+25 pts)' : 'Accept Pick & Log Meal (+25 pts)'}</span>
                </button>

                <button
                  onClick={handleReroll}
                  className="px-4 py-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-sm rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Try another recommendation"
                >
                  <RotateCcw className="w-4 h-4 text-stone-500" />
                  <span>Reroll</span>
                </button>
              </div>

              <button
                onClick={() => onViewRestaurant(decision.restaurant)}
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1 py-2 cursor-pointer"
              >
                <span>View Full Menu & Location</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Accepted confirmation toast */}
            {hasAccepted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  <span>Streak preserved! +25 BitePoints added to your Perks wallet.</span>
                </div>
                <span className="font-bold">Next: Taste feedback improves your algorithm!</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
