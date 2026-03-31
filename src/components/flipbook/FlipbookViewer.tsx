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
  Loader2,
  Minus,
  Plus,
  ZoomIn,
} from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

// Configure PDF.js worker - use react-pdf's bundled worker for version compatibility
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'react-pdf/dist/pdf.worker.entry.js',
  import.meta.url
).toString()

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
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        }
      />
    </div>
  )
})
PDFPageComponent.displayName = 'PDFPage'

interface FlipbookViewerProps {
  pdfUrl: string
  title?: string
}

const MIN_ZOOM = 80
const MAX_ZOOM = 150
const DEFAULT_ZOOM = 100

export function FlipbookViewer({ pdfUrl, title = 'Festival Program' }: FlipbookViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [basePageWidth, setBasePageWidth] = useState(400)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const bookRef = useRef<{
    pageFlip: () => { flipNext: () => void; flipPrev: () => void }
  }>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerW = containerRef.current.offsetWidth
        const gutter = containerW < 768 ? 32 : 88
        const maxPageW = Math.min(Math.floor((containerW - gutter) / 2), 500)
        setBasePageWidth(Math.max(maxPageW, 240))
      }
    }

    updateSize()
    const ro = new ResizeObserver(updateSize)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

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

  const handleZoomChange = useCallback((nextZoom: number[]) => {
    const [value = DEFAULT_ZOOM] = nextZoom
    setZoom(value)
  }, [])

  const updateZoomBy = useCallback((delta: number) => {
    setZoom((current) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, current + delta)))
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault()
        updateZoomBy(10)
      } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault()
        updateZoomBy(-10)
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev, updateZoomBy])

  const pageWidth = Math.round(basePageWidth * (zoom / 100))
  const pageHeight = Math.round((pageWidth * 297) / 210)
  const canGoPrev = currentPage === 0
  const canGoNext = currentPage >= numPages - 2
  const currentSpreadStart = Math.min(currentPage + 1, Math.max(numPages, 1))
  const currentSpreadEnd = Math.min(currentPage + 2, Math.max(numPages, 1))

  return (
    <div ref={containerRef} className="w-full">
      <div className="mb-4 flex flex-col gap-4 rounded-[1.75rem] border border-outline-variant/70 bg-white/80 p-4 shadow-ambient backdrop-blur-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">{title}</Badge>
              <Badge variant="outline">
                {numPages > 0
                  ? `Pages ${currentSpreadStart}-${currentSpreadEnd} of ${numPages}`
                  : 'Preparing document'}
              </Badge>
            </div>

            <p className="font-body text-sm leading-6 text-on-surface-variant">
              Flip with the arrow controls or keyboard, then zoom in for a closer read.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="glass"
              onClick={() => updateZoomBy(-10)}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <div className="min-w-28 rounded-full bg-surface-container-low px-4 py-2 text-center font-body text-sm font-semibold text-on-surface">
              {zoom}%
            </div>

            <Button
              type="button"
              size="icon"
              variant="glass"
              onClick={() => updateZoomBy(10)}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <ZoomIn className="h-4 w-4 shrink-0 text-primary" />
            <Slider
              aria-label="Zoom level"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={10}
              value={[zoom]}
              onValueChange={handleZoomChange}
              className="flex-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <Button
              type="button"
              variant="glass"
              onClick={goPrev}
              disabled={canGoPrev}
              className="min-w-28"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={goNext}
              disabled={canGoNext}
              className="min-w-28"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto rounded-[1.75rem] border border-outline-variant/60 bg-[linear-gradient(180deg,rgba(255,253,245,0.96),rgba(246,243,231,0.98))]">
        <div
          className="relative mx-auto flex min-w-max items-center justify-center px-4 py-5 md:px-8"
          style={{ minWidth: pageWidth * 2 + 48, minHeight: pageHeight + 24 }}
        >
          {(loading || loadError) && (
            <div
              className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-[1.5rem]"
              style={{
                background: '#fffdf5',
                minWidth: pageWidth * 2 + 48,
                minHeight: pageHeight + 24,
              }}
            >
              {loading && !loadError ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#406e51' }} />
                  <p className="font-body text-sm" style={{ color: '#5c5b52' }}>
                    Loading {title}…
                  </p>
                </>
              ) : (
                <p className="px-6 text-center font-body text-sm" style={{ color: '#5c5b52' }}>
                  Unable to load the PDF file.
                </p>
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
                maxWidth={760}
                minHeight={280}
                maxHeight={1200}
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
                className={cn(
                  'overflow-hidden rounded-xl shadow-float transition-[box-shadow] duration-300'
                )}
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
      </div>
    </div>
  )
}
