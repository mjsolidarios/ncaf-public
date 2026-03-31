import {
  memo,
  useState,
  useRef,
  useCallback,
  forwardRef,
  useEffect,
  useMemo,
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
  Expand,
} from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'react-pdf/dist/pdf.worker.entry.js',
  import.meta.url
).toString()

const PDFPageComponent = memo(forwardRef<
  HTMLDivElement,
  { pageNumber: number; width: number; zoom: number; isCover: boolean }
>(({ pageNumber, width, zoom, isCover }, ref) => {
  const renderDevicePixelRatio = Math.min(
    MAX_RENDER_DEVICE_PIXEL_RATIO,
    (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1) * zoom
  )

  return (
  <div
    ref={ref}
    className="relative overflow-hidden bg-white"
    style={{
      boxShadow: isCover
        ? 'none'
        :
        pageNumber % 2 === 0
          ? '-6px 0 28px rgba(0,0,0,0.35)'
          : '6px 0 28px rgba(0,0,0,0.35)',
    }}
  >
    <Page
      pageNumber={pageNumber}
      width={width}
      devicePixelRatio={renderDevicePixelRatio}
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
  )
}), (prevProps, nextProps) => (
  prevProps.pageNumber === nextProps.pageNumber &&
  prevProps.width === nextProps.width &&
  prevProps.zoom === nextProps.zoom &&
  prevProps.isCover === nextProps.isCover
))
PDFPageComponent.displayName = 'PDFPage'

interface FlipbookViewerProps {
  pdfUrl: string
  title?: string
}

const MIN_ZOOM = 0.6
const MAX_ZOOM = 3
const ZOOM_STEP = 0.1
const DEFAULT_ZOOM = 1
const MAX_RENDER_DEVICE_PIXEL_RATIO = 5

export function FlipbookViewer({ pdfUrl, title = 'Festival Program' }: FlipbookViewerProps) {
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [basePageWidth, setBasePageWidth] = useState(400)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)

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

      // Reserve space for toolbar and the stage's vertical padding
      const toolbarHeight = 52
      const stagePaddingY = portrait ? 20 : 28
      const availableHeight = h - toolbarHeight - stagePaddingY * 2 - 24

      if (portrait) {
        // Small screens: force full-page visibility in the stage.
        const maxByWidth = Math.floor(w - 28)
        const maxByHeight = Math.floor((availableHeight * 210) / 297)
        const width = Math.max(Math.min(maxByWidth, maxByHeight, 320), 170)
        setBasePageWidth(width)
      } else {
        // Landscape: center spread
        const maxHalfByWidth = Math.floor((w - 96) / 2)
        const maxHalfByHeight = Math.floor((availableHeight * 210) / 297)
        const half = Math.min(maxHalfByWidth, maxHalfByHeight, 400)
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

  const updateZoomTo = useCallback((next: number) => {
    setZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next)))
  }, [])

  const onStageWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    // Always zoom on scroll, no modifier required
    updateZoomBy(-e.deltaY * 0.0015)
  }, [updateZoomBy])

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
  const renderedPages = useMemo(
    () => Array.from({ length: numPages }, (_, i) => (
      <PDFPageComponent
        key={i + 1}
        pageNumber={i + 1}
        width={pageWidth}
        zoom={zoom}
        isCover={i === 0 || i === numPages - 1}
      />
    )),
    [numPages, pageWidth, zoom]
  )
  const displayZoom = Math.round(zoom * 100)
  const canGoPrev = currentPage === 0
  const canGoNext = numPages > 0 && currentPage >= numPages - (isPortrait ? 1 : 2)
  const pageStart = numPages > 0 ? currentPage + 1 : 0
  const pageEnd = isPortrait ? pageStart : Math.min(currentPage + 2, numPages)
  const isFrontCoverView = !isPortrait && currentPage === 0
  const isBackCoverView = !isPortrait && numPages > 0 && currentPage >= numPages - 1
  const isSingleCoverView = isFrontCoverView || isBackCoverView
  const spreadOffsetX = isFrontCoverView
    ? -(pageWidth * zoom) / 2
    : isBackCoverView
      ? (pageWidth * zoom) / 2
      : 0

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
        onWheel={onStageWheel}
        style={{
          background: 'linear-gradient(180deg, #1a1815 0%, #252219 50%, #1a1815 100%)',
          paddingTop: isPortrait ? 20 : 28,
          paddingBottom: isPortrait ? 20 : 28,
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: [
              'repeating-linear-gradient(0deg, rgba(230, 197, 118, 0.2) 0 14px, rgba(179, 122, 46, 0.14) 14px 28px)',
              'repeating-linear-gradient(90deg, rgba(244, 218, 152, 0.16) 0 14px, rgba(92, 140, 104, 0.12) 14px 28px)',
              'repeating-linear-gradient(0deg, transparent 0 27px, rgba(255, 246, 214, 0.16) 27px 29px)',
              'repeating-linear-gradient(90deg, transparent 0 27px, rgba(66, 48, 21, 0.12) 27px 29px)',
              'linear-gradient(135deg, rgba(245, 231, 188, 0.08), rgba(122, 82, 32, 0.06))',
            ].join(', '),
            backgroundSize: '84px 84px, 84px 84px, 84px 84px, 84px 84px, 100% 100%',
            backgroundPosition: '0 0, 0 0, 0 0, 0 0, 0 0',
          }}
        />

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
        <div
          className="relative z-10"
          style={{
            transform: `translateX(${spreadOffsetX}px) scale(${zoom})`,
            transformOrigin: 'center',
            transition: 'transform 0.2s ease-out',
            willChange: 'transform',
          }}
        >
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
                drawShadow={!isSingleCoverView}
                flippingTime={700}
                usePortrait={isPortrait}
                startZIndex={20}
                autoSize={false}
                maxShadowOpacity={0.6}
                showCover
                mobileScrollSupport
                useMouseEvents
                showPageCorners={!isPortrait}
                className={cn(
                  !isSingleCoverView && 'shadow-[0_32px_80px_rgba(0,0,0,0.55)]'
                )}
                onFlip={onFlip}
                style={{}}
              >
                {renderedPages}
              </HTMLFlipBook>
            )}
          </Document>
        </div>
      </div>

      {/* ── Bottom toolbar ──────────────────────────────────────── */}
      <div className="flex h-13 items-center justify-between gap-2 border-t border-white/10 bg-[rgba(14,12,9,0.90)] px-3 backdrop-blur-md">

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

          <div className="flex min-w-20 items-center justify-center gap-0.5 rounded-full bg-white/10 px-2.5 py-1 font-body text-xs text-white/75">
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

          <div className="w-16 px-1 sm:w-24">
            <Slider
              aria-label="Zoom level"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              value={[zoom]}
              onValueChange={(v) => updateZoomTo(v[0] ?? DEFAULT_ZOOM)}
              className=""
            />
          </div>

          <span className="min-w-11 rounded-full bg-white/10 px-2 py-1 text-center font-body text-xs text-white/75">
            {displayZoom}%
          </span>

          <button
            onClick={() => updateZoomBy(ZOOM_STEP)}
            disabled={zoom >= MAX_ZOOM}
            aria-label="Zoom in"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => updateZoomTo(DEFAULT_ZOOM)}
            aria-label="Fit to screen"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Expand className="h-3.5 w-3.5" />
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
