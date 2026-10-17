import React, { useState } from 'react';
import {
  Heart,
  Trash2,
  Edit2,
  Share2,
  Globe,
  Shuffle,
  Calendar,
  Sparkles,
  Search,
  Check,
  X,
} from 'lucide-react';
import { Outfit } from '../types/fashion';

interface SavedOutfitsPageProps {
  savedOutfits: Outfit[];
  onDeleteSavedOutfit: (id: string) => void;
  onRenameSavedOutfit: (id: string, newName: string) => void;
  onShareOutfit: (outfit: Outfit) => void;
  onPostOnline: (outfit: Outfit) => void;
  onNavigateToJuggle: () => void;
  onScheduleOutfit?: (outfit: Outfit) => void;
  onNavigateToCalendar?: () => void;
}

export const SavedOutfitsPage: React.FC<SavedOutfitsPageProps> = ({
  savedOutfits,
  onDeleteSavedOutfit,
  onRenameSavedOutfit,
  onShareOutfit,
  onPostOnline,
  onNavigateToJuggle,
  onScheduleOutfit,
  onNavigateToCalendar,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameText, setEditNameText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOutfitModal, setSelectedOutfitModal] = useState<Outfit | null>(null);

  const filteredOutfits = savedOutfits.filter((outfit) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      outfit.name.toLowerCase().includes(q) ||
      outfit.occasion.toLowerCase().includes(q) ||
      outfit.style.toLowerCase().includes(q) ||
      outfit.items.some((i) => i.name.toLowerCase().includes(q) || i.color.toLowerCase().includes(q))
    );
  });

  const handleStartRename = (outfit: Outfit) => {
    setEditingId(outfit.id);
    setEditNameText(outfit.name);
  };

  const handleSaveRename = (id: string) => {
    if (editNameText.trim()) {
      onRenameSavedOutfit(id, editNameText.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-[#E07A5F] uppercase">
              Curated Wardrobe Looks
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            <span className="text-xs text-stone-500 font-medium">
              {savedOutfits.length} saved outfits
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Saved Outfits
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Your personal collection of winning combinations to wear through the week.
          </p>
        </div>

        <button
          onClick={onNavigateToJuggle}
          className="self-start sm:self-center px-5 py-3 rounded-2xl bg-[#18181B] hover:bg-[#2A2B2E] text-white text-sm font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Shuffle className="w-4 h-4 text-rose-300" />
          <span>Juggle New Outfit</span>
        </button>
      </div>

      {/* Calendar Planning Banner */}
      {savedOutfits.length > 0 && onNavigateToCalendar && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#FDF0ED] via-white to-rose-50/50 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E07A5F] text-white flex items-center justify-center shadow-xs shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base">
                Plan What You Wear Ahead of Time
              </h3>
              <p className="text-xs text-stone-600">
                Schedule your favorite saved looks onto specific dates, track worn items, and dress effortlessly.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToCalendar}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-[#18181B] hover:bg-[#2A2B2E] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Calendar className="w-3.5 h-3.5 text-rose-300" />
            <span>Open Outfit Calendar →</span>
          </button>
        </div>
      )}

      {/* Search Bar */}
      {savedOutfits.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved outfits by name, occasion, color..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/20"
          />
        </div>
      )}

      {/* Grid of Saved Outfits */}
      {filteredOutfits.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              No saved outfits found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Whenever you juggle a combination you love, click "❤️ Save Outfit" to bookmark it for
              easy morning dressing.
            </p>
          </div>
          <button
            onClick={onNavigateToJuggle}
            className="mt-2 px-6 py-3 rounded-2xl bg-[#18181B] text-white text-xs font-semibold cursor-pointer"
          >
            Start Juggling Outfits
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOutfits.map((outfit) => (
            <div
              key={outfit.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Header with Title & Rename */}
              <div className="p-5 border-b border-stone-100 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200/60">
                      {outfit.occasion}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Score: {outfit.matchScore}%
                    </span>
                  </div>

                  {editingId === outfit.id ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="text"
                        value={editNameText}
                        onChange={(e) => setEditNameText(e.target.value)}
                        className="px-2.5 py-1 text-sm rounded-lg border border-stone-300 font-bold focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveRename(outfit.id)}
                        className="p-1.5 rounded-lg bg-[#18181B] text-white"
                        title="Save name"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3
                        onClick={() => setSelectedOutfitModal(outfit)}
                        className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#E07A5F] transition-colors cursor-pointer"
                      >
                        {outfit.name}
                      </h3>
                      <button
                        onClick={() => handleStartRename(outfit)}
                        className="text-stone-400 hover:text-stone-700 p-1"
                        title="Rename outfit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onDeleteSavedOutfit(outfit.id)}
                  className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete saved outfit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* 4-Item Mini Collage */}
              <div
                onClick={() => setSelectedOutfitModal(outfit)}
                className="p-4 cursor-pointer bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="grid grid-cols-2 gap-2 aspect-4/3 rounded-2xl overflow-hidden bg-white p-2 border border-stone-200">
                  {outfit.items.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="relative rounded-xl overflow-hidden bg-stone-100 aspect-square"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded-md font-medium truncate max-w-[80%]">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-stone-500 mt-2 truncate">
                  {outfit.items.map((i) => i.name).join(' • ')}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold">
                <button
                  onClick={() => setSelectedOutfitModal(outfit)}
                  className="text-stone-700 hover:text-stone-900 cursor-pointer"
                >
                  View Outfit →
                </button>

                <div className="flex items-center gap-1">
                  {onScheduleOutfit && (
                    <button
                      onClick={() => onScheduleOutfit(outfit)}
                      className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Schedule on Calendar"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#E07A5F]" />
                      <span>Schedule</span>
                    </button>
                  )}

                  <button
                    onClick={() => onShareOutfit(outfit)}
                    className="p-2 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                    title="Share outfit"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onPostOnline(outfit)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Post to Community Feed"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span>Post Online</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedOutfitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#E07A5F] uppercase">
                  {selectedOutfitModal.occasion} • {selectedOutfitModal.style}
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  {selectedOutfitModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOutfitModal(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {selectedOutfitModal.items.map((i) => (
                <div key={i.id} className="rounded-2xl overflow-hidden border border-stone-200">
                  <div className="aspect-square bg-stone-100">
                    <img src={i.imageUrl} alt={i.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 text-center bg-white">
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">
                      {i.category}
                    </span>
                    <span className="text-xs font-semibold text-stone-900 line-clamp-1 block">
                      {i.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {selectedOutfitModal.stylistNote && (
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-xs text-stone-700 italic">
                “{selectedOutfitModal.stylistNote}”
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              {onScheduleOutfit && (
                <button
                  onClick={() => {
                    onScheduleOutfit(selectedOutfitModal);
                    setSelectedOutfitModal(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Schedule for Date</span>
                </button>
              )}

              <button
                onClick={() => {
                  onPostOnline(selectedOutfitModal);
                  setSelectedOutfitModal(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#18181B] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-rose-300" />
                <span>Post Online to Community</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
