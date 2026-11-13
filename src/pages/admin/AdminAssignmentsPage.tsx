import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Edit2, Clock, X } from 'lucide-react';
import { initialAssignments, AssignmentItem } from '../../data/mockStudentData';
import { useToast } from '../../context/ToastContext';

export const AdminAssignmentsPage: React.FC = () => {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<AssignmentItem[]>(() => {
    const saved = localStorage.getItem('ssb_admin_assignments_list');
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    programmeTitle: 'Psychology Test Preparation',
    dueDate: 'In 5 days',
    instructions: '',
  });

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Assignment title is required', 'error');
      return;
    }

    const newItem: AssignmentItem = {
      id: 'asg-' + Math.random().toString(36).substring(2, 7),
      title: form.title,
      programmeTitle: form.programmeTitle,
      dueDate: form.dueDate,
      status: 'Pending',
      instructions: form.instructions || 'Follow standardized reporting protocols.'
    };

    const updated = [newItem, ...assignments];
    setAssignments(updated);
    localStorage.setItem('ssb_admin_assignments_list', JSON.stringify(updated));
    setModalOpen(false);
    showToast('New assignment added to aspirant dashboard demo', 'success');
  };

  const handleDelete = (id: string) => {
    const updated = assignments.filter(a => a.id !== id);
    setAssignments(updated);
    localStorage.setItem('ssb_admin_assignments_list', JSON.stringify(updated));
    showToast('Assignment deleted', 'info');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-brand-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider">
            Curriculum Tasks
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Assignment Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted">
            Create and schedule practice tasks, dossier writing exercises, and deadlines.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center gap-2 transition-colors shadow-gold-subtle shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Assignment
        </button>
      </div>

      <div className="space-y-4">
        {assignments.map((asg) => (
          <div
            key={asg.id}
            className="p-6 rounded-2xl bg-brand-card border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-bg text-brand-steelLight uppercase">
                  {asg.programmeTitle}
                </span>
                <span className="text-xs font-mono text-brand-gold">
                  Due: {asg.dueDate}
                </span>
              </div>
              <h3 className="font-heading font-bold text-base text-brand-text">
                {asg.title}
              </h3>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                {asg.instructions}
              </p>
            </div>

            <button
              onClick={() => handleDelete(asg.id)}
              className="p-2 rounded-lg text-brand-textMuted hover:text-red-400 bg-brand-bgSecondary border border-brand-border shrink-0"
              title="Delete Assignment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="bg-brand-bgSecondary border border-brand-borderGold max-w-lg w-full rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-brand-border pb-3">
              <h3 className="font-heading font-bold text-lg text-brand-text">
                Create Practice Assignment
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-brand-textMuted hover:text-brand-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-text font-mono font-medium mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none focus:border-brand-gold"
                  placeholder="e.g. 5 WAT Speed Drills with Positive Reframing"
                />
              </div>

              <div>
                <label className="block text-brand-text font-mono font-medium mb-1">
                  Applicable Programme
                </label>
                <select
                  value={form.programmeTitle}
                  onChange={(e) => setForm({ ...form, programmeTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none"
                >
                  <option value="Psychology Test Preparation">Psychology Test Preparation</option>
                  <option value="SSB Foundation Preparation">SSB Foundation Preparation</option>
                  <option value="Self Description Development">Self Description Development</option>
                  <option value="GTO Task Preparation">GTO Task Preparation</option>
                </select>
              </div>

              <div>
                <label className="block text-brand-text font-mono font-medium mb-1">
                  Due Date
                </label>
                <input
                  type="text"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none"
                  placeholder="e.g. In 4 days"
                />
              </div>

              <div>
                <label className="block text-brand-text font-mono font-medium mb-1">
                  Detailed Instructions
                </label>
                <textarea
                  rows={4}
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none"
                  placeholder="Specific assessment guidelines..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-brand-gold text-brand-lightText font-semibold shadow-gold-subtle"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
