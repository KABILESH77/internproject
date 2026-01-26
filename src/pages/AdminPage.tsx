/**
 * Admin Dashboard - Application Performance & Analytics
 * Inspired by Naukri.com Performance Dashboard
 * 
 * Features:
 * - Profile Performance Summary
 * - Application Status Tracking
 * - Recruiter Actions Monitoring
 * - Job Application Analytics
 * - Detailed Application View
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Button,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Avatar,
  Flex,
  Divider,
  useDisclosure,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import {
  Eye,
  Search,
  Download,
  RefreshCw,
  Users,
  Briefcase,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Building2,
  ChevronRight,
  Mail,
  Phone,
  MoreVertical,
  MessageSquare,
  Send,
  UserCheck,
  BarChart3,
  Award,
  Bookmark,
} from 'lucide-react';
import { RecommendationWeights } from '../services/recommendationEngine';

// Application Status Types
type ApplicationStatus = 
  | 'applied' 
  | 'viewed' 
  | 'shortlisted' 
  | 'interview_scheduled' 
  | 'interviewed' 
  | 'offered' 
  | 'hired' 
  | 'rejected' 
  | 'withdrawn';

// Application Interface
interface Application {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateAvatar?: string;
  jobTitle: string;
  jobId: string;
  company: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  appliedDate: string;
  lastUpdated: string;
  status: ApplicationStatus;
  matchScore: number;
  resumeUrl?: string;
  skills: string[];
  experience: string;
  education: string;
  expectedSalary?: string;
  noticePeriod?: string;
  recruiterActions: RecruiterAction[];
}

interface RecruiterAction {
  action: string;
  date: string;
  recruiterName: string;
  notes?: string;
}

// Performance Metrics Interface
interface PerformanceMetrics {
  profileViews: number;
  profileViewsChange: number;
  searchAppearances: number;
  searchAppearancesChange: number;
  recruiterActions: number;
  recruiterActionsChange: number;
  applicationsSent: number;
  applicationsResponded: number;
  interviewsScheduled: number;
  offersReceived: number;
}

// Mock Data - Applications
const mockApplications: Application[] = [
  {
    id: 'APP001',
    candidateName: 'Rahul Sharma',
    candidateEmail: 'rahul.sharma@email.com',
    candidatePhone: '+91 98765 43210',
    jobTitle: 'Software Engineering Intern',
    jobId: 'JOB001',
    company: 'TechGov Solutions',
    location: 'Washington, DC',
    jobType: 'Internship',
    appliedDate: '2026-01-20',
    lastUpdated: '2026-01-24',
    status: 'shortlisted',
    matchScore: 87,
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Git'],
    experience: 'Fresher - 0 years',
    education: 'B.Tech Computer Science, IIT Delhi (2026)',
    expectedSalary: '$1,500/month',
    noticePeriod: 'Immediate',
    recruiterActions: [
      { action: 'Viewed Profile', date: '2026-01-21', recruiterName: 'Sarah Johnson' },
      { action: 'Shortlisted', date: '2026-01-24', recruiterName: 'Sarah Johnson', notes: 'Strong technical skills' },
    ],
  },
  {
    id: 'APP002',
    candidateName: 'Priya Patel',
    candidateEmail: 'priya.patel@email.com',
    candidatePhone: '+91 87654 32109',
    jobTitle: 'Data Analysis Intern',
    jobId: 'JOB002',
    company: 'Department of Education',
    location: 'Remote',
    jobType: 'Internship',
    appliedDate: '2026-01-18',
    lastUpdated: '2026-01-23',
    status: 'interview_scheduled',
    matchScore: 92,
    skills: ['Python', 'SQL', 'Tableau', 'Excel', 'Statistics'],
    experience: '6 months internship',
    education: 'M.Sc Data Science, Stanford University (2026)',
    expectedSalary: '$1,200/month',
    noticePeriod: '15 days',
    recruiterActions: [
      { action: 'Viewed Profile', date: '2026-01-19', recruiterName: 'Mike Chen' },
      { action: 'Shortlisted', date: '2026-01-20', recruiterName: 'Mike Chen' },
      { action: 'Interview Scheduled', date: '2026-01-23', recruiterName: 'Mike Chen', notes: 'Technical round on Jan 28' },
    ],
  },
  {
    id: 'APP003',
    candidateName: 'Arjun Kumar',
    candidateEmail: 'arjun.kumar@email.com',
    candidatePhone: '+91 76543 21098',
    jobTitle: 'UX Research Intern',
    jobId: 'JOB003',
    company: 'Digital Services Agency',
    location: 'San Francisco, CA',
    jobType: 'Internship',
    appliedDate: '2026-01-15',
    lastUpdated: '2026-01-22',
    status: 'rejected',
    matchScore: 65,
    skills: ['Figma', 'User Research', 'Prototyping', 'Sketch'],
    experience: 'Fresher',
    education: 'B.Des, NID Ahmedabad (2026)',
    recruiterActions: [
      { action: 'Viewed Profile', date: '2026-01-16', recruiterName: 'Emily Davis' },
      { action: 'Rejected', date: '2026-01-22', recruiterName: 'Emily Davis', notes: 'Looking for more experience' },
    ],
  },
  {
    id: 'APP004',
    candidateName: 'Sneha Reddy',
    candidateEmail: 'sneha.reddy@email.com',
    candidatePhone: '+91 65432 10987',
    jobTitle: 'Product Management Intern',
    jobId: 'JOB004',
    company: 'Innovation Labs',
    location: 'New York, NY',
    jobType: 'Internship',
    appliedDate: '2026-01-22',
    lastUpdated: '2026-01-24',
    status: 'viewed',
    matchScore: 78,
    skills: ['Product Strategy', 'Agile', 'SQL', 'Analytics', 'Communication'],
    experience: '3 months internship',
    education: 'MBA, ISB Hyderabad (2026)',
    expectedSalary: '$2,000/month',
    noticePeriod: '30 days',
    recruiterActions: [
      { action: 'Viewed Profile', date: '2026-01-24', recruiterName: 'Alex Thompson' },
    ],
  },
  {
    id: 'APP005',
    candidateName: 'Vikram Singh',
    candidateEmail: 'vikram.singh@email.com',
    candidatePhone: '+91 54321 09876',
    jobTitle: 'Software Engineering Intern',
    jobId: 'JOB001',
    company: 'TechGov Solutions',
    location: 'Washington, DC',
    jobType: 'Internship',
    appliedDate: '2026-01-19',
    lastUpdated: '2026-01-25',
    status: 'offered',
    matchScore: 95,
    skills: ['React', 'Node.js', 'AWS', 'MongoDB', 'Docker'],
    experience: '1 year internship',
    education: 'B.Tech Computer Science, BITS Pilani (2026)',
    expectedSalary: '$1,800/month',
    noticePeriod: 'Immediate',
    recruiterActions: [
      { action: 'Viewed Profile', date: '2026-01-20', recruiterName: 'Sarah Johnson' },
      { action: 'Shortlisted', date: '2026-01-21', recruiterName: 'Sarah Johnson' },
      { action: 'Interview Scheduled', date: '2026-01-22', recruiterName: 'Sarah Johnson' },
      { action: 'Interviewed', date: '2026-01-24', recruiterName: 'Sarah Johnson', notes: 'Excellent performance' },
      { action: 'Offer Extended', date: '2026-01-25', recruiterName: 'HR Team' },
    ],
  },
  {
    id: 'APP006',
    candidateName: 'Ananya Gupta',
    candidateEmail: 'ananya.gupta@email.com',
    candidatePhone: '+91 43210 98765',
    jobTitle: 'Marketing Intern',
    jobId: 'JOB005',
    company: 'GreenTech Initiative',
    location: 'Austin, TX',
    jobType: 'Internship',
    appliedDate: '2026-01-23',
    lastUpdated: '2026-01-23',
    status: 'applied',
    matchScore: 72,
    skills: ['Digital Marketing', 'SEO', 'Content Writing', 'Social Media'],
    experience: 'Fresher',
    education: 'BBA Marketing, Christ University (2026)',
    recruiterActions: [],
  },
  {
    id: 'APP007',
    candidateName: 'Karthik Menon',
    candidateEmail: 'karthik.menon@email.com',
    candidatePhone: '+91 32109 87654',
    jobTitle: 'Healthcare Policy Intern',
    jobId: 'JOB006',
    company: 'HealthFirst Nonprofit',
    location: 'Chicago, IL',
    jobType: 'Internship',
    appliedDate: '2026-01-21',
    lastUpdated: '2026-01-26',
    status: 'hired',
    matchScore: 88,
    skills: ['Policy Analysis', 'Research', 'Healthcare', 'MS Office'],
    experience: '6 months research assistant',
    education: 'MPH, Johns Hopkins University (2026)',
    recruiterActions: [
      { action: 'Viewed Profile', date: '2026-01-22', recruiterName: 'Lisa Wang' },
      { action: 'Shortlisted', date: '2026-01-23', recruiterName: 'Lisa Wang' },
      { action: 'Interview Scheduled', date: '2026-01-24', recruiterName: 'Lisa Wang' },
      { action: 'Interviewed', date: '2026-01-25', recruiterName: 'Lisa Wang' },
      { action: 'Hired', date: '2026-01-26', recruiterName: 'HR Team', notes: 'Start date: Feb 1, 2026' },
    ],
  },
];

// Mock Performance Metrics
const mockMetrics: PerformanceMetrics = {
  profileViews: 1247,
  profileViewsChange: 23,
  searchAppearances: 3892,
  searchAppearancesChange: 15,
  recruiterActions: 89,
  recruiterActionsChange: 45,
  applicationsSent: 156,
  applicationsResponded: 67,
  interviewsScheduled: 12,
  offersReceived: 3,
};

// Status Config
const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: React.ElementType }> = {
  applied: { label: 'Applied', color: 'blue', icon: Send },
  viewed: { label: 'Viewed by Recruiter', color: 'purple', icon: Eye },
  shortlisted: { label: 'Shortlisted', color: 'cyan', icon: Bookmark },
  interview_scheduled: { label: 'Interview Scheduled', color: 'orange', icon: Calendar },
  interviewed: { label: 'Interviewed', color: 'yellow', icon: MessageSquare },
  offered: { label: 'Offer Received', color: 'green', icon: Award },
  hired: { label: 'Hired', color: 'green', icon: CheckCircle },
  rejected: { label: 'Not Selected', color: 'red', icon: XCircle },
  withdrawn: { label: 'Withdrawn', color: 'gray', icon: AlertCircle },
};

interface AdminPageProps {
  weights: RecommendationWeights;
  onWeightsChange: (weights: RecommendationWeights) => void;
}

export function AdminPage({ weights, onWeightsChange }: AdminPageProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Filter applications
  const filteredApplications = useMemo(() => {
    return mockApplications.filter(app => {
      const matchesSearch = 
        app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = mockApplications.length;
    const byStatus: Record<ApplicationStatus, number> = {
      applied: 0,
      viewed: 0,
      shortlisted: 0,
      interview_scheduled: 0,
      interviewed: 0,
      offered: 0,
      hired: 0,
      rejected: 0,
      withdrawn: 0,
    };

    mockApplications.forEach(app => {
      byStatus[app.status]++;
    });

    const responseRate = total > 0 ? Math.round((total - byStatus.applied) / total * 100) : 0;
    const successRate = total > 0 ? Math.round((byStatus.offered + byStatus.hired) / total * 100) : 0;

    return { total, byStatus, responseRate, successRate };
  }, []);

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // View application details
  const handleViewApplication = (app: Application) => {
    setSelectedApplication(app);
    onDrawerOpen();
  };

  // Get status badge
  const getStatusBadge = (status: ApplicationStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge 
        colorScheme={config.color} 
        display="flex" 
        alignItems="center" 
        gap={1}
        px={2}
        py={1}
        borderRadius="full"
      >
        <Icon size={12} />
        {config.label}
      </Badge>
    );
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={8}>
      <Container maxW="7xl">
        <VStack align="stretch" spacing={8}>
          {/* Header */}
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Box>
              <HStack mb={2}>
                <BarChart3 size={32} color="#6B46C1" />
                <Heading size="lg">Performance Dashboard</Heading>
              </HStack>
              <Text color={textColor}>
                Monitor applications, track recruiter actions, and analyze job performance
              </Text>
            </Box>
            <HStack>
              <Button
                leftIcon={<RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />}
                onClick={handleRefresh}
                isLoading={isRefreshing}
                variant="outline"
              >
                Refresh
              </Button>
              <Button leftIcon={<Download size={18} />} colorScheme="purple">
                Export Report
              </Button>
            </HStack>
          </Flex>

          {/* Performance Summary Cards */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
              <Stat>
                <StatLabel display="flex" alignItems="center" gap={2}>
                  <Eye size={16} color="#6B46C1" />
                  Profile Views
                </StatLabel>
                <StatNumber fontSize="3xl" color="purple.500">
                  {mockMetrics.profileViews.toLocaleString()}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type={mockMetrics.profileViewsChange > 0 ? 'increase' : 'decrease'} />
                  {Math.abs(mockMetrics.profileViewsChange)}% vs last week
                </StatHelpText>
              </Stat>
            </Box>

            <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
              <Stat>
                <StatLabel display="flex" alignItems="center" gap={2}>
                  <Search size={16} color="#3182CE" />
                  Search Appearances
                </StatLabel>
                <StatNumber fontSize="3xl" color="blue.500">
                  {mockMetrics.searchAppearances.toLocaleString()}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type={mockMetrics.searchAppearancesChange > 0 ? 'increase' : 'decrease'} />
                  {Math.abs(mockMetrics.searchAppearancesChange)}% vs last week
                </StatHelpText>
              </Stat>
            </Box>

            <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
              <Stat>
                <StatLabel display="flex" alignItems="center" gap={2}>
                  <UserCheck size={16} color="#38A169" />
                  Recruiter Actions
                </StatLabel>
                <StatNumber fontSize="3xl" color="green.500">
                  {mockMetrics.recruiterActions}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type={mockMetrics.recruiterActionsChange > 0 ? 'increase' : 'decrease'} />
                  {Math.abs(mockMetrics.recruiterActionsChange)}% vs last week
                </StatHelpText>
              </Stat>
            </Box>

            <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
              <Stat>
                <StatLabel display="flex" alignItems="center" gap={2}>
                  <Award size={16} color="#DD6B20" />
                  Offers Received
                </StatLabel>
                <StatNumber fontSize="3xl" color="orange.500">
                  {mockMetrics.offersReceived}
                </StatNumber>
                <StatHelpText>
                  {mockMetrics.interviewsScheduled} interviews scheduled
                </StatHelpText>
              </Stat>
            </Box>
          </SimpleGrid>

          {/* Application Funnel */}
          <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
            <Heading size="md" mb={6}>Application Funnel</Heading>
            <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={4}>
              {[
                { label: 'Applied', count: stats.byStatus.applied + stats.byStatus.viewed, color: 'blue' },
                { label: 'Shortlisted', count: stats.byStatus.shortlisted, color: 'cyan' },
                { label: 'Interviewed', count: stats.byStatus.interview_scheduled + stats.byStatus.interviewed, color: 'orange' },
                { label: 'Offered', count: stats.byStatus.offered, color: 'green' },
                { label: 'Hired', count: stats.byStatus.hired, color: 'green' },
              ].map((stage, idx) => (
                <Box key={stage.label} textAlign="center" position="relative">
                  <CircularProgress 
                    value={stage.count > 0 ? (stage.count / stats.total) * 100 : 0} 
                    color={`${stage.color}.400`}
                    size="100px"
                    thickness="8px"
                  >
                    <CircularProgressLabel>
                      <Text fontSize="2xl" fontWeight="bold">{stage.count}</Text>
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text mt={2} fontWeight="medium">{stage.label}</Text>
                  {idx < 4 && (
                    <Box 
                      display={{ base: 'none', md: 'block' }}
                      position="absolute" 
                      right="-20px" 
                      top="40px"
                    >
                      <ChevronRight size={24} color="gray" />
                    </Box>
                  )}
                </Box>
              ))}
            </SimpleGrid>
            <Divider my={6} />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Box textAlign="center" p={4} bg={useColorModeValue('green.50', 'green.900')} borderRadius="lg">
                <Text fontSize="3xl" fontWeight="bold" color="green.500">{stats.responseRate}%</Text>
                <Text fontSize="sm" color={textColor}>Response Rate</Text>
              </Box>
              <Box textAlign="center" p={4} bg={useColorModeValue('purple.50', 'purple.900')} borderRadius="lg">
                <Text fontSize="3xl" fontWeight="bold" color="purple.500">{stats.successRate}%</Text>
                <Text fontSize="sm" color={textColor}>Success Rate</Text>
              </Box>
              <Box textAlign="center" p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="lg">
                <Text fontSize="3xl" fontWeight="bold" color="blue.500">{stats.total}</Text>
                <Text fontSize="sm" color={textColor}>Total Applications</Text>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Main Tabs */}
          <Tabs 
            index={selectedTab} 
            onChange={setSelectedTab}
            colorScheme="purple"
            variant="enclosed-colored"
          >
            <TabList>
              <Tab>
                <HStack>
                  <FileText size={18} />
                  <Text>All Applications ({stats.total})</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack>
                  <UserCheck size={18} />
                  <Text>Recruiter Actions ({mockMetrics.recruiterActions})</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack>
                  <Briefcase size={18} />
                  <Text>Job Analytics</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* All Applications Tab */}
              <TabPanel p={0} pt={6}>
                <Box bg={cardBg} borderRadius="xl" border="1px solid" borderColor={borderColor} overflow="hidden">
                  {/* Filters */}
                  <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
                    <Flex gap={4} wrap="wrap">
                      <InputGroup maxW="300px">
                        <InputLeftElement>
                          <Search size={18} color="gray" />
                        </InputLeftElement>
                        <Input
                          placeholder="Search by name, job, company..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </InputGroup>
                      <Select 
                        maxW="200px" 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
                      >
                        <option value="all">All Status</option>
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <option key={key} value={key}>{config.label}</option>
                        ))}
                      </Select>
                      <Select maxW="200px" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                      </Select>
                    </Flex>
                  </Box>

                  {/* Applications Table */}
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                        <Tr>
                          <Th>Candidate</Th>
                          <Th>Job Applied</Th>
                          <Th>Applied Date</Th>
                          <Th>Match Score</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredApplications.map((app) => (
                          <Tr 
                            key={app.id} 
                            _hover={{ bg: hoverBg }}
                            cursor="pointer"
                            onClick={() => handleViewApplication(app)}
                          >
                            <Td>
                              <HStack>
                                <Avatar size="sm" name={app.candidateName} />
                                <Box>
                                  <Text fontWeight="medium">{app.candidateName}</Text>
                                  <Text fontSize="xs" color={textColor}>{app.candidateEmail}</Text>
                                </Box>
                              </HStack>
                            </Td>
                            <Td>
                              <Box>
                                <Text fontWeight="medium">{app.jobTitle}</Text>
                                <Text fontSize="xs" color={textColor}>
                                  {app.company} • {app.location}
                                </Text>
                              </Box>
                            </Td>
                            <Td>
                              <Text fontSize="sm">{new Date(app.appliedDate).toLocaleDateString()}</Text>
                              <Text fontSize="xs" color={textColor}>
                                {Math.floor((Date.now() - new Date(app.appliedDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                              </Text>
                            </Td>
                            <Td>
                              <HStack>
                                <CircularProgress 
                                  value={app.matchScore} 
                                  color={app.matchScore >= 80 ? 'green.400' : app.matchScore >= 60 ? 'orange.400' : 'red.400'}
                                  size="40px"
                                  thickness="10px"
                                >
                                  <CircularProgressLabel fontSize="xs">
                                    {app.matchScore}%
                                  </CircularProgressLabel>
                                </CircularProgress>
                              </HStack>
                            </Td>
                            <Td>{getStatusBadge(app.status)}</Td>
                            <Td>
                              <HStack>
                                <Tooltip label="View Details">
                                  <IconButton
                                    aria-label="View"
                                    icon={<Eye size={18} />}
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewApplication(app);
                                    }}
                                  />
                                </Tooltip>
                                <Menu>
                                  <MenuButton
                                    as={IconButton}
                                    aria-label="More options"
                                    icon={<MoreVertical size={18} />}
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <MenuList>
                                    <MenuItem icon={<Mail size={16} />}>Send Email</MenuItem>
                                    <MenuItem icon={<Phone size={16} />}>Call Candidate</MenuItem>
                                    <MenuItem icon={<Bookmark size={16} />}>Shortlist</MenuItem>
                                    <MenuItem icon={<Calendar size={16} />}>Schedule Interview</MenuItem>
                                    <MenuItem icon={<XCircle size={16} />} color="red.500">Reject</MenuItem>
                                  </MenuList>
                                </Menu>
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>

                  {filteredApplications.length === 0 && (
                    <Box p={12} textAlign="center">
                      <AlertCircle size={48} color="gray" style={{ margin: '0 auto 16px' }} />
                      <Text color={textColor}>No applications found matching your criteria</Text>
                    </Box>
                  )}
                </Box>
              </TabPanel>

              {/* Recruiter Actions Tab */}
              <TabPanel p={0} pt={6}>
                <Box bg={cardBg} borderRadius="xl" border="1px solid" borderColor={borderColor} p={6}>
                  <Heading size="md" mb={6}>Recent Recruiter Actions</Heading>
                  <VStack align="stretch" spacing={4}>
                    {mockApplications
                      .flatMap(app => 
                        app.recruiterActions.map(action => ({
                          ...action,
                          candidateName: app.candidateName,
                          jobTitle: app.jobTitle,
                          company: app.company,
                          appId: app.id,
                        }))
                      )
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 15)
                      .map((action, idx) => (
                        <Box 
                          key={idx} 
                          p={4} 
                          borderRadius="lg" 
                          border="1px solid" 
                          borderColor={borderColor}
                          _hover={{ bg: hoverBg }}
                        >
                          <Flex justify="space-between" align="start">
                            <HStack align="start" spacing={4}>
                              <Box 
                                p={2} 
                                borderRadius="full" 
                                bg={
                                  action.action.includes('Hired') || action.action.includes('Offer') ? 'green.100' :
                                  action.action.includes('Rejected') ? 'red.100' :
                                  action.action.includes('Interview') ? 'orange.100' :
                                  action.action.includes('Shortlisted') ? 'cyan.100' :
                                  'purple.100'
                                }
                              >
                                {action.action.includes('Viewed') && <Eye size={20} color="#6B46C1" />}
                                {action.action.includes('Shortlisted') && <Bookmark size={20} color="#0BC5EA" />}
                                {action.action.includes('Interview') && <Calendar size={20} color="#DD6B20" />}
                                {action.action.includes('Offer') && <Award size={20} color="#38A169" />}
                                {action.action.includes('Hired') && <CheckCircle size={20} color="#38A169" />}
                                {action.action.includes('Rejected') && <XCircle size={20} color="#E53E3E" />}
                              </Box>
                              <Box>
                                <Text fontWeight="medium">{action.action}</Text>
                                <Text fontSize="sm" color={textColor}>
                                  {action.candidateName} for {action.jobTitle} at {action.company}
                                </Text>
                                {action.notes && (
                                  <Text fontSize="sm" color="purple.500" mt={1}>
                                    Note: {action.notes}
                                  </Text>
                                )}
                              </Box>
                            </HStack>
                            <VStack align="end" spacing={0}>
                              <Text fontSize="sm" color={textColor}>
                                {new Date(action.date).toLocaleDateString()}
                              </Text>
                              <Text fontSize="xs" color={textColor}>
                                by {action.recruiterName}
                              </Text>
                            </VStack>
                          </Flex>
                        </Box>
                      ))}
                  </VStack>
                </Box>
              </TabPanel>

              {/* Job Analytics Tab */}
              <TabPanel p={0} pt={6}>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  {/* Applications by Job */}
                  <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
                    <Heading size="md" mb={6}>Applications by Job</Heading>
                    <VStack align="stretch" spacing={4}>
                      {[
                        { job: 'Software Engineering Intern', company: 'TechGov Solutions', count: 45, growth: 12 },
                        { job: 'Data Analysis Intern', company: 'Dept. of Education', count: 38, growth: 8 },
                        { job: 'UX Research Intern', company: 'Digital Services', count: 29, growth: -5 },
                        { job: 'Product Management Intern', company: 'Innovation Labs', count: 24, growth: 15 },
                        { job: 'Marketing Intern', company: 'GreenTech Initiative', count: 20, growth: 3 },
                      ].map((item, idx) => (
                        <Box key={idx}>
                          <Flex justify="space-between" mb={2}>
                            <Box>
                              <Text fontWeight="medium">{item.job}</Text>
                              <Text fontSize="xs" color={textColor}>{item.company}</Text>
                            </Box>
                            <HStack>
                              <Text fontWeight="bold">{item.count}</Text>
                              <Badge colorScheme={item.growth >= 0 ? 'green' : 'red'}>
                                {item.growth >= 0 ? '+' : ''}{item.growth}%
                              </Badge>
                            </HStack>
                          </Flex>
                          <Progress 
                            value={(item.count / 45) * 100} 
                            colorScheme="purple" 
                            size="sm" 
                            borderRadius="full"
                          />
                        </Box>
                      ))}
                    </VStack>
                  </Box>

                  {/* Top Skills in Demand */}
                  <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
                    <Heading size="md" mb={6}>Top Skills in Demand</Heading>
                    <Wrap spacing={3}>
                      {[
                        { skill: 'React', count: 156 },
                        { skill: 'Python', count: 142 },
                        { skill: 'JavaScript', count: 138 },
                        { skill: 'SQL', count: 95 },
                        { skill: 'Node.js', count: 87 },
                        { skill: 'Data Analysis', count: 76 },
                        { skill: 'AWS', count: 65 },
                        { skill: 'Machine Learning', count: 54 },
                        { skill: 'TypeScript', count: 48 },
                        { skill: 'Figma', count: 42 },
                      ].map((item) => (
                        <WrapItem key={item.skill}>
                          <Tag size="lg" colorScheme="purple" borderRadius="full" px={4} py={2}>
                            <TagLabel>{item.skill}</TagLabel>
                            <Badge ml={2} colorScheme="purple" variant="solid">
                              {item.count}
                            </Badge>
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>

                  {/* Application Timeline */}
                  <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
                    <Heading size="md" mb={6}>Weekly Application Trend</Heading>
                    <VStack align="stretch" spacing={3}>
                      {[
                        { day: 'Mon', count: 24 },
                        { day: 'Tue', count: 32 },
                        { day: 'Wed', count: 28 },
                        { day: 'Thu', count: 45 },
                        { day: 'Fri', count: 38 },
                        { day: 'Sat', count: 15 },
                        { day: 'Sun', count: 12 },
                      ].map((item) => (
                        <Flex key={item.day} align="center" gap={4}>
                          <Text w="40px" fontSize="sm" fontWeight="medium">{item.day}</Text>
                          <Box flex={1}>
                            <Progress 
                              value={(item.count / 45) * 100} 
                              colorScheme="blue" 
                              size="lg" 
                              borderRadius="full"
                            />
                          </Box>
                          <Text w="40px" fontSize="sm" textAlign="right">{item.count}</Text>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>

                  {/* Location Distribution */}
                  <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderColor}>
                    <Heading size="md" mb={6}>Applications by Location</Heading>
                    <VStack align="stretch" spacing={4}>
                      {[
                        { location: 'Remote', count: 68, percentage: 44 },
                        { location: 'Washington, DC', count: 32, percentage: 21 },
                        { location: 'San Francisco, CA', count: 24, percentage: 15 },
                        { location: 'New York, NY', count: 18, percentage: 12 },
                        { location: 'Other', count: 14, percentage: 8 },
                      ].map((item) => (
                        <Box key={item.location}>
                          <Flex justify="space-between" mb={1}>
                            <HStack>
                              <MapPin size={14} />
                              <Text fontSize="sm">{item.location}</Text>
                            </HStack>
                            <Text fontSize="sm" fontWeight="medium">{item.count} ({item.percentage}%)</Text>
                          </Flex>
                          <Progress 
                            value={item.percentage} 
                            colorScheme="teal" 
                            size="sm" 
                            borderRadius="full"
                          />
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>

      {/* Application Detail Drawer */}
      <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Application Details
          </DrawerHeader>
          <DrawerBody py={6}>
            {selectedApplication && (
              <VStack align="stretch" spacing={6}>
                {/* Candidate Info */}
                <Box>
                  <HStack spacing={4} mb={4}>
                    <Avatar size="xl" name={selectedApplication.candidateName} />
                    <Box>
                      <Heading size="md">{selectedApplication.candidateName}</Heading>
                      <Text color={textColor}>{selectedApplication.education}</Text>
                      {getStatusBadge(selectedApplication.status)}
                    </Box>
                  </HStack>
                  <SimpleGrid columns={2} spacing={4}>
                    <HStack>
                      <Mail size={16} />
                      <Text fontSize="sm">{selectedApplication.candidateEmail}</Text>
                    </HStack>
                    <HStack>
                      <Phone size={16} />
                      <Text fontSize="sm">{selectedApplication.candidatePhone}</Text>
                    </HStack>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Job Details */}
                <Box>
                  <Heading size="sm" mb={3}>Applied For</Heading>
                  <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
                    <Text fontWeight="bold">{selectedApplication.jobTitle}</Text>
                    <HStack mt={2} color={textColor} fontSize="sm">
                      <Building2 size={14} />
                      <Text>{selectedApplication.company}</Text>
                    </HStack>
                    <HStack mt={1} color={textColor} fontSize="sm">
                      <MapPin size={14} />
                      <Text>{selectedApplication.location}</Text>
                    </HStack>
                  </Box>
                </Box>

                {/* Match Score */}
                <Box>
                  <Heading size="sm" mb={3}>Match Score</Heading>
                  <HStack>
                    <CircularProgress 
                      value={selectedApplication.matchScore} 
                      color={selectedApplication.matchScore >= 80 ? 'green.400' : 'orange.400'}
                      size="80px"
                      thickness="10px"
                    >
                      <CircularProgressLabel fontWeight="bold">
                        {selectedApplication.matchScore}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <Box>
                      <Text fontWeight="medium">
                        {selectedApplication.matchScore >= 80 ? 'Excellent Match' : 
                         selectedApplication.matchScore >= 60 ? 'Good Match' : 'Fair Match'}
                      </Text>
                      <Text fontSize="sm" color={textColor}>
                        Based on skills, experience & requirements
                      </Text>
                    </Box>
                  </HStack>
                </Box>

                {/* Skills */}
                <Box>
                  <Heading size="sm" mb={3}>Skills</Heading>
                  <Wrap>
                    {selectedApplication.skills.map((skill) => (
                      <WrapItem key={skill}>
                        <Tag colorScheme="purple">{skill}</Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>

                {/* Experience & Education */}
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Heading size="sm" mb={2}>Experience</Heading>
                    <Text fontSize="sm">{selectedApplication.experience}</Text>
                  </Box>
                  <Box>
                    <Heading size="sm" mb={2}>Education</Heading>
                    <Text fontSize="sm">{selectedApplication.education}</Text>
                  </Box>
                </SimpleGrid>

                {/* Additional Info */}
                {(selectedApplication.expectedSalary || selectedApplication.noticePeriod) && (
                  <SimpleGrid columns={2} spacing={4}>
                    {selectedApplication.expectedSalary && (
                      <Box>
                        <Heading size="sm" mb={2}>Expected Salary</Heading>
                        <Text fontSize="sm">{selectedApplication.expectedSalary}</Text>
                      </Box>
                    )}
                    {selectedApplication.noticePeriod && (
                      <Box>
                        <Heading size="sm" mb={2}>Notice Period</Heading>
                        <Text fontSize="sm">{selectedApplication.noticePeriod}</Text>
                      </Box>
                    )}
                  </SimpleGrid>
                )}

                <Divider />

                {/* Recruiter Actions Timeline */}
                <Box>
                  <Heading size="sm" mb={4}>Activity Timeline</Heading>
                  <VStack align="stretch" spacing={3}>
                    {selectedApplication.recruiterActions.length === 0 ? (
                      <Text fontSize="sm" color={textColor}>No actions yet</Text>
                    ) : (
                      selectedApplication.recruiterActions.map((action, idx) => (
                        <Box 
                          key={idx} 
                          p={3} 
                          bg={useColorModeValue('gray.50', 'gray.700')} 
                          borderRadius="lg"
                          borderLeft="3px solid"
                          borderLeftColor="purple.500"
                        >
                          <Flex justify="space-between">
                            <Text fontWeight="medium">{action.action}</Text>
                            <Text fontSize="xs" color={textColor}>
                              {new Date(action.date).toLocaleDateString()}
                            </Text>
                          </Flex>
                          <Text fontSize="sm" color={textColor}>by {action.recruiterName}</Text>
                          {action.notes && (
                            <Text fontSize="sm" color="purple.500" mt={1}>{action.notes}</Text>
                          )}
                        </Box>
                      ))
                    )}
                  </VStack>
                </Box>

                {/* Quick Actions */}
                <Box pt={4}>
                  <SimpleGrid columns={2} spacing={3}>
                    <Button leftIcon={<Mail size={18} />} colorScheme="blue" variant="outline">
                      Send Email
                    </Button>
                    <Button leftIcon={<Phone size={18} />} colorScheme="green" variant="outline">
                      Call
                    </Button>
                    <Button leftIcon={<Calendar size={18} />} colorScheme="orange">
                      Schedule Interview
                    </Button>
                    <Button leftIcon={<Award size={18} />} colorScheme="purple">
                      Extend Offer
                    </Button>
                  </SimpleGrid>
                </Box>
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
