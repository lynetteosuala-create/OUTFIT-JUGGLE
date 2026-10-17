import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Send,
  CheckCircle2,
  HeartHandshake,
  Glasses,
} from 'lucide-react';
import { HUMAN_TEAM_MEMBERS } from '../data/teamData';
import { TeamMember } from '../types/fashion';

export const TeamPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [consultationName, setConsultationName] = useState('');
  const [consultationEmail, setConsultationEmail] = useState('');
  const [consultationQuestion, setConsultationQuestion] = useState('');
  const [consultationSent, setConsultationSent] = useState(false);

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationQuestion.trim()) return;
    setConsultationSent(true);
    setTimeout(() => {
      setConsultationName('');
      setConsultationEmail('');
      setConsultationQuestion('');
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% REAL HUMAN STYLISTS • NOT AI GENERATED</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
          Meet the Human Team Behind Outfit Juggle
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          While our algorithm handles the instant combinatorial math of your wardrobe, every color
          rule, silhouette guideline, and aesthetic synergy is designed, audited, and curated by
          real human fashion directors and editorial stylists.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-stone-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Paris & London runway veterans</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Certified human colorists</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Sustainable wardrobe advocates</span>
          </div>
        </div>
      </div>

      {/* Human Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {HUMAN_TEAM_MEMBERS.map((member) => (
          <div
            key={member.id}
            className="group relative bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Human Verified Ribbon */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Human</span>
            </div>

            <div className="space-y-5">
              {/* Profile Card Top */}
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-stone-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>

                <div className="space-y-1 pr-16">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-[#E07A5F] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-[#E07A5F] tracking-wide uppercase">
                    {member.role}
                  </p>
                  <p className="text-xs text-stone-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{member.location}</span> • <span>{member.yearsExperience} yrs exp</span>
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                {member.bio}
              </p>

              {/* Featured Quote */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 relative italic text-xs text-stone-700">
                “{member.featuredQuote}”
              </div>

              {/* Specialties Pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                  Human Styling Specialties
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-stone-100 text-stone-800 border border-stone-200/80"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500">{member.instagram}</span>
              <button
                onClick={() => setSelectedMember(member)}
                className="text-xs font-semibold text-[#18181B] hover:text-[#E07A5F] flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <span>Ask {member.name.split(' ')[0]}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Philosophy Statement: Human Taste + AI Speed */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-[#18181B] via-[#242529] to-[#36383E] text-white border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-rose-200 border border-white/15">
            <HeartHandshake className="w-4 h-4 text-rose-300" />
            <span>The Human Promise</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Why our team is strictly human
          </h2>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            Fashion is deeply personal, emotional, and cultural. AI cannot truly “feel” the poise of
            a structured shoulder pad, the warmth of a vintage wool knit, or how confident you feel
            walking into an interview. That is why our creative directors, taste auditors, and
            wardrobe guides are living, breathing human stylists with decades of real-world editorial
            craft.
          </p>
        </div>

        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
          <Glasses className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Direct Consultation Form */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-10 max-w-3xl mx-auto space-y-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-bold text-[#E07A5F] uppercase tracking-wider">
            Direct Human Touch
          </span>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            Ask a Human Stylist for Free Advice
          </h3>
          <p className="text-sm text-stone-600">
            Have a tricky item you never know how to style? Or dressing for a unique milestone event?
            Our human team will review your question and suggest how to juggle your pieces.
          </p>
        </div>

        {consultationSent ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base">Question received!</h4>
            <p className="text-xs text-emerald-800">
              One of our human stylists will review your question and send editorial recommendations
              to your inbox shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitConsultation} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mia Jenkins"
                  value={consultationName}
                  onChange={(e) => setConsultationName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:border-[#E07A5F] focus:ring-2 focus:ring-[#E07A5F]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. mia@example.com"
                  value={consultationEmail}
                  onChange={(e) => setConsultationEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:border-[#E07A5F] focus:ring-2 focus:ring-[#E07A5F]/20 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Your Wardrobe Question or Styling Dilemma
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. I have a mustard yellow pleated skirt and don't know what tops or shoes from a minimalist wardrobe pair best with it for a garden wedding..."
                value={consultationQuestion}
                onChange={(e) => setConsultationQuestion(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:border-[#E07A5F] focus:ring-2 focus:ring-[#E07A5F]/20 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#18181B] hover:bg-[#2A2B2E] text-white text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-rose-300" />
              <span>Send to Human Styling Team</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
