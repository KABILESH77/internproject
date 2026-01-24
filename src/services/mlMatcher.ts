/**
 * ML-based Resume-to-Job Matcher
 * Uses TF-IDF, cosine similarity, and skill matching
 * to provide intelligent job recommendations based on resume analysis
 */

import { Internship } from '../components/InternshipCard';
import { ResumeAnalysis, ExtractedSkill } from './mlResumeAnalyzer';
import { JobAnalysis, analyzeJob, analyzeJobCorpus } from './mlJobAnalyzer';

export interface MatchScore {
  overall: number;        // 0-100 final score
  skillMatch: number;     // 0-100 skill match
  experienceMatch: number; // 0-100 experience level match
  keywordMatch: number;   // 0-100 keyword/TF-IDF match
  sectorMatch: number;    // 0-100 sector/industry match
}

export interface MatchExplanation {
  matchedSkills: string[];
  missingSkills: string[];
  strengthAreas: string[];
  growthAreas: string[];
  highlights: string[];
}

export interface JobMatch {
  job: Internship;
  jobAnalysis: JobAnalysis;
  score: MatchScore;
  explanation: MatchExplanation;
  rank: number;
}

export interface MatchingConfig {
  weights: {
    skill: number;      // Weight for skill matching (default: 40)
    experience: number; // Weight for experience match (default: 20)
    keyword: number;    // Weight for TF-IDF similarity (default: 25)
    sector: number;     // Weight for sector match (default: 15)
  };
  minScore: number;     // Minimum score to include in results (default: 20)
  maxResults: number;   // Maximum number of results (default: 50)
  boostBeginner: boolean; // Boost beginner-friendly jobs for entry-level (default: true)
  boostRemote: boolean;   // Slight boost for remote jobs (default: false)
}

const DEFAULT_CONFIG: MatchingConfig = {
  weights: {
    skill: 40,
    experience: 20,
    keyword: 25,
    sector: 15
  },
  minScore: 20,
  maxResults: 50,
  boostBeginner: true,
  boostRemote: false
};

/**
 * Calculate cosine similarity between two TF-IDF vectors
 */
function cosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  // Get all unique terms
  const allTerms = new Set([...vecA.keys(), ...vecB.keys()]);
  
  for (const term of allTerms) {
    const a = vecA.get(term) || 0;
    const b = vecB.get(term) || 0;
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Calculate Jaccard similarity between two sets
 */
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
}

/**
 * Calculate skill match score
 */
function calculateSkillMatch(resumeSkills: ExtractedSkill[], jobSkills: string[]): {
  score: number,
  matched: string[],
  missing: string[]
} {
  if (jobSkills.length === 0) {
    return { score: 50, matched: [], missing: [] }; // Neutral if no skills listed
  }
  
  const resumeSkillNames = new Set(resumeSkills.map(s => s.name.toLowerCase()));
  const jobSkillsLower = jobSkills.map(s => s.toLowerCase());
  
  const matched: string[] = [];
  const missing: string[] = [];
  
  for (const skill of jobSkillsLower) {
    // Check for exact match or partial match
    let found = false;
    for (const resumeSkill of resumeSkillNames) {
      if (resumeSkill.includes(skill) || skill.includes(resumeSkill)) {
        matched.push(skill);
        found = true;
        break;
      }
    }
    if (!found) {
      missing.push(skill);
    }
  }
  
  // Weight required skills more heavily
  const matchRatio = matched.length / jobSkills.length;
  
  // Calculate score as percentage (0-100)
  let score = matchRatio * 100;
  
  // Bonus for having more skills than required
  if (resumeSkills.length > jobSkills.length) {
    score = score + 10;
  }
  
  // Clamp to 0-100
  score = Math.min(Math.max(score, 0), 100);
  
  return { score, matched, missing };
}

/**
 * Calculate experience level match
 */
