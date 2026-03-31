import { useState, useEffect } from 'react'
import { BookOpen, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass shadow-ambient py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-ambient transition-transform duration-300 group-hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #406e51, #c8e6ca)' }}
          >
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-on-surface leading-none text-sm tracking-wide">
              NCAF 2026
            </p>
            <p className="font-body text-on-surface-variant text-xs leading-tight">
              Festival Program
            </p>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#about"
            className="font-body text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            About
          </a>
          <a
            href="#program"
            className="font-body text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            Program
          </a>
          <a
            href="#flipbook"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-body font-semibold text-sm text-white shadow-ambient hover:shadow-float hover:-translate-y-0.5 transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #406e51, #9c5000)' }}
          >
            <BookOpen className="w-4 h-4" />
            View Program
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-xl text-on-surface hover:bg-surface-container-low transition-colors duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-outline-variant/10 mt-2">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            <a
              href="#about"
              className="font-body text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#program"
              className="font-body text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Program
            </a>
            <a
              href="#flipbook"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-semibold text-sm text-white w-fit"
              style={{ background: 'linear-gradient(135deg, #406e51, #9c5000)' }}
              onClick={() => setMenuOpen(false)}
            >
              <BookOpen className="w-4 h-4" />
              View Program
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
