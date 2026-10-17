import React, { useState } from 'react';
import {
  Sparkles,
  Shuffle,
  Shirt,
  Heart,
  MessageSquareHeart,
  Sliders,
  Menu,
  X,
  Gamepad2,
  Calendar,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'wardrobe'
  | 'juggle'
  | 'saved'
  | 'calendar'
  | 'stylist'
  | 'community'
  | 'team'
  | 'games';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  wardrobeCount: number;
  savedCount: number;
  scheduledCount?: number;
  onOpenSettings: () => void;
}


export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  wardrobeCount,
  savedCount,
  scheduledCount = 0,
  onOpenSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE4DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <button
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#18181B] via-[#2A2B2E] to-[#E07A5F] flex items-center justify-center text-white shadow-sm shadow-black/10 group-hover:scale-105 transition-transform">
              <Shuffle className="w-5 h-5 text-rose-200 transition-transform group-hover:rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#18181B]">
                  Outfit Juggle
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDF0ED] text-[#D05353] border border-[#FADCD5]">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-stone-500 tracking-wider hidden sm:block">
                YOUR CLOTHES. ENDLESS COMBINATIONS.
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleTabClick('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleTabClick('wardrobe')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'wardrobe'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Shirt className="w-4 h-4 text-stone-500" />
              <span>My Wardrobe</span>
              <span className="px-1.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                {wardrobeCount}
              </span>
            </button>

            {/* Signature Juggle CTA Tab */}
            <button
              onClick={() => handleTabClick('juggle')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all relative group ${
                activeTab === 'juggle'
                  ? 'bg-[#18181B] text-white shadow-md shadow-stone-900/20 ring-2 ring-[#E07A5F]/40'
                  : 'bg-rose-50/80 text-rose-900 hover:bg-rose-100 border border-rose-200/60'
              }`}
            >
              <Shuffle
                className={`w-4 h-4 text-[#E07A5F] group-hover:rotate-180 transition-transform duration-500`}
              />
              <span>Juggle</span>
              <span className="w-2 h-2 rounded-full bg-[#E07A5F] animate-pulse" />
            </button>

            <button
              onClick={() => handleTabClick('community')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'community'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <span>Explore Online</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 font-semibold border border-stone-200">
                Feed
              </span>
            </button>

            <button
              onClick={() => handleTabClick('saved')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'saved'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${savedCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-stone-400'}`}
              />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('calendar')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'calendar'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#E07A5F]" />
              <span>Calendar</span>
              {scheduledCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                  {scheduledCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('stylist')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'stylist'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Stylist</span>
            </button>

            <button
              onClick={() => handleTabClick('games')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'games'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-[#E07A5F]" />
              <span>Games</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-700 font-bold border border-amber-200">
                Play
              </span>
            </button>

            <button
              onClick={() => handleTabClick('team')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'team'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <span>Our Team</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                100% Humans
              </span>
            </button>
          </nav>

          {/* Right Action: Settings/Profile & Mobile toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              title="Wardrobe Stats & Settings"
              className="p-2.5 rounded-xl border border-stone-200/80 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs hover:border-stone-300"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 md:hidden rounded-xl border border-stone-200 bg-white text-stone-800 hover:bg-stone-50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleTabClick('home')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium ${
              activeTab === 'home' ? 'bg-white font-semibold shadow-2xs' : 'text-stone-700'
            }`}
          >
            <span>Home</span>
          </button>
          <button
            onClick={() => handleTabClick('wardrobe')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium ${
              activeTab === 'wardrobe' ? 'bg-white font-semibold shadow-2xs' : 'text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shirt className="w-4 h-4 text-stone-500" />
              <span>My Wardrobe</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
              {wardrobeCount} items
            </span>
          </button>
          <button
            onClick={() => handleTabClick('juggle')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-semibold ${
              activeTab === 'juggle'
                ? 'bg-[#18181B] text-white shadow-md'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-[#E07A5F]" />
              <span>Juggle My Closet</span>
            </div>
            <span className="text-xs bg-rose-200/50 text-rose-950 px-2 py-0.5 rounded-full">
              Signature
            </span>
          </button>
          <button
            onClick={() => handleTabClick('community')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium ${
              activeTab === 'community' ? 'bg-white font-semibold shadow-2xs' : 'text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>🌐</span>
              <span>Community Outfits Feed</span>
            </div>
            <span className="text-xs text-stone-500">Explore</span>
          </button>
          <button
            onClick={() => handleTabClick('saved')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium ${
              activeTab === 'saved' ? 'bg-white font-semibold shadow-2xs' : 'text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Saved Outfits</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800">
              {savedCount}
            </span>
          </button>
          <button
            onClick={() => handleTabClick('calendar')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium ${
              activeTab === 'calendar' ? 'bg-white font-semibold shadow-2xs' : 'text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E07A5F]" />
              <span>Outfit Planning Calendar</span>
            </div>
            {scheduledCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-800">
                {scheduledCount} planned
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabClick('stylist')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium ${
              activeTab === 'stylist' ? 'bg-white font-semibold shadow-2xs' : 'text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Styling Assistant</span>
            </div>
          </button>
          <button
            onClick={() => handleTabClick('games')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium ${
              activeTab === 'games' ? 'bg-white font-semibold shadow-2xs' : 'text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-[#E07A5F]" />
              <span>Fashion Games & Challenges</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
              Play & Win XP
            </span>
          </button>
          <button
            onClick={() => handleTabClick('team')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium ${
              activeTab === 'team' ? 'bg-white font-semibold shadow-2xs' : 'text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>Our Human Team</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              100% Humans
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
