/**
 * Protected Route Component
 * Wraps content that requires authentication
 */

import React from 'react';
import { Box, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAdmin?: boolean;
  onLoginClick?: () => void;
}

export function ProtectedRoute({ 
  children, 
  fallback,
  requireAdmin = false,
  onLoginClick 
}: ProtectedRouteProps) {
  const { user, loading, isConfigured } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="400px"
      >
        <Box
          w="40px"
          h="40px"
          borderRadius="full"
          border="3px solid"
          borderColor="whiteAlpha.300"
          borderTopColor="white"
          animation="spin 1s linear infinite"
          sx={{
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
      </Box>
    );
  }

  // Show custom fallback or login prompt if not authenticated
  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Box py={16}>
        <VStack
          spacing={6}
          maxW="400px"
          mx="auto"
          p={8}
          borderRadius="2xl"
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.2)"
          textAlign="center"
        >
          <Box
            p={4}
            borderRadius="full"
            bg="whiteAlpha.200"
          >
            <Lock size={48} color="white" />
          </Box>
          
          <Heading size="lg" color="white">
            Sign In Required
          </Heading>
          
          <Text color="whiteAlpha.800" fontSize="md">
            You need to be signed in to access this feature. 
            Create an account or sign in to continue.
          </Text>

          {!isConfigured && (
            <Text color="amber.300" fontSize="sm" bg="amber.500/20" p={3} borderRadius="lg">
              ⚠️ Supabase not configured. Add credentials to .env file.
            </Text>
          )}
          
          {onLoginClick && isConfigured && (
            <Button
              leftIcon={<LogIn size={18} />}
              onClick={onLoginClick}
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600' }}
              size="lg"
              borderRadius="xl"
              fontWeight="600"
              w="full"
            >
              Sign In to Continue
            </Button>
          )}
        </VStack>
      </Box>
    );
  }

  // Admin check (optional enhancement)
  if (requireAdmin) {
    // In a real app, you'd check user role from profile
    // For now, we'll just render the content
  }

  return <>{children}</>;
}

/**
 * Auth Gate - Simpler version that just hides content
 */
export function AuthGate({ 
  children, 
  showIfAuthenticated = true 
}: { 
  children: React.ReactNode;
  showIfAuthenticated?: boolean;
}) {
  const { user } = useAuth();
  
  if (showIfAuthenticated && !user) return null;
  if (!showIfAuthenticated && user) return null;
  
  return <>{children}</>;
}
