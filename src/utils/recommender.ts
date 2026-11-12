import { Restaurant, UserTasteProfile, RecommendationDecision } from '../types';

export interface DecisionFilters {
  mood: string;
  weather: string;
  timeOfDay: string;
  maxDistance: number;
  budget: string;
  dietary: string[];
  cravingNote: string;
}

export function calculateLocalRecommendation(
  restaurants: Restaurant[],
  userProfile: UserTasteProfile,
  filters: DecisionFilters
): RecommendationDecision {
  // Filter out disliked spots first
  const validCandidates = restaurants.filter(
    (r) => !userProfile.dislikedSpotIds.includes(r.id)
  );

  const pool = validCandidates.length > 0 ? validCandidates : restaurants;

  // Score each restaurant
  const scored = pool.map((r) => {
    let score = 70; // baseline

    // Distance match
    if (r.distanceMiles <= filters.maxDistance) {
      score += 10;
    } else {
      score -= (r.distanceMiles - filters.maxDistance) * 4;
    }

    // Budget match
    if (filters.budget !== 'Any') {
      if (r.price === filters.budget) {
        score += 10;
      } else if (filters.budget === '$' && r.price === '$$$') {
        score -= 20;
      }
    }

    // Dietary match
    if (filters.dietary.length > 0) {
      const hasMatchingDietary = filters.dietary.every((d) =>
        r.dietary.some((rd) => rd.toLowerCase().includes(d.toLowerCase()))
      );
      if (hasMatchingDietary) {
        score += 15;
      } else {
        score -= 25;
      }
    }

    // Mood & tag matches
    const moodLower = filters.mood.toLowerCase();
    const matchesTag = r.tags.some((tag) =>
      tag.toLowerCase().includes(moodLower) || moodLower.includes(tag.toLowerCase())
    );
    if (matchesTag) score += 18;

    // Weather alignment
    if (filters.weather.includes('Rainy') || filters.weather.includes('Chilly')) {
      if (r.tags.includes('Warm Broth') || r.tags.includes('Comfort Food') || r.tags.includes('Warm Stew')) {
        score += 14;
      }
    } else if (filters.weather.includes('Sunny') || filters.weather.includes('Warm')) {
      if (r.tags.includes('Light & Fresh') || r.tags.includes('Aesthetic') || r.flavorProfile.freshness >= 4) {
        score += 10;
      }
    }

    // Taste profile alignment
    const spiceDiff = Math.abs(r.flavorProfile.spice - userProfile.spiceTolerance);
    score += (5 - spiceDiff) * 2;

    const umamiBonus = r.flavorProfile.umami * (userProfile.umamiLove / 2);
    score += umamiBonus;

    // Hidden gem discovery bonus (keeps users returning!)
    if (r.isHiddenGem) {
      score += 8;
    }

    // Exclusive offer bonus
    if (r.isExclusiveOffer) {
      score += 6;
    }

    // Previously liked spots get a comfort boost
    if (userProfile.likedSpotIds.includes(r.id)) {
      score += 5;
    }

    // Add mild random jitter to give discovery variety on re-rolls
    const jitter = Math.floor(Math.random() * 8) - 4;
    const finalScore = Math.min(99, Math.max(65, Math.round(score + jitter)));

    return {
      restaurant: r,
      score: finalScore,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const best = scored[0] || { restaurant: restaurants[0], score: 95 };
  const r = best.restaurant;

  // Build reasoned response
  const matchedReasonTags: string[] = [];
  if (r.isHiddenGem) matchedReasonTags.push('Curated Hidden Gem');
  if (r.isExclusiveOffer) matchedReasonTags.push(r.offerBadge || 'Exclusive Offer');
  matchedReasonTags.push(`${r.distanceMiles} mi away · ${r.walkingTimeMin}m walk`);
  matchedReasonTags.push(`${r.price} · ${r.cuisine}`);

  let headline = `Craving ${filters.mood}? ${r.name} is your immediate answer.`;
  let rationale = `Handcrafted ${r.signatureDish} matches your taste profile with high umami and ${
    r.flavorProfile.spice >= 3 ? 'bold, fiery depth' : 'comforting balanced seasoning'
  }. Ready in under 15 minutes near ${r.neighborhood}.`;

  if (filters.weather.includes('Rainy') || filters.weather.includes('Chilly')) {
    rationale = `The steamy warmth of ${r.signatureDish} is engineered for chilly weather, delivering a rich savory baseline that hits instantly.`;
  }

  let secretTip = `Order the signature ${r.signatureDish} and ask for the chef's house condiment pairing.`;
  if (r.id === 'ramen-lab-kuro') {
    secretTip = 'Ask for extra charred scallion oil and torched garlic paste on the side.';
  } else if (r.id === 'taqueria-sonora') {
    secretTip = 'Spoon a bit of the bone marrow broth directly over the crispy quesabirria taco before your first bite.';
  } else if (r.id === 'forno-antico-pizza') {
    secretTip = 'Ask for a ramekin of their chili-infused wildflower honey for dipping the crust.';
  } else if (r.id === 'pho-saigon-alley') {
    secretTip = 'Dip the brisket slices in the house hoisin-sriracha-lime paste with torn Thai basil.';
  }

  const pairing = r.tags.includes('Spicy')
    ? 'Pair with house cold herbal tea or iced horchata to balance the heat.'
    : 'Pair with sparkling mineral water or crisp craft lager.';

  return {
    restaurant: r,
    matchScore: best.score,
    headline,
    rationale,
    secretTip,
    pairing,
    matchedReasonTags,
  };
}

export async function fetchAiRecommendation(
  restaurants: Restaurant[],
  userProfile: UserTasteProfile,
  filters: DecisionFilters
): Promise<RecommendationDecision | null> {
  try {
    const candidateSubset = restaurants.map((r) => ({
      id: r.id,
      name: r.name,
      cuisine: r.cuisine,
      signatureDish: r.signatureDish,
      price: r.price,
      vibe: r.vibe,
      tags: r.tags,
      offerDetails: r.offerDetails,
    }));

    const response = await fetch('/api/recommend-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mood: filters.mood,
        budget: filters.budget,
        dietary: filters.dietary,
        weather: filters.weather,
        mealTime: filters.timeOfDay,
        customCraving: filters.cravingNote,
        tasteProfile: userProfile,
        candidateRestaurants: candidateSubset,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (!data.available || !data.result) return null;

    const res = data.result;
    const matchedRestaurant = restaurants.find((r) => r.id === res.bestMatchId) || restaurants[0];

    const matchedReasonTags = [
      'Gemini AI Matched',
      matchedRestaurant.isHiddenGem ? 'Hidden Gem' : 'Top Rated',
      `${matchedRestaurant.distanceMiles} mi away`,
      matchedRestaurant.price,
    ];

    return {
      restaurant: matchedRestaurant,
      matchScore: res.matchScore || 97,
      headline: res.catchyHeadline || `AI Pick: ${matchedRestaurant.signatureDish}`,
      rationale: res.whyItHitsTheSpot || matchedRestaurant.tagline,
      secretTip: res.secretOrderTip || 'Order the house specialty.',
      pairing: res.pairingSuggestion || 'Complements the signature dish flavor notes.',
      matchedReasonTags,
    };
  } catch (err) {
    console.warn('AI recommendation fetch failed, using local engine:', err);
    return null;
  }
}
