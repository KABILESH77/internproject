/**
 * Profile Page Component
 * Comprehensive user profile with personal details, skills, resume upload, and photo
 */

import React, { useState, useRef, useEffect } from 'react';
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
  FormHelperText,
  Avatar,
  Badge,
  Flex,
  Grid,
  GridItem,
  IconButton,
  useToast,
  Progress,
  Divider,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Select,
  Card,
  CardBody,
  CardHeader,
  Spinner,
} from '@chakra-ui/react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Upload,
  Camera,
  Save,
  X,
  Plus,
  Linkedin,
  Github,
  Globe,
  Calendar,
  Award,
  Target,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';

// Skill suggestions for autocomplete
const SKILL_SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Vue.js',
  'Angular', 'Django', 'Flask', 'Spring Boot', 'SQL', 'MongoDB', 'PostgreSQL',
  'AWS', 'Docker', 'Kubernetes', 'Git', 'Machine Learning', 'Data Analysis',
  'UI/UX Design', 'Figma', 'Adobe XD', 'Product Management', 'Agile', 'Scrum',
  'Communication', 'Leadership', 'Problem Solving', 'Critical Thinking',
  'Microsoft Office', 'Excel', 'PowerPoint', 'Tableau', 'Power BI',
];

const INTEREST_SUGGESTIONS = [
  'Technology', 'Healthcare', 'Finance', 'Marketing', 'Design', 'Education',
  'Environment', 'Social Impact', 'Startups', 'Research', 'Consulting',
  'Data Science', 'Artificial Intelligence', 'Blockchain', 'Cybersecurity',
  'E-commerce', 'Media', 'Entertainment', 'Manufacturing', 'Legal',
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
  avatar_url: string;
  resume_url: string;
}

