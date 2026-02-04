import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Container,
  Heading,
  Badge,
  useColorMode,
  useColorModeValue,
  Avatar,
  Menu as ChakraMenu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import {
  Home,
  Search,
  Heart,
  Settings,
  HelpCircle,
  Menu,
  Sun,
  Moon,
  Sparkles,
  Briefcase,
  ArrowRight,
  Zap,
  Target,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  Filter,
  Bookmark,
  Mail,
  MessageCircle,
  Plus,
  Upload,
  BarChart3,
  UserCog,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatedBackground } from './components/AnimatedBackground';
import { AIChatAssistant, AIChatButton } from './components/AIChatAssistant';
import { ProtectedRoute } from './components/auth';
import { useAuth } from './context/AuthContext';
import { OnboardingData } from './components/OnboardingModal';
import { mockInternships } from './data/mockInternships';
import { getRecommendations, RecommendationWeights, ScoredInternship } from './services/recommendationEngine';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { MLRecommendationsPage } from './pages/MLRecommendationsPage';
import { AdminPage } from './pages/AdminPage';
import { ROUTES, getPageFromPath, getPathForPage, PageType } from './router';
import { Carousel, CarouselImage } from './components/Carousel';
import { LogoSlider, Logo } from './components/LogoSlider';
import { useMLRecommendations } from './hooks/useMLRecommendations';

// Hero carousel images for homepage
const heroCarouselImages: CarouselImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80',
    alt: 'Students collaborating on a tech project in a modern office space',
  },
  {
    src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80',
    alt: 'Professional team working together in a bright workspace',
  },
  {
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80',
    alt: 'Diverse group of interns celebrating project success',
  },
  {
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80',
    alt: 'Young professionals networking at a career event',
  },
];

