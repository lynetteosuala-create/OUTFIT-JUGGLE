import { ScheduledOutfit, Outfit } from '../types/fashion';
import { INITIAL_WARDROBE } from './sampleWardrobe';

// Helper to format date as YYYY-MM-DD in local time
export const formatDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const createSampleScheduledOutfits = (savedOutfits: Outfit[]): ScheduledOutfit[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const thisSaturday = new Date(today);
  const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
  thisSaturday.setDate(today.getDate() + daysUntilSaturday);

  const fallbackOutfit1: Outfit = savedOutfits[0] || {
    id: 'sample-saved-1',
    name: 'Weekend Casual Pop',
    items: [
      INITIAL_WARDROBE[0], // Pink top
      INITIAL_WARDROBE[5], // Black trousers
      INITIAL_WARDROBE[11], // White sneakers
      INITIAL_WARDROBE[15], // Pink handbag
    ],
    occasion: 'Casual',
    style: 'Chic',
    colorPalette: ['Pink', 'Black', 'White'],
    matchScore: 94,
    stylistNote: 'Flawlessly balanced with Pink, Black, and White hues.',
    stylingTip: 'Half-tuck the pink top into your trousers and let the handbag provide warmth.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    isSaved: true,
  };

  const fallbackOutfit2: Outfit = savedOutfits[1] || {
    id: 'sample-saved-2',
    name: 'Minimalist Office Edit',
    items: [
      INITIAL_WARDROBE[1], // Silk Cream Blouse
      INITIAL_WARDROBE[5], // Black tailored trousers
      INITIAL_WARDROBE[16], // Tailored Blazer
      INITIAL_WARDROBE[12], // Black leather loafers
    ],
    occasion: 'Work',
    style: 'Minimalist',
    colorPalette: ['Cream', 'Black'],
    matchScore: 96,
    stylistNote: 'Monochrome precision tailored for meetings and sharp client presentations.',
    stylingTip: 'Roll the blazer sleeves once to reveal clean gold watch or jewelry.',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    isSaved: true,
  };

  const fallbackOutfit3: Outfit = {
    id: 'sample-saved-3',
    name: 'Sunset Terrace Chic',
    items: [
      INITIAL_WARDROBE[9], // Emerald Slip Dress
      INITIAL_WARDROBE[13], // Strappy Nude Heels
      INITIAL_WARDROBE[18], // Gold Hoop Earrings
      INITIAL_WARDROBE[15], // Pink Handbag
    ],
    occasion: 'Party',
    style: 'Chic',
    colorPalette: ['Green', 'Gold', 'Pink'],
    matchScore: 92,
    stylistNote: 'Luminous jewel-tone emerald accented with subtle gold reflections.',
    stylingTip: 'Pair with relaxed loose curls and a soft lip tint.',
    createdAt: Date.now(),
    isSaved: true,
  };

  return [
    {
      id: 'sched-1',
      outfitId: fallbackOutfit1.id,
      date: formatDateKey(today),
      outfit: fallbackOutfit1,
      occasion: 'Casual',
      weatherVibe: 'Mild',
      timeOfDay: 'Morning',
      notes: 'Creative studio day & team coffee run',
      isWorn: true,
      wornAt: Date.now() - 1000 * 60 * 60 * 3,
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
      id: 'sched-2',
      outfitId: fallbackOutfit2.id,
      date: formatDateKey(tomorrow),
      outfit: fallbackOutfit2,
      occasion: 'Work',
      weatherVibe: 'Sunny',
      timeOfDay: 'Morning',
      notes: 'Quarterly styling presentation & portfolio review',
      isWorn: false,
      createdAt: Date.now() - 1000 * 60 * 60 * 12,
    },
    {
      id: 'sched-3',
      outfitId: fallbackOutfit3.id,
      date: formatDateKey(thisSaturday),
      outfit: fallbackOutfit3,
      occasion: 'Party',
      weatherVibe: 'Sunny',
      timeOfDay: 'Evening',
      notes: 'Rooftop cocktail party with college friends',
      isWorn: false,
      createdAt: Date.now(),
    },
  ];
};
