import { GamePromptScenario, MatchOrClashCard } from '../types/fashion';
import { INITIAL_WARDROBE } from './sampleWardrobe';

export const GAME_SCENARIOS: GamePromptScenario[] = [
  {
    id: 'sc-1',
    title: 'Parisian Cafe Date',
    occasion: 'Date',
    weather: 'Mild',
    description: 'You received a surprise text to meet at a cozy Saint-Germain cafe in 15 minutes! Build an effortless, romantic yet chic look.',
    targetKeywords: ['chic', 'romantic', 'pink', 'knit', 'effortless'],
    recommendedColors: ['Pink', 'Cream', 'Black', 'White'],
    targetStyle: 'Chic',
    timeLimitSec: 40,
  },
  {
    id: 'sc-2',
    title: 'Rooftop Birthday Party',
    occasion: 'Party',
    weather: 'Mild',
    description: 'Golden hour drinks transitioning into a chic rooftop dance celebration. Stand out with statement textures and night-ready flair!',
    targetKeywords: ['party', 'glam', 'satin', 'leather', 'boots'],
    recommendedColors: ['Black', 'Green', 'Gold', 'Pink'],
    targetStyle: 'Chic',
    timeLimitSec: 35,
  },
  {
    id: 'sc-3',
    title: 'Rainy Day Campus Grind',
    occasion: 'School',
    weather: 'Rainy',
    description: 'Midterms week at the historic campus library. Needs to be extremely comfortable, warm, and smartly layered with classic preppy charm.',
    targetKeywords: ['preppy', 'stripes', 'sneakers', 'denim', 'layering'],
    recommendedColors: ['Navy', 'Blue', 'White', 'Grey'],
    targetStyle: 'Preppy',
    timeLimitSec: 40,
  },
  {
    id: 'sc-4',
    title: 'Sunlit Coastal Garden Wedding',
    occasion: 'Wedding',
    weather: 'Sunny',
    description: 'Guest of honor at a romantic outdoor botanical pavilion wedding. Formal elegance, breezy fabrics, and refined footwear.',
    targetKeywords: ['wedding', 'romantic', 'formal', 'satin', 'sandals'],
    recommendedColors: ['Green', 'Cream', 'Beige', 'Gold'],
    targetStyle: 'Romantic',
    timeLimitSec: 45,
  },
  {
    id: 'sc-5',
    title: 'Creative Executive Pitch',
    occasion: 'Work',
    weather: 'Mild',
    description: 'Pitching a fashion-tech startup to design partners. Smart, sharp, tailored, but with modern effortless edge.',
    targetKeywords: ['work', 'tailored', 'trousers', 'minimalist', 'blazer'],
    recommendedColors: ['Black', 'White', 'Beige', 'Brown'],
    targetStyle: 'Minimalist',
    timeLimitSec: 35,
  },
  {
    id: 'sc-6',
    title: 'Saturday Farmers Market & Coffee',
    occasion: 'Casual',
    weather: 'Sunny',
    description: 'Morning walk browsing fresh blooms and artisanal coffee. Needs comfortable sneakers, breezy shorts or denim, and a market tote.',
    targetKeywords: ['casual', 'linen', 'sneakers', 'tote', 'sunglasses'],
    recommendedColors: ['Cream', 'Blue', 'Beige', 'White'],
    targetStyle: 'Casual',
    timeLimitSec: 35,
  },
];

