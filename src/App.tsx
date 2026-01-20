import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { AnimatedBackground } from './components/AnimatedBackground';
import { AIChatAssistant, AIChatButton } from './components/AIChatAssistant';
import { AuthModal, AuthView, ProtectedRoute } from './components/auth';
import { useAuth } from './context/AuthContext';
import { OnboardingData } from './components/OnboardingModal';
import { mockInternships } from './data/mockInternships';
import { getRecommendations, RecommendationWeights, ScoredInternship } from './services/recommendationEngine';

type PageType = 'home' | 'search' | 'recommendations' | 'saved' | 'help' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  
  // Auth state
  const { user, profile, signOut, isConfigured } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthView>('login');
  
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

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'recommendations', label: 'For You', icon: Sparkles },
    { id: 'saved', label: 'Saved', icon: Heart },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  const handleNavClick = (page: PageType) => {
    setCurrentPage(page);
    onClose();
  };

  const glassBg = useColorModeValue(
    'rgba(255, 255, 255, 0.15)',
    'rgba(0, 0, 0, 0.3)'
  );

  const glassHover = useColorModeValue(
    'rgba(255, 255, 255, 0.25)',
    'rgba(0, 0, 0, 0.4)'
  );

  return (
    <Box minH="100vh" position="relative">
      <AnimatedBackground />

      {/* Glassmorphic Header */}
      <Box
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={100}
        px={{ base: 4, md: 8 }}
        py={3}
      >
        <Flex
          bg={glassBg}
          backdropFilter="blur(20px)"
          borderRadius="2xl"
          px={{ base: 4, md: 6 }}
          py={3}
          align="center"
          justify="space-between"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          border="1px solid rgba(255, 255, 255, 0.2)"
        >
          {/* Logo */}
          <HStack spacing={3} cursor="pointer" onClick={() => setCurrentPage('home')}>
            <Box
              bg="brand.500"
              borderRadius="xl"
              p={2}
              boxShadow="0 4px 15px rgba(10, 118, 118, 0.4)"
            >
              <Briefcase size={24} color="white" />
            </Box>
            <VStack spacing={0} align="start">
              <Heading
                size="md"
                color="white"
                fontWeight="800"
                letterSpacing="tight"
                textShadow="0 2px 10px rgba(0,0,0,0.2)"
              >
                JobRasa
              </Heading>
              <Text fontSize="xs" color="whiteAlpha.800" fontWeight="500">
                Find Your Dream Internship
              </Text>
            </VStack>
          </HStack>

          {/* Desktop Navigation */}
          <HStack spacing={2} display={{ base: 'none', lg: 'flex' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  leftIcon={<Icon size={18} />}
                  onClick={() => handleNavClick(item.id as PageType)}
                  bg={isActive ? 'rgba(255, 255, 255, 0.25)' : 'transparent'}
                  color="white"
                  _hover={{ bg: glassHover }}
                  fontWeight={isActive ? '700' : '500'}
                  borderRadius="xl"
                  px={4}
                  transition="all 0.2s"
                  transform={isActive ? 'scale(1.02)' : 'scale(1)'}
                >
                  {item.label}
                </Button>
              );
            })}
          </HStack>

          {/* Right side controls */}
          <HStack spacing={3}>
            <IconButton
              aria-label="Toggle theme"
              icon={colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              onClick={toggleColorMode}
              variant="ghost"
              color="white"
              _hover={{ bg: glassHover }}
              borderRadius="xl"
            />
            
            {/* Auth Controls */}
            {user ? (
              <ChakraMenu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: glassHover }}
                  borderRadius="xl"
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
                      {profile?.full_name?.split(' ')[0] || 'User'}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList
                  bg="rgba(10, 118, 118, 0.95)"
                  backdropFilter="blur(20px)"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  borderRadius="xl"
                  boxShadow="0 25px 50px rgba(0, 0, 0, 0.3)"
                >
                  <MenuItem 
                    icon={<User size={16} />}
                    bg="transparent"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    color="white"
                  >
                    Profile
                  </MenuItem>
                  <MenuItem 
                    icon={<Heart size={16} />}
                    onClick={() => setCurrentPage('saved')}
                    bg="transparent"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    color="white"
                  >
                    Saved Internships
                  </MenuItem>
                  <MenuDivider borderColor="whiteAlpha.200" />
                  <MenuItem 
                    icon={<LogOut size={16} />}
                    onClick={signOut}
                    bg="transparent"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    color="white"
                  >
                    Sign Out
                  </MenuItem>
                </MenuList>
              </ChakraMenu>
            ) : (
              <Button
                leftIcon={<LogIn size={18} />}
                onClick={() => {
                  setAuthModalView('login');
                  setIsAuthModalOpen(true);
                }}
                bg="brand.500"
                color="white"
                _hover={{ bg: 'brand.600' }}
                borderRadius="xl"
                fontWeight="600"
                display={{ base: 'none', md: 'flex' }}
              >
                Sign In
              </Button>
            )}
            
            <IconButton
              aria-label="Open menu"
              icon={<Menu size={24} />}
              onClick={onOpen}
              display={{ base: 'flex', lg: 'none' }}
              variant="ghost"
              color="white"
              _hover={{ bg: glassHover }}
              borderRadius="xl"
            />
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay backdropFilter="blur(10px)" />
        <DrawerContent
          bg="linear-gradient(180deg, #0a7676 0%, #0d9494 100%)"
          color="white"
        >
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">
            <HStack>
              <Briefcase size={24} />
              <Text fontWeight="800">JobRasa</Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody pt={6}>
            <VStack spacing={3} align="stretch">
              {/* User info on mobile */}
              {user && (
                <Box 
                  p={4} 
                  bg="whiteAlpha.100" 
                  borderRadius="xl" 
                  mb={2}
                >
                  <HStack>
                    <Avatar 
                      size="sm" 
                      name={profile?.full_name || user.email || 'User'} 
                      src={profile?.avatar_url || undefined}
                      bg="brand.600"
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
                    leftIcon={<Icon size={20} />}
                    onClick={() => handleNavClick(item.id as PageType)}
                    bg={isActive ? 'whiteAlpha.200' : 'transparent'}
                    color="white"
                    _hover={{ bg: 'whiteAlpha.300' }}
                    justifyContent="flex-start"
                    fontWeight={isActive ? '700' : '500'}
                    borderRadius="xl"
                    py={6}
                  >
                    {item.label}
                  </Button>
                );
              })}
              
              {/* Mobile auth button */}
              {user ? (
                <Button
                  leftIcon={<LogOut size={20} />}
                  onClick={() => {
                    signOut();
                    onClose();
                  }}
                  bg="whiteAlpha.100"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  justifyContent="flex-start"
                  borderRadius="xl"
                  py={6}
                  mt={4}
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  leftIcon={<LogIn size={20} />}
                  onClick={() => {
                    onClose();
                    setAuthModalView('login');
                    setIsAuthModalOpen(true);
                  }}
                  bg="brand.600"
                  color="white"
                  _hover={{ bg: 'brand.700' }}
                  justifyContent="flex-start"
                  borderRadius="xl"
                  py={6}
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
      <Box pt="100px" pb={8}>
        <Container maxW="7xl">
          {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} />}
          {currentPage === 'search' && <SearchPage />}
          {currentPage === 'recommendations' && (
            <ProtectedRoute onLoginClick={() => {
              setAuthModalView('login');
              setIsAuthModalOpen(true);
            }}>
              <RecommendationsPage 
                onSaveInternship={handleSaveInternship}
                savedInternshipIds={savedInternshipIds}
                userProfile={userProfile}
                weights={weights}
              />
            </ProtectedRoute>
          )}
          {currentPage === 'saved' && (
            <ProtectedRoute onLoginClick={() => {
              setAuthModalView('login');
              setIsAuthModalOpen(true);
            }}>
              <SavedPage />
            </ProtectedRoute>
          )}
          {currentPage === 'help' && <HelpPage />}
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
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
        onAuthSuccess={() => {
          setIsAuthModalOpen(false);
          // Optionally navigate to recommendations after login
          setCurrentPage('recommendations');
        }}
      />
    </Box>
  );
}

