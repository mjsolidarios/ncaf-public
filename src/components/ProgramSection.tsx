import { FlipbookViewer } from './flipbook/FlipbookViewer'

const PROGRAM_PDF_URL = '/NCAF_Program.pdf'

export function ProgramSection() {
  return (
    <section
      id="program"
      className="h-screen w-full overflow-hidden"
      style={{ background: '#f6f3e7' }}
    >
      <div className="h-full w-full">
        <FlipbookViewer pdfUrl={PROGRAM_PDF_URL} title="NCAF 2026 Festival Program" />
      </div>
    </section>
  )
}
