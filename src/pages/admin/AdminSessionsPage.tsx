import React, { useState } from 'react';
import { Calendar, Video, Plus, CheckCircle2, Clock, X, UserCheck } from 'lucide-react';
import { initialAdminAspirants } from '../../data/mockAdminData';
import { useToast } from '../../context/ToastContext';

export const AdminSessionsPage: React.FC = () => {
  const { showToast } = useToast();
  const [sessions, setSessions] = useState([
    {
      id: 'ses-01',
      aspirantName: 'Arjun Sharma',
      title: 'Individual Psychological Battery Diagnostic',
      dateTime: 'Saturday, Nov 21, 2026 • 18:00 IST',
      type: '1-on-1 Video Diagnostic',
      status: 'Upcoming',
      notes: 'Bring written PIQ audit draft and 12 TAT practice sheets.',
    },
    {
      id: 'ses-02',
      aspirantName: 'Kavya Nair',
      title: 'Communication & Lecturette Transcript Review',
      dateTime: 'Sunday, Nov 22, 2026 • 10:30 IST',
      type: 'Psych Dossier Review',
      status: 'Upcoming',
      notes: 'Submit 3-minute audio recording before session.',
    },
    {
      id: 'ses-03',
      aspirantName: 'All Active Cohort',
      title: 'GTO Cantilever Principles & Outdoor Dynamics',
      dateTime: 'Saturday, Nov 07, 2026 • 17:30 IST',
      type: 'Ground Task Group Strategy',
      status: 'Completed',
      notes: 'Recorded session archive available.',
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    aspirantName: initialAdminAspirants[0].name,
    title: '',
    dateTime: '',
    type: '1-on-1 Video Diagnostic',
    notes: '',
  });

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dateTime.trim()) {
      showToast('Please fill in session title and date/time', 'error');
      return;
    }
    const newSession = {
      id: 'ses-' + Math.random().toString(36).substring(2, 7),
      ...form,
      status: 'Upcoming'
    };
    setSessions([newSession, ...sessions]);
    setModalOpen(false);
    showToast(`Session scheduled with ${form.aspirantName}`, 'success');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div className="space-y-1 border-b border-brand-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider">Mentorship Schedule</span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">Sessions Calendar</h1>
          <p className="text-xs sm:text-sm text-brand-textMuted">Track and schedule 1-on-1 mentorship calls, dossier reviews, and GTO workshops.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="px-4 py-2 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Schedule New Session
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map((ses) => (
          <div key={ses.id} className="p-6 rounded-2xl bg-brand-card border border-brand-border flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-xl">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase ${ses.status === 'Upcoming' ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/40' : 'bg-brand-bg text-brand-textMuted border border-brand-border'}`}>{ses.status}</span>
                <span className="text-xs font-mono text-brand-steelLight">{ses.type}</span>
              </div>
              <h3 className="font-heading font-bold text-base text-brand-text">{ses.title}</h3>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-brand-textMuted">
                <span className="text-brand-gold font-semibold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {ses.dateTime}</span>
                <span className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5" /> {ses.aspirantName}</span>
              </div>
              {ses.notes && <p className="text-xs text-brand-textMuted italic">Note: {ses.notes}</p>}
            </div>
            {ses.status === 'Upcoming' && (
              <button onClick={() => showToast('Demo room link will activate 15 minutes before session time', 'info')} className="px-4 py-2 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center gap-2 shrink-0">
                <Video className="w-3.5 h-3.5" />
                Open Room (Demo)
              </button>
            )}
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-brand-bgSecondary border border-brand-borderGold max-w-lg w-full rounded-2xl p-6 sm:p-8 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-brand-border pb-3">
              <h3 className="font-heading font-bold text-lg text-brand-text">Schedule Mentorship Session</h3>
              <button onClick={() => setModalOpen(false)} className="text-brand-textMuted hover:text-brand-text"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSchedule} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-text font-mono font-medium mb-1">Aspirant</label>
                <select value={form.aspirantName} onChange={e => setForm({ ...form, aspirantName: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none">
                  {initialAdminAspirants.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                  <option value="All Active Cohort">All Active Cohort</option>
                </select>
              </div>
              <div>
                <label className="block text-brand-text font-mono font-medium mb-1">Session Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none" placeholder="e.g. PIQ Audit & Interview Simulation" />
              </div>
              <div>
                <label className="block text-brand-text font-mono font-medium mb-1">Date & Time *</label>
                <input type="text" required value={form.dateTime} onChange={e => setForm({ ...form, dateTime: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none" placeholder="e.g. Saturday, Dec 05, 2026 • 18:00 IST" />
              </div>
              <div>
                <label className="block text-brand-text font-mono font-medium mb-1">Session Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none">
                  <option value="1-on-1 Video Diagnostic">1-on-1 Video Diagnostic</option>
                  <option value="Psych Dossier Review">Psych Dossier Review</option>
                  <option value="Ground Task Group Strategy">Ground Task Group Strategy</option>
                </select>
              </div>
              <div>
                <label className="block text-brand-text font-mono font-medium mb-1">Preparation Notes</label>
                <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none" placeholder="Items aspirant should prepare..." />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-brand-border">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-brand-gold text-brand-lightText font-semibold shadow-gold-subtle">Confirm Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
