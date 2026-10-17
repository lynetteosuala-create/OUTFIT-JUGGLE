import React, { useState } from 'react';
import {
  X,
  Globe,
  Share2,
  Sparkles,
  Send,
  Heart,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { Outfit, CommunityPost } from '../types/fashion';
import confetti from 'canvas-confetti';

interface PostOutfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: Outfit | null;
  onPublishSuccess: (newPost: CommunityPost) => void;
}

export const PostOutfitModal: React.FC<PostOutfitModalProps> = ({
  isOpen,
  onClose,
  outfit,
  onPublishSuccess,
}) => {
  const [authorName, setAuthorName] = useState('Alex Rivers');
  const [authorHandle, setAuthorHandle] = useState('@alex_fashion');
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !outfit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E07A5F', '#F4ACB7', '#DDA15E', '#18181B'],
      });
    } catch (_) {}

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: authorName.trim() || 'Wardrobe Stylist',
      authorHandle: authorHandle.trim().startsWith('@')
        ? authorHandle.trim()
        : `@${authorHandle.trim() || 'fashion_lover'}`,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isHumanStylist: false,
      outfit,
      caption:
        caption.trim() ||
        `Just juggled this ${outfit.name} look! Love how my ${outfit.items.map((i) => i.name.toLowerCase()).join(', ')} paired together.`,
      likesCount: 1,
      likedByMe: true,
      comments: [],
      createdAt: Date.now(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onPublishSuccess(newPost);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#E07A5F] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#E07A5F] uppercase">
                Outfit Juggle Community
              </span>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Post Your Outfit Online
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Mini Outfit Card Preview */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">
                  Outfit To Publish
                </span>
                <h4 className="font-serif text-base font-bold text-stone-900">{outfit.name}</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Match: {outfit.matchScore}%
              </span>
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {outfit.items.map((item) => (
                <div
                  key={item.id}
                  className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-stone-200 bg-white"
                  title={item.name}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <p className="text-xs text-stone-500">
              {outfit.items.map((i) => i.name).join(' • ')}
            </p>
          </div>

          {/* Author Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:border-[#E07A5F] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Handle
              </label>
              <input
                type="text"
                required
                value={authorHandle}
                onChange={(e) => setAuthorHandle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:border-[#E07A5F] outline-none"
              />
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Caption / Styling Story
            </label>
            <textarea
              rows={3}
              placeholder="Tell other fashion lovers how this outfit felt, where you wore it, or what inspired the juggle..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:border-[#E07A5F] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Your outfit will be published to the public Community Feed where other users and human
              stylists can view, like, and get inspired!
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#2A2B2E] text-white text-sm font-semibold shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-rose-300" />
              <span>{isSubmitting ? 'Publishing Online...' : 'Post to Community'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
