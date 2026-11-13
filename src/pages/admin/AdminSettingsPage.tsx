import React, { useState, useEffect } from 'react'
import { User, Bell, Shield, Layers, Save, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { Logo } from '../../components/common/Logo'

const PROFILE_KEY = 'ssb_admin_profile'
const PREFS_KEY = 'ssb_admin_prefs'

type AdminProfile = {
  name: string
  email: string
  phone: string
  role: string
  bio: string
}

type Preferences = {
  emailNewSubmission: boolean
  emailNewAspirант: boolean
  emailSessionReminder: boolean
  desktopNotifications: boolean
  weeklyReport: boolean
}

type FeatureFlags = {
  practiceTimer: boolean
  progressTracking: boolean
  sessionBooking: boolean
  feedbackSystem: boolean
  resourceLibrary: boolean
}

const defaultProfile: AdminProfile = {
  name: 'Lt. Vamshi E.',
  email: 'mentor@ssbbro.concept',
  phone: '+91 98XXX XXXXX',
  role: 'Lead Mentor & Founder',
  bio: 'Defence aspirant mentor with personal SSB experience. AIR 34, CDS 2 2019.',
}

const defaultPrefs: Preferences = {
  emailNewSubmission: true,
  emailNewAspirант: true,
  emailSessionReminder: true,
  desktopNotifications: false,
  weeklyReport: true,
}

const defaultFlags: FeatureFlags = {
  practiceTimer: true,
  progressTracking: true,
  sessionBooking: true,
  feedbackSystem: true,
  resourceLibrary: true,
}

const SECTIONS = ['Profile', 'Branding', 'Notifications', 'Portal Config'] as const
type Section = typeof SECTIONS[number]

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('Profile')
  const [profile, setProfile] = useState<AdminProfile>(() => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '') } catch { return defaultProfile }
  })
  const [prefs, setPrefs] = useState<Preferences>(() => {
    try { return JSON.parse(localStorage.getItem(PREFS_KEY) || '') } catch { return defaultPrefs }
  })
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags)
  const [saved, setSaved] = useState<string | null>(null)

  function saveProfile() {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    setSaved('Profile saved.')
    setTimeout(() => setSaved(null), 3000)
  }

  function savePrefs() {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
    setSaved('Notification preferences saved.')
    setTimeout(() => setSaved(null), 3000)
  }

  function resetProfile() {
    setProfile(defaultProfile)
  }

  return (
    <div className="p-6 min-h-screen bg-brand-dark text-brand-text">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-bold text-brand-text">Settings</h1>
          <p className="text-brand-muted text-sm mt-1">Manage your admin profile and portal configuration</p>
        </div>

        {/* Toast */}
        {saved && (
          <div className="bg-green-500/20 border border-green-500/40 text-green-300 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <Save className="w-4 h-4" /> {saved}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Nav */}
          <div className="lg:w-56 flex-shrink-0">
            <nav className="bg-brand-card border border-white/10 rounded-lg overflow-hidden">
              {SECTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setActiveSection(s)}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 border-b border-white/5 last:border-0 transition-colors ${activeSection === s ? 'bg-brand-gold/10 text-brand-gold border-l-2 border-brand-gold' : 'text-brand-muted hover:bg-white/5'}`}
                >
                  {s === 'Profile' && <User className="w-4 h-4" />}
                  {s === 'Branding' && <Layers className="w-4 h-4" />}
                  {s === 'Notifications' && <Bell className="w-4 h-4" />}
                  {s === 'Portal Config' && <Shield className="w-4 h-4" />}
                  {s}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-5">

            {/* Profile Section */}
            {activeSection === 'Profile' && (
              <div className="bg-brand-card border border-white/10 rounded-xl p-6 space-y-5">
                <h2 className="font-heading font-bold text-brand-text flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-gold" /> Admin Profile
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', key: 'name' as keyof AdminProfile, placeholder: 'Your name' },
                    { label: 'Email Address', key: 'email' as keyof AdminProfile, placeholder: 'admin@example.com' },
                    { label: 'Phone', key: 'phone' as keyof AdminProfile, placeholder: '+91 9XXXXXX' },
                    { label: 'Role', key: 'role' as keyof AdminProfile, placeholder: 'Lead Mentor' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-xs text-brand-muted uppercase tracking-wider">{field.label}</label>
                      <input
                        value={profile[field.key]}
                        onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                        className="mt-1 w-full bg-brand-dark border border-white/10 rounded px-3 py-2 text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold/50"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-xs text-brand-muted uppercase tracking-wider">Bio / Tagline</label>
                  <textarea
                    value={profile.bio}
                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    rows={3}
                    className="mt-1 w-full bg-brand-dark border border-white/10 rounded px-3 py-2 text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold/50 resize-none"
                    placeholder="Short bio or tagline"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={resetProfile} className="flex items-center gap-2 text-sm text-brand-muted border border-white/10 px-4 py-2 rounded hover:bg-white/5 transition-colors">
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                  <button onClick={saveProfile} className="flex items-center gap-2 text-sm bg-brand-gold text-brand-dark px-4 py-2 rounded font-semibold hover:bg-brand-gold/90 transition-colors">
                    <Save className="w-4 h-4" /> Save Profile
                  </button>
                </div>
              </div>
            )}

            {/* Branding Section */}
            {activeSection === 'Branding' && (
              <div className="bg-brand-card border border-white/10 rounded-xl p-6 space-y-6">
                <h2 className="font-heading font-bold text-brand-text flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-gold" /> Brand Identity
                </h2>
                <p className="text-brand-muted text-sm">Preview the SSB BRO logo variants used throughout the platform.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Horizontal Logo (default)', variant: 'horizontal' as const },
                    { label: 'Compact Emblem', variant: 'compact' as const },
                    { label: 'Wordmark Only', variant: 'wordmark' as const },
                    { label: 'Monochrome Version', variant: 'monochrome' as const },
                  ].map(({ label, variant }) => (
                    <div key={variant} className="bg-brand-dark border border-white/10 rounded-lg p-5 flex flex-col items-center gap-3">
                      <p className="text-xs text-brand-muted uppercase tracking-wider">{label}</p>
                      <div className="py-2">
                        <Logo variant={variant} size="md" withLink={false} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-brand-dark/60 border border-white/10 rounded-lg p-4">
                  <p className="text-xs text-brand-muted">
                    <span className="text-brand-gold font-semibold">Brand Colours:</span>{' '}
                    <span className="font-mono">#0B1422</span> (dark) ·{' '}
                    <span className="font-mono">#C8A96B</span> (gold) ·{' '}
                    <span className="font-mono">#6F91B8</span> (steel) ·{' '}
                    <span className="font-mono">#F4F3EF</span> (text)
                  </p>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'Notifications' && (
              <div className="bg-brand-card border border-white/10 rounded-xl p-6 space-y-5">
                <h2 className="font-heading font-bold text-brand-text flex items-center gap-2">
                  <Bell className="w-5 h-5 text-brand-gold" /> Notification Preferences
                </h2>

                <div className="space-y-3">
                  {(Object.entries(prefs) as [keyof Preferences, boolean][]).map(([key, val]) => {
                    const labels: Record<keyof Preferences, string> = {
                      emailNewSubmission: 'Email on new assignment submission',
                      emailNewAspirант: 'Email when a new aspirant joins',
                      emailSessionReminder: 'Email session reminder (24h before)',
                      desktopNotifications: 'Desktop / browser push notifications',
                      weeklyReport: 'Weekly summary report email',
                    }
                    return (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-sm text-brand-text">{labels[key]}</p>
                          <p className="text-xs text-brand-muted mt-0.5">
                            {key === 'desktopNotifications' ? '(Demo — no real push integration)' : '(Demo — no real email sent)'}
                          </p>
                        </div>
                        <button
                          onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
                          className={`relative w-11 h-6 rounded-full transition-colors ${val ? 'bg-brand-gold' : 'bg-white/20'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${val ? 'translate-x-5' : ''}`} />
                        </button>
                      </div>
                    )
                  })}
                </div>

                <button onClick={savePrefs} className="flex items-center gap-2 text-sm bg-brand-gold text-brand-dark px-4 py-2 rounded font-semibold hover:bg-brand-gold/90 transition-colors">
                  <Save className="w-4 h-4" /> Save Preferences
                </button>
              </div>
            )}

            {/* Portal Config Section */}
            {activeSection === 'Portal Config' && (
              <div className="bg-brand-card border border-white/10 rounded-xl p-6 space-y-5">
                <h2 className="font-heading font-bold text-brand-text flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-gold" /> Portal Feature Configuration
                </h2>
                <p className="text-brand-muted text-sm">Enable or disable portal features. Changes are for demo purposes only.</p>

                <div className="space-y-3">
                  {(Object.entries(flags) as [keyof FeatureFlags, boolean][]).map(([key, val]) => {
                    const labels: Record<keyof FeatureFlags, { title: string; desc: string }> = {
                      practiceTimer: { title: 'Practice Centre Timer', desc: 'TAT / WAT / SRT timed drills for students' },
                      progressTracking: { title: 'Progress Tracking', desc: 'OLQ skill tracking and habit streaks' },
                      sessionBooking: { title: 'Session Booking', desc: 'Allow students to book mentoring sessions' },
                      feedbackSystem: { title: 'Feedback System', desc: 'Diagnostic feedback notes from mentor to students' },
                      resourceLibrary: { title: 'Resource Library', desc: 'Public and student-facing learning resources' },
                    }
                    const { title, desc } = labels[key]
                    return (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-sm text-brand-text">{title}</p>
                          <p className="text-xs text-brand-muted mt-0.5">{desc}</p>
                        </div>
                        <button
                          onClick={() => setFlags(f => ({ ...f, [key]: !f[key] }))}
                          className={`relative w-11 h-6 rounded-full transition-colors ${val ? 'bg-brand-gold' : 'bg-white/20'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${val ? 'translate-x-5' : ''}`} />
                        </button>
                      </div>
                    )
                  })}
                </div>

                <div className="bg-brand-dark border border-brand-gold/20 rounded-lg p-4">
                  <p className="text-xs text-brand-gold/80">
                    <span className="font-semibold">Demo Note:</span> These toggles are for demonstration purposes and do not affect live functionality in this static preview. Backend integration would be required to enforce feature gating.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
