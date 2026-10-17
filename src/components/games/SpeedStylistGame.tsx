import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sparkles,
  Trophy,
  Check,
  X,
  RotateCcw,
  Heart,
  Globe,
  ArrowRight,
  Zap,
  Shirt,
  AlertCircle,
} from 'lucide-react';
import {
  ClothingCategory,
  ClothingItem,
  GamePromptScenario,
  Outfit,
} from '../../types/fashion';
import { GAME_SCENARIOS } from '../../data/gamesData';
import confetti from 'canvas-confetti';

interface SpeedStylistGameProps {
  wardrobe: ClothingItem[];
  onAwardXP: (xp: number) => void;
  onSaveOutfit: (outfit: Outfit) => void;
  onPostOnline: (outfit: Outfit) => void;
}

export const SpeedStylistGame: React.FC<SpeedStylistGameProps> = ({
  wardrobe,
  onAwardXP,
  onSaveOutfit,
  onPostOnline,
}) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<ClothingCategory>('tops');
  const [timeLeft, setTimeLeft] = useState<number>(GAME_SCENARIOS[0].timeLimitSec);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [resultOutfit, setResultOutfit] = useState<Outfit | null>(null);
  const [evaluatedScore, setEvaluatedScore] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<{
    colorHarmony: number;
    themeSynergy: number;
    speedBonus: number;
  }>({ colorHarmony: 0, themeSynergy: 0, speedBonus: 0 });

  const currentScenario = GAME_SCENARIOS[scenarioIndex % GAME_SCENARIOS.length];

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      finishGame();
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setSelectedItems([]);
    setTimeLeft(currentScenario.timeLimitSec);
    setIsGameOver(false);
    setResultOutfit(null);
    setIsPlaying(true);
  };

  const handleToggleItem = (item: ClothingItem) => {
    if (!isPlaying) return;

    // Check if item is already picked
    if (selectedItems.some((i) => i.id === item.id)) {
      setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
      return;
    }

    // If picking a dress, replace existing tops and bottoms
    if (item.category === 'dresses') {
      const filtered = selectedItems.filter(
        (i) => i.category !== 'tops' && i.category !== 'trousers' && i.category !== 'shorts' && i.category !== 'dresses'
      );
      setSelectedItems([...filtered, item]);
      return;
    }

    // If picking a top/bottom while a dress is picked, remove the dress
    if (item.category === 'tops' || item.category === 'trousers' || item.category === 'shorts') {
      const filtered = selectedItems.filter((i) => i.category !== 'dresses');
      // replace if same category already exists
      const withoutSameCat = filtered.filter((i) => i.category !== item.category);
      setSelectedItems([...withoutSameCat, item]);
      return;
    }

    // For shoes, replace existing shoes
    if (item.category === 'shoes') {
      const withoutShoes = selectedItems.filter((i) => i.category !== 'shoes');
      setSelectedItems([...withoutShoes, item]);
      return;
    }

    // For jacket, replace existing jacket
    if (item.category === 'jackets') {
      const withoutJacket = selectedItems.filter((i) => i.category !== 'jackets');
      setSelectedItems([...withoutJacket, item]);
      return;
    }

    // For bag, replace existing bag
    if (item.category === 'bags') {
      const withoutBag = selectedItems.filter((i) => i.category !== 'bags');
      setSelectedItems([...withoutBag, item]);
      return;
    }

    // Accessories can stack up to 2
    setSelectedItems((prev) => [...prev, item]);
  };

  const finishGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);

    // Evaluate outfit
    const hasTopOrDress = selectedItems.some((i) => i.category === 'tops' || i.category === 'dresses');
    const hasBottomOrDress = selectedItems.some((i) => i.category === 'trousers' || i.category === 'shorts' || i.category === 'dresses');
    const hasShoes = selectedItems.some((i) => i.category === 'shoes');

    // Base score penalties if missing core items
    let baseScore = 70;
    if (hasTopOrDress && hasBottomOrDress) baseScore += 12;
    if (hasShoes) baseScore += 10;

    // Matching colors check
    const colors = selectedItems.map((i) => i.color);
    const matchedColors = colors.filter((c) => currentScenario.recommendedColors.includes(c)).length;
    const colorHarmony = Math.min(99, 82 + matchedColors * 5);

    // Theme synergy
    const matchedStyle = selectedItems.filter((i) => i.style === currentScenario.targetStyle).length;
    const themeSynergy = Math.min(98, 80 + matchedStyle * 6);

    // Speed bonus
    const speedBonus = Math.min(15, Math.floor(timeLeft / 3));

    const totalScore = Math.min(99, Math.round((colorHarmony * 0.4 + themeSynergy * 0.45) + speedBonus));

    setBreakdown({
      colorHarmony,
      themeSynergy,
      speedBonus,
    });
    setEvaluatedScore(totalScore);

    const xp = totalScore + (totalScore >= 90 ? 50 : 20);
    onAwardXP(xp);

    const outfit: Outfit = {
      id: `speed-outfit-${Date.now()}`,
      name: `${currentScenario.title} Edit`,
      items: selectedItems,
      occasion: currentScenario.occasion,
      style: currentScenario.targetStyle,
      colorPalette: Array.from(new Set(selectedItems.map((i) => i.color))),
      matchScore: totalScore,
      stylistNote: `Styled under pressure in ${currentScenario.timeLimitSec - timeLeft} seconds for ${currentScenario.title}!`,
      stylingTip: 'Confidence is key when styling fast — this combination hits all the right color harmonies.',
      createdAt: Date.now(),
      isSaved: false,
    };

    setResultOutfit(outfit);

    if (totalScore >= 88) {
      try {
        confetti({
          particleCount: 60,
          spread: 55,
          origin: { y: 0.6 },
          colors: ['#E07A5F', '#F4ACB7', '#10B981'],
        });
      } catch (_) {}
    }
  };

  const nextScenario = () => {
    setScenarioIndex((prev) => prev + 1);
    setSelectedItems([]);
    setIsGameOver(false);
    setResultOutfit(null);
    setTimeLeft(GAME_SCENARIOS[(scenarioIndex + 1) % GAME_SCENARIOS.length].timeLimitSec);
  };

  const hasCompleteLook =
    (selectedItems.some((i) => i.category === 'dresses') ||
      (selectedItems.some((i) => i.category === 'tops') &&
        selectedItems.some((i) => i.category === 'trousers' || i.category === 'shorts'))) &&
    selectedItems.some((i) => i.category === 'shoes');

  const filteredWardrobe = wardrobe.filter((i) => i.category === activeCategoryFilter);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Scenario Brief Card */}
      <div className="bg-gradient-to-r from-[#FAF8F5] to-rose-50/60 rounded-3xl border border-stone-200/90 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#18181B] text-white">
                CHALLENGE #{scenarioIndex + 1}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-stone-200 text-stone-700">
                {currentScenario.occasion} • {currentScenario.weather}
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              {currentScenario.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              {currentScenario.description}
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 self-start sm:self-center bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
            <Clock
              className={`w-6 h-6 ${
                timeLeft <= 10 && isPlaying ? 'text-rose-600 animate-bounce' : 'text-[#E07A5F]'
              }`}
            />
            <div className="text-center min-w-[60px]">
              <span className="text-2xl font-black font-mono text-stone-900">
                {timeLeft}s
              </span>
              <span className="text-[10px] uppercase text-stone-400 block font-bold">
                REMAINING
              </span>
            </div>
          </div>
        </div>

        {/* Target Palette Clues */}
        <div className="mt-4 pt-3 border-t border-stone-200/60 flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span className="font-bold text-stone-700">Recommended Vibe:</span>
          <span className="px-2 py-0.5 rounded-md bg-white border text-stone-700 font-medium">
            Style: {currentScenario.targetStyle}
          </span>
          <span className="text-stone-400">•</span>
          <span>Target Colors:</span>
          <div className="flex gap-1">
            {currentScenario.recommendedColors.map((col, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-white border border-stone-200 font-medium text-stone-800 text-[11px]"
              >
                {col}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Game Play Area */}
      {!isPlaying && !isGameOver && (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-[#E07A5F] flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Ready to beat the clock?
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              You'll have {currentScenario.timeLimitSec} seconds to select a Top + Bottom (or Dress)
              plus Shoes and optional layers that fit this scenario perfectly.
            </p>
          </div>
          <button
            onClick={startGame}
            className="px-8 py-3.5 rounded-2xl bg-[#18181B] hover:bg-[#2A2B2E] text-white text-base font-bold shadow-lg shadow-black/15 transition-all cursor-pointer flex items-center gap-2 mx-auto"
          >
            <Zap className="w-4 h-4 text-rose-300" />
            <span>START SPEED STYLING</span>
          </button>
        </div>
      )}

      {/* Active Styling Board */}
      {isPlaying && (
        <div className="space-y-6">
          {/* Currently Selected Outfit Rack */}
          <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Shirt className="w-4 h-4 text-[#E07A5F]" />
                <span>Your Selected Pieces ({selectedItems.length})</span>
              </span>
              <span className="text-xs font-semibold text-stone-500">
                {hasCompleteLook ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Outfit Complete!
                  </span>
                ) : (
                  'Need: Top + Bottom (or Dress) + Shoes'
                )}
              </span>
            </div>

            {selectedItems.length === 0 ? (
              <div className="p-6 border-2 border-dashed border-stone-200 rounded-2xl text-center text-xs text-stone-400">
                Click pieces from your wardrobe below to assemble your speed look!
              </div>
            ) : (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleItem(item)}
                    className="group relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-stone-800 bg-stone-50 cursor-pointer shadow-sm hover:opacity-80"
                    title="Click to remove"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <X className="w-4 h-4" />
                    </div>
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white text-center py-0.5 truncate px-1">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-400">
                Tip: The faster you submit, the higher your speed bonus!
              </span>
              <button
                onClick={finishGame}
                disabled={selectedItems.length === 0}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Submit Look Now</span>
              </button>
            </div>
          </div>

          {/* Closet Category Picker */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(
              [
                { id: 'tops', label: 'Tops' },
                { id: 'trousers', label: 'Trousers' },
                { id: 'dresses', label: 'Dresses' },
                { id: 'shorts', label: 'Shorts' },
                { id: 'shoes', label: 'Shoes' },
                { id: 'jackets', label: 'Jackets' },
                { id: 'bags', label: 'Bags' },
                { id: 'accessories', label: 'Accessories' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategoryFilter === cat.id
                    ? 'bg-[#18181B] text-white shadow-2xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat.label} ({wardrobe.filter((i) => i.category === cat.id).length})
              </button>
            ))}
          </div>

          {/* Item Selection Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredWardrobe.map((item) => {
              const isSelected = selectedItems.some((i) => i.id === item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleItem(item)}
                  className={`p-2 rounded-2xl border text-left relative transition-all cursor-pointer ${
                    isSelected
                      ? 'border-stone-900 bg-stone-50 ring-2 ring-[#E07A5F]'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 mb-2 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#18181B] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 truncate">{item.name}</h4>
                  <span className="text-[10px] text-stone-500 block">
                    {item.color} • {item.style}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Game Over Scorecard */}
      {isGameOver && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xl space-y-6 animate-in zoom-in-95">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-3xl font-bold text-stone-900">
              Styling Challenge Evaluated!
            </h3>
            <p className="text-xs sm:text-sm text-stone-500">
              {evaluatedScore >= 90
                ? 'Editorial Perfection! Runway ready under severe time pressure.'
                : 'Great styling effort! Here is how your pieces matched up.'}
            </p>
          </div>

          {/* Big Score Dial */}
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="text-center">
              <span className="font-serif text-5xl font-black text-stone-900">
                {evaluatedScore}
              </span>
              <span className="text-xs font-bold text-stone-400 block uppercase">
                TOTAL SCORE
              </span>
            </div>
            <div className="h-12 w-px bg-stone-200" />
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-stone-500">Color Harmony:</span>
                <span className="font-bold text-stone-800">{breakdown.colorHarmony}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-stone-500">Scenario Fit:</span>
                <span className="font-bold text-stone-800">{breakdown.themeSynergy}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-stone-500">Speed Bonus:</span>
                <span className="font-bold text-emerald-600">+{breakdown.speedBonus} pts</span>
              </div>
            </div>
          </div>

          {/* Outfit preview */}
          {resultOutfit && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="text-[10px] font-bold text-[#E07A5F] uppercase">
                Assembled Look
              </span>
              <div className="grid grid-cols-4 gap-2">
                {resultOutfit.items.map((i) => (
                  <div key={i.id} className="aspect-square rounded-xl overflow-hidden bg-white border border-stone-200">
                    <img src={i.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-stone-600 truncate">
                {resultOutfit.items.map((i) => i.name).join(' + ')}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100">
            <div className="flex items-center gap-2">
              {resultOutfit && (
                <>
                  <button
                    onClick={() => onSaveOutfit(resultOutfit)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Save Look</span>
                  </button>
                  <button
                    onClick={() => onPostOnline(resultOutfit)}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span>Post Online</span>
                  </button>
                </>
              )}
            </div>

            <button
              onClick={nextScenario}
              className="px-6 py-2.5 rounded-xl bg-[#18181B] hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Next Scenario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
