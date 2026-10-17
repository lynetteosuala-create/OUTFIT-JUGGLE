import React, { useState } from 'react';
import { X, Copy, Check, Share2, Globe, Heart, Sparkles } from 'lucide-react';
import { Outfit } from '../types/fashion';

interface ShareOutfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: Outfit | null;
  onOpenPostOnline: () => void;
}

export const ShareOutfitModal: React.FC<ShareOutfitModalProps> = ({
  isOpen,
  onClose,
  outfit,
  onOpenPostOnline,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen || !outfit) return null;

  const outfitSummaryText = `✨ Outfit Juggle: "${outfit.name}"\n` +
    `Occasion: ${outfit.occasion} | Style: ${outfit.style}\n` +
    `AI Match Score: ${outfit.matchScore}%\n\n` +
    `Items:\n` +
    outfit.items.map((i) => `• ${i.name} (${i.color})`).join('\n') +
    `\n\nJuggled with Outfit Juggle — Your clothes. Endless combinations.`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(outfitSummaryText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#E07A5F]" />
            <h2 className="font-serif text-xl font-bold text-stone-900">Share This Look</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Card Presentation */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#E07A5F] uppercase">
                  {outfit.occasion} Look
                </span>
                <h3 className="font-serif text-lg font-bold text-stone-900">{outfit.name}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {outfit.matchScore}% Match
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {outfit.items.slice(0, 4).map((i) => (
                <div key={i.id} className="aspect-square rounded-xl overflow-hidden bg-white border border-stone-200">
                  <img src={i.imageUrl} alt={i.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <p className="text-xs text-stone-600 line-clamp-2 italic">
              “{outfit.stylistNote || 'A harmoniously balanced look.'}”
            </p>
          </div>

          {/* Quick Sharing Options */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                onOpenPostOnline();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#18181B] hover:bg-[#2A2B2E] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-rose-300" />
              <span>Post to Outfit Juggle Community Feed</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="w-full py-3 px-4 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Outfit Details Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-500" />
                  <span>Copy Styled Outfit Summary</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full py-3 px-4 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">App Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-stone-500" />
                  <span>Copy Shareable Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