function calculateExperienceMatch(
  resumeLevel: 'entry' | 'junior' | 'mid' | 'senior',
  resumeYears: number,
  jobLevel: 'entry' | 'junior' | 'mid' | 'senior',
  jobYears: number
): number {
  const levelOrder = { entry: 0, junior: 1, mid: 2, senior: 3 };
  
  const resumeLevelNum = levelOrder[resumeLevel];
  const jobLevelNum = levelOrder[jobLevel];
  
  const levelDiff = resumeLevelNum - jobLevelNum;
  
  // Perfect match or overqualified
  if (levelDiff >= 0) {
    if (levelDiff === 0) return 100;
    if (levelDiff === 1) return 90; // Slightly overqualified
    return 80; // More overqualified (might be concern)
  }
  
  // Underqualified
  if (levelDiff === -1) return 70; // Slightly under - might be a stretch
  if (levelDiff === -2) return 40; // Quite under
  return 20; // Very underqualified
}

/**
 * Calculate keyword/TF-IDF similarity
 * Returns a score between 0-100
 */
function calculateKeywordMatch(
  resumeKeywords: string[],
  jobKeywords: string[],
  resumeTfidf: Map<string, number>,
  jobTfidf: Map<string, number>
): number {
  // Combine keyword overlap and TF-IDF similarity
  const resumeKeywordSet = new Set(resumeKeywords.map(k => k.toLowerCase()));
  const jobKeywordSet = new Set(jobKeywords.map(k => k.toLowerCase()));
  
  // Jaccard returns 0-1, cosine returns 0-1
  const keywordJaccard = jaccardSimilarity(resumeKeywordSet, jobKeywordSet);
  const tfidfCosine = cosineSimilarity(resumeTfidf, jobTfidf);
  
  // Weighted combination: 40% keyword overlap + 60% TF-IDF similarity
  // Both are 0-1, so result is 0-1, then multiply by 100 for percentage
  const score = (keywordJaccard * 0.4 + tfidfCosine * 0.6) * 100;
  
  // Clamp to 0-100
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Calculate sector/industry match
 */
function calculateSectorMatch(
  resumeCategories: Record<string, string[]>,
  jobSectors: string[]
): number {
  if (jobSectors.length === 0) return 50; // Neutral
  
  // Map skill categories to likely sectors
  const categoryToSector: Record<string, string[]> = {
    programming: ['tech'],
    frameworks: ['tech'],
    databases: ['tech'],
    cloud: ['tech'],
    datascience: ['tech', 'finance', 'consulting'],
    design: ['tech', 'media'],
    management: ['consulting', 'tech'],
    soft: [] // Applies to all
  };
  
  const resumeSectors = new Set<string>();
  for (const [category, skills] of Object.entries(resumeCategories)) {
    if (skills.length > 0) {
      const sectors = categoryToSector[category] || [];
      sectors.forEach(s => resumeSectors.add(s));
    }
  }
  
  const jobSectorSet = new Set(jobSectors.map(s => s.toLowerCase()));
  
  if (resumeSectors.size === 0) return 50; // Neutral
  
  const intersection = [...resumeSectors].filter(s => jobSectorSet.has(s));
  return Math.min((intersection.length / jobSectorSet.size) * 100 + 20, 100);
}

/**
 * Build TF-IDF vector from resume text
 */
function buildResumeTfidf(resumeText: string): Map<string, number> {
  const tokens = resumeText
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
  
  const termFreq = new Map<string, number>();
  for (const token of tokens) {
    termFreq.set(token, (termFreq.get(token) || 0) + 1);
  }
  
  const tfidf = new Map<string, number>();
  const docLength = tokens.length;
  
  for (const [term, freq] of termFreq.entries()) {
    const tf = freq / docLength;
    // Simplified IDF (would normally use corpus)
    tfidf.set(term, tf);
  }
  
  return tfidf;
}

/**
 * Generate match explanation
 */
function generateExplanation(
  resume: ResumeAnalysis,
  job: JobAnalysis,
  skillMatch: { matched: string[], missing: string[] }
): MatchExplanation {
  const highlights: string[] = [];
  const strengthAreas: string[] = [];
  const growthAreas: string[] = [];
  
  // Highlight strong skill matches
  if (skillMatch.matched.length >= 3) {
    highlights.push(`Strong match: You have ${skillMatch.matched.length} of the key skills required`);
    strengthAreas.push(...skillMatch.matched.slice(0, 5));
  }
  
  // Identify growth areas
  if (skillMatch.missing.length > 0 && skillMatch.missing.length <= 3) {
    highlights.push(`Great opportunity to learn: ${skillMatch.missing.join(', ')}`);
    growthAreas.push(...skillMatch.missing);
  }
  
  // Experience level insights
  if (resume.experienceLevel === job.experienceLevel) {
    highlights.push('Your experience level is a perfect match');
  } else if (resume.experienceLevel === 'entry' && job.experienceLevel === 'entry') {
    highlights.push('Perfect for getting started in your career');
  }
  
  // Remote work
  if (job.isRemote) {
    highlights.push('Remote position - flexible work location');
  }
  
  // Beginner friendly
  if (job.experienceLevel === 'entry') {
    highlights.push('Beginner-friendly position');
  }
  
  return {
    matchedSkills: skillMatch.matched,
    missingSkills: skillMatch.missing,
    strengthAreas,
    growthAreas,
    highlights
  };
}

/**
 * Main matching function: Match resume to all jobs
 */
export function matchResumeToJobs(
  resume: ResumeAnalysis,
  internships: Internship[],
  config: Partial<MatchingConfig> = {}
): JobMatch[] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const { weights, minScore, maxResults, boostBeginner, boostRemote } = finalConfig;
  
  // Analyze all jobs
  const { analyses: jobAnalyses, idfScores } = analyzeJobCorpus(internships);
  
  // Build resume TF-IDF
  const resumeTfidf = buildResumeTfidf(resume.rawText);
  
  const matches: JobMatch[] = [];
  
  for (let i = 0; i < internships.length; i++) {
    const job = internships[i];
    const jobAnalysis = jobAnalyses[i];
    
    // Calculate individual scores
    const skillResult = calculateSkillMatch(resume.skills, jobAnalysis.allSkills);
    const experienceScore = calculateExperienceMatch(
      resume.experienceLevel,
      resume.totalYearsExperience,
      jobAnalysis.experienceLevel,
      jobAnalysis.yearsRequired
    );
    const keywordScore = calculateKeywordMatch(
      resume.topKeywords,
      jobAnalysis.topKeywords,
      resumeTfidf,
      jobAnalysis.tfidfVector
    );
    const sectorScore = calculateSectorMatch(resume.skillCategories, jobAnalysis.sector);
    
    // Calculate weighted overall score
    // Each component score is 0-100, weights sum to 100
    // So overall is: (score1 * w1/100) + (score2 * w2/100) + ... = weighted average 0-100
    let overallScore = (
      skillResult.score * (weights.skill / 100) +
      experienceScore * (weights.experience / 100) +
      keywordScore * (weights.keyword / 100) +
      sectorScore * (weights.sector / 100)
    );
    
    // Ensure intermediate scores don't exceed 100
    overallScore = Math.min(Math.max(overallScore, 0), 100);
    
    // Apply boosts
    if (boostBeginner && resume.experienceLevel === 'entry' && job.isBeginner) {
      overallScore = Math.min(overallScore + 10, 100);
    }
    
    if (boostRemote && job.isRemote) {
      overallScore = Math.min(overallScore + 5, 100);
    }
    
    // Skip if below minimum score
    if (overallScore < minScore) continue;
    
    const score: MatchScore = {
      overall: Math.round(Math.min(Math.max(overallScore, 0), 100)),
      skillMatch: Math.round(Math.min(Math.max(skillResult.score, 0), 100)),
      experienceMatch: Math.round(Math.min(Math.max(experienceScore, 0), 100)),
      keywordMatch: Math.round(Math.min(Math.max(keywordScore, 0), 100)),
      sectorMatch: Math.round(Math.min(Math.max(sectorScore, 0), 100))
    };
    
    const explanation = generateExplanation(resume, jobAnalysis, skillResult);
    
    matches.push({
      job,
      jobAnalysis,
      score,
      explanation,
      rank: 0 // Will be set after sorting
    });
  }
  
  // Sort by overall score
  matches.sort((a, b) => b.score.overall - a.score.overall);
  
  // Assign ranks
  matches.forEach((match, index) => {
    match.rank = index + 1;
  });
  
  // Return top results
  return matches.slice(0, maxResults);
}

