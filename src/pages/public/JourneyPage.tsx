import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Target, Shield, Award, Calendar, CheckCircle2, 
  AlertCircle, ChevronRight, X, Sparkles, Filter, 
  MapPin, UserCheck, Flame, ArrowRight 
} from 'lucide-react';
import { journeyMilestones, JourneyMilestone, mentorStats } from '../../data/journeyData';

export const JourneyPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<JourneyMilestone | null>(null);

  const filters = [
    { label: 'All Milestones', value: 'all' },
    { label: 'Motivation', value: 'motivation' },
    { label: 'Preparation', value: 'preparation' },
    { label: 'Attempts', value: 'attempt' },
    { label: 'Recommendation', value: 'recommendation' },
    { label: 'Final Selection', value: 'final' },
  ];

  const filteredMilestones = activeFilter === 'all'
    ? journeyMilestones
    : journeyMilestones.filter((m) => m.category === activeFilter);

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C8A96B', '#DFCA95', '#6F91B8', '#F4F3EF']
    });
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-24 overflow-x-hidden">
      
      {/* 1. Header Section */}
      <section className="relative pt-8 sm:pt-14 md:pt-20 border-b border-brand-border/60 pb-12 sm:pb-16">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-gold/15 text-brand-gold text-xs font-mono uppercase tracking-widest font-semibold">
            Interactive Timeline & Verified Narrative
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-text max-w-4xl leading-tight">
            Five Attempts. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-text via-brand-goldLight to-brand-gold">
              One Determination.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-brand-textMuted max-w-3xl leading-relaxed font-sans">
            A nearly two-year journey from setbacks to recommendation. Every conference-out was not an end, but an essential diagnostic that forged the officer within.
          </p>

          {/* Disclaimer callout */}
          <div className="p-4 rounded-xl bg-brand-bgSecondary border border-brand-border text-xs text-brand-steelLight max-w-2xl leading-relaxed">
            <span className="text-brand-gold font-semibold uppercase font-mono">Verified Narrative Disclaimer:</span> This journey is based directly on the personal account provided by Lt. Vamshi E., documenting his actual attempts, board experiences, lessons, and final AIR 34 standing.
          </div>
        </div>
      </section>

      {/* 2. Quick Stat Ribbon & Real Transformation Banner */}
      <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
        
        {/* Statistics 4-col */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-brand-bgSecondary border border-brand-border">
          <div className="space-y-1">
            <div className="text-[10px] sm:text-xs font-mono text-brand-steelLight uppercase">Total Attempts</div>
            <div className="text-xl sm:text-2xl font-heading font-bold text-brand-text">{mentorStats.ssbAttempts} SSBs</div>
            <div className="text-[10px] sm:text-[11px] text-brand-textMuted truncate">Mysore, Varanasi, Gandhinagar</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] sm:text-xs font-mono text-brand-gold uppercase">Outcome</div>
            <div className="text-xl sm:text-2xl font-heading font-bold text-brand-gold">Recommended</div>
            <div className="text-[10px] sm:text-[11px] text-brand-textMuted">Chest No. 50 (3 AFSB)</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] sm:text-xs font-mono text-brand-steelLight uppercase">Final Merit</div>
            <div className="text-xl sm:text-2xl font-heading font-bold text-brand-text">AIR {mentorStats.airRank}</div>
            <div className="text-[10px] sm:text-[11px] text-brand-textMuted">CDS 2 2019 • IMA</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] sm:text-xs font-mono text-brand-steelLight uppercase">Weight Lost</div>
            <div className="text-xl sm:text-2xl font-heading font-bold text-brand-text">22 kg</div>
            <div className="text-[10px] sm:text-[11px] text-brand-textMuted">Physical transformation</div>
          </div>
        </div>

        {/* Real Visual Evidence Card */}
        <div className="p-4 sm:p-6 rounded-2xl bg-brand-card border border-brand-borderGold/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-brand-gold/40">
              <img
                src="/images/transformation-after.jpg"
                alt="Lt. Vamshi E. Physical Transformation"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-gold font-bold">Documented Proof of Grit</span>
              <h3 className="font-heading font-bold text-base sm:text-lg text-brand-text mt-0.5">
                "I lost 22 kgs in 3 months preparing for SSB. Discipline is all it takes."
              </h3>
              <p className="text-xs text-brand-textMuted mt-1">
                From an unconditioned graduate in Dec 2018 to an agile, obstacle-clearing candidate.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <img 
              src="/images/mentor-portrait.jpg" 
              alt="Commissioned Officer Lt. Vamshi E." 
              className="w-10 h-10 rounded-full object-cover object-top border border-brand-gold"
            />
            <div className="text-left font-mono text-xs">
              <span className="text-brand-text block font-bold">Lt. Vamshi E.</span>
              <span className="text-brand-steelLight text-[10px]">AIR 34 · CDS 2 2019</span>
            </div>
          </div>
        </div>

      </section>

      {/* 3. Filter Navigation */}
      <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-brand-textMuted mr-2 font-mono uppercase shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </div>
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                activeFilter === f.value
                  ? 'bg-brand-gold text-brand-lightText font-semibold shadow-gold-subtle'
                  : 'bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-textMuted hover:text-brand-text'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. The Interactive Timeline */}
      <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="relative border-l-2 border-brand-border/60 ml-4 md:ml-32 space-y-12">
          {filteredMilestones.map((milestone) => {
            const isRec = milestone.category === 'recommendation';
            const isAttempt = milestone.category === 'attempt';
            const isFinal = milestone.category === 'final';

            return (
              <div key={milestone.id} className="relative pl-6 md:pl-10 group">
                
                {/* Timeline node marker */}
                <div 
                  className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                    isRec 
                      ? 'bg-brand-gold border-white text-brand-lightText shadow-gold-subtle' 
                      : isFinal
                      ? 'bg-brand-steel border-brand-gold text-white'
                      : isAttempt
                      ? 'bg-brand-bgSecondary border-red-400 text-red-300'
                      : 'bg-brand-card border-brand-steelLight text-brand-steelLight'
                  }`}
                >
                  {isRec ? (
                    <Award className="w-4 h-4" />
                  ) : isAttempt ? (
                    <span className="text-xs font-bold font-mono">!</span>
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>

                {/* Left Date Label for Desktop */}
                <div className="hidden md:block absolute -left-32 top-2 w-24 text-right">
                  <span className="text-xs font-mono font-semibold text-brand-steelLight block">
                    {milestone.dateOrYear}
                  </span>
                  <span className="text-[10px] text-brand-textMuted uppercase font-mono">
                    {milestone.category}
                  </span>
                </div>

                {/* Card Container */}
                <div 
                  className={`p-5 sm:p-8 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isRec 
                      ? 'bg-gradient-to-br from-brand-card via-brand-bgSecondary to-brand-card border-brand-borderGold shadow-gold-subtle hover:border-brand-gold' 
                      : 'bg-brand-card border-brand-border hover:border-brand-steelLight/50'
                  }`}
                  onClick={() => {
                    setSelectedMilestone(milestone);
                    if (isRec) triggerCelebration();
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
                    <div>
                      {/* Mobile Date tag */}
                      <div className="md:hidden text-xs font-mono text-brand-steelLight mb-1">
                        {milestone.dateOrYear} • {milestone.category.toUpperCase()}
                      </div>

                      <h3 className="font-heading text-lg sm:text-2xl font-bold text-brand-text flex items-center gap-2 sm:gap-3 flex-wrap">
                        {milestone.title}
                        {isRec && (
                          <span className="text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded bg-brand-gold text-brand-lightText font-mono uppercase tracking-wider font-bold">
                            RECOMMENDED
                          </span>
                        )}
                        {milestone.outcome === 'Conferenced Out' && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-300 font-mono">
                            Conferenced Out
                          </span>
                        )}
                      </h3>

                      <p className="text-xs sm:text-sm font-medium text-brand-goldLight mt-1">
                        {milestone.subtitle}
                      </p>
                    </div>

                    {/* Batch statistics pills if available */}
                    {milestone.batchStats && (
                      <div className="flex items-center gap-2 text-xs font-mono bg-brand-bgSecondary px-3 py-1.5 rounded border border-brand-border shrink-0 self-start sm:self-auto">
                        <span className="text-brand-textMuted">Screened: {milestone.batchStats.screenedIn}/{milestone.batchStats.reported}</span>
                        <span>•</span>
                        <span className="text-brand-gold">Rec: {milestone.batchStats.recommended}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed mb-4 sm:mb-6">
                    {milestone.summary}
                  </p>

                  {/* Key Takeaway Pill */}
                  <div className="p-3 sm:p-3.5 rounded-xl bg-brand-bg/60 border border-brand-border text-xs text-brand-text flex items-start gap-2.5">
                    <span className="text-brand-gold font-bold font-mono shrink-0">TAKEAWAY:</span>
                    <span className="editorial-quote italic text-brand-text/90 leading-snug">{milestone.keyTakeaway}</span>
                  </div>

                  {/* Expand CTA */}
                  <div className="mt-4 pt-3 sm:pt-4 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-steelLight group-hover:text-brand-gold transition-colors">
                    <span className="font-semibold text-[11px] sm:text-xs">Click to read full narrative, lessons & board breakdown</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Detailed Modal / Drawer View */}
      {selectedMilestone && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedMilestone(null)}
        >
          <div 
            className="bg-brand-bgSecondary border border-brand-borderGold max-w-2xl w-full rounded-2xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-brand-border pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-brand-gold">
                  {selectedMilestone.dateOrYear} • {selectedMilestone.category.toUpperCase()}
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-text mt-1">
                  {selectedMilestone.title}
                </h3>
                <p className="text-xs text-brand-steelLight mt-0.5">
                  {selectedMilestone.subtitle}
                </p>
              </div>

              <button
                onClick={() => setSelectedMilestone(null)}
                className="p-1 rounded-md text-brand-textMuted hover:text-brand-text transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* If Attempt, Board details */}
            {(selectedMilestone.board || selectedMilestone.chestNo) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl bg-brand-card border border-brand-border text-xs font-mono">
                {selectedMilestone.board && (
                  <div>
                    <span className="text-brand-textMuted block text-[10px]">Board</span>
                    <span className="text-brand-text font-semibold">{selectedMilestone.board}</span>
                  </div>
                )}
                {selectedMilestone.entry && (
                  <div>
                    <span className="text-brand-textMuted block text-[10px]">Entry</span>
                    <span className="text-brand-text font-semibold">{selectedMilestone.entry}</span>
                  </div>
                )}
                {selectedMilestone.chestNo && (
                  <div>
                    <span className="text-brand-textMuted block text-[10px]">Chest Number</span>
                    <span className="text-brand-gold font-bold">{selectedMilestone.chestNo}</span>
                  </div>
                )}
                {selectedMilestone.outcome && (
                  <div>
                    <span className="text-brand-textMuted block text-[10px]">Outcome</span>
                    <span className={selectedMilestone.outcome === 'Recommended' ? 'text-brand-gold font-bold' : 'text-red-400'}>
                      {selectedMilestone.outcome}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Detailed narrative */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-brand-gold font-semibold">
                Complete Account
              </h4>
              <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed whitespace-pre-line">
                {selectedMilestone.detailedNarrative}
              </p>
            </div>

            {/* Lessons learned */}
            <div className="space-y-2 sm:space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-brand-steelLight font-semibold">
                Lessons Extracted for Aspirants
              </h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {selectedMilestone.lessons.map((lesson, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-brand-text">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0" />
                    <span>{lesson}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Close Button */}
            <div className="pt-4 border-t border-brand-border flex justify-end">
              <button
                onClick={() => setSelectedMilestone(null)}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-text transition-colors"
              >
                Close Narrative
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Concluding Message Callout */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6">
        <blockquote className="editorial-quote italic text-xl sm:text-3xl text-brand-text leading-snug">
          "Your setbacks do not define your destination. How you respond to them does."
        </blockquote>
        <p className="text-xs text-brand-steelLight font-mono">
          — Lt. Vamshi E. (AIR 34, CDS 2 2019)
        </p>
      </section>

    </div>
  );
};
