import { CommunityPost } from '../types/fashion';
import { INITIAL_WARDROBE } from './sampleWardrobe';

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Camille Laurent',
    authorHandle: '@camille_style',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    isHumanStylist: false,
    caption: 'Juggled this combination for Sunday brunch in Le Marais! Never thought to match my pink top with tailored black trousers and sneakers until Outfit Juggle suggested it. Absolute perfection. ☕🥐',
    likesCount: 142,
    likedByMe: true,
    comments: [
      {
        id: 'c1',
        authorName: 'Elena Rostova',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        content: 'Spot on! The clean white sneakers break the formality of the trousers just right.',
        createdAt: Date.now() - 1000 * 60 * 60 * 4,
      },
      {
        id: 'c2',
        authorName: 'Sophie Zhang',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        content: 'Saving this to my weekend inspiration board! 💖',
        createdAt: Date.now() - 1000 * 60 * 60 * 2,
      },
    ],
    outfit: {
      id: 'outfit-post-1',
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
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 'post-2',
    authorName: 'Marcus Chen',
    authorHandle: '@marcus_chen_craft',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isHumanStylist: true,
    caption: 'Curated this Date Night look for our client Maya using solely her existing capsule. Notice how the camel coat anchors the green satin slip without stealing its light. 🥂',
    likesCount: 289,
    likedByMe: false,
    comments: [
      {
        id: 'c3',
        authorName: 'Leo Morales',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        content: 'That emerald green and camel combination is timeless high-fashion.',
        createdAt: Date.now() - 1000 * 60 * 60 * 8,
      },
    ],
    outfit: {
      id: 'outfit-post-2',
      name: 'Sunset Romance Coordination',
      items: [
        INITIAL_WARDROBE[8], // Emerald dress
        INITIAL_WARDROBE[18], // Camel coat
        INITIAL_WARDROBE[13], // Nude strappy sandals
        INITIAL_WARDROBE[21], // Gold necklace
      ],
      occasion: 'Date',
      style: 'Romantic',
      colorPalette: ['Green', 'Brown', 'Beige', 'Gold'],
      matchScore: 97,
      createdAt: Date.now() - 1000 * 60 * 60 * 12,
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: 'post-3',
    authorName: 'Zoe Kravitz-Inspired',
    authorHandle: '@zoe_aesthetic',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    isHumanStylist: false,
    caption: 'School / Library fit juggled in 10 seconds flat! The French stripes keep it Parisian while the leather biker jacket adds instant attitude. 📚☕',
    likesCount: 95,
    likedByMe: false,
    comments: [],
    outfit: {
      id: 'outfit-post-3',
      name: 'Campus Minimalist Ensemble',
      items: [
        INITIAL_WARDROBE[3], // Stripe top
        INITIAL_WARDROBE[7], // Straight jeans
        INITIAL_WARDROBE[19], // Leather jacket
        INITIAL_WARDROBE[11], // White sneakers
      ],
      occasion: 'School',
      style: 'Preppy',
      colorPalette: ['Navy', 'Blue', 'Black', 'White'],
      matchScore: 93,
      createdAt: Date.now() - 1000 * 60 * 60 * 20,
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
  },
];
