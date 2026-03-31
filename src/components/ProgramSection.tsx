import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Sparkles } from 'lucide-react'
import { FlipbookViewer } from './flipbook/FlipbookViewer'

const PROGRAM_PDF_URL = '/NCAF_Program.pdf'

export function ProgramSection() {
  return (
    <section
      id="program"
      className="min-h-screen py-8 md:py-12"
      style={{ background: '#f6f3e7' }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4">
        <div
          className="overflow-hidden rounded-[2rem] border border-outline-variant/60 p-6 md:p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(255,253,245,0.98), rgba(246,243,231,0.92))',
            boxShadow: '0 24px 60px rgba(56,56,49,0.08)',
          }}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Badge className="mb-4 gap-2" variant="outline">
                <Sparkles className="h-3.5 w-3.5" />
                Interactive Festival Program
              </Badge>

              <h2
                className="font-display text-3xl font-bold tracking-[0.03em] md:text-4xl"
                style={{ color: '#383831' }}
              >
                Browse the NCAF 2026 program like a keepsake booklet.
              </h2>

              <p
                className="mt-3 max-w-xl font-body text-sm leading-7 md:text-base"
                style={{ color: '#5c5b52' }}
              >
                Flip through each spread, use the updated controls, and zoom in when you
                want a closer look at schedules, features, and festival details.
              </p>
            </div>

            <Button
              asChild
              className="w-full sm:w-auto"
              size="md"
              variant="primary"
            >
              <a
                href={PROGRAM_PDF_URL}
                download
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </Button>
          </div>
        </div>

        <div
          id="flipbook"
          className="rounded-[2rem] border border-outline-variant/60 p-3 md:p-4"
          style={{
            background: '#fefcf1',
            boxShadow: '0 18px 50px rgba(56,56,49,0.08)',
          }}
        >
          <FlipbookViewer pdfUrl={PROGRAM_PDF_URL} title="NCAF 2026 Festival Program" />
        </div>
      </div>
    </section>
  )
}
