import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Shield, Save, CheckCircle2, Award, Calendar } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { studentUser, updateStudentProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: studentUser?.name || 'Arjun Sharma',
    email: studentUser?.email || 'arjun.aspirant@example.com',
    phone: studentUser?.phone || '+91 98765 43210',
    targetEntry: studentUser?.targetEntry || 'CDSE (IMA / OTA)',
    preparationStage: studentUser?.preparationStage || 'Conferenced-Out Repeater',
    hometown: studentUser?.hometown || 'Pune, Maharashtra',
    education: studentUser?.education || 'B.Tech Mechanical Engineering, 2024',
    hobby: studentUser?.hobby || 'Long-distance running & aeromodelling',
    targetBoard: studentUser?.targetBoard || '22 SSB Bhopal / 1 AFSB Dehradun',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile(formData);
    showToast('Aspirant profile updated and saved to local storage!', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-brand-border pb-4">
        <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider">
          Aspirant Identity
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
          Aspirant Profile & PIQ Baseline
        </h1>
        <p className="text-xs sm:text-sm text-brand-textMuted">
          Maintain your biographical information, attempt history, and target boards.
        </p>
      </div>

      <div className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Profile Avatar Badge */}
        <div className="flex items-center gap-4 pb-6 border-b border-brand-border">
          <div className="w-16 h-16 rounded-full bg-brand-bgSecondary border-2 border-brand-gold flex items-center justify-center text-brand-gold font-heading font-bold text-xl">
            {formData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-brand-text">
              {formData.name}
            </h2>
            <p className="text-xs text-brand-gold font-mono">
              {formData.targetEntry} • {formData.preparationStage}
            </p>
            <p className="text-[11px] text-brand-textMuted font-mono mt-0.5">
              Candidate ID: {studentUser?.id}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-brand-text font-mono font-medium mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-brand-text font-mono font-medium mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-brand-text font-mono font-medium mb-1.5">
                Phone / WhatsApp
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-brand-text font-mono font-medium mb-1.5">
                Hometown / State
              </label>
              <input
                type="text"
                value={formData.hometown}
                onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-brand-text font-mono font-medium mb-1.5">
                Target Defence Entry
              </label>
              <input
                type="text"
                value={formData.targetEntry}
                onChange={(e) => setFormData({ ...formData, targetEntry: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-brand-text font-mono font-medium mb-1.5">
                Preparation Stage
              </label>
              <input
                type="text"
                value={formData.preparationStage}
                onChange={(e) => setFormData({ ...formData, preparationStage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-brand-text font-mono font-medium mb-1.5">
                Education / Degree
              </label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-brand-text font-mono font-medium mb-1.5">
                Target SSB Board
              </label>
              <input
                type="text"
                value={formData.targetBoard}
                onChange={(e) => setFormData({ ...formData, targetBoard: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-brand-text font-mono font-medium mb-1.5">
              Hobbies & Interests (PIQ Question 11)
            </label>
            <input
              type="text"
              value={formData.hobby}
              onChange={(e) => setFormData({ ...formData, hobby: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text focus:outline-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-brand-border">
            <span className="text-[11px] font-mono text-brand-steelLight">
              * Stored locally in demo localStorage
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center gap-2 transition-colors shadow-gold-subtle"
            >
              <Save className="w-3.5 h-3.5" />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
