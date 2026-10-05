import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Play,
  Film
} from 'lucide-react';

interface ImageZoomViewerProps {
  images: string[];
  videoUrl?: string;
  selectedColorName?: string;
  altText: string;
}

export const ImageZoomViewer: React.FC<ImageZoomViewerProps> = ({
  images,
  videoUrl,
  selectedColorName,
  altText
}) => {
  // Combine all media: images first, then video if present
  const mediaItems: { type: 'image' | 'video'; url: string }[] = [
    ...images.map(img => ({ type: 'image' as const, url: img })),
    ...(videoUrl ? [{ type: 'video' as const, url: videoUrl }] : [])
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Touch gesture state refs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchScaleRef = useRef<number>(1);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom on slide change
  useEffect(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, [currentIndex]);

  const currentMedia = mediaItems[currentIndex] || mediaItems[0];

  // Navigate next / prev
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  // Double tap handler: toggle zoom
  const handleDoubleTap = (clientX: number, clientY: number) => {
    if (scale > 1.2) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    } else {
      setScale(2.5);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const offsetX = (clientX - rect.left - rect.width / 2) * -0.8;
        const offsetY = (clientY - rect.top - rect.height / 2) * -0.8;
        setTranslate({ x: offsetX, y: offsetY });
      }
    }
  };

  // Calculate distance between two touch points for pinch zoom
  const getPinchDistance = (e: React.TouchEvent): number => {
    if (e.touches.length < 2) return 0;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Touch Start
  const handleTouchStart = (e: React.TouchEvent) => {
    const now = Date.now();
    const touch = e.touches[0];

    // Two finger pinch start
    if (e.touches.length === 2) {
      initialPinchDistRef.current = getPinchDistance(e);
      initialPinchScaleRef.current = scale;
      return;
    }

    // Single touch
    if (e.touches.length === 1) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: now };
      
      // Double tap detection (< 300ms)
      if (now - lastTapRef.current < 300) {
        handleDoubleTap(touch.clientX, touch.clientY);
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }

      // Start drag if zoomed in
      if (scale > 1) {
        isDraggingRef.current = true;
        dragStartRef.current = {
          x: touch.clientX - translate.x,
          y: touch.clientY - translate.y
        };
      }
    }
  };

  // Touch Move
  const handleTouchMove = (e: React.TouchEvent) => {
    // Two fingers: Pinch to zoom
    if (e.touches.length === 2 && initialPinchDistRef.current) {
      e.preventDefault();
      const currentDist = getPinchDistance(e);
      const ratio = currentDist / initialPinchDistRef.current;
      const newScale = Math.min(Math.max(initialPinchScaleRef.current * ratio, 1), 4);
      setScale(newScale);
      if (newScale === 1) {
        setTranslate({ x: 0, y: 0 });
      }
      return;
    }

    // Single finger drag when zoomed
    if (e.touches.length === 1 && scale > 1 && isDraggingRef.current) {
      e.preventDefault();
      const touch = e.touches[0];
      const maxTranslateX = (scale - 1) * 160;
      const maxTranslateY = (scale - 1) * 160;
      const newX = Math.min(Math.max(touch.clientX - dragStartRef.current.x, -maxTranslateX), maxTranslateX);
      const newY = Math.min(Math.max(touch.clientY - dragStartRef.current.y, -maxTranslateY), maxTranslateY);
      setTranslate({ x: newX, y: newY });
    }
  };

  // Touch End: handle swipe left/right when not zoomed
  const handleTouchEnd = (e: React.TouchEvent) => {
    initialPinchDistRef.current = null;
    isDraggingRef.current = false;

    if (scale <= 1.1 && touchStartRef.current && e.changedTouches.length > 0) {
      const touchEnd = e.changedTouches[0];
      const deltaX = touchEnd.clientX - touchStartRef.current.x;
      const deltaY = touchEnd.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3 && deltaTime < 450) {
        if (deltaX > 0) {
          handlePrev();
        } else {
          handleNext();
        }
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div className={`relative select-none flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-black/95 p-4 sm:p-8 flex items-center justify-center' : ''}`}>
      
      {/* Main Viewport Container */}
      <div 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 touch-none flex items-center justify-center cursor-zoom-in ${
          isFullscreen ? 'w-full h-full max-h-[85vh]' : 'aspect-square sm:aspect-4/3 w-full'
        }`}
      >
        {/* Active Media Renderer */}
        {currentMedia.type === 'video' ? (
          <div 
            style={{
              transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
              transition: isDraggingRef.current ? 'none' : 'transform 0.2s ease-out'
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <video 
              src={currentMedia.url} 
              controls 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-contain pointer-events-auto rounded-xl"
            />
          </div>
        ) : (
          <img
            src={currentMedia.url}
            alt={altText}
            style={{
              transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
              transition: isDraggingRef.current ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="w-full h-full object-contain pointer-events-none select-none transition-opacity"
            draggable={false}
          />
        )}

        {/* Gesture Guide Tooltip for Visitor */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full pointer-events-none flex items-center gap-1.5 shadow-sm">
          <span>انقر مرتين للتكبير أو استخدم إصبعين</span>
        </div>

        {/* Selected Color Badge overlay if set */}
        {selectedColorName && (
          <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            اللون: {selectedColorName}
          </div>
        )}

        {/* Navigation Arrows */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 text-gray-800 dark:text-gray-200 flex items-center justify-center shadow-lg transition-all z-10"
              aria-label="السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 text-gray-800 dark:text-gray-200 flex items-center justify-center shadow-lg transition-all z-10"
              aria-label="التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Controls Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-xl text-white z-10">
          <button
            onClick={() => setScale(prev => Math.min(prev + 0.5, 4))}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="تكبير"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setScale(prev => {
                const s = Math.max(prev - 0.5, 1);
                if (s === 1) setTranslate({ x: 0, y: 0 });
                return s;
              });
            }}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="تصغير"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          {scale > 1 && (
            <button
              onClick={() => {
                setScale(1);
                setTranslate({ x: 0, y: 0 });
              }}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-amber-400"
              title="إعادة ضبط"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title={isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Media counter indicator */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-0.5 rounded-lg z-10 font-mono">
          {currentIndex + 1} / {mediaItems.length}
        </div>
      </div>

      {/* Thumbnails Strip */}
      {mediaItems.length > 1 && (
        <div className="flex items-center gap-2 mt-3 overflow-x-auto py-1 px-0.5 no-scrollbar">
          {mediaItems.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  isActive
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100 bg-gray-200 dark:bg-gray-800'
                }`}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">
                    <Film className="w-5 h-5 text-amber-400" />
                    <Play className="w-3 h-3 absolute top-1 right-1 fill-amber-400 text-amber-400" />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
