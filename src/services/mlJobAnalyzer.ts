/**
 * ML-based Job Description Analyzer
 * Extracts requirements, skills, and key attributes from job descriptions
 * Enables intelligent matching with resumes
 */

import { Internship } from '../components/InternshipCard';

// Skill extraction patterns (same as resume analyzer for consistency)
const SKILLS_DATABASE: Record<string, string[]> = {
  programming: [
    'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'ruby', 'go', 'golang',
    'rust', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'sql', 'html', 'css'
  ],
  frameworks: [
    'react', 'angular', 'vue', 'next.js', 'node.js', 'express', 'django', 'flask',
    'spring', 'rails', 'laravel', '.net', 'tensorflow', 'pytorch', 'pandas', 'numpy'
  ],
  databases: [
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'firebase', 'sqlite'
  ],
  cloud: [
    'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'jenkins', 'linux'
  ],
  datascience: [
    'machine learning', 'deep learning', 'nlp', 'data analysis', 'statistics',
    'data visualization', 'tableau', 'power bi', 'etl', 'data pipeline'
  ],
  design: [
    'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'ui design', 'ux design'
  ],
  management: [
    'agile', 'scrum', 'jira', 'project management', 'product management'
  ],
  soft: [
    'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
    'time management', 'analytical thinking', 'presentation'
  ]
};

// Experience level indicators
const EXPERIENCE_LEVELS = {
  entry: ['entry level', 'entry-level', 'no experience required', 'beginner', 'fresher', 'graduate', 'intern', 'internship'],
  junior: ['junior', '0-2 years', '1-2 years', '0-1 years', '1+ year', 'some experience'],
  mid: ['mid level', 'mid-level', '2-5 years', '3-5 years', '2+ years', '3+ years'],
  senior: ['senior', 'lead', 'principal', '5+ years', '6+ years', '7+ years', 'expert', 'extensive experience']
};

// Job type indicators
const JOB_TYPES = {
  fulltime: ['full time', 'full-time', 'permanent', 'regular'],
  parttime: ['part time', 'part-time'],
  contract: ['contract', 'contractor', 'consulting'],
  internship: ['intern', 'internship', 'trainee', 'co-op', 'placement'],
  remote: ['remote', 'work from home', 'wfh', 'distributed', 'virtual'],
  hybrid: ['hybrid', 'flexible', 'mixed']
};

// Industry/sector keywords
const SECTOR_KEYWORDS: Record<string, string[]> = {
  tech: ['software', 'technology', 'tech', 'digital', 'saas', 'startup', 'it', 'engineering'],
  finance: ['finance', 'banking', 'fintech', 'investment', 'trading', 'financial'],
  healthcare: ['healthcare', 'health', 'medical', 'hospital', 'pharma', 'biotech'],
  education: ['education', 'edtech', 'learning', 'training', 'academic'],
  ecommerce: ['ecommerce', 'e-commerce', 'retail', 'marketplace'],
  media: ['media', 'entertainment', 'content', 'publishing', 'creative'],
  consulting: ['consulting', 'advisory', 'professional services'],
  government: ['government', 'public sector', 'federal', 'agency']
};

export interface JobRequirement {
  type: 'required' | 'preferred' | 'nice-to-have';
  skill: string;
  category: string;
  yearsExperience?: number;
}

export interface JobAnalysis {
  id: string;
  title: string;
  organization: string;
  location: string;
  
  // Extracted requirements
  requiredSkills: JobRequirement[];
  preferredSkills: JobRequirement[];
  allSkills: string[];
  
  // Experience level
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior';
  yearsRequired: number;
  
  // Job type
  jobType: string[];
  isRemote: boolean;
  
  // Sector/industry
  sector: string[];
  
  // Compensation
  hasStipend: boolean;
  stipendRange?: string;
  
  // Keywords for matching
  topKeywords: string[];
  
  // TF-IDF vector (simplified)
  tfidfVector: Map<string, number>;
  
  // Original data
  rawDescription: string;
}

/**
 * Normalize text for processing
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\-\.\/\+\#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenize text
 */
function tokenize(text: string): string[] {
  const normalized = normalizeText(text);
  return normalized.split(/\s+/).filter(w => w.length > 2);
}

/**
 * Extract skills from job description
 */
