/**
 * ML-Powered Recommendations Page
 * Shows personalized job recommendations based on resume analysis
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Icon,
  Button,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Divider,
  Alert,
  AlertIcon,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Collapse,
} from '@chakra-ui/react';
import { 
  Zap, 
  Target, 
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sparkles,
  Star
} from 'lucide-react';
import { InternshipCard, Internship } from '../components/InternshipCard';
import { InternshipDetailSlideOver, SkillMatchInfo } from '../components/InternshipDetailSlideOver';
import { ResumeUploadCard } from '../components/ResumeUploadCard';
import { MatchScoreCard, MatchBadge } from '../components/MatchScoreCard';
import { useMLRecommendations } from '../hooks/useMLRecommendations';
import { mockInternships } from '../data/mockInternships';
import { JobMatch } from '../services/mlMatcher';

interface MLRecommendationsPageProps {
  onSaveInternship: (id: string) => void;
  savedInternshipIds: string[];
}

export function MLRecommendationsPage({
  onSaveInternship,
  savedInternshipIds
}: MLRecommendationsPageProps) {
  const {
    resumeAnalysis,
    recommendations,
    isLoadingRecommendations,
    insights,
    getRecommendationsForJobs,
    getQuickMatch
  } = useMLRecommendations();
  
  const navigate = useNavigate();
  const [selectedInternship, setSelectedInternship] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<JobMatch | null>(null);
  const [selectedMatchInfo, setSelectedMatchInfo] = useState<SkillMatchInfo | null>(null);
  const [showResumeSection, setShowResumeSection] = useState(!resumeAnalysis);
  const [displayCount, setDisplayCount] = useState(8);
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  
  // Load recommendations when resume is analyzed
  useEffect(() => {
    if (resumeAnalysis && recommendations.length === 0) {
      getRecommendationsForJobs(mockInternships);
    }
  }, [resumeAnalysis, recommendations.length, getRecommendationsForJobs]);
  
  const displayedRecommendations = recommendations.slice(0, displayCount);
  const selectedDetail = recommendations.find(r => r.job.id === selectedInternship)?.job || null;
  
  const handleViewDetails = (id: string) => {
    setSelectedInternship(id);
    const match = recommendations.find(r => r.job.id === id);
    setSelectedMatch(match || null);
    
    // Build match info for the detail panel
    if (match) {
      const matchInfo: SkillMatchInfo = {
        matchedSkills: match.explanation.matchedSkills,
        missingSkills: match.explanation.missingSkills,
        overallScore: match.score.overall,
        skillScore: match.score.skillMatch,
        experienceScore: match.score.experienceMatch,
        keywordScore: match.score.keywordMatch
      };
      setSelectedMatchInfo(matchInfo);
    } else {
      setSelectedMatchInfo(null);
    }
  };
  
  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 8, recommendations.length));
  };
  
  const handleRefreshRecommendations = () => {
    getRecommendationsForJobs(mockInternships);
  };
  
  // Calculate stats
  const avgScore = recommendations.length > 0
    ? Math.round(recommendations.reduce((sum, r) => sum + r.score.overall, 0) / recommendations.length)
    : 0;
  const excellentMatches = recommendations.filter(r => r.score.overall >= 80).length;
  const goodMatches = recommendations.filter(r => r.score.overall >= 60 && r.score.overall < 80).length;
  
  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="6xl">
        <VStack align="stretch" spacing={8}>
          {/* Header */}
          <Box>
            <HStack mb={2}>
              <Icon as={Sparkles} boxSize={8} color="purple.500" />
              <Heading size="lg">ML-Powered Recommendations</Heading>
            </HStack>
            <Text color={textColor}>
              Get personalized internship matches based on AI analysis of your resume
            </Text>
          </Box>
          
          {/* Resume Analysis Section */}
          <Box>
            <HStack 
              justify="space-between" 
              cursor="pointer" 
              onClick={() => setShowResumeSection(!showResumeSection)}
              py={2}
            >
              <HStack>
                <Icon as={FileText} />
                <Text fontWeight="medium">
                  {resumeAnalysis ? 'Resume Analyzed' : 'Analyze Your Resume'}
                </Text>
                {resumeAnalysis && (
                  <Badge colorScheme="green">✓ Ready</Badge>
                )}
              </HStack>
              <Icon as={showResumeSection ? ChevronUp : ChevronDown} />
            </HStack>
            
            <Collapse in={showResumeSection}>
              <ResumeUploadCard 
                onAnalysisComplete={() => {
                  setShowResumeSection(false);
                }}
                showInsights={recommendations.length === 0}
              />
            </Collapse>
          </Box>
          
          {/* Stats Overview */}
          {resumeAnalysis && recommendations.length > 0 && (
            <Box
              bg={cardBg}
              borderRadius="xl"
              border="1px solid"
              borderColor={borderColor}
              p={6}
            >
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                <Stat>
                  <StatLabel>Total Matches</StatLabel>
                  <StatNumber color="purple.500">{recommendations.length}</StatNumber>
                  <StatHelpText>internships found</StatHelpText>
                </Stat>
                
                <Stat>
                  <StatLabel>Average Match</StatLabel>
                  <StatNumber color="blue.500">{avgScore}%</StatNumber>
                  <StatHelpText>compatibility</StatHelpText>
                </Stat>
                
                <Stat>
                  <StatLabel>Excellent Matches</StatLabel>
                  <StatNumber color="green.500">{excellentMatches}</StatNumber>
                  <StatHelpText>80%+ score</StatHelpText>
                </Stat>
                
                <Stat>
                  <StatLabel>Good Matches</StatLabel>
                  <StatNumber color="teal.500">{goodMatches}</StatNumber>
                  <StatHelpText>60-79% score</StatHelpText>
                </Stat>
              </SimpleGrid>
              
              {/* Your Resume Skills Summary */}
              <Box mt={6} pt={6} borderTop="1px solid" borderColor={borderColor}>
                <Text fontWeight="bold" mb={3} fontSize="md">📋 Skills Extracted from Your Resume</Text>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {resumeAnalysis.skills.slice(0, 20).map((skill, index) => (
                    <Badge 
                      key={index} 
                      colorScheme="green" 
                      variant="solid"
                      px={2} 
                      py={1} 
                      borderRadius="full"
                      fontSize="xs"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                  {resumeAnalysis.skills.length > 20 && (
                    <Badge colorScheme="gray" px={2} py={1} borderRadius="full" fontSize="xs">
                      +{resumeAnalysis.skills.length - 20} more
                    </Badge>
                  )}
                </Box>
                <Text fontSize="xs" color={textColor} mt={2}>
                  💡 {resumeAnalysis.skills.length} skills found • Experience: {resumeAnalysis.experienceLevel} level
                </Text>
              </Box>
              
              {/* Insights */}
              {insights && (
                <Box mt={6} pt={6} borderTop="1px solid" borderColor={borderColor}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {insights.careerSuggestions.slice(0, 2).map((suggestion, i) => (
                      <HStack key={i} p={3} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md">
                        <Icon as={Zap} color="blue.500" />
                        <Text fontSize="sm">{suggestion}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </Box>
          )}
          
          {/* No Resume State */}
          {!resumeAnalysis && (
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <Box>
                <Text fontWeight="medium">Upload your resume to get started</Text>
                <Text fontSize="sm">
                  Our ML system will analyze your skills and experience to find the best matching internships.
                </Text>
              </Box>
            </Alert>
          )}
          
          {/* Loading State */}
          {isLoadingRecommendations && (
            <Box textAlign="center" py={12}>
              <Spinner size="xl" color="purple.500" thickness="4px" />
              <Text mt={4} color={textColor}>Analyzing matches...</Text>
            </Box>
          )}
          
          {/* Recommendations List */}
          {!isLoadingRecommendations && recommendations.length > 0 && (
            <Tabs colorScheme="purple" variant="soft-rounded">
              <TabList mb={6}>
                <Tab>All Matches ({recommendations.length})</Tab>
                <Tab>Excellent ({excellentMatches})</Tab>
                <Tab>Good ({goodMatches})</Tab>
              </TabList>
              
              <TabPanels>
                {/* All Matches */}
                <TabPanel p={0}>
                  <VStack align="stretch" spacing={6}>
                    {displayedRecommendations.map((match, index) => (
                      <Box key={match.job.id} position="relative">
                        {/* Rank & Score Badges */}
                        <HStack position="absolute" top={-3} left={-2} zIndex={10} spacing={2}>
                          {index === 0 && match.score.overall >= 70 && (
                            <Badge 
                              colorScheme="yellow" 
                              fontSize="sm" 
                              px={3} 
                              py={1} 
                              borderRadius="full"
                              display="flex"
                              alignItems="center"
                              gap={1}
                            >
                              <Star size={14} /> Best Match
                            </Badge>
                          )}
                          <MatchBadge score={match.score.overall} />
                        </HStack>
                        
                        <Box 
                          bg={cardBg}
                          borderRadius="xl"
                          border="2px solid"
                          borderColor={match.score.overall >= 80 ? 'green.300' : match.score.overall >= 60 ? 'blue.300' : borderColor}
                          overflow="hidden"
                        >
                          <InternshipCard
                            internship={match.job}
                            variant={index === 0 ? 'hero' : 'default'}
                            onSave={onSaveInternship}
                            onViewDetails={handleViewDetails}
                            onApply={(id) => navigate(`/apply/${id}`)}
                            isSaved={savedInternshipIds.includes(match.job.id)}
                          />
                          
                          {/* Match Details */}
                          <Box px={6} pb={4}>
                            <Divider mb={4} />
                            
                            {/* Score Breakdown */}
                            <SimpleGrid columns={4} spacing={3} mb={4}>
                              <Box textAlign="center" p={2} bg={useColorModeValue('purple.50', 'purple.900')} borderRadius="md">
                                <Text fontSize="lg" fontWeight="bold" color="purple.500">
                                  {match.score.skillMatch}%
                                </Text>
                                <Text fontSize="xs" color={textColor}>Skills</Text>
                              </Box>
                              <Box textAlign="center" p={2} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md">
                                <Text fontSize="lg" fontWeight="bold" color="blue.500">
                                  {match.score.experienceMatch}%
                                </Text>
                                <Text fontSize="xs" color={textColor}>Experience</Text>
                              </Box>
                              <Box textAlign="center" p={2} bg={useColorModeValue('teal.50', 'teal.900')} borderRadius="md">
                                <Text fontSize="lg" fontWeight="bold" color="teal.500">
                                  {match.score.keywordMatch}%
                                </Text>
                                <Text fontSize="xs" color={textColor}>Keywords</Text>
                              </Box>
                              <Box textAlign="center" p={2} bg={useColorModeValue('green.50', 'green.900')} borderRadius="md">
                                <Text fontSize="lg" fontWeight="bold" color="green.500">
                                  {match.score.sectorMatch}%
                                </Text>
                                <Text fontSize="xs" color={textColor}>Industry</Text>
                              </Box>
                            </SimpleGrid>
                            
                            {/* Match Highlights */}
                            {match.explanation.highlights.length > 0 && (
                              <HStack flexWrap="wrap" gap={2}>
                                {match.explanation.highlights.slice(0, 2).map((highlight, i) => (
                                  <Badge key={i} colorScheme="purple" variant="subtle" fontSize="xs">
                                    ✨ {highlight}
                                  </Badge>
                                ))}
                              </HStack>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                    
                    {/* Load More */}
                    {displayCount < recommendations.length && (
                      <Box textAlign="center" pt={4}>
                        <Button
                          leftIcon={<RefreshCw size={18} />}
                          onClick={handleLoadMore}
                          variant="outline"
                          colorScheme="purple"
                        >
                          Show More Matches
                        </Button>
                        <Text fontSize="sm" color={textColor} mt={2}>
                          Showing {displayCount} of {recommendations.length} matches
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>
                
                {/* Excellent Matches */}
                <TabPanel p={0}>
                  <VStack align="stretch" spacing={6}>
                    {recommendations.filter(r => r.score.overall >= 80).map((match) => (
                      <Box key={match.job.id} position="relative">
                        <MatchBadge score={match.score.overall} />
                        <Box 
                          bg={cardBg}
                          borderRadius="xl"
                          border="2px solid"
                          borderColor="green.300"
                          overflow="hidden"
                          mt={2}
                        >
                          <InternshipCard
                            internship={match.job}
                            onSave={onSaveInternship}
                            onViewDetails={handleViewDetails}
                            onApply={(id) => navigate(`/apply/${id}`)}
                            isSaved={savedInternshipIds.includes(match.job.id)}
                          />
                        </Box>
                      </Box>
                    ))}
                    {excellentMatches === 0 && (
                      <Alert status="info">
                        <AlertIcon />
                        No excellent matches yet. Try updating your resume with more skills!
                      </Alert>
                    )}
                  </VStack>
                </TabPanel>
                
                {/* Good Matches */}
                <TabPanel p={0}>
                  <VStack align="stretch" spacing={6}>
                    {recommendations.filter(r => r.score.overall >= 60 && r.score.overall < 80).map((match) => (
                      <Box key={match.job.id} position="relative">
                        <MatchBadge score={match.score.overall} />
                        <Box 
                          bg={cardBg}
                          borderRadius="xl"
                          border="2px solid"
                          borderColor="blue.300"
                          overflow="hidden"
                          mt={2}
                        >
                          <InternshipCard
                            internship={match.job}
                            onSave={onSaveInternship}
                            onViewDetails={handleViewDetails}
                            onApply={(id) => navigate(`/apply/${id}`)}
                            isSaved={savedInternshipIds.includes(match.job.id)}
                          />
                        </Box>
                      </Box>
                    ))}
                    {goodMatches === 0 && (
                      <Alert status="info">
                        <AlertIcon />
                        No good matches in this range.
                      </Alert>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
          
          {/* No Recommendations State */}
          {!isLoadingRecommendations && resumeAnalysis && recommendations.length === 0 && (
            <Box textAlign="center" py={16}>
              <Icon as={Target} boxSize={16} color="gray.300" mb={4} />
              <Heading size="md" mb={2}>No matches found</Heading>
              <Text color={textColor} mb={6}>
                Try updating your resume with more skills or experience
              </Text>
              <Button 
                colorScheme="purple" 
                leftIcon={<RefreshCw size={18} />}
                onClick={handleRefreshRecommendations}
              >
                Refresh Recommendations
              </Button>
            </Box>
          )}
        </VStack>
      </Container>
      
      {/* Detail Slide Over */}
      <InternshipDetailSlideOver
        internship={selectedDetail}
        isOpen={selectedInternship !== null}
        onClose={() => {
          setSelectedInternship(null);
          setSelectedMatch(null);
          setSelectedMatchInfo(null);
        }}
        onApply={(id) => navigate(`/apply/${id}`)}
        onSave={onSaveInternship}
        isSaved={selectedInternship ? savedInternshipIds.includes(selectedInternship) : false}
        matchInfo={selectedMatchInfo}
      />
    </Box>
  );
}
