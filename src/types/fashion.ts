export type ClothingCategory =
  | 'tops'
  | 'trousers'
  | 'dresses'
  | 'shorts'
  | 'shoes'
  | 'bags'
  | 'jackets'
  | 'accessories';

export type Occasion =
  | 'School'
  | 'Party'
  | 'Date'
  | 'Beach'
  | 'Casual'
  | 'Work'
  | 'Wedding'
  | 'Sport';

export type ClothingStyle =
  | 'Casual'
  | 'Chic'
  | 'Streetwear'
  | 'Minimalist'
  | 'Boho'
  | 'Sporty'
  | 'Preppy'
  | 'Formal'
  | 'Vintage'
  | 'Romantic';

export type ClothingColor =
  | 'White'
  | 'Black'
  | 'Cream'
  | 'Pink'
  | 'Red'
  | 'Blue'
  | 'Navy'
  | 'Green'
  | 'Sage'
  | 'Beige'
  | 'Brown'
  | 'Yellow'
  | 'Purple'
  | 'Grey'
  | 'Patterned'
  | 'Gold'
  | 'Silver';

export type WeatherVibe = 'Sunny' | 'Mild' | 'Chilly' | 'Rainy';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  color: ClothingColor;
  colorHex?: string;
  style: ClothingStyle;
  imageUrl: string;
  season?: 'Warm' | 'Cool' | 'All';
  favorite?: boolean;
  timesWorn?: number;
  tags?: string[];
  createdAt: number;
}

export interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  occasion: Occasion;
  style: ClothingStyle | string;
  colorPalette: string[];
  matchScore: number; // e.g. 94
  scoreBreakdown?: {
    colorHarmony: number;
    occasionFit: number;
    styleSynergy: number;
  };
  stylistNote?: string;
  stylingTip?: string;
  weatherFit?: WeatherVibe;
  createdAt: number;
  isSaved?: boolean;
}

export interface StylistChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  outfit?: Outfit;
  suggestedPrompt?: string;
  missingItemAlert?: string;
  timestamp: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  bio: string;
  avatarUrl: string;
  location: string;
  specialties: string[];
  yearsExperience: number;
  featuredQuote: string;
  isHuman: true; // Explicit human verification
  instagram?: string;
}

export interface CommunityComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isHumanStylist?: boolean;
  outfit: Outfit;
  caption: string;
  likesCount: number;
  likedByMe?: boolean;
  comments: CommunityComment[];
  createdAt: number;
}

export type FashionGameType = 'speed-stylist' | 'match-or-clash' | 'blind-spin';

export interface GamePromptScenario {
  id: string;
  title: string;
  occasion: Occasion;
  weather: WeatherVibe;
  description: string;
  targetKeywords: string[];
  recommendedColors: ClothingColor[];
  targetStyle: ClothingStyle;
  timeLimitSec: number;
}

export interface MatchOrClashCard {
  id: string;
  items: ClothingItem[];
  isMatch: boolean;
  score: number;
  explanation: string;
  humanStylistAdvice: string;
}

export interface GameScoreResult {
  gameType: FashionGameType;
  score: number;
  xpEarned: number;
  badgeUnlocked?: string;
  outfit?: Outfit;
  feedback: string;
  timestamp: number;
}

export interface ScheduledOutfit {
  id: string;
  outfitId: string;
  date: string; // ISO format 'YYYY-MM-DD'
  outfit: Outfit;
  notes?: string;
  occasion?: Occasion;
  weatherVibe?: WeatherVibe;
  timeOfDay?: 'Morning' | 'Afternoon' | 'Evening' | 'All Day';
  isWorn?: boolean;
  wornAt?: number;
  createdAt: number;
}

