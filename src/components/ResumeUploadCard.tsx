/**
 * Resume Upload Component
 * Allows users to paste or upload their resume for ML analysis
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Textarea,
  Button,
  Icon,
  Progress,
  Badge,
  Wrap,
  WrapItem,
  useColorModeValue,
  Collapse,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Tooltip,
} from '@chakra-ui/react';
import { 
  Upload, 
  FileText, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Save,
  Trash2,
  Zap
} from 'lucide-react';
import { useMLRecommendations } from '../hooks/useMLRecommendations';

interface ResumeUploadCardProps {
  onAnalysisComplete?: () => void;
  showInsights?: boolean;
}

export function ResumeUploadCard({ onAnalysisComplete, showInsights = true }: ResumeUploadCardProps) {
  const {
    resumeText,
    resumeAnalysis,
    isAnalyzingResume,
    resumeError,
    insights,
    setResumeText,
    analyzeResumeText,
    uploadResumeFile,
    clearResume,
    saveResumeToProfile
  } = useMLRecommendations();
  
  const [localText, setLocalText] = useState(resumeText);
  const [showDetails, setShowDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  
  const handleAnalyze = async () => {
    const analysis = await analyzeResumeText(localText);
    if (analysis && onAnalysisComplete) {
      onAnalysisComplete();
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadResumeFile(file);
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await saveResumeToProfile();
      setSaveMessage('Resume saved to profile!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch {
      setSaveMessage('Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleClear = () => {
    setLocalText('');
    clearResume();
  };
  
  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case 'entry': return 'green';
      case 'junior': return 'blue';
      case 'mid': return 'purple';
      case 'senior': return 'orange';
      default: return 'gray';
    }
  };
  
  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      p={6}
      shadow="sm"
    >
      <VStack align="stretch" spacing={4}>
        {/* Header */}
        <HStack justify="space-between">
          <HStack>
            <Icon as={FileText} boxSize={5} color="blue.500" />
            <Text fontSize="lg" fontWeight="semibold">Resume Analysis</Text>
          </HStack>
          {resumeAnalysis && (
            <Badge colorScheme="green" fontSize="sm">
              <HStack spacing={1}>
                <Check size={14} />
                <Text>Analyzed</Text>
              </HStack>
            </Badge>
          )}
        </HStack>
        
        {/* Description */}
        <Text fontSize="sm" color={textColor}>
          Paste your resume below or upload a file. Our ML system will analyze your skills 
          and experience to match you with the best internship opportunities.
        </Text>
        
        {/* Error Alert */}
        {resumeError && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription>{resumeError}</AlertDescription>
            </Box>
          </Alert>
        )}
        
        {/* Success/Save Message */}
        {saveMessage && (
          <Alert status={saveMessage.includes('Failed') ? 'error' : 'success'} borderRadius="md">
            <AlertIcon />
            {saveMessage}
          </Alert>
        )}
        
        {/* Textarea for resume */}
        <Textarea
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          placeholder="Paste your resume content here...

Example:
John Doe
Software Developer

