/**
 * Swiper Carousel Usage Example
 * Shows how to integrate the library-based carousel
 */

import React from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { SwiperCarousel, SwiperImage } from '../components/SwiperCarousel';

const images: SwiperImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80',
    alt: 'Students collaborating on a tech project',
    srcSet: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=480&q=80 480w, https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=768&q=80 768w, https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80 1200w, https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80 1920w',
    sizes: '100vw',
  },
  {
    src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80',
    alt: 'Professional presenting to a team',
  },
  {
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80',
    alt: 'Team celebrating success',
  },
];

export function SwiperCarouselExample() {
  return (
    <Box py={8}>
      <Container maxW="6xl">
        <Heading size="lg" mb={6}>
          Featured with Swiper.js
        </Heading>
        
        {/* Basic usage */}
        <SwiperCarousel
          images={images}
          autoplay={true}
          autoplayDelay={4000}
          pauseOnHover={true}
          showPagination={true}
          showNavigation={true}
          loop={true}
          effect="slide"
          onSlideChange={(index) => console.log('Slide changed to:', index)}
        />
        
        {/* Fade effect variant */}
        <Heading size="md" mt={12} mb={6}>
          Fade Effect Variant
        </Heading>
        <SwiperCarousel
          images={images}
          effect="fade"
          showNavigation={false}
        />
      </Container>
    </Box>
  );
}

export default SwiperCarouselExample;
