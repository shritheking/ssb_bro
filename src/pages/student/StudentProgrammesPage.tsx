import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, Clock, ChevronRight, Play, Award, Sparkles } from 'lucide-react';
import { initialEnrolledProgrammes, EnrolledProgramme } from '../../data/mockStudentData';
import { useToast } from '../../context/ToastContext';

export const StudentProgrammesPage: React.FC = () => {
  const { showToast } = useToast();
  const [programmes, setProgrammes] = useState<EnrolledProgramme[]>(initialEnrolledProgrammes);
  const [selectedProgramme, setSelectedProgramme] = useState<EnrolledProgramme | null>(null);

  const handleContinueModule = (prog: EnrolledProgramme) => {
    showToast(`Launching ${prog.title} — Module: ${prog.currentModule}`, 'info');
    setSelectedProgramme(prog);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-brand-border pb-4">
        <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider">
          Cohort Curriculum
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
          My Enrolled Programmes
        </h1>
        <p className="text-xs sm:text-sm text-brand-textMuted">
          Track your module completion across Foundation, Psychology, and Self-Description frameworks.
        </p>
      </div>

      {/* Programme Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {programmes.map((prog) => (
          <div
            key={prog.id}
            className="rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col justify-between hover:border-brand-gold/40 transition-all duration-300 shadow-card"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-bg text-brand-steelLight uppercase">
                  {prog.category}
                </span>
                <span className="text-xs font-mono font-bold text-brand-gold">
                  {prog.progressPercent}%
                </span>
              </div>

              <h2 className="font-heading font-bold text-lg text-brand-text leading-snug">
                {prog.title}
              </h2>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-brand-bg h-2 rounded-full overflow-hidden border border-brand-border">
                  <div
                    className="bg-brand-gold h-full rounded-full transition-all duration-500"
                    style={{ width: `${prog.progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-brand-textMuted font-mono">
                  <span>{prog.completedModules} of {prog.totalModules} modules</span>
                  <span>Active {prog.lastActive}</span>
                </div>
              </div>

              {/* Current module banner */}
              <div className="p-3 rounded-xl bg-brand-bgSecondary border border-brand-border space-y-1">
                <span className="text-[10px] font-mono uppercase text-brand-gold font-semibold block">
                  Next Up:
                </span>
                <p className="text-xs font-medium text-brand-text">
                  {prog.currentModule}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-border mt-6">
              <button
                onClick={() => handleContinueModule(prog)}
                className="w-full py-2.5 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-gold-subtle"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Continue Learning
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Module Curriculum Breakdown Modal / Viewer */}
      {selectedProgramme && (
        <div className="rounded-2xl bg-brand-bgSecondary border border-brand-borderGold p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-brand-gold">
                Module Breakdown
              </span>
              <h3 className="font-heading font-bold text-xl text-brand-text mt-0.5">
                {selectedProgramme.title}
              </h3>
            </div>
            <button
              onClick={() => setSelectedProgramme(null)}
              className="px-3 py-1.5 rounded bg-brand-card hover:bg-brand-cardHover border border-brand-border text-xs text-brand-text"
            >
              Close Viewer
            </button>
          </div>

          <div className="space-y-3">
            {[
              { num: '01', title: 'Core Principles & Assessor Psychology', status: 'Completed' },
              { num: '02', title: 'Deconstructing Mansa, Vacha, and Karmana', status: 'Completed' },
              { num: '03', title: selectedProgramme.currentModule, status: 'In Progress' },
              { num: '04', title: 'Subconscious Stress Simulation Drills', status: 'Locked' },
              { num: '05', title: 'Peer Review & Mentor Feedback Calibration', status: 'Locked' },
            ].map((mod) => (
              <div
                key={mod.num}
                className="p-4 rounded-xl bg-brand-card border border-brand-border flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-brand-steelLight">
                    {mod.num}
                  </span>
                  <span className="text-xs font-medium text-brand-text">
                    {mod.title}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded ${
                    mod.status === 'Completed'
                      ? 'bg-green-950/60 text-green-400 border border-green-500/30'
                      : mod.status === 'In Progress'
                      ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/40'
                      : 'bg-brand-bg text-brand-textMuted'
                  }`}
                >
                  {mod.status}
                </span>
              </div>
            ))}
          </div>

          <div className="text-xs text-brand-textMuted font-mono">
            * Interactive Prototype: Module navigation simulated for demonstration purposes.
          </div>
        </div>
      )}
    </div>
  );
};
