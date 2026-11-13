import React from 'react';
import { 
  TrendingUp, Award, Flame, CheckCircle2, Shield, 
  Clock, AlertTriangle, Calendar, Layers 
} from 'lucide-react';

export const StudentProgressPage: React.FC = () => {
  const olqSkillIndicators = [
    { name: 'Effective Intelligence & Reasoning (OIR)', score: 88, factor: 'Factor I: Planning' },
    { name: 'Power of Expression (Elocution / GD)', score: 78, factor: 'Factor I: Planning' },
    { name: 'Social Adaptability & Cooperation', score: 82, factor: 'Factor II: Social Adjustment' },
    { name: 'Initiative & Decision Speed (GTO Ground)', score: 74, factor: 'Factor III: Social Effectiveness' },
    { name: 'Determination & Physical Stamina (Obstacles)', score: 86, factor: 'Factor IV: Dynamic Factor' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-brand-border pb-4">
        <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider">
          Aspirant Development Tracking
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
          My Preparation Progress
        </h1>
        <p className="text-xs sm:text-sm text-brand-textMuted">
          Self-reflection metrics and weekly practice consistency indicators.
        </p>
      </div>

      {/* Critical Advisory Notice */}
      <div className="p-4 rounded-xl bg-brand-bgSecondary border border-brand-border flex items-start gap-3 text-xs text-brand-steelLight">
        <AlertTriangle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-brand-gold uppercase font-mono">Important Advisory:</span> These progress metrics reflect habit consistency, assignment completion, and simulated exercises. They do not predict or guarantee actual Services Selection Board recommendations.
        </div>
      </div>

      {/* Top Habit Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-2">
          <span className="text-xs font-mono text-brand-textMuted uppercase">Current Streak</span>
          <div className="text-3xl font-heading font-bold text-brand-gold flex items-center gap-2">
            <Flame className="w-5 h-5 text-brand-gold fill-brand-gold" />
            12 Days
          </div>
          <p className="text-xs text-brand-textMuted">Consecutive daily mirror speech & running drills.</p>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-2">
          <span className="text-xs font-mono text-brand-textMuted uppercase">Module Completion</span>
          <div className="text-3xl font-heading font-bold text-brand-text">
            58%
          </div>
          <p className="text-xs text-brand-textMuted">14 of 28 core pathway modules completed.</p>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-2">
          <span className="text-xs font-mono text-brand-textMuted uppercase">Stories Drafted</span>
          <div className="text-3xl font-heading font-bold text-brand-text">
            28 Drills
          </div>
          <p className="text-xs text-brand-textMuted">TAT (14) • WAT (10) • SRT (4)</p>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-2">
          <span className="text-xs font-mono text-brand-textMuted uppercase">Review Score</span>
          <div className="text-3xl font-heading font-bold text-brand-gold">
            8.2 / 10
          </div>
          <p className="text-xs text-brand-textMuted">Average mentor feedback rating.</p>
        </div>
      </div>

      {/* OLQ Self-Reflection Matrix */}
      <div className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-brand-border pb-4 space-y-1">
          <h3 className="font-heading font-bold text-lg text-brand-text">
            Officer-Like Qualities (OLQ) Self-Reflection Indicators
          </h3>
          <p className="text-xs text-brand-textMuted">
            Simulated benchmarks to help you identify personal blind spots across the four assessment factors.
          </p>
        </div>

        <div className="space-y-5">
          {olqSkillIndicators.map((skill) => (
            <div key={skill.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-brand-text font-mono">{skill.name}</span>
                  <span className="text-[10px] text-brand-textMuted block font-mono">{skill.factor}</span>
                </div>
                <span className="font-mono font-bold text-brand-gold">{skill.score}% Readiness</span>
              </div>
              <div className="w-full bg-brand-bg h-2 rounded-full overflow-hidden border border-brand-border">
                <div
                  className="bg-brand-gold h-full rounded-full transition-all duration-700"
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