/**
 * Get personalized job recommendations with detailed insights
 */
export function getMLRecommendations(
  resume: ResumeAnalysis,
  internships: Internship[],
  userPreferences?: {
    preferRemote?: boolean;
    preferredSectors?: string[];
    preferredLocations?: string[];
  }
): {
  recommendations: JobMatch[];
  insights: {
    topMatchingSkills: string[];
    skillGaps: string[];
    careerSuggestions: string[];
    marketDemand: string[];
  };
} {
  // Configure based on preferences
  const config: Partial<MatchingConfig> = {
    boostRemote: userPreferences?.preferRemote
  };
  
  // Get matches
  const recommendations = matchResumeToJobs(resume, internships, config);
  
  // Generate insights from the matching
  const allMatchedSkills = new Map<string, number>();
  const allMissingSkills = new Map<string, number>();
  
  for (const match of recommendations.slice(0, 20)) {
    for (const skill of match.explanation.matchedSkills) {
      allMatchedSkills.set(skill, (allMatchedSkills.get(skill) || 0) + 1);
    }
    for (const skill of match.explanation.missingSkills) {
      allMissingSkills.set(skill, (allMissingSkills.get(skill) || 0) + 1);
    }
  }
  
  const topMatchingSkills = Array.from(allMatchedSkills.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill]) => skill);
  
  const skillGaps = Array.from(allMissingSkills.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill);
  
  // Generate career suggestions based on gaps
  const careerSuggestions: string[] = [];
  if (skillGaps.length > 0) {
    careerSuggestions.push(`Consider learning: ${skillGaps.slice(0, 3).join(', ')}`);
  }
  if (resume.experienceLevel === 'entry') {
    careerSuggestions.push('Focus on beginner-friendly positions to build experience');
  }
  if (topMatchingSkills.length >= 5) {
    careerSuggestions.push('Your skills are highly marketable in the current job market');
  }
  
  // Market demand insights
  const marketDemand = skillGaps.length > 0
    ? [`High demand for: ${skillGaps.join(', ')}`]
    : ['Your skills align well with current market demand'];
  
  return {
    recommendations,
    insights: {
      topMatchingSkills,
      skillGaps,
      careerSuggestions,
      marketDemand
    }
  };
}

