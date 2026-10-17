import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  CloudSun,
  X,
  Check,
  ChevronRight,
  Sun,
  CloudRain,
  Snowflake,
  Heart,
  Plus,
} from 'lucide-react';
import { Occasion, Outfit, WeatherVibe } from '../types/fashion';
import { formatDateKey } from '../data/sampleScheduledOutfits';
import confetti from 'canvas-confetti';

interface ScheduleOutfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedOutfits: Outfit[];
  initialOutfit?: Outfit | null;
  initialDate?: string;
  onConfirmSchedule: (
    outfit: Outfit,
    date: string,
    options: {
      notes?: string;
      occasion?: Occasion;
      weatherVibe?: WeatherVibe;
      timeOfDay?: 'Morning' | 'Afternoon' | 'Evening' | 'All Day';
    }
  ) => void;
  onNavigateToJuggle: () => void;
}

export const ScheduleOutfitModal: React.FC<ScheduleOutfitModalProps> = ({
  isOpen,
  onClose,
  savedOutfits,
  initialOutfit,
  initialDate,
  onConfirmSchedule,
  onNavigateToJuggle,
}) => {
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(
    initialOutfit || savedOutfits[0] || null
  );
  const [isChangingOutfit, setIsChangingOutfit] = useState(!initialOutfit && savedOutfits.length > 1);

  const todayStr = formatDateKey(new Date());
  const [date, setDate] = useState<string>(initialDate || todayStr);

  const [occasion, setOccasion] = useState<Occasion>(
    selectedOutfit?.occasion || 'Casual'
  );
  const [weatherVibe, setWeatherVibe] = useState<WeatherVibe>(
    selectedOutfit?.weatherFit || 'Mild'
  );
  const [timeOfDay, setTimeOfDay] = useState<'Morning' | 'Afternoon' | 'Evening' | 'All Day'>(
    'Morning'
  );
  const [notes, setNotes] = useState('');

  // Update selected outfit when initialOutfit changes
  React.useEffect(() => {
    if (initialOutfit) {
      setSelectedOutfit(initialOutfit);
      setOccasion(initialOutfit.occasion);
      if (initialOutfit.weatherFit) {
        setWeatherVibe(initialOutfit.weatherFit);
      }
      setIsChangingOutfit(false);
    } else if (savedOutfits.length > 0 && !selectedOutfit) {
      setSelectedOutfit(savedOutfits[0]);
    }
  }, [initialOutfit, savedOutfits]);

  React.useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);

  if (!isOpen) return null;

  const handleSelectShortcut = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setDate(formatDateKey(d));
  };

  const handleSelectUpcomingDay = (targetDayOfWeek: number) => {
    const d = new Date();
    const current = d.getDay();
    const diff = (targetDayOfWeek - current + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    setDate(formatDateKey(d));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOutfit) return;

    onConfirmSchedule(selectedOutfit, date, {
      notes: notes.trim() || undefined,
      occasion,
      weatherVibe,
      timeOfDay,
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E07A5F', '#D4A373', '#F28482', '#18181B'],
      });
    } catch (_) {}

    onClose();
  };

  const weatherOptions: { vibe: WeatherVibe; label: string; icon: any; color: string }[] = [
    { vibe: 'Sunny', label: 'Sunny (Warm)', icon: Sun, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { vibe: 'Mild', label: 'Mild (Comfortable)', icon: CloudSun, color: 'text-orange-500 bg-orange-50 border-orange-200' },
    { vibe: 'Chilly', label: 'Chilly (Layered)', icon: Snowflake, color: 'text-sky-500 bg-sky-50 border-sky-200' },
    { vibe: 'Rainy', label: 'Rainy (Drizzle)', icon: CloudRain, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
  ];

  const occasionOptions: Occasion[] = [
    'School',
    'Party',
    'Date',
    'Beach',
    'Casual',
    'Work',
    'Wedding',
    'Sport',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-[#FAF8F5] border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-stone-200 text-[#E07A5F] flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Plan Outfit for Date
              </h3>
              <p className="text-xs text-stone-500">
                Schedule this look in your wardrobe planner calendar.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Chosen Outfit Preview & Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                1. Select Outfit
              </label>
              {savedOutfits.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsChangingOutfit(!isChangingOutfit)}
                  className="text-xs font-semibold text-[#E07A5F] hover:underline cursor-pointer"
                >
                  {isChangingOutfit ? 'Close list' : 'Choose another saved look'}
                </button>
              )}
            </div>

            {/* Saved Outfits Drawer/List if choosing */}
            {isChangingOutfit ? (
              <div className="max-h-56 overflow-y-auto space-y-2.5 p-2 bg-[#FAF8F5] rounded-2xl border border-stone-200">
                {savedOutfits.map((outfit) => (
                  <div
                    key={outfit.id}
                    onClick={() => {
                      setSelectedOutfit(outfit);
                      setOccasion(outfit.occasion);
                      if (outfit.weatherFit) setWeatherVibe(outfit.weatherFit);
                      setIsChangingOutfit(false);
                    }}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedOutfit?.id === outfit.id
                        ? 'bg-white border-[#E07A5F] shadow-xs'
                        : 'bg-white/80 border-stone-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex -space-x-2">
                      {outfit.items.slice(0, 3).map((item) => (
                        <img
                          key={item.id}
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-2xs"
                        />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-stone-900 truncate">{outfit.name}</div>
                      <div className="text-[10px] text-stone-500">
                        {outfit.occasion} · {outfit.matchScore}% Match
                      </div>
                    </div>
                    {selectedOutfit?.id === outfit.id && (
                      <Check className="w-4 h-4 text-[#E07A5F]" />
                    )}
                  </div>
                ))}
              </div>
            ) : selectedOutfit ? (
              <div className="p-3.5 rounded-2xl border border-stone-200 bg-[#FAF8F5] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex -space-x-2 shrink-0">
                    {selectedOutfit.items.slice(0, 4).map((item) => (
                      <img
                        key={item.id}
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs"
                      />
                    ))}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-stone-900 text-sm truncate">
                      {selectedOutfit.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">
                      {selectedOutfit.items.map((i) => i.name).join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#E07A5F] bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                    {selectedOutfit.matchScore}% Match
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-[#FAF8F5]">
                <Heart className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs text-stone-600 font-medium">
                  You haven't saved any outfits yet!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToJuggle();
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#18181B] text-white text-xs font-semibold"
                >
                  Juggle & Save an Outfit First
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Date Picker & Shortcuts */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
              2. Target Date
            </label>

            {/* Quick shortcuts */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                type="button"
                onClick={() => handleSelectShortcut(0)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  date === todayStr
                    ? 'bg-[#18181B] text-white border-[#18181B]'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleSelectShortcut(1)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handleSelectUpcomingDay(5)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
              >
                This Friday
              </button>
              <button
                type="button"
                onClick={() => handleSelectUpcomingDay(6)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
              >
                This Saturday
              </button>
              <button
                type="button"
                onClick={() => handleSelectUpcomingDay(1)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
              >
                Next Monday
              </button>
            </div>

            <div className="relative">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/20"
              />
            </div>
          </div>

          {/* Section 3: Occasion & Time of Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                Occasion
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value as Occasion)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/20"
              >
                {occasionOptions.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                Time of Day
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Morning', 'Afternoon', 'Evening', 'All Day'] as const).map((tod) => (
                  <button
                    key={tod}
                    type="button"
                    onClick={() => setTimeOfDay(tod)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                      timeOfDay === tod
                        ? 'bg-[#18181B] text-white border-[#18181B]'
                        : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    {tod}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Expected Weather Vibe */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
              Expected Weather
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {weatherOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = weatherVibe === opt.vibe;
                return (
                  <button
                    key={opt.vibe}
                    type="button"
                    onClick={() => setWeatherVibe(opt.vibe)}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? `${opt.color} ring-2 ring-stone-900 font-bold`
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-medium">{opt.vibe}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Styling Note or Event */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
              Event Note or Styling Goal (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Dinner with Sarah, Client Pitch, Gallery walk..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 text-xs rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/20"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedOutfit}
              className="px-6 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#2A2B2E] text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-rose-300" />
              <span>Schedule Look to Calendar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
