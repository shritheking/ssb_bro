import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Compass, Target, Award, Flame, Heart, 
  ArrowRight, BookOpen, CheckCircle2, ChevronRight, UserCheck 
} from 'lucide-react';
import { mentorStats } from '../../data/journeyData';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-20 md:space-y-28 pb-20 overflow-x-hidden">
      
      {/* 1. Header / Hero Banner */}
      <section className="relative pt-8 sm:pt-14 md:pt-20 border-b border-brand-border/60 pb-12 sm:pb-16">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-gold/15 text-brand-gold text-xs font-mono uppercase tracking-widest font-semibold">
            About SSB BRO & Mentorship Origin
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-text max-w-4xl leading-tight">
            Beyond Preparation. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-text via-brand-goldLight to-brand-gold">
              A Journey of Transformation.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-brand-textMuted max-w-2xl leading-relaxed font-sans">
            The story behind SSB BRO is not rooted in traditional classroom commercial coaching, but in the authentic, real-world crucible of five SSB attempts, personal loss, a 22 kg physical transformation, and ultimate recommendation.
          </p>
        </div>
      </section>

      {/* ── 2. FEATURED HERO MENTOR PROFILE COMPOSITION WITH AUTHENTIC PHOTOGRAPHY ── */}
      <section className="relative">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="rounded-2xl sm:rounded-3xl bg-brand-bgSecondary border border-brand-border/80 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              
              {/* Left: Verified Officer Portrait with responsive aspect ratio */}
              <div className="lg:col-span-5 relative w-full bg-brand-card flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="relative w-full max-w-sm lg:max-w-none rounded-xl overflow-hidden border border-brand-borderGold/40 shadow-xl bg-brand-bg">
                  <img
                    src="/images/mentor-portrait.jpg"
                    alt="Lt. Vamshi E. Official Uniform Portrait"
                    className="w-full h-auto max-h-[520px] object-contain object-center brightness-95 contrast-105 mx-auto"
                  />
                  {/* Subtle verified badge on photo */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-brand-dark/90 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-md">
                    <Shield className="w-3.5 h-3.5 text-brand-gold" />
                    <span className="text-[11px] font-mono text-white font-semibold">Verified Officer</span>
                  </div>
                </div>
              </div>

              {/* Right: Personal Credential Narrative */}
              <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-5 sm:space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-brand-gold font-semibold">
                    Founder & Concept Mentor
                  </span>
                  <h2 className="font-heading text-2xl sm:text-4xl font-bold text-brand-text mt-1">
                    Lt. Vamshi E.
                  </h2>
                  <p className="text-xs sm:text-sm font-mono text-brand-steelLight mt-1">
                    AIR 34 · CDS 2 2019 (IMA) · Recommended at 3 AFSB Gandhinagar (Chest No. 50)
                  </p>
                </div>

                <p className="text-sm sm:text-base text-brand-textMuted leading-relaxed">
                  "I was not a born topper, nor did I have a military lineage. In 2017, I was overweight, unfocused, and unsure of my direction. It took 5 SSB attempts, an intense 22 kg fitness transformation under an Ex-Army mentor, and facing devastating personal tragedy to realize what the Services Selection Board truly demands: <strong>unflinching authenticity and mental fortitude</strong>."
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-brand-card border border-brand-border">
                    <p className="text-brand-textMuted text-[10px] uppercase">Attempts</p>
                    <p className="text-lg font-bold text-brand-text font-heading mt-0.5">5 Boards</p>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-card border border-brand-border">
                    <p className="text-brand-textMuted text-[10px] uppercase">Merit Rank</p>
                    <p className="text-lg font-bold text-brand-gold font-heading mt-0.5">AIR 34</p>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-card border border-brand-border col-span-2 sm:col-span-1">
                    <p className="text-brand-textMuted text-[10px] uppercase">Fitness Shift</p>
                    <p className="text-lg font-bold text-brand-steelLight font-heading mt-0.5">-22 kg Lost</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/journey"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-gold hover:text-brand-goldLight transition-colors"
                  >
                    Explore all 5 SSB attempts in the interactive timeline
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 3. THE 22 KG TRANSFORMATION SHOWCASE (REAL BEFORE & AFTER) ── */}
      <section className="relative">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-gold font-semibold">
              The Physical Crucible
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-brand-text">
              The 22 kg Fitness Transformation
            </h2>
            <p className="text-sm sm:text-base text-brand-textMuted leading-relaxed">
              Discipline is not theoretical. Under an Ex-Army mentor, daily running, track drills, and gym workouts reshaped his mindset from giving excuses to relentless execution.
            </p>
          </div>

          {/* Before & After Responsive Photo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl xl:max-w-6xl mx-auto">
            
            {/* Before Card */}
            <div className="rounded-2xl sm:rounded-3xl bg-brand-card border border-brand-border overflow-hidden shadow-2xl flex flex-col group hover:-translate-y-1 transition-transform">
              <div className="relative w-full aspect-[3/4] max-h-[520px] bg-brand-bg flex items-center justify-center overflow-hidden">
                <img
                  src="/images/transformation-before.jpg"
                  alt="Lt. Vamshi E. Before Fitness Transformation in Dec 2018"
                  className="w-full h-full object-contain sm:object-cover object-top brightness-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 text-xs font-mono text-brand-text font-bold">
                  December 2018
                </div>
              </div>
              <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-brand-text">The Starting Point</h3>
                  <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed mt-1.5">
                    Unconditioned, struggling with endurance, and weighed down by complacency. Like many aspirants, fitness was an afterthought until reality struck.
                  </p>
                </div>
                <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs font-mono text-brand-steelLight">
                  <span>Pre-Transformation</span>
                  <span className="text-red-400 font-semibold">Excuses Phase</span>
                </div>
              </div>
            </div>

            {/* After Card */}
            <div className="rounded-2xl sm:rounded-3xl bg-brand-card border border-brand-borderGold/60 overflow-hidden shadow-2xl flex flex-col relative group hover:-translate-y-1 transition-transform">
              <div className="relative w-full aspect-[3/4] max-h-[520px] bg-brand-bg flex items-center justify-center overflow-hidden">
                <img
                  src="/images/transformation-after.jpg"
                  alt="Lt. Vamshi E. After 22kg Fitness Transformation - Ready for SSB"
                  className="w-full h-full object-contain sm:object-cover object-top brightness-95 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-lg bg-brand-gold text-brand-dark font-mono text-xs font-bold shadow-md">
                  22 kg Lost in 3 Months
                </div>
              </div>
              <div className="p-5 sm:p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-brand-text">Conditioned for Leadership</h3>
                  <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed mt-1">
                    Disciplined morning road work, daily push-ups, and calisthenics built the physical poise and psychological grit needed to clear 8 obstacles at 3 AFSB even after falling from the tyre obstacle.
                  </p>
                </div>
                <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs font-mono text-brand-gold">
                  <span>Mentally Resilient</span>
                  <span className="font-semibold">"Discipline Is All It Takes"</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 4. WHAT IS SSB BRO? & CORE PILLARS ── */}
      <section className="relative">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-gold font-semibold">
                The Core Philosophy
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-bold text-brand-text">
                What is SSB BRO?
              </h2>
              <p className="text-brand-textMuted text-sm sm:text-base leading-relaxed">
                <strong>SSB BRO</strong> is a proposed aspirant development platform designed by NextGen Web Studio to formalize and scale the mentorship principles practiced by Lt. Vamshi E.
              </p>
              <p className="text-brand-textMuted text-sm sm:text-base leading-relaxed">
                Most defence aspirants approach the Services Selection Board as an examination that can be "cleverly solved" through memorized scripts, exaggerated psychological stories, and superficial body language mimicry. SSB BRO rejects this artificial approach entirely.
              </p>
              <p className="text-brand-textMuted text-sm sm:text-base leading-relaxed">
                We believe that an aspirant becomes an officer in their daily routine months before stepping into the selection centre. When daily discipline, honest self-awareness, vocal clarity, and emotional resilience become habitual, the 5-day assessment takes care of itself.
              </p>
            </div>

            <div className="lg:col-span-6 bg-brand-bgSecondary border border-brand-border rounded-2xl p-6 sm:p-8 space-y-5">
              <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-text flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-gold" />
                The Guiding Pillars
              </h3>

              <div className="space-y-3.5 text-sm">
                <div className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-1">
                  <div className="font-semibold text-brand-gold text-xs uppercase tracking-wider font-mono">
                    Pillar 1: Authentic Self-Knowledge
                  </div>
                  <p className="text-xs text-brand-textMuted leading-relaxed">
                    Knowing your real flaws and strengths without defensiveness or self-aggrandizing coaching scripts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-1">
                  <div className="font-semibold text-brand-steelLight text-xs uppercase tracking-wider font-mono">
                    Pillar 2: Physical & Mental Fortitude
                  </div>
                  <p className="text-xs text-brand-textMuted leading-relaxed">
                    Physical stamina builds psychological grit. Daily workouts and endurance create poise during stressful testing.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-1">
                  <div className="font-semibold text-brand-goldLight text-xs uppercase tracking-wider font-mono">
                    Pillar 3: Mansa, Vacha, Karmana Consistency
                  </div>
                  <p className="text-xs text-brand-textMuted leading-relaxed">
                    Harmony between what you genuinely think (psychology), what you speak (interview), and how you act (GTO ground tasks).
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. WHY GUIDE DEFENCE ASPIRANTS? ── */}
      <section className="relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-gold font-semibold">
              The Mission
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-brand-text">
              Why Guide Defence Aspirants?
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-border space-y-5 sm:space-y-6">
            <p className="text-sm sm:text-base text-brand-textMuted leading-relaxed">
              Having stood in the reporting lines five times—experiencing the sinking feeling of a conference-out call, coping with the tragic bereavement of his father on the morning of an SSB, sitting through a complete batch washout, and navigating the emotional gut-punch of being medically deferred for flying—Vamshi understands what aspirants endure.
            </p>
            <p className="text-sm sm:text-base text-brand-textMuted leading-relaxed">
              Most aspirants fail not because they lack intelligence or bravery, but because they are misled by commercial coaching factories that teach them to suppress their authentic personality in favour of robotic scripts.
            </p>
            <blockquote className="p-5 sm:p-6 rounded-xl bg-brand-bgSecondary border-l-4 border-brand-gold text-brand-text italic editorial-quote text-sm sm:text-base leading-relaxed">
              "I want to show aspirants that setbacks are merely feedback. If you are willing to face yourself in the mirror every morning, do the physical work, read with curiosity, and speak with authenticity, the board will see an officer in you."
            </blockquote>
            <p className="text-xs text-brand-steelLight font-mono">
              — Lt. Vamshi E., Concept Mentor for SSB BRO
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA ── */}
      <section className="relative">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="rounded-2xl bg-brand-bgSecondary border border-brand-border p-8 md:p-12 text-center space-y-5 sm:space-y-6">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
              Ready to Explore the Journey in Detail?
            </h2>
            <p className="text-xs sm:text-sm text-brand-textMuted max-w-xl mx-auto leading-relaxed">
              Read the unfiltered breakdown of all five attempts, board stats, and personal turning points on the interactive journey timeline.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/journey"
                className="px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold bg-brand-gold text-brand-lightText hover:bg-brand-goldLight transition-colors shadow-gold-subtle"
              >
                Read The 5 Attempts Timeline
              </Link>
              <Link
                to="/programmes"
                className="px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold bg-brand-card border border-brand-border hover:border-brand-steelLight text-brand-text transition-colors"
              >
                View Proposed Programmes
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