// Company logos for the infinite slider
const companyLogos: Logo[] = [
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg', alt: 'Google', href: 'https://careers.google.com' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg', alt: 'Apple', href: 'https://www.apple.com/careers' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg', alt: 'Microsoft', href: 'https://careers.microsoft.com' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazon/amazon-original.svg', alt: 'Amazon', href: 'https://www.amazon.jobs' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg', alt: 'Meta', href: 'https://www.metacareers.com' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg', alt: 'Twitter/X', href: 'https://careers.twitter.com' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg', alt: 'LinkedIn', href: 'https://careers.linkedin.com' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg', alt: 'Slack', href: 'https://slack.com/careers' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spotify/spotify-original.svg', alt: 'Spotify', href: 'https://www.lifeatspotify.com' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/adobe/adobe-original.svg', alt: 'Adobe', href: 'https://www.adobe.com/careers' },
];

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Derive current page from URL path
  const currentPage = getPageFromPath(location.pathname);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  
  // Auth state
  const { user, profile, signOut, isConfigured } = useAuth();
  
  // AI Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // User profile state (simulated - in production would persist)
  const [userProfile, setUserProfile] = useState<OnboardingData | null>({
    education: 'undergraduate',
    skills: ['Python', 'JavaScript', 'React', 'Data Analysis'],
    interests: ['tech', 'healthcare'],
    location: 'San Francisco, CA'
  });
  
  // Saved internships
  const [savedInternshipIds, setSavedInternshipIds] = useState<string[]>([]);
  
  // Recommendation weights (controlled from admin)
  const [weights, setWeights] = useState<RecommendationWeights>({
    skill: 40,
    interest: 35,
    location: 25
  });
  
  // Compute recommendations using ML engine
  const recommendations: ScoredInternship[] = useMemo(() => {
    return getRecommendations(mockInternships, userProfile, weights);
  }, [userProfile, weights]);
  
  // Toggle save internship
  const handleSaveInternship = (id: string) => {
    setSavedInternshipIds(prev => 
      prev.includes(id) 
        ? prev.filter(savedId => savedId !== id)
        : [...prev, id]
    );
  };

  // Build navigation items - add Profile when logged in, Sign In when not logged in
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'recommendations', label: 'For You', icon: Sparkles },
    { id: 'saved', label: 'Saved', icon: Heart },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'admin', label: 'Admin', icon: Settings },
    // Add Profile tab when user is logged in, Sign In when not logged in
    ...(user ? [{ id: 'profile', label: 'Profile', icon: User }] : [{ id: 'auth', label: 'Sign In', icon: LogIn }]),
  ];

  // Navigate using router - updates URL
  const handleNavClick = useCallback((page: PageType) => {
    navigate(getPathForPage(page));
    onClose();
  }, [navigate, onClose]);

  // Clean professional colors
  const headerBg = useColorModeValue('white', 'gray.900');
  const headerBorder = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.100', 'gray.800');
  const activeBg = useColorModeValue('gray.200', 'gray.700');

  // If on auth page, render AuthPage instead of main layout
  if (currentPage === 'auth') {
    return (
      <AuthPage
        initialView="login"
        onAuthSuccess={() => navigate(ROUTES.home)}
        onBack={() => navigate(ROUTES.home)}
      />
    );
  }

  return (
    <Box minH="100vh" position="relative">
      <AnimatedBackground />

      {/* Professional Header */}
      <Box
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={100}
        bg={headerBg}
        borderBottom="1px solid"
        borderColor={headerBorder}
        boxShadow="0 1px 3px rgba(0, 0, 0, 0.05)"
      >
        <Flex
          maxW="1400px"
          mx="auto"
          px={{ base: 4, md: 8 }}
          py={3}
          align="center"
          justify="space-between"
        >
          {/* Logo */}
          <HStack spacing={3} cursor="pointer" onClick={() => navigate(ROUTES.home)}>
            <Box
              bg="teal.500"
              borderRadius="lg"
              p={2}
            >
              <Briefcase size={22} color="white" />
            </Box>
            <VStack spacing={0} align="start">
              <Heading
                size="md"
                color={textColor}
                fontWeight="700"
                letterSpacing="tight"
              >
                JobRasa
              </Heading>
              <Text fontSize="xs" color={textMuted} fontWeight="500">
                Find Your Dream Internship
              </Text>
            </VStack>
          </HStack>

          {/* Desktop Navigation */}
          <HStack spacing={1} display={{ base: 'none', lg: 'flex' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  leftIcon={<Icon size={18} />}
                  onClick={() => handleNavClick(item.id as PageType)}
                  bg={isActive ? activeBg : 'transparent'}
                  color={isActive ? 'teal.600' : textColor}
                  _hover={{ bg: hoverBg }}
                  fontWeight={isActive ? '600' : '500'}
                  borderRadius="lg"
                  px={4}
                  size="md"
                  transition="all 0.15s"
                >
                  {item.label}
                </Button>
              );
            })}
          </HStack>

          {/* Right side controls */}
          <HStack spacing={2}>
            <IconButton
              aria-label="Toggle theme"
              icon={colorMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              onClick={toggleColorMode}
              variant="ghost"
              color={textMuted}
              _hover={{ bg: hoverBg, color: textColor }}
              borderRadius="lg"
              size="md"
            />
            
            {/* Auth Controls */}
            {user ? (
              <ChakraMenu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  color={textColor}
                  _hover={{ bg: hoverBg }}
                  borderRadius="lg"
                  rightIcon={<ChevronDown size={16} />}
                  display={{ base: 'none', md: 'flex' }}
                >
                  <HStack spacing={2}>
                    <Avatar 
                      size="sm" 
                      name={profile?.full_name || user.email || 'User'} 
                      src={profile?.avatar_url || undefined}
                      bg="brand.500"
                    />
                    <Text fontWeight="600" display={{ base: 'none', lg: 'block' }}>
                      {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  boxShadow="0 25px 50px rgba(0, 0, 0, 0.15)"
                  py={2}
                >
                  {/* User Info Header */}
                  <Box px={4} py={3} borderBottom="1px solid" borderColor="gray.100">
                    <Text fontWeight="600" color="gray.800" fontSize="sm">
                      {profile?.full_name || 'User'}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {user.email}
                    </Text>
                  </Box>
                  <MenuItem 
                    icon={<User size={16} />}
                    onClick={() => navigate(ROUTES.profile)}
                    bg="transparent"
                    _hover={{ bg: 'gray.100' }}
                    color="gray.700"
                  >
                    Profile
                  </MenuItem>
                  <MenuItem 
                    icon={<Heart size={16} />}
                    onClick={() => navigate(ROUTES.saved)}
                    bg="transparent"
                    _hover={{ bg: 'gray.100' }}
                    color="gray.700"
                  >
                    Saved Internships
                  </MenuItem>
                  <MenuDivider borderColor="gray.200" />
                  <MenuItem 
                    icon={<LogOut size={16} />}
                    onClick={async () => {
                      await signOut();
                      navigate(ROUTES.home);
                    }}
                    bg="transparent"
                    _hover={{ bg: 'red.50' }}
                    color="red.500"
                    fontWeight="500"
                  >
                    Sign Out
                  </MenuItem>
                </MenuList>
              </ChakraMenu>
            ) : (
              <Button
                leftIcon={<LogIn size={18} />}
                onClick={() => navigate(ROUTES.auth)}
                bg="teal.500"
                color="white"
                _hover={{ bg: 'teal.600' }}
                borderRadius="lg"
                fontWeight="600"
                size="md"
                display={{ base: 'none', md: 'flex' }}
              >
                Sign In
              </Button>
            )}
            
            <IconButton
              aria-label="Open menu"
              icon={<Menu size={22} />}
              onClick={onOpen}
              display={{ base: 'flex', lg: 'none' }}
              variant="ghost"
              color={textColor}
              _hover={{ bg: hoverBg }}
              borderRadius="lg"
            />
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay bg="blackAlpha.300" />
        <DrawerContent
          bg="white"
          color="gray.800"
        >
          <DrawerCloseButton color="gray.600" />
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.200">
            <HStack>
              <Box bg="teal.500" borderRadius="lg" p={1.5}>
                <Briefcase size={20} color="white" />
              </Box>
              <Text fontWeight="700" color="gray.800">JobRasa</Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody pt={6}>
            <VStack spacing={2} align="stretch">
              {/* User info on mobile */}
              {user && (
                <Box 
                  p={4} 
                  bg="gray.50" 
                  borderRadius="lg" 
                  mb={2}
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <HStack>
                    <Avatar 
                      size="sm" 
                      name={profile?.full_name || user.email || 'User'} 
                      src={profile?.avatar_url || undefined}
                      bg="teal.500"
                    />
                    <VStack spacing={0} align="start">
                      <Text fontWeight="600" fontSize="sm">
                        {profile?.full_name || 'User'}
                      </Text>
                      <Text fontSize="xs" opacity={0.8}>
                        {user.email}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              )}
              
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <Button
                    key={item.id}
                    leftIcon={<Icon size={18} />}
                    onClick={() => handleNavClick(item.id as PageType)}
                    bg={isActive ? 'gray.100' : 'transparent'}
                    color={isActive ? 'teal.600' : 'gray.700'}
                    _hover={{ bg: 'gray.100' }}
                    justifyContent="flex-start"
                    fontWeight={isActive ? '600' : '500'}
                    borderRadius="lg"
                    py={5}
                  >
                    {item.label}
                  </Button>
                );
              })}
              
              {/* Mobile auth button */}
              {user ? (
                <>
                  <Button
                    leftIcon={<User size={18} />}
                    onClick={() => {
                      handleNavClick('profile');
                    }}
                    bg={currentPage === 'profile' ? 'gray.100' : 'transparent'}
                    color={currentPage === 'profile' ? 'teal.600' : 'gray.700'}
                    _hover={{ bg: 'gray.100' }}
                    justifyContent="flex-start"
                    fontWeight={currentPage === 'profile' ? '600' : '500'}
                    borderRadius="lg"
                    py={5}
                    mt={4}
                  >
                    My Profile
                  </Button>
                  <Button
                    leftIcon={<LogOut size={18} />}
                    onClick={async () => {
                      await signOut();
                      onClose();
                      navigate(ROUTES.home);
                    }}
                    bg="red.50"
                    color="red.500"
                    _hover={{ bg: 'red.100' }}
                    justifyContent="flex-start"
                    borderRadius="lg"
                    py={5}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  leftIcon={<LogIn size={18} />}
                  onClick={() => {
                    onClose();
                    navigate(ROUTES.auth);
                  }}
                  bg="teal.500"
                  color="white"
                  _hover={{ bg: 'teal.600' }}
                  justifyContent="flex-start"
                  borderRadius="lg"
                  py={5}
                  mt={4}
                >
                  Sign In
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box pt="80px" pb={8}>
        <Container maxW="7xl">
          {currentPage === 'home' && <HomePage onNavigate={handleNavClick} />}
          {currentPage === 'search' && <SearchPage />}
          {currentPage === 'recommendations' && (
            <ProtectedRoute onLoginClick={() => navigate(ROUTES.auth)}>
              <MLRecommendationsPage 
                onSaveInternship={handleSaveInternship}
                savedInternshipIds={savedInternshipIds}
              />
            </ProtectedRoute>
          )}
          {currentPage === 'saved' && (
            <ProtectedRoute onLoginClick={() => navigate(ROUTES.auth)}>
              <SavedPage />
            </ProtectedRoute>
          )}
          {currentPage === 'help' && <HelpPage />}
          {currentPage === 'profile' && (
            <ProfilePage onBack={() => navigate(ROUTES.home)} />
          )}
          {currentPage === 'admin' && (
            <AdminPage 
              weights={weights}
              onWeightsChange={setWeights}
            />
          )}
        </Container>
      </Box>

      {/* AI Chat Button */}
      {!isChatOpen && (
        <AIChatButton onClick={() => setIsChatOpen(true)} />
      )}

      {/* AI Chat Assistant */}
      <AIChatAssistant
        userProfile={userProfile}
        internships={mockInternships}
        recommendations={recommendations}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </Box>
  );
}

