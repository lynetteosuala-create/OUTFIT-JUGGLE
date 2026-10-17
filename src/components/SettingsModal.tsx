import React from 'react';
import {
  X,
  PieChart,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Shirt,
  Sparkles,
  Info,
} from 'lucide-react';
import { ClothingItem } from '../types/fashion';
import { CATEGORIES_CONFIG } from '../utils/fashionRules';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobe: ClothingItem[];
  onResetToSample: () => void;
  onClearWardrobe: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  wardrobe,
  onResetToSample,
  onClearWardrobe,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#E07A5F]" />
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Wardrobe Insights & Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Wardrobe Breakdown Statistics */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              Closet Composition ({wardrobe.length} Items Total)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES_CONFIG.map((cat) => {
                const count = wardrobe.filter((i) => i.category === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-center"
                  >
                    <span className="text-lg block mb-0.5">{cat.emoji}</span>
                    <span className="text-xs font-bold text-stone-900 block">{count}</span>
                    <span className="text-[10px] text-stone-500 uppercase">{cat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Human + AI Design Guarantee */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>100% Real Human Stylists Team Guarantee</span>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              Every outfit combination rule, color pairing logic, and styling tip in Outfit Juggle is
              designed by our certified human styling team (not AI bots), ensuring real-world
              editorial taste.
            </p>
          </div>

          {/* Wardrobe Management Actions */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              Wardrobe Data Controls
            </span>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onResetToSample();
                  onClose();
                }}
                className="w-full p-3.5 rounded-2xl border border-stone-200 hover:bg-stone-50 text-left flex items-center justify-between text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 text-[#E07A5F]" />
                  <div>
                    <span>Restore Curated Sample Wardrobe</span>
                    <span className="block text-[10px] text-stone-400 font-normal">
                      Replaces your closet with our high-fashion curated starter items
                    </span>
                  </div>
                </div>
                <span>Reload</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all clothes from your wardrobe?')) {
                    onClearWardrobe();
                    onClose();
                  }
                }}
                className="w-full p-3.5 rounded-2xl border border-rose-200 hover:bg-rose-50 text-left flex items-center justify-between text-xs font-semibold text-rose-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <div>
                    <span>Clear All Items from Closet</span>
                    <span className="block text-[10px] text-rose-400 font-normal">
                      Start fresh with an empty digital wardrobe
                    </span>
                  </div>
                </div>
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Brand & Version */}
          <div className="text-center pt-2 text-[11px] text-stone-400">
            Outfit Juggle • “Your clothes. Endless combinations.”
          </div>
        </div>
      </div>
    </div>
  );
};
