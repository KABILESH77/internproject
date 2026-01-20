import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float1 = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
  25% { transform: translateY(-30px) translateX(15px) scale(1.05); }
  50% { transform: translateY(-15px) translateX(-10px) scale(0.95); }
  75% { transform: translateY(-25px) translateX(20px) scale(1.02); }
`;

const float2 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-40px) rotate(10deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
`;

const shimmer = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
`;

export const AnimatedBackground = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={-1}
      overflow="hidden"
      bg="linear-gradient(-45deg, #0a7676, #0d9494, #1ab1b1, #4dc3c3, #ff9500, #ffa41a)"
      bgSize="400% 400%"
      animation={`${gradientAnimation} 20s ease infinite`}
    >
      {/* Large floating circle - top left */}
      <Box
        position="absolute"
        top="5%"
        left="5%"
        width={{ base: '200px', md: '350px' }}
        height={{ base: '200px', md: '350px' }}
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(40px)"
        animation={`${float1} 8s ease-in-out infinite, ${pulse} 4s ease-in-out infinite`}
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
      />

      {/* Medium circle - top right */}
      <Box
        position="absolute"
        top="15%"
        right="10%"
        width={{ base: '150px', md: '250px' }}
        height={{ base: '150px', md: '250px' }}
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.08)"
        backdropFilter="blur(30px)"
        animation={`${float2} 10s ease-in-out infinite 1s, ${shimmer} 5s ease-in-out infinite`}
      />

      {/* Small circle - bottom left */}
      <Box
        position="absolute"
        bottom="20%"
        left="15%"
        width={{ base: '100px', md: '180px' }}
        height={{ base: '100px', md: '180px' }}
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.12)"
        backdropFilter="blur(25px)"
        animation={`${float1} 7s ease-in-out infinite 2s`}
      />

      {/* Large circle - bottom right */}
      <Box
        position="absolute"
        bottom="10%"
        right="5%"
        width={{ base: '180px', md: '300px' }}
        height={{ base: '180px', md: '300px' }}
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.06)"
        backdropFilter="blur(35px)"
        animation={`${float2} 12s ease-in-out infinite 3s, ${pulse} 6s ease-in-out infinite 2s`}
      />

      {/* Center accent circle */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width={{ base: '120px', md: '200px' }}
        height={{ base: '120px', md: '200px' }}
        borderRadius="full"
        bg="rgba(255, 149, 0, 0.15)"
        backdropFilter="blur(20px)"
        animation={`${pulse} 5s ease-in-out infinite`}
      />

      {/* Extra small floating elements */}
      <Box
        position="absolute"
        top="40%"
        left="25%"
        width="80px"
        height="80px"
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.15)"
        animation={`${float1} 6s ease-in-out infinite 1.5s`}
      />
      <Box
        position="absolute"
        top="70%"
        right="30%"
        width="60px"
        height="60px"
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.1)"
        animation={`${float2} 9s ease-in-out infinite 2.5s`}
      />
    </Box>
  );
};
