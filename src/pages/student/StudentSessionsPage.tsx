import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Video, UserCheck, Plus, 
  X, ShieldCheck, Link as LinkIcon, Copy, 
  Check, Key, Disc, Play, Download, Clock
} from 'lucide-react';
import { initialSessions, MentorshipSession } from '../../data/mockStudentData';
import { useToast } from '../../context/ToastContext';

interface SavedRecording {
  id: string;
  topic: string;
  mentor: string;
  duration: string;
  timestamp: string;
  downloadUrl?: string;
}

export const StudentSessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<MentorshipSession[]>(() => {
    const saved = localStorage.getItem('ssb_student_sessions');
    return saved ? JSON.parse(saved) : initialSessions;
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recordings'>('upcoming');

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('Saturday 18:00 IST');
  const [sessionTopic, setSessionTopic] = useState('Psychology TAT Dossier Review');

  // Join With Code Modal
  const [joinCodeModalOpen, setJoinCodeModalOpen] = useState(false);
  const [inputMeetingCode, setInputMeetingCode] = useState('842 1900 3328');
  const [inputPasscode, setInputPasscode] = useState('SSB2026');

  // Recorded Sessions from LocalStorage
  const [recordings, setRecordings] = useState<SavedRecording[]>(() => {
    try {
      const saved = localStorage.getItem('ssb_live_recordings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'rec-01',
        topic: 'Stage-1 OIR & PPDT Narration Confidence Drill',
        mentor: 'Lt. Vamshi E.',
        duration: '24:18',
        timestamp: '12 Nov 2026, 18:30 IST'
      },
      {
        id: 'rec-02',
        topic: 'Personal Interview OLQ Cross-Examination Debrief',
        mentor: 'Lt. Vamshi E.',
        duration: '31:05',
        timestamp: '08 Nov 2026, 11:00 IST'
      }
    ];
  });

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
    navigate(`/student/live-meeting?topic=${encodeURIComponent(ses.title)}&mentor=${encodeURIComponent(ses.mentorName)}&code=84219003328&passcode=SSB2026`);
  };

  const handleJoinWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMeetingCode.trim()) return;
    const cleanCode = inputMeetingCode.replace(/\s+/g, '');
    setJoinCodeModalOpen(false);
    navigate(`/student/live-meeting?code=${cleanCode}&passcode=${encodeURIComponent(inputPasscode)}&topic=Live%20Class%20Session`);
  };

  const copySessionInvite = (ses: MentorshipSession) => {
    const inviteUrl = `${window.location.origin}/student/live-meeting?code=84219003328&passcode=SSB2026&topic=${encodeURIComponent(ses.title)}`;
    const fullText = `SSB BRO Live Mentorship Class
Topic: ${ses.title}
Mentor: ${ses.mentorName} (AIR 34 · CDS 2 2019)
Date/Slot: ${ses.dateTime}

Join Live Class Link:
${inviteUrl}

Meeting ID / Class Code: 842 1900 3328
Security Passcode: SSB2026`;

    navigator.clipboard.writeText(fullText);
    showToast('Class invitation & link copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* Page Header */}
      <div className="space-y-2 border-b border-brand-border pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            Live Mentorship Dialogues & Studio
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Mentorship Sessions
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted">
            Join scheduled 1-on-1 diagnostic debriefs, psychological dossier reviews, or join any active session via class code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Join with Code Button */}
          <button
            onClick={() => setJoinCodeModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-text text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Key className="w-4 h-4 text-brand-gold" />
            Join with Code
          </button>

          {/* Schedule Live Class Button */}
          <button
            onClick={() => setBookingModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center gap-2 transition-all shadow-gold-subtle shrink-0"
          >
            <Plus className="w-4 h-4" />
            Schedule Live Class
          </button>
        </div>
      </div>

      {/* Tabs: Upcoming Classes vs Recordings Archive */}
      <div className="flex items-center gap-3 border-b border-brand-border pb-1">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-2.5 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'upcoming'
              ? 'text-brand-gold border-brand-gold'
              : 'text-brand-textMuted border-transparent hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          Scheduled Live Classes ({sessions.filter(s => s.status === 'Upcoming').length})
        </button>

        <button
          onClick={() => setActiveTab('recordings')}
          className={`pb-2.5 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'recordings'
              ? 'text-brand-gold border-brand-gold'
              : 'text-brand-textMuted border-transparent hover:text-white'
          }`}
        >
          <Disc className="w-4 h-4 text-red-400" />
          Dossier Recordings & Video Archives ({recordings.length})
        </button>
      </div>

      {/* ── TAB 1: SCHEDULED LIVE SESSIONS ── */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4 animate-fadeIn">
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
                    Live Mentorship Studio
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

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {/* Share Link Button */}
                <button
                  onClick={() => copySessionInvite(ses)}
                  className="px-4 py-2.5 rounded-lg bg-brand-bgSecondary hover:bg-brand-cardHover border border-brand-border text-brand-steelLight hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Copy meeting invite link and code"
                >
                  <Copy className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Copy Invite Link</span>
                </button>

                {/* Join Button */}
                {ses.status === 'Upcoming' ? (
                  <button
                    onClick={() => openFullLivePage(ses)}
                    className="px-5 py-2.5 rounded-lg bg-[#0E71EB] hover:bg-[#005CE6] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md transform hover:scale-105 active:scale-95"
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
      )}

      {/* ── TAB 2: DOSSIER RECORDINGS ARCHIVE ── */}
      {activeTab === 'recordings' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-blue-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Disc className="w-4 h-4 text-red-400 animate-pulse shrink-0" />
              <span>
                All 1-on-1 psychological assessments and mock cross-questioning drills are securely recorded and archived for self-reflection.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recordings.map((rec) => (
              <div 
                key={rec.id}
                className="p-5 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-all space-y-3 flex flex-col justify-between shadow-card"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-brand-steelLight mb-2">
                    <span className="flex items-center gap-1 text-red-400 font-bold">
                      <Disc className="w-3 h-3" />
                      Recorded Class
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rec.duration}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-base text-white">
                    {rec.topic}
                  </h4>
                  <p className="text-xs text-brand-textMuted mt-1 font-mono">
                    Assessor: {rec.mentor} · {rec.timestamp}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-border flex items-center gap-3">
                  <button
                    onClick={() => {
                      navigate(`/student/live-meeting?topic=${encodeURIComponent(rec.topic)}&mentor=${encodeURIComponent(rec.mentor)}`);
                    }}
                    className="flex-1 py-2 rounded-lg bg-[#0E71EB] hover:bg-[#005CE6] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Review Debrief
                  </button>

                  <button
                    onClick={() => {
                      showToast('Downloading recorded class dossier video...', 'info');
                    }}
                    className="px-3 py-2 rounded-lg bg-brand-bgSecondary hover:bg-brand-cardHover border border-brand-border text-brand-steelLight hover:text-white text-xs transition-colors"
                    title="Download Video Archive"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL 1: JOIN WITH MEETING CODE ── */}
      {joinCodeModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setJoinCodeModalOpen(false)}
        >
          <div 
            className="bg-brand-bgSecondary border border-brand-borderGold max-w-md w-full rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-brand-border pb-3.5">
              <div>
                <span className="text-[10px] font-mono uppercase text-brand-gold tracking-widest font-semibold">
                  Direct Live Classroom Entry
                </span>
                <h3 className="font-heading text-lg font-bold text-brand-text mt-0.5">
                  Join with Meeting Code
                </h3>
              </div>
              <button onClick={() => setJoinCodeModalOpen(false)} className="text-brand-textMuted hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJoinWithCode} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-brand-text font-mono font-bold mb-1">
                  Meeting ID / Class Code *
                </label>
                <input
                  type="text"
                  required
                  value={inputMeetingCode}
                  onChange={(e) => setInputMeetingCode(e.target.value)}
                  placeholder="e.g. 842 1900 3328"
                  className="w-full bg-brand-card border border-brand-border rounded-lg px-3.5 py-2.5 text-sm font-mono text-brand-gold focus:outline-none focus:border-brand-gold"
                />
                <p className="text-[10px] text-brand-textMuted mt-1">
                  Enter the 10 or 11-digit meeting code provided by your assessor.
                </p>
              </div>

              <div>
                <label className="block text-brand-text font-mono font-bold mb-1">
                  Security Passcode *
                </label>
                <input
                  type="text"
                  required
                  value={inputPasscode}
                  onChange={(e) => setInputPasscode(e.target.value)}
                  placeholder="e.g. SSB2026"
                  className="w-full bg-brand-card border border-brand-border rounded-lg px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setJoinCodeModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-brand-border text-brand-textMuted hover:text-brand-text text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#0E71EB] hover:bg-[#005CE6] text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Video className="w-4 h-4" />
                  Join Live Class Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: SCHEDULE LIVE CLASS MODAL ── */}
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
                  Includes screen sharing, real-time cloud recording, TAT & WAT interactive slide decks, invite links, and reactions.
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
