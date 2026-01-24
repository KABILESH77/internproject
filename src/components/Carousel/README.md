# Carousel Component Documentation

## Quick Start

### Custom Carousel (No Dependencies)

```tsx
import { Carousel } from './components/Carousel';

const images = [
  { src: '/images/slide1.jpg', alt: 'Description 1' },
  { src: '/images/slide2.jpg', alt: 'Description 2' },
  { src: '/images/slide3.jpg', alt: 'Description 3' },
];

function HomePage() {
  return (
    <Carousel
      images={images}
      autoplay={true}
      interval={5000}
      pauseOnHover={true}
      showDots={true}
      showArrows={true}
      loop={true}
      lazyLoad={true}
    />
  );
}
```

### Swiper.js Option

```bash
# Installation
npm install swiper
# or
yarn add swiper
```

```tsx
import { SwiperCarousel } from './components/SwiperCarousel';
// Same usage pattern as above
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `CarouselImage[]` | required | Array of image objects with src, alt, placeholder?, srcSet?, sizes? |
| `autoplay` | `boolean` | `true` | Enable automatic slide advancement |
| `interval` | `number` | `5000` | Autoplay interval in milliseconds |
| `pauseOnHover` | `boolean` | `true` | Pause autoplay on mouse hover/focus |
| `showDots` | `boolean` | `true` | Show pagination dots |
| `showArrows` | `boolean` | `true` | Show prev/next navigation arrows |
| `loop` | `boolean` | `true` | Enable infinite looping |
| `lazyLoad` | `boolean` | `true` | Lazy load images not in view |
| `transitionType` | `'fade' \| 'slide'` | `'slide'` | Animation type |
| `onSlideChange` | `(index) => void` | - | Callback when slide changes |

---

## Performance & SEO Tips

### Image Optimization

- **Use WebP/AVIF formats**: 25-50% smaller than JPEG at same quality
  ```html
  <picture>
    <source srcset="image.avif" type="image/avif">
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="...">
  </picture>
  ```

- **Responsive srcSet**: Serve appropriate sizes for device
  ```tsx
  {
    src: '/images/hero.jpg',
    srcSet: '/images/hero-480w.jpg 480w, /images/hero-768w.jpg 768w, /images/hero-1200w.jpg 1200w',
    sizes: '(max-width: 480px) 100vw, (max-width: 768px) 100vw, 1200px'
  }
  ```

- **Compression**: Use tools like ImageOptim, Squoosh, or Sharp
  - Target: < 100KB for hero images at 1920px
  - Use quality 75-85 for JPEG, 80 for WebP

- **CDN delivery**: Use Cloudflare, Cloudinary, or imgix
  - Automatic format negotiation
  - Edge caching (< 50ms TTFB)
  - On-the-fly resizing

- **Preload first slide**: Critical for LCP
  ```html
  <link rel="preload" as="image" href="/images/hero-slide1.webp">
  ```

- **Cache headers**: Set long cache for immutable images
  ```
  Cache-Control: public, max-age=31536000, immutable
  ```

### Avoiding Layout Shift (CLS)

- **Always set aspect ratio** via CSS `padding-top` trick or `aspect-ratio`
- **Reserve space** before images load with placeholder
- **Use blur-up placeholders**: Tiny base64 images that load instantly

---

## Accessibility Checklist

- [x] **Keyboard navigation**: Arrow keys, Home/End supported
- [x] **ARIA roles**: `region`, `group` with `aria-roledescription`
- [x] **Live region**: `aria-live="polite"` for slide announcements
- [x] **Current indicator**: `aria-current="true"` on active dot
- [x] **Focus management**: Focus visible outlines on all controls
- [x] **Button labels**: `aria-label` on all navigation buttons
- [x] **Pause control**: Autoplay pauses on hover/focus
- [x] **Reduced motion**: Respects `prefers-reduced-motion`
- [x] **Alt text**: Required for all images
- [x] **Tab order**: Logical tabindex on dot navigation

### Testing Accessibility

```bash
# Run axe-core via Jest
npm install --save-dev @axe-core/react jest-axe

# In test file:
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<Carousel images={mockImages} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Running Tests

```bash
# Run all carousel tests
npm test -- --testPathPattern=Carousel

# Run with coverage
npm test -- --testPathPattern=Carousel --coverage

# Watch mode for development
npm test -- --testPathPattern=Carousel --watch
```

### Test Coverage

The test suite covers:
- Rendering (slides, arrows, dots)
- Autoplay advancement and looping
- Next/Prev navigation
- Pause on hover
- Keyboard navigation (arrows, Home, End)
- Touch/swipe gestures
- ARIA attributes and accessibility
- Callbacks

---

## Development & Deployment Notes

### Files Added

```
src/
├── components/
│   ├── Carousel/
│   │   ├── Carousel.tsx          # Main component
│   │   ├── Carousel.module.css   # Styles
│   │   ├── Carousel.test.tsx     # Tests
│   │   └── index.ts              # Exports
│   └── SwiperCarousel/           # Library option
│       ├── SwiperCarousel.tsx
│       ├── SwiperCarousel.module.css
│       └── index.ts
└── examples/
    ├── HomepageCarouselExample.tsx
    └── SwiperCarouselExample.tsx
```

### Install Commands

```bash
# Custom carousel - no dependencies needed!

# Swiper option
npm install swiper

# Testing (if not already installed)
npm install --save-dev @testing-library/react @testing-library/user-event jest-environment-jsdom
```

### Local Testing

```bash
npm run dev    # Start Vite dev server
npm test       # Run tests
```

### Production Considerations

**Lazy Loading**: The component uses native `loading="lazy"` for images beyond the first slide, combined with preloading adjacent slides for smooth transitions. The first slide loads eagerly to optimize LCP.

**SSR (Next.js)**: The custom carousel works with SSR. For Swiper, use dynamic imports with `ssr: false` or the `'use client'` directive. Both components avoid `window`/`document` access during initial render.

**Layout Shift Prevention**: The CSS uses `padding-top` percentage to reserve space before images load (56.25% for 16:9 ratio). This prevents CLS issues. Always provide image dimensions or use the same aspect ratio for all slides.

---

## When to Use Custom vs Swiper

| Criteria | Custom | Swiper |
|----------|--------|--------|
| Bundle size | ~5KB | ~40KB gzipped |
| Setup time | Ready to use | 5 min install |
| Effects | Fade, Slide | 10+ effects |
| Virtual slides | No | Yes (1000+ items) |
| Thumbs gallery | No | Built-in |
| Community/docs | This file | Extensive |
| Maintenance | You own it | Library updates |

**Recommendation**: Start with the custom component. Upgrade to Swiper only if you need advanced features like 3D effects, virtual slides, or thumbs navigation.
