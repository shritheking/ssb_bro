import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Target, CheckCircle2, Shield, Layers, 
  ArrowRight, X, Sparkles, Filter, ChevronRight, AlertCircle, Info 
} from 'lucide-react';
import { proposedProgrammes, ProgrammeItem } from '../../data/programmeData';

export const ProgrammesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProgramme, setSelectedProgramme] = useState<ProgrammeItem | null>(null);

  const categories = [
    { label: 'All Pathways', value: 'all' },
    { label: 'Foundation', value: 'Foundation' },
    { label: 'Psychology', value: 'Psychology' },
    { label: 'GTO Tasks', value: 'GTO' },
    { label: 'Interview', value: 'Interview' },
    { label: 'Personality & OLQ', value: 'Personality' },
    { label: 'Mentorship', value: 'Mentorship' },
  ];

  const filtered = activeCategory === 'all'
    ? proposedProgrammes
    : proposedProgrammes.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-16 md:space-y-24 pb-24">
      {/* 1. Header Section */}
      <section className="relative pt-12 md:pt-20 border-b border-brand-border pb-16">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-gold/15 text-brand-gold text-xs font-mono uppercase tracking-widest font-semibold">
            Proposed Curriculum Pathways
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-text max-w-4xl leading-tight">
            Comprehensive <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-text via-brand-goldLight to-brand-gold">
              Aspirant Development Framework.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-brand-textMuted max-w-3xl leading-relaxed">
            Explore our eight proposed development pathways designed around the three assessment pillars of the Services Selection Board.
          </p>

          {/* Prominent advisory badge */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-bgSecondary border border-brand-border max-w-2xl text-xs text-brand-steelLight">
            <Info className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-brand-gold uppercase font-mono">Concept Architecture Notice:</span> These represent proposed programme categories and curriculum outlines currently in development. Final batch dates, mentorship schedules, and enrolment details are to be confirmed upon official platform launch.
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Filters */}
      <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-brand-textMuted mr-2 font-mono uppercase">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </div>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat.value
                  ? 'bg-brand-gold text-brand-lightText font-semibold shadow-gold-subtle'
                  : 'bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-textMuted hover:text-brand-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Programmes Grid */}
      <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prog) => (
            <div
              key={prog.id}
              className="rounded-2xl bg-brand-card border border-brand-border p-7 flex flex-col justify-between hover:border-brand-gold/50 transition-all duration-300 shadow-card group"
            >
              <div className="space-y-5">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-brand-bg text-brand-steelLight uppercase tracking-wider">
                    {prog.category}
                  </span>
                  <span className="text-[10px] font-mono text-brand-gold uppercase font-semibold">
                    Proposed Framework
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="font-heading text-xl font-bold text-brand-text group-hover:text-brand-gold transition-colors">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-brand-steelLight font-mono mt-1">
                    {prog.tagline}
                  </p>
                </div>

                {/* Short description */}
                <p className="text-xs text-brand-textMuted leading-relaxed">
                  {prog.shortDescription}
                </p>

                {/* Intended Outcomes Preview */}
                <div className="space-y-2 pt-2 border-t border-brand-border/60">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-brand-text font-semibold">
                    Intended Learning Outcomes:
                  </div>
                  <ul className="space-y-1.5">
                    {prog.intendedOutcomes.slice(0, 3).map((outcome, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-brand-textMuted">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suitable Aspirant Level */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase text-brand-textMuted block">
                    Target Aspirant Stage:
                  </span>
                  <span className="text-xs font-semibold text-brand-text font-mono">
                    {prog.suitableAspirantLevel}
                  </span>
                </div>
              </div>

              {/* Action Button & Status Notice */}
              <div className="pt-6 border-t border-brand-border mt-6 space-y-3">
                <button
                  onClick={() => setSelectedProgramme(prog)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold bg-brand-bgSecondary hover:bg-brand-bg border border-brand-border hover:border-brand-gold text-brand-text group-hover:text-brand-gold transition-all"
                >
                  <span>Explore Programme Details</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="text-[10px] text-center text-brand-textMuted font-mono">
                  {prog.statusNotice}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Programme Detail Modal */}
      {selectedProgramme && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedProgramme(null)}
        >
          <div 
            className="bg-brand-bgSecondary border border-brand-borderGold max-w-3xl w-full rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-brand-border pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-brand-gold">
                  {selectedProgramme.category} Pathway • Proposed
                </span>
                <h3 className="font-heading text-2xl font-bold text-brand-text mt-1">
                  {selectedProgramme.title}
                </h3>
                <p className="text-xs text-brand-steelLight mt-0.5 font-mono">
                  {selectedProgramme.tagline}
                </p>
              </div>

              <button
                onClick={() => setSelectedProgramme(null)}
                className="p-1 rounded-md text-brand-textMuted hover:text-brand-text transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-brand-gold font-semibold">
                Overview & Methodology
              </h4>
              <p className="text-sm text-brand-textMuted leading-relaxed">
                {selectedProgramme.detailedDescription}
              </p>
            </div>

            {/* Core Modules */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-brand-steelLight font-semibold">
                Core Proposed Modules
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedProgramme.keyModules.map((mod, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-brand-card border border-brand-border space-y-1">
                    <div className="text-xs font-bold text-brand-text">
                      {mod.title}
                    </div>
                    <p className="text-xs text-brand-textMuted leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Intended Outcomes */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-brand-text font-semibold">
                Intended Learning Outcomes
              </h4>
              <ul className="space-y-2">
                {selectedProgramme.intendedOutcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-brand-textMuted">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Entries & Stage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-brand-card border border-brand-border text-xs">
              <div>
                <span className="text-brand-textMuted block font-mono">Target Aspirant Stage:</span>
                <span className="text-brand-text font-semibold">{selectedProgramme.suitableAspirantLevel}</span>
              </div>
              <div>
                <span className="text-brand-textMuted block font-mono">Applicable Entries:</span>
                <span className="text-brand-text font-semibold">{selectedProgramme.targetEntries.join(', ')}</span>
              </div>
            </div>

            {/* Status notice & Enquiry Action */}
            <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-brand-steelLight font-mono">
                {selectedProgramme.statusNotice}
              </span>
              <div className="flex items-center gap-3">
                <Link
                  to="/contact"
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-brand-gold text-brand-lightText hover:bg-brand-goldLight transition-colors"
                >
                  Enquire for This Pathway
                </Link>
                <button
                  onClick={() => setSelectedProgramme(null)}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-brand-card border border-brand-border text-brand-text hover:bg-brand-cardHover transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Bottom Callout */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h3 className="font-heading text-2xl font-bold text-brand-text">
          Have Questions About Which Pathway Fits Your Stage?
        </h3>
        <p className="text-sm text-brand-textMuted max-w-xl mx-auto">
          Contact our mentorship team to discuss your past attempts, written examination status, and personal development goals.
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-gold hover:text-brand-goldLight uppercase tracking-wider"
          >
            Submit an Enquiry
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
