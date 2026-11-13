import React from 'react';
import { 
  MessageSquare, Award, CheckCircle2, AlertCircle, 
  UserCheck, Shield, ChevronRight, Info 
} from 'lucide-react';
import { sampleFeedbackHistory } from '../../data/mockStudentData';

export const StudentFeedbackPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-brand-border pb-4">
        <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider">
          Diagnostic Reviews
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
          Mentor Feedback & Calibrations
        </h1>
        <p className="text-xs sm:text-sm text-brand-textMuted">
          Direct evaluations from Lt. Vamshi E. focusing on eliminating artificial scripts and honing authenticity.
        </p>
      </div>

      {/* Advisory notice */}
      <div className="p-4 rounded-xl bg-brand-bgSecondary border border-brand-border flex items-start gap-3 text-xs text-brand-steelLight">
        <Info className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-brand-gold uppercase font-mono">Demo Notice:</span> All feedback items and score indicators displayed here are sample demonstration evaluations prepared for concept presentation.
        </div>
      </div>

      {/* Feedback Cards */}
      <div className="space-y-6">
        {sampleFeedbackHistory.map((fb) => (
          <div
            key={fb.id}
            className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-8 space-y-6 shadow-xl"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-brand-steelLight block">
                  {fb.date} • Assessor Diagnostic
                </span>
                <h3 className="font-heading font-bold text-lg text-brand-text mt-0.5">
                  {fb.topic}
                </h3>
                <p className="text-xs text-brand-gold font-mono">
                  Reviewer: {fb.reviewer}
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-brand-bgSecondary border border-brand-borderGold/40 text-center shrink-0">
                <span className="text-[10px] font-mono text-brand-textMuted uppercase block">Rating Score</span>
                <span className="text-sm font-heading font-bold text-brand-gold font-mono">{fb.scoreIndicator}</span>
              </div>
            </div>

            {/* Diagnostic Summary */}
            <div className="p-4 rounded-xl bg-brand-bgSecondary border border-brand-border text-sm text-brand-textMuted leading-relaxed italic editorial-quote">
              "{fb.summary}"
            </div>

            {/* Strengths & Improvement Points Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Strengths */}
              <div className="p-4 rounded-xl bg-brand-bg/50 border border-green-500/20 space-y-2">
                <div className="font-mono font-bold text-green-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Key Strengths Observed:
                </div>
                <ul className="space-y-1.5 text-brand-textMuted">
                  {fb.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-green-400 mt-1.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="p-4 rounded-xl bg-brand-bg/50 border border-amber-500/20 space-y-2">
                <div className="font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Refinement & Action Steps:
                </div>
                <ul className="space-y-1.5 text-brand-textMuted">
                  {fb.improvementPoints.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
