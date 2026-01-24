/**
 * Profile Page Component
 * Modern, clean design inspired by Qlinic profile layout
 * Light theme with organized card sections
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Avatar,
  Flex,
  Grid,
  GridItem,
  IconButton,
  useToast,
  Badge,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Select,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import {
  User,
  Save,
  Plus,
  Linkedin,
  Github,
  Globe,
  GraduationCap,
  MapPin,
  Camera,
  Briefcase,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Award,
  Edit3,
  Lock,
  ExternalLink,
  Heart,
  Clock,
  Target,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Skill suggestions
const SKILL_SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Vue.js',
  'Angular', 'Django', 'Flask', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker',
  'Git', 'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Figma',
  'Communication', 'Leadership', 'Problem Solving', 'Excel', 'Power BI',
];

const INTEREST_SUGGESTIONS = [
  'Technology', 'Healthcare', 'Finance', 'Marketing', 'Design', 'Education',
  'Environment', 'Startups', 'Research', 'Consulting', 'Data Science',
  'Artificial Intelligence', 'Cybersecurity', 'E-commerce', 'Media',
];

const EDUCATION_LEVELS = [
  { value: 'high_school', label: 'High School' },
  { value: 'undergraduate', label: 'Undergraduate (Bachelor\'s)' },
  { value: 'graduate', label: 'Graduate (Master\'s)' },
  { value: 'phd', label: 'PhD / Doctorate' },
  { value: 'diploma', label: 'Diploma / Certificate' },
];

interface ProfileFormData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  education_level: string;
  institution: string;
  field_of_study: string;
  graduation_year: string;
  skills: string[];
  interests: string[];
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
}

interface ProfilePageProps {
  onBack?: () => void;
}

// Card wrapper component for consistent styling
const ProfileCard = ({ children, title, icon: Icon, action }: { 
  children: React.ReactNode; 
  title?: string; 
  icon?: React.ElementType;
  action?: React.ReactNode;
}) => (
  <Box
    bg="white"
    borderRadius="xl"
    boxShadow="0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)"
    border="1px solid"
    borderColor="gray.100"
    overflow="hidden"
  >
    {title && (
      <HStack px={6} py={4} borderBottom="1px solid" borderColor="gray.100" justify="space-between">
        <HStack spacing={3}>
          {Icon && <Icon size={20} color="#6B46C1" />}
          <Heading size="sm" color="gray.800" fontWeight="600">{title}</Heading>
        </HStack>
        {action}
      </HStack>
    )}
    <Box p={6}>{children}</Box>
  </Box>
);

// Info item component for displaying label-value pairs
const InfoItem = ({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) => (
  <VStack align="start" spacing={1}>
    <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600" letterSpacing="wide">
      {label}
    </Text>
    <HStack spacing={2}>
      {Icon && <Icon size={14} color="#718096" />}
      <Text color="gray.800" fontWeight="500">{value || '—'}</Text>
    </HStack>
  </VStack>
);

// Stat item for sidebar
const StatItem = ({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) => (
  <VStack align="start" spacing={1} w="full">
    <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600" letterSpacing="wide">
      {label}
    </Text>
    <Text color="gray.800" fontWeight="600">{value}</Text>
    {sublabel && <Text fontSize="xs" color="gray.400">{sublabel}</Text>}
  </VStack>
);

export function ProfilePage({ onBack }: ProfilePageProps) {
  const { user, profile, updateProfile } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    education_level: '',
    institution: '',
    field_of_study: '',
    graduation_year: '',
    skills: [],
    interests: [],
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
  });

  // Load profile data
  useEffect(() => {
    const savedProfile = localStorage.getItem('jobrasa-profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setFormData({
          full_name: parsed.full_name || '',
          email: user?.email || parsed.email || '',
          phone: parsed.phone || '',
          location: parsed.location || '',
          bio: parsed.bio || '',
          education_level: parsed.education_level || '',
          institution: parsed.institution || '',
          field_of_study: parsed.field_of_study || '',
          graduation_year: parsed.graduation_year || '',
          skills: parsed.skills || [],
          interests: parsed.interests || [],
          linkedin_url: parsed.linkedin_url || '',
          github_url: parsed.github_url || '',
          portfolio_url: parsed.portfolio_url || '',
        });
        if (parsed.avatar_url) {
          setAvatarPreview(parsed.avatar_url);
        }
      } catch (e) {
        console.error('Failed to parse saved profile');
      }
    }

    if (profile) {
      setFormData(prev => ({
        ...prev,
        full_name: profile.full_name || prev.full_name,
        email: user?.email || profile.email || prev.email,
        location: profile.location || prev.location,
        education_level: profile.education || prev.education_level,
        skills: profile.skills || prev.skills,
        interests: profile.interests || prev.interests,
      }));
      if (profile.avatar_url) {
        setAvatarPreview(profile.avatar_url);
      }
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        full_name: user.user_metadata?.full_name || prev.full_name,
      }));
    }
  }, [profile, user]);

  // Calculate profile completion percentage
  const profileCompletion = useMemo(() => {
    const fields = [
      { name: 'full_name', filled: !!formData.full_name.trim(), weight: 15 },
      { name: 'phone', filled: !!formData.phone.trim(), weight: 10 },
      { name: 'location', filled: !!formData.location.trim(), weight: 10 },
      { name: 'bio', filled: !!formData.bio.trim(), weight: 10 },
      { name: 'education_level', filled: !!formData.education_level, weight: 10 },
      { name: 'institution', filled: !!formData.institution.trim(), weight: 10 },
      { name: 'field_of_study', filled: !!formData.field_of_study.trim(), weight: 5 },
      { name: 'graduation_year', filled: !!formData.graduation_year, weight: 5 },
      { name: 'skills', filled: formData.skills.length > 0, weight: 15 },
      { name: 'interests', filled: formData.interests.length > 0, weight: 5 },
      { name: 'avatar', filled: !!avatarPreview, weight: 5 },
    ];
    
    const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);
    const completedWeight = fields.reduce((sum, f) => sum + (f.filled ? f.weight : 0), 0);
    
    return Math.round((completedWeight / totalWeight) * 100);
  }, [formData, avatarPreview]);

  // Save profile completion to localStorage for HomePage access
  useEffect(() => {
    localStorage.setItem('jobrasa-profile-completion', JSON.stringify({
      percentage: profileCompletion,
      isComplete: profileCompletion === 100,
      updatedAt: new Date().toISOString(),
    }));
  }, [profileCompletion]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleAddInterest = () => {
    const interest = newInterest.trim();
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({ ...prev, interests: [...prev.interests, interest] }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({ ...prev, interests: prev.interests.filter(i => i !== interest) }));
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid file type', status: 'error', duration: 3000 });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.full_name.trim()) {
      toast({ title: 'Name required', status: 'warning', duration: 3000 });
      return;
    }

    setIsSaving(true);
    try {
      localStorage.setItem('jobrasa-profile', JSON.stringify({
        ...formData,
        avatar_url: avatarPreview,
        updated_at: new Date().toISOString(),
      }));

      if (updateProfile && user) {
        try {
          await updateProfile({
            full_name: formData.full_name,
            location: formData.location,
            education: formData.education_level,
            skills: formData.skills,
            interests: formData.interests,
            avatar_url: avatarPreview || undefined,
          });
        } catch (e) {
          console.log('Supabase update skipped');
        }
      }

      toast({ title: 'Profile saved!', status: 'success', duration: 3000 });
      setIsEditing(false);
    } catch (error: any) {
      toast({ title: 'Save failed', status: 'error', duration: 3000 });
    } finally {
      setIsSaving(false);
    }
  };

  const getEducationLabel = (value: string) => {
    return EDUCATION_LEVELS.find(l => l.value === value)?.label || value;
  };

  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Jan 2026';

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)" py={8}>
      <Container maxW="6xl">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <HStack spacing={4}>
            {onBack && (
              <IconButton
                aria-label="Go back"
                icon={<ArrowLeft size={20} />}
                onClick={onBack}
                variant="ghost"
                color="gray.600"
                _hover={{ bg: 'white', color: 'purple.600' }}
              />
            )}
            <Heading size="lg" color="gray.800" fontWeight="700">
              Your profile
            </Heading>
          </HStack>
          <HStack spacing={3}>
            <Button
              leftIcon={<Lock size={16} />}
              variant="outline"
              colorScheme="purple"
              borderRadius="lg"
              fontWeight="500"
              _hover={{ bg: 'purple.50' }}
            >
              Change password
            </Button>
            {isEditing ? (
              <Button
                leftIcon={<Save size={16} />}
                colorScheme="purple"
                borderRadius="lg"
                fontWeight="500"
                onClick={handleSave}
                isLoading={isSaving}
              >
                Save changes
              </Button>
            ) : (
              <Button
                leftIcon={<Edit3 size={16} />}
                variant="outline"
                colorScheme="purple"
                borderRadius="lg"
                fontWeight="500"
                _hover={{ bg: 'purple.50' }}
                onClick={() => setIsEditing(true)}
              >
                Edit profile
              </Button>
            )}
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: '1fr', lg: '320px 1fr' }} gap={6}>
          {/* Left Sidebar */}
          <GridItem>
            <VStack spacing={6}>
              {/* Profile Photo Card */}
              <ProfileCard>
                <VStack spacing={4}>
                  {/* Avatar */}
                  <Box position="relative">
                    <Avatar
                      size="2xl"
                      name={formData.full_name || 'User'}
                      src={avatarPreview}
                      bg="purple.500"
                      w="140px"
                      h="140px"
                      border="4px solid white"
                      boxShadow="0 4px 12px rgba(107, 70, 193, 0.2)"
                    />
                    {isEditing && (
                      <IconButton
                        aria-label="Change photo"
                        icon={<Camera size={16} />}
                        size="sm"
                        colorScheme="purple"
                        borderRadius="full"
                        position="absolute"
                        bottom={1}
                        right={1}
                        onClick={() => fileInputRef.current?.click()}
                      />
                    )}
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      display="none"
                      onChange={handlePhotoChange}
                    />
                  </Box>

                  {/* Profile Completion */}
                  <Box textAlign="center">
                    <CircularProgress 
                      value={profileCompletion} 
                      size="80px" 
                      thickness="8px"
                      color={profileCompletion === 100 ? 'green.400' : profileCompletion >= 70 ? 'purple.500' : 'orange.400'}
                      trackColor="gray.100"
                    >
                      <CircularProgressLabel 
                        fontSize="lg" 
                        fontWeight="bold" 
                        color={profileCompletion === 100 ? 'green.600' : 'gray.700'}
                      >
                        {profileCompletion}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <Text fontSize="sm" color="gray.600" mt={2} fontWeight="500">
                      Profile Complete
                    </Text>
                    {profileCompletion < 100 && (
                      <Text fontSize="xs" color="orange.500" mt={1}>
                        Complete your profile for better matches
                      </Text>
                    )}
                  </Box>

                  {/* Status Badge */}
                  <Badge
                    colorScheme={profileCompletion === 100 ? 'green' : 'orange'}
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="600"
                    textTransform="uppercase"
                  >
                    {profileCompletion === 100 ? 'Complete' : 'Incomplete'}
                  </Badge>

                  <Divider />

                  {/* Stats */}
                  <VStack align="start" w="full" spacing={5}>
                    <StatItem
                      label="Member Since"
                      value={memberSince}
                    />
                    <StatItem
                      label="Profile Views"
                      value="127"
                      sublabel="Last 30 days"
                    />
                    <StatItem
                      label="Saved Internships"
                      value={String(formData.interests.length || 0)}
                    />
                    <StatItem
                      label="Applications"
                      value="3"
                      sublabel="2 pending, 1 reviewed"
                    />
                  </VStack>

                  <Button
                    variant="outline"
                    colorScheme="purple"
                    w="full"
                    borderRadius="lg"
                    fontWeight="500"
                    leftIcon={<Heart size={16} />}
                  >
                    View saved internships
                  </Button>
                </VStack>
              </ProfileCard>
            </VStack>
          </GridItem>

          {/* Right Content */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Personal Information */}
              <ProfileCard title="Personal Information" icon={User}>
                {isEditing ? (
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={6}>
                    <GridItem colSpan={{ base: 1, md: 3 }}>
                      <FormControl>
                        <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600">
                          Full Name
                        </FormLabel>
                        <Input
                          value={formData.full_name}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="lg"
                          _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                        />
                      </FormControl>
                    </GridItem>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600">
                        Phone
                      </FormLabel>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600">
                        Location
                      </FormLabel>
                      <Input
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600">
                        Email
                      </FormLabel>
                      <Input
                        value={formData.email}
                        isReadOnly
                        bg="gray.100"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        color="gray.500"
                      />
                    </FormControl>
                    <GridItem colSpan={{ base: 1, md: 3 }}>
                      <FormControl>
                        <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600">
                          Bio
                        </FormLabel>
                        <Textarea
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="lg"
                          rows={3}
                          _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                ) : (
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={6}>
                    <GridItem colSpan={{ base: 1, md: 3 }}>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600">Full Name</Text>
                        <Text fontSize="2xl" color="gray.800" fontWeight="600">{formData.full_name || 'Not set'}</Text>
                      </VStack>
                    </GridItem>
                    <InfoItem label="Phone" value={formData.phone} icon={Phone} />
                    <InfoItem label="Location" value={formData.location} icon={MapPin} />
                    <InfoItem label="Email" value={formData.email} icon={Mail} />
                    {formData.bio && (
                      <GridItem colSpan={{ base: 1, md: 3 }}>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600">Bio</Text>
                          <Text color="gray.600">{formData.bio}</Text>
                        </VStack>
                      </GridItem>
                    )}
                  </Grid>
                )}
              </ProfileCard>

              {/* Education */}
              <ProfileCard title="Education" icon={GraduationCap}>
                {isEditing ? (
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600">
                        Education Level
                      </FormLabel>
                      <Select
                        value={formData.education_level}
                        onChange={(e) => handleInputChange('education_level', e.target.value)}
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                      >
                        <option value="">Select level</option>
                        {EDUCATION_LEVELS.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600">
                        Institution
                      </FormLabel>
                      <Input
                        value={formData.institution}
                        onChange={(e) => handleInputChange('institution', e.target.value)}
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600">
                        Field of Study
                      </FormLabel>
                      <Input
                        value={formData.field_of_study}
                        onChange={(e) => handleInputChange('field_of_study', e.target.value)}
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600">
                        Graduation Year
                      </FormLabel>
                      <Input
                        value={formData.graduation_year}
                        onChange={(e) => handleInputChange('graduation_year', e.target.value)}
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                      />
                    </FormControl>
                  </Grid>
                ) : (
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap={6}>
                    <InfoItem label="Education Level" value={getEducationLabel(formData.education_level)} />
                    <InfoItem label="Institution" value={formData.institution} />
                    <InfoItem label="Field of Study" value={formData.field_of_study} />
                    <InfoItem label="Graduation Year" value={formData.graduation_year} icon={Calendar} />
                  </Grid>
                )}
              </ProfileCard>

              {/* Skills */}
              <ProfileCard 
                title="Skills" 
                icon={Briefcase}
                action={
                  !isEditing && formData.skills.length > 0 && (
                    <Text fontSize="sm" color="purple.600" fontWeight="500">
                      {formData.skills.length} skills
                    </Text>
                  )
                }
              >
                {isEditing ? (
                  <VStack spacing={4} align="stretch">
                    <HStack>
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        placeholder="Add a skill..."
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                      />
                      <IconButton
                        aria-label="Add skill"
                        icon={<Plus size={18} />}
                        onClick={handleAddSkill}
                        colorScheme="purple"
                        borderRadius="lg"
                      />
                    </HStack>
                    <Wrap spacing={2}>
                      {formData.skills.map(skill => (
                        <WrapItem key={skill}>
                          <Tag size="lg" colorScheme="purple" borderRadius="full" px={4}>
                            <TagLabel>{skill}</TagLabel>
                            <TagCloseButton onClick={() => handleRemoveSkill(skill)} />
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={2}>Suggestions:</Text>
                      <Wrap spacing={2}>
                        {SKILL_SUGGESTIONS.filter(s => !formData.skills.includes(s)).slice(0, 6).map(skill => (
                          <WrapItem key={skill}>
                            <Tag
                              size="sm"
                              variant="outline"
                              colorScheme="gray"
                              cursor="pointer"
                              onClick={() => setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }))}
                              _hover={{ bg: 'purple.50', borderColor: 'purple.300' }}
                              borderRadius="full"
                            >
                              + {skill}
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  </VStack>
                ) : (
                  <Wrap spacing={2}>
                    {formData.skills.length > 0 ? (
                      formData.skills.map(skill => (
                        <WrapItem key={skill}>
                          <Tag size="lg" colorScheme="purple" borderRadius="full" px={4}>
                            <TagLabel>{skill}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ))
                    ) : (
                      <Text color="gray.400" fontStyle="italic">No skills added yet</Text>
                    )}
                  </Wrap>
                )}
              </ProfileCard>

              {/* Interests */}
              <ProfileCard 
                title="Interests" 
                icon={Target}
                action={
                  !isEditing && formData.interests.length > 0 && (
                    <Text fontSize="sm" color="purple.600" fontWeight="500">
                      {formData.interests.length} interests
                    </Text>
                  )
                }
              >
                {isEditing ? (
                  <VStack spacing={4} align="stretch">
                    <HStack>
                      <Input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                        placeholder="Add an interest..."
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                      />
                      <IconButton
                        aria-label="Add interest"
                        icon={<Plus size={18} />}
                        onClick={handleAddInterest}
                        colorScheme="purple"
                        borderRadius="lg"
                      />
                    </HStack>
                    <Wrap spacing={2}>
                      {formData.interests.map(interest => (
                        <WrapItem key={interest}>
                          <Tag size="lg" colorScheme="pink" borderRadius="full" px={4}>
                            <TagLabel>{interest}</TagLabel>
                            <TagCloseButton onClick={() => handleRemoveInterest(interest)} />
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={2}>Suggestions:</Text>
                      <Wrap spacing={2}>
                        {INTEREST_SUGGESTIONS.filter(i => !formData.interests.includes(i)).slice(0, 6).map(interest => (
                          <WrapItem key={interest}>
                            <Tag
                              size="sm"
                              variant="outline"
                              colorScheme="gray"
                              cursor="pointer"
                              onClick={() => setFormData(prev => ({ ...prev, interests: [...prev.interests, interest] }))}
                              _hover={{ bg: 'pink.50', borderColor: 'pink.300' }}
                              borderRadius="full"
                            >
                              + {interest}
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  </VStack>
                ) : (
                  <Wrap spacing={2}>
                    {formData.interests.length > 0 ? (
                      formData.interests.map(interest => (
                        <WrapItem key={interest}>
                          <Tag size="lg" colorScheme="pink" borderRadius="full" px={4}>
                            <TagLabel>{interest}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ))
                    ) : (
                      <Text color="gray.400" fontStyle="italic">No interests added yet</Text>
                    )}
                  </Wrap>
                )}
              </ProfileCard>

              {/* Social Links */}
              <ProfileCard 
                title="Social Links" 
                icon={Globe}
                action={
                  !isEditing && (
                    <HStack spacing={2}>
                      {formData.linkedin_url && (
                        <IconButton
                          as="a"
                          href={formData.linkedin_url}
                          target="_blank"
                          aria-label="LinkedIn"
                          icon={<Linkedin size={18} />}
                          variant="ghost"
                          colorScheme="purple"
                          size="sm"
                        />
                      )}
                      {formData.github_url && (
                        <IconButton
                          as="a"
                          href={formData.github_url}
                          target="_blank"
                          aria-label="GitHub"
                          icon={<Github size={18} />}
                          variant="ghost"
                          colorScheme="purple"
                          size="sm"
                        />
                      )}
                      {formData.portfolio_url && (
                        <IconButton
                          as="a"
                          href={formData.portfolio_url}
                          target="_blank"
                          aria-label="Portfolio"
                          icon={<ExternalLink size={18} />}
                          variant="ghost"
                          colorScheme="purple"
                          size="sm"
                        />
                      )}
                    </HStack>
                  )
                }
              >
                {isEditing ? (
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600">
                        <HStack spacing={2}>
                          <Linkedin size={14} />
                          <Text>LinkedIn</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        value={formData.linkedin_url}
                        onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600">
                        <HStack spacing={2}>
                          <Github size={14} />
                          <Text>GitHub</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        value={formData.github_url}
                        onChange={(e) => handleInputChange('github_url', e.target.value)}
                        placeholder="https://github.com/..."
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                      />
                    </FormControl>
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                      <FormControl>
                        <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="600">
                          <HStack spacing={2}>
                            <Globe size={14} />
                            <Text>Portfolio Website</Text>
                          </HStack>
                        </FormLabel>
                        <Input
                          value={formData.portfolio_url}
                          onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                          placeholder="https://..."
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="lg"
                          _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                ) : (
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={6}>
                    <InfoItem label="LinkedIn" value={formData.linkedin_url ? 'Connected' : 'Not connected'} icon={Linkedin} />
                    <InfoItem label="GitHub" value={formData.github_url ? 'Connected' : 'Not connected'} icon={Github} />
                    <InfoItem label="Portfolio" value={formData.portfolio_url ? 'Added' : 'Not added'} icon={Globe} />
                  </Grid>
                )}
              </ProfileCard>

              {/* Save Button (Mobile) */}
              {isEditing && (
                <Button
                  leftIcon={<Save size={18} />}
                  colorScheme="purple"
                  size="lg"
                  w="full"
                  borderRadius="lg"
                  onClick={handleSave}
                  isLoading={isSaving}
                  display={{ base: 'flex', lg: 'none' }}
                >
                  Save changes
                </Button>
              )}
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
