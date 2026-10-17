import React, { useState } from 'react';
import { X, Check, ArrowRight, RefreshCw, Shirt } from 'lucide-react';
import { ClothingCategory, ClothingItem, Outfit } from '../types/fashion';

interface EditOutfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: Outfit | null;
  wardrobe: ClothingItem[];
  onSaveOutfitChanges: (updatedOutfit: Outfit) => void;
}

export const EditOutfitModal: React.FC<EditOutfitModalProps> = ({
  isOpen,
  onClose,
  outfit,
  wardrobe,
  onSaveOutfitChanges,
}) => {
  if (!isOpen || !outfit) return null;

  const [activeItems, setActiveItems] = useState<ClothingItem[]>([...outfit.items]);
  const [selectedSlotCategory, setSelectedSlotCategory] = useState<ClothingCategory>(
    outfit.items[0]?.category || 'tops'
  );

  const currentSlotItem = activeItems.find((i) => i.category === selectedSlotCategory);

  // Available replacements in this category from user's wardrobe
  const availableOptions = wardrobe.filter(
    (item) => item.category === selectedSlotCategory
  );

  const handleSelectReplacement = (newItem: ClothingItem) => {
    const updated = activeItems.map((item) =>
      item.category === selectedSlotCategory ? newItem : item
    );
    // If the category was not yet present in activeItems, append it
    if (!activeItems.some((i) => i.category === selectedSlotCategory)) {
      updated.push(newItem);
    }
    setActiveItems(updated);
  };

  const handleApplyChanges = () => {
    const updatedOutfit: Outfit = {
      ...outfit,
      items: activeItems,
      colorPalette: Array.from(new Set(activeItems.map((i) => i.color))),
      name: `${outfit.name} (Customized)`,
    };
    onSaveOutfitChanges(updatedOutfit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-[#FAF8F5]">
          <div>
            <span className="text-[11px] font-bold text-[#E07A5F] uppercase tracking-wider">
              Outfit Customizer
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Swap Items in {outfit.name}
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
          {/* Current Outfit Slots Bar */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Select a piece to swap:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {activeItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedSlotCategory(item.category)}
                  className={`p-2 rounded-2xl border text-left flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    selectedSlotCategory === item.category
                      ? 'border-[#18181B] bg-stone-50 ring-2 ring-[#E07A5F]/40 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center w-full">
                    <span className="text-[10px] font-bold text-[#E07A5F] uppercase block">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-stone-900 truncate block">
                      {item.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Available Swap Options from Wardrobe */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Available {selectedSlotCategory} in your wardrobe:
              </span>
              <span className="text-xs text-stone-500">
                {availableOptions.length} pieces available
              </span>
            </div>

            {availableOptions.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200">
                <p className="text-xs text-stone-500">
                  You don't have other {selectedSlotCategory} in your wardrobe.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
                {availableOptions.map((opt) => {
                  const isCurrent = activeItems.some((i) => i.id === opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectReplacement(opt)}
                      className={`p-2.5 rounded-2xl border text-left relative transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/30'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 mb-2">
                        <img
                          src={opt.imageUrl}
                          alt={opt.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-semibold text-stone-900 line-clamp-1 block">
                        {opt.name}
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        {opt.color} • {opt.style}
                      </span>

                      {isCurrent && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyChanges}
              className="px-6 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#2A2B2E] text-white text-sm font-semibold shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Save Customized Outfit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
