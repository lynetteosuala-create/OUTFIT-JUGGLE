import React from 'react';
import {
  Heart,
  Shuffle,
  Share2,
  Edit3,
  Globe,
  Sparkles,
  Check,
  Palette,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { Outfit } from '../types/fashion';

interface OutfitResultCardProps {
  outfit: Outfit;
  onSaveOutfit: (outfit: Outfit) => void;
  onJuggleAgain: () => void;
  onShareOutfit: (outfit: Outfit) => void;
  onEditOutfit: (outfit: Outfit) => void;
  onPostOnline: (outfit: Outfit) => void;
  onScheduleOutfit?: (outfit: Outfit) => void;
  isSaved?: boolean;
}

export const OutfitResultCard: React.FC<OutfitResultCardProps> = ({
  outfit,
  onSaveOutfit,
  onJuggleAgain,
  onShareOutfit,
  onEditOutfit,
  onPostOnline,
  onScheduleOutfit,
  isSaved,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      {/* Top Banner with Match Score & Occasion */}
      <div className="px-6 py-5 bg-gradient-to-r from-[#FAF8F5] via-white to-rose-50/40 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-wider text-[#E07A5F] uppercase">
              Curated Look
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200/60">
              {outfit.occasion}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
              {outfit.style}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {outfit.name}
          </h2>
        </div>

        {/* AI Match Score Badge */}
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-rose-100 flex items-center justify-center font-bold text-base text-stone-900">
              {outfit.matchScore}%
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              AI MATCH SCORE
            </span>
            <span className="text-xs font-bold text-stone-800">
              {outfit.matchScore >= 95 ? 'Exceptional Match' : 'Flawless Synergy'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Clothing Gallery / Grid */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {outfit.items.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-stone-50 border border-stone-200 aspect-square flex flex-col justify-end shadow-2xs hover:shadow-md transition-all"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10 p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <span className="text-white text-xs font-semibold leading-tight line-clamp-1 block">
                  {item.name}
                </span>
                <span className="text-rose-200 text-[10px] font-medium uppercase tracking-wide">
                  {item.category} • {item.color}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Item Names Inline Summary */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 text-xs text-stone-700 flex flex-wrap items-center gap-1.5 font-medium">
          <span className="font-bold text-stone-900">Combo:</span>
          {outfit.items.map((item, index) => (
            <React.Fragment key={item.id}>
              <span className="text-stone-800">{item.name}</span>
              {index < outfit.items.length - 1 && (
                <span className="text-stone-400 font-bold">+</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Color Palette & Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Color combination */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Colour Harmony</span>
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Coordinated
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              {outfit.colorPalette.map((col, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-medium text-stone-800 flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#18181B]" />
                  <span>{col}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Stylist Note & Tip */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-rose-50/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E07A5F] uppercase">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Stylist Advice</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              {outfit.stylistNote || 'A stylish blend curated directly from your existing wardrobe.'}
            </p>
            {outfit.stylingTip && (
              <p className="text-xs text-rose-900 font-medium italic pt-1 border-t border-rose-100">
                Tip: {outfit.stylingTip}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons requested in user prompt */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* ❤️ Save Outfit */}
            <button
              onClick={() => onSaveOutfit(outfit)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSaved
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 shadow-2xs'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`}
              />
              <span>{isSaved ? 'Saved in Outfits' : 'Save Outfit'}</span>
            </button>

            {/* 📅 Schedule */}
            {onScheduleOutfit && (
              <button
                onClick={() => onScheduleOutfit(outfit)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#E07A5F]" />
                <span>Schedule</span>
              </button>
            )}

            {/* ✏️ Edit Outfit */}
            <button
              onClick={() => onEditOutfit(outfit)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-stone-500" />
              <span>Edit Outfit</span>
            </button>

            {/* 📤 Share */}
            <button
              onClick={() => onShareOutfit(outfit)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-stone-500" />
              <span>Share</span>
            </button>

            {/* 🌐 Post Online */}
            <button
              onClick={() => onPostOnline(outfit)}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#E07A5F]" />
              <span>Post Online</span>
            </button>
          </div>

          {/* 🔀 Juggle Again Button */}
          <button
            onClick={onJuggleAgain}
            className="px-5 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#2A2B2E] text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all group cursor-pointer"
          >
            <Shuffle className="w-4 h-4 text-rose-300 group-hover:rotate-180 transition-transform duration-500" />
            <span>Juggle Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
