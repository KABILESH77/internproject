import { Box } from '@chakra-ui/react';

/**
 * Clean Professional Background
 * Simple white/light background for a professional look
 */
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
      bg="#ffffff"
    >
      {/* Subtle gradient overlay for depth */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)"
        opacity={1}
      />
      
      {/* Very subtle decorative elements */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        width="600px"
        height="600px"
        borderRadius="full"
        bg="linear-gradient(135deg, #f1f5f9 0%, transparent 70%)"
        opacity={0.5}
      />
      
      <Box
        position="absolute"
        bottom="-20%"
        left="-10%"
        width="500px"
        height="500px"
        borderRadius="full"
        bg="linear-gradient(315deg, #f1f5f9 0%, transparent 70%)"
        opacity={0.5}
      />
    </Box>
  );
};
