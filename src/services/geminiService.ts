import {
  ClothingCategory,
  ClothingColor,
  ClothingItem,
  ClothingStyle,
  Occasion,
  Outfit,
  WeatherVibe,
} from '../types/fashion';
import { juggleOutfitHeuristic } from '../utils/fashionRules';

export interface JuggleRequestParams {
  wardrobe: ClothingItem[];
  occasion?: Occasion;
  stylePreference?: ClothingStyle | 'All';
  weather?: WeatherVibe;
  userPrompt?: string;
  excludeOutfitIds?: string[];
}

export async function requestJuggleOutfit(params: JuggleRequestParams): Promise<Outfit | null> {
  const { wardrobe, occasion = 'Casual', stylePreference = 'All', weather = 'Mild', userPrompt } = params;

  try {
    const res = await fetch('/api/gemini/juggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wardrobe,
        occasion,
        stylePreference,
        weather,
        userPrompt,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.selectedItemIds?.length > 0) {
        const itemMap = new Map(wardrobe.map((i) => [i.id, i]));
        const selectedItems: ClothingItem[] = json.data.selectedItemIds
          .map((id: string) => itemMap.get(id))
          .filter((item: ClothingItem | undefined): item is ClothingItem => Boolean(item));

        if (selectedItems.length >= 2) {
          const outfit: Outfit = {
            id: `outfit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: json.data.outfitName || 'Curated Ensemble',
            items: selectedItems,
            occasion: (json.data.occasion as Occasion) || occasion,
            style: json.data.style || 'Chic',
            colorPalette:
              json.data.colorPalette || Array.from(new Set(selectedItems.map((i) => i.color))),
            matchScore: json.data.matchScore || 94,
            scoreBreakdown: {
              colorHarmony: json.data.colorHarmonyScore || 95,
              occasionFit: json.data.occasionFitScore || 92,
              styleSynergy: json.data.styleSynergyScore || 94,
            },
            stylistNote: json.data.stylistNote || 'A harmoniously balanced look.',
            stylingTip: json.data.stylingTip || 'Keep accessories minimal to spotlight the key pieces.',
            weatherFit: weather,
            createdAt: Date.now(),
            isSaved: false,
          };
          return outfit;
        }
      }
    }
  } catch (err) {
    console.warn('Network or server error during AI juggle, using local fashion engine:', err);
  }

  // Graceful, high-quality rule-based fallback
  return juggleOutfitHeuristic({
    wardrobe,
    occasion,
    stylePreference,
    weather,
    targetItemQuery: userPrompt,
  });
}

export async function requestStylistAdvice(params: {
  query: string;
  wardrobe: ClothingItem[];
}): Promise<{
  replyMessage: string;
  outfit?: Outfit;
  missingItemAlert?: string;
}> {
  const { query, wardrobe } = params;

  try {
    const res = await fetch('/api/gemini/stylist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, wardrobe }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const itemMap = new Map(wardrobe.map((i) => [i.id, i]));
        const selectedItems: ClothingItem[] = (json.data.selectedItemIds || [])
          .map((id: string) => itemMap.get(id))
          .filter((item: ClothingItem | undefined): item is ClothingItem => Boolean(item));

        let outfit: Outfit | undefined;
        if (selectedItems.length >= 2) {
          outfit = {
            id: `outfit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: json.data.outfitName || 'Stylist Pick',
            items: selectedItems,
            occasion: (json.data.occasion as Occasion) || 'Casual',
            style: json.data.style || 'Chic',
            colorPalette: Array.from(new Set(selectedItems.map((i) => i.color))),
            matchScore: json.data.matchScore || 95,
            stylistNote: json.data.stylistNote,
            stylingTip: json.data.stylingTip,
            createdAt: Date.now(),
            isSaved: false,
          };
        }

        return {
          replyMessage: json.data.replyMessage,
          outfit,
          missingItemAlert: json.data.missingItemAlert,
        };
      }
    }
  } catch (err) {
    console.warn('Stylist server request failed, using smart local fallback:', err);
  }

  // Local fallback response
  const lowerQ = query.toLowerCase();
  let detectedOccasion: Occasion = 'Casual';
  if (lowerQ.includes('party') || lowerQ.includes('birthday') || lowerQ.includes('night out')) {
    detectedOccasion = 'Party';
  } else if (lowerQ.includes('school') || lowerQ.includes('campus') || lowerQ.includes('class')) {
    detectedOccasion = 'School';
  } else if (lowerQ.includes('date') || lowerQ.includes('dinner')) {
    detectedOccasion = 'Date';
  } else if (lowerQ.includes('wedding') || lowerQ.includes('ceremony')) {
    detectedOccasion = 'Wedding';
  } else if (lowerQ.includes('beach') || lowerQ.includes('vacation')) {
    detectedOccasion = 'Beach';
  } else if (lowerQ.includes('work') || lowerQ.includes('office') || lowerQ.includes('interview')) {
    detectedOccasion = 'Work';
  } else if (lowerQ.includes('sport') || lowerQ.includes('gym') || lowerQ.includes('active')) {
    detectedOccasion = 'Sport';
  }

  const fallbackOutfit = juggleOutfitHeuristic({
    wardrobe,
    occasion: detectedOccasion,
    targetItemQuery: query,
  });

  let replyMessage = `Here is a custom look curated from your wardrobe for ${detectedOccasion.toLowerCase()}.`;
  if (fallbackOutfit) {
    replyMessage += ` I matched your ${fallbackOutfit.items.map((i) => i.name.toLowerCase()).join(', ')} to create a balanced, effortless vibe.`;
  } else {
    replyMessage =
      "I looked through your closet, but you'll need at least a top, trousers or dress, and shoes so I can assemble a complete outfit for you!";
  }

  return {
    replyMessage,
    outfit: fallbackOutfit || undefined,
  };
}

export async function requestAnalyzeImage(
  imageBase64: string,
  mimeType?: string
): Promise<{
  name?: string;
  category?: ClothingCategory;
  color?: ClothingColor;
  style?: ClothingStyle;
  tags?: string[];
} | null> {
  try {
    const res = await fetch('/api/gemini/analyze-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Image analysis failed:', err);
  }
  return null;
}
