import React, { useState } from 'react';
import { Layers, Calendar, Users, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminBatchesPage: React.FC = () => {
  const { showToast } = useToast();

  const [batches, setBatches] = useState([
    {
      id: 'batch-01',
      name: 'Alpha Cohort: CDSE & AFCAT Stage 2 Diagnostics',
      programme: 'SSB Foundation & Psychology Mastery',
      startDate: 'Dec 01, 2026',
      status: 'Open for Registration (Concept)',
      enrolledAspirants: 4,
      capacity: 10,
    },
    {
      id: 'batch-02',
      name: 'Bravo Cohort: GTO Outdoor Ground & Cantilevers',
      programme: 'GTO Task Preparation',
      startDate: 'Dec 15, 2026',
      status: 'Proposed Planning',
      enrolledAspirants: 2,
      capacity: 8,
    },
    {
      id: 'batch-03',
      name: 'Charlie Cohort: Conferenced-Out Repeater Clinic',
      programme: 'Personal Mentorship & Strategic Review',
      startDate: 'Jan 05, 2027',
      status: 'Proposed Planning',
      enrolledAspirants: 1,
      capacity: 5,
    }
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-brand-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider">
            Cohort Planning
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Mentorship Batches & Cohorts
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted">
            Proposed cohort timelines and aspirant seat allocation management.
          </p>
        </div>

        <button
          onClick={() => showToast('Batch creation modal simulated for demo', 'info')}
          className="px-4 py-2 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center gap-2 transition-colors shadow-gold-subtle shrink-0"
        >
          <Plus className="w-4 h-4" />
          Propose New Cohort
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {batches.map((b) => (
          <div
            key={b.id}
            className="p-6 rounded-2xl bg-brand-card border border-brand-border space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-brand-gold font-bold">{b.status}</span>
              <span className="text-brand-steelLight">{b.startDate}</span>
            </div>

            <h3 className="font-heading font-bold text-base text-brand-text leading-snug">
              {b.name}
            </h3>

            <p className="text-xs text-brand-textMuted">
              Assigned Pathway: <strong className="text-brand-text">{b.programme}</strong>
            </p>

            <div className="pt-2 border-t border-brand-border space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-brand-textMuted">Enrolled Demo Seats:</span>
                <span className="text-brand-gold font-bold">{b.enrolledAspirants} / {b.capacity}</span>
              </div>
              <div className="w-full bg-brand-bg h-2 rounded-full overflow-hidden border border-brand-border">
                <div
                  className="bg-brand-gold h-full rounded-full"
                  style={{ width: `${(b.enrolledAspirants / b.capacity) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