/**
 * Quick match for a single job
 */
export function quickMatch(resume: ResumeAnalysis, job: Internship): JobMatch {
  const jobAnalysis = analyzeJob(job);
  const resumeTfidf = buildResumeTfidf(resume.rawText);
  
  const skillResult = calculateSkillMatch(resume.skills, jobAnalysis.allSkills);
  const experienceScore = calculateExperienceMatch(
    resume.experienceLevel,
    resume.totalYearsExperience,
    jobAnalysis.experienceLevel,
    jobAnalysis.yearsRequired
  );
  const keywordScore = calculateKeywordMatch(
    resume.topKeywords,
    jobAnalysis.topKeywords,
    resumeTfidf,
    jobAnalysis.tfidfVector
  );
  const sectorScore = calculateSectorMatch(resume.skillCategories, jobAnalysis.sector);
  
  // Calculate weighted overall score (0-100)
  let overallScore = (
    skillResult.score * 0.4 +
    experienceScore * 0.2 +
    keywordScore * 0.25 +
    sectorScore * 0.15
  );
  
  // Clamp to 0-100
  overallScore = Math.min(Math.max(overallScore, 0), 100);
  
  return {
    job,
    jobAnalysis,
    score: {
      overall: Math.round(Math.min(Math.max(overallScore, 0), 100)),
      skillMatch: Math.round(Math.min(Math.max(skillResult.score, 0), 100)),
      experienceMatch: Math.round(Math.min(Math.max(experienceScore, 0), 100)),
      keywordMatch: Math.round(Math.min(Math.max(keywordScore, 0), 100)),
      sectorMatch: Math.round(Math.min(Math.max(sectorScore, 0), 100))
    },
    explanation: generateExplanation(resume, jobAnalysis, skillResult),
    rank: 1
  };
}
