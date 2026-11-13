import React, { useState } from 'react';
import { 
  Users, Search, Filter, Shield, Award, 
  ChevronRight, X, Phone, Mail, CheckCircle2 
} from 'lucide-react';
import { initialAdminAspirants, AdminAspirant } from '../../data/mockAdminData';
import { useToast } from '../../context/ToastContext';

export const AdminAspirantsPage: React.FC = () => {
  const { showToast } = useToast();
  const [aspirants, setAspirants] = useState<AdminAspirant[]>(() => {
    const saved = localStorage.getItem('ssb_admin_aspirants');
    return saved ? JSON.parse(saved) : initialAdminAspirants;
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAspirant, setSelectedAspirant] = useState<AdminAspirant | null>(null);

  const filtered = aspirants.filter((asp) => {
    const matchesSearch = 
      asp.name.toLowerCase().includes(search.toLowerCase()) ||
      asp.targetEntry.toLowerCase().includes(search.toLowerCase()) ||
      asp.assignedProgramme.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || asp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-brand-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider">
            Aspirant Registry
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Registered Demo Aspirants
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted">
            Review aspirant profiles, target entry boards, and psychological drill counts.
          </p>
        </div>

        <span className="text-xs font-mono text-brand-steelLight bg-brand-card px-3 py-1.5 rounded-lg border border-brand-border shrink-0">
          Showing {filtered.length} of {aspirants.length} Aspirants
        </span>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, entry, or programme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-brand-card border border-brand-border focus:border-brand-gold text-brand-text text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {['All', 'Active', 'Under Review'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                statusFilter === status
                  ? 'bg-brand-gold text-brand-lightText font-bold'
                  : 'bg-brand-card text-brand-textMuted hover:text-brand-text border border-brand-border'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Aspirants Table / Cards */}
      <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-bgSecondary border-b border-brand-border text-brand-textMuted font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Aspirant Name</th>
                <th className="py-3.5 px-4">Target Entry</th>
                <th className="py-3.5 px-4">Past Attempts</th>
                <th className="py-3.5 px-4">Assigned Pathway</th>
                <th className="py-3.5 px-4">Drills Completed</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {filtered.map((asp) => (
                <tr key={asp.id} className="hover:bg-brand-bgSecondary/50 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-bold text-brand-text">{asp.name}</div>
                    <div className="text-[11px] text-brand-textMuted font-mono">{asp.email}</div>
                  </td>
                  <td className="py-4 px-4 font-mono text-brand-gold">{asp.targetEntry}</td>
                  <td className="py-4 px-4 text-brand-textMuted">{asp.attemptHistory}</td>
                  <td className="py-4 px-4 text-brand-steelLight">{asp.assignedProgramme}</td>
                  <td className="py-4 px-4 font-mono font-bold text-brand-text">{asp.practiceCount}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        asp.status === 'Active'
                          ? 'bg-green-950/60 text-green-400 border border-green-500/30'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {asp.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setSelectedAspirant(asp)}
                      className="px-3 py-1 rounded bg-brand-bgSecondary hover:bg-brand-cardHover border border-brand-border text-brand-text hover:text-brand-gold font-medium transition-colors"
                    >
                      View Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aspirant Dossier Modal */}
      {selectedAspirant && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedAspirant(null)}
        >
          <div 
            className="bg-brand-bgSecondary border border-brand-borderGold max-w-xl w-full rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-brand-border pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-brand-gold">
                  Aspirant Dossier File
                </span>
                <h3 className="font-heading text-xl font-bold text-brand-text mt-0.5">
                  {selectedAspirant.name}
                </h3>
                <p className="text-xs text-brand-steelLight font-mono">
                  {selectedAspirant.targetEntry} • {selectedAspirant.attemptHistory}
                </p>
              </div>
              <button
                onClick={() => setSelectedAspirant(null)}
                className="p-1 rounded-md text-brand-textMuted hover:text-brand-text"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-brand-card border border-brand-border">
                <span className="text-brand-textMuted block font-mono">Email</span>
                <span className="text-brand-text font-semibold">{selectedAspirant.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-brand-card border border-brand-border">
                <span className="text-brand-textMuted block font-mono">Phone</span>
                <span className="text-brand-text font-semibold">{selectedAspirant.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-brand-card border border-brand-border">
                <span className="text-brand-textMuted block font-mono">Total Drills</span>
                <span className="text-brand-gold font-bold">{selectedAspirant.practiceCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-brand-card border border-brand-border">
                <span className="text-brand-textMuted block font-mono">Diagnostic Rating</span>
                <span className="text-brand-gold font-bold">{selectedAspirant.rating}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-card border border-brand-border text-xs space-y-1">
              <span className="font-mono text-brand-steelLight uppercase block font-semibold">Active Pathway:</span>
              <p className="text-brand-text">{selectedAspirant.assignedProgramme}</p>
              <p className="text-brand-textMuted text-[11px] pt-1">Last active in portal {selectedAspirant.lastActive}.</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAspirant(null)}
                className="px-5 py-2 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-text text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
