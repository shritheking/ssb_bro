import { useState, useEffect } from 'react'
import { Search, BookOpen, Bookmark, BookmarkCheck, ChevronRight } from 'lucide-react'
import { learningResources, ResourceItem } from '../../data/resourceData'

const BOOKMARKS_KEY = 'ssb_bookmarked_resources'
const READ_KEY = 'ssb_read_resources'
const CATEGORIES = ['All', 'Psychology', 'TAT', 'WAT', 'SRT', 'Self Description', 'GTO', 'Personal Interview', 'Communication', 'Defence Awareness']

export default function StudentResourcesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [bookmarked, setBookmarked] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]') } catch { return [] }
  })
  const [read, setRead] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(READ_KEY) || '[]') } catch { return [] }
  })
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const [selected, setSelected] = useState<ResourceItem | null>(null)

  useEffect(() => { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarked)) }, [bookmarked])
  useEffect(() => { localStorage.setItem(READ_KEY, JSON.stringify(read)) }, [read])

  function toggleBookmark(id: string) {
    setBookmarked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function openResource(r: ResourceItem) {
    setSelected(r)
    if (!read.includes(r.id)) setRead(prev => [...prev, r.id])
  }

  // Sort bookmarked first
  const sorted = [...learningResources].sort((a, b) => {
    const aB = bookmarked.includes(a.id) ? 0 : 1
    const bB = bookmarked.includes(b.id) ? 0 : 1
    return aB - bB
  })

  const filtered = sorted.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.keyTopics.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchCat = category === 'All' || r.category === category
    const matchBookmark = !showBookmarksOnly || bookmarked.includes(r.id)
    return matchSearch && matchCat && matchBookmark
  })

  return (
    <div className="p-6 space-y-6 min-h-screen bg-brand-dark text-brand-text">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-brand-text">Resource Library</h1>
        <p className="text-brand-muted text-sm mt-1">
          Study materials, frameworks and tactical guides for your SSB development.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Modules', value: learningResources.length, color: 'text-brand-gold' },
          { label: 'Bookmarked', value: bookmarked.length, color: 'text-brand-steel' },
          { label: 'Completed', value: read.length, color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="bg-brand-card border border-white/10 rounded-lg p-4 text-center">
            <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
            <p className="text-brand-muted text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search topics, keywords..."
              className="w-full bg-brand-card border border-white/10 rounded pl-10 pr-4 py-2 text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold/50"
            />
          </div>
          <button
            onClick={() => setShowBookmarksOnly(b => !b)}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm border transition-colors ${showBookmarksOnly ? 'bg-brand-gold/20 border-brand-gold/40 text-brand-gold' : 'border-white/10 text-brand-muted hover:bg-white/5'}`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Saved</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors ${category === cat ? 'bg-brand-gold text-brand-dark font-semibold' : 'border border-white/10 text-brand-muted hover:bg-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      {filtered.length === 0 ? (
        <div className="bg-brand-card border border-white/10 rounded-lg p-12 text-center">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-brand-muted opacity-30" />
          <p className="text-brand-muted">No modules match your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => {
            const isBookmarked = bookmarked.includes(r.id)
            const isRead = read.includes(r.id)
            return (
              <div
                key={r.id}
                className="bg-brand-card border border-white/10 rounded-xl p-5 flex flex-col gap-3 hover:border-brand-gold/30 transition-colors group"
              >
                {/* Top */}
                <div className="flex items-start justify-between">
                  <span className="text-xs bg-brand-steel/20 text-brand-steel px-2 py-0.5 rounded font-medium">
                    {r.category}
                  </span>
                  <button
                    onClick={() => toggleBookmark(r.id)}
                    className={`transition-colors ${isBookmarked ? 'text-brand-gold' : 'text-brand-muted hover:text-brand-gold'}`}
                  >
                    {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                {/* Title & desc */}
                <div>
                  <h3 className="font-heading font-semibold text-brand-text leading-snug">{r.title}</h3>
                  <p className="text-brand-muted text-xs mt-1 line-clamp-2">{r.description}</p>
                </div>

                {/* Key Topics */}
                <div className="flex flex-wrap gap-1">
                  {r.keyTopics.slice(0, 3).map(topic => (
                    <span key={topic} className="text-xs bg-white/10 text-brand-muted px-1.5 py-0.5 rounded">
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/10 text-xs">
                  <span className="text-brand-muted">{r.estimatedReadTime}</span>
                  <div className="flex items-center gap-2">
                    {isRead && (
                      <span className="text-green-400">✓ Read</span>
                    )}
                    <button
                      onClick={() => openResource(r)}
                      className="flex items-center gap-1 text-brand-gold hover:text-brand-gold/80 font-medium transition-colors"
                    >
                      Study <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Resource Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setSelected(null)}>
          <div
            className="bg-brand-secondary border border-white/10 rounded-xl w-full max-w-2xl my-8 p-6 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs bg-brand-steel/20 text-brand-steel px-2 py-0.5 rounded font-medium">
                  {selected.category} · {selected.estimatedReadTime}
                </span>
                <h2 className="mt-2 text-xl font-heading font-bold text-brand-text">{selected.title}</h2>
                <p className="text-brand-muted text-sm mt-1">{selected.description}</p>
              </div>
              <button
                onClick={() => toggleBookmark(selected.id)}
                className={`flex-shrink-0 transition-colors ${bookmarked.includes(selected.id) ? 'text-brand-gold' : 'text-brand-muted hover:text-brand-gold'}`}
              >
                {bookmarked.includes(selected.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
            </div>

            {/* Content Body */}
            <div className="bg-brand-dark rounded-lg p-5 text-sm text-brand-muted leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {selected.contentBody}
            </div>

            {/* Practice Exercises if any */}
            {selected.sampleExercise && (
              <div className="bg-brand-card border border-brand-gold/20 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold text-brand-gold">Practical Exercise Analysis</h4>
                <p className="text-xs text-brand-text font-medium"><span className="text-brand-muted">Stimulus:</span> {selected.sampleExercise.prompt}</p>
                <p className="text-xs text-brand-muted"><span className="text-brand-steel">Approach:</span> {selected.sampleExercise.analysis}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  {selected.sampleExercise.dosAndDonts.map((item, idx) => (
                    <div key={idx} className="bg-brand-dark/50 p-2.5 rounded border border-white/5 space-y-1">
                      <p className="text-green-400 font-medium">✓ {item.do}</p>
                      <p className="text-red-400/90">✗ {item.dont}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Topics */}
            <div className="flex flex-wrap gap-2">
              {selected.keyTopics.map(topic => (
                <span key={topic} className="text-xs bg-white/10 text-brand-muted px-2 py-1 rounded">{topic}</span>
              ))}
            </div>

            <button
              onClick={() => setSelected(null)}
              className="w-full bg-brand-card hover:bg-white/10 border border-white/20 text-brand-text py-2.5 rounded text-sm font-medium transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
