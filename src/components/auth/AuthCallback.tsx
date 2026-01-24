/**
 * Auth Callback Component
 * Handles OAuth redirect callback from providers like Google
 * Processes the auth tokens and redirects to the appropriate page
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { Box, Spinner, VStack, Text, Heading } from '@chakra-ui/react';

export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from URL hash or query params
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const errorParam = hashParams.get('error') || queryParams.get('error');
        const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');

        if (errorParam) {
          setError(errorDescription || errorParam);
          setTimeout(() => navigate('/auth'), 3000);
          return;
        }

        // If we have tokens in the hash, Supabase will handle the session automatically
        // The onAuthStateChange listener in AuthContext will pick up the session
        
        // Wait for Supabase to process the callback
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          setTimeout(() => navigate('/auth'), 3000);
          return;
        }

        if (session) {
          console.log('Auth callback successful, user:', session.user.id);
          console.log('Provider:', session.user.app_metadata?.provider);
          console.log('Email:', session.user.email);
          
          // Successfully authenticated - redirect to home
          navigate('/', { replace: true });
        } else {
          // No session yet, might be processing
          // Wait a bit and try again
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
              navigate('/', { replace: true });
            } else {
              setError('Authentication failed. Please try again.');
              setTimeout(() => navigate('/auth'), 3000);
            }
          }, 1000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('An unexpected error occurred during authentication.');
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="linear-gradient(135deg, #0a7676 0%, #0d9494 100%)"
    >
      <VStack spacing={6} textAlign="center">
        {error ? (
          <>
            <Heading size="lg" color="white">
              Authentication Error
            </Heading>
            <Text color="whiteAlpha.800" maxW="400px">
              {error}
            </Text>
            <Text color="whiteAlpha.600" fontSize="sm">
              Redirecting to login...
            </Text>
          </>
        ) : (
          <>
            <Spinner size="xl" color="white" thickness="4px" />
            <Heading size="lg" color="white">
              Completing Sign In...
            </Heading>
            <Text color="whiteAlpha.800">
              Please wait while we verify your account
            </Text>
          </>
        )}
      </VStack>
    </Box>
  );
}
