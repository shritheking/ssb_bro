import React, { useState, useEffect } from 'react'
import { Bell, CheckCheck, Info, AlertTriangle, Award, Users, BookOpen, Calendar, Trash2, Filter } from 'lucide-react'
import { initialAdminNotifications } from '../../data/mockAdminData'

type Notification = {
  id: string
  type: 'info' | 'alert' | 'achievement' | 'submission' | 'session' | 'aspirant'
  title: string
  message: string
  time: string
  read: boolean
}

const STORAGE_KEY = 'ssb_admin_notifications'

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  info: { icon: <Info className="w-4 h-4" />, color: 'text-brand-steel', bg: 'bg-brand-steel/20' },
  alert: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
  achievement: { icon: <Award className="w-4 h-4" />, color: 'text-brand-gold', bg: 'bg-brand-gold/20' },
  submission: { icon: <BookOpen className="w-4 h-4" />, color: 'text-purple-400', bg: 'bg-purple-400/20' },
  session: { icon: <Calendar className="w-4 h-4" />, color: 'text-green-400', bg: 'bg-green-400/20' },
  aspirant: { icon: <Users className="w-4 h-4" />, color: 'text-cyan-400', bg: 'bg-cyan-400/20' },
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    // Seed from mock data
    return (initialAdminNotifications as any[]).map((n, i) => ({
      id: n.id || `notif-${i}`,
      type: n.type || 'info',
      title: n.title || n.message?.slice(0, 40) || 'Notification',
      message: n.message || '',
      time: n.time || n.timestamp || 'Recently',
      read: n.read !== undefined ? n.read : !(n.unread ?? true),
    }))
  })

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  const unreadCount = notifications.filter(n => !n.read).length

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'read') return n.read
    return true
  })

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  function deleteNotif(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  function clearRead() {
    setNotifications(prev => prev.filter(n => !n.read))
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-brand-dark text-brand-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-heading font-bold text-brand-text">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-brand-gold text-brand-dark text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-brand-muted text-sm mt-1">Stay updated on aspirant activity and platform events</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 text-sm text-brand-muted border border-white/10 px-3 py-2 rounded hover:bg-white/5 disabled:opacity-40 transition-colors"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
          <button
            onClick={clearRead}
            className="flex items-center gap-2 text-sm text-brand-muted border border-white/10 px-3 py-2 rounded hover:bg-white/5 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear read
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: notifications.length, color: 'text-brand-text' },
          { label: 'Unread', value: unreadCount, color: 'text-brand-gold' },
          { label: 'Read', value: notifications.filter(n => n.read).length, color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="bg-brand-card border border-white/10 rounded-lg p-4 text-center">
            <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
            <p className="text-brand-muted text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'unread', 'read'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded text-sm capitalize transition-colors ${filter === f ? 'bg-brand-gold text-brand-dark font-semibold' : 'text-brand-muted border border-white/10 hover:bg-white/5'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="bg-brand-card border border-white/10 rounded-lg p-12 text-center">
            <Bell className="w-10 h-10 mx-auto mb-3 text-brand-muted opacity-30" />
            <p className="text-brand-muted">No {filter !== 'all' ? filter : ''} notifications.</p>
          </div>
        )}
        {filtered.map(n => {
          const cfg = typeConfig[n.type] || typeConfig.info
          return (
            <div
              key={n.id}
              className={`flex items-start gap-4 bg-brand-card border rounded-lg p-4 transition-colors ${!n.read ? 'border-brand-gold/20 bg-brand-gold/5' : 'border-white/10'}`}
            >
              {/* Icon */}
              <div className={`flex-shrink-0 w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center ${cfg.color}`}>
                {cfg.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`font-medium text-sm ${!n.read ? 'text-brand-text' : 'text-brand-muted'}`}>
                      {n.title}
                    </p>
                    <p className="text-brand-muted text-xs mt-0.5">{n.message}</p>
                  </div>
                  <span className="text-brand-muted text-xs whitespace-nowrap flex-shrink-0">{n.time}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="p-1.5 text-brand-muted hover:text-brand-gold transition-colors"
                    title="Mark as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotif(n.id)}
                  className="p-1.5 text-brand-muted hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
