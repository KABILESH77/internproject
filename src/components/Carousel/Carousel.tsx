/**
 * Production-ready Image Carousel Component
 * Custom implementation with no third-party dependencies
 * Supports: autoplay, touch/swipe, keyboard nav, accessibility, lazy loading
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from 'react';
import styles from './Carousel.module.css';

// Types
export interface CarouselImage {
  src: string;
  alt: string;
  placeholder?: string; // Low-quality placeholder for blur-up effect
  srcSet?: string; // Responsive srcset
  sizes?: string; // Responsive sizes
}

export interface CarouselProps {
  images: CarouselImage[];
  autoplay?: boolean;
  interval?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  lazyLoad?: boolean;
  transitionType?: 'fade' | 'slide';
  className?: string;
  onSlideChange?: (index: number) => void;
  /** Height of the carousel in pixels. Default: auto (16:9 aspect ratio) */
  height?: number;
}

// Touch threshold for swipe detection (in pixels)
const SWIPE_THRESHOLD = 50;

// Preload adjacent images for smoother transitions
const PRELOAD_COUNT = 1;

export const Carousel = memo(function Carousel({
  images,
  autoplay = true,
  interval = 5000,
  pauseOnHover = true,
  showDots = true,
  showArrows = true,
  loop = true,
  lazyLoad = true,
  transitionType = 'slide',
  className = '',
  onSlideChange,
  height,
}: CarouselProps) {
  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const announcerRef = useRef<HTMLDivElement>(null);

  const totalSlides = images.length;

  // Preload images that should be visible soon
  const imagesToPreload = useMemo(() => {
    const indices = new Set<number>();
    for (let i = -PRELOAD_COUNT; i <= PRELOAD_COUNT; i++) {
      let idx = currentIndex + i;
      if (loop) {
        idx = ((idx % totalSlides) + totalSlides) % totalSlides;
      } else if (idx >= 0 && idx < totalSlides) {
        indices.add(idx);
      }
      if (idx >= 0 && idx < totalSlides) {
        indices.add(idx);
      }
    }
    return indices;
  }, [currentIndex, totalSlides, loop]);

  // Mark images as loaded when they enter preload range
  useEffect(() => {
    setLoadedImages((prev) => {
      const next = new Set(prev);
      imagesToPreload.forEach((idx) => next.add(idx));
      return next;
    });
  }, [imagesToPreload]);

  // Navigation functions
  const goToSlide = useCallback(
    (index: number, announce = true) => {
      if (isTransitioning) return;

      let newIndex = index;
      if (loop) {
        newIndex = ((index % totalSlides) + totalSlides) % totalSlides;
      } else {
        newIndex = Math.max(0, Math.min(index, totalSlides - 1));
      }

      if (newIndex === currentIndex) return;

      setIsTransitioning(true);
      setCurrentIndex(newIndex);
      onSlideChange?.(newIndex);

      // Announce to screen readers
      if (announce && announcerRef.current) {
        announcerRef.current.textContent = `Slide ${newIndex + 1} of ${totalSlides}: ${images[newIndex].alt}`;
      }

      // Reset transitioning state after animation completes
      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [currentIndex, totalSlides, loop, isTransitioning, images, onSlideChange]
  );

  const goToNext = useCallback(() => {
    if (!loop && currentIndex === totalSlides - 1) return;
    goToSlide(currentIndex + 1);
  }, [currentIndex, totalSlides, loop, goToSlide]);

  const goToPrev = useCallback(() => {
    if (!loop && currentIndex === 0) return;
    goToSlide(currentIndex - 1);
  }, [currentIndex, loop, goToSlide]);

  // Autoplay logic
  useEffect(() => {
    if (!autoplay || isPaused || totalSlides <= 1) {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      goToNext();
    }, interval);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, isPaused, interval, totalSlides, goToNext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if carousel or its children are focused
      if (!containerRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(totalSlides - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, goToSlide, totalSlides]);

  // Touch/swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > SWIPE_THRESHOLD;
    const isRightSwipe = distance < -SWIPE_THRESHOLD;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, goToNext, goToPrev]);

  // Hover handlers for pause on hover
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  // Focus management
  const handleFocus = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleBlur = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  // Render nothing if no images
  if (!images || images.length === 0) {
    return null;
  }

  const canGoPrev = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < totalSlides - 1;

  return (
    <div
      ref={containerRef}
      className={`${styles.carousel} ${styles[transitionType]} ${className}`}
      style={height ? { height: `${height}px` } : undefined}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image slideshow"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      {/* Live region for screen reader announcements */}
      <div
        ref={announcerRef}
        className={styles.srOnly}
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Slides container */}
      <div
        className={styles.slidesContainer}
        style={
          transitionType === 'slide'
            ? { transform: `translateX(-${currentIndex * 100}%)` }
            : undefined
        }
      >
        {images.map((image, index) => {
          const isActive = index === currentIndex;
          const shouldLoad = !lazyLoad || loadedImages.has(index);

          return (
            <div
              key={index}
              className={`${styles.slide} ${isActive ? styles.active : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${totalSlides}`}
              aria-hidden={!isActive}
            >
              {shouldLoad ? (
                <picture>
                  <img
                    src={image.src}
                    srcSet={image.srcSet}
                    sizes={image.sizes || '100vw'}
                    alt={image.alt}
                    className={styles.image}
                    loading={lazyLoad && index !== 0 ? 'lazy' : 'eager'}
                    decoding="async"
                    style={
                      image.placeholder
                        ? { backgroundImage: `url(${image.placeholder})` }
                        : undefined
                    }
                  />
                </picture>
              ) : (
                <div
                  className={styles.placeholder}
                  style={
                    image.placeholder
                      ? { backgroundImage: `url(${image.placeholder})` }
                      : undefined
                  }
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            onClick={goToPrev}
            disabled={!canGoPrev}
            aria-label="Previous slide"
            aria-disabled={!canGoPrev}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={goToNext}
            disabled={!canGoNext}
            aria-label="Next slide"
            aria-disabled={!canGoNext}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {showDots && totalSlides > 1 && (
        <div
          className={styles.dots}
          role="tablist"
          aria-label="Slide navigation"
        >
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentIndex}
              aria-current={index === currentIndex ? 'true' : undefined}
              tabIndex={index === currentIndex ? 0 : -1}
            />
          ))}
        </div>
      )}

      {/* Pause indicator (for screen readers) */}
      {autoplay && (
        <div className={styles.srOnly} aria-live="polite">
          {isPaused ? 'Slideshow paused' : 'Slideshow playing'}
        </div>
      )}
    </div>
  );
});

export default Carousel;
