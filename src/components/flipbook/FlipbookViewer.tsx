import {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useEffect,
} from 'react'
import HTMLFlipBook from 'react-pageflip'
import { Document, Page, pdfjs } from 'react-pdf'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
} from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { cn } from '@/lib/utils'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'react-pdf/dist/pdf.worker.entry.js',
  import.meta.url
).toString()

const PDFPageComponent = forwardRef<
  HTMLDivElement,
  { pageNumber: number; width: number }
>(({ pageNumber, width }, ref) => (
  <div
    ref={ref}
    className="relative overflow-hidden bg-white"
    style={{
      boxShadow:
        pageNumber % 2 === 0
          ? '-6px 0 28px rgba(0,0,0,0.35)'
          : '6px 0 28px rgba(0,0,0,0.35)',
    }}
  >
    <Page
      pageNumber={pageNumber}
      width={width}
      renderAnnotationLayer
      renderTextLayer={false}
      loading={
        <div
          className="flex items-center justify-center bg-[#f8f6f0]"
          style={{ width, height: Math.round((width * 297) / 210) }}
        >
          <Loader2 className="h-5 w-5 animate-spin" style={{ color: '#406e51' }} />
        </div>
      }
    />
  </div>
))
PDFPageComponent.displayName = 'PDFPage'

interface FlipbookViewerProps {
  pdfUrl: string
  title?: string
}

const MIN_ZOOM = 0.75
const MAX_ZOOM = 1.5
const ZOOM_STEP = 0.25
const DEFAULT_ZOOM = 1

