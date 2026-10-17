import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Shirt,
  Sparkles,
  Shuffle,
  Heart,
  Tag,
  RefreshCw,
} from 'lucide-react';
import {
  ClothingCategory,
  ClothingColor,
  ClothingItem,
  ClothingStyle,
} from '../types/fashion';
import { CATEGORIES_CONFIG, COLOR_PALETTES } from '../utils/fashionRules';

interface WardrobePageProps {
  wardrobe: ClothingItem[];
  onAddNewItem: () => void;
  onEditItem: (item: ClothingItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onNavigateToJuggle: () => void;
  onResetToSample: () => void;
}

export const WardrobePage: React.FC<WardrobePageProps> = ({
  wardrobe,
  onAddNewItem,
  onEditItem,
  onDeleteItem,
  onToggleFavorite,
  onNavigateToJuggle,
  onResetToSample,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [itemToDelete, setItemToDelete] = useState<ClothingItem | null>(null);

  // Filter items
  const filteredItems = wardrobe.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedColor !== 'all' && item.color !== selectedColor) return false;
    if (selectedStyle !== 'all' && item.style !== selectedStyle) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchColor = item.color.toLowerCase().includes(q);
      const matchStyle = item.style.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchColor && !matchStyle && !matchCategory && !matchTags) return false;
    }
    return true;
  });

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return wardrobe.length;
    return wardrobe.filter((i) => i.category === catId).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-[#E07A5F] uppercase">
              Digital Wardrobe Vault
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            <span className="text-xs text-stone-500 font-medium">{wardrobe.length} total items</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            My Clothes
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Everything you own, organized cleanly for our AI and human styling team to mix & match.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToJuggle}
            className="px-5 py-3 rounded-2xl bg-[#18181B] hover:bg-[#2A2B2E] text-white text-sm font-semibold shadow-md transition-all flex items-center gap-2 group cursor-pointer"
          >
            <Shuffle className="w-4 h-4 text-rose-300 group-hover:rotate-180 transition-transform duration-500" />
            <span>Juggle Outfits</span>
          </button>

          <button
            onClick={onAddNewItem}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-rose-50/60 text-[#18181B] text-sm font-semibold border-2 border-stone-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E07A5F]" />
            <span>Add Clothing Item</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#18181B] text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            All Items ({wardrobe.length})
          </button>

          {CATEGORIES_CONFIG.map((cat) => {
            const count = getCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#18181B] text-white font-semibold shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search & Extra Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, color, style (e.g. pink, tailored, sneakers)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Color Filter */}
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white text-stone-700 focus:outline-none"
            >
              <option value="all">All Colours</option>
              {COLOR_PALETTES.map((p) => (
                <option key={p.color} value={p.color}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Style Filter */}
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white text-stone-700 focus:outline-none"
            >
              <option value="all">All Styles</option>
              <option value="Casual">Casual</option>
              <option value="Chic">Chic</option>
              <option value="Streetwear">Streetwear</option>
              <option value="Minimalist">Minimalist</option>
              <option value="Romantic">Romantic</option>
              <option value="Boho">Boho</option>
              <option value="Preppy">Preppy</option>
              <option value="Formal">Formal</option>
              <option value="Sporty">Sporty</option>
            </select>

            {(selectedCategory !== 'all' ||
              selectedColor !== 'all' ||
              selectedStyle !== 'all' ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedColor('all');
                  setSelectedStyle('all');
                  setSearchQuery('');
                }}
                className="text-xs text-rose-700 hover:underline px-2 whitespace-nowrap cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-[#E07A5F] flex items-center justify-center mx-auto">
            <Shirt className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              No matching clothes found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your search filters, add a new piece to your closet, or reset to our
              curated sample wardrobe.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onAddNewItem}
              className="px-5 py-2.5 rounded-xl bg-[#18181B] text-white text-xs font-semibold cursor-pointer"
            >
              + Add New Item
            </button>
            <button
              onClick={onResetToSample}
              className="px-5 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Sample Wardrobe</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Image & Badges Container */}
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-stone-800 border border-stone-200 shadow-2xs">
                    {CATEGORIES_CONFIG.find((c) => c.id === item.category)?.emoji} {item.category}
                  </span>
                </div>

                {/* Favorite Heart Button */}
                <button
                  onClick={() => onToggleFavorite(item.id)}
                  title="Favorite"
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 hover:text-rose-500 transition-colors shadow-2xs"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      item.favorite ? 'text-rose-500 fill-rose-500' : 'text-stone-400'
                    }`}
                  />
                </button>

                {/* Color Dot indicator */}
                <div
                  className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium"
                >
                  <span
                    className="w-2 h-2 rounded-full border border-white/50"
                    style={{ backgroundColor: item.colorHex || '#FFFFFF' }}
                  />
                  <span>{item.color}</span>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                    <span className="font-semibold text-[#E07A5F]">{item.style}</span>
                    <span>{item.season || 'All Season'}</span>
                  </div>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 line-clamp-1 group-hover:text-[#E07A5F] transition-colors">
                    {item.name}
                  </h3>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => onEditItem(item)}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-stone-50 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-stone-400" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setItemToDelete(item)}
                    className="text-xs font-semibold text-stone-400 hover:text-rose-600 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-rose-50 cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="font-serif text-lg font-bold text-stone-900">Delete this item?</h3>
            <p className="text-xs text-stone-600">
              Are you sure you want to remove <span className="font-bold">"{itemToDelete.name}"</span>{' '}
              from your wardrobe? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteItem(itemToDelete.id);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
