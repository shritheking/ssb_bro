import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Compass, ArrowLeft } from 'lucide-react'
import { Logo } from '../components/common/Logo'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 text-center">
      {/* Logo */}
      <div className="mb-10">
        <Logo variant="compact" size="lg" />
      </div>

      {/* 404 Display */}
      <div className="relative mb-8">
        <p className="text-[8rem] sm:text-[12rem] font-heading font-black text-brand-gold/10 leading-none select-none">
          404
        </p>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Compass className="w-10 h-10 text-brand-gold mb-3" />
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">
            Page Not Found
          </h1>
        </div>
      </div>

      {/* Message */}
      <p className="text-brand-muted max-w-md mb-2">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <p className="text-brand-muted/60 text-sm max-w-sm mb-10 italic font-serif">
        "Every wrong turn in a navigation task is just one more data point.
        Re-orient and move forward."
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-brand-gold text-brand-dark px-6 py-3 rounded font-semibold text-sm hover:bg-brand-gold/90 transition-colors"
        >
          <Home className="w-4 h-4" /> Back to Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 border border-white/20 text-brand-muted px-6 py-3 rounded text-sm hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>

      {/* Footer note */}
      <p className="mt-16 text-brand-muted/40 text-xs">
        SSB BRO · Aspirant Development Platform
      </p>
    </div>
  )
}
