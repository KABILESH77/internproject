/**
 * ML-based Recommendation Engine
 * Computes match scores between user profiles and internships
 */

import { Internship } from '../components/InternshipCard';
import { OnboardingData } from '../components/OnboardingModal';

export interface RecommendationWeights {
  skill: number;   // 0-100, default 40
  interest: number; // 0-100, default 35
  location: number; // 0-100, default 25
}

export interface ScoredInternship extends Internship {
  matchScore: number;
  scoreBreakdown: {
    skillScore: number;
    interestScore: number;
    locationScore: number;
  };
  matchReasons: string[];
}

// Skill similarity mappings for better matching
const skillRelations: Record<string, string[]> = {
  'python': ['data analysis', 'machine learning', 'automation', 'backend'],
  'javascript': ['react', 'frontend', 'web development', 'node.js'],
  'react': ['javascript', 'frontend', 'web development', 'ui'],
  'data analysis': ['python', 'excel', 'sql', 'statistics', 'research'],
  'java': ['backend', 'software engineering', 'android'],
  'sql': ['data analysis', 'database', 'backend'],
  'html/css': ['web development', 'frontend', 'design'],
  'design': ['ui', 'ux', 'figma', 'creative'],
  'writing': ['communication', 'content', 'documentation'],
  'marketing': ['social media', 'communication', 'content'],
  'research': ['data analysis', 'writing', 'policy'],
  'excel': ['data analysis', 'finance', 'reporting'],
  'communication': ['writing', 'marketing', 'public relations'],
  'project management': ['organization', 'leadership', 'agile'],
  'social media': ['marketing', 'content', 'communication'],
};

// Sector to keyword mappings
const sectorKeywords: Record<string, string[]> = {
  'tech': ['software', 'engineering', 'developer', 'technology', 'it', 'data', 'digital'],
  'healthcare': ['health', 'medical', 'hospital', 'clinical', 'patient', 'care'],
  'education': ['education', 'teaching', 'learning', 'school', 'student', 'academic'],
  'finance': ['finance', 'banking', 'accounting', 'investment', 'financial'],
  'nonprofit': ['nonprofit', 'charity', 'volunteer', 'community', 'social'],
  'government': ['government', 'public', 'policy', 'federal', 'agency', 'civic'],
  'media': ['media', 'creative', 'design', 'arts', 'content', 'communications'],
  'environment': ['environment', 'sustainability', 'green', 'climate', 'conservation'],
};

/**
 * Calculate text similarity using Jaccard coefficient
 */
function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  if (set1.size === 0 && set2.size === 0) return 0;
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Tokenize and normalize text for comparison
 */
function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2)
  );
}

/**
 * Expand skills with related terms
 */
function expandSkills(skills: string[]): Set<string> {
  const expanded = new Set<string>();
  
  skills.forEach(skill => {
    const normalizedSkill = skill.toLowerCase();
    expanded.add(normalizedSkill);
    
    // Add related skills
    const related = skillRelations[normalizedSkill];
    if (related) {
      related.forEach(r => expanded.add(r));
    }
    
    // Also check if this skill is mentioned in any relations
    Object.entries(skillRelations).forEach(([key, values]) => {
      if (values.includes(normalizedSkill)) {
        expanded.add(key);
      }
    });
  });
  
  return expanded;
}

/**
 * Calculate skill match score (0-100)
 */
function calculateSkillScore(userSkills: string[], internship: Internship): number {
  if (userSkills.length === 0) return 50; // Neutral score if no skills provided
  
  const expandedUserSkills = expandSkills(userSkills);
  
  // Combine title, description, and requirements for matching
  const internshipText = [
    internship.title,
    internship.description || '',
    ...(internship.requirements || []),
    ...(internship.responsibilities || [])
  ].join(' ');
  
  const internshipTokens = tokenize(internshipText);
  
  // Calculate overlap
  let matchCount = 0;
  expandedUserSkills.forEach(skill => {
    const skillTokens = tokenize(skill);
    skillTokens.forEach(token => {
      if (internshipTokens.has(token)) {
        matchCount++;
      }
    });
  });
  
  // Normalize score
  const maxPossibleMatches = expandedUserSkills.size;
  const rawScore = maxPossibleMatches > 0 ? (matchCount / maxPossibleMatches) : 0;
  
  // Scale to 0-100 with some boosting for beginner-friendly positions
  let score = Math.min(rawScore * 100, 100);
  
  // Boost score for beginner-friendly if user has fewer skills
  if (internship.isBeginner && userSkills.length <= 3) {
    score = Math.min(score + 15, 100);
  }
  
  return Math.round(score);
}

/**
 * Calculate interest/sector match score (0-100)
 */
function calculateInterestScore(userInterests: string[], internship: Internship): number {
  if (userInterests.length === 0) return 50; // Neutral score
  
  const internshipText = [
    internship.title,
    internship.organization,
    internship.description || ''
  ].join(' ').toLowerCase();
  
  let matchScore = 0;
  let matchedSectors: string[] = [];
  
  userInterests.forEach(interest => {
    const keywords = sectorKeywords[interest.toLowerCase()] || [interest.toLowerCase()];
    
    const hasMatch = keywords.some(keyword => internshipText.includes(keyword));
    if (hasMatch) {
      matchScore += 100 / userInterests.length;
      matchedSectors.push(interest);
    }
  });
  
  return Math.round(Math.min(matchScore, 100));
}

/**
 * Calculate location match score (0-100)
 */