// HomePage Component
function HomePage({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  return (
    <VStack spacing={12} py={8}>
      {/* Hero Section */}
      <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
        <Badge
          bg="accent.500"
          color="white"
          px={4}
          py={2}
          borderRadius="full"
          fontSize="sm"
          fontWeight="600"
          textTransform="none"
          boxShadow="0 4px 15px rgba(255, 149, 0, 0.4)"
        >
          🚀 AI-Powered Internship Matching
        </Badge>
        <Heading
          as="h1"
          size={{ base: '2xl', md: '4xl' }}
          color="white"
          fontWeight="900"
          lineHeight="1.1"
          textShadow="0 4px 20px rgba(0,0,0,0.3)"
        >
          Find Your Perfect
          <Text as="span" color="accent.300"> Internship </Text>
          Match
        </Heading>
        <Text
          fontSize={{ base: 'lg', md: 'xl' }}
          color="whiteAlpha.900"
          maxW="600px"
          lineHeight="1.7"
        >
          Discover opportunities that align with your skills, interests, and career goals.
          Let our AI find the perfect internship for you.
        </Text>
        <HStack spacing={4} pt={4}>
          <Button
            size="lg"
            bg="white"
            color="brand.600"
            _hover={{ bg: 'whiteAlpha.900', transform: 'translateY(-2px)' }}
            rightIcon={<ArrowRight size={20} />}
            borderRadius="full"
            px={8}
            fontWeight="700"
            boxShadow="0 10px 30px rgba(0,0,0,0.2)"
            transition="all 0.3s"
            onClick={() => onNavigate('recommendations')}
          >
            Get Matched
          </Button>
          <Button
            size="lg"
            variant="outline"
            color="white"
            borderColor="whiteAlpha.400"
            _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-2px)' }}
            rightIcon={<Search size={20} />}
            borderRadius="full"
            px={8}
            fontWeight="600"
            transition="all 0.3s"
            onClick={() => onNavigate('search')}
          >
            Browse All
          </Button>
        </HStack>
      </VStack>

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
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(20px)"
        borderRadius="3xl"
        p={{ base: 6, md: 10 }}
        gap={{ base: 6, md: 12 }}
        wrap="wrap"
        justify="center"
        border="1px solid rgba(255, 255, 255, 0.2)"
        boxShadow="0 20px 50px rgba(0, 0, 0, 0.1)"
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
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(20px)"
      borderRadius="2xl"
      p={6}
      w={{ base: 'full', sm: '280px' }}
      border="1px solid rgba(255, 255, 255, 0.2)"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
      cursor="pointer"
    >
      <Box
        bg={gradient}
        borderRadius="xl"
        p={3}
        w="fit-content"
        color="white"
        mb={4}
        boxShadow="0 8px 20px rgba(0,0,0,0.2)"
      >
        {icon}
      </Box>
      <Heading size="md" color="white" mb={2} fontWeight="700">
        {title}
      </Heading>
      <Text color="whiteAlpha.800" fontSize="sm" lineHeight="1.6">
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
        fontWeight="900"
        color="white"
        textShadow="0 2px 10px rgba(0,0,0,0.2)"
      >
        {value}
      </Text>
      <Text color="whiteAlpha.800" fontWeight="500" fontSize="sm">
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
}: {
  internship: InternshipData | ScoredInternship;
  isSaved?: boolean;
  onSave?: (id: string) => void;
  onApply?: (id: string) => void;
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
        >
          Details
        </Button>
      </Flex>
    </Box>
  );
}

