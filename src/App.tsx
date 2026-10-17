/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { WardrobePage } from './components/WardrobePage';
import { JugglePage } from './components/JugglePage';
import { SavedOutfitsPage } from './components/SavedOutfitsPage';
import { StylistAssistantPage } from './components/StylistAssistantPage';
import { CommunityFeedPage } from './components/CommunityFeedPage';
import { TeamPage } from './components/TeamPage';
import { GamesHubPage } from './components/games/GamesHubPage';
import { OutfitCalendarPage } from './components/OutfitCalendarPage';
import { ScheduleOutfitModal } from './components/ScheduleOutfitModal';
import { AddItemModal } from './components/AddItemModal';
import { EditOutfitModal } from './components/EditOutfitModal';
import { ShareOutfitModal } from './components/ShareOutfitModal';
import { PostOutfitModal } from './components/PostOutfitModal';
import { SettingsModal } from './components/SettingsModal';

import { ClothingItem, CommunityPost, Occasion, Outfit, ScheduledOutfit, WeatherVibe } from './types/fashion';
import { INITIAL_WARDROBE } from './data/sampleWardrobe';
import { INITIAL_COMMUNITY_POSTS } from './data/communityFeedData';
import { createSampleScheduledOutfits } from './data/sampleScheduledOutfits';
import {
  Shuffle,
  ShieldCheck,
  Heart,
  Globe,
  CheckCircle2,
  Sparkles,
  Gamepad2,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY_WARDROBE = 'outfit_juggle_wardrobe_v1';
const STORAGE_KEY_SAVED = 'outfit_juggle_saved_outfits_v1';
const STORAGE_KEY_POSTS = 'outfit_juggle_community_posts_v1';
const STORAGE_KEY_XP = 'outfit_juggle_player_xp_v1';
const STORAGE_KEY_SCHEDULED = 'outfit_juggle_scheduled_v1';

export default function App() {
  // ----------------------------------------------------
  // Persistent State
  // ----------------------------------------------------
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WARDROBE);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_WARDROBE;
  });

  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      {
        id: 'sample-saved-1',
        name: 'Weekend Casual Pop',
        items: [
          INITIAL_WARDROBE[0], // Pink top
          INITIAL_WARDROBE[5], // Black trousers
          INITIAL_WARDROBE[11], // White sneakers
          INITIAL_WARDROBE[15], // Pink handbag
        ],
        occasion: 'Casual',
        style: 'Chic',
        colorPalette: ['Pink', 'Black', 'White'],
        matchScore: 94,
        stylistNote:
          'Flawlessly balanced with Pink, Black, and White hues. The crisp white sneakers ground the tailored trousers into effortless daywear.',
        stylingTip:
          'Half-tuck the pink top into your trousers and let the handbag provide a deliberate pop of pastel warmth.',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
        isSaved: true,
      },
    ];
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POSTS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_COMMUNITY_POSTS;
  });

  const [playerXP, setPlayerXP] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_XP);
      if (saved) return Number(saved);
    } catch (_) {}
    return 160; // Starter XP (unlocks level 2 Speed Stylist)
  });

  const [scheduledOutfits, setScheduledOutfits] = useState<ScheduledOutfit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCHEDULED);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return createSampleScheduledOutfits(savedOutfits);
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WARDROBE, JSON.stringify(wardrobe));
    } catch (_) {}
  }, [wardrobe]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedOutfits));
    } catch (_) {}
  }, [savedOutfits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(communityPosts));
    } catch (_) {}
  }, [communityPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_XP, playerXP.toString());
    } catch (_) {}
  }, [playerXP]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCHEDULED, JSON.stringify(scheduledOutfits));
    } catch (_) {}
  }, [scheduledOutfits]);

  // ----------------------------------------------------
  // Navigation & Modals State
  // ----------------------------------------------------
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>('Casual');

  // Modals
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);

  const [isEditOutfitOpen, setIsEditOutfitOpen] = useState(false);
  const [outfitToEdit, setOutfitToEdit] = useState<Outfit | null>(null);

  const [isShareOutfitOpen, setIsShareOutfitOpen] = useState(false);
  const [outfitToShare, setOutfitToShare] = useState<Outfit | null>(null);

  const [isPostOutfitOpen, setIsPostOutfitOpen] = useState(false);
  const [outfitToPost, setOutfitToPost] = useState<Outfit | null>(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [outfitToSchedule, setOutfitToSchedule] = useState<Outfit | null>(null);
  const [scheduleTargetDate, setScheduleTargetDate] = useState<string | undefined>(undefined);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // ----------------------------------------------------
  // Handlers
  // ----------------------------------------------------
  const handleSaveItem = (itemData: Omit<ClothingItem, 'id' | 'createdAt'>, editingId?: string) => {
    if (editingId) {
      setWardrobe((prev) =>
        prev.map((i) => (i.id === editingId ? { ...i, ...itemData } : i))
      );
      showToast(`Updated "${itemData.name}"`);
    } else {
      const newItem: ClothingItem = {
        ...itemData,
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: Date.now(),
      };
      setWardrobe((prev) => [newItem, ...prev]);
      showToast(`Added "${newItem.name}" to your wardrobe!`);
    }
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    const item = wardrobe.find((i) => i.id === id);
    setWardrobe((prev) => prev.filter((i) => i.id !== id));
    showToast(`Removed "${item?.name || 'Item'}" from closet`);
  };

  const handleToggleFavorite = (id: string) => {
    setWardrobe((prev) =>
      prev.map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i))
    );
  };

  const handleResetToSample = () => {
    setWardrobe(INITIAL_WARDROBE);
    showToast('Restored curated starter wardrobe (23 pieces)');
  };

  const handleClearWardrobe = () => {
    setWardrobe([]);
    showToast('Wardrobe cleared');
  };

  const handleSaveOutfit = (outfit: Outfit) => {
    const isAlreadySaved = savedOutfits.some((s) => s.id === outfit.id);
    if (isAlreadySaved) {
      setSavedOutfits((prev) => prev.filter((s) => s.id !== outfit.id));
      showToast('Removed outfit from saved collection');
    } else {
      setSavedOutfits((prev) => [{ ...outfit, isSaved: true, createdAt: Date.now() }, ...prev]);
      try {
        confetti({
          particleCount: 40,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#E07A5F', '#F4ACB7', '#18181B'],
        });
      } catch (_) {}
      showToast('❤️ Outfit saved to your collection!');
    }
  };

  const handleDeleteSavedOutfit = (id: string) => {
    setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
    showToast('Saved outfit removed');
  };

  const handleRenameSavedOutfit = (id: string, newName: string) => {
    setSavedOutfits((prev) =>
      prev.map((o) => (o.id === id ? { ...o, name: newName } : o))
    );
    showToast('Outfit renamed');
  };

  // ----------------------------------------------------
  // Outfit Calendar Handlers
  // ----------------------------------------------------
  const handleOpenScheduleModal = (outfit?: Outfit, targetDate?: string) => {
    setOutfitToSchedule(outfit || null);
    setScheduleTargetDate(targetDate);
    setIsScheduleModalOpen(true);
  };

  const handleConfirmScheduleOutfit = (
    outfit: Outfit,
    date: string,
    options: {
      notes?: string;
      occasion?: Occasion;
      weatherVibe?: WeatherVibe;
      timeOfDay?: 'Morning' | 'Afternoon' | 'Evening' | 'All Day';
    }
  ) => {
    // If not already in saved outfits, automatically save it so it's kept in user's collection
    if (!savedOutfits.some((s) => s.id === outfit.id)) {
      setSavedOutfits((prev) => [{ ...outfit, isSaved: true, createdAt: Date.now() }, ...prev]);
    }

    const newScheduled: ScheduledOutfit = {
      id: `sched-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      outfitId: outfit.id,
      date,
      outfit,
      notes: options.notes,
      occasion: options.occasion || outfit.occasion,
      weatherVibe: options.weatherVibe || outfit.weatherFit || 'Mild',
      timeOfDay: options.timeOfDay || 'Morning',
      isWorn: false,
      createdAt: Date.now(),
    };

    setScheduledOutfits((prev) => [newScheduled, ...prev]);
    showToast(`📅 Scheduled "${outfit.name}" for ${date}!`);
  };

  const handleRemoveScheduledOutfit = (id: string) => {
    setScheduledOutfits((prev) => prev.filter((s) => s.id !== id));
    showToast('Outfit removed from calendar date');
  };

  const handleToggleScheduledWorn = (id: string) => {
    setScheduledOutfits((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextWorn = !s.isWorn;
          // Increment wear counts on items in wardrobe if marked worn
          if (nextWorn) {
            const pieceIds = new Set(s.outfit.items.map((i) => i.id));
            setWardrobe((wardrobePrev) =>
              wardrobePrev.map((w) =>
                pieceIds.has(w.id) ? { ...w, timesWorn: (w.timesWorn || 0) + 1 } : w
              )
            );
          }
          return {
            ...s,
            isWorn: nextWorn,
            wornAt: nextWorn ? Date.now() : undefined,
          };
        }
        return s;
      })
    );
  };

  const handleUpdateScheduledOutfit = (id: string, updates: Partial<ScheduledOutfit>) => {
    setScheduledOutfits((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    showToast('Calendar entry updated');
  };

  // Community Post Online
  const handlePublishPost = (newPost: CommunityPost) => {
    setCommunityPosts((prev) => [newPost, ...prev]);
    showToast('🌐 Your outfit has been posted online to the community feed!');
    setActiveTab('community');
  };

  const handleTogglePostLike = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const liked = !post.likedByMe;
          return {
            ...post,
            likedByMe: liked,
            likesCount: liked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      })
    );
  };

  const handleAddPostComment = (postId: string, text: string) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      authorName: 'You',
      authorAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      content: text,
      createdAt: Date.now(),
    };
    setCommunityPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
    showToast('Comment posted!');
  };

  const handleAwardXP = (earnedXP: number) => {
    setPlayerXP((prev) => {
      const next = prev + earnedXP;
      showToast(`+${earnedXP} Fashion XP earned! ✨`);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#212121] flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#18181B] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wardrobeCount={wardrobe.length}
        savedCount={savedOutfits.length}
        scheduledCount={scheduledOutfits.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeHero
            onNavigate={setActiveTab}
            onSelectOccasion={setSelectedOccasion}
            wardrobeCount={wardrobe.length}
          />
        )}

        {activeTab === 'wardrobe' && (
          <WardrobePage
            wardrobe={wardrobe}
            onAddNewItem={() => {
              setEditingItem(null);
              setIsAddItemOpen(true);
            }}
            onEditItem={(item) => {
              setEditingItem(item);
              setIsAddItemOpen(true);
            }}
            onDeleteItem={handleDeleteItem}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToJuggle={() => setActiveTab('juggle')}
            onResetToSample={handleResetToSample}
          />
        )}

        {activeTab === 'juggle' && (
          <JugglePage
            wardrobe={wardrobe}
            selectedOccasion={selectedOccasion}
            onSelectOccasion={setSelectedOccasion}
            onAddNewItem={() => {
              setEditingItem(null);
              setIsAddItemOpen(true);
            }}
            onSaveOutfit={handleSaveOutfit}
            onShareOutfit={(outfit) => {
              setOutfitToShare(outfit);
              setIsShareOutfitOpen(true);
            }}
            onEditOutfit={(outfit) => {
              setOutfitToEdit(outfit);
              setIsEditOutfitOpen(true);
            }}
            onPostOnline={(outfit) => {
              setOutfitToPost(outfit);
              setIsPostOutfitOpen(true);
            }}
            onScheduleOutfit={(outfit) => handleOpenScheduleModal(outfit)}
            savedOutfits={savedOutfits}
          />
        )}

        {activeTab === 'saved' && (
          <SavedOutfitsPage
            savedOutfits={savedOutfits}
            onDeleteSavedOutfit={handleDeleteSavedOutfit}
            onRenameSavedOutfit={handleRenameSavedOutfit}
            onShareOutfit={(outfit) => {
              setOutfitToShare(outfit);
              setIsShareOutfitOpen(true);
            }}
            onPostOnline={(outfit) => {
              setOutfitToPost(outfit);
              setIsPostOutfitOpen(true);
            }}
            onScheduleOutfit={(outfit) => handleOpenScheduleModal(outfit)}
            onNavigateToCalendar={() => setActiveTab('calendar')}
            onNavigateToJuggle={() => setActiveTab('juggle')}
          />
        )}

        {activeTab === 'calendar' && (
          <OutfitCalendarPage
            scheduledOutfits={scheduledOutfits}
            savedOutfits={savedOutfits}
            onOpenScheduleModal={handleOpenScheduleModal}
            onRemoveScheduledOutfit={handleRemoveScheduledOutfit}
            onToggleScheduledWorn={handleToggleScheduledWorn}
            onUpdateScheduledOutfit={handleUpdateScheduledOutfit}
            onNavigateToJuggle={() => setActiveTab('juggle')}
            onShareOutfit={(outfit) => {
              setOutfitToShare(outfit);
              setIsShareOutfitOpen(true);
            }}
            onPostOnline={(outfit) => {
              setOutfitToPost(outfit);
              setIsPostOutfitOpen(true);
            }}
            showToast={showToast}
          />
        )}

        {activeTab === 'stylist' && (
          <StylistAssistantPage
            wardrobe={wardrobe}
            onSaveOutfit={handleSaveOutfit}
            onShareOutfit={(outfit) => {
              setOutfitToShare(outfit);
              setIsShareOutfitOpen(true);
            }}
            onEditOutfit={(outfit) => {
              setOutfitToEdit(outfit);
              setIsEditOutfitOpen(true);
            }}
            onPostOnline={(outfit) => {
              setOutfitToPost(outfit);
              setIsPostOutfitOpen(true);
            }}
            onScheduleOutfit={(outfit) => handleOpenScheduleModal(outfit)}
            savedOutfits={savedOutfits}
          />
        )}

        {activeTab === 'community' && (
          <CommunityFeedPage
            posts={communityPosts}
            onToggleLike={handleTogglePostLike}
            onAddComment={handleAddPostComment}
            onNavigateToJuggle={() => setActiveTab('juggle')}
            onViewOutfitDetails={(outfit) => {
              setOutfitToShare(outfit);
              setIsShareOutfitOpen(true);
            }}
          />
        )}

        {activeTab === 'games' && (
          <GamesHubPage
            wardrobe={wardrobe}
            playerXP={playerXP}
            onAwardXP={handleAwardXP}
            onSaveOutfit={handleSaveOutfit}
            onPostOnline={(outfit) => {
              setOutfitToPost(outfit);
              setIsPostOutfitOpen(true);
            }}
          />
        )}

        {activeTab === 'team' && <TeamPage />}
      </main>

      {/* Modals */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => {
          setIsAddItemOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />

      <EditOutfitModal
        isOpen={isEditOutfitOpen}
        onClose={() => {
          setIsEditOutfitOpen(false);
          setOutfitToEdit(null);
        }}
        outfit={outfitToEdit}
        wardrobe={wardrobe}
        onSaveOutfitChanges={(updated) => {
          handleSaveOutfit(updated);
          showToast(`Customized outfit saved as "${updated.name}"`);
        }}
      />

      <ShareOutfitModal
        isOpen={isShareOutfitOpen}
        onClose={() => {
          setIsShareOutfitOpen(false);
          setOutfitToShare(null);
        }}
        outfit={outfitToShare}
        onOpenPostOnline={() => {
          setOutfitToPost(outfitToShare);
          setIsPostOutfitOpen(true);
        }}
      />

      <PostOutfitModal
        isOpen={isPostOutfitOpen}
        onClose={() => {
          setIsPostOutfitOpen(false);
          setOutfitToPost(null);
        }}
        outfit={outfitToPost}
        onPublishSuccess={handlePublishPost}
      />

      <ScheduleOutfitModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setOutfitToSchedule(null);
          setScheduleTargetDate(undefined);
        }}
        savedOutfits={savedOutfits}
        initialOutfit={outfitToSchedule}
        initialDate={scheduleTargetDate}
        onConfirmSchedule={handleConfirmScheduleOutfit}
        onNavigateToJuggle={() => setActiveTab('juggle')}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        wardrobe={wardrobe}
        onResetToSample={handleResetToSample}
        onClearWardrobe={handleClearWardrobe}
      />

      {/* Footer */}
      <footer className="border-t border-[#EAE4DC] bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#18181B] flex items-center justify-center text-white">
                <Shuffle className="w-5 h-5 text-rose-300" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-stone-900">
                  Outfit Juggle
                </span>
                <p className="text-xs text-stone-500 font-medium tracking-wide">
                  “Your clothes. Endless combinations.”
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-stone-600">
              <button
                onClick={() => {
                  setActiveTab('wardrobe');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-stone-900 cursor-pointer"
              >
                My Wardrobe
              </button>
              <button
                onClick={() => {
                  setActiveTab('juggle');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-stone-900 cursor-pointer"
              >
                Juggle Closet
              </button>
              <button
                onClick={() => {
                  setActiveTab('community');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-stone-900 cursor-pointer"
              >
                Post Online & Feed
              </button>
              <button
                onClick={() => {
                  setActiveTab('saved');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-stone-900 cursor-pointer"
              >
                Saved Outfits
              </button>
              <button
                onClick={() => {
                  setActiveTab('calendar');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-stone-900 cursor-pointer flex items-center gap-1 text-[#E07A5F]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Outfit Calendar</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('games');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-stone-900 cursor-pointer flex items-center gap-1"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Fashion Games</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('team');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-stone-900 cursor-pointer flex items-center gap-1"
              >
                <span>Our Human Team</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  100% Humans
                </span>
              </button>
            </div>

            {/* Human Stylist Badge */}
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Curated by Verified Human Stylists</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-stone-100 text-center text-xs text-stone-400">
            © {new Date().getFullYear()} Outfit Juggle. All rights reserved. Built for conscious,
            stylish living with the clothes you already love.
          </div>
        </div>
      </footer>
    </div>
  );
}
