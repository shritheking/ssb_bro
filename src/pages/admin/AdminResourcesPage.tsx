import React, { useState, useEffect } from 'react'
import { Search, BookOpen, Video, FileText, Mic, Plus, Trash2, Edit3, ExternalLink, Tag } from 'lucide-react'
import { learningResources } from '../../data/resourceData'

type Resource = {
  id: string
  title: string
  category: string
  type: string
  description: string
  tags: string[]
  readTime?: string
  videoLength?: string
}

const STORAGE_KEY = 'ssb_admin_resources'

const categoryColors: Record<string, string> = {
  'SSB Basics': 'bg-brand-steel/20 text-brand-steel',
  'Psychology': 'bg-purple-500/20 text-purple-300',
  'GTO': 'bg-green-500/20 text-green-300',
  'Interview': 'bg-yellow-500/20 text-yellow-300',
  'OLQ': 'bg-brand-gold/20 text-brand-gold',
  'Communication': 'bg-cyan-500/20 text-cyan-300',
  'Fitness': 'bg-red-500/20 text-red-300',
  'Strategy': 'bg-orange-500/20 text-orange-300',
}

const typeIcon = (type: string) => {
  switch (type) {
    case 'video': return <Video className="w-4 h-4" />
    case 'audio': return <Mic className="w-4 h-4" />
    default: return <FileText className="w-4 h-4" />
  }
}

const emptyForm = { title: '', category: 'SSB Basics', type: 'article', description: '', tags: '', readTime: '' }
const CATEGORIES = ['SSB Basics', 'Psychology', 'GTO', 'Interview', 'OLQ', 'Communication', 'Fitness', 'Strategy']

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : learningResources.map(r => ({
        id: r.id,
        title: r.title,
        category: r.category,
        type: 'article',
        description: r.description,
        tags: r.keyTopics || [],
        readTime: r.estimatedReadTime,
      }))
    } catch { return [] }
  })

  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resources))
  }, [resources])

  const filtered = resources.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'All' || r.category === filterCat
    return matchSearch && matchCat
  })

  function openAdd() {
    setForm({ ...emptyForm })
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(r: Resource) {
    setForm({
      title: r.title,
      category: r.category,
      type: r.type,
      description: r.description,
      tags: r.tags.join(', '),
      readTime: r.readTime || '',
    })
    setEditingId(r.id)
    setShowModal(true)
  }

  function handleSave() {
    if (!form.title.trim()) return
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    if (editingId) {
      setResources(prev => prev.map(r => r.id === editingId
        ? { ...r, ...form, tags }
        : r
      ))
    } else {
      const newResource: Resource = {
        id: `res-${Date.now()}`,
        title: form.title,
        category: form.category,
        type: form.type,
        description: form.description,
        tags,
        readTime: form.readTime || undefined,
      }
      setResources(prev => [newResource, ...prev])
    }
    setShowModal(false)
  }

  function handleDelete(id: string) {
    setResources(prev => prev.filter(r => r.id !== id))
    setDeleteConfirmId(null)
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-brand-dark text-brand-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-brand-text">Resource Library</h1>
          <p className="text-brand-muted text-sm mt-1">Manage learning materials for aspirants</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand-gold text-brand-dark px-4 py-2 rounded font-semibold text-sm hover:bg-brand-gold/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Resource
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Resources', value: resources.length, color: 'text-brand-gold' },
          { label: 'Articles', value: resources.filter(r => r.type === 'article').length, color: 'text-brand-steel' },
          { label: 'Videos', value: resources.filter(r => r.type === 'video').length, color: 'text-purple-400' },
          { label: 'Categories', value: new Set(resources.map(r => r.category)).size, color: 'text-green-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-brand-card border border-white/10 rounded-lg p-4">
            <p className={`text-2xl font-heading font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-brand-muted text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resources…"
            className="w-full bg-brand-card border border-white/10 rounded pl-10 pr-4 py-2 text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold/50"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="bg-brand-card border border-white/10 rounded px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-gold/50"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Resource Table */}
      <div className="bg-brand-card border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-brand-muted text-xs uppercase tracking-wider">
                <th className="text-left p-4">Resource</th>
                <th className="text-left p-4 hidden md:table-cell">Category</th>
                <th className="text-left p-4 hidden lg:table-cell">Type</th>
                <th className="text-left p-4 hidden lg:table-cell">Tags</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-brand-muted">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No resources found.
                  </td>
                </tr>
              )}
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-brand-text">{r.title}</p>
                    <p className="text-brand-muted text-xs mt-0.5 line-clamp-1">{r.description}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[r.category] || 'bg-white/10 text-brand-muted'}`}>
                      {r.category}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-brand-muted capitalize">
                      {typeIcon(r.type)} {r.type}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {r.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-white/10 text-brand-muted px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(r)}
                        className="p-1.5 text-brand-muted hover:text-brand-gold transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(r.id)}
                        className="p-1.5 text-brand-muted hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-brand-muted text-xs text-right">
        Showing {filtered.length} of {resources.length} resources
      </p>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-brand-secondary border border-white/10 rounded-xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-heading font-bold text-brand-text">
              {editingId ? 'Edit Resource' : 'Add New Resource'}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-brand-muted uppercase tracking-wider">Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="mt-1 w-full bg-brand-card border border-white/10 rounded px-3 py-2 text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold/50"
                  placeholder="Resource title"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-brand-muted uppercase tracking-wider">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="mt-1 w-full bg-brand-card border border-white/10 rounded px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-gold/50"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-brand-muted uppercase tracking-wider">Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="mt-1 w-full bg-brand-card border border-white/10 rounded px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-gold/50"
                  >
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="guide">Guide</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-brand-muted uppercase tracking-wider">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full bg-brand-card border border-white/10 rounded px-3 py-2 text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold/50 resize-none"
                  placeholder="Brief description of the resource"
                />
              </div>

              <div>
                <label className="text-xs text-brand-muted uppercase tracking-wider">Tags (comma separated)</label>
                <input
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  className="mt-1 w-full bg-brand-card border border-white/10 rounded px-3 py-2 text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold/50"
                  placeholder="e.g. OIR, psychology, interview"
                />
              </div>

              <div>
                <label className="text-xs text-brand-muted uppercase tracking-wider">Read Time / Duration</label>
                <input
                  value={form.readTime}
                  onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
                  className="mt-1 w-full bg-brand-card border border-white/10 rounded px-3 py-2 text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold/50"
                  placeholder="e.g. 8 min read"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-white/20 text-brand-muted py-2 rounded text-sm hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim()}
                className="flex-1 bg-brand-gold text-brand-dark py-2 rounded text-sm font-semibold hover:bg-brand-gold/90 disabled:opacity-50 transition-colors"
              >
                {editingId ? 'Save Changes' : 'Add Resource'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirmId(null)}>
          <div className="bg-brand-secondary border border-white/10 rounded-xl w-full max-w-sm p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-brand-text">Delete Resource?</h3>
                <p className="text-brand-muted text-sm">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-white/20 text-brand-muted py-2 rounded text-sm hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 bg-red-500/80 text-white py-2 rounded text-sm font-semibold hover:bg-red-500 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
