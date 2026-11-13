import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, ChevronDown, Search, X, Shield, 
  MessageSquare, ArrowRight, AlertTriangle 
} from 'lucide-react';
import { faqsList, FAQItem } from '../../data/faqData';

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']);

  const categories = [
    { label: 'All Questions', value: 'all' },
    { label: 'Basics & Protocol', value: 'Basics' },
    { label: 'Testing Stages', value: 'Testing Stages' },
    { label: 'Psychology & Interview', value: 'Psychology & Interview' },
    { label: 'Mentorship & Philosophy', value: 'Mentorship & Philosophy' },
  ];

  const toggleAccordion = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter(item => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const filteredFaqs = faqsList.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16 md:space-y-24 pb-24">
      {/* 1. Header Section */}
      <section className="relative pt-12 md:pt-20 border-b border-brand-border pb-16">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-gold/15 text-brand-gold text-xs font-mono uppercase tracking-widest font-semibold">
            Common Aspirant Enquiries
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-text max-w-4xl leading-tight">
            Frequently Asked <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-text via-brand-goldLight to-brand-gold">
              Questions.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-brand-textMuted max-w-3xl leading-relaxed">
            Transparent, unvarnished guidance on the 5-day assessment process, psychological batteries, personal interview prep, and mentorship ethics.
          </p>

          {/* Zero guarantee notice */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-bgSecondary border border-brand-border max-w-2xl text-xs text-brand-steelLight">
            <AlertTriangle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-brand-gold uppercase font-mono">Zero Selection Guarantee:</span> SSB BRO does not guarantee recommendation or selection. Armed forces commissions are decided solely by the Ministry of Defence selection boards based on personal character and aptitude.
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search & Category Filter */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="relative">
          <Search className="w-4 h-4 text-brand-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions (e.g. screening, TAT, guarantee, interview)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-card border border-brand-border focus:border-brand-gold text-brand-text text-sm placeholder:text-brand-textMuted focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-textMuted hover:text-brand-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat.value
                  ? 'bg-brand-gold text-brand-lightText font-semibold'
                  : 'bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-textMuted hover:text-brand-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Accordion List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-brand-textMuted text-sm bg-brand-card rounded-xl border border-brand-border">
              No matching questions found. Try a different keyword or view all categories.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-6 text-left flex items-start justify-between gap-4 focus:outline-none"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-brand-gold uppercase tracking-wider block">
                        {faq.category}
                      </span>
                      <h3 className="font-heading font-semibold text-base sm:text-lg text-brand-text leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full bg-brand-bgSecondary flex items-center justify-center shrink-0 text-brand-steelLight border border-brand-border transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-gold border-brand-gold/40' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-brand-textMuted leading-relaxed whitespace-pre-line border-t border-brand-border/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 4. Bottom Support CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-brand-bgSecondary border border-brand-border p-8 text-center space-y-4">
          <h3 className="font-heading text-xl font-bold text-brand-text">
            Still Have an Unanswered Question?
          </h3>
          <p className="text-xs sm:text-sm text-brand-textMuted max-w-md mx-auto">
            Our team welcomes specific queries regarding your stage of preparation, previous attempt debriefs, or general guidance.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-brand-gold text-brand-lightText hover:bg-brand-goldLight transition-colors"
            >
              Reach Out Via Contact Form
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
