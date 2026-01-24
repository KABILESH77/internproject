/**
 * Match Score Card Component
 * Displays ML-based match score for an internship
 */

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Badge,
  Icon,
  Tooltip,
  Collapse,
  useDisclosure,
  useColorModeValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { 
  ChevronDown, 
  ChevronUp, 
  Check, 
  TrendingUp,
  Zap
} from 'lucide-react';
import { MatchScore, MatchExplanation } from '../services/mlMatcher';

interface MatchScoreCardProps {
  score: MatchScore;
  explanation: MatchExplanation;
  compact?: boolean;
}

export function MatchScoreCard({ score, explanation, compact = false }: MatchScoreCardProps) {
  const { isOpen, onToggle } = useDisclosure();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  
  const getScoreColor = (value: number): string => {
    if (value >= 80) return 'green';
    if (value >= 60) return 'blue';
    if (value >= 40) return 'yellow';
    return 'red';
  };
  
  const getScoreLabel = (value: number): string => {
    if (value >= 80) return 'Excellent Match';
    if (value >= 60) return 'Good Match';
    if (value >= 40) return 'Fair Match';
    return 'Low Match';
  };
  
  const scoreColor = getScoreColor(score.overall);
  
  if (compact) {
    return (
      <Tooltip 
        label={`${score.overall}% match - ${getScoreLabel(score.overall)}`}
        hasArrow
      >
        <Badge 
          colorScheme={scoreColor} 
          fontSize="sm"
          px={2}
          py={1}
          borderRadius="md"
        >
          <HStack spacing={1}>
            <Icon as={Zap} />
            <Text>{score.overall}%</Text>
          </HStack>
        </Badge>
      </Tooltip>
    );
  }
  
  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      p={4}
      shadow="sm"
    >
      <VStack align="stretch" spacing={3}>
        {/* Overall Score */}
        <HStack justify="space-between">
          <HStack>
            <Icon as={Zap} color={`${scoreColor}.500`} />
            <Text fontWeight="semibold">Match Score</Text>
          </HStack>
          <Badge colorScheme={scoreColor} fontSize="lg" px={3} py={1}>
            {score.overall}%
          </Badge>
        </HStack>
        
        <Progress 
          value={score.overall} 
          colorScheme={scoreColor} 
          size="sm" 
          borderRadius="full"
        />
        
        <Text fontSize="sm" color={textColor}>
          {getScoreLabel(score.overall)}
        </Text>
        
        {/* Score Breakdown */}
        <Box
          cursor="pointer"
          onClick={onToggle}
          py={1}
        >
          <HStack justify="space-between">
            <Text fontSize="sm" fontWeight="medium">Score Breakdown</Text>
            <Icon as={isOpen ? ChevronUp : ChevronDown} />
          </HStack>
        </Box>
        
        <Collapse in={isOpen}>
          <VStack align="stretch" spacing={2}>
            {/* Skill Match */}
            <Box>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="xs" color={textColor}>Skills</Text>
                <Text fontSize="xs" fontWeight="medium">{score.skillMatch}%</Text>
              </HStack>
              <Progress 
                value={score.skillMatch} 
                size="xs" 
                colorScheme={getScoreColor(score.skillMatch)}
                borderRadius="full"
              />
            </Box>
            
            {/* Experience Match */}
            <Box>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="xs" color={textColor}>Experience</Text>
                <Text fontSize="xs" fontWeight="medium">{score.experienceMatch}%</Text>
              </HStack>
              <Progress 
                value={score.experienceMatch} 
                size="xs" 
                colorScheme={getScoreColor(score.experienceMatch)}
                borderRadius="full"
              />
            </Box>
            
            {/* Keyword Match */}
            <Box>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="xs" color={textColor}>Keywords</Text>
                <Text fontSize="xs" fontWeight="medium">{score.keywordMatch}%</Text>
              </HStack>
              <Progress 
                value={score.keywordMatch} 
                size="xs" 
                colorScheme={getScoreColor(score.keywordMatch)}
                borderRadius="full"
              />
            </Box>
            
            {/* Sector Match */}
            <Box>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="xs" color={textColor}>Industry Fit</Text>
                <Text fontSize="xs" fontWeight="medium">{score.sectorMatch}%</Text>
              </HStack>
              <Progress 
                value={score.sectorMatch} 
                size="xs" 
                colorScheme={getScoreColor(score.sectorMatch)}
                borderRadius="full"
              />
            </Box>
          </VStack>
        </Collapse>
        
        {/* Matched Skills */}
        {explanation.matchedSkills.length > 0 && (
          <Box>
            <HStack mb={2}>
              <Icon as={Check} color="green.500" boxSize={4} />
              <Text fontSize="sm" fontWeight="medium">Your Matching Skills</Text>
            </HStack>
            <Wrap>
              {explanation.matchedSkills.slice(0, 6).map((skill) => (
                <WrapItem key={skill}>
                  <Badge colorScheme="green" variant="subtle" fontSize="xs">
                    {skill}
                  </Badge>
                </WrapItem>
              ))}
              {explanation.matchedSkills.length > 6 && (
                <WrapItem>
                  <Badge variant="subtle" fontSize="xs">
                    +{explanation.matchedSkills.length - 6} more
                  </Badge>
                </WrapItem>
              )}
            </Wrap>
          </Box>
        )}
        
        {/* Growth Areas */}
        {explanation.growthAreas.length > 0 && (
          <Box>
            <HStack mb={2}>
              <Icon as={TrendingUp} color="orange.500" boxSize={4} />
              <Text fontSize="sm" fontWeight="medium">Skills to Develop</Text>
            </HStack>
            <Wrap>
              {explanation.growthAreas.slice(0, 5).map((skill) => (
                <WrapItem key={skill}>
                  <Tooltip label="Learning this skill will improve your match">
                    <Badge colorScheme="orange" variant="subtle" fontSize="xs">
                      {skill}
                    </Badge>
                  </Tooltip>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}
        
        {/* Highlights */}
        {explanation.highlights.length > 0 && (
          <VStack align="stretch" spacing={1} pt={2}>
            {explanation.highlights.slice(0, 3).map((highlight, i) => (
              <HStack key={i} align="start">
                <Icon as={Check} color="blue.500" boxSize={4} mt={0.5} />
                <Text fontSize="sm" color={textColor}>{highlight}</Text>
              </HStack>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
}

/**
 * Compact match badge for internship cards
 */
export function MatchBadge({ score }: { score: number }) {
  const getScoreColor = (value: number): string => {
    if (value >= 80) return 'green';
    if (value >= 60) return 'blue';
    if (value >= 40) return 'yellow';
    return 'red';
  };
  
  return (
    <Tooltip 
      label={`${score}% match based on your resume`}
      hasArrow
    >
      <Badge 
        colorScheme={getScoreColor(score)} 
        fontSize="xs"
        px={2}
        py={0.5}
        borderRadius="full"
        display="flex"
        alignItems="center"
        gap={1}
      >
        <Icon as={Zap} boxSize={3} />
        {score}% Match
      </Badge>
    </Tooltip>
  );
}
