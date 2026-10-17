import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Globe,
  Sparkles,
  ShieldCheck,
  Filter,
  Plus,
  Send,
  Calendar,
} from 'lucide-react';
import { CommunityPost, Occasion, Outfit } from '../types/fashion';
import { OCCASIONS_CONFIG } from '../utils/fashionRules';

interface CommunityFeedPageProps {
  posts: CommunityPost[];
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onNavigateToJuggle: () => void;
  onViewOutfitDetails: (outfit: Outfit) => void;
}

export const CommunityFeedPage: React.FC<CommunityFeedPageProps> = ({
  posts,
  onToggleLike,
  onAddComment,
  onNavigateToJuggle,
  onViewOutfitDetails,
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const filteredPosts = posts.filter((post) => {
    if (selectedOccasion === 'All') return true;
    return post.outfit.occasion === selectedOccasion;
  });

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10 animate-in fade-in duration-300">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-900 border border-rose-200/80 mb-2">
            <Globe className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>Global Street Style & Closet Juggles</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Community Outfits
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            See real combinations juggled and posted online by fashion lovers and our verified human
            stylists.
          </p>
        </div>

        <button
          onClick={onNavigateToJuggle}
          className="self-start sm:self-center px-5 py-3 rounded-2xl bg-[#18181B] hover:bg-[#2A2B2E] text-white text-sm font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-rose-300" />
          <span>Juggle & Post Yours</span>
        </button>
      </div>

      {/* Occasion Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedOccasion('All')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedOccasion === 'All'
              ? 'bg-[#18181B] text-white shadow-2xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          All Outfits ({posts.length})
        </button>
        {OCCASIONS_CONFIG.map((occ) => {
          const count = posts.filter((p) => p.outfit.occasion === occ.id).length;
          return (
            <button
              key={occ.id}
              onClick={() => setSelectedOccasion(occ.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedOccasion === occ.id
                  ? 'bg-[#18181B] text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span>{occ.emoji}</span>
              <span>{occ.label}</span>
              {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Posts Stream */}
      <div className="space-y-8">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
            <Globe className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-stone-800">
              No outfits posted in this occasion yet
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Be the first to juggle your closet and publish an outfit to the community feed!
            </p>
            <button
              onClick={onNavigateToJuggle}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#18181B] text-white text-xs font-semibold"
            >
              Juggle an Outfit
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-5 sm:p-6 flex items-center justify-between border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-900 text-sm">{post.authorName}</span>
                      {post.isHumanStylist && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Human Stylist</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-400">{post.authorHandle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-900 border border-rose-200/70">
                    {post.outfit.occasion}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800">
                    {post.outfit.matchScore}% Match
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="px-5 sm:px-6 pt-4 pb-2">
                <p className="text-sm text-stone-700 leading-relaxed font-normal">{post.caption}</p>
              </div>

              {/* Visual Outfit Grid Showcase */}
              <div className="px-5 sm:px-6 py-4">
                <div className="rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-3 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-[#E07A5F] uppercase">
                        Juggled Combination
                      </span>
                      <h4 className="font-serif text-lg font-bold text-stone-900">
                        {post.outfit.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => onViewOutfitDetails(post.outfit)}
                      className="text-xs font-semibold text-[#E07A5F] hover:text-[#c96248] cursor-pointer"
                    >
                      View Items breakdown →
                    </button>
                  </div>

                  {/* Collage */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {post.outfit.items.map((item) => (
                      <div
                        key={item.id}
                        className="group relative rounded-xl overflow-hidden bg-white aspect-square border border-stone-200/90 shadow-2xs"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
                          <span className="text-white text-[11px] font-medium leading-tight block truncate">
                            {item.name}
                          </span>
                          <span className="text-rose-200 text-[9px] uppercase tracking-wide block">
                            {item.category} • {item.color}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Harmony strip */}
                  <div className="flex items-center gap-2 pt-1 text-xs text-stone-500">
                    <span>Palette:</span>
                    <div className="flex gap-1">
                      {post.outfit.colorPalette.map((col, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[10px] font-medium text-stone-700"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Likes & Comments Action Bar */}
              <div className="px-5 sm:px-6 py-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onToggleLike(post.id)}
                    className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                      post.likedByMe ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                    <span>{post.likesCount} Likes</span>
                  </button>

                  <button
                    onClick={() =>
                      setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                    }
                    className="flex items-center gap-1.5 hover:text-stone-900 font-semibold cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-stone-400" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>

                <span className="text-[11px] text-stone-400">
                  {new Date(post.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Comments Section */}
              <div className="bg-stone-50/70 px-5 sm:px-6 py-4 border-t border-stone-100 space-y-3">
                {post.comments.length > 0 && (
                  <div className="space-y-2">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 max-w-xl">
                          <span className="font-bold text-stone-900 mr-2">
                            {comment.authorName}
                          </span>
                          <span className="text-stone-700">{comment.content}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                <form
                  onSubmit={(e) => handleCommentSubmit(post.id, e)}
                  className="flex items-center gap-2 pt-1"
                >
                  <input
                    type="text"
                    placeholder="Leave styling praise or a question..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#E07A5F]"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-[#18181B] text-white hover:bg-stone-800 transition-colors cursor-pointer"
                    title="Send comment"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
