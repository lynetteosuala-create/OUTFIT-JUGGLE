import {
  ClothingCategory,
  ClothingColor,
  ClothingItem,
  ClothingStyle,
  Occasion,
  Outfit,
  WeatherVibe,
} from '../types/fashion';

export interface WardrobeCompletenessCheck {
  canCreateOutfit: boolean;
  missingCategory?: ClothingCategory | 'bottoms';
  missingMessage?: string;
  hasTops: boolean;
  hasBottoms: boolean;
  hasDresses: boolean;
  hasShoes: boolean;
}

export const CATEGORIES_CONFIG: {
  id: ClothingCategory;
  label: string;
  emoji: string;
  description: string;
}[] = [
  { id: 'tops', label: 'Tops', emoji: '👕', description: 'Shirts, blouses, t-shirts, knits' },
  { id: 'trousers', label: 'Trousers', emoji: '👖', description: 'Jeans, slacks, tailored pants' },
  { id: 'dresses', label: 'Dresses', emoji: '👗', description: 'Midi dresses, gowns, slip dresses' },
  { id: 'shorts', label: 'Shorts', emoji: '🩳', description: 'Denim cutoffs, linen shorts' },
  { id: 'shoes', label: 'Shoes', emoji: '👟', description: 'Sneakers, boots, sandals, heels' },
  { id: 'bags', label: 'Bags', emoji: '👜', description: 'Handbags, totes, crossbodies' },
  { id: 'jackets', label: 'Jackets', emoji: '🧥', description: 'Blazers, coats, denim jackets' },
  { id: 'accessories', label: 'Accessories', emoji: '💍', description: 'Jewelry, belts, sunglasses' },
];

export const OCCASIONS_CONFIG: {
  id: Occasion;
  label: string;
  emoji: string;
  description: string;
  preferredStyles: ClothingStyle[];
}[] = [
  {
    id: 'Casual',
    label: 'Casual',
    emoji: '🛍️',
    description: 'Everyday comfort, coffee runs, weekends',
    preferredStyles: ['Casual', 'Minimalist', 'Streetwear'],
  },
  {
    id: 'School',
    label: 'School',
    emoji: '🎓',
    description: 'Campus chic, lectures, library sessions',
    preferredStyles: ['Preppy', 'Casual', 'Streetwear', 'Minimalist'],
  },
  {
    id: 'Party',
    label: 'Party',
    emoji: '🎉',
    description: 'Night out, birthdays, celebrations',
    preferredStyles: ['Chic', 'Romantic', 'Streetwear'],
  },
  {
    id: 'Date',
    label: 'Date',
    emoji: '💕',
    description: 'Romantic dinners, sunset strolls, drinks',
    preferredStyles: ['Romantic', 'Chic', 'Minimalist'],
  },
  {
    id: 'Work',
    label: 'Work',
    emoji: '💼',
    description: 'Office, business meetings, presentations',
    preferredStyles: ['Chic', 'Minimalist', 'Preppy', 'Formal'],
  },
  {
    id: 'Beach',
    label: 'Beach',
    emoji: '🏖️',
    description: 'Resort, seaside, relaxed summer sun',
    preferredStyles: ['Boho', 'Casual', 'Romantic'],
  },
  {
    id: 'Wedding',
    label: 'Wedding',
    emoji: '👰',
    description: 'Guest attire, rehearsals, receptions',
    preferredStyles: ['Formal', 'Romantic', 'Chic'],
  },
  {
    id: 'Sport',
    label: 'Sport',
    emoji: '🏃',
    description: 'Active lifestyle, gym, athleisure',
    preferredStyles: ['Sporty', 'Streetwear', 'Casual'],
  },
];

export const COLOR_PALETTES: { name: string; hex: string; color: ClothingColor }[] = [
  { name: 'Pure White', hex: '#FFFFFF', color: 'White' },
  { name: 'Noir Black', hex: '#18181B', color: 'Black' },
  { name: 'Soft Cream', hex: '#FDFBF7', color: 'Cream' },
  { name: 'Pastel Blush', hex: '#F4ACB7', color: 'Pink' },
  { name: 'Cherry Red', hex: '#E63946', color: 'Red' },
  { name: 'Sky Blue', hex: '#60A5FA', color: 'Blue' },
  { name: 'Midnight Navy', hex: '#1E293B', color: 'Navy' },
  { name: 'Forest Green', hex: '#1B4D3E', color: 'Green' },
  { name: 'Sage Leaf', hex: '#84A98C', color: 'Sage' },
  { name: 'Warm Beige', hex: '#E6D7C3', color: 'Beige' },
  { name: 'Caramel Brown', hex: '#9C6644', color: 'Brown' },
  { name: 'Sunshine Yellow', hex: '#F6BD60', color: 'Yellow' },
  { name: 'Lilac Purple', hex: '#CDB4DB', color: 'Purple' },
  { name: 'Heather Grey', hex: '#9CA3AF', color: 'Grey' },
  { name: 'Metallic Gold', hex: '#D4AF37', color: 'Gold' },
  { name: 'Chrome Silver', hex: '#CBD5E1', color: 'Silver' },
];

