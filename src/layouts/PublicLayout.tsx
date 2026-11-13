import React, { useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { 
  Menu, X, ChevronRight, Shield, Award, Compass, 
  ExternalLink, User, Lock, Heart, ArrowUpRight 
} from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'My Journey', path: '/journey' },
    { name: 'Programmes', path: '/programmes' },
    { name: 'Resources', path: '/resources' },
    { name: 'Success Stories', path: '/stories' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text">
      {/* Top Advisory Bar */}
      <div className="bg-brand-bgSecondary border-b border-brand-border py-2 px-4 text-xs text-brand-textMuted text-center font-sans">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
          <span className="text-brand-gold font-semibold">Concept Prototype</span>
          — Prepared by NextGen Web Studio for SSB BRO & Lt. Vamshi E.
        </span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border transition-all">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 py-1 border-b-2 ${
                    isActive
                      ? 'text-brand-gold border-brand-gold font-semibold'
                      : 'text-brand-textMuted border-transparent hover:text-brand-text hover:border-brand-steelLight/40'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/student/login"
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-brand-card hover:bg-brand-cardHover border border-brand-border hover:border-brand-steelLight text-brand-text transition-all duration-200"
            >
              <User className="w-3.5 h-3.5 text-brand-steelLight" />
              Student Portal
            </Link>

            <Link
              to="/journey"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-brand-gold hover:bg-brand-goldLight text-brand-lightText shadow-gold-subtle transition-all duration-200"
            >
              The 5 Attempts
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-brand-textMuted hover:text-brand-text rounded-md focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-bgSecondary border-b border-brand-border px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-brand-card text-brand-gold font-semibold'
                      : 'text-brand-textMuted hover:text-brand-text hover:bg-brand-card/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-brand-border flex flex-col gap-2.5">
              <Link
                to="/student/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold bg-brand-card border border-brand-border text-brand-text"
              >
                <User className="w-4 h-4 text-brand-steelLight" />
                Student Portal Demo
              </Link>
              <Link
                to="/journey"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold bg-brand-gold text-brand-lightText"
              >
                Explore The 5 Attempts
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-brand-bgSecondary border-t border-brand-border pt-16 pb-12">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-brand-border">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <Logo size="lg" />
              <p className="text-sm text-brand-textMuted leading-relaxed max-w-sm">
                A dedicated aspirant development platform founded on authentic introspection, physical transformation, and character-driven mentorship.
              </p>
              <div className="pt-2 flex flex-col gap-1 text-xs text-brand-textMuted">
                <span className="text-brand-gold font-medium">Associated with Lt. Vamshi E.</span>
                <span>AIR 34 • CDS 2 2019 | Recommended at 3 AFSB Gandhinagar</span>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h4 className="font-heading text-sm font-bold tracking-wider text-brand-text uppercase mb-4">
                Platform
              </h4>
              <ul className="space-y-2.5 text-sm text-brand-textMuted">
                <li><Link to="/about" className="hover:text-brand-gold transition-colors">About SSB BRO</Link></li>
                <li><Link to="/journey" className="hover:text-brand-gold transition-colors">The 5 Attempts</Link></li>
                <li><Link to="/programmes" className="hover:text-brand-gold transition-colors">Proposed Programmes</Link></li>
                <li><Link to="/resources" className="hover:text-brand-gold transition-colors">Resource Library</Link></li>
                <li><Link to="/stories" className="hover:text-brand-gold transition-colors">Success Stories</Link></li>
              </ul>
            </div>

            {/* Col 3: Portal & Testing */}
            <div>
              <h4 className="font-heading text-sm font-bold tracking-wider text-brand-text uppercase mb-4">
                Portals & Demos
              </h4>
              <ul className="space-y-2.5 text-sm text-brand-textMuted">
                <li><Link to="/student/login" className="hover:text-brand-gold transition-colors">Student Portal Demo</Link></li>
                <li><Link to="/student/practice" className="hover:text-brand-gold transition-colors">Practice Centre (TAT/WAT)</Link></li>
                <li><Link to="/admin/login" className="hover:text-brand-gold transition-colors">Admin Dashboard Demo</Link></li>
                <li><Link to="/faq" className="hover:text-brand-gold transition-colors">Frequently Asked Questions</Link></li>
                <li><Link to="/contact" className="hover:text-brand-gold transition-colors">Submit Aspirant Enquiry</Link></li>
              </ul>
            </div>

            {/* Col 4: Important Advisory */}
            <div>
              <h4 className="font-heading text-sm font-bold tracking-wider text-brand-text uppercase mb-4">
                Concept Advisory
              </h4>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                This is a concept website prepared by NextGen Web Studio to showcase the proposed digital platform architecture for SSB BRO. No official defence insignia are used.
              </p>
              <div className="mt-4 pt-3 border-t border-brand-border/60">
                <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-xs text-brand-steelLight hover:text-brand-gold transition-colors">
                  <Lock className="w-3 h-3" />
                  Admin Console Access
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-textMuted">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} SSB BRO. All rights reserved. Concept Architecture.</span>
            </div>

            <div className="flex items-center gap-6">
              <span>Designed & Architected by <strong className="text-brand-text font-medium">NextGen Web Studio</strong></span>
              <span className="hidden md:inline">•</span>
              <span className="text-brand-steelLight">Prepare with Purpose. Lead with Character.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