// HomePage Component
function HomePage({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  const [profileCompletion, setProfileCompletion] = React.useState<{ percentage: number; isComplete: boolean } | null>(null);

  // Check profile completion status
  React.useEffect(() => {
    const checkProfileCompletion = () => {
      const saved = localStorage.getItem('jobrasa-profile-completion');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setProfileCompletion(data);
        } catch (e) {
          console.error('Failed to parse profile completion');
        }
      }
    };
    
    checkProfileCompletion();
    
    // Check periodically for updates
    const interval = setInterval(checkProfileCompletion, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <VStack spacing={12} py={8}>
      {/* Profile Incomplete Notification */}
      {profileCompletion && !profileCompletion.isComplete && (
        <Box
          w="full"
          maxW="800px"
          mx="auto"
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          borderRadius="xl"
          px={6}
          py={4}
          boxShadow="0 4px 12px rgba(239, 68, 68, 0.1)"
        >
          <Flex align="center" justify="space-between" gap={4} flexWrap="wrap">
            <Flex align="center" gap={3}>
              <Box color="red.500" flexShrink={0}>
                <AlertCircle size={20} />
              </Box>
              <Text color="red.700" fontSize="sm" fontWeight="500">
                Your profile is only <Text as="span" fontWeight="bold">{profileCompletion.percentage}%</Text> complete. 
                Complete your profile to get better internship recommendations!
              </Text>
            </Flex>
            <Button
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={() => onNavigate('profile')}
              rightIcon={<ArrowRight size={16} />}
              _hover={{ bg: 'red.100' }}
            >
              Complete Profile
            </Button>
          </Flex>
        </Box>
      )}

      {/* Trusted Companies Logo Slider */}
      <Box w="full" mb={6}>
        <Text 
          textAlign="center" 
          fontSize="sm" 
          color="gray.500" 
          mb={4}
          textTransform="uppercase"
          letterSpacing="wider"
          fontWeight="600"
        >
          Trusted by top companies worldwide
        </Text>
        <Box
          sx={{
            position: 'relative',
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            '--fade-color': 'transparent',
          }}
        >
          <LogoSlider
            logos={companyLogos}
            speed={25}
            logoHeight={40}
            gap={80}
            direction="left"
            pauseOnHover={true}
            showFade={false}
            ariaLabel="Companies that trust JobRasa"
          />
        </Box>
      </Box>

      {/* Hero Section */}
      <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
        <Badge
          bg="teal.500"
          color="white"
          px={4}
          py={2}
          borderRadius="full"
          fontSize="sm"
          fontWeight="600"
          textTransform="none"
        >
          🚀 AI-Powered Internship Matching
        </Badge>
        <Heading
          as="h1"
          size={{ base: '2xl', md: '4xl' }}
          color="gray.800"
          fontWeight="800"
          lineHeight="1.1"
        >
          Find Your Perfect
          <Text as="span" color="teal.500"> Internship </Text>
          Match
        </Heading>
        <Text
          fontSize={{ base: 'lg', md: 'xl' }}
          color="gray.600"
          maxW="600px"
          lineHeight="1.7"
        >
          Discover opportunities that align with your skills, interests, and career goals.
          Let our AI find the perfect internship for you.
        </Text>
        <HStack spacing={4} pt={4}>
          <Button
            size="lg"
            bg="teal.500"
            color="white"
            _hover={{ bg: 'teal.600', transform: 'translateY(-2px)' }}
            rightIcon={<ArrowRight size={20} />}
            borderRadius="lg"
            px={8}
            fontWeight="600"
            boxShadow="0 4px 12px rgba(13, 148, 148, 0.3)"
            transition="all 0.2s"
            onClick={() => onNavigate('recommendations')}
          >
            Get Matched
          </Button>
          <Button
            size="lg"
            variant="outline"
            color="gray.700"
            borderColor="gray.300"
            _hover={{ bg: 'gray.50', transform: 'translateY(-2px)' }}
            rightIcon={<Search size={20} />}
            borderRadius="lg"
            px={8}
            fontWeight="600"
            transition="all 0.2s"
            onClick={() => onNavigate('search')}
          >
            Browse All
          </Button>
        </HStack>
      </VStack>

      {/* Hero Image Carousel */}
      <Box 
        position="absolute"
        left="0"
        right="0"
        w="100vw"
        maxW="100vw"
        overflow="hidden" 
        boxShadow="xl"
        sx={{
          position: 'relative',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
        }}
      >
        <Carousel
          images={heroCarouselImages}
          autoplay={true}
          interval={5000}
          pauseOnHover={true}
          showDots={true}
          showArrows={true}
          loop={true}
          transitionType="fade"
          height={700}
        />
      </Box>

      {/* Feature Cards */}
      <Flex
        wrap="wrap"
        gap={6}
        justify="center"
        w="full"
        maxW="1200px"
        mx="auto"
      >
        <FeatureCard
          icon={<Target size={32} />}
          title="Smart Matching"
          description="Our AI analyzes your profile to find internships that truly fit your career aspirations."
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
        <FeatureCard
          icon={<Zap size={32} />}
          title="Quick Apply"
          description="Apply to multiple internships with one click. Save time and focus on what matters."
          gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        />
        <FeatureCard
          icon={<Users size={32} />}
          title="Top Companies"
          description="Connect with leading companies looking for talented interns like you."
          gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        />
        <FeatureCard
          icon={<TrendingUp size={32} />}
          title="Career Growth"
          description="Track your applications and get insights to boost your internship success."
          gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
        />
      </Flex>

      {/* Stats Section */}
      <Flex
        bg="gray.50"
        borderRadius="2xl"
        p={{ base: 6, md: 10 }}
        gap={{ base: 6, md: 12 }}
        wrap="wrap"
        justify="center"
        border="1px solid"
        borderColor="gray.200"
      >
        <StatItem value="10,000+" label="Internships" />
        <StatItem value="500+" label="Companies" />
        <StatItem value="95%" label="Match Rate" />
        <StatItem value="50,000+" label="Students Placed" />
      </Flex>
    </VStack>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      p={6}
      w={{ base: 'full', sm: '280px' }}
      border="1px solid"
      borderColor="gray.200"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)', borderColor: 'teal.300' }}
      cursor="pointer"
    >
      <Box
        bg={gradient}
        borderRadius="lg"
        p={3}
        w="fit-content"
        color="white"
        mb={4}
      >
        {icon}
      </Box>
      <Heading size="md" color="gray.800" mb={2} fontWeight="600">
        {title}
      </Heading>
      <Text color="gray.600" fontSize="sm" lineHeight="1.6">
        {description}
      </Text>
    </Box>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <VStack spacing={1}>
      <Text
        fontSize={{ base: '2xl', md: '4xl' }}
        fontWeight="800"
        color="teal.600"
      >
        {value}
      </Text>
      <Text color="gray.600" fontWeight="500" fontSize="sm">
        {label}
      </Text>
    </VStack>
  );
}

// Internship Card Component for Chakra UI
interface InternshipData {
  id: string;
  title: string;
  organization: string;
  location: string;
  isRemote: boolean;
  stipend?: string;
  isBeginner: boolean;
  duration?: string;
  postedDate?: string;
  description?: string;
  skillMatch?: number;
}