function extractJobSkills(text: string): { required: JobRequirement[], preferred: JobRequirement[] } {
  const required: JobRequirement[] = [];
  const preferred: JobRequirement[] = [];
  const textLower = text.toLowerCase();
  
  // Identify required vs preferred sections
  const requiredSection = textLower.includes('required') || textLower.includes('must have') || textLower.includes('requirements');
  const preferredSection = textLower.includes('preferred') || textLower.includes('nice to have') || textLower.includes('bonus');
  
  for (const [category, skills] of Object.entries(SKILLS_DATABASE)) {
    for (const skill of skills) {
      const skillLower = skill.toLowerCase();
      if (textLower.includes(skillLower)) {
        // Determine if required or preferred based on context
        const skillIndex = textLower.indexOf(skillLower);
        const surroundingText = textLower.slice(Math.max(0, skillIndex - 100), skillIndex + 100);
        
        const isRequired = surroundingText.includes('required') || 
                          surroundingText.includes('must have') ||
                          surroundingText.includes('essential');
        
        const isPreferred = surroundingText.includes('preferred') || 
                           surroundingText.includes('nice to have') ||
                           surroundingText.includes('bonus');
        
        const requirement: JobRequirement = {
          type: isPreferred ? 'preferred' : (isRequired ? 'required' : 'required'),
          skill,
          category
        };
        
        if (isPreferred) {
          preferred.push(requirement);
        } else {
          required.push(requirement);
        }
      }
    }
  }
  
  return { required, preferred };
}

/**
 * Detect experience level
 */
function detectExperienceLevel(text: string): { level: 'entry' | 'junior' | 'mid' | 'senior', years: number } {
  const textLower = text.toLowerCase();
  
  // Check for explicit year requirements
  const yearPatterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)/gi,
    /(?:experience|exp)[:\s]*(\d+)\+?\s*years?/gi,
    /(\d+)\s*-\s*(\d+)\s*years?/gi
  ];
  
  let yearsRequired = 0;
  for (const pattern of yearPatterns) {
    const match = textLower.match(pattern);
    if (match) {
      const numMatch = match[0].match(/\d+/g);
      if (numMatch) {
        yearsRequired = parseInt(numMatch[0], 10);
        break;
      }
    }
  }
  
  // Check for level keywords
  for (const [level, keywords] of Object.entries(EXPERIENCE_LEVELS)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword)) {
        return { 
          level: level as 'entry' | 'junior' | 'mid' | 'senior', 
          years: yearsRequired 
        };
      }
    }
  }
  
  // Default based on years
  if (yearsRequired === 0) return { level: 'entry', years: 0 };
  if (yearsRequired <= 2) return { level: 'junior', years: yearsRequired };
  if (yearsRequired <= 5) return { level: 'mid', years: yearsRequired };
  return { level: 'senior', years: yearsRequired };
}

/**
 * Detect job types
 */
function detectJobTypes(text: string, isRemote: boolean, isBeginner: boolean): string[] {
  const textLower = text.toLowerCase();
  const types: string[] = [];
  
  for (const [type, keywords] of Object.entries(JOB_TYPES)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword)) {
        types.push(type);
        break;
      }
    }
  }
  
  if (isRemote && !types.includes('remote')) {
    types.push('remote');
  }
  
  if (isBeginner && !types.includes('internship')) {
    types.push('entry-level');
  }
  
  return [...new Set(types)];
}

/**
 * Detect sectors/industries
 */
function detectSectors(text: string): string[] {
  const textLower = text.toLowerCase();
  const sectors: string[] = [];
  
  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword)) {
        sectors.push(sector);
        break;
      }
    }
  }
  
  return [...new Set(sectors)];
}

/**
 * Build TF-IDF vector for a document
 */
function buildTfidfVector(text: string, idfScores: Map<string, number>): Map<string, number> {
  const tokens = tokenize(text);
  const termFreq = new Map<string, number>();
  
  // Calculate term frequency
  for (const token of tokens) {
    termFreq.set(token, (termFreq.get(token) || 0) + 1);
  }
  
  // Calculate TF-IDF
  const tfidf = new Map<string, number>();
  const docLength = tokens.length;
  
  for (const [term, freq] of termFreq.entries()) {
    const tf = freq / docLength;
    const idf = idfScores.get(term) || 1;
    tfidf.set(term, tf * idf);
  }
  
  return tfidf;
}

/**
 * Extract top keywords using frequency analysis
 */
function extractTopKeywords(text: string, count: number = 20): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
    'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have',
    'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
    'might', 'must', 'shall', 'can', 'need', 'you', 'your', 'our', 'we', 'this',
    'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'how', 'why', 'when',
    'where', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some'
  ]);
  
  const tokens = tokenize(text);
  const freq = new Map<string, number>();
  
  for (const token of tokens) {
    if (!stopWords.has(token) && token.length > 2) {
      freq.set(token, (freq.get(token) || 0) + 1);
    }
  }
  
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
}

