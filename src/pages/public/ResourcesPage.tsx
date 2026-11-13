import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Bookmark, BookmarkCheck, Clock, 
  ChevronRight, X, Filter, CheckCircle2, AlertCircle, Info, Sparkles 
} from 'lucide-react';
import { learningResources, ResourceItem } from '../../data/resourceData';
import { useToast } from '../../context/ToastContext';

export const ResourcesPage: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeResource, setActiveResource] = useState<ResourceItem | null>(null);
  
  // Bookmarks stored in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ssb_bookmarked_resources');
    return saved ? JSON.parse(saved) : ['res-tat-realism'];
  });

  // Reading progress demo stored in localStorage
  const [readResourceIds, setReadResourceIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ssb_read_resources');
    return saved ? JSON.parse(saved) : ['res-tat-realism'];
  });

  const categories = [
    { label: 'All Resources', value: 'all' },
    { label: 'SSB Basics', value: 'SSB Basics' },
    { label: 'Psychology', value: 'Psychology' },
    { label: 'TAT', value: 'TAT' },
    { label: 'WAT', value: 'WAT' },
    { label: 'SRT', value: 'SRT' },
    { label: 'Self Description', value: 'Self Description' },
    { label: 'GTO Tasks', value: 'GTO' },
    { label: 'Personal Interview', value: 'Personal Interview' },
    { label: 'Communication', value: 'Communication' },
    { label: 'Defence Awareness', value: 'Defence Awareness' },
  ];

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter(item => item !== id);
      showToast('Removed resource from saved bookmarks', 'info');
    } else {
      updated = [...bookmarkedIds, id];
      showToast('Saved resource to your bookmarks', 'success');
    }
    setBookmarkedIds(updated);
    localStorage.setItem('ssb_bookmarked_resources', JSON.stringify(updated));
  };

  const markAsRead = (id: string) => {
    if (!readResourceIds.includes(id)) {
      const updated = [...readResourceIds, id];
      setReadResourceIds(updated);
      localStorage.setItem('ssb_read_resources', JSON.stringify(updated));
      showToast('Guide marked as completed', 'success');
    }
  };

  // Filtered resources
  const filtered = learningResources.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyTopics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const readPercentage = Math.round((readResourceIds.length / learningResources.length) * 100);

  return (
    <div className="space-y-16 md:space-y-24 pb-24">
      {/* 1. Header Section */}
      <section className="relative pt-12 md:pt-20 border-b border-brand-border pb-16">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-gold/15 text-brand-gold text-xs font-mono uppercase tracking-widest font-semibold">
            Educational Knowledge Base
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-text max-w-4xl leading-tight">
            SSB Learning <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-text via-brand-goldLight to-brand-gold">
              Resource Library.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-brand-textMuted max-w-3xl leading-relaxed">
            In-depth analytical guides, psychological test breakdowns, and communication drills developed to replace rote memorization with authentic self-reflection.
          </p>

          {/* Reading Progress Indicator Banner */}
          <div className="p-4 rounded-xl bg-brand-bgSecondary border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-2xl">
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase text-brand-gold font-semibold">
                Demo Reading Progress
              </div>
              <div className="text-xs text-brand-textMuted">
                {readResourceIds.length} of {learningResources.length} guides read • {bookmarkedIds.length} bookmarked
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:w-48">
              <div className="w-full bg-brand-bg h-2 rounded-full overflow-hidden border border-brand-border">
                <div
                  className="bg-brand-gold h-full rounded-full transition-all duration-500"
                  style={{ width: `${readPercentage}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-brand-text">
                {readPercentage}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search & Category Controls */}
      <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-brand-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides by title, category, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-brand-card border border-brand-border focus:border-brand-gold text-brand-text text-xs placeholder:text-brand-textMuted focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-textMuted hover:text-brand-text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick info tag */}
          <span className="text-xs text-brand-textMuted font-mono">
            Showing {filtered.length} curated educational materials
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.value
                  ? 'bg-brand-gold text-brand-lightText font-semibold'
                  : 'bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-textMuted hover:text-brand-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Resources Grid */}
      <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            const isRead = readResourceIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveResource(item);
                  markAsRead(item.id);
                }}
                className="rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col justify-between hover:border-brand-gold/40 transition-all duration-300 shadow-card cursor-pointer group"
              >
                <div className="space-y-4">
                  {/* Category & Read Time & Bookmark icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-bg text-brand-gold uppercase">
                      {item.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-brand-textMuted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.estimatedReadTime}
                      </span>
                      <button
                        onClick={(e) => toggleBookmark(item.id, e)}
                        className={`p-1 rounded hover:bg-brand-bg transition-colors ${
                          isBookmarked ? 'text-brand-gold' : 'text-brand-textMuted hover:text-brand-text'
                        }`}
                        title={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-base text-brand-text group-hover:text-brand-gold transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-brand-textMuted line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Topics badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.keyTopics.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-brand-bgSecondary border border-brand-border text-brand-steelLight"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-6 border-t border-brand-border mt-6 flex items-center justify-between text-xs">
                  <span className="font-semibold text-brand-text group-hover:text-brand-gold transition-colors flex items-center gap-1.5">
                    Read Guide & Exercise
                    <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </span>

                  {isRead && (
                    <span className="text-[10px] font-mono text-brand-steelLight flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-brand-gold" />
                      Read
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Educational Preview Modal */}
      {activeResource && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setActiveResource(null)}
        >
          <div
            className="bg-brand-bgSecondary border border-brand-borderGold max-w-3xl w-full rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-brand-border pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-brand-gold uppercase">
                  <span>{activeResource.category}</span>
                  <span>•</span>
                  <span>{activeResource.estimatedReadTime}</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-brand-text mt-1">
                  {activeResource.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark(activeResource.id)}
                  className={`p-1.5 rounded border border-brand-border ${
                    bookmarkedIds.includes(activeResource.id)
                      ? 'bg-brand-card text-brand-gold border-brand-gold/40'
                      : 'text-brand-textMuted hover:text-brand-text'
                  }`}
                  title="Toggle bookmark"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveResource(null)}
                  className="p-1 rounded-md text-brand-textMuted hover:text-brand-text transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-brand-gold font-semibold">
                Diagnostic Analysis & Core Principles
              </h4>
              <div className="text-sm text-brand-textMuted leading-relaxed whitespace-pre-line bg-brand-card/50 p-5 rounded-xl border border-brand-border">
                {activeResource.contentBody}
              </div>
            </div>

            {/* Sample Exercise & Do's / Don'ts if present */}
            {activeResource.sampleExercise && (
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-brand-steelLight font-semibold">
                  Sample Practice Drill & Analysis
                </h4>
                
                <div className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-3">
                  <div className="text-xs font-bold text-brand-text font-mono">
                    PROMPT: {activeResource.sampleExercise.prompt}
                  </div>
                  <p className="text-xs text-brand-textMuted italic">
                    Analysis: {activeResource.sampleExercise.analysis}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {activeResource.sampleExercise.dosAndDonts.map((rule, idx) => (
                      <div key={idx} className="space-y-2 text-xs">
                        <div className="p-2.5 rounded bg-brand-bg border border-green-500/20 text-green-300">
                          <strong className="text-green-400 block mb-1">DO:</strong>
                          {rule.do}
                        </div>
                        <div className="p-2.5 rounded bg-brand-bg border border-red-500/20 text-red-300">
                          <strong className="text-red-400 block mb-1">AVOID:</strong>
                          {rule.dont}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Advisory disclaimer */}
            <div className="p-3.5 rounded-lg bg-brand-bg border border-brand-border text-[11px] text-brand-steelLight leading-relaxed">
              <span className="text-brand-gold font-semibold font-mono">Demonstration Content Notice:</span> These materials are educational models designed for self-study and mindset refinement, not an official Services Selection Board manual.
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-brand-border flex justify-between items-center">
              <span className="text-xs text-brand-textMuted font-mono">
                {bookmarkedIds.includes(activeResource.id) ? 'Saved in bookmarks' : 'Not bookmarked'}
              </span>
              <button
                onClick={() => setActiveResource(null)}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-text transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
