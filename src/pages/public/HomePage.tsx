import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Award, 
  CheckCircle2, 
  Target, 
  Flame, 
  ChevronDown, 
  Compass, 
  ShieldCheck, 
  UserCheck, 
  Clock,
  HelpCircle,
} from 'lucide-react';
import { mentorStats } from '../../data/journeyData';
import { proposedProgrammes } from '../../data/programmeData';
import { learningResources } from '../../data/resourceData';
import { faqsList } from '../../data/faqData';

export const HomePage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const previewProgrammes = proposedProgrammes.slice(0, 4);
  const previewResources = learningResources.filter(r => r.featured).slice(0, 3);
  const previewFaqs = faqsList.slice(0, 5);

  return (
    <div className="space-y-20 md:space-y-32 pb-24 overflow-x-hidden">
      
      {/* ── 1. HERO SECTION: FULL-WIDTH EXPANSIVE EDITORIAL ── */}
      <section className="relative pt-8 sm:pt-14 md:pt-20 pb-16 overflow-hidden border-b border-brand-border/40">
        
        {/* Ambient background glows */}
        <div 
          className="absolute inset-0 bg-brand-grid opacity-[0.12] pointer-events-none transition-transform duration-100 ease-out" 
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
        
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[650px] bg-gradient-to-b from-brand-gold/15 via-brand-steel/10 to-transparent blur-3xl pointer-events-none transition-transform duration-200 ease-out"
          style={{ transform: `translate(-50%, ${scrollY * 0.25}px)` }}
        />

        {/* Hero Text Box: Generous width so desktop screens are fully filled */}
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10 text-center">
          
          {/* Eyebrow: CLEAN, NO BOX, dignified text with delicate separator lines */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 animate-fade-in">
            <span className="h-[1px] w-10 sm:w-20 bg-gradient-to-r from-transparent to-brand-gold/70" />
            <p className="text-xs sm:text-sm font-mono font-medium tracking-[0.28em] text-brand-gold uppercase select-none">
              PREPARE WITH PURPOSE. LEAD WITH CHARACTER.
            </p>
            <span className="h-[1px] w-10 sm:w-20 bg-gradient-to-l from-transparent to-brand-gold/70" />
          </div>

          {/* Main Heading: Generous max-width prevents awkward line wrapping on desktop */}
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-[84px] font-extrabold tracking-tight text-brand-text leading-[1.14] sm:leading-[1.08] max-w-6xl xl:max-w-7xl 2xl:max-w-[1550px] mx-auto animate-fade-in">
            Your SSB Journey Begins With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-text via-brand-goldLight to-brand-gold whitespace-nowrap">
              Who You Become.
            </span>
          </h1>

          {/* Supporting Text: Balanced and readable */}
          <p className="mt-5 sm:mt-7 text-base sm:text-xl lg:text-2xl text-brand-textMuted leading-relaxed max-w-4xl xl:max-w-5xl mx-auto font-sans">
            Develop the confidence, awareness, communication and leadership mindset needed to approach the Services Selection Board with authentic mental fortitude.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 sm:mt-11 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <Link
              to="/programmes"
              className="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-xl text-base sm:text-lg font-semibold bg-brand-gold hover:bg-brand-goldLight text-brand-lightText transition-all duration-300 shadow-gold-subtle transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
            >
              Explore Programmes
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform duration-200" />
            </Link>

            <Link
              to="/journey"
              className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-xl text-base sm:text-lg font-semibold bg-brand-card hover:bg-brand-cardHover border border-brand-border hover:border-brand-steelLight text-brand-text transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
            >
              Read My Journey
              <ArrowUpRight className="w-5 h-5 text-brand-steelLight" />
            </Link>
          </div>

          {/* Quotation: Broad, elegant editorial layout */}
          <div className="mt-12 sm:mt-16 max-w-5xl xl:max-w-6xl mx-auto text-center border-t border-b border-white/10 py-6 sm:py-8">
            <p className="editorial-quote italic text-base sm:text-xl lg:text-2xl text-brand-text/95 leading-relaxed font-serif">
              "SSB does not examine who you can pretend to be for five days. It measures the habits, grit, and integrity you live by every single morning."
            </p>
            <p className="text-xs sm:text-sm text-brand-steelLight mt-3 font-mono tracking-wide">
              — Lt. Vamshi E. · AIR 34 (CDS 2 2019) · Recommended 3 AFSB Gandhinagar
            </p>
          </div>

        </div>

        {/* ── PARALLAX HERO COMPOSITION: WIDESCREEN CINEMATIC CANVAS (FULL SPREAD) ── */}
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10 mt-12 sm:mt-16">
          <div 
            className="relative mx-auto w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-borderGold/50 shadow-2xl bg-brand-card transition-transform duration-150 ease-out group"
            style={{ 
              transform: `perspective(1000px) translateY(${Math.min(scrollY * -0.05, 0)}px)`,
            }}
          >
            {/* Cinematic Hero Height on Desktop - Fills the widescreen monitor */}
            <div className="relative h-[360px] sm:h-[500px] md:h-[620px] lg:h-[720px] xl:h-[820px] w-full overflow-hidden">
              <img
                src="/images/hero-defence.jpg"
                alt="Indian Military Academy (IMA) Passing Out Parade & Cadet March"
                className="w-full h-full object-cover object-center brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-1000 ease-out"
                style={{
                  transform: `translateY(${scrollY * 0.05}px) scale(1.04)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/30 to-transparent" />
              
              {/* Bottom Information Telemetry Bar: Wide, Spacious, Readable */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 sm:p-7 rounded-2xl bg-brand-dark/95 backdrop-blur-md border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0 border border-brand-gold/30">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-mono text-brand-gold tracking-wider uppercase font-semibold">Verified Personal Milestone</p>
                    <p className="text-sm sm:text-lg font-heading font-bold text-brand-text">AIR 34 · CDS 2 2019 · Indian Military Academy</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 self-stretch md:self-center justify-between md:justify-end">
                  <span className="text-xs sm:text-sm px-4 py-1.5 rounded-lg bg-white/10 text-brand-steelLight font-mono">Chest No. 50</span>
                  <span className="text-xs sm:text-sm px-4 py-1.5 rounded-lg bg-brand-gold/20 text-brand-gold font-mono font-bold border border-brand-gold/30">3 AFSB Recommended</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURED JOURNEY STATISTICS: WIDESCREEN GRID ── */}
      <section className="relative">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-brand-border pb-6">
            <div>
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-brand-gold font-semibold">
                The Foundational Crucible
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-text mt-2">
                A Journey Forged Through Setbacks
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-brand-steelLight bg-brand-card/70 px-4 py-2.5 rounded-xl border border-brand-border max-w-lg">
              <span className="font-semibold text-brand-gold">Important Note:</span> Statistics reflect the verified personal account of mentor Lt. Vamshi E., demonstrating that persistence outlasts failure.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            
            <div className="p-8 xl:p-10 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/50 transition-all duration-300 shadow-card group hover:-translate-y-1.5">
              <div className="flex items-center justify-between mb-5">
                <span className="text-4xl xl:text-5xl font-heading font-bold text-brand-text group-hover:text-brand-gold transition-colors">
                  {mentorStats.ssbAttempts}
                </span>
                <div className="w-12 h-12 rounded-xl bg-brand-bgSecondary flex items-center justify-center text-brand-steelLight border border-brand-border group-hover:border-brand-gold/30">
                  <Target className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-brand-text mb-2">
                SSB Attempts
              </h3>
              <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
                4 consecutive conferences out before reaching recommendation on Attempt 5.
              </p>
            </div>

            <div className="p-8 xl:p-10 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/50 transition-all duration-300 shadow-card group hover:-translate-y-1.5">
              <div className="flex items-center justify-between mb-5">
                <span className="text-4xl xl:text-5xl font-heading font-bold text-brand-gold">
                  {mentorStats.recommendations}
                </span>
                <div className="w-12 h-12 rounded-xl bg-brand-bgSecondary flex items-center justify-center text-brand-gold border border-brand-border">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-brand-text mb-2">
                Recommendation
              </h3>
              <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
                3 AFSB Gandhinagar (March 2020) — Chest No. 50 among 10 recommended candidates.
              </p>
            </div>

            <div className="p-8 xl:p-10 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/50 transition-all duration-300 shadow-card group hover:-translate-y-1.5">
              <div className="flex items-center justify-between mb-5">
                <span className="text-4xl xl:text-5xl font-heading font-bold text-brand-text group-hover:text-brand-gold transition-colors">
                  AIR {mentorStats.airRank}
                </span>
                <div className="w-12 h-12 rounded-xl bg-brand-bgSecondary flex items-center justify-center text-brand-steelLight border border-brand-border group-hover:border-brand-gold/30">
                  <Award className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-brand-text mb-2">
                All India Merit Rank
              </h3>
              <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
                Secured in CDS 2 2019 for the Indian Military Academy (IMA) entry.
              </p>
            </div>

            <div className="p-8 xl:p-10 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/50 transition-all duration-300 shadow-card group hover:-translate-y-1.5">
              <div className="flex items-center justify-between mb-5">
                <span className="text-4xl xl:text-5xl font-heading font-bold text-brand-text group-hover:text-brand-gold transition-colors">
                  {mentorStats.weightLostKg} kg
                </span>
                <div className="w-12 h-12 rounded-xl bg-brand-bgSecondary flex items-center justify-center text-brand-steelLight border border-brand-border group-hover:border-brand-gold/30">
                  <Flame className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-brand-text mb-2">
                Weight Lost & Conditioned
              </h3>
              <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
                Disciplined daily physical fitness transformation achieved within months under Ex-Army mentorship.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. PHILOSOPHY: CHARACTER OVER COACHING TRICKS ── */}
      <section className="relative">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="rounded-3xl bg-brand-bgSecondary border border-brand-border p-8 md:p-14 lg:p-16 xl:p-20 relative overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center relative z-10">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-brand-gold font-semibold">
                  Authentic Aspirant Development
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-text leading-tight">
                  Reject the Clichés. Master the Character.
                </h2>
                <p className="text-brand-textMuted text-base sm:text-lg leading-relaxed">
                  Too many coaching academies reduce SSB preparation to memorized psychological templates, rehearsed TAT scripts, and theatrical posture tricks. In reality, assessors are trained psychologists and seasoned officers who spot scripted behaviour within seconds.
                </p>
                <div className="space-y-4 pt-3">
                  <div className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-brand-text">
                      <strong className="text-brand-text">Grounded Psychological Responses:</strong> Write TAT and SRT stories rooted in genuine life experiences, not fabricated military encounters.
                    </p>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-brand-text">
                      <strong className="text-brand-text">Daily Habit Formulation:</strong> Physical conditioning, newspaper dissection, and structured mirror speaking drills.
                    </p>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-brand-text">
                      <strong className="text-brand-text">Zero False Guarantees:</strong> Honest diagnostic evaluation with no hollow claims or fake success percentages.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 xl:gap-6">
                  <div className="p-6 sm:p-7 xl:p-8 rounded-2xl bg-brand-card border border-brand-border space-y-3 hover:-translate-y-1.5 transition-transform duration-200 shadow-lg">
                    <UserCheck className="w-7 h-7 text-brand-gold" />
                    <h4 className="font-heading font-semibold text-brand-text text-base">Self Awareness</h4>
                    <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
                      Deep introspection of strengths, limitations, and authentic life milestones without pretense.
                    </p>
                  </div>
                  <div className="p-6 sm:p-7 xl:p-8 rounded-2xl bg-brand-card border border-brand-border space-y-3 hover:-translate-y-1.5 transition-transform duration-200 shadow-lg">
                    <ShieldCheck className="w-7 h-7 text-brand-steelLight" />
                    <h4 className="font-heading font-semibold text-brand-text text-base">Mental Toughness</h4>
                    <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
                      Maintaining analytical calm during difficult command tasks and high-pressure interview cross-questions.
                    </p>
                  </div>
                  <div className="p-6 sm:p-7 xl:p-8 rounded-2xl bg-brand-card border border-brand-border space-y-3 hover:-translate-y-1.5 transition-transform duration-200 shadow-lg">
                    <Compass className="w-7 h-7 text-brand-steelLight" />
                    <h4 className="font-heading font-semibold text-brand-text text-base">Strategic Communication</h4>
                    <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
                      Articulating thoughts with crisp structure, active listening, and collaborative group discussion value.
                    </p>
                  </div>
                  <div className="p-6 sm:p-7 xl:p-8 rounded-2xl bg-brand-card border border-brand-border space-y-3 hover:-translate-y-1.5 transition-transform duration-200 shadow-lg">
                    <Target className="w-7 h-7 text-brand-gold" />
                    <h4 className="font-heading font-semibold text-brand-text text-base">OLQ Alignment</h4>
                    <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
                      Internalizing the 15 Officer-Like Qualities into your everyday lifestyle rather than memorizing definitions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. PROPOSED PROGRAMMES DISCOVERY PREVIEW ── */}
      <section className="relative">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">
            <div>
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-brand-gold font-semibold">
                Proposed Curriculum Offerings
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-text mt-2">
                Structured Aspirant Development
              </h2>
            </div>
            <Link
              to="/programmes"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-brand-gold hover:text-brand-goldLight transition-colors"
            >
              View all 8 programme categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {previewProgrammes.map((prog) => (
              <div 
                key={prog.id}
                className="flex flex-col justify-between p-7 xl:p-8 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-all duration-300 shadow-card hover:-translate-y-1.5"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-brand-steelLight bg-brand-bgSecondary px-2.5 py-1 rounded-md">
                    {prog.category}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-brand-text mt-4 mb-2.5">
                    {prog.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed mb-6 line-clamp-3">
                    {prog.shortDescription}
                  </p>
                </div>
                <div className="pt-5 border-t border-brand-border">
                  <div className="flex items-center justify-between text-xs text-brand-steelLight mb-4 font-mono">
                    <span>{prog.suitableAspirantLevel}</span>
                    <span>{prog.keyModules.length} Modules</span>
                  </div>
                  <Link
                    to="/programmes"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-brand-bgSecondary hover:bg-brand-cardHover border border-brand-border text-brand-text transition-colors"
                  >
                    Programme Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. LEARNING RESOURCE LIBRARY TEASER ── */}
      <section className="relative">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">
            <div>
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-brand-gold font-semibold">
                Knowledge & Frameworks
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-text mt-2">
                Self-Paced Learning Materials
              </h2>
            </div>
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-brand-gold hover:text-brand-goldLight transition-colors"
            >
              Browse complete library
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-10">
            {previewResources.map((res) => (
              <div 
                key={res.id}
                className="flex flex-col justify-between p-7 xl:p-9 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-steelLight/50 transition-all duration-300 shadow-card hover:-translate-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-md">
                      {res.category}
                    </span>
                    <span className="text-xs font-mono text-brand-steelLight flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {res.estimatedReadTime}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-brand-text mb-3 line-clamp-2">
                    {res.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed mb-6 line-clamp-3">
                    {res.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-brand-border">
                  <Link
                    to="/resources"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-gold hover:underline"
                  >
                    Read framework
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FREQUENTLY ASKED QUESTIONS ACCORDION ── */}
      <section className="relative">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-brand-gold font-semibold">
              Clarity & Transparency
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-text mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-brand-textMuted mt-3">
              Straightforward answers regarding mentorship, expectations, and the SSB mindset.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {previewFaqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden transition-colors shadow-md"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-heading font-semibold text-base sm:text-lg text-brand-text">
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-brand-gold shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-brand-textMuted leading-relaxed border-t border-brand-border/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2.5 text-sm font-semibold text-brand-steelLight hover:text-brand-text transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-brand-gold" />
              View all frequently asked questions
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. FINAL EDITORIAL CTA ── */}
      <section className="relative">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="p-10 md:p-16 lg:p-20 xl:p-24 rounded-3xl bg-gradient-to-r from-brand-card via-brand-bgSecondary to-brand-card border border-brand-borderGold/40 text-center relative overflow-hidden shadow-2xl">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-brand-gold font-semibold">
              Your Evolution Starts Today
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-text mt-3 mb-5">
              Stop Rehearsing. Start Transforming.
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-brand-textMuted max-w-3xl mx-auto mb-10 leading-relaxed">
              Experience authentic preparation built on physical discipline, intellectual clarity, and genuine character evolution.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <Link
                to="/journey"
                className="px-8 py-4 rounded-xl text-sm sm:text-base font-semibold bg-brand-gold hover:bg-brand-goldLight text-brand-lightText transition-all duration-200 shadow-gold-subtle transform hover:-translate-y-1"
              >
                Read The 5 Attempts Timeline
              </Link>
              <Link
                to="/student/login"
                className="px-8 py-4 rounded-xl text-sm sm:text-base font-semibold bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-text transition-all duration-200 transform hover:-translate-y-1"
              >
                Access Aspirant Practice Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
