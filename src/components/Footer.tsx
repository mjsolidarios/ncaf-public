import { BookOpen, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer
      className="relative py-12 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #2d4e39 0%, #1e3328 100%)' }}
    >
      {/* Top organic curve */}
      <div
        className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: '#fefcf1',
          clipPath: 'ellipse(65% 100% at 50% 0%)',
        }}
      />

      {/* Decorative orbs */}
      <div
        className="absolute top-1/2 -left-20 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: '#9c5000' }}
      />
      <div
        className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: '#834aae' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-ambient"
              style={{ background: 'linear-gradient(135deg, #406e51, #c8e6ca)' }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-sm tracking-wide" style={{ color: '#fefcf1' }}>
                NCAF 2026
              </p>
              <p className="font-body text-xs" style={{ color: 'rgba(254,252,241,0.6)' }}>
                National Culture and Arts Festival
              </p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {['About', 'Program', 'Contact'].map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="font-body text-sm transition-colors duration-200"
                style={{ color: 'rgba(254,252,241,0.7)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fefcf1')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(254,252,241,0.7)')}
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Credits */}
          <p
            className="font-body text-xs flex items-center gap-1.5"
            style={{ color: 'rgba(254,252,241,0.5)' }}
          >
            Made with{' '}
            <Heart className="w-3 h-3" style={{ color: '#9c5000' }} />
            {' '}for Philippine Culture
          </p>
        </div>

        <div
          className="mt-8 pt-6 text-center font-body text-xs"
          style={{
            color: 'rgba(254,252,241,0.4)',
            borderTop: '1px solid rgba(254,252,241,0.08)',
          }}
        >
          © 2026 National Culture and Arts Festival. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
