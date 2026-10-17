import React, { useState } from 'react';
import {
  Gamepad2,
  Zap,
  Flame,
  Shuffle,
  Trophy,
  Sparkles,
  Award,
  Star,
  ChevronRight,
} from 'lucide-react';
import { ClothingItem, FashionGameType, Outfit } from '../../types/fashion';
import { SpeedStylistGame } from './SpeedStylistGame';
import { MatchOrClashGame } from './MatchOrClashGame';
import { BlindJuggleGame } from './BlindJuggleGame';
import { FASHION_BADGES } from '../../data/gamesData';

interface GamesHubPageProps {
  wardrobe: ClothingItem[];
  playerXP: number;
  onAwardXP: (xp: number) => void;
  onSaveOutfit: (outfit: Outfit) => void;
  onPostOnline: (outfit: Outfit) => void;
}

export const GamesHubPage: React.FC<GamesHubPageProps> = ({
  wardrobe,
  playerXP,
  onAwardXP,
  onSaveOutfit,
  onPostOnline,
}) => {
  const [activeGame, setActiveGame] = useState<FashionGameType>('speed-stylist');

  // Compute Player Level
  const getLevelInfo = (xp: number) => {
    if (xp >= 800) return { title: 'Runway Visionary', level: 5, nextLevelXp: 1200, icon: '👑' };
    if (xp >= 500) return { title: 'Palette Virtuoso', level: 4, nextLevelXp: 800, icon: '🎨' };
    if (xp >= 300) return { title: 'Trained Eye', level: 3, nextLevelXp: 500, icon: '👁️' };
    if (xp >= 150) return { title: 'Speed Stylist', level: 2, nextLevelXp: 300, icon: '⚡' };
    return { title: 'Closet Explorer', level: 1, nextLevelXp: 150, icon: '🌱' };
  };

  const levelInfo = getLevelInfo(playerXP);
  const progressPercent = Math.min(100, Math.round((playerXP / levelInfo.nextLevelXp) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-900">
          <Gamepad2 className="w-4 h-4 text-[#E07A5F]" />
          <span>Fashion Mini-Games Suite</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Wardrobe Play & Challenges
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          Sharpen your fashion eye, race against the clock to style tricky scenarios, or spin the
          blind closet machine to earn Fashion XP and unlock badges!
        </p>
      </div>

      {/* Player XP & Fashion Level Banner */}
      <div className="bg-gradient-to-r from-[#18181B] via-[#28292E] to-[#3B3835] text-white rounded-3xl p-6 sm:p-7 border border-stone-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shadow-inner">
            {levelInfo.icon}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-rose-300 uppercase">
                LEVEL {levelInfo.level} STYLIST
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
              <span className="text-xs text-stone-400 font-medium">{playerXP} Fashion XP</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
              {levelInfo.title}
            </h3>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full md:w-80 space-y-2">
          <div className="flex justify-between text-xs text-stone-300 font-medium">
            <span>Next Rank Progress</span>
            <span className="font-bold text-rose-200">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-400 via-[#E07A5F] to-amber-300 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-stone-400 block text-right">
            {levelInfo.nextLevelXp - playerXP} XP to next rank
          </span>
        </div>
      </div>

      {/* Badges Collection Showcase */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Stylist Badges Collection</span>
          </span>
          <span className="text-xs text-stone-500">
            {FASHION_BADGES.filter((b) => playerXP >= b.xpRequired).length} / {FASHION_BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {FASHION_BADGES.map((badge) => {
            const isUnlocked = playerXP >= badge.xpRequired;
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-rose-50/50 border-rose-200 text-stone-900 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <h4 className="text-xs font-bold truncate">{badge.name}</h4>
                <span className="text-[10px] text-stone-500 block truncate">
                  {isUnlocked ? 'Unlocked!' : `${badge.xpRequired} XP needed`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Mode Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 border-b border-stone-200 pb-4">
        <button
          onClick={() => setActiveGame('speed-stylist')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeGame === 'speed-stylist'
              ? 'bg-[#18181B] text-white shadow-md'
              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>⚡ Speed Stylist</span>
        </button>

        <button
          onClick={() => setActiveGame('match-or-clash')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeGame === 'match-or-clash'
              ? 'bg-[#18181B] text-white shadow-md'
              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
        >
          <Flame className="w-4 h-4 text-rose-400" />
          <span>🎯 Match or Clash?</span>
        </button>

        <button
          onClick={() => setActiveGame('blind-spin')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeGame === 'blind-spin'
              ? 'bg-[#18181B] text-white shadow-md'
              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
        >
          <Shuffle className="w-4 h-4 text-[#E07A5F]" />
          <span>🎰 Blind Juggle Spin</span>
        </button>
      </div>

      {/* Selected Game Active Container */}
      <div className="pt-2">
        {activeGame === 'speed-stylist' && (
          <SpeedStylistGame
            wardrobe={wardrobe}
            onAwardXP={onAwardXP}
            onSaveOutfit={onSaveOutfit}
            onPostOnline={onPostOnline}
          />
        )}

        {activeGame === 'match-or-clash' && (
          <MatchOrClashGame onAwardXP={onAwardXP} />
        )}

        {activeGame === 'blind-spin' && (
          <BlindJuggleGame
            wardrobe={wardrobe}
            onAwardXP={onAwardXP}
            onSaveOutfit={onSaveOutfit}
            onPostOnline={onPostOnline}
          />
        )}
      </div>
    </div>
  );
};
