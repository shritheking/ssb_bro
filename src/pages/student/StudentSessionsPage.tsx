import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Video, UserCheck, Plus, 
  X, ShieldCheck
} from 'lucide-react';
import { initialSessions, MentorshipSession } from '../../data/mockStudentData';
import { useToast } from '../../context/ToastContext';

export const StudentSessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<MentorshipSession[]>(() => {
    const saved = localStorage.getItem('ssb_student_sessions');
    return saved ? JSON.parse(saved) : initialSessions;
  });

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('Saturday 18:00 IST');
  const [sessionTopic, setSessionTopic] = useState('Psychology TAT Dossier Review');

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: MentorshipSession = {
      id: Math.random().toString(36).substring(2, 8),
      title: sessionTopic,
      mentorName: 'Lt. Vamshi E.',
      dateTime: selectedSlot,
      type: '1-on-1 Video Diagnostic',
      status: 'Upcoming',
      linkOrLocation: 'Live Meeting Room #842-190-332',
      notes: 'Have your written TAT stories and PIQ audit form ready.'
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    localStorage.setItem('ssb_student_sessions', JSON.stringify(updated));
    setBookingModalOpen(false);
    showToast(`Live Class Scheduled for ${selectedSlot}`, 'success');
  };

  const openFullLivePage = (ses: MentorshipSession) => {
    navigate(`/student/live-meeting?topic=${encodeURIComponent(ses.title)}&mentor=${encodeURIComponent(ses.mentorName)}`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Page Header */}
      <div className="space-y-1 border-b border-brand-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-gold" />
            Live Mentorship Dialogues
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Mentorship Sessions
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted">
            Join scheduled 1-on-1 diagnostic sessions, psychological dossier reviews, and mock interviews directly in the Live Class Studio.
          </p>
        </div>

        <button
          onClick={() => setBookingModalOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center gap-2 transition-all shadow-gold-subtle shrink-0"
        >
          <Plus className="w-4 h-4" />
          Schedule Live Class
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="space-y-4">
        {sessions.map((ses) => (
          <div
            key={ses.id}
            className="rounded-2xl bg-brand-card border border-brand-border p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:border-brand-gold/40 transition-all duration-300 shadow-card"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase ${
                    ses.status === 'Upcoming'
                      ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/40'
                      : 'bg-brand-bg text-brand-textMuted border border-brand-border'
                  }`}
                >
                  {ses.status}
                </span>
                <span className="text-xs font-mono text-brand-steelLight flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-blue-400" />
                  Zoom Video Meeting
                </span>
              </div>

              <h3 className="font-heading font-bold text-base sm:text-lg text-brand-text">
                {ses.title}
              </h3>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-brand-textMuted pt-1">
                <span className="flex items-center gap-1.5 text-brand-text font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                  {ses.dateTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-brand-steelLight" />
                  Mentor: {ses.mentorName}
                </span>
              </div>

              {ses.notes && (
                <p className="text-xs text-brand-textMuted pt-1 italic">
                  Note: {ses.notes}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {ses.status === 'Upcoming' ? (
                <button
                  onClick={() => openFullLivePage(ses)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#0E71EB] hover:bg-[#005CE6] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md transform hover:scale-105 active:scale-95"
                >
                  <Video className="w-4 h-4" />
                  Join Live Class
                </button>
              ) : (
                <span className="text-xs font-mono text-brand-textMuted bg-brand-bgSecondary px-3 py-1.5 rounded border border-brand-border">
                  Session Completed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setBookingModalOpen(false)}
        >
          <div 
            className="bg-brand-bgSecondary border border-brand-borderGold max-w-lg w-full rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-brand-border pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-brand-gold">
                  Live Class Studio
                </span>
                <h3 className="font-heading text-xl font-bold text-brand-text mt-0.5">
                  Schedule 1-on-1 Live Diagnostic
                </h3>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="p-1 rounded-md text-brand-textMuted hover:text-brand-text"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleBookSession} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-text font-mono font-bold mb-1.5">
                  Consultation Topic *
                </label>
                <select
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2.5 text-brand-text focus:outline-none focus:border-brand-gold"
                >
                  <option value="Psychology TAT Dossier Review">Psychology TAT Dossier Review (3 Stories deep dive)</option>
                  <option value="Mock Personal Interview & Rapid Cross-Questions">Mock Personal Interview & Rapid Cross-Questions</option>
                  <option value="Stage-1 OIR & PPDT Narration Drill">Stage-1 OIR & PPDT Narration Speed Drill</option>
                  <option value="Self Description Formulation Audit">Self Description Formulation Audit</option>
                  <option value="General 15-OLQ Readiness Diagnostic Debrief">General 15-OLQ Readiness Diagnostic Debrief</option>
                </select>
              </div>

              <div>
                <label className="block text-brand-text font-mono font-bold mb-1.5">
                  Available Calendar Slot *
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2.5 text-brand-text focus:outline-none focus:border-brand-gold"
                >
                  <option value="Friday 19:30 IST">Friday 19:30 IST</option>
                  <option value="Saturday 18:00 IST">Saturday 18:00 IST</option>
                  <option value="Sunday 11:00 IST">Sunday 11:00 IST (Morning Slot)</option>
                  <option value="Sunday 17:00 IST">Sunday 17:00 IST</option>
                </select>
              </div>

              <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-500/30 text-blue-200 space-y-1">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-blue-400" />
                  Full-Page Dedicated Live Class Room
                </p>
                <p className="text-[11px] leading-relaxed text-brand-textMuted">
                  Clicking "Join Live Class" will launch a dedicated full-page interactive video room with speaker view, mobile picture-in-picture, reactions, chat, and participants.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-brand-border text-brand-textMuted hover:text-brand-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0E71EB] hover:bg-[#005CE6] text-white font-semibold shadow-md"
                >
                  Confirm Live Class Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
