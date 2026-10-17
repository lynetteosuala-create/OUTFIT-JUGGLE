import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { MATCH_OR_CLASH_ROUNDS } from '../../data/gamesData';
import confetti from 'canvas-confetti';

interface MatchOrClashGameProps {
  onAwardXP: (xp: number) => void;
}

export const MatchOrClashGame: React.FC<MatchOrClashGameProps> = ({ onAwardXP }) => {
  const [roundIndex, setRoundIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [userGuess, setUserGuess] = useState<boolean | null>(null);
  const [revealed, setRevealed] = useState(false);

  const currentRound = MATCH_OR_CLASH_ROUNDS[roundIndex % MATCH_OR_CLASH_ROUNDS.length];

  const handleGuess = (guessIsMatch: boolean) => {
    if (revealed) return;

    setUserGuess(guessIsMatch);
    setRevealed(true);

    const isCorrect = guessIsMatch === currentRound.isMatch;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setScore((prev) => prev + 100 + newStreak * 15);
      onAwardXP(30 + newStreak * 5);

      try {
        confetti({
          particleCount: 45,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#10B981', '#E07A5F', '#F4ACB7'],
        });
      } catch (_) {}
    } else {
      setStreak(0);
      onAwardXP(10);
    }
  };

  const handleNextRound = () => {
    setRevealed(false);
    setUserGuess(null);
    setRoundIndex((prev) => prev + 1);
  };

  const isCorrect = userGuess !== null && userGuess === currentRound.isMatch;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Game Header with Streak & Score */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#E07A5F] flex items-center justify-center font-bold">
            #{roundIndex + 1}
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">
              FASHION EYE TEST
            </span>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Style Match or Clash?
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-900 text-xs font-bold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Streak: {streak}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-stone-400 block font-medium">Score</span>
            <span className="text-base font-bold text-stone-900">{score} pts</span>
          </div>
        </div>
      </div>

      {/* Outfit Combination Under Evaluation */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-md space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#E07A5F] uppercase tracking-wider">
            Examine this combination
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Does this outfit coordinate, or do the pieces clash?
          </h2>
        </div>

        {/* Visual Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {currentRound.items.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-stone-50 border border-stone-200 aspect-square relative shadow-2xs"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                <span className="text-xs font-bold leading-tight block truncate">
                  {item.name}
                </span>
                <span className="text-[10px] text-rose-200 uppercase tracking-wide">
                  {item.category} • {item.color}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-center text-xs text-stone-600 font-medium">
          {currentRound.items.map((i) => `${i.color} ${i.name}`).join(' + ')}
        </div>

        {/* Action Buttons: MATCH vs CLASH */}
        {!revealed ? (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => handleGuess(true)}
              className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 text-emerald-200" />
              <span>✨ STYLE MATCH!</span>
            </button>

            <button
              onClick={() => handleGuess(false)}
              className="py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Flame className="w-5 h-5 text-rose-200" />
              <span>💥 FASHION CLASH!</span>
            </button>
          </div>
        ) : (
          /* Reveal Verdict & Stylist Explanation */
          <div className="space-y-4 pt-2 animate-in zoom-in-95 duration-200">
            <div
              className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-7 h-7 text-rose-600 shrink-0" />
                )}
                <div>
                  <h4 className="font-bold text-base">
                    {isCorrect ? 'Correct Call! Spot on.' : 'Not quite!'}
                  </h4>
                  <p className="text-xs font-medium">
                    This combination is indeed a{' '}
                    <span className="font-bold uppercase">
                      {currentRound.isMatch ? 'Style Match' : 'Fashion Clash'}
                    </span>{' '}
                    (Harmony Score: {currentRound.score}%)
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-emerald-700">
                  {isCorrect ? `+${100 + streak * 15} pts` : '+10 pts'}
                </span>
              </div>
            </div>

            {/* Why It Works / Clashes */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-xs text-stone-700 space-y-2">
              <p className="leading-relaxed font-medium">{currentRound.explanation}</p>
              <div className="flex items-start gap-2 pt-2 border-t border-stone-200 text-stone-900 italic font-serif">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{currentRound.humanStylistAdvice}</span>
              </div>
            </div>

            {/* Next Round CTA */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextRound}
                className="px-6 py-3 rounded-2xl bg-[#18181B] hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Next Round</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
