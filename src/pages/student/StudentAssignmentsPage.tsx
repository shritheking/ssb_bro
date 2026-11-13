import React, { useState } from 'react';
import { 
  CheckSquare, Clock, AlertCircle, CheckCircle2, 
  Send, FileText, X, ArrowRight, MessageSquare 
} from 'lucide-react';
import { initialAssignments, AssignmentItem } from '../../data/mockStudentData';
import { useToast } from '../../context/ToastContext';

export const StudentAssignmentsPage: React.FC = () => {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<AssignmentItem[]>(() => {
    const saved = localStorage.getItem('ssb_student_assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Submitted' | 'Reviewed'>('All');
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentItem | null>(null);
  const [submissionText, setSubmissionText] = useState('');

  const filtered = activeTab === 'All'
    ? assignments
    : assignments.filter(a => a.status === activeTab);

  const handleOpenSubmit = (asg: AssignmentItem) => {
    setSelectedAssignment(asg);
    setSubmissionText(asg.userSubmission || '');
  };

  const handleSaveSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim()) {
      showToast('Please enter your submission text or response.', 'error');
      return;
    }

    if (!selectedAssignment) return;

    const updated = assignments.map(a => {
      if (a.id === selectedAssignment.id) {
        return {
          ...a,
          status: 'Submitted' as const,
          submittedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userSubmission: submissionText,
        };
      }
      return a;
    });

    setAssignments(updated);
    localStorage.setItem('ssb_student_assignments', JSON.stringify(updated));
    setSelectedAssignment(null);
    showToast(`Assignment "${selectedAssignment.title}" submitted successfully for mentor review!`, 'success');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-brand-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider">
            Evaluation Deliverables
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Assignments & Submissions
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted">
            Submit your psychological dossiers, PIQ audit forms, and elocution transcripts for mentor calibration.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-brand-bgSecondary border border-brand-border">
          {(['All', 'Pending', 'Submitted', 'Reviewed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-brand-gold text-brand-lightText shadow-gold-subtle'
                  : 'text-brand-textMuted hover:text-brand-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {filtered.map((asg) => (
          <div
            key={asg.id}
            className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-brand-gold/40 transition-all duration-300 shadow-card"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase ${
                    asg.status === 'Pending'
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                      : asg.status === 'Submitted'
                      ? 'bg-brand-steelMuted text-brand-steelLight border border-brand-steelLight/30'
                      : 'bg-green-950/60 text-green-300 border border-green-500/30'
                  }`}
                >
                  {asg.status}
                </span>
                <span className="text-xs font-mono text-brand-textMuted">
                  Due: <strong className="text-brand-text">{asg.dueDate}</strong>
                </span>
              </div>

              <h3 className="font-heading font-bold text-lg text-brand-text">
                {asg.title}
              </h3>

              <p className="text-xs text-brand-steelLight font-mono">
                Course: {asg.programmeTitle}
              </p>

              <p className="text-xs text-brand-textMuted leading-relaxed pt-1">
                {asg.instructions}
              </p>

              {asg.mentorFeedback && (
                <div className="mt-3 p-3.5 rounded-xl bg-brand-bgSecondary border border-brand-borderGold/30 text-xs space-y-1">
                  <div className="text-[10px] font-mono text-brand-gold uppercase font-semibold flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3" />
                    Mentor Review ({asg.gradeScore}):
                  </div>
                  <p className="text-brand-text/90 italic">
                    "{asg.mentorFeedback}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex lg:flex-col items-center justify-end gap-3 shrink-0">
              {asg.status === 'Pending' ? (
                <button
                  onClick={() => handleOpenSubmit(asg)}
                  className="px-5 py-2.5 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center gap-2 transition-colors shadow-gold-subtle"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Assignment
                </button>
              ) : (
                <button
                  onClick={() => handleOpenSubmit(asg)}
                  className="px-5 py-2.5 rounded-lg bg-brand-bgSecondary hover:bg-brand-bg border border-brand-border text-brand-text text-xs font-medium transition-colors"
                >
                  View / Edit Submission
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedAssignment(null)}
        >
          <div 
            className="bg-brand-bgSecondary border border-brand-borderGold max-w-2xl w-full rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-brand-border pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-brand-gold">
                  Assignment Submission Demo
                </span>
                <h3 className="font-heading text-xl font-bold text-brand-text mt-0.5">
                  {selectedAssignment.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1 rounded-md text-brand-textMuted hover:text-brand-text"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-brand-card border border-brand-border text-xs text-brand-textMuted space-y-1">
              <span className="font-mono text-brand-text block font-bold uppercase">Instructions:</span>
              <p>{selectedAssignment.instructions}</p>
            </div>

            <form onSubmit={handleSaveSubmission} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-text font-mono font-bold mb-1.5">
                  Your Response / Submission Content *
                </label>
                <textarea
                  rows={6}
                  required
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Paste or write your assignment text here..."
                  className="w-full p-4 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-brand-border">
                <span className="text-[11px] font-mono text-brand-steelLight">
                  * Persists locally to demo storage
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedAssignment(null)}
                    className="px-4 py-2 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-text font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText font-semibold flex items-center gap-2 shadow-gold-subtle"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Save & Submit for Review
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
