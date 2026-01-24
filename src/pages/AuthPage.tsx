/**
 * Authentication Page
 * Full-page sign in / sign up experience with proper alignment
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  IconButton,
  Center,
} from '@chakra-ui/react';
import { Briefcase, Sparkles, Shield, Users, TrendingUp, ArrowLeft } from 'lucide-react';
import { LoginForm, SignUpForm, ForgotPasswordForm, ResetPasswordForm } from '../components/auth';
import { useAuth } from '../context/AuthContext';

export type AuthView = 'login' | 'signup' | 'forgot-password' | 'reset-password';

interface AuthPageProps {
  initialView?: AuthView;
  onAuthSuccess?: () => void;
  onBack?: () => void;
}

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Matches',
    description: 'Get personalized internship recommendations',
  },
  {
    icon: Shield,
    title: 'Verified Opportunities',
    description: 'All internships from trusted companies',
  },
  {
    icon: Users,
    title: 'Join 50K+ Students',
    description: 'Connect with ambitious professionals',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Progress',
    description: 'Save and manage your applications',
  },
];

export function AuthPage({ initialView = 'login', onAuthSuccess, onBack }: AuthPageProps) {
  const [currentView, setCurrentView] = useState<AuthView>(initialView);
  const { user } = useAuth();

  useEffect(() => {
    if (user && onAuthSuccess) {
      onAuthSuccess();
    }
  }, [user, onAuthSuccess]);

  const handleAuthSuccess = () => {
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  };

  const renderForm = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignUp={() => setCurrentView('signup')}
            onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
          />
        );
      case 'signup':
        return (
          <SignUpForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      case 'reset-password':
        return (
          <ResetPasswordForm
            onSuccess={() => setCurrentView('login')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Flex minH="100vh" direction={{ base: 'column', lg: 'row' }}>
      {/* Left Side - Branding Panel */}
      <Box
        display={{ base: 'none', lg: 'block' }}
        w={{ lg: '45%', xl: '50%' }}
        bg="linear-gradient(135deg, #0a7676 0%, #0d9494 50%, #10b8b8 100%)"
        position="relative"
        overflow="hidden"
      >
        {/* Background Pattern */}
        <Box
          position="absolute"
          inset={0}
          opacity={0.1}
          bgImage="radial-gradient(circle at 25% 25%, white 2%, transparent 2%), radial-gradient(circle at 75% 75%, white 2%, transparent 2%)"
          bgSize="60px 60px"
        />
        
        {/* Decorative Blurs */}
        <Box
          position="absolute"
          top="10%"
          right="10%"
          w="200px"
          h="200px"
          borderRadius="full"
          bg="whiteAlpha.200"
          filter="blur(60px)"
        />
        <Box
          position="absolute"
          bottom="15%"
          left="5%"
          w="250px"
          h="250px"
          borderRadius="full"
          bg="whiteAlpha.200"
          filter="blur(80px)"
        />

        {/* Content */}
        <Flex
          position="relative"
          zIndex={1}
          h="100%"
          direction="column"
          justify="center"
          px={{ lg: 10, xl: 16 }}
          py={12}
        >
          {/* Logo */}
          <HStack spacing={3} mb={10}>
            <Box
              bg="white"
              borderRadius="xl"
              p={3}
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
            >
              <Briefcase size={28} color="#0a7676" />
            </Box>
            <VStack spacing={0} align="start">
              <Heading size="lg" color="white" fontWeight="800" letterSpacing="tight">
                JobRasa
              </Heading>
              <Text color="whiteAlpha.800" fontSize="sm" fontWeight="500">
                Find Your Dream Internship
              </Text>
            </VStack>
          </HStack>

          {/* Tagline */}
          <VStack align="start" spacing={4} mb={10}>
            <Heading size="xl" color="white" lineHeight="1.3" maxW="400px">
              Launch Your Career with the{' '}
              <Text as="span" color="yellow.300">
                Perfect Internship
              </Text>
            </Heading>
            <Text color="whiteAlpha.800" fontSize="md" maxW="380px">
              Join thousands of students who found their dream internships through our AI-powered platform.
            </Text>
          </VStack>

          {/* Features */}
          <VStack align="start" spacing={4} mb={10}>
            {features.map((feature, index) => (
              <HStack key={index} spacing={3} align="start">
                <Center
                  bg="whiteAlpha.200"
                  borderRadius="lg"
                  p={2}
                  minW="36px"
                  h="36px"
                >
                  <Icon as={feature.icon} boxSize={4} color="white" />
                </Center>
                <VStack align="start" spacing={0}>
                  <Text color="white" fontWeight="600" fontSize="sm">
                    {feature.title}
                  </Text>
                  <Text color="whiteAlpha.700" fontSize="xs">
                    {feature.description}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </VStack>

          {/* Stats */}
          <HStack spacing={10}>
            <VStack spacing={0}>
              <Text color="white" fontSize="2xl" fontWeight="800">50K+</Text>
              <Text color="whiteAlpha.700" fontSize="xs">Students</Text>
            </VStack>
            <VStack spacing={0}>
              <Text color="white" fontSize="2xl" fontWeight="800">10K+</Text>
              <Text color="whiteAlpha.700" fontSize="xs">Internships</Text>
            </VStack>
            <VStack spacing={0}>
              <Text color="white" fontSize="2xl" fontWeight="800">500+</Text>
              <Text color="whiteAlpha.700" fontSize="xs">Companies</Text>
            </VStack>
          </HStack>
        </Flex>
      </Box>

      {/* Right Side - Auth Form */}
      <Box
        flex={1}
        bg="gray.50"
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={{ base: 4, sm: 6, md: 8 }}
        minH={{ base: '100vh', lg: 'auto' }}
      >
        {/* Back Button */}
        {onBack && (
          <IconButton
            aria-label="Back to home"
            icon={<ArrowLeft size={20} />}
            onClick={onBack}
            position="absolute"
            top={4}
            left={4}
            bg="white"
            color="gray.600"
            boxShadow="sm"
            borderRadius="full"
            size="md"
            _hover={{ bg: 'gray.100', color: 'gray.800' }}
          />
        )}

        <Box w="full" maxW="420px">
          {/* Mobile Logo */}
          <Center display={{ base: 'flex', lg: 'none' }} mb={6}>
            <HStack spacing={2}>
              <Box
                bg="linear-gradient(135deg, #0a7676 0%, #0d9494 100%)"
                borderRadius="lg"
                p={2}
              >
                <Briefcase size={24} color="white" />
              </Box>
              <Heading size="lg" color="gray.800" fontWeight="800">
                JobRasa
              </Heading>
            </HStack>
          </Center>

          {/* Form Card */}
          <Box
            bg="white"
            borderRadius="2xl"
            p={{ base: 6, sm: 8 }}
            boxShadow="0 10px 40px rgba(0, 0, 0, 0.08)"
            border="1px solid"
            borderColor="gray.100"
          >
            {/* Red Accent Bar */}
            <Box
              h="4px"
              w="60px"
              bg="linear-gradient(90deg, #DC3545 0%, #C82333 100%)"
              borderRadius="full"
              mb={6}
              mx="auto"
            />

            {renderForm()}
          </Box>

          {/* Footer */}
          <Text
            textAlign="center"
            color="gray.500"
            fontSize="xs"
            mt={6}
            px={4}
          >
            By continuing, you agree to our{' '}
            <Text as="span" color="red.500" cursor="pointer" _hover={{ textDecoration: 'underline' }}>
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text as="span" color="red.500" cursor="pointer" _hover={{ textDecoration: 'underline' }}>
              Privacy Policy
            </Text>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