export const MATCH_OR_CLASH_ROUNDS: MatchOrClashCard[] = [
  {
    id: 'mc-1',
    items: [
      INITIAL_WARDROBE[0], // Pink top
      INITIAL_WARDROBE[5], // Black tailored trousers
      INITIAL_WARDROBE[11], // White sneakers
      INITIAL_WARDROBE[15], // Pink handbag
    ],
    isMatch: true,
    score: 95,
    explanation: 'A textbook chic combination! The pastel pink knit is anchored by sharp tailored black trousers, while clean white sneakers add youthful high-low contrast.',
    humanStylistAdvice: 'Elena Rostova: "Echoing the pink from the knit into the handbag creates a deliberate, polished sandwich effect without looking matchy-matchy."',
  },
  {
    id: 'mc-2',
    items: [
      INITIAL_WARDROBE[8], // Emerald green satin slip dress
      INITIAL_WARDROBE[14], // Chunky retro sport grey trainers
      INITIAL_WARDROBE[17], // Natural straw raffia beach tote
    ],
    isMatch: false,
    score: 42,
    explanation: 'High stylistic clash. An evening emerald satin dress battles against bulky grey running gym shoes and a beach straw tote with no unifying bridge.',
    humanStylistAdvice: 'Marcus Chen: "Satin evening slips require either strappy heels or sleek minimal leather court shoes. Running trainers with heavy treads drag the delicate drape down."',
  },
  {
    id: 'mc-3',
    items: [
      INITIAL_WARDROBE[1], // White poplin shirt
      INITIAL_WARDROBE[6], // Beige relaxed slacks
      INITIAL_WARDROBE[18], // Camel wool coat
      INITIAL_WARDROBE[21], // Gold necklace
    ],
    isMatch: true,
    score: 97,
    explanation: 'Quiet luxury at its finest! Tone-on-tone neutrals (crisp white, warm beige, camel) illuminated with delicate 18k gold jewelry.',
    humanStylistAdvice: 'Amara Diop: "Warm neutrals combined with sharp tailoring project effortless wealth and timeless grace."',
  },
  {
    id: 'mc-4',
    items: [
      INITIAL_WARDROBE[3], // French Breton stripes long sleeve
      INITIAL_WARDROBE[19], // Black leather biker jacket
      INITIAL_WARDROBE[7], // Classic straight blue jeans
      INITIAL_WARDROBE[11], // Clean white sneakers
    ],
    isMatch: true,
    score: 94,
    explanation: 'Iconic Parisian streetstyle! The collegiate stripe softens the toughness of the leather biker jacket, creating balanced rebel-meets-prep energy.',
    humanStylistAdvice: 'Chloe Sinclair: "The French stripe is one of the very few prints that behaves like a neutral. It harmonizes with denim and leather naturally."',
  },
  {
    id: 'mc-5',
    items: [
      INITIAL_WARDROBE[4], // Champagne silk camisole
      INITIAL_WARDROBE[10], // Blue denim distressed cutoffs
      INITIAL_WARDROBE[12], // Black leather pointed ankle boots
      INITIAL_WARDROBE[22], // Tortoiseshell sunglasses
    ],
    isMatch: true,
    score: 91,
    explanation: 'Edgy festival chic. Dressing down a delicate silk camisole with raw denim shorts and pointed boots gives a rock-and-roll summer attitude.',
    humanStylistAdvice: 'Elena Rostova: "The pointed boot pulls the eye down and balances the casual nature of raw denim cutoffs."',
  },
  {
    id: 'mc-6',
    items: [
      INITIAL_WARDROBE[8], // Emerald Green Satin dress
      INITIAL_WARDROBE[19], // Heavy black leather biker jacket
      INITIAL_WARDROBE[12], // Black pointed ankle boots
    ],
    isMatch: true,
    score: 93,
    explanation: 'Sensational 90s Grunge-Luxe pairing! The heavy textured leather creates tension with the fluid silk satin, radiating confident evening edge.',
    humanStylistAdvice: 'Marcus Chen: "Juxtaposition of hard (leather) and soft (satin) is an eternal high-fashion runway trick."',
  },
];

export const FASHION_BADGES = [
  { id: 'rookie', name: 'Closet Explorer', icon: '🌱', description: 'Played your first fashion game', xpRequired: 0 },
  { id: 'speed_demon', name: 'Speed Stylist', icon: '⚡', description: 'Assembled a 90+ outfit in under 20 seconds', xpRequired: 150 },
  { id: 'fashion_eye', name: 'Trained Eye', icon: '👁️', description: 'Scored 5 consecutive Match or Clash rounds', xpRequired: 300 },
  { id: 'color_virtuoso', name: 'Palette Virtuoso', icon: '🎨', description: 'Mastered harmony across 5 occasions', xpRequired: 500 },
  { id: 'runway_legend', name: 'Runway Visionary', icon: '👑', description: 'Reached Top Tier Stylist Mastery', xpRequired: 800 },
];
