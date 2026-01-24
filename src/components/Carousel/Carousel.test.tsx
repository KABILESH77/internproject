/**
 * Carousel Unit & Integration Tests
 * Tests: autoplay, navigation, accessibility, keyboard, pause on hover
 * Run: npm test -- --testPathPattern=Carousel
 */

import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Carousel, CarouselImage } from './Carousel';

// Mock timers for autoplay testing
jest.useFakeTimers();

// Sample test images
const mockImages: CarouselImage[] = [
  { src: '/images/slide1.jpg', alt: 'First slide - Mountain landscape' },
  { src: '/images/slide2.jpg', alt: 'Second slide - Ocean sunset' },
  { src: '/images/slide3.jpg', alt: 'Third slide - Forest path' },
];

describe('Carousel Component', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all slides', () => {
      render(<Carousel images={mockImages} autoplay={false} />);
      
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getAllByRole('group')).toHaveLength(3);
    });

    it('renders nothing when images array is empty', () => {
      const { container } = render(<Carousel images={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('shows navigation arrows when showArrows is true', () => {
      render(<Carousel images={mockImages} showArrows={true} autoplay={false} />);
      
      expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
      expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
    });

    it('hides navigation arrows when showArrows is false', () => {
      render(<Carousel images={mockImages} showArrows={false} autoplay={false} />);
      
      expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next slide')).not.toBeInTheDocument();
    });

    it('shows dots when showDots is true', () => {
      render(<Carousel images={mockImages} showDots={true} autoplay={false} />);
      
      const dots = screen.getAllByRole('tab');
      expect(dots).toHaveLength(3);
    });

    it('hides dots when showDots is false', () => {
      render(<Carousel images={mockImages} showDots={false} autoplay={false} />);
      
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });
  });

  describe('Autoplay', () => {
    it('advances slides automatically when autoplay is true', () => {
      render(<Carousel images={mockImages} autoplay={true} interval={3000} />);
      
      // First slide should be active initially
      const slides = screen.getAllByRole('group');
      expect(slides[0]).toHaveAttribute('aria-hidden', 'false');
      expect(slides[1]).toHaveAttribute('aria-hidden', 'true');
      
      // Advance timer by interval
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      // Second slide should now be active
      expect(slides[0]).toHaveAttribute('aria-hidden', 'true');
      expect(slides[1]).toHaveAttribute('aria-hidden', 'false');
    });

    it('does not advance when autoplay is false', () => {
      render(<Carousel images={mockImages} autoplay={false} interval={3000} />);
      
      const slides = screen.getAllByRole('group');
      
      act(() => {
        jest.advanceTimersByTime(10000);
      });
      
      // First slide should still be active
      expect(slides[0]).toHaveAttribute('aria-hidden', 'false');
    });

    it('loops back to first slide after last when loop is true', () => {
      render(<Carousel images={mockImages} autoplay={true} interval={1000} loop={true} />);
      
      const slides = screen.getAllByRole('group');
      
      // Advance through all slides
      act(() => {
        jest.advanceTimersByTime(1000); // to slide 2
      });
      act(() => {
        jest.advanceTimersByTime(1000); // to slide 3
      });
      act(() => {
        jest.advanceTimersByTime(1000); // back to slide 1
      });
      
      expect(slides[0]).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('Navigation - Next/Prev', () => {
    it('clicking next advances to the next slide', async () => {
      render(<Carousel images={mockImages} autoplay={false} showArrows={true} />);
      
      const nextButton = screen.getByLabelText('Next slide');
      const slides = screen.getAllByRole('group');
      
      expect(slides[0]).toHaveAttribute('aria-hidden', 'false');
      
      await userEvent.click(nextButton);
      
      // Wait for transition
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(slides[1]).toHaveAttribute('aria-hidden', 'false');
    });

    it('clicking prev goes to the previous slide', async () => {
      render(<Carousel images={mockImages} autoplay={false} showArrows={true} loop={true} />);
      
      const prevButton = screen.getByLabelText('Previous slide');
      const slides = screen.getAllByRole('group');
      
      await userEvent.click(prevButton);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      // Should loop to last slide
      expect(slides[2]).toHaveAttribute('aria-hidden', 'false');
    });

    it('updates aria-current when slide changes', async () => {
      render(<Carousel images={mockImages} autoplay={false} showDots={true} />);
      
      const dots = screen.getAllByRole('tab');
      
      expect(dots[0]).toHaveAttribute('aria-current', 'true');
      expect(dots[1]).not.toHaveAttribute('aria-current');
      
      await userEvent.click(dots[1]);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(dots[0]).not.toHaveAttribute('aria-current');
      expect(dots[1]).toHaveAttribute('aria-current', 'true');
    });

    it('disables prev button on first slide when loop is false', () => {
      render(<Carousel images={mockImages} autoplay={false} loop={false} showArrows={true} />);
      
      const prevButton = screen.getByLabelText('Previous slide');
      expect(prevButton).toBeDisabled();
    });

    it('disables next button on last slide when loop is false', async () => {
      render(<Carousel images={mockImages} autoplay={false} loop={false} showArrows={true} />);
      
      const nextButton = screen.getByLabelText('Next slide');
      
      // Go to last slide
      await userEvent.click(nextButton);
      act(() => { jest.advanceTimersByTime(500); });
      await userEvent.click(nextButton);
      act(() => { jest.advanceTimersByTime(500); });
      
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Pause on Hover', () => {
    it('pauses autoplay when mouse enters carousel', async () => {
      render(
        <Carousel 
          images={mockImages} 
          autoplay={true} 
          interval={2000} 
          pauseOnHover={true} 
        />
      );
      
      const carousel = screen.getByRole('region');
      const slides = screen.getAllByRole('group');
      
      // Mouse enter to pause
      fireEvent.mouseEnter(carousel);
      
      // Advance timer - should NOT change slide
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      
      expect(slides[0]).toHaveAttribute('aria-hidden', 'false');
      
      // Mouse leave to resume
      fireEvent.mouseLeave(carousel);
      
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      
      expect(slides[1]).toHaveAttribute('aria-hidden', 'false');
    });

    it('does not pause when pauseOnHover is false', () => {
      render(
        <Carousel 
          images={mockImages} 
          autoplay={true} 
          interval={2000} 
          pauseOnHover={false} 
        />
      );
      
      const carousel = screen.getByRole('region');
      const slides = screen.getAllByRole('group');
      
      fireEvent.mouseEnter(carousel);
      
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      
      // Should still advance despite hover
      expect(slides[1]).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('Keyboard Navigation', () => {
    it('right arrow key advances to next slide', async () => {
      render(<Carousel images={mockImages} autoplay={false} />);
      
      const carousel = screen.getByRole('region');
      const slides = screen.getAllByRole('group');
      
      carousel.focus();
      
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(slides[1]).toHaveAttribute('aria-hidden', 'false');
    });

    it('left arrow key goes to previous slide', async () => {
      render(<Carousel images={mockImages} autoplay={false} loop={true} />);
      
      const carousel = screen.getByRole('region');
      const slides = screen.getAllByRole('group');
      
      carousel.focus();
      
      fireEvent.keyDown(document, { key: 'ArrowLeft' });
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      // Should loop to last slide
      expect(slides[2]).toHaveAttribute('aria-hidden', 'false');
    });

    it('Home key goes to first slide', async () => {
      render(<Carousel images={mockImages} autoplay={false} />);
      
      const carousel = screen.getByRole('region');
      const nextButton = screen.getByLabelText('Next slide');
      const slides = screen.getAllByRole('group');
      
      // Go to slide 2
      await userEvent.click(nextButton);
      act(() => { jest.advanceTimersByTime(500); });
      
      carousel.focus();
      fireEvent.keyDown(document, { key: 'Home' });
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(slides[0]).toHaveAttribute('aria-hidden', 'false');
    });

    it('End key goes to last slide', async () => {
      render(<Carousel images={mockImages} autoplay={false} />);
      
      const carousel = screen.getByRole('region');
      const slides = screen.getAllByRole('group');
      
      carousel.focus();
      fireEvent.keyDown(document, { key: 'End' });
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(slides[2]).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA roles and labels', () => {
      render(<Carousel images={mockImages} autoplay={false} />);
      
      const carousel = screen.getByRole('region');
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
      expect(carousel).toHaveAttribute('aria-label', 'Image slideshow');
      
      const slides = screen.getAllByRole('group');
      slides.forEach((slide, index) => {
        expect(slide).toHaveAttribute('aria-roledescription', 'slide');
        expect(slide).toHaveAttribute('aria-label', `${index + 1} of 3`);
      });
    });

    it('has live region for announcements', () => {
      render(<Carousel images={mockImages} autoplay={false} />);
      
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });

    it('dots have correct tab navigation attributes', () => {
      render(<Carousel images={mockImages} autoplay={false} showDots={true} />);
      
      const dots = screen.getAllByRole('tab');
      
      // First dot should be selected and focusable
      expect(dots[0]).toHaveAttribute('aria-selected', 'true');
      expect(dots[0]).toHaveAttribute('tabindex', '0');
      
      // Other dots should not be selected
      expect(dots[1]).toHaveAttribute('aria-selected', 'false');
      expect(dots[1]).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Touch/Swipe', () => {
    it('swipe left advances to next slide', () => {
      render(<Carousel images={mockImages} autoplay={false} />);
      
      const carousel = screen.getByRole('region');
      const slides = screen.getAllByRole('group');
      
      // Simulate swipe left (start at 200, end at 100)
      fireEvent.touchStart(carousel, {
        targetTouches: [{ clientX: 200 }],
      });
      fireEvent.touchMove(carousel, {
        targetTouches: [{ clientX: 100 }],
      });
      fireEvent.touchEnd(carousel);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(slides[1]).toHaveAttribute('aria-hidden', 'false');
    });

    it('swipe right goes to previous slide', () => {
      render(<Carousel images={mockImages} autoplay={false} loop={true} />);
      
      const carousel = screen.getByRole('region');
      const slides = screen.getAllByRole('group');
      
      // Simulate swipe right (start at 100, end at 200)
      fireEvent.touchStart(carousel, {
        targetTouches: [{ clientX: 100 }],
      });
      fireEvent.touchMove(carousel, {
        targetTouches: [{ clientX: 200 }],
      });
      fireEvent.touchEnd(carousel);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      // Should loop to last slide
      expect(slides[2]).toHaveAttribute('aria-hidden', 'false');
    });

    it('small swipe does not change slide', () => {
      render(<Carousel images={mockImages} autoplay={false} />);
      
      const carousel = screen.getByRole('region');
      const slides = screen.getAllByRole('group');
      
      // Swipe less than threshold (50px)
      fireEvent.touchStart(carousel, {
        targetTouches: [{ clientX: 200 }],
      });
      fireEvent.touchMove(carousel, {
        targetTouches: [{ clientX: 170 }],
      });
      fireEvent.touchEnd(carousel);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(slides[0]).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('Callbacks', () => {
    it('calls onSlideChange when slide changes', async () => {
      const handleSlideChange = jest.fn();
      
      render(
        <Carousel 
          images={mockImages} 
          autoplay={false} 
          onSlideChange={handleSlideChange}
        />
      );
      
      const nextButton = screen.getByLabelText('Next slide');
      await userEvent.click(nextButton);
      
      expect(handleSlideChange).toHaveBeenCalledWith(1);
    });
  });
});
