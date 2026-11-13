import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, Shield, CheckCircle2, Send, MessageSquare, 
  AlertCircle, Sparkles, UserCheck, ArrowRight, Clock 
} from 'lucide-react';
import { mentorStats } from '../../data/journeyData';
import { useToast } from '../../context/ToastContext';

export const StoriesPage: React.FC = () => {
  const { showToast } = useToast();
  
  // Submission form state
  const [candidateName, setCandidateName] = useState('');
  const [boardAttended, setBoardAttended] = useState('');
  const [entryType, setEntryType] = useState('CDSE');
  const [attemptOutcome, setAttemptOutcome] = useState('Conferenced Out');
  const [keyLessonLearned, setKeyLessonLearned] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !keyLessonLearned.trim()) {
      showToast('Please fill out all required story fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your journey debrief was submitted for verification preview!', 'success');
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-24">
      {/* 1. Header Section */}
      <section className="relative pt-12 md:pt-20 border-b border-brand-border pb-16">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-gold/15 text-brand-gold text-xs font-mono uppercase tracking-widest font-semibold">
            Authentic Aspirant Chronicles
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-text max-w-4xl leading-tight">
            Real Experiences. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-text via-brand-goldLight to-brand-gold">
              Zero Fabricated Testimonials.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-brand-textMuted max-w-3xl leading-relaxed">
            In an industry flooded with manufactured selection numbers, rented uniforms, and scripted student praises, SSB BRO stands unconditionally on authentic, verifiable journeys.
          </p>
        </div>
      </section>

      {/* 2. Philosophy on Authentic Stories */}
      <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="rounded-2xl bg-brand-bgSecondary border border-brand-border p-8 md:p-12 space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">
              Our Ethical Standard
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
              Why Fake Testimonials Destroy Aspirants
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-brand-textMuted leading-relaxed">
            <div className="p-5 rounded-xl bg-brand-card border border-brand-border space-y-2">
              <div className="font-bold text-brand-text text-sm">
                False Expectations
              </div>
              <p>
                Claiming "100% recommendation rates" blinds aspirants to the reality that 85% of candidates are screened or conferenced out. Realistic preparation prepares you for setbacks.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-brand-card border border-brand-border space-y-2">
              <div className="font-bold text-brand-text text-sm">
                Respecting the Uniform
              </div>
              <p>
                Commissioning into the Armed Forces is a sacred national honour. Claiming someone else\'s hard-won recommendation for marketing commercial courses degrades that dignity.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-brand-card border border-brand-border space-y-2">
              <div className="font-bold text-brand-text text-sm">
                Learning From Failure
              </div>
              <p>
                The deepest wisdom in SSB comes from conference-out debriefs. Documenting how someone recovered from multiple washouts helps future aspirants far more than hollow bragging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Personal Journey: Lt. Vamshi E. */}
      <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
        <div className="border-b border-brand-border pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">
              Featured Verified Journey
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text mt-1">
              The 5-Attempt Blueprint
            </h2>
          </div>
          <span className="text-xs text-brand-steelLight font-mono">
            Directly from Mentor's Personal Account
          </span>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-brand-card via-brand-bgSecondary to-brand-card border border-brand-borderGold p-8 sm:p-10 space-y-6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-brand-border/60 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-brand-gold tracking-wider">
                Founder & Mentor
              </span>
              <h3 className="font-heading text-2xl font-bold text-brand-text">
                Lt. Vamshi E.
              </h3>
              <p className="text-xs text-brand-steelLight font-mono">
                AIR 34 • CDS 2 2019 | Recommended at 3 AFSB Gandhinagar | Indian Military Academy
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-brand-bg border border-brand-border text-center">
                <span className="text-[10px] text-brand-textMuted uppercase font-mono block">Attempts</span>
                <span className="text-sm font-bold text-brand-text font-mono">5 Total</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-brand-bg border border-brand-border text-center">
                <span className="text-[10px] text-brand-textMuted uppercase font-mono block">Conferences Out</span>
                <span className="text-sm font-bold text-red-400 font-mono">4 Times</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-brand-bg border border-brand-border text-center">
                <span className="text-[10px] text-brand-textMuted uppercase font-mono block">Recommendation</span>
                <span className="text-sm font-bold text-brand-gold font-mono">Chest No. 50</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm text-brand-textMuted leading-relaxed">
            <p>
              "My journey spanned nearly two years across Mysore, Varanasi, and Gandhinagar. I began in 2017 with no military pedigree, lost 22 kg under an Ex-Army mentor, attended an SSB weeks after my father's tragic death, saw an entire batch washed out, and had to pivot to the Army when substandard eyesight closed the cockpit door on my fighter pilot dream."
            </p>
            <p>
              "The turning point came when I stopped trying to impress the psychologist with heroic fairy tales and simply wrote realistic, authentic stories reflecting real life. If you are facing conference-outs today, do not lose heart; your transformation is already taking shape."
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/journey"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-gold hover:text-brand-goldLight uppercase tracking-wider"
            >
              Read Complete Attempt-by-Attempt Breakdown
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Empty-State for Future Verified Student Stories */}
      <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
        <div className="border-b border-brand-border pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">
            Aspirant Community Roster
          </span>
          <h2 className="font-heading text-2xl font-bold text-brand-text mt-1">
            Student Verified Recommendations
          </h2>
        </div>

        <div className="p-12 rounded-2xl bg-brand-bgSecondary border border-dashed border-brand-border text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-brand-card border border-brand-border flex items-center justify-center mx-auto text-brand-steelLight">
            <Shield className="w-6 h-6" />
          </div>

          <h3 className="font-heading font-bold text-lg text-brand-text">
            No Fabricated Student Stories
          </h3>

          <p className="text-xs sm:text-sm text-brand-textMuted max-w-lg mx-auto leading-relaxed">
            As SSB BRO is currently in its platform prototype phase, we deliberately display <strong>zero manufactured candidate results</strong>. When our upcoming cohort members attend their boards, their authentic, verified debriefs will be published here with full transparency.
          </p>

          <span className="inline-block text-[11px] font-mono text-brand-steelLight bg-brand-card px-3 py-1 rounded border border-brand-border">
            Cohort 1 Enrollment Opening Soon
          </span>
        </div>
      </section>

      {/* 5. Story Submission Form Placeholder */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-brand-card border border-brand-border p-8 sm:p-10 space-y-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-gold font-semibold">
              Share Your Journey
            </span>
            <h3 className="font-heading text-2xl font-bold text-brand-text">
              Submit Your SSB Experience Debrief
            </h3>
            <p className="text-xs text-brand-textMuted leading-relaxed">
              Have you attended a Services Selection Board recently? Whether screened-in, conferenced-out, or recommended, share your genuine learnings to help fellow aspirants.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-brand-bgSecondary border border-brand-gold/40 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-brand-gold mx-auto" />
              <h4 className="font-heading font-bold text-base text-brand-text">
                Thank You, Aspirant!
              </h4>
              <p className="text-xs text-brand-textMuted leading-relaxed max-w-md mx-auto">
                Your debrief has been recorded locally in this concept demo. In the live platform, submissions undergo factual verification before publication.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-brand-gold hover:underline font-mono"
              >
                Submit another story
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitStory} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-text font-medium mb-1.5 font-mono">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arjun S."
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-brand-text font-medium mb-1.5 font-mono">
                    Board Attended *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2 AFSB Mysore, 22 SSB Bhopal"
                    value={boardAttended}
                    onChange={(e) => setBoardAttended(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-text font-medium mb-1.5 font-mono">
                    Entry Type
                  </label>
                  <select
                    value={entryType}
                    onChange={(e) => setEntryType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text focus:outline-none"
                  >
                    <option value="CDSE">CDSE (IMA / OTA / AFA / INA)</option>
                    <option value="AFCAT">AFCAT (Flying / Ground)</option>
                    <option value="NDA">NDA</option>
                    <option value="TGC/Tech">TGC / SSC Tech</option>
                    <option value="NCC">NCC Special Entry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-brand-text font-medium mb-1.5 font-mono">
                    Attempt Outcome
                  </label>
                  <select
                    value={attemptOutcome}
                    onChange={(e) => setAttemptOutcome(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text focus:outline-none"
                  >
                    <option value="Conferenced Out">Conferenced Out</option>
                    <option value="Screened Out">Screened Out (Stage 1)</option>
                    <option value="Recommended">Recommended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-brand-text font-medium mb-1.5 font-mono">
                  Key Lesson or Diagnostic Insight *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="What was the single most valuable lesson you learned about yourself during this board?"
                  value={keyLessonLearned}
                  onChange={(e) => setKeyLessonLearned(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg text-xs font-semibold bg-brand-gold text-brand-lightText hover:bg-brand-goldLight transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Story for Verification Preview
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};
