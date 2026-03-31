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
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  BookOpen,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import 'react-pdf/dist/Page/AnnotationLayer.css'

// Configure PDF.js worker - use react-pdf's bundled worker for version compatibility
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'react-pdf/dist/pdf.worker.entry.js',
  import.meta.url
).toString()

// ─── Single PDF Page Component ────────────────────────────────────────────────
const PDFPageComponent = forwardRef<
  HTMLDivElement,
  { pageNumber: number; width: number; onRenderSuccess?: () => void }
>(({ pageNumber, width, onRenderSuccess }, ref) => {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden bg-white"
      style={{
        boxShadow: pageNumber % 2 === 0
          ? '-4px 0 16px rgba(56,56,49,0.08)'
          : '4px 0 16px rgba(56,56,49,0.08)',
      }}
    >
      <Page
        pageNumber={pageNumber}
        width={width}
        renderAnnotationLayer
        renderTextLayer={false}
        onRenderSuccess={onRenderSuccess}
        loading={
          <div
            className="flex items-center justify-center"
            style={{ width, height: (width * 297) / 210 }}
          >
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        }
      />
    </div>
  )
})
PDFPageComponent.displayName = 'PDFPage'

// ─── Main Flipbook Component ──────────────────────────────────────────────────
interface FlipbookViewerProps {
  pdfUrl: string
  title?: string
}

export function FlipbookViewer({ pdfUrl, title = 'Festival Program' }: FlipbookViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [scale, setScale] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [pageWidth, setPageWidth] = useState(400)
  const bookRef = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void; getCurrentPageIndex: () => number } }>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate page width based on container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerW = containerRef.current.offsetWidth
        // Two pages side by side, with some padding
        const maxPageW = Math.min(Math.floor((containerW - 80) / 2), 500)
        setPageWidth(Math.max(maxPageW, 240))
      }
    }
    updateSize()
    const ro = new ResizeObserver(updateSize)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [isFullscreen])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
    setLoadError(false)
  }, [])

  const onDocumentLoadError = useCallback(() => {
    setLoading(false)
    setLoadError(true)
  }, [])

  const goNext = useCallback(() => {
    bookRef.current?.pageFlip().flipNext()
  }, [])

  const goPrev = useCallback(() => {
    bookRef.current?.pageFlip().flipPrev()
  }, [])

  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data)
  }, [])

  const zoomIn = () => setScale(s => Math.min(s + 0.25, 2))
  const zoomOut = () => setScale(s => Math.max(s - 0.25, 0.5))

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.().catch(() => {})
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev])

  const pageHeight = Math.round((pageWidth * 297) / 210) // A4 ratio

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-col items-center w-full transition-all duration-500',
        isFullscreen
          ? 'fixed inset-0 z-50 overflow-auto'
          : 'relative'
      )}
      style={{ background: isFullscreen ? '#1e3328' : undefined }}
    >
      {/* Toolbar */}
      <div
        className={cn(
          'flex items-center justify-between w-full max-w-4xl px-4 py-3 mb-6 rounded-2xl transition-all duration-300',
          isFullscreen ? 'mt-4' : ''
        )}
        style={{
          background: 'rgba(254,252,241,0.7)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(56,56,49,0.06)',
        }}
      >
        {/* Page info */}
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="font-body text-sm font-medium text-on-surface-variant">
            {numPages > 0
              ? `Page ${currentPage + 1}–${Math.min(currentPage + 2, numPages)} of ${numPages}`
              : title}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all duration-200 disabled:opacity-40"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-body text-xs text-on-surface-variant w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={scale >= 2}
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all duration-200 disabled:opacity-40"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-outline-variant mx-1" />
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all duration-200"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen
              ? <Minimize2 className="w-4 h-4" />
              : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Book area */}
      <div
        className="relative flex items-center justify-center w-full"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.3s ease' }}
      >
        {/* Prev button */}
        <button
          onClick={goPrev}
          disabled={currentPage === 0}
          className="absolute left-2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-float hover:-translate-x-0.5 transition-all duration-200 disabled:opacity-30 disabled:hover:translate-x-0"
          style={{ background: 'linear-gradient(135deg, #406e51, #2d4e39)' }}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* The flipbook */}
        <div className="relative" style={{ minWidth: pageWidth * 2, minHeight: pageHeight }}>
          {(loading || loadError) && (
            <div
              className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 rounded-2xl"
              style={{ background: '#fffdf5', minWidth: pageWidth * 2, minHeight: pageHeight }}
            >
              {loading && !loadError ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#406e51' }} />
                  <p className="font-body text-sm" style={{ color: '#5c5b52' }}>
                    Loading program…
                  </p>
                </>
              ) : (
                <>
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: '#c8e6ca' }}
                  >
                    <BookOpen className="w-8 h-8" style={{ color: '#406e51' }} />
                  </div>
                  <div className="text-center px-6">
                    <p className="font-display font-semibold text-lg mb-2" style={{ color: '#383831' }}>
                      Program Coming Soon
                    </p>
                    <p className="font-body text-sm" style={{ color: '#5c5b52' }}>
                      Place your festival program PDF at{' '}
                      <code
                        className="px-1.5 py-0.5 rounded text-xs font-mono"
                        style={{ background: '#ede9dd', color: '#406e51' }}
                      >
                        public/program.pdf
                      </code>{' '}
                      to enable the interactive viewer.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

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
                ref={bookRef}
                width={pageWidth}
                height={pageHeight}
                size="fixed"
                minWidth={200}
                maxWidth={600}
                minHeight={280}
                maxHeight={850}
                drawShadow
                flippingTime={800}
                usePortrait={false}
                startZIndex={20}
                autoSize={false}
                maxShadowOpacity={0.4}
                showCover
                mobileScrollSupport
                useMouseEvents
                showPageCorners
                className="shadow-float rounded-lg overflow-hidden"
                onFlip={onFlip}
                style={{}}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <PDFPageComponent
                    key={i + 1}
                    pageNumber={i + 1}
                    width={pageWidth}
                  />
                ))}
              </HTMLFlipBook>
            )}
          </Document>
        </div>

        {/* Next button */}
        <button
          onClick={goNext}
          disabled={currentPage >= numPages - 2}
          className="absolute right-2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-float hover:translate-x-0.5 transition-all duration-200 disabled:opacity-30 disabled:hover:translate-x-0"
          style={{ background: 'linear-gradient(135deg, #406e51, #2d4e39)' }}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Page dots */}
      {numPages > 0 && (
        <div className="flex items-center gap-1.5 mt-6 flex-wrap justify-center max-w-lg">
          {Array.from({ length: Math.ceil(numPages / 2) }, (_, i) => (
            <button
              key={i}
              onClick={() => bookRef.current?.pageFlip().flipNext()}
              className={cn(
                'rounded-full transition-all duration-300',
                i === Math.floor(currentPage / 2)
                  ? 'w-6 h-2 bg-primary'
                  : 'w-2 h-2 bg-surface-container-high hover:bg-primary/50'
              )}
              aria-label={`Go to spread ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Keyboard hint */}
      <p className="mt-4 font-body text-xs text-on-surface-variant/50">
        Use arrow keys or click/swipe to flip pages
      </p>
    </div>
  )
}
