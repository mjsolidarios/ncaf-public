import { Palette, Music, Users, Award } from 'lucide-react'

const pillars = [
  {
    icon: Music,
    color: '#406e51',
    bg: '#c8e6ca',
    title: 'Performing Arts',
    desc: 'Witness the vibrant tapestry of Philippine music, dance, and theater traditions across multiple stages.',
  },
  {
    icon: Palette,
    color: '#9c5000',
    bg: '#ffdcc2',
    title: 'Visual Heritage',
    desc: 'Immerse in exhibitions celebrating the mastery of indigenous crafts, contemporary art, and cultural artifacts.',
  },
  {
    icon: Users,
    color: '#834aae',
    bg: '#f3daff',
    title: 'Community & Dialogue',
    desc: 'Engage with masters, scholars, and local communities in forums that bridge the past and the present.',
  },
  {
    icon: Award,
    color: '#406e51',
    bg: '#c8e6ca',
    title: 'Cultural Excellence',
    desc: 'Recognizing outstanding contributions to the preservation and promotion of Philippine cultural heritage.',
  },
]

export function About() {
  return (
    <section id="about" className="relative py-24 overflow-hidden" style={{ background: '#fefcf1' }}>
      {/* Top organic curve transition */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(160deg, #1e3328 0%, #2d4e39 100%)',
          clipPath: 'ellipse(60% 100% at 50% 0%)',
          opacity: 0.08,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span
            className="inline-block px-4 py-1.5 rounded-full font-body text-sm font-semibold mb-4"
            style={{ background: '#c8e6ca', color: '#2d4e39' }}
          >
            About the Festival
          </span>
          <h2
            className="font-display font-bold mb-6"
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 3rem)',
              color: '#383831',
              letterSpacing: '0.03em',
              lineHeight: 1.2,
            }}
          >
            A Celebration of Living Heritage
          </h2>
          <p
            className="font-body text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: '#5c5b52' }}
          >
            The National Culture and Arts Festival (NCAF) is the Philippines' premier gathering
            of cultural expression — a stage where every region's unique story is told through
            art, music, dance, and tradition.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <div
                key={i}
                className="group relative rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 cursor-default"
                style={{
                  background: '#fffdf5',
                  boxShadow: '0 8px 32px rgba(56,56,49,0.04)',
                }}
              >
                {/* Decorative corner */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-tr-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at 100% 0%, ${pillar.bg}, transparent)`,
                  }}
                />

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: pillar.bg }}
                >
                  <Icon className="w-6 h-6" style={{ color: pillar.color }} />
                </div>

                <h3
                  className="font-display font-semibold text-lg mb-2 leading-tight"
                  style={{ color: '#383831', letterSpacing: '0.02em' }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: '#5c5b52' }}
                >
                  {pillar.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Quote / highlight */}
        <div
          className="mt-16 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #406e51 0%, #2d4e39 50%, #834aae 100%)' }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, #9c5000 0%, transparent 50%),
                                radial-gradient(circle at 80% 50%, #fefcf1 0%, transparent 50%)`,
            }}
          />
          <blockquote className="relative z-10">
            <p
              className="font-display italic text-xl md:text-2xl leading-relaxed mb-4"
              style={{ color: '#fefcf1', letterSpacing: '0.03em' }}
            >
              "Culture is the lifeblood of a civilization. To celebrate it is to ensure
              its eternal flow through the generations to come."
            </p>
            <cite
              className="font-body text-sm font-medium not-italic"
              style={{ color: 'rgba(254,252,241,0.7)' }}
            >
              — NCAF 2026 Organizing Committee
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