export function checkWardrobeCompleteness(wardrobe: ClothingItem[]): WardrobeCompletenessCheck {
  const tops = wardrobe.filter((i) => i.category === 'tops');
  const bottoms = wardrobe.filter((i) => i.category === 'trousers' || i.category === 'shorts');
  const dresses = wardrobe.filter((i) => i.category === 'dresses');
  const shoes = wardrobe.filter((i) => i.category === 'shoes');

  const hasTops = tops.length > 0;
  const hasBottoms = bottoms.length > 0;
  const hasDresses = dresses.length > 0;
  const hasShoes = shoes.length > 0;

  // Must have shoes
  if (!hasShoes) {
    return {
      canCreateOutfit: false,
      missingCategory: 'shoes',
      missingMessage: 'Your wardrobe needs a pair of suitable shoes to complete this outfit.',
      hasTops,
      hasBottoms,
      hasDresses,
      hasShoes,
    };
  }

  // Must have either a dress OR (top AND bottom)
  if (!hasDresses && !hasTops) {
    return {
      canCreateOutfit: false,
      missingCategory: 'tops',
      missingMessage: 'Your wardrobe needs tops or dresses to create an outfit combination.',
      hasTops,
      hasBottoms,
      hasDresses,
      hasShoes,
    };
  }

  if (!hasDresses && hasTops && !hasBottoms) {
    return {
      canCreateOutfit: false,
      missingCategory: 'bottoms',
      missingMessage: 'Your wardrobe needs trousers, shorts, or a dress to pair with your tops.',
      hasTops,
      hasBottoms,
      hasDresses,
      hasShoes,
    };
  }

  return {
    canCreateOutfit: true,
    hasTops,
    hasBottoms,
    hasDresses,
    hasShoes,
  };
}

// Color compatibility matrix for styling
const NEUTRALS: ClothingColor[] = ['White', 'Black', 'Cream', 'Beige', 'Grey', 'Navy', 'Brown'];

function calculateColorHarmony(colors: ClothingColor[]): number {
  if (colors.length <= 1) return 92;

  // Check if monochromatic
  const uniqueColors = Array.from(new Set(colors));
  if (uniqueColors.length === 1) return 96;

  // Count non-neutrals
  const nonNeutrals = uniqueColors.filter((c) => !NEUTRALS.includes(c));

  // Max 2 accent colors + neutrals is classic high-fashion
  if (nonNeutrals.length === 0) return 95; // All neutral palette (quiet luxury)
  if (nonNeutrals.length === 1) return 98; // Single statement color anchored by neutrals (e.g. Pink top + black trousers + white sneakers)
  if (nonNeutrals.length === 2) {
    // Harmonious pairs
    const c1 = nonNeutrals[0];
    const c2 = nonNeutrals[1];
    if (
      (c1 === 'Pink' && c2 === 'Red') ||
      (c1 === 'Pink' && c2 === 'Sage') ||
      (c1 === 'Blue' && c2 === 'Yellow') ||
      (c1 === 'Green' && c2 === 'Pink') ||
      (c1 === 'Gold' && c2 === 'Green')
    ) {
      return 94;
    }
    return 89;
  }

  // 3 or more non neutrals can clash
  return 82;
}

