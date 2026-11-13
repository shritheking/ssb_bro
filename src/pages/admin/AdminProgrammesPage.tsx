import React, { useState } from 'react';
import { 
  BookOpen, Plus, Edit2, Trash2, CheckCircle2, 
  X, AlertCircle, Sparkles, Layers 
} from 'lucide-react';
import { proposedProgrammes, ProgrammeItem } from '../../data/programmeData';
import { useToast } from '../../context/ToastContext';

export const AdminProgrammesPage: React.FC = () => {
  const { showToast } = useToast();
  const [programmes, setProgrammes] = useState<ProgrammeItem[]>(() => {
    const saved = localStorage.getItem('ssb_admin_programmes');
    return saved ? JSON.parse(saved) : proposedProgrammes;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    title: '',
    category: 'Foundation' as ProgrammeItem['category'],
    tagline: '',
    shortDescription: '',
    suitableAspirantLevel: 'All Stages' as ProgrammeItem['suitableAspirantLevel'],
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormState({
      title: '',
      category: 'Foundation',
      tagline: '',
      shortDescription: '',
      suitableAspirantLevel: 'All Stages',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prog: ProgrammeItem) => {
    setEditingId(prog.id);
    setFormState({
      title: prog.title,
      category: prog.category,
      tagline: prog.tagline,
      shortDescription: prog.shortDescription,
      suitableAspirantLevel: prog.suitableAspirantLevel,
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = programmes.filter(p => p.id !== id);
    setProgrammes(updated);
    localStorage.setItem('ssb_admin_programmes', JSON.stringify(updated));
    showToast('Programme removed from local demo list', 'info');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) {
      showToast('Programme title is required', 'error');
      return;
    }

    let updated: ProgrammeItem[];
    if (editingId) {
      updated = programmes.map(p => {
        if (p.id === editingId) {
          return {
            ...p,
            ...formState,
          };
        }
        return p;
      });
      showToast('Programme updated successfully in demo', 'success');
    } else {
      const newItem: ProgrammeItem = {
        id: 'prog-' + Math.random().toString(36).substring(2, 8),
        title: formState.title,
        category: formState.category,
        tagline: formState.tagline || 'Custom Mentorship Framework',
        shortDescription: formState.shortDescription || 'Proposed customized training pathway.',
        detailedDescription: formState.shortDescription,
        suitableAspirantLevel: formState.suitableAspirantLevel,
        intendedOutcomes: ['Intended learning outcome to be structured'],
        keyModules: [{ title: 'Module 1', description: 'Curriculum overview' }],
        curriculumHighlights: ['Hands-on diagnostic practice'],
        statusNotice: 'Proposed programme structure — final syllabus to be confirmed.',
        recommendedPrepHours: 'Proposed cohort sessions',
        targetEntries: ['All Entries']
      };
      updated = [newItem, ...programmes];
      showToast('New programme added to local demo', 'success');
    }

    setProgrammes(updated);
    localStorage.setItem('ssb_admin_programmes', JSON.stringify(updated));
    setModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-brand-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider">
            Curriculum Architecture
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Programme Framework Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted">
            Configure proposed curriculum tracks, target candidate levels, and module descriptors.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center gap-2 transition-colors shadow-gold-subtle shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Proposed Programme
        </button>
      </div>

      {/* Programme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programmes.map((prog) => (
          <div
            key={prog.id}
            className="rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col justify-between hover:border-brand-gold/40 transition-all duration-300 shadow-card"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-bg text-brand-steelLight uppercase">
                  {prog.category}
                </span>
                <span className="text-[10px] font-mono text-brand-gold">
                  {prog.suitableAspirantLevel}
                </span>
              </div>

              <h3 className="font-heading font-bold text-base text-brand-text leading-snug">
                {prog.title}
              </h3>

              <p className="text-xs text-brand-textMuted line-clamp-3 leading-relaxed">
                {prog.shortDescription}
              </p>
            </div>

            <div className="pt-4 border-t border-brand-border mt-4 flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-brand-steelLight">
                {prog.keyModules?.length || 3} Modules Defined
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(prog)}
                  className="p-1.5 rounded hover:bg-brand-bg text-brand-textMuted hover:text-brand-text transition-colors"
                  title="Edit Programme"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(prog.id)}
                  className="p-1.5 rounded hover:bg-brand-bg text-brand-textMuted hover:text-red-400 transition-colors"
                  title="Delete Programme"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
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
                {editingId ? 'Edit Programme Framework' : 'Add New Proposed Programme'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-brand-textMuted hover:text-brand-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-text font-mono font-medium mb-1">
                  Programme Title *
                </label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none focus:border-brand-gold"
                  placeholder="e.g. Officer-Like Qualities Mastery"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brand-text font-mono font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e: any) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none"
                  >
                    <option value="Foundation">Foundation</option>
                    <option value="Psychology">Psychology</option>
                    <option value="GTO">GTO</option>
                    <option value="Interview">Interview</option>
                    <option value="Personality">Personality</option>
                    <option value="Mentorship">Mentorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-brand-text font-mono font-medium mb-1">
                    Target Level
                  </label>
                  <select
                    value={formState.suitableAspirantLevel}
                    onChange={(e: any) => setFormState({ ...formState, suitableAspirantLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none"
                  >
                    <option value="All Stages">All Stages</option>
                    <option value="Beginner / First Timer">Beginner / First Timer</option>
                    <option value="Repeaters & Screened-Out">Repeaters & Screened-Out</option>
                    <option value="Conferenced-Out Candidates">Conferenced-Out Candidates</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-brand-text font-mono font-medium mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={formState.tagline}
                  onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none focus:border-brand-gold"
                  placeholder="e.g. Daily habit formation before board testing"
                />
              </div>

              <div>
                <label className="block text-brand-text font-mono font-medium mb-1">
                  Short Description
                </label>
                <textarea
                  rows={3}
                  value={formState.shortDescription}
                  onChange={(e) => setFormState({ ...formState, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text focus:outline-none focus:border-brand-gold"
                  placeholder="Brief synopsis of learning objectives..."
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
                  Save Framework (Demo)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
