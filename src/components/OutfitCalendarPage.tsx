import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Plus,
  Share2,
  Trash2,
  Edit2,
  Globe,
  Sun,
  CloudSun,
  Snowflake,
  CloudRain,
  Heart,
  Shuffle,
  Copy,
  CalendarCheck,
  Flame,
  Shirt,
  X,
  ExternalLink,
} from 'lucide-react';
import { Occasion, Outfit, ScheduledOutfit, WeatherVibe } from '../types/fashion';
import { formatDateKey } from '../data/sampleScheduledOutfits';
import confetti from 'canvas-confetti';

interface OutfitCalendarPageProps {
  scheduledOutfits: ScheduledOutfit[];
  savedOutfits: Outfit[];
  onOpenScheduleModal: (outfit?: Outfit, targetDate?: string) => void;
  onRemoveScheduledOutfit: (id: string) => void;
  onToggleScheduledWorn: (id: string) => void;
  onUpdateScheduledOutfit: (id: string, updates: Partial<ScheduledOutfit>) => void;
  onNavigateToJuggle: () => void;
  onShareOutfit: (outfit: Outfit) => void;
  onPostOnline: (outfit: Outfit) => void;
  showToast: (msg: string) => void;
}

type CalendarViewMode = 'week' | 'month' | 'agenda';

