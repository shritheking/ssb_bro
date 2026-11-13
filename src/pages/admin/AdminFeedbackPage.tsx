import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Award, UserCheck, Shield } from 'lucide-react';
import { initialAdminAspirants } from '../../data/mockAdminData';
import { sampleFeedbackHistory, FeedbackReview } from '../../data/mockStudentData';
import { useToast } from '../../context/ToastContext';

export const AdminFeedbackPage: React.FC = () => {
  const { showToast } = useToast();
  const [feedbackList, setFeedbackList] = useState<FeedbackReview[]>(() => {
    const saved = localStorage.getItem('ssb_admin_feedback_history');
    return saved ? JSON.parse(saved) : sampleFeedbackHistory;
  });

  const [selectedAspirant, setSelectedAspirant] = useState(initialAdminAspirants[0].name);
  const [topic, setTopic] = useState('TAT Set A Realistic Story Calibration');
  const [score, setScore] = useState('8.4 / 10');
  const [summary, setSummary] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      showToast('Please provide a summary observation', 'error');
      return;
    }

    const newFb: FeedbackReview = {
      id: 'fb-' + Math.random().toString(36).substring(2, 7),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      reviewer: 'Lt. Vamshi E. (Chief Mentor)',
      topic: `${topic} (${selectedAspirant})`,
      summary,
      strengths: strengths.split('\n').filter(s => s.trim()),
      improvementPoints: improvements.split('\n').filter(i => i.trim()),
      scoreIndicator: score,
    };

    const updated = [newFb, ...feedbackList];
    setFeedbackList(updated);
    localStorage.setItem('ssb_admin_feedback_history', JSON.stringify(updated));

    setSummary('');
    setStrengths('');
    setImprovements('');
    showToast(`Mentor calibration saved for ${selectedAspirant}!`, 'success');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-brand-border pb-4">
        <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider">
          Mentor Feedback Center
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
          Write & Log Aspirant Feedback
        </h1>
        <p className="text-xs sm:text-sm text-brand-textMuted">
          Directly log psychological evaluations, elocution notes, and interview diagnostics for aspirants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="font-heading font-bold text-lg text-brand-text flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-gold" />
              Compose Diagnostic Note
            </h3>

            <form onSubmit={handleSaveFeedback} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-text font-mono font-medium mb-1.5">
                    Select Aspirant
                  </label>
                  <select
                    value={selectedAspirant}
                    onChange={(e) => setSelectedAspirant(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border text-brand-text focus:outline-none focus:border-brand-gold"
                  >
                    {initialAdminAspirants.map(a => (
                      <option key={a.id} value={a.name}>{a.name} ({a.targetEntry})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-brand-text font-mono font-medium mb-1.5">
                    Diagnostic Score Indicator
                  </label>
                  <input
                    type="text"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border text-brand-text focus:outline-none focus:border-brand-gold"
                    placeholder="e.g. 8.4 / 10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand-text font-mono font-medium mb-1.5">
                  Exercise / Topic Focus
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border text-brand-text focus:outline-none focus:border-brand-gold"
                  placeholder="e.g. Self-Description Paragraph 3 & Eye Contact Drill"
                />
              </div>

              <div>
                <label className="block text-brand-text font-mono font-medium mb-1.5">
                  General Mentor Observation Summary *
                </label>
                <textarea
                  rows={3}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-3.5 rounded-lg bg-brand-bgSecondary border border-brand-border text-brand-text focus:outline-none focus:border-brand-gold"
                  placeholder="Clear improvement in voice modulation. Eliminated scripted proverbs..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-green-400 font-mono font-medium mb-1.5">
                    Key Strengths (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    className="w-full p-3.5 rounded-lg bg-brand-bgSecondary border border-brand-border text-brand-text focus:outline-none focus:border-green-500/50"
                    placeholder="Realistic resource planning&#10;Poised body posture"
                  />
                </div>

                <div>
                  <label className="block text-amber-300 font-mono font-medium mb-1.5">
                    Action Refinements (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={improvements}
                    onChange={(e) => setImprovements(e.target.value)}
                    className="w-full p-3.5 rounded-lg bg-brand-bgSecondary border border-brand-border text-brand-text focus:outline-none focus:border-amber-500/50"
                    placeholder="Avoid rushing conclusion&#10;Delegate tasks in GTO"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-gold-subtle"
                >
                  <Send className="w-3.5 h-3.5" />
                  Save & Publish Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Feedback History List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border-b border-brand-border pb-2 flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-brand-text">
              Logged Feedback Records ({feedbackList.length})
            </h3>
            <span className="text-[10px] font-mono text-brand-steelLight">Demo Archive</span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {feedbackList.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-text">{item.topic}</span>
                  <span className="text-brand-gold font-mono font-bold">{item.scoreIndicator}</span>
                </div>
                <p className="text-brand-textMuted italic">"{item.summary}"</p>
                <div className="text-[10px] text-brand-steelLight font-mono pt-1">
                  Logged on {item.date} by {item.reviewer}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