// Search Page
function SearchPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [savedIds, setSavedIds] = React.useState<string[]>([]);

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
            />
          </Box>
        ))}
      </Flex>
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

  const handleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    onSaveInternship?.(id);
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
            />
          </Box>
        ))}
      </Flex>
    </VStack>
  );
}

// Saved Page
function SavedPage() {
  const [savedInternships, setSavedInternships] = React.useState<InternshipData[]>(mockInternships.slice(0, 2));

  const handleRemove = (id: string) => {
    setSavedInternships((prev) => prev.filter((i) => i.id !== id));
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
              />
            </Box>
          ))}
        </Flex>
      )}
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

// Admin Page - With AI System Controls
interface AdminPageInlineProps {
  weights?: RecommendationWeights;
  onWeightsChange?: (weights: RecommendationWeights) => void;
}

function AdminPage({ 
  weights = { skill: 40, interest: 35, location: 25 },
  onWeightsChange 
}: AdminPageInlineProps = {}) {
  const [skillWeight, setSkillWeight] = React.useState(weights.skill);
  const [interestWeight, setInterestWeight] = React.useState(weights.interest);
  const [locationWeight, setLocationWeight] = React.useState(weights.location);
  const [ollamaStatus, setOllamaStatus] = React.useState<boolean | null>(null);

  // Check Ollama on mount
  React.useEffect(() => {
    fetch('http://localhost:11434/api/tags')
      .then(res => res.ok ? setOllamaStatus(true) : setOllamaStatus(false))
      .catch(() => setOllamaStatus(false));
  }, []);

  const normalizeWeights = (changed: 'skill' | 'interest' | 'location', newValue: number) => {
    const total = 100;
    const remaining = total - newValue;

    let newSkill = skillWeight;
    let newInterest = interestWeight;
    let newLocation = locationWeight;

    if (changed === 'skill') {
      newSkill = newValue;
      const ratio = remaining / (interestWeight + locationWeight);
      newInterest = Math.round(interestWeight * ratio);
      newLocation = Math.round(locationWeight * ratio);
    } else if (changed === 'interest') {
      newInterest = newValue;
      const ratio = remaining / (skillWeight + locationWeight);
      newSkill = Math.round(skillWeight * ratio);
      newLocation = Math.round(locationWeight * ratio);
    } else {
      newLocation = newValue;
      const ratio = remaining / (skillWeight + interestWeight);
      newSkill = Math.round(skillWeight * ratio);
      newInterest = Math.round(interestWeight * ratio);
    }

    setSkillWeight(newSkill);
    setInterestWeight(newInterest);
    setLocationWeight(newLocation);

    onWeightsChange?.({
      skill: newSkill,
      interest: newInterest,
      location: newLocation
    });
  };

  const stats = [
    { label: 'Total Internships', value: '2,847', change: '+124 this week' },
    { label: 'Active Users', value: '15,302', change: '+856 this month' },
    { label: 'Applications', value: '8,429', change: '+2,103 this week' },
    { label: 'Match Rate', value: '94.2%', change: '+2.1% improvement' },
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
          <Box bg="purple.500" p={2} borderRadius="lg">
            <Settings size={24} color="white" />
          </Box>
          <Heading color="white" size="lg">Admin Dashboard</Heading>
        </HStack>
        <Text color="whiteAlpha.800">
          Manage internships, monitor analytics, and configure AI recommendation settings.
        </Text>
      </Box>

      {/* AI System Status */}
      <Box
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(20px)"
        borderRadius="2xl"
        p={6}
        w="full"
        border="1px solid rgba(255, 255, 255, 0.2)"
      >
        <Heading color="white" size="md" mb={4}>🤖 AI System Status</Heading>
        <Flex gap={4} wrap="wrap">
          <Box flex="1" minW="200px" p={4} bg="whiteAlpha.100" borderRadius="xl">
            <HStack mb={2}>
              <Box w={3} h={3} borderRadius="full" bg="green.400" />
              <Text color="white" fontWeight="600">ML Recommendation Engine</Text>
            </HStack>
            <Text color="whiteAlpha.700" fontSize="sm">Active - Processing recommendations</Text>
          </Box>
          <Box flex="1" minW="200px" p={4} bg="whiteAlpha.100" borderRadius="xl">
            <HStack mb={2}>
              <Box w={3} h={3} borderRadius="full" bg={ollamaStatus ? 'green.400' : 'red.400'} />
              <Text color="white" fontWeight="600">Ollama (Llama AI)</Text>
            </HStack>
            <Text color="whiteAlpha.700" fontSize="sm">
              {ollamaStatus === null ? 'Checking...' : ollamaStatus ? 'Connected - Chat enabled' : 'Offline - Run `ollama serve`'}
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Algorithm Weights Control */}
      <Box
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(20px)"
        borderRadius="2xl"
        p={6}
        w="full"
        border="1px solid rgba(255, 255, 255, 0.2)"
      >
        <Heading color="white" size="md" mb={4}>⚙️ Tune Recommendation Algorithm</Heading>
        <Text color="whiteAlpha.700" mb={6}>
          Adjust how much each factor influences AI recommendations. Changes apply instantly.
        </Text>
        
        <VStack spacing={6} align="stretch">
          <Box>
            <HStack justify="space-between" mb={2}>
              <HStack>
                <Target size={18} color="#0a7676" />
                <Text color="white" fontWeight="600">Skills Match</Text>
              </HStack>
              <Text color="accent.300" fontWeight="bold">{skillWeight}%</Text>
            </HStack>
            <input
              type="range"
              min="10"
              max="80"
              value={skillWeight}
              onChange={(e) => normalizeWeights('skill', parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#0a7676' }}
            />
          </Box>
          
          <Box>
            <HStack justify="space-between" mb={2}>
              <HStack>
                <TrendingUp size={18} color="#38a169" />
                <Text color="white" fontWeight="600">Interest Match</Text>
              </HStack>
              <Text color="green.300" fontWeight="bold">{interestWeight}%</Text>
            </HStack>
            <input
              type="range"
              min="10"
              max="80"
              value={interestWeight}
              onChange={(e) => normalizeWeights('interest', parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#38a169' }}
            />
          </Box>
          
          <Box>
            <HStack justify="space-between" mb={2}>
              <HStack>
                <MapPin size={18} color="#4299e1" />
                <Text color="white" fontWeight="600">Location</Text>
              </HStack>
              <Text color="blue.300" fontWeight="bold">{locationWeight}%</Text>
            </HStack>
            <input
              type="range"
              min="10"
              max="80"
              value={locationWeight}
              onChange={(e) => normalizeWeights('location', parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#4299e1' }}
            />
          </Box>
        </VStack>
        
        <Box mt={6} p={4} bg="whiteAlpha.100" borderRadius="xl">
          <HStack justify="space-between">
            <Text color="whiteAlpha.700">Total Weight</Text>
            <Text color={skillWeight + interestWeight + locationWeight === 100 ? 'green.300' : 'red.300'} fontWeight="bold" fontSize="xl">
              {skillWeight + interestWeight + locationWeight}%
            </Text>
          </HStack>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Flex wrap="wrap" gap={4} w="full">
        {stats.map((stat, idx) => (
          <Box
            key={idx}
            bg="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(20px)"
            borderRadius="xl"
            p={5}
            flex={{ base: '1 1 100%', sm: '1 1 calc(50% - 8px)', lg: '1 1 calc(25% - 12px)' }}
            minW="200px"
            border="1px solid rgba(255, 255, 255, 0.2)"
          >
            <Text color="whiteAlpha.700" fontSize="sm" mb={1}>{stat.label}</Text>
            <Text color="white" fontSize="2xl" fontWeight="800">{stat.value}</Text>
            <Text color="green.300" fontSize="xs">{stat.change}</Text>
          </Box>
        ))}
      </Flex>

      {/* Quick Actions */}
      <Box
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(20px)"
        borderRadius="2xl"
        p={6}
        w="full"
        border="1px solid rgba(255, 255, 255, 0.2)"
      >
        <Heading color="white" size="md" mb={4}>Quick Actions</Heading>
        <Flex gap={3} wrap="wrap">
          <Button
            bg="brand.500"
            color="white"
            _hover={{ bg: 'brand.600' }}
            borderRadius="xl"
            leftIcon={<Plus size={18} />}
          >
            Add Internship
          </Button>
          <Button
            bg="accent.500"
            color="white"
            _hover={{ bg: 'accent.600' }}
            borderRadius="xl"
            leftIcon={<Upload size={18} />}
          >
            Bulk Upload
          </Button>
          <Button
            variant="outline"
            color="white"
            borderColor="whiteAlpha.400"
            _hover={{ bg: 'whiteAlpha.200' }}
            borderRadius="xl"
            leftIcon={<BarChart3 size={18} />}
          >
            View Reports
          </Button>
          <Button
            variant="outline"
            color="white"
            borderColor="whiteAlpha.400"
            _hover={{ bg: 'whiteAlpha.200' }}
            borderRadius="xl"
            leftIcon={<UserCog size={18} />}
          >
            Manage Users
          </Button>
        </Flex>
      </Box>
    </VStack>
  );
}

export default App;