function calculateLocationScore(userLocation: string, internship: Internship): number {
  // Remote positions are universally accessible
  if (internship.isRemote) {
    return 100;
  }
  
  if (!userLocation) {
    return 50; // Neutral score if no location provided
  }
  
  const userLocationLower = userLocation.toLowerCase();
  const internshipLocation = internship.location.toLowerCase();
  
  // Extract city and state from user location
  const userParts = userLocationLower.split(',').map(p => p.trim());
  const internshipParts = internshipLocation.split(',').map(p => p.trim());
  
  // Exact city match
  if (userParts[0] && internshipParts[0] && userParts[0] === internshipParts[0]) {
    return 100;
  }
  
  // Same state
  if (userParts[1] && internshipParts[1] && userParts[1] === internshipParts[1]) {
    return 75;
  }
  
  // Use distance if available
  if (internship.distance) {
    const distanceMatch = internship.distance.match(/(\d+\.?\d*)/);
    if (distanceMatch) {
      const km = parseFloat(distanceMatch[1]);
      if (km <= 5) return 90;
      if (km <= 10) return 75;
      if (km <= 20) return 60;
      if (km <= 50) return 40;
      return 20;
    }
  }
  
  // Default for non-matching locations
  return 30;
}

/**
 * Generate human-readable match reasons
 */
function generateMatchReasons(
  userProfile: OnboardingData,
  internship: Internship,
  scores: { skillScore: number; interestScore: number; locationScore: number }
): string[] {
  const reasons: string[] = [];
  
  // Skill-based reasons
  if (scores.skillScore >= 70) {
    const matchingSkills = userProfile.skills.filter(skill => {
      const text = `${internship.title} ${internship.description || ''}`.toLowerCase();
      return text.includes(skill.toLowerCase());
    });
    if (matchingSkills.length > 0) {
      reasons.push(`Strong match for your ${matchingSkills.slice(0, 2).join(' and ')} skills`);
    } else {
      reasons.push('Great skill alignment based on your profile');
    }
  } else if (scores.skillScore >= 50) {
    reasons.push('Some relevant skills for this role');
  }
  
  // Interest-based reasons
  if (scores.interestScore >= 70) {
    reasons.push('Aligns with your career interests');
  }
  
  // Location-based reasons
  if (internship.isRemote) {
    reasons.push('Remote position - work from anywhere');
  } else if (scores.locationScore >= 80) {
    reasons.push(`Close to your location: ${internship.distance || internship.location}`);
  }
  
  // Beginner-friendly bonus
  if (internship.isBeginner) {
    reasons.push('Beginner-friendly - no experience required');
  }
  
  // Verified company
  if (internship.isVerified) {
    reasons.push('Verified employer');
  }
  
  return reasons.slice(0, 3); // Return top 3 reasons
}

/**
 * Main recommendation function
 * Scores and ranks internships based on user profile
 */
export function getRecommendations(
  internships: Internship[],
  userProfile: OnboardingData | null,
  weights: RecommendationWeights = { skill: 40, interest: 35, location: 25 }
): ScoredInternship[] {
  if (!userProfile) {
    // Return internships with default scores if no profile
    return internships.map(internship => ({
      ...internship,
      matchScore: 50,
      scoreBreakdown: { skillScore: 50, interestScore: 50, locationScore: 50 },
      matchReasons: ['Complete your profile for personalized matches']
    }));
  }
  
  // Normalize weights to sum to 100
  const totalWeight = weights.skill + weights.interest + weights.location;
  const normalizedWeights = {
    skill: weights.skill / totalWeight,
    interest: weights.interest / totalWeight,
    location: weights.location / totalWeight
  };
  
  // Score each internship
  const scoredInternships: ScoredInternship[] = internships.map(internship => {
    const skillScore = calculateSkillScore(userProfile.skills, internship);
    const interestScore = calculateInterestScore(userProfile.interests, internship);
    const locationScore = calculateLocationScore(userProfile.location, internship);
    
    // Calculate weighted total score
    const matchScore = Math.round(
      skillScore * normalizedWeights.skill +
      interestScore * normalizedWeights.interest +
      locationScore * normalizedWeights.location
    );
    
    const matchReasons = generateMatchReasons(userProfile, internship, {
      skillScore,
      interestScore,
      locationScore
    });
    
    return {
      ...internship,
      matchScore,
      scoreBreakdown: {
        skillScore,
        interestScore,
        locationScore
      },
      matchReasons
    };
  });
  
  // Sort by match score (descending)
  return scoredInternships.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Filter internships based on criteria
 */
export function filterInternships(
  internships: ScoredInternship[],
  filters: {
    minScore?: number;
    sectors?: string[];
    remoteOnly?: boolean;
    beginnerOnly?: boolean;
    location?: string;
  }
): ScoredInternship[] {
  return internships.filter(internship => {
    if (filters.minScore && internship.matchScore < filters.minScore) {
      return false;
    }
    if (filters.remoteOnly && !internship.isRemote) {
      return false;
    }
    if (filters.beginnerOnly && !internship.isBeginner) {
      return false;
    }
    // Additional filters can be added here
    return true;
  });
}

/**
 * Get top N recommendations
 */
export function getTopRecommendations(
  internships: Internship[],
  userProfile: OnboardingData | null,
  weights: RecommendationWeights,
  limit: number = 5
): ScoredInternship[] {
  const recommendations = getRecommendations(internships, userProfile, weights);
  return recommendations.slice(0, limit);
}
