/**
 * Homepage Carousel Usage Example
 * Demonstrates the custom Carousel component with sample images
 */

import React from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { Carousel, CarouselImage } from '../components/Carousel';

// Sample images with responsive srcset and placeholders
const heroImages: CarouselImage[] = [
  {
    src: '/images/hero/internship-tech.jpg',
    alt: 'Students collaborating on a tech project in a modern office',
    placeholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBQYhEhMiMUFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADERX/2gAMAwEAAhEDEEA/ANlvtQitbRHuJzHGHOWY8c+PNS7fqBu7YTxpKsbb+xzn4aUpLpVjTZuNm4Mrr//Z',
    srcSet: '/images/hero/internship-tech-480w.jpg 480w, /images/hero/internship-tech-768w.jpg 768w, /images/hero/internship-tech-1200w.jpg 1200w, /images/hero/internship-tech.jpg 1920w',
    sizes: '(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px',
  },
  {
    src: '/images/hero/career-growth.jpg',
    alt: 'Professional woman presenting to a team in a boardroom',
    placeholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAQH/8QAIRAAAgIBAwUBAAAAAAAAAAAAAQIDEQAEBSEGEhMxQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECABEDITFB/9oADAMBEEEhEQA/ANg3TcYNv0rTyMzAuVQAdyxPwfSj7iq93kOo7hqJWb8cAApP0YxhuXqHVWMcLMWM8//Z',
    srcSet: '/images/hero/career-growth-480w.jpg 480w, /images/hero/career-growth-768w.jpg 768w, /images/hero/career-growth-1200w.jpg 1200w, /images/hero/career-growth.jpg 1920w',
    sizes: '(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px',
  },
  {
    src: '/images/hero/teamwork.jpg',
    alt: 'Diverse team of interns celebrating a successful project launch',
    placeholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIRAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSIRMxQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAE/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEQMhMf/aAAwDAQACEQMRAD8A0+91GG0tEdrmQRq5wWPQz9+VSLfqRur9TJHEsq7uSc9PSlKW2Q0bNw5Xf//Z',
    srcSet: '/images/hero/teamwork-480w.jpg 480w, /images/hero/teamwork-768w.jpg 768w, /images/hero/teamwork-1200w.jpg 1200w, /images/hero/teamwork.jpg 1920w',
    sizes: '(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px',
  },
];

// For demo without actual images, use placeholder URLs
const demoImages: CarouselImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80',
    alt: 'Students collaborating on a tech project in a modern office',
  },
  {
    src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80',
    alt: 'Professional woman presenting to a team in a boardroom',
  },
  {
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80',
    alt: 'Diverse team of interns celebrating a successful project launch',
  },
];

export function HomepageCarouselExample() {
  const handleSlideChange = (index: number) => {
    console.log('Current slide:', index);
  };

  return (
    <Box>
      {/* Hero Section with Carousel */}
      <Box position="relative" mb={12}>
        <Carousel
          images={demoImages} // Use heroImages in production with actual image files
          autoplay={true}
          interval={5000}
          pauseOnHover={true}
          showDots={true}
          showArrows={true}
          loop={true}
          lazyLoad={true}
          transitionType="slide"
          onSlideChange={handleSlideChange}
        />
        
        {/* Optional overlay content on top of carousel */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="blackAlpha.400"
          pointerEvents="none"
        >
          <VStack spacing={4} textAlign="center" color="white" px={4}>
            <Heading
              size={{ base: 'xl', md: '2xl', lg: '3xl' }}
              textShadow="0 2px 10px rgba(0,0,0,0.5)"
            >
              Find Your Dream Internship
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              maxW="600px"
              textShadow="0 1px 5px rgba(0,0,0,0.5)"
            >
              Connect with top companies and kickstart your career journey
            </Text>
          </VStack>
        </Box>
      </Box>

      {/* Example: Minimal carousel without overlay */}
      <Container maxW="4xl" py={8}>
        <Heading size="lg" mb={6}>
          Featured Opportunities
        </Heading>
        <Carousel
          images={demoImages}
          autoplay={true}
          interval={4000}
          pauseOnHover={true}
          showDots={true}
          showArrows={false} // Hide arrows for cleaner look
          loop={true}
          transitionType="fade" // Fade transition variant
        />
      </Container>
    </Box>
  );
}

export default HomepageCarouselExample;
