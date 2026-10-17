import React, { useState } from 'react';
import {
  Shuffle,
  Sparkles,
  AlertCircle,
  Plus,
  Shirt,
  CloudSun,
  Flame,
  Wand2,
} from 'lucide-react';
import {
  ClothingCategory,
  ClothingItem,
  Occasion,
  Outfit,
  WeatherVibe,
} from '../types/fashion';
import { OCCASIONS_CONFIG, checkWardrobeCompleteness } from '../utils/fashionRules';
import { requestJuggleOutfit } from '../services/geminiService';
import { OutfitResultCard } from './OutfitResultCard';
import confetti from 'canvas-confetti';

interface JugglePageProps {
  wardrobe: ClothingItem[];
  selectedOccasion: Occasion;
  onSelectOccasion: (occ: Occasion) => void;
  onAddNewItem: () => void;
  onSaveOutfit: (outfit: Outfit) => void;
  onShareOutfit: (outfit: Outfit) => void;
  onEditOutfit: (outfit: Outfit) => void;
  onPostOnline: (outfit: Outfit) => void;
  onScheduleOutfit?: (outfit: Outfit) => void;
  savedOutfits: Outfit[];
}

export const JugglePage: React.FC<JugglePageProps> = ({
  wardrobe,
  selectedOccasion,
  onSelectOccasion,
  onAddNewItem,
  onSaveOutfit,
  onShareOutfit,
  onEditOutfit,
  onPostOnline,
  onScheduleOutfit,
  savedOutfits,
}) => {
  const [weather, setWeather] = useState<WeatherVibe>('Mild');
  const [stylePreference, setStylePreference] = useState<string>('All');
  const [userPrompt, setUserPrompt] = useState('');
  const [isJuggling, setIsJuggling] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [juggleCount, setJuggleCount] = useState(0);

  // Check completeness
  const completeness = checkWardrobeCompleteness(wardrobe);

  const handleJuggle = async () => {
    if (!completeness.canCreateOutfit) return;

    setIsJuggling(true);

    try {
      // Small delay for smooth shuffle animation
      const [result] = await Promise.all([
        requestJuggleOutfit({
          wardrobe,
          occasion: selectedOccasion,
          stylePreference: stylePreference as any,
          weather,
          userPrompt: userPrompt.trim() || undefined,
        }),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);

      if (result) {
        setCurrentOutfit(result);
        setJuggleCount((prev) => prev + 1);

        // Confetti celebration if match score is high
        if (result.matchScore >= 92) {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.7 },
            colors: ['#E07A5F', '#F4ACB7', '#DDA15E'],
          });
        }
      }
    } finally {
      setIsJuggling(false);
    }
  };

  const isCurrentOutfitSaved = currentOutfit
    ? savedOutfits.some((o) => o.id === currentOutfit.id || (o.items.length === currentOutfit.items.length && o.items.every((it, idx) => it.id === currentOutfit.items[idx]?.id)))
    : false;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-900">
          <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>Intelligent Wardrobe Combinatorics</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Juggle Your Closet
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          Pick an occasion and let AI shuffle through your digital wardrobe to craft high-fashion,
          color-balanced outfits you never thought to wear.
        </p>
      </div>

      {/* Missing Items Warning Banner */}
      {!completeness.canCreateOutfit && (
        <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-rose-950">
                Incomplete Wardrobe Setup
              </h4>
              <p className="text-xs sm:text-sm text-rose-800 font-medium">
                {completeness.missingMessage}
              </p>
            </div>
          </div>
          <button
            onClick={onAddNewItem}
            className="px-5 py-2.5 rounded-xl bg-[#18181B] text-white text-xs font-semibold flex items-center gap-2 shrink-0 cursor-pointer shadow-sm hover:bg-stone-800"
          >
            <Plus className="w-4 h-4 text-rose-300" />
            <span>+ Add Missing Piece</span>
          </button>
        </div>
      )}

      {/* Occasion Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            1. Select Occasion
          </label>
          <span className="text-xs text-stone-500">Currently: {selectedOccasion}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {OCCASIONS_CONFIG.map((occ) => (
            <button
              key={occ.id}
              onClick={() => onSelectOccasion(occ.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedOccasion === occ.id
                  ? 'border-[#18181B] bg-[#18181B] text-white shadow-md scale-[1.02]'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
              }`}
            >
              <div className="text-xl mb-1">{occ.emoji}</div>
              <span className="font-bold text-xs sm:text-sm block">{occ.label}</span>
              <span
                className={`text-[11px] line-clamp-1 ${
                  selectedOccasion === occ.id ? 'text-stone-300' : 'text-stone-400'
                }`}
              >
                {occ.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Weather & Target Constraint Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs">
        {/* Weather Vibe */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <CloudSun className="w-4 h-4 text-amber-500" />
            <span>Weather Condition</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(
              [
                { id: 'Sunny', label: 'Sunny ☀️' },
                { id: 'Mild', label: 'Mild ⛅' },
                { id: 'Chilly', label: 'Chilly 🍂' },
                { id: 'Rainy', label: 'Rainy 🌧️' },
              ] as const
            ).map((w) => (
              <button
                key={w.id}
                onClick={() => setWeather(w.id)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  weather === w.id
                    ? 'bg-rose-50 border border-rose-300 text-rose-900'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/80'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom anchor/filter */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Wand2 className="w-4 h-4 text-rose-500" />
            <span>Style Constraint (Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Use my pink top, cute but comfortable..."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/20"
          />
        </div>
      </div>

      {/* Signature Animated Button: JUGGLE MY CLOSET */}
      <div className="text-center pt-4">
        <button
          onClick={handleJuggle}
          disabled={isJuggling || !completeness.canCreateOutfit}
          className={`relative group inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-5 sm:py-6 rounded-3xl text-lg sm:text-xl font-bold tracking-tight text-white transition-all duration-300 shadow-2xl cursor-pointer ${
            !completeness.canCreateOutfit
              ? 'bg-stone-300 cursor-not-allowed opacity-60 shadow-none'
              : 'bg-gradient-to-r from-[#18181B] via-[#2D2E35] to-[#E07A5F] hover:shadow-[#E07A5F]/25 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {/* Animated Shuffle Glow Effect */}
          <span className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#E07A5F] to-rose-300 opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />

          <Shuffle
            className={`w-6 h-6 text-rose-300 transition-transform ${
              isJuggling ? 'animate-spin' : 'group-hover:rotate-180 duration-500'
            }`}
          />

          <span className="relative z-10">
            {isJuggling
              ? 'Shuffling Clothes...'
              : juggleCount > 0
              ? '🔀 JUGGLE AGAIN'
              : '🔀 JUGGLE MY CLOSET'}
          </span>

          <span className="relative z-10 text-xs px-2.5 py-1 rounded-full bg-white/20 text-rose-100 font-semibold hidden sm:inline-block">
            {wardrobe.length} Pieces
          </span>
        </button>

        <p className="text-xs text-stone-500 mt-2 font-medium">
          {juggleCount > 0
            ? `Generated ${juggleCount} outfit combinations so far.`
            : 'Click to mix and coordinate tops, bottoms, shoes, and layers from your closet.'}
        </p>
      </div>

      {/* Slot Machine Shuffle Animation Overlay */}
      {isJuggling && (
        <div className="bg-white/95 rounded-3xl border border-stone-200 p-8 text-center space-y-6 shadow-xl animate-in zoom-in-95">
          <div className="flex items-center justify-center gap-3">
            <Shuffle className="w-8 h-8 text-[#E07A5F] animate-spin" />
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Harmonizing Your Wardrobe...
            </h3>
          </div>

          {/* Cycling items animation */}
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {wardrobe.slice(0, 4).map((i, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 animate-pulse shadow-2xs"
              >
                <img src={i.imageUrl} alt="" className="w-full h-full object-cover blur-2xs" />
              </div>
            ))}
          </div>

          <p className="text-xs text-stone-500 font-medium tracking-wide">
            Checking color palettes • Matching silhouettes • Aligning occasion codes
          </p>
        </div>
      )}

      {/* Outfit Result Display */}
      {currentOutfit && !isJuggling && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Outfit Juggled Just For You
              </span>
            </div>
            <span className="text-xs text-stone-500">
              Combination #{juggleCount}
            </span>
          </div>

          <OutfitResultCard
            outfit={currentOutfit}
            onSaveOutfit={onSaveOutfit}
            onJuggleAgain={handleJuggle}
            onShareOutfit={onShareOutfit}
            onEditOutfit={onEditOutfit}
            onPostOnline={onPostOnline}
            onScheduleOutfit={onScheduleOutfit}
            isSaved={isCurrentOutfitSaved}
          />
        </div>
      )}
    </div>
  );
};
