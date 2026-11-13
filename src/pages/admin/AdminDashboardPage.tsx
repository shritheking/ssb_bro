import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, BookOpen, CheckSquare, Calendar, 
  TrendingUp, Award, ArrowUpRight, ChevronRight, 
  AlertCircle, Shield, FileText, Bell 
} from 'lucide-react';
import { initialAdminAspirants, initialAdminSubmissions, initialAdminNotifications } from '../../data/mockAdminData';
import { proposedProgrammes } from '../../data/programmeData';

export const AdminDashboardPage: React.FC = () => {
  const pendingSubs = initialAdminSubmissions.filter(s => s.status === 'Pending Review');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-card via-brand-bgSecondary to-brand-card border border-brand-borderGold/40 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-brand-gold/15 text-brand-gold font-mono text-[11px] uppercase tracking-wider font-semibold">
            Platform Command Center
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Admin Overview: SSB BRO
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted max-w-xl">
            Concept administration console for mentor reviews, cohort assignments, and curriculum staging.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-brand-bg/80 border border-brand-border text-right text-xs font-mono shrink-0">
          <span className="text-brand-steelLight block">Demonstration Dataset</span>
          <span className="text-brand-gold font-bold">5 Aspirants • 8 Programmes</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/aspirants"
          className="p-5 rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-colors space-y-2 group"
        >
          <div className="flex items-center justify-between text-brand-textMuted text-xs font-mono">
            <span>TOTAL DEMO ASPIRANTS</span>
            <Users className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text group-hover:text-brand-gold transition-colors">
            {initialAdminAspirants.length} Aspirants
          </div>
          <p className="text-[11px] text-brand-steelLight">
            4 Active • 1 Under Review
          </p>
        </Link>

        <Link
          to="/admin/programmes"
          className="p-5 rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-colors space-y-2 group"
        >
          <div className="flex items-center justify-between text-brand-textMuted text-xs font-mono">
            <span>PROPOSED PATHWAYS</span>
            <BookOpen className="w-4 h-4 text-brand-steelLight" />
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text group-hover:text-brand-gold transition-colors">
            {proposedProgrammes.length} Frameworks
          </div>
          <p className="text-[11px] text-brand-textMuted">
            Foundation, Psych, GTO & Interview
          </p>
        </Link>

        <Link
          to="/admin/submissions"
          className="p-5 rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-colors space-y-2 group"
        >
          <div className="flex items-center justify-between text-brand-textMuted text-xs font-mono">
            <span>PENDING REVIEWS</span>
            <CheckSquare className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-heading font-bold text-brand-gold">
            {pendingSubs.length} Submissions
          </div>
          <p className="text-[11px] text-brand-textMuted">
            Requires mentor diagnostic notes
          </p>
        </Link>

        <Link
          to="/admin/sessions"
          className="p-5 rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-colors space-y-2 group"
        >
          <div className="flex items-center justify-between text-brand-textMuted text-xs font-mono">
            <span>SCHEDULED SESSIONS</span>
            <Calendar className="w-4 h-4 text-brand-steelLight" />
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text group-hover:text-brand-gold transition-colors">
            2 Sessions
          </div>
          <p className="text-[11px] text-brand-textMuted">
            Next: Saturday 18:00 IST
          </p>
        </Link>
      </div>

      {/* Main Grid: Pending Reviews & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (8 cols): Pending Submissions Review Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-brand-text">
                  Pending Aspirant Submissions
                </h3>
                <p className="text-xs text-brand-textMuted">
                  Psychology stories and elocution transcripts awaiting mentor evaluation.
                </p>
              </div>
              <Link
                to="/admin/submissions"
                className="text-xs text-brand-gold hover:underline font-mono"
              >
                All Submissions →
              </Link>
            </div>

            <div className="space-y-3">
              {initialAdminSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-brand-bgSecondary border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-text">{sub.aspirantName}</span>
                      <span className="text-brand-steelLight font-mono">({sub.aspirantEmail})</span>
                    </div>
                    <p className="font-medium text-brand-gold">{sub.assignmentTitle}</p>
                    <p className="text-brand-textMuted italic line-clamp-1">"{sub.contentSnippet}"</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-mono text-brand-textMuted">
                      {sub.submittedAt}
                    </span>
                    <Link
                      to="/admin/feedback"
                      className="px-3 py-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-text font-medium"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Programme Engagement Chart Mock */}
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-brand-text">
                Programme Cohort Engagement
              </h3>
              <span className="text-xs font-mono text-brand-steelLight">Demo Analytics</span>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { title: 'SSB Foundation Preparation', students: '3 Aspirants', pct: 85 },
                { title: 'Psychology Test Preparation', students: '4 Aspirants', pct: 92 },
                { title: 'GTO Tasks & Cantilever Dynamics', students: '2 Aspirants', pct: 64 },
                { title: 'Communication & Mirror Elocution', students: '3 Aspirants', pct: 78 },
              ].map((item) => (
                <div key={item.title} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-brand-text font-medium font-mono">{item.title}</span>
                    <span className="text-brand-gold font-mono">{item.students} ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-brand-bg h-2 rounded-full overflow-hidden border border-brand-border">
                    <div className="bg-brand-gold h-full rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col (4 cols): Notifications & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="font-heading font-bold text-base text-brand-text flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-gold" />
                Recent Notifications
              </h3>
              <span className="text-[10px] font-mono text-brand-steelLight">Live Log</span>
            </div>

            <div className="space-y-3 text-xs">
              {initialAdminNotifications.map((notif) => (
                <div key={notif.id} className="p-3 rounded-xl bg-brand-bgSecondary border border-brand-border space-y-1">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-brand-gold font-semibold uppercase">{notif.type}</span>
                    <span className="text-brand-textMuted">{notif.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-brand-text">{notif.title}</h4>
                  <p className="text-brand-textMuted leading-relaxed">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="rounded-2xl bg-brand-bgSecondary border border-brand-border p-6 space-y-3">
            <h4 className="font-heading font-bold text-sm text-brand-text">
              Mentor Quick Operations
            </h4>
            <div className="space-y-2">
              <Link
                to="/admin/programmes"
                className="w-full block py-2 px-3 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-xs text-brand-text font-medium transition-colors"
              >
                + Add / Edit Programme Framework
              </Link>
              <Link
                to="/admin/assignments"
                className="w-full block py-2 px-3 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-xs text-brand-text font-medium transition-colors"
              >
                + Create New Practice Assignment
              </Link>
              <Link
                to="/admin/feedback"
                className="w-full block py-2 px-3 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-xs text-brand-text font-medium transition-colors"
              >
                Write Diagnostic Feedback
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
