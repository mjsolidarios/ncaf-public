import { BookOpen, ChevronDown } from 'lucide-react'

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #406e51 0%, #2d4e39 40%, #1e3328 100%)' }}
    >
      {/* Decorative orbs */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float-gentle"
        style={{ background: '#9c5000' }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-15 blur-3xl animate-float-gentle"
        style={{ background: '#834aae', animationDelay: '2s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
        style={{ background: '#fefcf1' }}
      />

      {/* Organic swoosh overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='800' height='600' viewBox='0 0 800 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 300 Q200 100 400 300 T800 300' fill='none' stroke='%23fefcf1' stroke-width='2'/%3E%3Cpath d='M0 400 Q200 200 400 400 T800 400' fill='none' stroke='%23fefcf1' stroke-width='1'/%3E%3Cpath d='M0 500 Q200 300 400 500 T800 500' fill='none' stroke='%23fefcf1' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '800px 600px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="animate-float-up inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-body font-medium"
          style={{ background: 'rgba(254,252,241,0.12)', color: '#fefcf1', border: '1px solid rgba(254,252,241,0.2)' }}>
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          National Culture and Arts Festival
        </div>

        {/* Title */}
        <h1
          className="animate-float-up-delay-1 font-display font-bold leading-tight mb-6"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            color: '#fefcf1',
            letterSpacing: '0.03em',
            textShadow: '0 2px 20px rgba(0,0,0,0.2)',
          }}
        >
          Pagsaulog
          <br />
          <span style={{ color: '#ffdcc2' }}>2026</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-float-up-delay-2 font-body text-xl leading-relaxed mb-4 max-w-2xl mx-auto"
          style={{ color: 'rgba(254,252,241,0.85)' }}
        >
          Celebrating the Riches of Our Roots
        </p>

        <p
          className="animate-float-up-delay-2 font-body text-base leading-relaxed mb-12 max-w-xl mx-auto"
          style={{ color: 'rgba(254,252,241,0.65)' }}
        >
          Explore the official festival program — an interactive magazine
          bringing our cultural heritage to life.
        </p>

        {/* CTA Buttons */}
        <div className="animate-float-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#flipbook"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-body font-semibold text-base text-white shadow-float hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(56,56,49,0.2)] transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #9c5000, #c06a14)' }}
          >
            <BookOpen className="w-5 h-5" />
            Open Program
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-body font-semibold text-base transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'rgba(254,252,241,0.1)',
              color: '#fefcf1',
              border: '1.5px solid rgba(254,252,241,0.3)',
              backdropFilter: 'blur(12px)',
            }}
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float-gentle">
        <p className="font-body text-xs" style={{ color: 'rgba(254,252,241,0.5)' }}>
          Scroll to explore
        </p>
        <ChevronDown className="w-5 h-5" style={{ color: 'rgba(254,252,241,0.5)' }} />
      </div>

      {/* Bottom organic curve */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: '#fefcf1',
          clipPath: 'ellipse(55% 100% at 50% 100%)',
        }}
      />
    </section>
  )
}