export const OutfitCalendarPage: React.FC<OutfitCalendarPageProps> = ({
  scheduledOutfits,
  savedOutfits,
  onOpenScheduleModal,
  onRemoveScheduledOutfit,
  onToggleScheduledWorn,
  onUpdateScheduledOutfit,
  onNavigateToJuggle,
  onShareOutfit,
  onPostOnline,
  showToast,
}) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayDetailDate, setSelectedDayDetailDate] = useState<string | null>(null);
  const [activeOutfitDetail, setActiveOutfitDetail] = useState<ScheduledOutfit | null>(null);
  const [agendaFilter, setAgendaFilter] = useState<'all' | 'upcoming' | 'worn'>('all');

  const todayKey = formatDateKey(new Date());

  // ----------------------------------------------------
  // Date Navigation Helpers
  // ----------------------------------------------------
  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') {
      next.setMonth(next.getMonth() - 1);
    } else {
      next.setDate(next.getDate() - 7);
    }
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') {
      next.setMonth(next.getMonth() + 1);
    } else {
      next.setDate(next.getDate() + 7);
    }
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // ----------------------------------------------------
  // Week calculations (Monday to Sunday)
  // ----------------------------------------------------
  const getWeekDates = (baseDate: Date): Date[] => {
    const d = new Date(baseDate);
    const day = d.getDay();
    // In JS: 0=Sun, 1=Mon, ..., 6=Sat
    // We want Monday as day 0 of the week
    const diff = (day === 0 ? -6 : 1) - day;
    d.setDate(d.getDate() + diff);

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(d);
      dayDate.setDate(d.getDate() + i);
      week.push(dayDate);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);

  // ----------------------------------------------------
  // Month calculations (Standard 35 or 42 grid cells)
  // ----------------------------------------------------
  const getMonthDays = (baseDate: Date): { date: Date; isCurrentMonth: boolean; key: string }[] => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDay.getDay(); // 0 is Sun
    const startOffset = (firstDayOfWeek === 0 ? -6 : 1) - firstDayOfWeek; // Monday start

    const startDate = new Date(year, month, 1 + startOffset);

    const days: { date: Date; isCurrentMonth: boolean; key: string }[] = [];
    for (let i = 0; i < 35; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push({
        date: d,
        isCurrentMonth: d.getMonth() === month,
        key: formatDateKey(d),
      });
    }

    // If lastDay is still not included, add another row of 7
    if (days[days.length - 1].date < lastDay) {
      for (let i = 35; i < 42; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        days.push({
          date: d,
          isCurrentMonth: d.getMonth() === month,
          key: formatDateKey(d),
        });
      }
    }

    return days;
  };

  const monthGridDays = getMonthDays(currentDate);

  // Group scheduled by date
  const scheduledByDate = scheduledOutfits.reduce<Record<string, ScheduledOutfit[]>>((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);
    return acc;
  }, {});

  // Copy Week Itinerary
  const handleCopyWeekPlan = () => {
    const lines = [`✨ OUTFIT JUGGLE · WEEKLY WARDROBE PLAN ✨`];
    weekDates.forEach((d) => {
      const key = formatDateKey(d);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const looks = scheduledByDate[key] || [];
      if (looks.length > 0) {
        looks.forEach((l) => {
          lines.push(`• ${dayName}: "${l.outfit.name}" (${l.occasion}) [${l.isWorn ? 'Worn ✓' : 'Planned'}]`);
          lines.push(`  Pieces: ${l.outfit.items.map((i) => i.name).join(' + ')}`);
          if (l.notes) lines.push(`  Note: ${l.notes}`);
        });
      } else {
        lines.push(`• ${dayName}: No outfit scheduled yet`);
      }
    });

    const text = lines.join('\n');
    navigator.clipboard?.writeText(text);
    showToast('Weekly outfit itinerary copied to clipboard!');
  };

  const handleToggleWornWithEffect = (id: string) => {
    onToggleScheduledWorn(id);
    const item = scheduledOutfits.find((s) => s.id === id);
    if (item && !item.isWorn) {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#E07A5F', '#10B981', '#18181B'],
        });
      } catch (_) {}
      showToast('Marked as worn today! Closet stats updated.');
    } else {
      showToast('Outfit reset to planned.');
    }
  };

  // Weather icons
  const getWeatherIcon = (vibe?: WeatherVibe) => {
    switch (vibe) {
      case 'Sunny':
        return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'Mild':
        return <CloudSun className="w-3.5 h-3.5 text-orange-400" />;
      case 'Chilly':
        return <Snowflake className="w-3.5 h-3.5 text-sky-500" />;
      case 'Rainy':
        return <CloudRain className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <CloudSun className="w-3.5 h-3.5 text-stone-400" />;
    }
  };

  // Statistics
  const totalScheduled = scheduledOutfits.length;
  const totalWorn = scheduledOutfits.filter((s) => s.isWorn).length;
  const upcomingThisWeek = weekDates.reduce((count, d) => {
    const key = formatDateKey(d);
    return count + (scheduledByDate[key]?.length || 0);
  }, 0);

  // Month title format
  const monthTitle = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-[#E07A5F] uppercase flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4" />
              Wardrobe Schedule & Runway
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            <span className="text-xs text-stone-500 font-medium">
              {upcomingThisWeek} looks planned this week
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Outfit Planning Calendar
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Schedule outfits from your saved wardrobe for upcoming dates, track what you wear each day, and make getting dressed in the morning effortless.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyWeekPlan}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Copy weekly outfit itinerary"
          >
            <Copy className="w-3.5 h-3.5 text-stone-500" />
            <span>Copy Week Plan</span>
          </button>

          <button
            onClick={() => onOpenScheduleModal()}
            className="px-5 py-2.5 rounded-2xl bg-[#18181B] hover:bg-[#2A2B2E] text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-rose-300" />
            <span>+ Schedule Outfit</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Upcoming This Week
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-serif font-bold text-stone-900">{upcomingThisWeek}</span>
            <span className="text-xs text-stone-500">looks</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Scheduled
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-serif font-bold text-stone-900">{totalScheduled}</span>
            <span className="text-xs text-stone-500">outfits</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Worn Outfits
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-serif font-bold text-emerald-700">{totalWorn}</span>
            <span className="text-xs text-emerald-600 font-medium">completed</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Saved Outfits Ready
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-serif font-bold text-[#E07A5F]">{savedOutfits.length}</span>
            <span className="text-xs text-stone-500">in closet</span>
          </div>
        </div>
      </div>

      {/* Calendar Controls & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-stone-200 shadow-2xs">
        {/* Month/Week Navigation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-50 rounded-2xl border border-stone-200 p-1">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl hover:bg-white text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-xl hover:bg-white text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl hover:bg-white text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 ml-2">
            {monthTitle}
          </h2>
        </div>

        {/* View Switcher: Week vs Month vs Agenda */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 self-start sm:self-center">
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'week'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Weekly Runway
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'month'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Month Grid
          </button>
          <button
            onClick={() => setViewMode('agenda')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'agenda'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Itinerary List
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: WEEKLY RUNWAY (Visual day-by-day planner) */}
      {viewMode === 'week' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDates.map((dayDate) => {
              const dayKey = formatDateKey(dayDate);
              const isToday = dayKey === todayKey;
              const scheduledForDay = scheduledByDate[dayKey] || [];
              const dayOfWeek = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNumber = dayDate.getDate();

              return (
                <div
                  key={dayKey}
                  className={`rounded-3xl border transition-all flex flex-col justify-between overflow-hidden min-h-[380px] ${
                    isToday
                      ? 'bg-white border-[#E07A5F] ring-2 ring-[#E07A5F]/20 shadow-md'
                      : 'bg-white border-stone-200/90 shadow-2xs hover:border-stone-300'
                  }`}
                >
                  {/* Day Header */}
                  <div
                    className={`p-3.5 border-b flex items-center justify-between ${
                      isToday
                        ? 'bg-[#FDF0ED] border-rose-100'
                        : 'bg-stone-50/70 border-stone-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold uppercase tracking-wide ${
                            isToday ? 'text-[#D05353]' : 'text-stone-600'
                          }`}
                        >
                          {dayOfWeek}
                        </span>
                        {isToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] animate-pulse" />
                        )}
                      </div>
                      <span className="font-serif text-lg font-bold text-stone-900 block leading-tight">
                        {dayNumber}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenScheduleModal(undefined, dayKey)}
                      className="p-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-600 border border-stone-200/80 transition-colors cursor-pointer"
                      title={`Schedule outfit for ${dayOfWeek}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Day Outfits Content */}
                  <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto">
                    {scheduledForDay.length === 0 ? (
                      <div
                        onClick={() => onOpenScheduleModal(undefined, dayKey)}
                        className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-200 rounded-2xl hover:bg-stone-50 transition-colors text-center cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-full bg-stone-100 group-hover:bg-rose-50 text-stone-400 group-hover:text-[#E07A5F] flex items-center justify-center transition-colors mb-2">
                          <Plus className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-stone-600 group-hover:text-stone-900 block">
                          Plan Outfit
                        </span>
                        <span className="text-[10px] text-stone-400 mt-0.5">
                          Tap to select look
                        </span>
                      </div>
                    ) : (
                      scheduledForDay.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                        >
                          {/* Image Collage */}
                          <div
                            onClick={() => setActiveOutfitDetail(item)}
                            className="grid grid-cols-2 gap-1 p-1.5 bg-[#FAF8F5] cursor-pointer"
                          >
                            {item.outfit.items.slice(0, 4).map((piece) => (
                              <div
                                key={piece.id}
                                className="aspect-square rounded-lg overflow-hidden bg-stone-100 relative"
                              >
                                <img
                                  src={piece.imageUrl}
                                  alt={piece.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>

                          {/* Info */}
                          <div className="p-3 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[10px] font-bold text-[#E07A5F] uppercase">
                                  {item.occasion || item.outfit.occasion}
                                </span>
                                <div className="flex items-center gap-1">
                                  {getWeatherIcon(item.weatherVibe)}
                                  <span className="text-[10px] text-stone-400 font-medium">
                                    {item.weatherVibe || 'Mild'}
                                  </span>
                                </div>
                              </div>

                              <h4
                                onClick={() => setActiveOutfitDetail(item)}
                                className="font-serif font-bold text-stone-900 text-xs hover:text-[#E07A5F] transition-colors cursor-pointer line-clamp-1"
                              >
                                {item.outfit.name}
                              </h4>

                              {item.notes && (
                                <p className="text-[10px] text-stone-500 italic mt-0.5 line-clamp-1">
                                  "{item.notes}"
                                </p>
                              )}
                            </div>

                            {/* Worn button & actions */}
                            <div className="pt-2.5 mt-2 border-t border-stone-100 flex items-center justify-between gap-1">
                              <button
                                onClick={() => handleToggleWornWithEffect(item.id)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                  item.isWorn
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                                }`}
                              >
                                <CheckCircle2
                                  className={`w-3 h-3 ${
                                    item.isWorn ? 'text-emerald-600 fill-emerald-100' : 'text-stone-400'
                                  }`}
                                />
                                <span>{item.isWorn ? 'Worn Today' : 'Mark Worn'}</span>
                              </button>

                              <button
                                onClick={() => onRemoveScheduledOutfit(item.id)}
                                className="p-1 rounded-lg text-stone-300 hover:text-rose-600 transition-colors"
                                title="Remove from date"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: MONTH GRID */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-stone-200 bg-[#FAF8F5] text-center text-xs font-bold text-stone-600 py-3">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-stone-100">
            {monthGridDays.map((cell) => {
              const isToday = cell.key === todayKey;
              const looks = scheduledByDate[cell.key] || [];

              return (
                <div
                  key={cell.key}
                  className={`min-h-[120px] p-2 flex flex-col justify-between transition-colors relative group ${
                    !cell.isCurrentMonth
                      ? 'bg-stone-50/50 text-stone-300'
                      : isToday
                      ? 'bg-rose-50/30'
                      : 'hover:bg-stone-50/70'
                  }`}
                >
                  {/* Cell Top Header */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-[#18181B] text-white shadow-xs'
                          : cell.isCurrentMonth
                          ? 'text-stone-800'
                          : 'text-stone-400'
                      }`}
                    >
                      {cell.date.getDate()}
                    </span>

                    <button
                      onClick={() => onOpenScheduleModal(undefined, cell.key)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white text-stone-500 hover:text-stone-900 border border-transparent hover:border-stone-200 transition-all cursor-pointer"
                      title="Schedule look"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Looks Thumbnails in Cell */}
                  <div className="space-y-1.5 overflow-hidden flex-1">
                    {looks.map((look) => (
                      <div
                        key={look.id}
                        onClick={() => setActiveOutfitDetail(look)}
                        className={`p-1.5 rounded-xl border text-[10px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs transition-all ${
                          look.isWorn
                            ? 'bg-emerald-50/90 text-emerald-900 border-emerald-200'
                            : 'bg-white text-stone-800 border-stone-200 hover:border-[#E07A5F]'
                        }`}
                      >
                        <img
                          src={look.outfit.items[0]?.imageUrl}
                          alt={look.outfit.name}
                          className="w-5 h-5 rounded-md object-cover shrink-0"
                        />
                        <span className="truncate flex-1">{look.outfit.name}</span>
                        {look.isWorn && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  {looks.length === 0 && cell.isCurrentMonth && (
                    <div
                      onClick={() => onOpenScheduleModal(undefined, cell.key)}
                      className="h-7 rounded-lg border border-dashed border-transparent group-hover:border-stone-200 flex items-center justify-center cursor-pointer text-[10px] text-stone-400 group-hover:text-stone-600"
                    >
                      <span className="hidden group-hover:inline">+ Add</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: AGENDA LIST */}
      {viewMode === 'agenda' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <span className="text-xs font-bold text-stone-600">Filter:</span>
            {(['all', 'upcoming', 'worn'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setAgendaFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                  agendaFilter === filter
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {scheduledOutfits
            .filter((s) => {
              if (agendaFilter === 'worn') return s.isWorn;
              if (agendaFilter === 'upcoming') return !s.isWorn && s.date >= todayKey;
              return true;
            })
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200 relative">
                    <img
                      src={item.outfit.items[0]?.imageUrl}
                      alt={item.outfit.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded-md">
                      {item.outfit.items.length} pcs
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#E07A5F]">{item.date}</span>
                      <span className="w-1 h-1 rounded-full bg-stone-300" />
                      <span className="text-xs text-stone-500 font-medium">{item.occasion}</span>
                      <span className="w-1 h-1 rounded-full bg-stone-300" />
                      <span className="text-xs text-stone-500 font-medium">{item.timeOfDay || 'Morning'}</span>
                    </div>

                    <h3
                      onClick={() => setActiveOutfitDetail(item)}
                      className="font-serif text-lg font-bold text-stone-900 hover:text-[#E07A5F] transition-colors cursor-pointer"
                    >
                      {item.outfit.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {item.outfit.items.map((i) => i.name).join(' · ')}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-stone-600 italic mt-1 bg-[#FAF8F5] px-2 py-0.5 rounded-md inline-block">
                        Note: {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleWornWithEffect(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      item.isWorn
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${item.isWorn ? 'text-emerald-600' : 'text-stone-400'}`} />
                    <span>{item.isWorn ? 'Worn' : 'Mark Worn'}</span>
                  </button>

                  <button
                    onClick={() => onRemoveScheduledOutfit(item.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete scheduled look"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* QUICK DRAWER: Saved Outfits Ready to Schedule */}
      <div className="bg-[#FAF8F5] rounded-3xl border border-stone-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Saved Looks (Ready to Schedule)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Click “Schedule Look” on any saved outfit to assign it to a date on your calendar.
            </p>
          </div>

          <button
            onClick={onNavigateToJuggle}
            className="text-xs font-semibold text-[#E07A5F] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Juggle New Look</span>
          </button>
        </div>

        {savedOutfits.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl border border-stone-200">
            <p className="text-xs text-stone-500">
              No saved outfits yet. Head to "Juggle" to create and bookmark outfits!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {savedOutfits.map((outfit) => (
              <div
                key={outfit.id}
                className="bg-white rounded-2xl border border-stone-200 p-3.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="grid grid-cols-2 gap-1.5 aspect-square rounded-xl overflow-hidden bg-stone-100 p-1 mb-2.5">
                    {outfit.items.slice(0, 4).map((i) => (
                      <img
                        key={i.id}
                        src={i.imageUrl}
                        alt={i.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ))}
                  </div>

                  <span className="text-[10px] font-bold text-[#E07A5F] uppercase block">
                    {outfit.occasion} · {outfit.matchScore}% Match
                  </span>
                  <h4 className="font-serif font-bold text-stone-900 text-sm truncate">
                    {outfit.name}
                  </h4>
                </div>

                <button
                  onClick={() => onOpenScheduleModal(outfit)}
                  className="mt-3 w-full py-2 rounded-xl bg-stone-100 hover:bg-[#18181B] text-stone-800 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Schedule for Date →</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL: Single Scheduled Outfit View */}
      {activeOutfitDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 bg-[#FAF8F5] border-b border-stone-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#E07A5F] uppercase">
                    {activeOutfitDetail.date} · {activeOutfitDetail.timeOfDay || 'All Day'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                  <span className="text-xs text-stone-500 font-medium">
                    {activeOutfitDetail.occasion}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                  {activeOutfitDetail.outfit.name}
                </h3>
              </div>

              <button
                onClick={() => setActiveOutfitDetail(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Piece Gallery */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeOutfitDetail.outfit.items.map((piece) => (
                  <div key={piece.id} className="rounded-2xl border border-stone-200 overflow-hidden bg-white">
                    <div className="aspect-square bg-stone-100">
                      <img
                        src={piece.imageUrl}
                        alt={piece.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 text-center">
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">
                        {piece.category}
                      </span>
                      <span className="text-xs font-semibold text-stone-900 line-clamp-1 block">
                        {piece.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Event Notes & Stylist Advice */}
              {activeOutfitDetail.notes && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold block mb-0.5">Event / Personal Note:</span>
                  {activeOutfitDetail.notes}
                </div>
              )}

              {activeOutfitDetail.outfit.stylingTip && (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-xs text-stone-700 italic">
                  “Stylist Tip: {activeOutfitDetail.outfit.stylingTip}”
                </div>
              )}

              {/* Status and Actions */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    handleToggleWornWithEffect(activeOutfitDetail.id);
                    setActiveOutfitDetail({
                      ...activeOutfitDetail,
                      isWorn: !activeOutfitDetail.isWorn,
                    });
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                    activeOutfitDetail.isWorn
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-[#18181B] text-white hover:bg-[#2A2B2E]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {activeOutfitDetail.isWorn ? 'Worn Today (Click to Undo)' : 'Mark as Worn Today'}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onShareOutfit(activeOutfitDetail.outfit);
                      setActiveOutfitDetail(null);
                    }}
                    className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer"
                    title="Share outfit"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onPostOnline(activeOutfitDetail.outfit);
                      setActiveOutfitDetail(null);
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span>Post Online</span>
                  </button>

                  <button
                    onClick={() => {
                      onRemoveScheduledOutfit(activeOutfitDetail.id);
                      setActiveOutfitDetail(null);
                      showToast('Outfit removed from calendar');
                    }}
                    className="p-2.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove from date"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
