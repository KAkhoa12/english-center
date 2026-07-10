import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Play,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════ */

type MediaType = "image" | "video";

interface MediaViewProps {
  /** Loại media */
  type: MediaType;
  /** Danh sách URL */
  links: string[];
  /** Chiều cao khung chính (px) */
  height?: number;
  /** Chiều cao thumbnail (px) */
  thumbnailHeight?: number;
  /** Số thumbnail hiển thị cùng lúc */
  visibleThumbs?: number;
  className?: string;
}

/* ═══════════════════════════════════════════════════
   Image Modal
   ═══════════════════════════════════════════════════ */

function ImageModal({
  src,
  alt,
  isOpen,
  onClose,
  onPrev,
  onNext,
  canNavigate,
  currentIndex,
  total,
}: {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  canNavigate: boolean;
  currentIndex: number;
  total: number;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh chi tiết"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content wrapper */}
      <div className="relative z-10 flex items-center justify-center w-full h-full p-6 md:p-12">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Đóng"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Prev */}
        {canNavigate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-white/20 hover:scale-105"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        )}

        {/* Image */}
        <img
          src={src}
          alt={alt}
          className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain select-none"
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />

        {/* Next */}
        {canNavigate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-white/20 hover:scale-105"
            aria-label="Ảnh sau"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        )}

        {/* Counter pill */}
        {canNavigate && (
          <div className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex h-7 items-center rounded-full bg-white/15 backdrop-blur-sm px-3.5 text-[12px] font-medium text-white tabular-nums">
            {currentIndex + 1} / {total}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════ */

export function MediaView({
  type,
  links,
  height = 500,
  thumbnailHeight = 100,
  visibleThumbs = 4,
  className,
}: MediaViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbOffset, setThumbOffset] = useState(0);

  const thumbTrackRef = useRef<HTMLDivElement>(null);

  /* ── Derived ── */

  const total = links.length;
  const showArrows = total > 1;
  const showThumbArrows = total > visibleThumbs;
  const canThumbPrev = thumbOffset > 0;
  const canThumbNext = thumbOffset + visibleThumbs < total;

  // Thumbnail width: giữ ratio 16/10 theo height
  const thumbWidth = Math.round(thumbnailHeight * (16 / 10));
  const thumbGap = 8; // gap-2 = 8px

  /* ── Navigation ── */

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex((index + total) % total);
    },
    [total],
  );

  const goNext = useCallback(
    () => goTo(currentIndex + 1),
    [currentIndex, goTo],
  );

  const goPrev = useCallback(
    () => goTo(currentIndex - 1),
    [currentIndex, goTo],
  );

  /* ── Sync thumbnail scroll khi đổi ảnh ── */

  useEffect(() => {
    if (currentIndex >= thumbOffset + visibleThumbs) {
      setThumbOffset(currentIndex - visibleThumbs + 1);
    } else if (currentIndex < thumbOffset) {
      setThumbOffset(currentIndex);
    }
  }, [currentIndex, thumbOffset, visibleThumbs]);

  /* ── Thumbnail arrow handlers ── */

  const thumbScrollNext = () => {
    const maxOffset = Math.max(0, total - visibleThumbs);
    setThumbOffset((prev) => Math.min(prev + 1, maxOffset));
  };

  const thumbScrollPrev = () => {
    setThumbOffset((prev) => Math.max(prev - 1, 0));
  };

  /* ── Keyboard ── */

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isModalOpen, goPrev, goNext]);

  /* ── Guard ── */

  if (!links || links.length === 0) return null;

  /* ── Render ── */

  return (
    <div className={cn("w-full", className)}>
      {/* ════════════════════════════════════════
          MAIN VIEW
          ════════════════════════════════════════ */}
      <div
        className="group relative w-full overflow-hidden rounded-card bg-surface-soft"
        style={{ height: `${height}px` }}
      >
        {/* ── Media content ── */}
        {type === "image" ? (
          <img
            src={links[currentIndex]}
            alt={`Hình ảnh ${currentIndex + 1}`}
            className="h-full w-full object-cover transition-opacity duration-300"
            draggable={false}
          />
        ) : (
          <div className="h-full w-full bg-ink">
            <video
              key={links[currentIndex]}
              src={links[currentIndex]}
              controls
              controlsList="nodownload"
              className="h-full w-full object-contain"
              playsInline
            />
          </div>
        )}

        {/* ── Hover gradient (image only) ── */}
        {type === "image" && (
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-ink/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}

        {/* ── Zoom button (image only) ── */}
        {type === "image" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/40 text-white backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-ink/60 hover:scale-105"
            aria-label="Xem chi tiết"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        )}

        {/* ── Navigation arrows ── */}
        {showArrows && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-ink shadow-card-hover opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-white hover:scale-105"
              aria-label="Trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-ink shadow-card-hover opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-white hover:scale-105"
              aria-label="Sau"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* ── Counter pill ── */}
        {showArrows && (
          <div className="absolute bottom-3 left-3 z-10 flex h-6 items-center rounded-full bg-ink/50 px-2.5 text-[11px] font-medium text-white backdrop-blur-sm tabular-nums">
            {currentIndex + 1} / {total}
          </div>
        )}

        {/* ── Video type indicator ── */}
        {type === "video" && showArrows && (
          <div className="absolute bottom-3 left-3 z-10 flex h-6 items-center gap-1.5 rounded-full bg-ink/50 px-2.5 text-[11px] font-medium text-white backdrop-blur-sm">
            <Play className="h-3 w-3" fill="white" />
            Video {currentIndex + 1}/{total}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════
          THUMBNAIL STRIP
          ════════════════════════════════════════ */}
      {total > 1 && (
        <div className="relative mt-3">
          {/* ── Prev arrow ── */}
          {showThumbArrows && canThumbPrev && (
            <button
              onClick={thumbScrollPrev}
              className="absolute -left-3.5 top-1/2 z-20 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white text-ink shadow-card-hover transition-all duration-200 hover:bg-surface-soft hover:scale-110"
              aria-label="Xem thêm ảnh trước"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}

          {/* ── Thumbnails container ── */}
          <div
            className="overflow-hidden rounded-lg"
            style={{ height: `${thumbnailHeight}px` }}
          >
            <div
              ref={thumbTrackRef}
              className="flex h-full transition-transform duration-300 ease-out"
              style={{
                gap: `${thumbGap}px`,
                transform: `translateX(-${thumbOffset * (thumbWidth + thumbGap)}px)`,
              }}
            >
              {links.map((link, i) => {
                const isActive = i === currentIndex;

                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={cn(
                      "relative shrink-0 overflow-hidden rounded-lg transition-all duration-200",
                      isActive
                        ? "ring-2 ring-mint ring-offset-2 ring-offset-background opacity-100"
                        : "opacity-50 hover:opacity-80",
                    )}
                    style={{
                      width: `${thumbWidth}px`,
                      height: `${thumbnailHeight}px`,
                    }}
                    aria-label={isActive ? `Đang xem ${i + 1}` : `Xem ${i + 1}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {type === "image" ? (
                      <img
                        src={link}
                        alt={`Thumbnail ${i + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        draggable={false}
                      />
                    ) : (
                      <div className="relative h-full w-full bg-ink">
                        <video
                          src={link}
                          className="h-full w-full object-cover"
                          muted
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-ink/30">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <Play className="h-3.5 w-3.5 text-white" fill="white" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-mint" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Next arrow ── */}
          {showThumbArrows && canThumbNext && (
            <button
              onClick={thumbScrollNext}
              className="absolute -right-3.5 top-1/2 z-20 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white text-ink shadow-card-hover transition-all duration-200 hover:bg-surface-soft hover:scale-110"
              aria-label="Xem thêm ảnh sau"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════
          IMAGE MODAL
          ════════════════════════════════════════ */}
      {type === "image" && (
        <ImageModal
          src={links[currentIndex]}
          alt={`Chi tiết hình ảnh ${currentIndex + 1}`}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPrev={goPrev}
          onNext={goNext}
          canNavigate={showArrows}
          currentIndex={currentIndex}
          total={total}
        />
      )}
    </div>
  );
}

export default MediaView;
