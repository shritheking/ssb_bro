import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, PenTool, CheckSquare, MessageSquare, 
  Calendar, Award, TrendingUp, Clock, ChevronRight, 
  Flame, Shield, AlertCircle, ArrowUpRight 
} from 'lucide-react';
import { 
  initialEnrolledProgrammes, initialAssignments, 
  sampleFeedbackHistory, initialSessions 
} from '../../data/mockStudentData';

export const StudentDashboardPage: React.FC = () => {
  const { studentUser } = useAuth();

  const primaryProg = initialEnrolledProgrammes[0];
  const pendingAssignments = initialAssignments.filter(a => a.status === 'Pending');
  const recentFeedback = sampleFeedbackHistory[0];
  const nextSession = initialSessions[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-card via-brand-bgSecondary to-brand-card border border-brand-borderGold/40 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold font-mono text-[11px] uppercase tracking-wider font-semibold">
            Stage 2 Candidate Tracker
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Welcome Back, {studentUser?.name?.split(' ')[0] || 'Aspirant'}.
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted max-w-xl leading-relaxed">
            Target Entry: <strong className="text-brand-text">{studentUser?.targetEntry}</strong> • Attempt Stage: <strong className="text-brand-gold">{studentUser?.preparationStage}</strong>
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-4 bg-brand-bg/80 border border-brand-border p-4 rounded-xl shrink-0">
          <div className="text-center px-2">
            <span className="text-[10px] font-mono text-brand-textMuted uppercase block">Practice Streak</span>
            <span className="text-xl font-heading font-bold text-brand-gold flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-brand-gold text-brand-gold" />
              12 Days
            </span>
          </div>
          <div className="h-8 w-px bg-brand-border" />
          <div className="text-center px-2">
            <span className="text-[10px] font-mono text-brand-textMuted uppercase block">Profile Readiness</span>
            <span className="text-xl font-heading font-bold text-brand-steelLight">
              85%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-brand-card border border-brand-border space-y-2">
          <div className="flex items-center justify-between text-brand-textMuted text-xs font-mono">
            <span>ACTIVE PATHWAYS</span>
            <BookOpen className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text">
            {initialEnrolledProgrammes.length}
          </div>
          <p className="text-[11px] text-brand-steelLight">
            Foundation, Psych & SD Modules
          </p>
        </div>

        <div className="p-5 rounded-xl bg-brand-card border border-brand-border space-y-2">
          <div className="flex items-center justify-between text-brand-textMuted text-xs font-mono">
            <span>PRACTICE STORIES</span>
            <PenTool className="w-4 h-4 text-brand-steelLight" />
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text">
            28 Drills
          </div>
          <p className="text-[11px] text-brand-textMuted">
            TAT: 14 • WAT: 10 • SRT: 4
          </p>
        </div>

        <div className="p-5 rounded-xl bg-brand-card border border-brand-border space-y-2">
          <div className="flex items-center justify-between text-brand-textMuted text-xs font-mono">
            <span>PENDING TASKS</span>
            <CheckSquare className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-heading font-bold text-brand-text">
            {pendingAssignments.length} Assignment
          </div>
          <p className="text-[11px] text-brand-textMuted">
            Due in 3 days: TAT Practice Set A
          </p>
        </div>

        <div className="p-5 rounded-xl bg-brand-card border border-brand-border space-y-2">
          <div className="flex items-center justify-between text-brand-textMuted text-xs font-mono">
            <span>NEXT MENTOR CALL</span>
            <Calendar className="w-4 h-4 text-brand-steelLight" />
          </div>
          <div className="text-lg font-heading font-bold text-brand-gold truncate">
            Saturday, 18:00
          </div>
          <p className="text-[11px] text-brand-textMuted truncate">
            1-on-1 Video Diagnostic with Lt. Vamshi
          </p>
        </div>
      </div>

      {/* 3. Main Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Current Programme & Practice Quick Launch */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Current Programme in Progress */}
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-brand-gold tracking-wider">
                  Active Study Programme
                </span>
                <h3 className="font-heading font-bold text-lg text-brand-text mt-0.5">
                  {primaryProg.title}
                </h3>
              </div>
              <Link
                to="/student/programmes"
                className="text-xs text-brand-steelLight hover:text-brand-text flex items-center gap-1 font-mono"
              >
                All Courses <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-brand-textMuted">Current Module: <strong className="text-brand-text">{primaryProg.currentModule}</strong></span>
                <span className="text-brand-gold font-bold">{primaryProg.progressPercent}%</span>
              </div>
              <div className="w-full bg-brand-bg h-2 rounded-full overflow-hidden border border-brand-border">
                <div
                  className="bg-brand-gold h-full rounded-full"
                  style={{ width: `${primaryProg.progressPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-brand-textMuted flex items-center justify-between pt-1">
                <span>{primaryProg.completedModules} of {primaryProg.totalModules} modules completed</span>
                <span>Last active {primaryProg.lastActive}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link
                to="/student/programmes"
                className="px-4 py-2 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold transition-colors"
              >
                Continue Module
              </Link>
              <Link
                to="/student/practice"
                className="px-4 py-2 rounded-lg bg-brand-bgSecondary border border-brand-border hover:border-brand-steelLight text-brand-text text-xs font-medium transition-colors"
              >
                Launch Associated Practice
              </Link>
            </div>
          </div>

          {/* Practice Centre Quick Links */}
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div className="space-y-0.5">
                <h3 className="font-heading font-bold text-lg text-brand-text">
                  Interactive Practice Centre
                </h3>
                <p className="text-xs text-brand-textMuted">
                  Timed psychological exercises simulating real SSB pressure.
                </p>
              </div>
              <Link
                to="/student/practice"
                className="text-xs text-brand-gold hover:underline font-mono"
              >
                Open Centre →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/student/practice"
                className="p-4 rounded-xl bg-brand-bgSecondary border border-brand-border hover:border-brand-gold/40 transition-colors space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-text group-hover:text-brand-gold transition-colors">
                    TAT Story Practice
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-card text-brand-gold font-mono">
                    4 Min Timer
                  </span>
                </div>
                <p className="text-xs text-brand-textMuted line-clamp-2">
                  View image prompt for 30s, write your story within 4 minutes.
                </p>
              </Link>

              <Link
                to="/student/practice"
                className="p-4 rounded-xl bg-brand-bgSecondary border border-brand-border hover:border-brand-gold/40 transition-colors space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-text group-hover:text-brand-gold transition-colors">
                    WAT Speed Drill
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-card text-brand-steelLight font-mono">
                    15 Sec / Word
                  </span>
                </div>
                <p className="text-xs text-brand-textMuted line-clamp-2">
                  Rapid association drill to train authentic subconscious reaction.
                </p>
              </Link>

              <Link
                to="/student/practice"
                className="p-4 rounded-xl bg-brand-bgSecondary border border-brand-border hover:border-brand-gold/40 transition-colors space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-text group-hover:text-brand-gold transition-colors">
                    Situation Reaction (SRT)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-card text-brand-steelLight font-mono">
                    30 Sec / Crisis
                  </span>
                </div>
                <p className="text-xs text-brand-textMuted line-clamp-2">
                  Write concise, 3-step pragmatic responses to everyday dilemmas.
                </p>
              </Link>

              <Link
                to="/student/practice"
                className="p-4 rounded-xl bg-brand-bgSecondary border border-brand-border hover:border-brand-gold/40 transition-colors space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-text group-hover:text-brand-gold transition-colors">
                    Self-Description (SD) Draft
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-card text-brand-gold font-mono">
                    5 Dimensions
                  </span>
                </div>
                <p className="text-xs text-brand-textMuted line-clamp-2">
                  Synthesize real peer and family feedback into an honest SD.
                </p>
              </Link>
            </div>
          </div>

          {/* Weekly Consistency Chart Mock */}
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-brand-text">
                Weekly Practice Activity
              </h3>
              <span className="text-xs font-mono text-brand-steelLight">
                Last 7 Days
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const heights = ['h-16', 'h-24', 'h-20', 'h-28', 'h-14', 'h-32', 'h-24'];
                return (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <div className="w-full bg-brand-bg rounded-t flex items-end justify-center h-32 p-1">
                      <div
                        className={`w-full rounded-t transition-all ${
                          i === 5 ? 'bg-brand-gold' : 'bg-brand-steel/50'
                        } ${heights[i]}`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-brand-textMuted">{day}</span>
                  </div>
                );
              })}
            </div>
            <div className="text-[11px] text-brand-textMuted text-center font-mono pt-1">
              * Demonstration consistency tracking based on locally simulated drills.
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Feedback & Next Session */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Latest Mentor Review */}
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <span className="text-[10px] font-mono uppercase text-brand-gold font-semibold">
                Recent Mentor Review
              </span>
              <span className="text-xs font-mono font-bold text-brand-gold">
                {recentFeedback.scoreIndicator}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-heading font-bold text-sm text-brand-text">
                {recentFeedback.topic}
              </h4>
              <p className="text-[11px] text-brand-steelLight font-mono">
                Reviewed by {recentFeedback.reviewer} • {recentFeedback.date}
              </p>
            </div>

            <p className="text-xs text-brand-textMuted leading-relaxed">
              "{recentFeedback.summary}"
            </p>

            <div className="space-y-1.5 pt-2 border-t border-brand-border/60">
              <span className="text-[10px] font-mono uppercase text-brand-textMuted block">
                Key Action Point:
              </span>
              <p className="text-xs text-brand-steelLight italic">
                {recentFeedback.improvementPoints[0]}
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/student/feedback"
                className="w-full block text-center py-2 rounded-lg bg-brand-bgSecondary border border-brand-border hover:border-brand-gold text-xs text-brand-text transition-colors"
              >
                View Full Feedback History
              </Link>
            </div>
          </div>

          {/* Upcoming Session Details */}
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 space-y-4">
            <span className="text-[10px] font-mono uppercase text-brand-steelLight font-semibold block">
              Scheduled Mentorship Call
            </span>

            <div className="space-y-1">
              <h4 className="font-heading font-bold text-sm text-brand-text">
                {nextSession.title}
              </h4>
              <p className="text-xs text-brand-gold font-mono">
                {nextSession.dateTime}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-brand-bgSecondary border border-brand-border text-xs text-brand-textMuted space-y-1">
              <div className="text-[10px] font-mono text-brand-text uppercase font-semibold">Preparation Notes:</div>
              <p>{nextSession.notes}</p>
            </div>

            <Link
              to="/student/sessions"
              className="w-full block text-center py-2 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold transition-colors shadow-gold-subtle"
            >
              Session Details & Room
            </Link>
          </div>

          {/* Officer-Like Qualities Self-Check */}
          <div className="rounded-2xl bg-brand-bgSecondary border border-brand-border p-6 space-y-3">
            <h4 className="font-heading font-bold text-sm text-brand-text flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-gold" />
              15 OLQ Daily Check
            </h4>
            <p className="text-xs text-brand-textMuted leading-relaxed">
              Did you complete your 3-minute morning mirror elocution drill and 5 km run today?
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] px-2 py-1 rounded bg-brand-card text-brand-gold font-mono border border-brand-border">
                Effective Intelligence
              </span>
              <span className="text-[10px] px-2 py-1 rounded bg-brand-card text-brand-steelLight font-mono border border-brand-border">
                Stamina
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