/**
 * Analyze a single job/internship
 */
export function analyzeJob(internship: Internship): JobAnalysis {
  // Get explicit keywords from job data for better matching
  const jobKeywords = internship.keywords || [];
  
  // Combine all text for analysis
  const fullText = [
    internship.title,
    internship.organization,
    internship.description || '',
    ...(internship.requirements || []),
    ...(internship.responsibilities || []),
    ...jobKeywords,  // Include explicit keywords for better matching
    internship.location
  ].join(' ');
  
  // Extract skills from text
  const { required, preferred } = extractJobSkills(fullText);
  
  // Also add explicit keywords as skills (they're highly relevant for matching)
  const extractedSkills = [...required, ...preferred].map(r => r.skill);
  const allSkills = [...new Set([...extractedSkills, ...jobKeywords])];
  
  // Detect experience level
  const { level, years } = detectExperienceLevel(fullText);
  
  // Detect job types
  const jobType = detectJobTypes(fullText, internship.isRemote, internship.isBeginner);
  
  // Detect sectors
  const sector = detectSectors(fullText);
  
  // Extract keywords - combine extracted with explicit keywords from job data
  const extractedKeywords = extractTopKeywords(fullText);
  const topKeywords = [...new Set([...jobKeywords, ...extractedKeywords])];
  
  // Build TF-IDF vector (simplified - in production would use corpus-wide IDF)
  const idfScores = new Map<string, number>();
  const tfidfVector = buildTfidfVector(fullText, idfScores);
  
  return {
    id: internship.id,
    title: internship.title,
    organization: internship.organization,
    location: internship.location,
    requiredSkills: required,
    preferredSkills: preferred,
    allSkills,
    experienceLevel: level,
    yearsRequired: years,
    jobType,
    isRemote: internship.isRemote,
    sector,
    hasStipend: !!internship.stipend,
    stipendRange: internship.stipend,
    topKeywords,
    tfidfVector,
    rawDescription: fullText
  };
}

/**
 * Analyze all jobs in a collection
 * Builds corpus-wide IDF scores for better TF-IDF
 */
export function analyzeJobCorpus(internships: Internship[]): {
  analyses: JobAnalysis[],
  idfScores: Map<string, number>,
  corpusStats: {
    totalJobs: number,
    avgSkillsPerJob: number,
    topSkills: string[],
    topSectors: string[]
  }
} {
  // First pass: collect all terms for IDF calculation
  const documentFreq = new Map<string, number>();
  const totalDocs = internships.length;
  
  for (const internship of internships) {
    const fullText = [
      internship.title,
      internship.description || '',
      ...(internship.requirements || []),
      ...(internship.responsibilities || [])
    ].join(' ');
    
    const uniqueTokens = new Set(tokenize(fullText));
    for (const token of uniqueTokens) {
      documentFreq.set(token, (documentFreq.get(token) || 0) + 1);
    }
  }
  
  // Calculate IDF scores
  const idfScores = new Map<string, number>();
  for (const [term, df] of documentFreq.entries()) {
    idfScores.set(term, Math.log(totalDocs / (1 + df)) + 1);
  }
  
  // Second pass: analyze each job with IDF scores
  const analyses: JobAnalysis[] = [];
  const skillCounts = new Map<string, number>();
  const sectorCounts = new Map<string, number>();
  
  for (const internship of internships) {
    const analysis = analyzeJob(internship);
    
    // Rebuild TF-IDF with corpus-wide IDF
    const fullText = [
      internship.title,
      internship.description || '',
      ...(internship.requirements || []),
      ...(internship.responsibilities || [])
    ].join(' ');
    analysis.tfidfVector = buildTfidfVector(fullText, idfScores);
    
    analyses.push(analysis);
    
    // Track statistics
    for (const skill of analysis.allSkills) {
      skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
    }
    for (const sector of analysis.sector) {
      sectorCounts.set(sector, (sectorCounts.get(sector) || 0) + 1);
    }
  }
  
  // Compile statistics
  const avgSkillsPerJob = analyses.reduce((sum, a) => sum + a.allSkills.length, 0) / analyses.length;
  const topSkills = Array.from(skillCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([skill]) => skill);
  const topSectors = Array.from(sectorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([sector]) => sector);
  
  return {
    analyses,
    idfScores,
    corpusStats: {
      totalJobs: internships.length,
      avgSkillsPerJob: Math.round(avgSkillsPerJob * 10) / 10,
      topSkills,
      topSectors
    }
  };
}
