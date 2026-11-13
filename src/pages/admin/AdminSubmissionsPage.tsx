import React, { useState } from 'react';
import { FileText, CheckCircle2, Clock, MessageSquare, X, Send } from 'lucide-react';
import { initialAdminSubmissions, AdminSubmission } from '../../data/mockAdminData';
import { useToast } from '../../context/ToastContext';

export const AdminSubmissionsPage: React.FC = () => {
  const { showToast } = useToast();
  const [submissions, setSubmissions] = useState<AdminSubmission[]>(initialAdminSubmissions);
  const [reviewModal, setReviewModal] = useState<AdminSubmission | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [scoreGrade, setScoreGrade] = useState('8.5 / 10');

  const handleOpenReview = (sub: AdminSubmission) => {
    setReviewModal(sub);
    setFeedbackNote(sub.existingFeedback || '');
    setScoreGrade(sub.ratingScore || '8.5 / 10');
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModal) return;

    const updated = submissions.map(s => {
      if (s.id === reviewModal.id) {
        return {
          ...s,
          status: 'Reviewed' as const,
          existingFeedback: feedbackNote,
          ratingScore: scoreGrade,
        };
      }
      return s;
    });

    setSubmissions(updated);
    setReviewModal(null);
    showToast(`Feedback saved for ${reviewModal.aspirantName}!`, 'success');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-brand-border pb-4">
        <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider">
          Aspirant Work Review
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
          Aspirant Submissions
        </h1>
        <p className="text-xs sm:text-sm text-brand-textMuted">
          Review psychological practice stories, elocution transcripts, and write diagnostic calibrations.
        </p>
      </div>

      <div className="space-y-4">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="p-6 rounded-2xl bg-brand-card border border-brand-border flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase ${
                    sub.status === 'Pending Review'
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                      : 'bg-green-950/60 text-green-300 border border-green-500/30'
                  }`}
                >
                  {sub.status}
                </span>
                <span className="text-xs font-mono text-brand-textMuted">
                  Submitted: {sub.submittedAt}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-brand-text">
                  {sub.aspirantName}
                </h3>
                <span className="text-xs text-brand-steelLight font-mono">
                  • {sub.assignmentTitle}
                </span>
              </div>

              <p className="text-xs text-brand-textMuted italic p-3 rounded-xl bg-brand-bgSecondary border border-brand-border">
                "{sub.contentSnippet}"
              </p>

              {sub.existingFeedback && (
                <div className="p-3 rounded-lg bg-brand-bg border border-brand-borderGold/30 text-xs text-brand-gold">
                  <strong>Assigned Review ({sub.ratingScore}):</strong> {sub.existingFeedback}
                </div>
              )}
            </div>

            <button
              onClick={() => handleOpenReview(sub)}
              className="px-5 py-2.5 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center gap-2 transition-colors shadow-gold-subtle shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {sub.status === 'Reviewed' ? 'Edit Evaluation' : 'Write Evaluation'}
            </button>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setReviewModal(null)}
        >
          <div 
            className="bg-brand-bgSecondary border border-brand-borderGold max-w-xl w-full rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-brand-border pb-3">
              <div>
                <span className="text-xs font-mono uppercase text-brand-gold">
                  Mentor Evaluation Note
                </span>
                <h3 className="font-heading font-bold text-lg text-brand-text mt-0.5">
                  {reviewModal.aspirantName} — {reviewModal.assignmentTitle}
                </h3>
              </div>
              <button onClick={() => setReviewModal(null)} className="text-brand-textMuted hover:text-brand-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-brand-card border border-brand-border text-xs text-brand-textMuted italic max-h-36 overflow-y-auto">
              "{reviewModal.contentSnippet}"
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-text font-mono font-medium mb-1">
                  Diagnostic Rating Indicator
                </label>
                <input
                  type="text"
                  value={scoreGrade}
                  onChange={(e) => setScoreGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none focus:border-brand-gold"
                  placeholder="e.g. 8.5 / 10"
                />
              </div>

              <div>
                <label className="block text-brand-text font-mono font-medium mb-1">
                  Mentor Feedback Notes & Observations *
                </label>
                <textarea
                  rows={5}
                  required
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  className="w-full p-3 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none focus:border-brand-gold"
                  placeholder="Constructive feedback on realism, team coordination, or speech clarity..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  className="px-4 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-brand-gold text-brand-lightText font-semibold shadow-gold-subtle flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