export function FlipbookViewer({ pdfUrl, title = 'Festival Program' }: FlipbookViewerProps) {
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [basePageWidth, setBasePageWidth] = useState(400)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)
  const [maxAvailableHeight, setMaxAvailableHeight] = useState(600)

  const bookRef = useRef<{
    pageFlip: () => { flipNext: () => void; flipPrev: () => void }
  }>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Responsive sizing + portrait mode detection
  useEffect(() => {
    let prevPortrait: boolean | null = null
    const update = () => {
      if (!containerRef.current) return
      const w = containerRef.current.offsetWidth
      const h = containerRef.current.offsetHeight
      const portrait = w < 600
      if (prevPortrait !== null && prevPortrait !== portrait) {
        setCurrentPage(0)
      }
      prevPortrait = portrait
      setIsPortrait(portrait)

      // Reserve space for toolbar (52px) with padding
      const toolbarHeight = 52
      const availableHeight = h - toolbarHeight - 16
      setMaxAvailableHeight(availableHeight)

      if (portrait) {
        // Small screens: fit content with more aggressive constraints
        let width = Math.max(Math.min(w - 32, 340), 200)
        // Further constrain if height is limited
        const heightLimit = Math.round((width * 297) / 210)
        if (heightLimit > availableHeight) {
          width = Math.round((availableHeight * 210) / 297)
        }
        setBasePageWidth(width)
      } else {
        // Landscape: center spread
        let half = Math.min(Math.floor((w - 80) / 2), 400)
        const heightLimit = Math.round((half * 297) / 210)
        if (heightLimit > availableHeight) {
          half = Math.round((availableHeight * 210) / 297)
        }
        setBasePageWidth(Math.max(half, 240))
      }
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Fullscreen API
  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFSChange)
    return () => document.removeEventListener('fullscreenchange', onFSChange)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  const onDocumentLoadSuccess = useCallback(({ numPages: n }: { numPages: number }) => {
    setNumPages(n)
    setLoading(false)
    setLoadError(false)
  }, [])

  const onDocumentLoadError = useCallback(() => {
    setLoading(false)
    setLoadError(true)
  }, [])

  const goNext = useCallback(() => bookRef.current?.pageFlip().flipNext(), [])
  const goPrev = useCallback(() => bookRef.current?.pageFlip().flipPrev(), [])
  const onFlip = useCallback((e: { data: number }) => setCurrentPage(e.data), [])

  const updateZoomBy = useCallback((delta: number) => {
    setZoom((c) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, c + delta)))
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault()
        updateZoomBy(ZOOM_STEP)
      } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault()
        updateZoomBy(-ZOOM_STEP)
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, updateZoomBy, toggleFullscreen])

  const pageWidth = basePageWidth
  const pageHeight = Math.round((pageWidth * 297) / 210)
  const scaleTransform = zoom
  const displayZoom = Math.round(zoom * 100)
  const canGoPrev = currentPage === 0
  const canGoNext = numPages > 0 && currentPage >= numPages - (isPortrait ? 1 : 2)
  const pageStart = numPages > 0 ? currentPage + 1 : 0
  const pageEnd = isPortrait ? pageStart : Math.min(currentPage + 2, numPages)

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative flex h-full w-full flex-col',
        isFullscreen && 'bg-[#1a1815]'
      )}
    >
      {/* ── Book stage ─────────────────────────────────────────── */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1a1815 0%, #252219 50%, #1a1815 100%)',
          paddingTop: 28,
          paddingBottom: 28,
        }}
      >
        {/* Loading / error overlay */}
        {(loading || loadError) && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4">
            {loading && !loadError ? (
              <>
                <div className="relative flex h-14 w-14 items-center justify-center">
                  <BookOpen
                    className="h-7 w-7"
                    style={{ color: 'rgba(254,252,241,0.18)' }}
                  />
                  <Loader2
                    className="absolute inset-0 h-14 w-14 animate-spin"
                    style={{ color: '#c8e6ca' }}
                  />
                </div>
                <p className="font-body text-sm" style={{ color: 'rgba(254,252,241,0.5)' }}>
                  Loading {title}…
                </p>
              </>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-center backdrop-blur-md">
                <p className="font-body text-sm" style={{ color: 'rgba(254,252,241,0.7)' }}>
                  No PDF file found. Place it at{' '}
                  <code className="rounded bg-white/10 px-1 font-mono text-xs">
                    /NCAF_Program.pdf
                  </code>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Side nav arrows — always visible on mobile, fade-in on desktop hover */}
        <button
          onClick={goPrev}
          disabled={canGoPrev}
          aria-label="Previous page"
          className={cn(
            'absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full',
            'bg-white/10 text-white backdrop-blur-sm',
            'transition-all duration-200 hover:scale-105 hover:bg-white/20',
            'disabled:pointer-events-none disabled:opacity-20',
            'opacity-100 md:opacity-0 md:group-hover:opacity-100',
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={goNext}
          disabled={canGoNext}
          aria-label="Next page"
          className={cn(
            'absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full',
            'bg-white/10 text-white backdrop-blur-sm',
            'transition-all duration-200 hover:scale-105 hover:bg-white/20',
            'disabled:pointer-events-none disabled:opacity-20',
            'opacity-100 md:opacity-0 md:group-hover:opacity-100',
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Flipbook */}
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          error={null}
        >
          {numPages > 0 && (
            // @ts-expect-error react-pageflip lacks full TS definitions
            <HTMLFlipBook
              key={isPortrait ? 'portrait' : 'landscape'}
              ref={bookRef}
              width={pageWidth}
              height={pageHeight}
              size="fixed"
              minWidth={200}
              maxWidth={800}
              minHeight={280}
              maxHeight={1200}
              drawShadow
              flippingTime={700}
              usePortrait={isPortrait}
              startZIndex={20}
              autoSize={false}
              maxShadowOpacity={0.6}
              showCover
              mobileScrollSupport
              useMouseEvents
              showPageCorners={!isPortrait}
              className="shadow-[0_32px_80px_rgba(0,0,0,0.55)]"
              onFlip={onFlip}
              style={{}}
            >
              {Array.from({ length: numPages }, (_, i) => (
                <PDFPageComponent key={i + 1} pageNumber={i + 1} width={pageWidth} />
              ))}
            </HTMLFlipBook>
          )}
        </Document>
      </div>

      {/* ── Bottom toolbar ──────────────────────────────────────── */}
      <div className="flex h-[52px] items-center justify-between gap-2 border-t border-white/10 bg-[rgba(14,12,9,0.90)] px-3 backdrop-blur-md">

        {/* Left: prev / page counter / next */}
        <div className="flex items-center gap-1">
          <button
            onClick={goPrev}
            disabled={canGoPrev}
            aria-label="Previous page"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex min-w-[5rem] items-center justify-center gap-0.5 rounded-full bg-white/10 px-2.5 py-1 font-body text-xs text-white/75">
            {numPages > 0 ? (
              <>
                <span className="font-semibold text-white">{pageStart}</span>
                {!isPortrait && pageEnd !== pageStart && (
                  <>
                    <span className="mx-0.5 text-white/30">–</span>
                    <span className="font-semibold text-white">{pageEnd}</span>
                  </>
                )}
                <span className="mx-1 text-white/30">/</span>
                <span>{numPages}</span>
              </>
            ) : (
              <span className="text-white/30">— / —</span>
            )}
          </div>

          <button
            onClick={goNext}
            disabled={canGoNext}
            aria-label="Next page"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Center: title (hidden on xs) */}
        <p className="hidden min-w-0 flex-1 truncate px-2 text-center font-body text-xs text-white/35 sm:block">
          {title}
        </p>

        {/* Right: zoom + fullscreen + download */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => updateZoomBy(-ZOOM_STEP)}
            disabled={zoom <= MIN_ZOOM}
            aria-label="Zoom out"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>

          <span className="min-w-[2.75rem] rounded-full bg-white/10 px-2 py-1 text-center font-body text-xs text-white/75">
            {zoom}%
          </span>

          <button
            onClick={() => updateZoomBy(ZOOM_STEP)}
            disabled={zoom >= MAX_ZOOM}
            aria-label="Zoom in"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>

          <div className="mx-1 h-4 w-px bg-white/20" />

          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>

          <div className="mx-1 h-4 w-px bg-white/20" />

          <a
            href={pdfUrl}
            download
            aria-label="Download PDF"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
