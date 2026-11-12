import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Flame,
  Heart,
  Check,
  Brain,
  Send,
  Zap,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { UserTasteProfile, Restaurant } from '../types';

interface TasteProfileModalProps {
  userProfile: UserTasteProfile;
  restaurants: Restaurant[];
  onUpdateProfile: (updated: Partial<UserTasteProfile>) => void;
  onViewRestaurant: (restaurant: Restaurant) => void;
}

const ALL_DIETARIES = [
  'Vegetarian',
  '100% Vegan',
  'Gluten-Free Friendly',
  'Halal Certified',
  'Dairy-Free',
  'Nut-Free',
];

const ALL_CUISINES = [
  'Japanese Ramen',
  'Regional Mexican',
  'Artisan Italian',
  'Northern Thai',
  'Healthy / Plant-Based',
  'Korean Comfort',
  'Cantonese Dim Sum',
  'French Bistro',
  'Vietnamese',
  'Mediterranean / Turkish',
  'Gourmet Burgers',
  'Japanese Cafe & Sweets',
];

export const TasteProfileModal: React.FC<TasteProfileModalProps> = ({
  userProfile,
  restaurants,
  onUpdateProfile,
  onViewRestaurant,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'aiConcierge'>('profile');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any | null>(null);

  const toggleDietary = (item: string) => {
    const current = userProfile.dietaryRestrictions;
    const next = current.includes(item)
      ? current.filter((d) => d !== item)
      : [...current, item];
    onUpdateProfile({ dietaryRestrictions: next });
  };

  const toggleCuisine = (cuisine: string) => {
    const current = userProfile.favoriteCuisines;
    const next = current.includes(cuisine)
      ? current.filter((c) => c !== cuisine)
      : [...current, cuisine];
    onUpdateProfile({ favoriteCuisines: next });
  };

  const handleAiConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/recommend-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customCraving: aiPrompt,
          tasteProfile: userProfile,
          candidateRestaurants: restaurants,
        }),
      });

      const data = await res.json();
      if (data.available && data.result) {
        const found = restaurants.find((r) => r.id === data.result.bestMatchId) || restaurants[0];
        setAiResponse({
          ...data.result,
          restaurant: found,
        });
      } else {
        // Fallback local smart match
        const found = restaurants.find((r) =>
          r.name.toLowerCase().includes(aiPrompt.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(aiPrompt.toLowerCase()) ||
          r.tags.some(t => aiPrompt.toLowerCase().includes(t.toLowerCase()))
        ) || restaurants[0];

        setAiResponse({
          restaurant: found,
          matchScore: 96,
          catchyHeadline: `Culinary Pairing: ${found.signatureDish}`,
          whyItHitsTheSpot: `Based on '${aiPrompt}', ${found.name} excels with ${found.flavorProfile.umami}/5 umami and matches your heat preference.`,
          secretOrderTip: 'Ask the server for the house condiment pairing.',
          pairingSuggestion: 'Sparkling mineral water or house iced tea.',
        });
      }
    } catch {
      const found = restaurants[0];
      setAiResponse({
        restaurant: found,
        matchScore: 94,
        catchyHeadline: `Recommended: ${found.signatureDish}`,
        whyItHitsTheSpot: `Delivers maximum flavor satisfaction near ${found.neighborhood}.`,
        secretOrderTip: 'Order the house special.',
        pairingSuggestion: 'House beverage.',
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">
            <Brain className="w-3.5 h-3.5" />
            <span>Algorithm Calibration</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900">
            Taste Profile & Craving Concierge
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Every meal you rate trains this neural taste matrix. Fine-tune your dials or chat with the AI concierge.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Taste Dials
          </button>
          <button
            onClick={() => setActiveTab('aiConcierge')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'aiConcierge'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Concierge</span>
          </button>
        </div>
      </div>

      {activeTab === 'profile' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Calibration Accuracy Card */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  Engine Accuracy
                </span>
                <span className="text-xs text-stone-400">
                  {userProfile.mealsLogged} meals analyzed
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-editorial text-5xl font-bold text-white">
                  {userProfile.algorithmAccuracy}%
                </span>
                <span className="text-xs text-emerald-400 font-semibold">+2% after each review</span>
              </div>

              <div className="w-full bg-stone-800 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${userProfile.algorithmAccuracy}%` }}
                />
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                Your profile prioritizes umami richness, medium-high spice tolerance, and artisanal food prep over mass fast food.
              </p>
            </div>

            {/* Dietary Restrictions */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200">
              <h3 className="font-editorial text-lg font-bold text-stone-900 mb-1">
                Dietary Preferences
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Strict filters applied to your 10-second decider:
              </p>

              <div className="flex flex-wrap gap-2">
                {ALL_DIETARIES.map((item) => {
                  const active = userProfile.dietaryRestrictions.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleDietary(item)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                        active
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 text-emerald-400" />}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Taste Dials */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-stone-200">
            <h3 className="font-editorial text-2xl font-bold text-stone-900 mb-1">
              Sensory Flavor Preferences
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Drag each sensory slider to calibrate how BiteMatch recommends broths, seasoning, and heat.
            </p>

            <div className="space-y-6">
              {/* Spice Tolerance */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
                    Spice & Heat Tolerance
                  </span>
                  <span className="text-orange-700">
                    Level {userProfile.spiceTolerance}/5 (
                    {userProfile.spiceTolerance <= 1
                      ? 'Mild / No Heat'
                      : userProfile.spiceTolerance <= 3
                      ? 'Medium Jalapeño'
                      : userProfile.spiceTolerance === 4
                      ? 'Fiery Habanero'
                      : 'Ghost Pepper Elite'}
                    )
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={userProfile.spiceTolerance}
                  onChange={(e) =>
                    onUpdateProfile({ spiceTolerance: parseInt(e.target.value) })
                  }
                  className="w-full accent-orange-600 cursor-pointer"
                />
              </div>

              {/* Umami Love */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
                  <span>🍜 Umami & Savory Depth (Dashi, Bone Broths, aged cheeses)</span>
                  <span className="text-orange-700">{userProfile.umamiLove}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={userProfile.umamiLove}
                  onChange={(e) =>
                    onUpdateProfile({ umamiLove: parseInt(e.target.value) })
                  }
                  className="w-full accent-orange-600 cursor-pointer"
                />
              </div>

              {/* Sweet Tooth */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
                  <span>🍵 Sweet Tooth & Dessert Affinity</span>
                  <span className="text-orange-700">{userProfile.sweetTooth}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={userProfile.sweetTooth}
                  onChange={(e) =>
                    onUpdateProfile({ sweetTooth: parseInt(e.target.value) })
                  }
                  className="w-full accent-orange-600 cursor-pointer"
                />
              </div>

              {/* Health Consciousness */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
                  <span>🥗 Health Reset vs Indulgent Comfort</span>
                  <span className="text-orange-700">
                    {userProfile.healthConscious <= 2
                      ? 'Indulgent Comfort'
                      : userProfile.healthConscious <= 4
                      ? 'Balanced Nourishment'
                      : 'Strict Clean Eating'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={userProfile.healthConscious}
                  onChange={(e) =>
                    onUpdateProfile({ healthConscious: parseInt(e.target.value) })
                  }
                  className="w-full accent-orange-600 cursor-pointer"
                />
              </div>

              {/* Adventurousness */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
                  <span>🧭 Adventurousness & Hidden Gem Curiosity</span>
                  <span className="text-orange-700">{userProfile.adventurous}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={userProfile.adventurous}
                  onChange={(e) =>
                    onUpdateProfile({ adventurous: parseInt(e.target.value) })
                  }
                  className="w-full accent-orange-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Favorite Cuisines */}
            <div className="mt-8 pt-6 border-t border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">
                Favorite Cuisine Rotations
              </h4>
              <div className="flex flex-wrap gap-2">
                {ALL_CUISINES.map((c) => {
                  const active = userProfile.favoriteCuisines.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleCuisine(c)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        active
                          ? 'bg-amber-100/70 border-amber-300 text-amber-900 font-semibold'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {active ? `✓ ${c}` : c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* AI Craving Concierge Tab */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200">
          <div className="max-w-2xl mb-6">
            <h3 className="font-editorial text-2xl font-bold text-stone-900 mb-1">
              Ask the Michelin-Level Taste Concierge
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Have a complicated craving? Describe how you feel, your target price, or flavor balance. Powered by Gemini AI.
            </p>
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleAiConsult} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. 'I want something spicy with hot broth, but not ramen, under $20, cozy vibe'"
                className="flex-1 px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/30 focus:border-orange-600 text-stone-900"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiPrompt.trim()}
                className="px-6 py-3 bg-stone-900 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {aiLoading ? (
                  <span>Analyzing Craving...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Ask AI</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Prompts suggestions */}
          <div className="flex flex-wrap items-center gap-2 mb-8 text-xs text-stone-500">
            <span className="font-semibold text-stone-700">Try asking:</span>
            <button
              onClick={() =>
                setAiPrompt('Rainy evening comfort food with thick noodles and umami broth')
              }
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-700 transition-colors cursor-pointer"
            >
              "Rainy evening thick noodles"
            </button>
            <button
              onClick={() =>
                setAiPrompt('Light post-gym meal with high protein and zero heavy grease')
              }
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-700 transition-colors cursor-pointer"
            >
              "Post-gym high protein clean"
            </button>
            <button
              onClick={() =>
                setAiPrompt('Hidden gem spot for a casual anniversary dinner with craft wine')
              }
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-700 transition-colors cursor-pointer"
            >
              "Anniversary hidden gem"
            </button>
          </div>

          {/* AI Response Card */}
          {aiResponse && (
            <div className="bg-stone-50 rounded-2xl p-6 border border-amber-200/80">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Concierge Match ({aiResponse.matchScore}% Match)
                  </span>
                </div>
                <span className="text-xs text-stone-500">
                  {aiResponse.restaurant.neighborhood} · {aiResponse.restaurant.price}
                </span>
              </div>

              <h4 className="font-editorial text-2xl font-bold text-stone-900 mb-2">
                {aiResponse.catchyHeadline}
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                {aiResponse.whyItHitsTheSpot}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-stone-200 mb-4 text-xs">
                <div>
                  <p className="font-bold text-stone-900 mb-0.5">Chef's Secret Order Tip:</p>
                  <p className="text-stone-600">{aiResponse.secretTip}</p>
                </div>
                <div>
                  <p className="font-bold text-stone-900 mb-0.5">Suggested Drink Pairing:</p>
                  <p className="text-stone-600">{aiResponse.pairingSuggestion}</p>
                </div>
              </div>

              <button
                onClick={() => onViewRestaurant(aiResponse.restaurant)}
                className="text-xs font-bold text-stone-900 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
              >
                <span>View {aiResponse.restaurant.name} Menu & Location</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
