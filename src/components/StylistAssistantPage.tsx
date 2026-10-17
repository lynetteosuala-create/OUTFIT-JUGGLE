import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Shirt,
  Heart,
  Globe,
  Share2,
  Wand2,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { ClothingItem, Outfit, StylistChatMessage } from '../types/fashion';
import { requestStylistAdvice } from '../services/geminiService';
import { OutfitResultCard } from './OutfitResultCard';

interface StylistAssistantPageProps {
  wardrobe: ClothingItem[];
  onSaveOutfit: (outfit: Outfit) => void;
  onShareOutfit: (outfit: Outfit) => void;
  onEditOutfit: (outfit: Outfit) => void;
  onPostOnline: (outfit: Outfit) => void;
  onScheduleOutfit?: (outfit: Outfit) => void;
  savedOutfits: Outfit[];
}

const EXAMPLE_PROMPTS = [
  'Create an outfit for a birthday party.',
  'Give me a casual school outfit.',
  'I want something cute but comfortable.',
  'Create an outfit for a wedding.',
  'Give me a weekend outfit.',
  'Use my pink top.',
];

export const StylistAssistantPage: React.FC<StylistAssistantPageProps> = ({
  wardrobe,
  onSaveOutfit,
  onShareOutfit,
  onEditOutfit,
  onPostOnline,
  onScheduleOutfit,
  savedOutfits,
}) => {
  const [messages, setMessages] = useState<StylistChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        'Hello! I am your Outfit Juggle AI Stylist. Tell me what vibe, event, or specific clothing piece you want to wear, and I will assemble a complete outfit using exclusively the clothes you already own in your digital wardrobe.',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (queryText: string) => {
    const text = queryText.trim();
    if (!text) return;

    const userMessage: StylistChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await requestStylistAdvice({
        query: text,
        wardrobe,
      });

      const assistantMessage: StylistChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.replyMessage,
        outfit: response.outfit,
        missingItemAlert: response.missingItemAlert,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-900">
          <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>Personal AI Stylist</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          What are you dressing for?
        </h1>
        <p className="text-sm text-stone-600">
          Type any request. Unlike generic fashion apps, Outfit Juggle will never recommend items
          you don't own — it works purely with your existing closet.
        </p>
      </div>

      {/* Example Prompt Chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Inspiration Prompts:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-rose-50/60 border border-stone-200 hover:border-rose-300 text-xs font-medium text-stone-800 transition-all shadow-2xs hover:shadow-sm cursor-pointer"
            >
              “{prompt}”
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="space-y-6 bg-stone-50/50 p-4 sm:p-6 rounded-3xl border border-stone-200 min-h-[400px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            } space-y-3`}
          >
            {/* Bubble */}
            <div
              className={`max-w-xl p-4 sm:p-5 rounded-3xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#18181B] text-white rounded-br-none shadow-sm'
                  : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 text-[11px] font-bold opacity-75">
                {msg.sender === 'assistant' ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span>Outfit Juggle Stylist</span>
                  </>
                ) : (
                  <span>You</span>
                )}
              </div>
              <p>{msg.text}</p>
            </div>

            {/* Embedded Outfit Result Card if generated by Stylist */}
            {msg.outfit && (
              <div className="w-full max-w-2xl pt-2">
                <OutfitResultCard
                  outfit={msg.outfit}
                  onSaveOutfit={onSaveOutfit}
                  onJuggleAgain={() => handleSendMessage(`Juggle another option for: ${msg.text}`)}
                  onShareOutfit={onShareOutfit}
                  onEditOutfit={onEditOutfit}
                  onPostOnline={onPostOnline}
                  onScheduleOutfit={onScheduleOutfit}
                  isSaved={savedOutfits.some((s) => s.id === msg.outfit?.id)}
                />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 p-4 bg-white rounded-2xl border border-stone-200 text-xs text-stone-500 max-w-xs animate-pulse">
            <Sparkles className="w-4 h-4 text-[#E07A5F] animate-spin" />
            <span>Stylist is reviewing your wardrobe...</span>
          </div>
        )}
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          placeholder="Ask your stylist (e.g. 'Create an outfit for a birthday party' or 'Use my pink top')..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full px-5 py-4 pr-14 text-sm sm:text-base rounded-2xl border border-stone-300 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40 shadow-sm"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="absolute right-2.5 p-3 rounded-xl bg-[#18181B] text-white hover:bg-stone-800 disabled:opacity-40 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