export function ProfilePage() {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [profileCompletion, setProfileCompletion] = useState(0);

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
    avatar_url: '',
    resume_url: '',
  });

  // Load profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: user?.email || '',
        phone: (profile as any).phone || '',
        location: profile.location || '',
        bio: (profile as any).bio || '',
        education_level: profile.education || '',
        institution: (profile as any).institution || '',
        field_of_study: (profile as any).field_of_study || '',
        graduation_year: (profile as any).graduation_year || '',
        skills: profile.skills || [],
        interests: profile.interests || [],
        linkedin_url: (profile as any).linkedin_url || '',
        github_url: (profile as any).github_url || '',
        portfolio_url: (profile as any).portfolio_url || '',
        avatar_url: profile.avatar_url || '',
        resume_url: (profile as any).resume_url || '',
      });
    }
  }, [profile, user]);

  // Calculate profile completion
  useEffect(() => {
    const fields = [
      formData.full_name,
      formData.phone,
      formData.location,
      formData.bio,
      formData.education_level,
      formData.institution,
      formData.field_of_study,
      formData.skills.length > 0,
      formData.interests.length > 0,
      formData.avatar_url,
      formData.resume_url,
    ];
    const completed = fields.filter(Boolean).length;
    setProfileCompletion(Math.round((completed / fields.length) * 100));
  }, [formData]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPG, PNG, etc.)',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setUploadingPhoto(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));

      toast({
        title: 'Photo uploaded!',
        status: 'success',
        duration: 2000,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Could not upload photo. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF or Word document',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 10MB',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setUploadingResume(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/resume.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, resume_url: publicUrl }));

      toast({
        title: 'Resume uploaded!',
        description: file.name,
        status: 'success',
        duration: 2000,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Could not upload resume. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const { error } = await updateProfile({
        full_name: formData.full_name,
        location: formData.location,
        education: formData.education_level,
        skills: formData.skills,
        interests: formData.interests,
        avatar_url: formData.avatar_url,
        // Extended fields (would need to add to Profile type)
        ...({
          phone: formData.phone,
          bio: formData.bio,
          institution: formData.institution,
          field_of_study: formData.field_of_study,
          graduation_year: formData.graduation_year,
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url,
          portfolio_url: formData.portfolio_url,
          resume_url: formData.resume_url,
        } as any),
      });

      if (error) throw error;

      await refreshProfile();

      toast({
        title: 'Profile saved!',
        description: 'Your profile has been updated successfully.',
        status: 'success',
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: 'Save failed',
        description: error.message || 'Could not save profile. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <Box py={16} textAlign="center">
        <AlertCircle size={48} className="mx-auto mb-4 text-amber-500" />
        <Heading size="lg" color="white" mb={2}>Sign In Required</Heading>
        <Text color="whiteAlpha.700">Please sign in to view your profile.</Text>
      </Box>
    );
  }

  return (
    <Box py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="xl" color="white" mb={2}>
              My Profile
            </Heading>
            <Text color="whiteAlpha.700">
              Complete your profile to get better internship matches
            </Text>
          </Box>
          <Button
            leftIcon={<Save size={18} />}
            bg="linear-gradient(135deg, #DC3545 0%, #C82333 100%)"
            color="white"
            _hover={{ opacity: 0.9 }}
            onClick={handleSave}
            isLoading={isSaving}
            loadingText="Saving..."
            size="lg"
            borderRadius="xl"
            boxShadow="0 4px 15px rgba(220, 53, 69, 0.4)"
          >
            Save Profile
          </Button>
        </Flex>

        {/* Profile Completion */}
        <Card
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(10px)"
          border="1px solid rgba(255, 255, 255, 0.2)"
          borderRadius="2xl"
        >
          <CardBody>
            <HStack justify="space-between" mb={3}>
              <HStack>
                <Target size={20} color="#DC3545" />
                <Text color="white" fontWeight="600">Profile Completion</Text>
              </HStack>
              <Badge
                colorScheme={profileCompletion >= 80 ? 'green' : profileCompletion >= 50 ? 'yellow' : 'red'}
                fontSize="md"
                px={3}
                py={1}
                borderRadius="full"
              >
                {profileCompletion}%
              </Badge>
            </HStack>
            <Progress
              value={profileCompletion}
              colorScheme={profileCompletion >= 80 ? 'green' : profileCompletion >= 50 ? 'yellow' : 'red'}
              borderRadius="full"
              size="lg"
              bg="whiteAlpha.200"
            />
            {profileCompletion < 100 && (
              <Text color="whiteAlpha.600" fontSize="sm" mt={2}>
                {profileCompletion < 50 
                  ? '📝 Add more details to improve your internship matches!'
                  : profileCompletion < 80
                  ? '🚀 Almost there! Complete your profile for best results.'
                  : '✨ Great job! Just a few more details to complete your profile.'}
              </Text>
            )}
          </CardBody>
        </Card>

        <Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} gap={8}>
          {/* Left Column - Photo & Quick Info */}
          <GridItem>
            <VStack spacing={6}>
              {/* Profile Photo */}
              <Card
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="2xl"
                w="full"
              >
                <CardBody>
                  <VStack spacing={4}>
                    <Box position="relative">
                      <Avatar
                        size="2xl"
                        name={formData.full_name || user?.email}
                        src={formData.avatar_url || undefined}
                        bg="brand.500"
                        border="4px solid"
                        borderColor="whiteAlpha.400"
                      />
                      <IconButton
                        aria-label="Upload photo"
                        icon={uploadingPhoto ? <Spinner size="sm" /> : <Camera size={16} />}
                        size="sm"
                        borderRadius="full"
                        position="absolute"
                        bottom={0}
                        right={0}
                        bg="white"
                        color="gray.700"
                        _hover={{ bg: 'gray.100' }}
                        onClick={() => fileInputRef.current?.click()}
                        isDisabled={uploadingPhoto}
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handlePhotoUpload}
                      />
                    </Box>
                    <Text color="white" fontWeight="600" fontSize="lg">
                      {formData.full_name || 'Your Name'}
                    </Text>
                    <Text color="whiteAlpha.600" fontSize="sm">
                      {user?.email}
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="whiteAlpha"
                      leftIcon={<Upload size={14} />}
                      onClick={() => fileInputRef.current?.click()}
                      isLoading={uploadingPhoto}
                    >
                      Change Photo
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Resume Upload */}
              <Card
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="2xl"
                w="full"
              >
                <CardHeader pb={2}>
                  <HStack>
                    <FileText size={20} color="#DC3545" />
                    <Heading size="sm" color="white">Resume</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={2}>
                  <VStack spacing={3}>
                    {formData.resume_url ? (
                      <HStack
                        w="full"
                        p={3}
                        bg="green.500/20"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="green.500/50"
                      >
                        <CheckCircle size={20} color="#48BB78" />
                        <Text color="green.300" fontSize="sm" flex={1}>
                          Resume uploaded
                        </Text>
                        <Button
                          size="xs"
                          variant="ghost"
                          colorScheme="green"
                          as="a"
                          href={formData.resume_url}
                          target="_blank"
                        >
                          View
                        </Button>
                      </HStack>
                    ) : (
                      <Box
                        w="full"
                        p={6}
                        border="2px dashed"
                        borderColor="whiteAlpha.300"
                        borderRadius="xl"
                        textAlign="center"
                        cursor="pointer"
                        _hover={{ borderColor: 'whiteAlpha.500', bg: 'whiteAlpha.50' }}
                        onClick={() => resumeInputRef.current?.click()}
                      >
                        <Upload size={32} color="rgba(255,255,255,0.5)" className="mx-auto mb-2" />
                        <Text color="whiteAlpha.700" fontSize="sm">
                          Click to upload resume
                        </Text>
                        <Text color="whiteAlpha.500" fontSize="xs">
                          PDF or Word (max 10MB)
                        </Text>
                      </Box>
                    )}
                    <input
                      ref={resumeInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      onChange={handleResumeUpload}
                    />
                    <Button
                      size="sm"
                      w="full"
                      variant="outline"
                      colorScheme="whiteAlpha"
                      leftIcon={uploadingResume ? <Spinner size="sm" /> : <Upload size={14} />}
                      onClick={() => resumeInputRef.current?.click()}
                      isLoading={uploadingResume}
                    >
                      {formData.resume_url ? 'Update Resume' : 'Upload Resume'}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Social Links */}
              <Card
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="2xl"
                w="full"
              >
                <CardHeader pb={2}>
                  <HStack>
                    <Globe size={20} color="#DC3545" />
                    <Heading size="sm" color="white">Social Links</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={2}>
                  <VStack spacing={3}>
                    <FormControl>
                      <HStack>
                        <Linkedin size={18} color="#0A66C2" />
                        <Input
                          placeholder="linkedin.com/in/username"
                          value={formData.linkedin_url}
                          onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                          size="sm"
                          bg="whiteAlpha.100"
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          color="white"
                          _placeholder={{ color: 'whiteAlpha.400' }}
                          borderRadius="lg"
                        />
                      </HStack>
                    </FormControl>
                    <FormControl>
                      <HStack>
                        <Github size={18} color="white" />
                        <Input
                          placeholder="github.com/username"
                          value={formData.github_url}
                          onChange={(e) => handleInputChange('github_url', e.target.value)}
                          size="sm"
                          bg="whiteAlpha.100"
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          color="white"
                          _placeholder={{ color: 'whiteAlpha.400' }}
                          borderRadius="lg"
                        />
                      </HStack>
                    </FormControl>
                    <FormControl>
                      <HStack>
                        <Globe size={18} color="#DC3545" />
                        <Input
                          placeholder="yourportfolio.com"
                          value={formData.portfolio_url}
                          onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                          size="sm"
                          bg="whiteAlpha.100"
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          color="white"
                          _placeholder={{ color: 'whiteAlpha.400' }}
                          borderRadius="lg"
                        />
                      </HStack>
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>

          {/* Right Column - Main Form */}
          <GridItem>
            <VStack spacing={6}>
              {/* Personal Information */}
              <Card
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="2xl"
                w="full"
              >
                <CardHeader>
                  <HStack>
                    <User size={20} color="#DC3545" />
                    <Heading size="md" color="white">Personal Information</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                    <FormControl>
                      <FormLabel color="whiteAlpha.800" fontSize="sm">Full Name</FormLabel>
                      <Input
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        placeholder="John Doe"
                        bg="whiteAlpha.100"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        color="white"
                        _placeholder={{ color: 'whiteAlpha.400' }}
                        borderRadius="xl"
                        _focus={{ borderColor: '#DC3545', boxShadow: '0 0 0 1px #DC3545' }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel color="whiteAlpha.800" fontSize="sm">Email</FormLabel>
                      <Input
                        value={formData.email}
                        isReadOnly
                        bg="whiteAlpha.50"
                        border="1px solid"
                        borderColor="whiteAlpha.100"
                        color="whiteAlpha.600"
                        borderRadius="xl"
                      />
                      <FormHelperText color="whiteAlpha.500" fontSize="xs">
                        Email cannot be changed
                      </FormHelperText>
                    </FormControl>
                    <FormControl>
                      <FormLabel color="whiteAlpha.800" fontSize="sm">Phone Number</FormLabel>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        bg="whiteAlpha.100"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        color="white"
                        _placeholder={{ color: 'whiteAlpha.400' }}
                        borderRadius="xl"
                        _focus={{ borderColor: '#DC3545', boxShadow: '0 0 0 1px #DC3545' }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel color="whiteAlpha.800" fontSize="sm">Location</FormLabel>
                      <Input
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="San Francisco, CA"
                        bg="whiteAlpha.100"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        color="white"
                        _placeholder={{ color: 'whiteAlpha.400' }}
                        borderRadius="xl"
                        _focus={{ borderColor: '#DC3545', boxShadow: '0 0 0 1px #DC3545' }}
                      />
                    </FormControl>
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                      <FormControl>
                        <FormLabel color="whiteAlpha.800" fontSize="sm">Bio</FormLabel>
                        <Textarea
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="Tell us about yourself, your goals, and what you're looking for in an internship..."
                          rows={3}
                          bg="whiteAlpha.100"
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          color="white"
                          _placeholder={{ color: 'whiteAlpha.400' }}
                          borderRadius="xl"
                          _focus={{ borderColor: '#DC3545', boxShadow: '0 0 0 1px #DC3545' }}
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>

              {/* Education */}
              <Card
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="2xl"
                w="full"
              >
                <CardHeader>
                  <HStack>
                    <GraduationCap size={20} color="#DC3545" />
                    <Heading size="md" color="white">Education</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                    <FormControl>
                      <FormLabel color="whiteAlpha.800" fontSize="sm">Education Level</FormLabel>
                      <Select
                        value={formData.education_level}
                        onChange={(e) => handleInputChange('education_level', e.target.value)}
                        placeholder="Select level"
                        bg="whiteAlpha.100"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        color="white"
                        borderRadius="xl"
                        _focus={{ borderColor: '#DC3545', boxShadow: '0 0 0 1px #DC3545' }}
                        sx={{
                          option: { bg: 'gray.800', color: 'white' },
                        }}
                      >
                        {EDUCATION_LEVELS.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel color="whiteAlpha.800" fontSize="sm">Institution</FormLabel>
                      <Input
                        value={formData.institution}
                        onChange={(e) => handleInputChange('institution', e.target.value)}
                        placeholder="University of California"
                        bg="whiteAlpha.100"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        color="white"
                        _placeholder={{ color: 'whiteAlpha.400' }}
                        borderRadius="xl"
                        _focus={{ borderColor: '#DC3545', boxShadow: '0 0 0 1px #DC3545' }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel color="whiteAlpha.800" fontSize="sm">Field of Study</FormLabel>
                      <Input
                        value={formData.field_of_study}
                        onChange={(e) => handleInputChange('field_of_study', e.target.value)}
                        placeholder="Computer Science"
                        bg="whiteAlpha.100"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        color="white"
                        _placeholder={{ color: 'whiteAlpha.400' }}
                        borderRadius="xl"
                        _focus={{ borderColor: '#DC3545', boxShadow: '0 0 0 1px #DC3545' }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel color="whiteAlpha.800" fontSize="sm">Graduation Year</FormLabel>
                      <Input
                        value={formData.graduation_year}
                        onChange={(e) => handleInputChange('graduation_year', e.target.value)}
                        placeholder="2026"
                        type="number"
                        min="2020"
                        max="2035"
                        bg="whiteAlpha.100"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        color="white"
                        _placeholder={{ color: 'whiteAlpha.400' }}
                        borderRadius="xl"
                        _focus={{ borderColor: '#DC3545', boxShadow: '0 0 0 1px #DC3545' }}
                      />
                    </FormControl>
                  </Grid>
                </CardBody>
              </Card>

              {/* Skills */}
              <Card
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="2xl"
                w="full"
              >
                <CardHeader>
                  <HStack>
                    <Award size={20} color="#DC3545" />
                    <Heading size="md" color="white">Skills</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    <HStack>
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill (e.g., Python, React, Data Analysis)"
                        bg="whiteAlpha.100"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        color="white"
                        _placeholder={{ color: 'whiteAlpha.400' }}
                        borderRadius="xl"
                        _focus={{ borderColor: '#DC3545', boxShadow: '0 0 0 1px #DC3545' }}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        list="skill-suggestions"
                      />
                      <datalist id="skill-suggestions">
                        {SKILL_SUGGESTIONS.filter(s => !formData.skills.includes(s)).map(s => (
                          <option key={s} value={s} />
                        ))}
                      </datalist>
                      <IconButton
                        aria-label="Add skill"
                        icon={<Plus size={18} />}
                        onClick={handleAddSkill}
                        bg="linear-gradient(135deg, #DC3545 0%, #C82333 100%)"
                        color="white"
                        _hover={{ opacity: 0.9 }}
                        borderRadius="xl"
                      />
                    </HStack>
                    <Wrap spacing={2}>
                      {formData.skills.map(skill => (
                        <WrapItem key={skill}>
                          <Tag
                            size="lg"
                            borderRadius="full"
                            variant="solid"
                            bg="brand.500"
                            color="white"
                          >
                            <TagLabel>{skill}</TagLabel>
                            <TagCloseButton onClick={() => handleRemoveSkill(skill)} />
                          </Tag>
                        </WrapItem>
                      ))}
                      {formData.skills.length === 0 && (
                        <Text color="whiteAlpha.500" fontSize="sm">
                          No skills added yet. Add skills to improve your matches!
                        </Text>
                      )}
                    </Wrap>
                    {/* Quick add suggestions */}
                    <Box>
                      <Text color="whiteAlpha.600" fontSize="xs" mb={2}>
                        Suggestions:
                      </Text>
                      <Wrap spacing={1}>
                        {SKILL_SUGGESTIONS.filter(s => !formData.skills.includes(s)).slice(0, 8).map(skill => (
                          <WrapItem key={skill}>
                            <Tag
                              size="sm"
                              cursor="pointer"
                              variant="outline"
                              colorScheme="whiteAlpha"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  skills: [...prev.skills, skill]
                                }));
                              }}
                              _hover={{ bg: 'whiteAlpha.100' }}
                            >
                              <TagLabel>{skill}</TagLabel>
                              <Plus size={12} className="ml-1" />
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              {/* Interests */}
              <Card
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="2xl"
                w="full"
              >
                <CardHeader>
                  <HStack>
                    <Briefcase size={20} color="#DC3545" />
                    <Heading size="md" color="white">Industry Interests</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    <HStack>
                      <Input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add an industry interest (e.g., Technology, Healthcare)"
                        bg="whiteAlpha.100"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        color="white"
                        _placeholder={{ color: 'whiteAlpha.400' }}
                        borderRadius="xl"
                        _focus={{ borderColor: '#DC3545', boxShadow: '0 0 0 1px #DC3545' }}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                        list="interest-suggestions"
                      />
                      <datalist id="interest-suggestions">
                        {INTEREST_SUGGESTIONS.filter(i => !formData.interests.includes(i)).map(i => (
                          <option key={i} value={i} />
                        ))}
                      </datalist>
                      <IconButton
                        aria-label="Add interest"
                        icon={<Plus size={18} />}
                        onClick={handleAddInterest}
                        bg="linear-gradient(135deg, #DC3545 0%, #C82333 100%)"
                        color="white"
                        _hover={{ opacity: 0.9 }}
                        borderRadius="xl"
                      />
                    </HStack>
                    <Wrap spacing={2}>
                      {formData.interests.map(interest => (
                        <WrapItem key={interest}>
                          <Tag
                            size="lg"
                            borderRadius="full"
                            variant="solid"
                            bg="accent.500"
                            color="white"
                          >
                            <TagLabel>{interest}</TagLabel>
                            <TagCloseButton onClick={() => handleRemoveInterest(interest)} />
                          </Tag>
                        </WrapItem>
                      ))}
                      {formData.interests.length === 0 && (
                        <Text color="whiteAlpha.500" fontSize="sm">
                          No interests added yet. Add interests to discover relevant opportunities!
                        </Text>
                      )}
                    </Wrap>
                    {/* Quick add suggestions */}
                    <Box>
                      <Text color="whiteAlpha.600" fontSize="xs" mb={2}>
                        Suggestions:
                      </Text>
                      <Wrap spacing={1}>
                        {INTEREST_SUGGESTIONS.filter(i => !formData.interests.includes(i)).slice(0, 8).map(interest => (
                          <WrapItem key={interest}>
                            <Tag
                              size="sm"
                              cursor="pointer"
                              variant="outline"
                              colorScheme="whiteAlpha"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  interests: [...prev.interests, interest]
                                }));
                              }}
                              _hover={{ bg: 'whiteAlpha.100' }}
                            >
                              <TagLabel>{interest}</TagLabel>
                              <Plus size={12} className="ml-1" />
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
}
