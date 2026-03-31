import { FlipbookViewer } from './flipbook/FlipbookViewer'
import { Download } from 'lucide-react'

// Update this path to point to your actual PDF
const PROGRAM_PDF_URL = '/program.pdf'

export function ProgramSection() {
  return (
    <section
      id="program"
      className="relative py-24 overflow-hidden"
      style={{ background: '#f6f3e7' }}
    >
      {/* Top organic curve */}
      <div
        className="absolute top-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: '#fefcf1',
          clipPath: 'ellipse(70% 100% at 50% 0%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-block px-4 py-1.5 rounded-full font-body text-sm font-semibold mb-4"
            style={{ background: '#ffdcc2', color: '#7a3d00' }}
          >
            Official Program
          </span>
          <h2
            className="font-display font-bold mb-4"
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 3rem)',
              color: '#383831',
              letterSpacing: '0.03em',
              lineHeight: 1.2,
            }}
          >
            Festival Program
          </h2>
          <p
            className="font-body text-base leading-relaxed max-w-xl mx-auto mb-8"
            style={{ color: '#5c5b52' }}
          >
            Browse through the complete festival program. Flip through the pages
            just like a real book — or download a copy for offline reading.
          </p>

          <a
            href={PROGRAM_PDF_URL}
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-body font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float"
            style={{
              background: 'linear-gradient(135deg, #9c5000, #c06a14)',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(156,80,0,0.25)',
            }}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>

        {/* Flipbook container */}
        <div
          id="flipbook"
          className="relative rounded-3xl p-6 md:p-10"
          style={{
            background: 'rgba(254,252,241,0.8)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 80px rgba(56,56,49,0.08)',
          }}
        >
          {/* Decorative elements */}
          <div
            className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-30 blur-2xl pointer-events-none"
            style={{ background: '#834aae' }}
          />
          <div
            className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full opacity-20 blur-2xl pointer-events-none"
            style={{ background: '#9c5000' }}
          />

          <FlipbookViewer pdfUrl={PROGRAM_PDF_URL} title="NCAF 2026 Festival Program" />
        </div>

        {/* Instructions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: '👆', label: 'Click page corner to flip' },
            { icon: '⌨️', label: 'Use arrow keys' },
            { icon: '📱', label: 'Swipe on mobile' },
          ].map((hint, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xl">{hint.icon}</span>
              <span className="font-body text-sm" style={{ color: '#5c5b52' }}>{hint.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom organic curve */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: '#fefcf1',
          clipPath: 'ellipse(70% 100% at 50% 100%)',
        }}
      />
    </section>
  )
}
