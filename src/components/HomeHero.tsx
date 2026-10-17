import React from 'react';
import {
  Shuffle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Shirt,
  Heart,
  Palette,
  Compass,
  Gamepad2,
  Zap,
  Flame,
  Calendar,
} from 'lucide-react';
import { NavTab } from './Navbar';
import { Occasion } from '../types/fashion';

interface HomeHeroProps {
  onNavigate: (tab: NavTab) => void;
  onSelectOccasion: (occ: Occasion) => void;
  wardrobeCount: number;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onNavigate,
  onSelectOccasion,
  wardrobeCount,
}) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 rounded-3xl bg-gradient-to-b from-[#FDFBF7] via-[#FAF6F0] to-[#FAF8F5] border border-[#EAE3D9]/60 shadow-xs">
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-rose-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-50 border border-rose-200/80 text-rose-900 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Next-Generation AI Digital Wardrobe</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#18181B] leading-[1.12]">
                  Outfit Juggle
                </h1>
                <p className="font-serif italic text-2xl sm:text-3xl text-[#E07A5F] font-normal">
                  “Your clothes. Endless combinations.”
                </p>
              </div>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Add the clothes you already own and let AI create outfits for you. No shopping
                sprees required — rediscover your closet through color theory, silhouette balance,
                and occasion-ready coordination.
              </p>

              {/* CTAs requested specifically by user prompt */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => onNavigate('wardrobe')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#18181B] hover:bg-[#2A2B2E] text-white text-base font-semibold shadow-lg shadow-black/15 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Shirt className="w-5 h-5 text-rose-200 group-hover:scale-110 transition-transform" />
                  <span>Build My Wardrobe</span>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('juggle')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-rose-50/60 text-[#18181B] text-base font-semibold border-2 border-stone-200/90 shadow-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Shuffle className="w-5 h-5 text-[#E07A5F] group-hover:rotate-180 transition-transform duration-500" />
                  <span>Try Outfit Juggle</span>
                </button>
              </div>

              {/* Proof stats */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Uses items you already own</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Intelligent color harmony</span>
                </div>
                <div className="flex items-center gap-1.5 hidden sm:flex">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Missing piece advisor</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                {/* Floating Badge */}
                <div className="absolute -top-4 -right-2 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-stone-200 shadow-md flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Match Score: 94%</span>
                </div>

                {/* Outfit Result Card Mockup */}
                <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xl shadow-stone-200/60 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">
                        Curated Ensemble
                      </span>
                      <h4 className="font-serif text-lg font-bold text-stone-900">
                        Weekend Casual
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                      💕 Date / Casual
                    </span>
                  </div>

                  {/* 4-Item Visual Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="relative rounded-2xl overflow-hidden bg-stone-100 aspect-square group">
                      <img
                        src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80"
                        alt="Pink Top"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                        Pink Top
                      </span>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden bg-stone-100 aspect-square group">
                      <img
                        src="https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=400&q=80"
                        alt="Black Trousers"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                        Black Trousers
                      </span>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden bg-stone-100 aspect-square group">
                      <img
                        src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80"
                        alt="White Sneakers"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                        White Sneakers
                      </span>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden bg-stone-100 aspect-square group">
                      <img
                        src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80"
                        alt="Pink Handbag"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                        Pink Handbag
                      </span>
                    </div>
                  </div>

                  {/* Harmony strip */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium text-stone-500">Palette:</span>
                      <div className="flex -space-x-1">
                        <span className="w-4 h-4 rounded-full bg-[#F4ACB7] border border-white" />
                        <span className="w-4 h-4 rounded-full bg-[#18181B] border border-white" />
                        <span className="w-4 h-4 rounded-full bg-[#FFFFFF] border border-stone-200" />
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('juggle')}
                      className="text-xs font-semibold text-[#E07A5F] hover:text-[#c96248] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Juggle another look</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasion Quick-Launch Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold tracking-widest text-[#E07A5F] uppercase">
            Curated For Every Moment
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            What occasion are you dressing for?
          </h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto">
            Click an occasion to have the AI instantly mix and match suitable items from your
            wardrobe.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { id: 'Casual' as Occasion, label: 'Casual', emoji: '🛍️', note: 'Everyday coffee & weekends' },
            { id: 'School' as Occasion, label: 'School', emoji: '🎓', note: 'Campus chic & study days' },
            { id: 'Party' as Occasion, label: 'Party', emoji: '🎉', note: 'Night out & celebrations' },
            { id: 'Date' as Occasion, label: 'Date', emoji: '💕', note: 'Romantic dinners & drinks' },
            { id: 'Work' as Occasion, label: 'Work', emoji: '💼', note: 'Smart office & meetings' },
            { id: 'Beach' as Occasion, label: 'Beach', emoji: '🏖️', note: 'Sunny seaside & resort' },
            { id: 'Wedding' as Occasion, label: 'Wedding', emoji: '👰', note: 'Guest elegance & receptions' },
            { id: 'Sport' as Occasion, label: 'Sport', emoji: '🏃', note: 'Active athleisure' },
          ].map((occ) => (
            <button
              key={occ.id}
              onClick={() => {
                onSelectOccasion(occ.id);
                onNavigate('juggle');
              }}
              className="p-4 rounded-2xl bg-white hover:bg-rose-50/40 border border-stone-200 hover:border-rose-300 text-left transition-all hover:shadow-sm group cursor-pointer"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                {occ.emoji}
              </div>
              <h3 className="font-semibold text-stone-900 text-sm flex items-center justify-between">
                <span>{occ.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-stone-500 mt-1">{occ.note}</p>
            </button>
          ))}
        </div>
      </section>

      {/* How It Works Editorial Step Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold tracking-widest text-stone-500 uppercase">
            Simple 3-Step Experience
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">How Outfit Juggle Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-800">
              <Shirt className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#E07A5F]">STEP 1</span>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Snap & Catalog Your Clothes
              </h3>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Upload photos of your tops, trousers, dresses, shoes, and accessories. Our AI can
              automatically recognize colors, categories, and styles for you.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#18181B] text-white border border-stone-800 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center text-rose-300">
              <Shuffle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-rose-300">STEP 2</span>
              <h3 className="font-serif text-xl font-bold text-white">Press “JUGGLE MY CLOSET”</h3>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed">
              Our intelligent fashion algorithm mixes & matches color palettes, silhouette
              proportions, weather appropriateness, and event codes into cohesive outfits.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-800">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#E07A5F]">STEP 3</span>
              <h3 className="font-serif text-xl font-bold text-stone-900">Save, Tweak & Share</h3>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Swap individual shoes or layers, save your favorite looks for the week ahead, or ask
              our AI stylist for custom recommendations right on demand.
            </p>
          </div>
        </div>
      </section>

      {/* Outfit Planning Calendar Feature Highlight */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-10 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#FDF0ED] text-[#D05353] border border-[#FADCD5]">
              <Calendar className="w-3.5 h-3.5" />
              <span>NEW: WARDROBE RUNWAY PLANNER</span>
            </div>
            <h3 className="font-serif text-3xl font-bold text-stone-900">
              Interactive Outfit Planning Calendar
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Schedule saved looks for upcoming dates, track morning weather vibes, mark what you wore today, and generate a 1-click week itinerary so you never waste time deciding what to wear.
            </p>
          </div>

          <button
            onClick={() => onNavigate('calendar')}
            className="px-7 py-3.5 rounded-2xl bg-[#18181B] hover:bg-[#2A2B2E] text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-rose-300" />
            <span>Open Outfit Calendar →</span>
          </button>
        </div>
      </section>

      {/* Interactive Fashion Games Teaser Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#18181B] via-[#2A2B30] to-[#E07A5F] text-white p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 relative z-10 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-amber-300 border border-white/20">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>TEST YOUR STYLIST SKILLS</span>
            </div>
            <h3 className="font-serif text-3xl font-bold">
              Play Outfit Juggle Fashion Games
            </h3>
            <p className="text-sm text-stone-200 leading-relaxed">
              Race against the 30-second clock in <strong>Speed Stylist</strong>, test your color eye in{' '}
              <strong>Match or Clash?</strong>, or pull the lever on our <strong>Blind Juggle Spin Machine</strong> to earn Fashion XP and unlock runway badges!
            </p>
          </div>

          <button
            onClick={() => onNavigate('games')}
            className="px-8 py-4 rounded-2xl bg-white hover:bg-stone-100 text-[#18181B] font-bold text-sm sm:text-base shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer hover:scale-105"
          >
            <Gamepad2 className="w-5 h-5 text-[#E07A5F]" />
            <span>Play Fashion Games →</span>
          </button>
        </div>
      </section>
    </div>
  );
};
