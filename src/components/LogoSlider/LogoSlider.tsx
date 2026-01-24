/**
 * LogoSlider Component
 * 
 * A smooth, infinite, auto-scrolling horizontal logo slider.
 * - Uses CSS keyframe animation for performance (GPU-accelerated)
 * - Duplicates logos to create seamless infinite loop
 * - Supports pause on hover, reduced-motion, and customization
 */

import React, { useMemo } from 'react';
import styles from './LogoSlider.module.css';

export interface Logo {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional link URL when logo is clicked */
  href?: string;
}

export interface LogoSliderProps {
  /** Array of logos to display */
  logos: Logo[];
  /** Animation duration in seconds (lower = faster). Default: 20 */
  speed?: number;
  /** Logo height in pixels. Default: 48 */
  logoHeight?: number;
  /** Gap between logos in pixels. Default: 64 */
  gap?: number;
  /** Scroll direction. Default: 'left' */
  direction?: 'left' | 'right';
  /** Pause animation on hover. Default: true */
  pauseOnHover?: boolean;
  /** Background color. Default: 'transparent' */
  backgroundColor?: string;
  /** Padding top and bottom in pixels. Default: 24 */
  paddingY?: number;
  /** Show gradient fade on edges. Default: true */
  showFade?: boolean;
  /** Aria label for the slider region. Default: 'Company logos' */
  ariaLabel?: string;
  /** Optional className for custom styling */
  className?: string;
}

export const LogoSlider: React.FC<LogoSliderProps> = ({
  logos,
  speed = 20,
  logoHeight = 48,
  gap = 64,
  direction = 'left',
  pauseOnHover = true,
  backgroundColor = 'transparent',
  paddingY = 24,
  showFade = true,
  ariaLabel = 'Company logos',
  className = '',
}) => {
  // Duplicate logos to create seamless infinite loop
  // We need at least 2 sets for the loop to work smoothly
  const duplicatedLogos = useMemo(() => {
    // Duplicate the array to ensure seamless looping
    return [...logos, ...logos];
  }, [logos]);

  // Calculate animation duration based on number of logos
  // More logos = longer duration to maintain consistent speed
  const animationDuration = useMemo(() => {
    return speed * (logos.length / 5); // Normalize speed relative to 5 logos
  }, [speed, logos.length]);

  if (logos.length === 0) {
    return null;
  }

  return (
    <section
      className={`${styles.sliderContainer} ${className}`}
      style={{
        backgroundColor,
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }}
      aria-label={ariaLabel}
      role="region"
    >
      {/* Gradient fade on left edge */}
      {showFade && <div className={styles.fadeLeft} aria-hidden="true" />}
      
      {/* Gradient fade on right edge */}
      {showFade && <div className={styles.fadeRight} aria-hidden="true" />}

      <div
        className={`${styles.sliderTrack} ${pauseOnHover ? styles.pauseOnHover : ''}`}
        style={{
          '--animation-duration': `${animationDuration}s`,
          '--gap': `${gap}px`,
          '--direction': direction === 'left' ? 'normal' : 'reverse',
        } as React.CSSProperties}
        aria-hidden="true" // Logos are decorative, announced via section label
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo.src}-${index}`}
            className={styles.logoItem}
          >
            {logo.href ? (
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.logoLink}
                tabIndex={index >= logos.length ? -1 : 0} // Only first set is focusable
                aria-label={`Visit ${logo.alt}`}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={styles.logoImage}
                  style={{ height: logoHeight }}
                  loading="lazy"
                  draggable={false}
                />
              </a>
            ) : (
              <img
                src={logo.src}
                alt={logo.alt}
                className={styles.logoImage}
                style={{ height: logoHeight }}
                loading="lazy"
                draggable={false}
              />
            )}
          </div>
        ))}
      </div>

      {/* Screen reader announcement */}
      <div className={styles.srOnly}>
        {logos.map((logo, index) => (
          <span key={index}>{logo.alt}</span>
        ))}
      </div>
    </section>
  );
};

export default LogoSlider;
