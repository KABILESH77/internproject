/**
 * Swiper.js Carousel Implementation
 * Industry-standard library option with full configuration
 * 
 * INSTALLATION:
 * npm install swiper
 * # or
 * yarn add swiper
 * 
 * WHEN TO USE SWIPER VS CUSTOM:
 * 
 * Use Swiper when:
 * - You need complex effects (3D cube, coverflow, cards, creative)
 * - Virtual slides for 1000+ items
 * - Nested carousels or thumbs gallery
 * - Free mode / momentum scrolling
 * - Parallax effects
 * - Time-critical project (faster implementation)
 * 
 * Use Custom when:
 * - Bundle size is critical (Swiper is ~40KB gzipped)
 * - Simple fade/slide is sufficient
 * - Full control over behavior needed
 * - Learning/educational purposes
 * - Avoiding third-party dependencies
 */

import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import {
  Navigation,
  Pagination,
  Autoplay,
  Keyboard,
  A11y,
  EffectFade,
  Lazy,
} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/a11y';

// Custom styles for Swiper
import styles from './SwiperCarousel.module.css';

export interface SwiperImage {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
}

export interface SwiperCarouselProps {
  images: SwiperImage[];
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  effect?: 'slide' | 'fade';
  className?: string;
  onSlideChange?: (index: number) => void;
}

export function SwiperCarousel({
  images,
  autoplay = true,
  autoplayDelay = 5000,
  pauseOnHover = true,
  showPagination = true,
  showNavigation = true,
  loop = true,
  effect = 'slide',
  className = '',
  onSlideChange,
}: SwiperCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
    onSlideChange?.(swiper.realIndex);
  };

  const handleMouseEnter = () => {
    if (pauseOnHover && swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div
      className={`${styles.swiperContainer} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay, Keyboard, A11y, EffectFade, Lazy]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
        spaceBetween={0}
        slidesPerView={1}
        navigation={showNavigation}
        pagination={
          showPagination
            ? {
                clickable: true,
                dynamicBullets: images.length > 5,
              }
            : false
        }
        autoplay={
          autoplay
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
                pauseOnMouseEnter: pauseOnHover,
              }
            : false
        }
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        a11y={{
          enabled: true,
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          firstSlideMessage: 'This is the first slide',
          lastSlideMessage: 'This is the last slide',
          paginationBulletMessage: 'Go to slide {{index}}',
          slideLabelMessage: 'Slide {{index}} of {{slidesLength}}',
          containerMessage: 'Image slideshow',
          containerRoleDescriptionMessage: 'carousel',
          itemRoleDescriptionMessage: 'slide',
        }}
        loop={loop}
        effect={effect}
        fadeEffect={{ crossFade: true }}
        lazy={{
          loadPrevNext: true,
          loadPrevNextAmount: 2,
        }}
        watchSlidesProgress
        className={styles.swiper}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes={image.sizes || '100vw'}
              alt={image.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className={styles.image}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Screen reader announcement */}
      <div className={styles.srOnly} aria-live="polite" aria-atomic="true">
        Slide {activeIndex + 1} of {images.length}: {images[activeIndex]?.alt}
      </div>
    </div>
  );
}

export default SwiperCarousel;

/**
 * SSR CONSIDERATIONS (Next.js):
 * 
 * Swiper uses browser APIs and must be imported dynamically in Next.js:
 * 
 * // In your page/component:
 * import dynamic from 'next/dynamic';
 * 
 * const SwiperCarousel = dynamic(
 *   () => import('../components/SwiperCarousel').then(mod => mod.SwiperCarousel),
 *   { 
 *     ssr: false,
 *     loading: () => <div className="carousel-skeleton" /> 
 *   }
 * );
 * 
 * ALTERNATIVE: Use 'use client' directive in Next.js 13+ App Router:
 * 
 * 'use client';
 * import { SwiperCarousel } from '../components/SwiperCarousel';
 */
