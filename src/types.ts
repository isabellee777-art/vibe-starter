export type PriceLevel = '$' | '$$' | '$$$' | '$$$$';

export interface FlavorProfile {
  spice: number; // 1 - 5
  sweetness: number; // 1 - 5
  umami: number; // 1 - 5
  richness: number; // 1 - 5
  freshness: number; // 1 - 5
}

export interface InfluencerPick {
  author: string;
  handle: string;
  avatar: string;
  quote: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  neighborhood: string;
  distanceMiles: number;
  walkingTimeMin: number;
  price: PriceLevel;
  rating: number;
  reviewCount: number;
  image: string;
  signatureDish: string;
  signatureDishDesc: string;
  signatureDishPrice: number;
  dietary: string[];
  vibe: string;
  isExclusiveOffer: boolean;
  offerDetails?: string;
  offerBadge?: string;
  isHiddenGem: boolean;
  influencerPick?: InfluencerPick;
  tags: string[];
  flavorProfile: FlavorProfile;
  hours: string;
  address: string;
  phone: string;
  crowdLevel: 'Low wait' | 'Medium rush' | 'Peak queue';
}

export interface Badge {
  id: string;
  title: string;
  iconName: string;
  desc: string;
  unlocked: boolean;
  progress: string;
}

export interface UserTasteProfile {
  name: string;
  spiceTolerance: number;
  sweetTooth: number;
  umamiLove: number;
  healthConscious: number;
  adventurous: number;
  favoriteCuisines: string[];
  dietaryRestrictions: string[];
  budgetPreference: string;
  algorithmAccuracy: number;
  mealsLogged: number;
  streakDays: number;
  points: number;
  likedSpotIds: string[];
  dislikedSpotIds: string[];
  bookmarkedSpotIds: string[];
  redeemedPerkIds: string[];
}

export interface PerkItem {
  id: string;
  title: string;
  restaurantId: string;
  restaurantName: string;
  pointsCost: number;
  discountText: string;
  description: string;
  code: string;
  badge: string;
  expiry: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  restaurantName: string;
  restaurantId: string;
  dishName: string;
  review: string;
  upvotes: number;
  hasUpvoted?: boolean;
  badge: string;
  timestamp: string;
}

export interface RecommendationDecision {
  restaurant: Restaurant;
  matchScore: number;
  headline: string;
  rationale: string;
  secretTip: string;
  pairing: string;
  matchedReasonTags: string[];
}