const sampleInternshipsLocal: InternshipData[] = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    organization: 'TechGov Solutions',
    location: 'Washington, DC',
    isRemote: false,
    stipend: '$1,500/month',
    isBeginner: true,
    duration: '3 months',
    postedDate: '2 days ago',
    description: 'Build digital tools that serve millions of citizens.',
    skillMatch: 4,
  },
  {
    id: '2',
    title: 'Data Analysis Intern',
    organization: 'Department of Education',
    location: 'Remote',
    isRemote: true,
    stipend: '$1,200/month',
    isBeginner: true,
    duration: '4 months',
    postedDate: '1 week ago',
    description: 'Analyze educational data to improve student outcomes.',
    skillMatch: 3,
  },
  {
    id: '3',
    title: 'UX Research Intern',
    organization: 'Digital Services Agency',
    location: 'San Francisco, CA',
    isRemote: false,
    stipend: '$1,800/month',
    isBeginner: true,
    duration: '3 months',
    postedDate: '3 days ago',
    description: 'Research user interactions with government websites.',
    skillMatch: 5,
  },
  {
    id: '4',
    title: 'Product Management Intern',
    organization: 'Innovation Labs',
    location: 'New York, NY',
    isRemote: false,
    stipend: '$2,000/month',
    isBeginner: false,
    duration: '6 months',
    postedDate: '5 days ago',
    description: 'Drive product strategy for cutting-edge solutions.',
    skillMatch: 4,
  },
];

function InternshipCardChakra({
  internship,
  isSaved = false,
  onSave,
  onApply,
  onViewDetails,
}: {
  internship: InternshipData | ScoredInternship;
  isSaved?: boolean;
  onSave?: (id: string) => void;
  onApply?: (id: string) => void;
  onViewDetails?: (internship: InternshipData | ScoredInternship) => void;
}) {
  return (
    <Box
      bg="rgba(255, 255, 255, 0.12)"
      backdropFilter="blur(20px)"
      borderRadius="2xl"
      p={6}
      border="1px solid rgba(255, 255, 255, 0.2)"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
    >
      <Flex justify="space-between" align="start" mb={3}>
        <Box flex={1}>
          <Heading size="md" color="white" mb={1} fontWeight="700">
            {internship.title}
          </Heading>
          <Text color="whiteAlpha.800" fontSize="sm" fontWeight="500">
            {internship.organization}
          </Text>
        </Box>
        <IconButton
          aria-label={isSaved ? 'Unsave' : 'Save'}
          icon={<Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />}
          variant="ghost"
          color={isSaved ? 'red.300' : 'white'}
          _hover={{ bg: 'whiteAlpha.200' }}
          onClick={() => onSave?.(internship.id)}
          size="sm"
        />
      </Flex>

      <Text color="whiteAlpha.700" fontSize="sm" mb={4} noOfLines={2}>
        {internship.description}
      </Text>

      <Flex wrap="wrap" gap={2} mb={4}>
        {internship.isBeginner && (
          <Badge bg="green.500" color="white" px={2} py={1} borderRadius="full" fontSize="xs">
            Beginner Friendly
          </Badge>
        )}
        {internship.isRemote && (
          <Badge bg="blue.500" color="white" px={2} py={1} borderRadius="full" fontSize="xs">
            Remote
          </Badge>
        )}
        {internship.stipend && (
          <Badge bg="accent.500" color="white" px={2} py={1} borderRadius="full" fontSize="xs">
            {internship.stipend}
          </Badge>
        )}
        {'skillMatch' in internship && internship.skillMatch && (
          <Badge bg="purple.500" color="white" px={2} py={1} borderRadius="full" fontSize="xs">
            {internship.skillMatch}/5 Match
          </Badge>
        )}
        {'matchScore' in internship && (
          <Badge bg="green.500" color="white" px={2} py={1} borderRadius="full" fontSize="xs">
            {(internship as ScoredInternship).matchScore}% AI Match
          </Badge>
        )}
      </Flex>

      <Flex align="center" gap={4} mb={4} color="whiteAlpha.700" fontSize="xs">
        <HStack spacing={1}>
          <MapPin size={14} />
          <Text>{internship.location}</Text>
        </HStack>
        {internship.duration && (
          <HStack spacing={1}>
            <Clock size={14} />
            <Text>{internship.duration}</Text>
          </HStack>
        )}
      </Flex>

      <Flex gap={3}>
        <Button
          size="sm"
          bg="white"
          color="brand.600"
          _hover={{ bg: 'whiteAlpha.900' }}
          borderRadius="full"
          fontWeight="600"
          flex={1}
          onClick={() => onApply?.(internship.id)}
        >
          Apply Now
        </Button>
        <Button
          size="sm"
          variant="outline"
          color="white"
          borderColor="whiteAlpha.400"
          _hover={{ bg: 'whiteAlpha.200' }}
          borderRadius="full"
          fontWeight="500"
          onClick={() => onViewDetails?.(internship)}
        >
          Details
        </Button>
      </Flex>
    </Box>
  );
}

// Define SkillMatchInfo interface for ML match display
interface SkillMatchInfo {
  matchedSkills: string[];
  missingSkills: string[];
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  keywordScore: number;
}

