import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  ClothingCategory,
  ClothingColor,
  ClothingItem,
  ClothingStyle,
} from '../types/fashion';
import { CATEGORIES_CONFIG, COLOR_PALETTES } from '../utils/fashionRules';
import { requestAnalyzeImage } from '../services/geminiService';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ClothingItem, 'id' | 'createdAt'>, editingId?: string) => void;
  editingItem?: ClothingItem | null;
}

const STYLES_LIST: ClothingStyle[] = [
  'Casual',
  'Chic',
  'Streetwear',
  'Minimalist',
  'Boho',
  'Sporty',
  'Preppy',
  'Formal',
  'Vintage',
  'Romantic',
];

// Presets for rapid testing if user doesn't have a photo on hand
const SAMPLE_PRESETS: { name: string; category: ClothingCategory; color: ClothingColor; style: ClothingStyle; imageUrl: string }[] = [
  {
    name: 'Lilac Cashmere Crewneck',
    category: 'tops',
    color: 'Purple',
    style: 'Chic',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Ecru Denim Carpenter Jeans',
    category: 'trousers',
    color: 'Cream',
    style: 'Streetwear',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Terracotta Linen Sundress',
    category: 'dresses',
    color: 'Red',
    style: 'Boho',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Burgundy Penny Loafers',
    category: 'shoes',
    color: 'Brown',
    style: 'Preppy',
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Chocolate Suede Slouchy Tote',
    category: 'bags',
    color: 'Brown',
    style: 'Minimalist',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80',
  },
];

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('tops');
  const [color, setColor] = useState<ClothingColor>('White');
  const [style, setStyle] = useState<ClothingStyle>('Casual');
  const [season, setSeason] = useState<'All' | 'Warm' | 'Cool'>('All');
  const [imageUrl, setImageUrl] = useState('');
  const [analyzingWithAI, setAnalyzingWithAI] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCategory(editingItem.category);
      setColor(editingItem.color);
      setStyle(editingItem.style);
      setSeason(editingItem.season || 'All');
      setImageUrl(editingItem.imageUrl);
    } else {
      setName('');
      setCategory('tops');
      setColor('Pink');
      setStyle('Chic');
      setSeason('All');
      setImageUrl('');
    }
    setValidationError('');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setValidationError('Image size should be under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      setImageUrl(result);

      // Trigger AI Auto-Analysis for comfort
      tryAutoAnalyze(result, file.type);
    };
    reader.readAsDataURL(file);
  };

  const tryAutoAnalyze = async (base64Image: string, mimeType: string) => {
    setAnalyzingWithAI(true);
    try {
      const detected = await requestAnalyzeImage(base64Image, mimeType);
      if (detected) {
        if (detected.name && !name) setName(detected.name);
        if (detected.category) setCategory(detected.category as ClothingCategory);
        if (detected.color) setColor(detected.color as ClothingColor);
        if (detected.style) setStyle(detected.style as ClothingStyle);
      }
    } finally {
      setAnalyzingWithAI(false);
    }
  };

  const applyPreset = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    setName(preset.name);
    setCategory(preset.category);
    setColor(preset.color);
    setStyle(preset.style);
    setImageUrl(preset.imageUrl);
    setValidationError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Please enter a name for this clothing item.');
      return;
    }
    if (!imageUrl.trim()) {
      setValidationError('Please upload a photo or pick a sample preset.');
      return;
    }

    const colorHex = COLOR_PALETTES.find((c) => c.color === color)?.hex || '#FFFFFF';

    onSave(
      {
        name: name.trim(),
        category,
        color,
        colorHex,
        style,
        season,
        imageUrl,
        tags: [color.toLowerCase(), category.toLowerCase(), style.toLowerCase()],
      },
      editingItem ? editingItem.id : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-[#FAF8F5]">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-[#E07A5F] uppercase">
              Digital Wardrobe
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              {editingItem ? 'Edit Clothing Item' : 'Add New Clothing Item'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Photo Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-700 tracking-wide uppercase">
              Item Photograph <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              {/* Image Preview Box */}
              <div className="sm:col-span-5 aspect-square rounded-2xl border-2 border-dashed border-stone-300 relative bg-stone-50 flex flex-col items-center justify-center overflow-hidden group">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-rose-50 text-[#E07A5F] flex items-center justify-center mx-auto">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-stone-500 block">No photo added</span>
                  </div>
                )}

                {analyzingWithAI && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2 p-3 text-center">
                    <Sparkles className="w-6 h-6 text-[#E07A5F] animate-spin" />
                    <span className="text-xs font-semibold text-stone-800">
                      AI is auto-detecting details...
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Controls & Presets */}
              <div className="sm:col-span-7 space-y-3">
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-stone-800 text-xs font-semibold cursor-pointer hover:bg-stone-50 transition-all shadow-2xs">
                  <Upload className="w-4 h-4 text-[#E07A5F]" />
                  <span>Upload from device or camera</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Preset Fast Picker */}
                <div>
                  <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                    Or pick a curated high-fashion sample:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className="px-2.5 py-1 text-[11px] rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct URL input fallback */}
                <div>
                  <input
                    type="url"
                    placeholder="Or paste an image web URL..."
                    value={imageUrl.startsWith('data:') ? '' : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Item Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700 tracking-wide uppercase">
              Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Soft Pink Ribbed Knit Top"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:border-[#E07A5F] focus:ring-2 focus:ring-[#E07A5F]/20 outline-none transition-all"
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 tracking-wide uppercase">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES_CONFIG.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    category === cat.id
                      ? 'border-[#18181B] bg-[#18181B] text-white shadow-sm'
                      : 'border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color & Style Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Color Swatch Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 tracking-wide uppercase">
                Colour: <span className="font-semibold text-stone-900">{color}</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 border border-stone-100 rounded-xl bg-stone-50/50">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    type="button"
                    key={palette.name}
                    onClick={() => setColor(palette.color)}
                    title={palette.name}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                      color === palette.color
                        ? 'ring-2 ring-[#E07A5F] scale-110 shadow-sm'
                        : 'border-stone-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: palette.hex }}
                  >
                    {color === palette.color && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          palette.color === 'White' ||
                          palette.color === 'Cream' ||
                          palette.color === 'Yellow'
                            ? 'text-stone-900'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 tracking-wide uppercase">
                Style / Aesthetic
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as ClothingStyle)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-300 bg-white text-stone-800 focus:border-[#E07A5F] outline-none"
              >
                {STYLES_LIST.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <div className="pt-2">
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                  Season Suitability
                </label>
                <div className="flex gap-2">
                  {(['All', 'Warm', 'Cool'] as const).map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSeason(s)}
                      className={`flex-1 py-1 text-xs rounded-lg border font-medium transition-colors ${
                        season === s
                          ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#2A2B2E] text-white text-sm font-semibold shadow-md shadow-black/15 transition-all cursor-pointer"
            >
              {editingItem ? 'Save Changes' : 'Add to Wardrobe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