export function juggleOutfitHeuristic(params: {
  wardrobe: ClothingItem[];
  occasion?: Occasion;
  stylePreference?: ClothingStyle | 'All';
  weather?: WeatherVibe;
  targetItemQuery?: string;
  excludeOutfitIds?: string[];
}): Outfit | null {
  const { wardrobe, occasion = 'Casual', stylePreference = 'All', weather = 'Mild', targetItemQuery } = params;

  const completeness = checkWardrobeCompleteness(wardrobe);
  if (!completeness.canCreateOutfit) {
    return null;
  }

  const items = [...wardrobe];
  // Target item matching (e.g. "Use my pink top" or "sneakers")
  let anchorItem: ClothingItem | undefined;
  if (targetItemQuery && targetItemQuery.trim().length > 0) {
    const q = targetItemQuery.toLowerCase();
    anchorItem = items.find((item) => {
      const name = item.name.toLowerCase();
      const col = item.color.toLowerCase();
      const cat = item.category.toLowerCase();
      const style = item.style.toLowerCase();
      return (
        q.includes(name) ||
        (q.includes(col) && q.includes(cat.slice(0, 3))) ||
        (q.includes(col) && q.includes('top') && cat === 'tops') ||
        (q.includes(col) && q.includes('trouser') && cat === 'trousers') ||
        (q.includes(col) && q.includes('dress') && cat === 'dresses') ||
        (q.includes('pink') && col === 'pink') ||
        (q.includes('dress') && cat === 'dresses')
      );
    });
  }

  // Decide if we should do Dress or Top+Bottom
  const dresses = items.filter((i) => i.category === 'dresses');
  const tops = items.filter((i) => i.category === 'tops');
  const trousers = items.filter((i) => i.category === 'trousers');
  const shorts = items.filter((i) => i.category === 'shorts');
  const shoes = items.filter((i) => i.category === 'shoes');
  const jackets = items.filter((i) => i.category === 'jackets');
  const bags = items.filter((i) => i.category === 'bags');
  const accessories = items.filter((i) => i.category === 'accessories');

  let chosenItems: ClothingItem[] = [];

  const useDress =
    dresses.length > 0 &&
    (anchorItem?.category === 'dresses' ||
      (occasion === 'Wedding' || occasion === 'Party' || occasion === 'Date'
        ? Math.random() > 0.45
        : Math.random() > 0.75));

  if (useDress && dresses.length > 0) {
    const dress =
      anchorItem?.category === 'dresses'
        ? anchorItem
        : dresses[Math.floor(Math.random() * dresses.length)];
    chosenItems.push(dress);
  } else {
    // Pick Top
    let top: ClothingItem;
    if (anchorItem && anchorItem.category === 'tops') {
      top = anchorItem;
    } else {
      // Prioritize style if specified
      const matchingTops =
        stylePreference !== 'All'
          ? tops.filter((t) => t.style === stylePreference)
          : tops;
      const pool = matchingTops.length > 0 ? matchingTops : tops;
      top = pool[Math.floor(Math.random() * pool.length)];
    }
    chosenItems.push(top);

    // Pick Bottom (Trouser or Short based on weather / occasion)
    const preferShorts = (weather === 'Sunny' || occasion === 'Beach') && shorts.length > 0;
    const bottomPool = preferShorts && Math.random() > 0.3 ? shorts : trousers.length > 0 ? trousers : shorts;
    const bottom =
      anchorItem && (anchorItem.category === 'trousers' || anchorItem.category === 'shorts')
        ? anchorItem
        : bottomPool[Math.floor(Math.random() * bottomPool.length)];
    if (bottom) chosenItems.push(bottom);
  }

  // Pick Shoes
  let shoe: ClothingItem;
  if (anchorItem && anchorItem.category === 'shoes') {
    shoe = anchorItem;
  } else {
    // Select shoes matching occasion/vibe
    let shoeCandidates = shoes;
    if (occasion === 'Sport') {
      shoeCandidates = shoes.filter((s) => s.style === 'Sporty' || s.name.toLowerCase().includes('trainer') || s.name.toLowerCase().includes('sneaker'));
    } else if (occasion === 'Wedding' || occasion === 'Party') {
      shoeCandidates = shoes.filter((s) => s.style === 'Romantic' || s.style === 'Chic' || s.name.toLowerCase().includes('sandal') || s.name.toLowerCase().includes('boot'));
    }
    const pool = shoeCandidates.length > 0 ? shoeCandidates : shoes;
    shoe = pool[Math.floor(Math.random() * pool.length)];
  }
  chosenItems.push(shoe);

  // Optional Jacket (always in Chilly/Rainy, or by chance)
  const needJacket = weather === 'Chilly' || weather === 'Rainy' || Math.random() > 0.45;
  if (needJacket && jackets.length > 0) {
    const jacket = jackets[Math.floor(Math.random() * jackets.length)];
    chosenItems.push(jacket);
  }

  // Optional Bag
  if (bags.length > 0 && Math.random() > 0.25) {
    // Try to coordinate bag color with top or shoes
    const bag = bags[Math.floor(Math.random() * bags.length)];
    chosenItems.push(bag);
  }

  // Optional Accessories
  if (accessories.length > 0 && Math.random() > 0.3) {
    const accessory = accessories[Math.floor(Math.random() * accessories.length)];
    chosenItems.push(accessory);
  }

  // Calculate scores
  const colors = chosenItems.map((i) => i.color);
  const colorHarmony = calculateColorHarmony(colors);

  // Occasion fit
  const occasionConfig = OCCASIONS_CONFIG.find((o) => o.id === occasion);
  const matchingStyleCount = chosenItems.filter((i) =>
    occasionConfig?.preferredStyles.includes(i.style)
  ).length;
  const occasionFit = Math.min(99, 84 + Math.round((matchingStyleCount / chosenItems.length) * 15));

  // Style synergy
  const styles = chosenItems.map((i) => i.style);
  const dominantStyle = getDominant(styles) || 'Chic';
  const styleSynergy = Math.min(98, 86 + Math.floor(Math.random() * 12));

  const matchScore = Math.round(colorHarmony * 0.4 + occasionFit * 0.35 + styleSynergy * 0.25);

  // Generate title and tips
  const outfitName = generateOutfitName(chosenItems, occasion, dominantStyle);
  const stylistNote = generateStylistNote(chosenItems, occasion, matchScore);
  const stylingTip = generateStylingTip(chosenItems, occasion);

  return {
    id: `outfit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: outfitName,
    items: chosenItems,
    occasion,
    style: dominantStyle,
    colorPalette: Array.from(new Set(chosenItems.map((i) => i.color))),
    matchScore,
    scoreBreakdown: {
      colorHarmony,
      occasionFit,
      styleSynergy,
    },
    stylistNote,
    stylingTip,
    weatherFit: weather,
    createdAt: Date.now(),
    isSaved: false,
  };
}

function getDominant(arr: string[]): string {
  const counts: Record<string, number> = {};
  for (const item of arr) {
    counts[item] = (counts[item] || 0) + 1;
  }
  let maxCount = 0;
  let dominant = arr[0] || 'Casual';
  for (const [key, val] of Object.entries(counts)) {
    if (val > maxCount) {
      maxCount = val;
      dominant = key;
    }
  }
  return dominant;
}

function generateOutfitName(items: ClothingItem[], occasion: Occasion, style: string): string {
  const primaryColors = items.map((i) => i.color);
  const hasPink = primaryColors.includes('Pink');
  const hasBlack = primaryColors.includes('Black');
  const hasWhite = primaryColors.includes('White');

  if (occasion === 'Casual') {
    if (hasPink && hasBlack) return 'Weekend Casual Pop';
    return `${style} Everyday Rhythm`;
  }
  if (occasion === 'Party') {
    return 'Midnight Glam Silhouette';
  }
  if (occasion === 'Date') {
    return 'Sunset Romance Coordination';
  }
  if (occasion === 'Work') {
    return 'Smart Modern Executive';
  }
  if (occasion === 'School') {
    return 'Campus Minimalist Ensemble';
  }
  if (occasion === 'Beach') {
    return 'Breezy Seaside Escape';
  }
  if (occasion === 'Wedding') {
    return 'Elevated Celebration Luxe';
  }
  if (occasion === 'Sport') {
    return 'Urban Dynamic Activewear';
  }
  return `${style} ${occasion} Edit`;
}

function generateStylistNote(items: ClothingItem[], occasion: Occasion, score: number): string {
  const itemNames = items.map((i) => i.name.toLowerCase());
  const colors = Array.from(new Set(items.map((i) => i.color))).join(' and ');

  if (score >= 93) {
    return `Flawlessly balanced with ${colors} hues. The proportions create a clean silhouette that feels effortless for ${occasion.toLowerCase()} settings.`;
  }
  return `A stylish blend curated from your wardrobe. The contrast between textures and shades brings a modern, confident energy.`;
}

function generateStylingTip(items: ClothingItem[], occasion: Occasion): string {
  const hasSneakers = items.some((i) => i.name.toLowerCase().includes('sneaker'));
  const hasTop = items.some((i) => i.category === 'tops');
  const hasTrousers = items.some((i) => i.category === 'trousers');
  const hasJacket = items.some((i) => i.category === 'jackets');

  if (hasTop && hasTrousers && hasSneakers) {
    return 'French-tuck the top into your trousers and cuff the hems slightly above the sneakers for an elongated, relaxed leg line.';
  }
  if (hasJacket) {
    return 'Drape the jacket over your shoulders rather than wearing the sleeves for an instant editorial, high-fashion attitude.';
  }
  if (occasion === 'Party' || occasion === 'Date') {
    return 'Stack delicate jewelry pieces and add a spritz of your signature perfume to make the look feel truly curated.';
  }
  return 'Keep hair and makeup relaxed to allow the coordinated wardrobe pieces to take center stage.';
}