Skills: Python, JavaScript, React, Node.js, PostgreSQL, AWS
Experience: 2 years as a software developer at Tech Company
Education: B.S. in Computer Science from University"
          minH="200px"
          resize="vertical"
          fontSize="sm"
        />
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.pdf"
          style={{ display: 'none' }}
        />
        
        {/* Action Buttons */}
        <HStack spacing={3} flexWrap="wrap">
          <Button
            leftIcon={isAnalyzingResume ? <Spinner size="sm" /> : <Zap size={18} />}
            colorScheme="blue"
            onClick={handleAnalyze}
            isDisabled={!localText.trim() || isAnalyzingResume}
          >
            {isAnalyzingResume ? 'Analyzing...' : 'Analyze Resume'}
          </Button>
          
          <Button
            leftIcon={<Upload size={18} />}
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            isDisabled={isAnalyzingResume}
          >
            Upload File
          </Button>
          
          {resumeAnalysis && (
            <>
              <Button
                leftIcon={isSaving ? <Spinner size="sm" /> : <Save size={18} />}
                variant="outline"
                colorScheme="green"
                onClick={handleSave}
                isDisabled={isSaving}
              >
                Save to Profile
              </Button>
              
              <Button
                leftIcon={<Trash2 size={18} />}
                variant="ghost"
                colorScheme="red"
                onClick={handleClear}
              >
                Clear
              </Button>
            </>
          )}
        </HStack>
        
        {/* Analysis Results */}
        {resumeAnalysis && (
          <>
            <Divider />
            
            {/* Summary Stats */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Stat size="sm">
                <StatLabel>Skills Found</StatLabel>
                <StatNumber>{resumeAnalysis.skills.length}</StatNumber>
                <StatHelpText>Across {Object.keys(resumeAnalysis.skillCategories).length} categories</StatHelpText>
              </Stat>
              
              <Stat size="sm">
                <StatLabel>Experience</StatLabel>
                <StatNumber>{resumeAnalysis.totalYearsExperience} years</StatNumber>
                <StatHelpText>
                  <Badge colorScheme={getExperienceLevelColor(resumeAnalysis.experienceLevel)}>
                    {resumeAnalysis.experienceLevel}
                  </Badge>
                </StatHelpText>
              </Stat>
              
              <Stat size="sm">
                <StatLabel>Education</StatLabel>
                <StatNumber>{resumeAnalysis.education.length}</StatNumber>
                <StatHelpText>entries detected</StatHelpText>
              </Stat>
              
              <Stat size="sm">
                <StatLabel>Top Keywords</StatLabel>
                <StatNumber>{resumeAnalysis.topKeywords.length}</StatNumber>
                <StatHelpText>for matching</StatHelpText>
              </Stat>
            </SimpleGrid>
            
            {/* Skill Categories */}
            <Box>
              <HStack 
                justify="space-between" 
                cursor="pointer" 
                onClick={() => setShowDetails(!showDetails)}
                py={2}
              >
                <Text fontWeight="medium">Extracted Skills</Text>
                <Icon as={showDetails ? ChevronUp : ChevronDown} />
              </HStack>
              
              <Collapse in={showDetails}>
                <VStack align="stretch" spacing={3} pt={2}>
                  {Object.entries(resumeAnalysis.skillCategories).map(([category, skills]) => (
                    skills.length > 0 && (
                      <Box key={category}>
                        <Text fontSize="sm" fontWeight="medium" textTransform="capitalize" mb={2}>
                          {category}
                        </Text>
                        <Wrap>
                          {skills.map((skill) => (
                            <WrapItem key={skill}>
                              <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                                {skill}
                              </Badge>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </Box>
                    )
                  ))}
                </VStack>
              </Collapse>
            </Box>
            
            {/* Insights */}
            {showInsights && insights && (
              <>
                <Divider />
                
                <Box>
                  <Text fontWeight="medium" mb={3}>Career Insights</Text>
                  
                  {insights.topMatchingSkills.length > 0 && (
                    <Box mb={3}>
                      <Text fontSize="sm" color={textColor} mb={2}>Your Strongest Skills:</Text>
                      <Wrap>
                        {insights.topMatchingSkills.slice(0, 8).map((skill) => (
                          <WrapItem key={skill}>
                            <Badge colorScheme="green" variant="subtle">
                              {skill}
                            </Badge>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  )}
                  
                  {insights.skillGaps.length > 0 && (
                    <Box mb={3}>
                      <Text fontSize="sm" color={textColor} mb={2}>Skills to Consider Learning:</Text>
                      <Wrap>
                        {insights.skillGaps.map((skill) => (
                          <WrapItem key={skill}>
                            <Tooltip label="High demand skill in job market">
                              <Badge colorScheme="orange" variant="subtle">
                                {skill}
                              </Badge>
                            </Tooltip>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  )}
                  
                  {insights.careerSuggestions.length > 0 && (
                    <VStack align="stretch" spacing={1}>
                      {insights.careerSuggestions.map((suggestion, i) => (
                        <HStack key={i}>
                          <Icon as={Check} color="green.500" boxSize={4} />
                          <Text fontSize="sm">{suggestion}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  )}
                </Box>
              </>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
}