// Internship Detail Drawer Component
function InternshipDetailDrawer({
  internship,
  isOpen,
  onClose,
  isSaved,
  onSave,
  matchInfo,
}: {
  internship: InternshipData | ScoredInternship | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onSave?: (id: string) => void;
  matchInfo?: SkillMatchInfo | null;
}) {
  if (!internship) return null;

  // Find the full internship data from mockInternships
  const fullInternship = mockInternships.find(i => i.id === internship.id);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
      <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <DrawerContent bg="gray.900" color="white">
        <DrawerCloseButton color="white" />
        <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">
          <VStack align="start" spacing={1}>
            <Heading size="lg">{internship.title}</Heading>
            <Text color="whiteAlpha.800" fontSize="md" fontWeight="normal">
              {internship.organization}
            </Text>
          </VStack>
        </DrawerHeader>

        <DrawerBody py={6}>
          <VStack spacing={6} align="stretch">
            {/* Badges */}
            <Flex wrap="wrap" gap={2}>
              {internship.isBeginner && (
                <Badge bg="green.500" color="white" px={3} py={1} borderRadius="full">
                  ✓ Beginner Friendly
                </Badge>
              )}
              {internship.isRemote && (
                <Badge bg="blue.500" color="white" px={3} py={1} borderRadius="full">
                  🏠 Remote
                </Badge>
              )}
              {internship.stipend && (
                <Badge bg="accent.500" color="white" px={3} py={1} borderRadius="full">
                  💰 {internship.stipend}
                </Badge>
              )}
              {'matchScore' in internship && (
                <Badge bg="purple.500" color="white" px={3} py={1} borderRadius="full">
                  🎯 {(internship as ScoredInternship).matchScore}% AI Match
                </Badge>
              )}
            </Flex>

            {/* ML Match Analysis Section */}
            {matchInfo && (
              <Box bg="linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)" 
                   p={5} borderRadius="xl" border="1px solid" borderColor="purple.500">
                <HStack mb={4}>
                  <Sparkles size={20} color="#a855f7" />
                  <Heading size="sm" color="purple.300">
                    AI Match Analysis ({matchInfo.overallScore}% Match)
                  </Heading>
                </HStack>
                
                {/* Score Breakdown */}
                <Flex gap={3} mb={4} wrap="wrap">
                  <Box textAlign="center" p={3} bg="whiteAlpha.100" borderRadius="lg" flex="1" minW="80px">
                    <Text fontSize="xl" fontWeight="bold" color="purple.300">{matchInfo.skillScore}%</Text>
                    <Text fontSize="xs" color="whiteAlpha.700">Skills</Text>
                  </Box>
                  <Box textAlign="center" p={3} bg="whiteAlpha.100" borderRadius="lg" flex="1" minW="80px">
                    <Text fontSize="xl" fontWeight="bold" color="blue.300">{matchInfo.experienceScore}%</Text>
                    <Text fontSize="xs" color="whiteAlpha.700">Experience</Text>
                  </Box>
                  <Box textAlign="center" p={3} bg="whiteAlpha.100" borderRadius="lg" flex="1" minW="80px">
                    <Text fontSize="xl" fontWeight="bold" color="teal.300">{matchInfo.keywordScore}%</Text>
                    <Text fontSize="xs" color="whiteAlpha.700">Keywords</Text>
                  </Box>
                </Flex>
                
                {/* Matched Skills */}
                {matchInfo.matchedSkills.length > 0 && (
                  <Box mb={4}>
                    <HStack mb={2}>
                      <Box color="green.400">✓</Box>
                      <Text fontSize="sm" fontWeight="600" color="green.300">
                        Skills You Have ({matchInfo.matchedSkills.length})
                      </Text>
                    </HStack>
                    <Flex wrap="wrap" gap={2}>
                      {matchInfo.matchedSkills.map((skill, index) => (
                        <Badge key={index} bg="green.600" color="white" px={2} py={1} borderRadius="full" fontSize="xs">
                          ✓ {skill}
                        </Badge>
                      ))}
                    </Flex>
                  </Box>
                )}
                
                {/* Missing Skills */}
                {matchInfo.missingSkills.length > 0 && (
                  <Box>
                    <HStack mb={2}>
                      <Box color="orange.400">○</Box>
                      <Text fontSize="sm" fontWeight="600" color="orange.300">
                        Skills to Develop ({matchInfo.missingSkills.length})
                      </Text>
                    </HStack>
                    <Flex wrap="wrap" gap={2}>
                      {matchInfo.missingSkills.map((skill, index) => (
                        <Badge key={index} bg="orange.600" color="white" px={2} py={1} borderRadius="full" fontSize="xs">
                          ○ {skill}
                        </Badge>
                      ))}
                    </Flex>
                  </Box>
                )}
              </Box>
            )}

            {/* Location & Duration */}
            <Box bg="whiteAlpha.100" p={4} borderRadius="xl">
              <HStack spacing={6} wrap="wrap">
                <HStack>
                  <MapPin size={18} />
                  <Text>{internship.location}</Text>
                </HStack>
                {internship.duration && (
                  <HStack>
                    <Clock size={18} />
                    <Text>{internship.duration}</Text>
                  </HStack>
                )}
                {fullInternship?.workSchedule && (
                  <HStack>
                    <Briefcase size={18} />
                    <Text>{fullInternship.workSchedule}</Text>
                  </HStack>
                )}
              </HStack>
            </Box>

            {/* About the Internship */}
            <Box>
              <Heading size="sm" mb={3} color="accent.300">About This Internship</Heading>
              <Text color="whiteAlpha.900" lineHeight="1.7">
                {internship.description}
              </Text>
            </Box>

            {/* About Company */}
            {fullInternship?.aboutCompany && (
              <Box bg="whiteAlpha.50" p={4} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.200">
                <Heading size="sm" mb={3} color="blue.300">
                  🏢 About {internship.organization}
                </Heading>
                <Text color="whiteAlpha.800" lineHeight="1.7">
                  {fullInternship.aboutCompany}
                </Text>
              </Box>
            )}

            {/* Responsibilities */}
            {fullInternship?.responsibilities && fullInternship.responsibilities.length > 0 && (
              <Box>
                <Heading size="sm" mb={3} color="accent.300">What You'll Do</Heading>
                <VStack align="start" spacing={2}>
                  {fullInternship.responsibilities.map((item, index) => (
                    <HStack key={index} align="start">
                      <Badge bg="accent.500" color="white" minW="24px" textAlign="center" borderRadius="full">
                        {index + 1}
                      </Badge>
                      <Text color="whiteAlpha.900">{item}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}

            {/* What You'll Learn */}
            {fullInternship?.whatYoullLearn && fullInternship.whatYoullLearn.length > 0 && (
              <Box>
                <Heading size="sm" mb={3} color="green.300">🎓 What You'll Learn</Heading>
                <VStack align="start" spacing={2}>
                  {fullInternship.whatYoullLearn.map((item, index) => (
                    <HStack key={index} align="start">
                      <Text color="green.400">✓</Text>
                      <Text color="whiteAlpha.900">{item}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Skills You'll Gain */}
            {fullInternship?.skillsYoullGain && fullInternship.skillsYoullGain.length > 0 && (
              <Box>
                <Heading size="sm" mb={3} color="purple.300">⭐ Skills You'll Gain</Heading>
                <Flex wrap="wrap" gap={2}>
                  {fullInternship.skillsYoullGain.map((skill, index) => (
                    <Badge key={index} bg="purple.600" color="white" px={3} py={1} borderRadius="full">
                      {skill}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            )}

            {/* Project Examples */}
            {fullInternship?.projectExamples && fullInternship.projectExamples.length > 0 && (
              <Box>
                <Heading size="sm" mb={3} color="cyan.300">💼 Example Projects</Heading>
                <VStack align="start" spacing={2}>
                  {fullInternship.projectExamples.map((project, index) => (
                    <HStack key={index} align="start">
                      <Text color="cyan.400">→</Text>
                      <Text color="whiteAlpha.900">{project}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Requirements */}
            {fullInternship?.requirements && fullInternship.requirements.length > 0 && (
              <Box>
                <Heading size="sm" mb={3} color="accent.300">What We're Looking For</Heading>
                <VStack align="start" spacing={2}>
                  {fullInternship.requirements.map((item, index) => (
                    <HStack key={index} align="start">
                      <Text color="accent.400">•</Text>
                      <Text color="whiteAlpha.900">{item}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Benefits */}
            {fullInternship?.benefits && fullInternship.benefits.length > 0 && (
              <Box bg="green.900" bg-opacity="50" p={4} borderRadius="xl" border="1px solid" borderColor="green.600">
                <Heading size="sm" mb={3} color="green.300">🎁 Benefits & Perks</Heading>
                <VStack align="start" spacing={2}>
                  {fullInternship.benefits.map((benefit, index) => (
                    <HStack key={index} align="start">
                      <Text color="green.400">★</Text>
                      <Text color="whiteAlpha.900">{benefit}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Additional Details */}
            <Flex wrap="wrap" gap={4}>
              {fullInternship?.teamSize && (
                <Box bg="whiteAlpha.100" p={3} borderRadius="lg" flex="1" minW="140px">
                  <Text fontSize="xs" color="whiteAlpha.600" mb={1}>Team Size</Text>
                  <HStack>
                    <Users size={16} />
                    <Text fontWeight="500">{fullInternship.teamSize}</Text>
                  </HStack>
                </Box>
              )}
              {fullInternship?.applicationDeadline && (
                <Box bg="whiteAlpha.100" p={3} borderRadius="lg" flex="1" minW="140px">
                  <Text fontSize="xs" color="whiteAlpha.600" mb={1}>Application Deadline</Text>
                  <HStack>
                    <Clock size={16} />
                    <Text fontWeight="500">{fullInternship.applicationDeadline}</Text>
                  </HStack>
                </Box>
              )}
              {fullInternship?.mentorship && (
                <Box bg="whiteAlpha.100" p={3} borderRadius="lg" flex="1" minW="140px">
                  <Text fontSize="xs" color="whiteAlpha.600" mb={1}>Mentorship</Text>
                  <HStack>
                    <Sparkles size={16} />
                    <Text fontWeight="500">{fullInternship.mentorship}</Text>
                  </HStack>
                </Box>
              )}
            </Flex>

            {/* Keywords */}
            {fullInternship?.keywords && fullInternship.keywords.length > 0 && (
              <Box>
                <Heading size="sm" mb={3} color="whiteAlpha.700">Related Skills & Technologies</Heading>
                <Flex wrap="wrap" gap={2}>
                  {fullInternship.keywords.map((keyword, index) => (
                    <Badge key={index} bg="whiteAlpha.200" color="whiteAlpha.900" px={2} py={1} borderRadius="md" fontSize="xs">
                      {keyword}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            )}

            {/* Action Buttons */}
            <Flex gap={4} pt={4} borderTop="1px solid" borderColor="whiteAlpha.200">
              <Button
                flex={1}
                bg="accent.500"
                color="white"
                _hover={{ bg: 'accent.600' }}
                size="lg"
                borderRadius="full"
                leftIcon={<ArrowRight size={20} />}
                onClick={() => window.open(fullInternship?.applyUrl || '#', '_blank')}
              >
                Apply Now
              </Button>
              <Button
                variant="outline"
                color="white"
                borderColor="whiteAlpha.400"
                _hover={{ bg: 'whiteAlpha.200' }}
                size="lg"
                borderRadius="full"
                leftIcon={<Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />}
                onClick={() => onSave?.(internship.id)}
              >
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </Flex>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

// Search Page
function SearchPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [savedIds, setSavedIds] = React.useState<string[]>([]);
  const [selectedInternship, setSelectedInternship] = React.useState<InternshipData | ScoredInternship | null>(null);
  const [selectedMatchInfo, setSelectedMatchInfo] = React.useState<SkillMatchInfo | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Get ML context for matching
  const { resumeAnalysis, getQuickMatch } = useMLRecommendations();

  const filteredInternships = mockInternships.filter(
    (i) =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleViewDetails = (internship: InternshipData | ScoredInternship) => {
    setSelectedInternship(internship);
    
    // Get ML match if resume is available
    if (resumeAnalysis) {
      const fullInternship = mockInternships.find(i => i.id === internship.id);
      if (fullInternship) {
        const match = getQuickMatch(fullInternship);
        if (match) {
          setSelectedMatchInfo({
            matchedSkills: match.explanation.matchedSkills,
            missingSkills: match.explanation.missingSkills,
            overallScore: match.score.overall,
            skillScore: match.score.skillMatch,
            experienceScore: match.score.experienceMatch,
            keywordScore: match.score.keywordMatch
          });
        } else {
          setSelectedMatchInfo(null);
        }
      }
    } else {
      setSelectedMatchInfo(null);
    }
    
    onOpen();
  };

  return (
    <VStack spacing={6} py={4}>
      {/* Search Header */}
      <Box
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(20px)"
        borderRadius="2xl"
        p={6}
        w="full"
        border="1px solid rgba(255, 255, 255, 0.2)"
      >
        <Heading color="white" size="lg" mb={4}>
          <Search size={24} style={{ display: 'inline', marginRight: '12px' }} />
          Search Internships
        </Heading>
        <Flex gap={4} wrap="wrap">
          <Box
            as="input"
            flex={1}
            minW="250px"
            bg="whiteAlpha.200"
            border="1px solid"
            borderColor="whiteAlpha.300"
            borderRadius="xl"
            px={4}
            py={3}
            color="white"
            placeholder="Search by title, company..."
            _placeholder={{ color: 'whiteAlpha.600' }}
            _focus={{ outline: 'none', borderColor: 'accent.400', bg: 'whiteAlpha.300' }}
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
          <Button
            bg="accent.500"
            color="white"
            _hover={{ bg: 'accent.600' }}
            borderRadius="xl"
            px={8}
            leftIcon={<Filter size={18} />}
          >
            Filters
          </Button>
        </Flex>
        <Flex gap={2} mt={4} wrap="wrap">
          <Badge bg="whiteAlpha.200" color="white" px={3} py={1} borderRadius="full" cursor="pointer" _hover={{ bg: 'whiteAlpha.300' }}>
            Remote Only
          </Badge>
          <Badge bg="whiteAlpha.200" color="white" px={3} py={1} borderRadius="full" cursor="pointer" _hover={{ bg: 'whiteAlpha.300' }}>
            Beginner Friendly
          </Badge>
          <Badge bg="whiteAlpha.200" color="white" px={3} py={1} borderRadius="full" cursor="pointer" _hover={{ bg: 'whiteAlpha.300' }}>
            Paid Only
          </Badge>
          <Badge bg="whiteAlpha.200" color="white" px={3} py={1} borderRadius="full" cursor="pointer" _hover={{ bg: 'whiteAlpha.300' }}>
            Tech
          </Badge>
        </Flex>
      </Box>

      {/* Results */}
      <Text color="whiteAlpha.800" alignSelf="start" fontWeight="500">
        Showing {filteredInternships.length} internships
      </Text>

      <Flex wrap="wrap" gap={6} w="full">
        {filteredInternships.map((internship) => (
          <Box key={internship.id} flex={{ base: '1 1 100%', md: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.33% - 16px)' }} minW="280px">
            <InternshipCardChakra
              internship={internship}
              isSaved={savedIds.includes(internship.id)}
              onSave={handleSave}
              onViewDetails={handleViewDetails}
            />
          </Box>
        ))}
      </Flex>

      {/* Internship Detail Drawer */}
      <InternshipDetailDrawer
        internship={selectedInternship}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedMatchInfo(null);
        }}
        isSaved={selectedInternship ? savedIds.includes(selectedInternship.id) : false}
        onSave={handleSave}
        matchInfo={selectedMatchInfo}
      />
    </VStack>
  );
}

// Recommendations Page - Powered by ML Engine
interface RecommendationsPageInlineProps {
  userProfile?: OnboardingData | null;
  weights?: RecommendationWeights;
  savedInternshipIds?: string[];
  onSaveInternship?: (id: string) => void;
}

function RecommendationsPage({ 
  userProfile = null, 
  weights = { skill: 40, interest: 35, location: 25 },
  savedInternshipIds = [],
  onSaveInternship
}: RecommendationsPageInlineProps = {}) {
  const [savedIds, setSavedIds] = React.useState<string[]>(savedInternshipIds);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [selectedInternship, setSelectedInternship] = React.useState<InternshipData | ScoredInternship | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    onSaveInternship?.(id);
  };

  const handleViewDetails = (internship: InternshipData | ScoredInternship) => {
    setSelectedInternship(internship);
    onOpen();
  };

  // Use ML-based recommendations
  const recommendations = React.useMemo(() => {
    return getRecommendations(mockInternships, userProfile, weights);
  }, [userProfile, weights]);

  // Calculate average match score
  const avgMatchScore = React.useMemo(() => {
    if (recommendations.length === 0) return 0;
    const sum = recommendations.reduce((acc, r) => acc + r.matchScore, 0);
    return Math.round(sum / recommendations.length);
  }, [recommendations]);

  return (
    <VStack spacing={6} py={4}>
      {/* Header with AI Badge */}
      <Box
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(20px)"
        borderRadius="2xl"
        p={6}
        w="full"
        border="1px solid rgba(255, 255, 255, 0.2)"
      >
        <HStack mb={2} justify="space-between" wrap="wrap">
          <HStack>
            <Box bg="accent.500" p={2} borderRadius="lg">
              <Sparkles size={24} color="white" />
            </Box>
            <Heading color="white" size="lg">AI-Powered Recommendations</Heading>
            <Badge bg="green.500" color="white" ml={2}>
              ML Matched
            </Badge>
          </HStack>
          <Badge bg="whiteAlpha.200" color="white" fontSize="md" px={3} py={1}>
            Avg Score: {avgMatchScore}%
          </Badge>
        </HStack>
        <Text color="whiteAlpha.800" mb={4}>
          {userProfile 
            ? `Based on your skills: ${userProfile.skills.slice(0, 3).join(', ')}${userProfile.skills.length > 3 ? '...' : ''}`
            : 'Complete your profile for personalized AI recommendations'}
        </Text>
        
        {/* Algorithm Explanation Toggle */}
        <Button
          size="sm"
          variant="ghost"
          color="white"
          _hover={{ bg: 'whiteAlpha.200' }}
          onClick={() => setShowExplanation(!showExplanation)}
        >
          {showExplanation ? 'Hide' : 'Show'} How AI Matches Work
        </Button>
        
        {showExplanation && (
          <Box mt={4} p={4} bg="whiteAlpha.100" borderRadius="xl">
            <Text color="white" fontWeight="600" mb={3}>Our Hybrid AI uses:</Text>
            <HStack spacing={4} wrap="wrap">
              <Box textAlign="center" p={3} bg="whiteAlpha.100" borderRadius="lg" minW="100px">
                <Text color="accent.300" fontSize="2xl" fontWeight="bold">{weights.skill}%</Text>
                <Text color="whiteAlpha.800" fontSize="sm">Skills Match</Text>
              </Box>
              <Box textAlign="center" p={3} bg="whiteAlpha.100" borderRadius="lg" minW="100px">
                <Text color="green.300" fontSize="2xl" fontWeight="bold">{weights.interest}%</Text>
                <Text color="whiteAlpha.800" fontSize="sm">Interest Match</Text>
              </Box>
              <Box textAlign="center" p={3} bg="whiteAlpha.100" borderRadius="lg" minW="100px">
                <Text color="blue.300" fontSize="2xl" fontWeight="bold">{weights.location}%</Text>
                <Text color="whiteAlpha.800" fontSize="sm">Location</Text>
              </Box>
            </HStack>
            <Text color="whiteAlpha.700" fontSize="sm" mt={3}>
              💡 Chat with our AI assistant (bottom right) for personalized advice!
            </Text>
          </Box>
        )}
      </Box>

      {/* Top Match */}
      {recommendations[0] && (
        <Box w="full">
          <HStack mb={3}>
            <Text color="accent.300" fontWeight="700" fontSize="sm" textTransform="uppercase" letterSpacing="wide">
              ⭐ Best Match ({recommendations[0].matchScore}% match)
            </Text>
          </HStack>
          <Box
            bg="linear-gradient(135deg, rgba(255,149,0,0.2) 0%, rgba(10,118,118,0.2) 100%)"
            backdropFilter="blur(20px)"
            borderRadius="2xl"
            p={6}
            border="2px solid rgba(255, 149, 0, 0.4)"
            position="relative"
          >
            {/* Score Breakdown */}
            <HStack position="absolute" top={4} right={4} spacing={2}>
              <Badge bg="brand.500" color="white" fontSize="xs">
                Skills: {recommendations[0].scoreBreakdown.skillScore}%
              </Badge>
              <Badge bg="green.500" color="white" fontSize="xs">
                Interest: {recommendations[0].scoreBreakdown.interestScore}%
              </Badge>
              <Badge bg="blue.500" color="white" fontSize="xs">
                Location: {recommendations[0].scoreBreakdown.locationScore}%
              </Badge>
            </HStack>
            
            <InternshipCardChakra
              internship={recommendations[0]}
              isSaved={savedIds.includes(recommendations[0].id)}
              onSave={handleSave}
              onViewDetails={handleViewDetails}
            />
            
            {/* Match Reasons */}
            {recommendations[0].matchReasons.length > 0 && (
              <HStack mt={4} wrap="wrap" gap={2}>
                {recommendations[0].matchReasons.map((reason, idx) => (
                  <Badge key={idx} bg="whiteAlpha.200" color="white" fontSize="xs">
                    ✨ {reason}
                  </Badge>
                ))}
              </HStack>
            )}
          </Box>
        </Box>
      )}

      {/* Other Recommendations */}
      <Text color="whiteAlpha.700" alignSelf="start" fontWeight="600" mt={4}>
        More AI-Ranked Matches
      </Text>
      <Flex wrap="wrap" gap={6} w="full">
        {recommendations.slice(1).map((internship) => (
          <Box key={internship.id} flex={{ base: '1 1 100%', md: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.33% - 16px)' }} minW="280px" position="relative">
            {/* Match Score Badge */}
            <Badge 
              position="absolute" 
              top={-2} 
              left={-2} 
              zIndex={1}
              bg={internship.matchScore >= 70 ? 'green.500' : internship.matchScore >= 50 ? 'brand.500' : 'gray.500'}
              color="white"
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="full"
            >
              {internship.matchScore}% match
            </Badge>
            <InternshipCardChakra
              internship={internship}
              isSaved={savedIds.includes(internship.id)}
              onSave={handleSave}
              onViewDetails={handleViewDetails}
            />
          </Box>
        ))}
      </Flex>

      {/* Internship Detail Drawer */}
      <InternshipDetailDrawer
        internship={selectedInternship}
        isOpen={isOpen}
        onClose={onClose}
        isSaved={selectedInternship ? savedIds.includes(selectedInternship.id) : false}
        onSave={handleSave}
      />
    </VStack>
  );
}

// Saved Page
function SavedPage() {
  const [savedInternships, setSavedInternships] = React.useState<InternshipData[]>(mockInternships.slice(0, 2));
  const [selectedInternship, setSelectedInternship] = React.useState<InternshipData | ScoredInternship | null>(null);
  const [selectedMatchInfo, setSelectedMatchInfo] = React.useState<SkillMatchInfo | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Get ML context for matching
  const { resumeAnalysis, getQuickMatch } = useMLRecommendations();

  const handleRemove = (id: string) => {
    setSavedInternships((prev) => prev.filter((i) => i.id !== id));
  };

  const handleViewDetails = (internship: InternshipData | ScoredInternship) => {
    setSelectedInternship(internship);
    
    // Get ML match if resume is available
    if (resumeAnalysis) {
      const fullInternship = mockInternships.find(i => i.id === internship.id);
      if (fullInternship) {
        const match = getQuickMatch(fullInternship);
        if (match) {
          setSelectedMatchInfo({
            matchedSkills: match.explanation.matchedSkills,
            missingSkills: match.explanation.missingSkills,
            overallScore: match.score.overall,
            skillScore: match.score.skillMatch,
            experienceScore: match.score.experienceMatch,
            keywordScore: match.score.keywordMatch
          });
        } else {
          setSelectedMatchInfo(null);
        }
      }
    } else {
      setSelectedMatchInfo(null);
    }
    
    onOpen();
  };

  return (
    <VStack spacing={6} py={4}>
      {/* Header */}
      <Box
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(20px)"
        borderRadius="2xl"
        p={6}
        w="full"
        border="1px solid rgba(255, 255, 255, 0.2)"
      >
        <HStack mb={2}>
          <Box bg="red.400" p={2} borderRadius="lg">
            <Heart size={24} color="white" />
          </Box>
          <Heading color="white" size="lg">Saved Internships</Heading>
          <Badge bg="whiteAlpha.200" color="white" ml={2}>
            {savedInternships.length}
          </Badge>
        </HStack>
        <Text color="whiteAlpha.800">
          Internships you've saved for later. Don't wait too long to apply!
        </Text>
      </Box>

      {savedInternships.length === 0 ? (
        <Box
          bg="rgba(255, 255, 255, 0.08)"
          backdropFilter="blur(20px)"
          borderRadius="2xl"
          p={12}
          w="full"
          textAlign="center"
          border="1px solid rgba(255, 255, 255, 0.1)"
        >
          <Bookmark size={64} color="rgba(255,255,255,0.3)" style={{ margin: '0 auto 16px' }} />
          <Heading color="whiteAlpha.700" size="md" mb={2}>No saved internships yet</Heading>
          <Text color="whiteAlpha.600">
            Browse internships and save the ones you're interested in.
          </Text>
        </Box>
      ) : (
        <Flex wrap="wrap" gap={6} w="full">
          {savedInternships.map((internship) => (
            <Box key={internship.id} flex={{ base: '1 1 100%', md: '1 1 calc(50% - 12px)' }} minW="280px">
              <InternshipCardChakra
                internship={internship}
                isSaved={true}
                onSave={handleRemove}
                onViewDetails={handleViewDetails}
              />
            </Box>
          ))}
        </Flex>
      )}

      {/* Internship Detail Drawer */}
      <InternshipDetailDrawer
        internship={selectedInternship}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedMatchInfo(null);
        }}
        isSaved={selectedInternship ? savedInternships.some(i => i.id === selectedInternship.id) : false}
        onSave={handleRemove}
        matchInfo={selectedMatchInfo}
      />
    </VStack>
  );
}

// Help Page
function HelpPage() {
  const faqs = [
    { q: 'How do I apply for an internship?', a: 'Click the "Apply Now" button on any internship card. You\'ll be redirected to the application page where you can submit your details.' },
    { q: 'How does the matching algorithm work?', a: 'Our AI analyzes your profile, skills, and preferences to find internships that best match your career goals. The more you use JobRasa, the better your recommendations become.' },
    { q: 'Are all internships verified?', a: 'Yes! We verify all employers and internship postings before they appear on JobRasa. Look for the "Verified" badge for extra assurance.' },
    { q: 'How do I save an internship?', a: 'Click the heart icon on any internship card to save it. View all saved internships in the "Saved" section.' },
  ];

  return (
    <VStack spacing={6} py={4}>
      {/* Header */}
      <Box
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(20px)"
        borderRadius="2xl"
        p={6}
        w="full"
        border="1px solid rgba(255, 255, 255, 0.2)"
      >
        <HStack mb={2}>
          <Box bg="blue.500" p={2} borderRadius="lg">
            <HelpCircle size={24} color="white" />
          </Box>
          <Heading color="white" size="lg">Help & Support</Heading>
        </HStack>
        <Text color="whiteAlpha.800">
          Find answers to common questions or reach out to our support team.
        </Text>
      </Box>

      {/* FAQs */}
      <VStack spacing={4} w="full" align="stretch">
        <Text color="whiteAlpha.700" fontWeight="700" textTransform="uppercase" letterSpacing="wide" fontSize="sm">
          Frequently Asked Questions
        </Text>
        {faqs.map((faq, idx) => (
          <Box
            key={idx}
            bg="rgba(255, 255, 255, 0.08)"
            backdropFilter="blur(20px)"
            borderRadius="xl"
            p={5}
            border="1px solid rgba(255, 255, 255, 0.15)"
          >
            <Text color="white" fontWeight="700" mb={2}>{faq.q}</Text>
            <Text color="whiteAlpha.800" fontSize="sm">{faq.a}</Text>
          </Box>
        ))}
      </VStack>

      {/* Contact */}
      <Box
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(20px)"
        borderRadius="2xl"
        p={6}
        w="full"
        border="1px solid rgba(255, 255, 255, 0.2)"
      >
        <Heading color="white" size="md" mb={4}>Still need help?</Heading>
        <Flex gap={4} wrap="wrap">
          <Button
            bg="white"
            color="brand.600"
            _hover={{ bg: 'whiteAlpha.900' }}
            borderRadius="full"
            leftIcon={<Mail size={18} />}
          >
            Email Support
          </Button>
          <Button
            variant="outline"
            color="white"
            borderColor="whiteAlpha.400"
            _hover={{ bg: 'whiteAlpha.200' }}
            borderRadius="full"
            leftIcon={<MessageCircle size={18} />}
          >
            Live Chat
          </Button>
        </Flex>
      </Box>
    </VStack>
  );
}

export default App;
