/**
 * Semantic Search Service
 * Provides intelligent search beyond simple keyword matching
 * Uses TF-IDF-like scoring and synonym expansion
 */

import { Internship } from '../components/InternshipCard';

// Synonym mappings for semantic expansion
const synonyms: Record<string, string[]> = {
  // Tech terms
  'developer': ['engineer', 'programmer', 'coder', 'software'],
  'software': ['application', 'program', 'system', 'tech'],
  'frontend': ['front-end', 'ui', 'client-side', 'web'],
  'backend': ['back-end', 'server', 'api', 'server-side'],
  'data': ['analytics', 'analysis', 'statistics', 'database'],
  'ml': ['machine learning', 'ai', 'artificial intelligence'],
  'devops': ['infrastructure', 'deployment', 'ci/cd', 'ops'],
  
  // Role terms
  'intern': ['internship', 'trainee', 'junior', 'entry-level'],
  'research': ['researcher', 'analyst', 'study', 'investigation'],
  'design': ['designer', 'creative', 'ux', 'ui'],
  'marketing': ['marketer', 'promotion', 'advertising', 'brand'],
  'writing': ['writer', 'content', 'copywriting', 'editorial'],
  
  // Work type
  'remote': ['work from home', 'wfh', 'virtual', 'distributed'],
  'onsite': ['on-site', 'in-office', 'in-person', 'office'],
  
  // Sectors
  'tech': ['technology', 'it', 'software', 'digital'],
  'healthcare': ['health', 'medical', 'hospital', 'clinical'],
  'education': ['educational', 'learning', 'teaching', 'academic'],
  'finance': ['financial', 'banking', 'investment', 'accounting'],
  'government': ['gov', 'public sector', 'federal', 'civic'],
};

// Stop words to filter out
const stopWords = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
  'used', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which',
  'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'been', 'being'
]);

export interface SearchResult {
  internship: Internship;
  score: number;
  matchedTerms: string[];
  highlights: { field: string; matches: string[] }[];
}

export interface SearchFilters {
  sectors?: string[];
  remoteOnly?: boolean;
  beginnerOnly?: boolean;
  hasStipend?: boolean;
  location?: string;
}

/**
 * Tokenize and normalize text
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

/**
 * Expand query with synonyms
 */
function expandQuery(terms: string[]): Set<string> {
  const expanded = new Set<string>();
  
  terms.forEach(term => {
    expanded.add(term);
    
    // Add synonyms
    const termSynonyms = synonyms[term];
    if (termSynonyms) {
      termSynonyms.forEach(syn => expanded.add(syn));
    }
    
    // Also check if this term is a synonym of another term
    Object.entries(synonyms).forEach(([key, values]) => {
      if (values.includes(term)) {
        expanded.add(key);
      }
    });
  });
  
  return expanded;
}

/**
 * Calculate TF-IDF-like score for a term in a document
 */
function calculateTermScore(term: string, tokens: string[], fieldWeight: number = 1): number {
  const termFrequency = tokens.filter(t => t.includes(term) || term.includes(t)).length;
  
  if (termFrequency === 0) return 0;
  
  // Simplified TF-IDF scoring
  const tf = Math.log(1 + termFrequency);
  return tf * fieldWeight;
}

/**
 * Score an internship against the search query
 */
function scoreInternship(
  internship: Internship,
  queryTerms: Set<string>
): SearchResult {
  // Weight different fields differently
  const fieldWeights = {
    title: 3.0,
    organization: 2.0,
    description: 1.0,
    requirements: 1.5,
    responsibilities: 1.5,
    location: 2.0
  };
  
  // Tokenize all fields
  const titleTokens = tokenize(internship.title);
  const orgTokens = tokenize(internship.organization);
  const descTokens = tokenize(internship.description || '');
  const reqTokens = tokenize((internship.requirements || []).join(' '));
  const respTokens = tokenize((internship.responsibilities || []).join(' '));
  const locTokens = tokenize(internship.location);
  
  let totalScore = 0;
  const matchedTerms: string[] = [];
  const highlights: { field: string; matches: string[] }[] = [];
  
  queryTerms.forEach(term => {
    let termMatched = false;
    const fieldMatches: string[] = [];
    
    // Score each field
    const titleScore = calculateTermScore(term, titleTokens, fieldWeights.title);
    if (titleScore > 0) {
      fieldMatches.push('title');
      termMatched = true;
    }
    totalScore += titleScore;
    
    const orgScore = calculateTermScore(term, orgTokens, fieldWeights.organization);
    if (orgScore > 0) {
      fieldMatches.push('organization');
      termMatched = true;
    }
    totalScore += orgScore;
    
    const descScore = calculateTermScore(term, descTokens, fieldWeights.description);
    if (descScore > 0) {
      fieldMatches.push('description');
      termMatched = true;
    }
    totalScore += descScore;
    
    const reqScore = calculateTermScore(term, reqTokens, fieldWeights.requirements);
    if (reqScore > 0) {
      fieldMatches.push('requirements');
      termMatched = true;
    }
    totalScore += reqScore;
    
    const respScore = calculateTermScore(term, respTokens, fieldWeights.responsibilities);
    if (respScore > 0) {
      fieldMatches.push('responsibilities');
      termMatched = true;
    }
    totalScore += respScore;
    
    const locScore = calculateTermScore(term, locTokens, fieldWeights.location);
    if (locScore > 0) {
      fieldMatches.push('location');
      termMatched = true;
    }
    totalScore += locScore;
    
    if (termMatched) {
      matchedTerms.push(term);
      highlights.push({ field: term, matches: fieldMatches });
    }
  });
  
  return {
    internship,
    score: totalScore,
    matchedTerms,
    highlights
  };
}

/**
 * Apply filters to search results
 */
function applyFilters(results: SearchResult[], filters: SearchFilters): SearchResult[] {
  return results.filter(result => {
    const { internship } = result;
    
    if (filters.remoteOnly && !internship.isRemote) {
      return false;
    }
    
    if (filters.beginnerOnly && !internship.isBeginner) {
      return false;
    }
    
    if (filters.hasStipend && !internship.stipend) {
      return false;
    }
    
    if (filters.location) {
      const filterLoc = filters.location.toLowerCase();
      const internLoc = internship.location.toLowerCase();
      if (!internLoc.includes(filterLoc)) {
        return false;
      }
    }
    
    if (filters.sectors && filters.sectors.length > 0) {
      // Check if internship matches any of the selected sectors
      const internshipText = `${internship.title} ${internship.organization} ${internship.description || ''}`.toLowerCase();
      const sectorKeywords: Record<string, string[]> = {
        'tech': ['software', 'technology', 'engineering', 'it', 'data', 'developer'],
        'healthcare': ['health', 'medical', 'hospital', 'clinical'],
        'education': ['education', 'teaching', 'learning', 'school'],
        'finance': ['finance', 'banking', 'investment'],
        'government': ['government', 'agency', 'department', 'federal', 'public'],
        'environment': ['environment', 'sustainability', 'climate', 'green'],
        'media': ['media', 'creative', 'design', 'communications'],
        'nonprofit': ['nonprofit', 'ngo', 'charity', 'community']
      };
      
      const matchesSector = filters.sectors.some(sector => {
        const keywords = sectorKeywords[sector.toLowerCase()] || [sector.toLowerCase()];
        return keywords.some(kw => internshipText.includes(kw));
      });
      
      if (!matchesSector) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Main semantic search function
 */
export function semanticSearch(
  query: string,
  internships: Internship[],
  filters: SearchFilters = {},
  limit: number = 20
): SearchResult[] {
  if (!query.trim()) {
    // Return all internships with zero score if no query
    const results = internships.map(internship => ({
      internship,
      score: 0,
      matchedTerms: [],
      highlights: []
    }));
    return applyFilters(results, filters).slice(0, limit);
  }
  
  // Tokenize and expand query
  const queryTerms = tokenize(query);
  const expandedTerms = expandQuery(queryTerms);
  
  // Score all internships
  const results = internships.map(internship => 
    scoreInternship(internship, expandedTerms)
  );
  
  // Apply filters
  const filteredResults = applyFilters(results, filters);
  
  // Sort by score (descending) and return top results
  return filteredResults
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get search suggestions based on partial query
 */
export function getSearchSuggestions(
  partialQuery: string,
  internships: Internship[]
): string[] {
  if (!partialQuery || partialQuery.length < 2) {
    return [];
  }
  
  const query = partialQuery.toLowerCase();
  const suggestions = new Set<string>();
  
  // Suggest from titles
  internships.forEach(internship => {
    const words = tokenize(internship.title);
    words.forEach(word => {
      if (word.startsWith(query)) {
        suggestions.add(word);
      }
    });
    
    // Suggest full title if it matches
    if (internship.title.toLowerCase().includes(query)) {
      suggestions.add(internship.title);
    }
  });
  
  // Suggest from organizations
  internships.forEach(internship => {
    if (internship.organization.toLowerCase().includes(query)) {
      suggestions.add(internship.organization);
    }
  });
  
  // Add relevant synonyms
  Object.entries(synonyms).forEach(([key, values]) => {
    if (key.startsWith(query)) {
      suggestions.add(key);
    }
    values.forEach(val => {
      if (val.startsWith(query)) {
        suggestions.add(val);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 8);
}

/**
 * Natural language query parser
 * Extracts intent and filters from conversational queries
 */
export function parseNaturalLanguageQuery(query: string): {
  searchTerms: string[];
  filters: SearchFilters;
  intent: 'search' | 'browse' | 'filter';
} {
  const lowerQuery = query.toLowerCase();
  const filters: SearchFilters = {};
  let intent: 'search' | 'browse' | 'filter' = 'search';
  
  // Detect remote preference
  if (lowerQuery.includes('remote') || lowerQuery.includes('work from home')) {
    filters.remoteOnly = true;
  }
  
  // Detect beginner preference
  if (lowerQuery.includes('beginner') || lowerQuery.includes('no experience') || 
      lowerQuery.includes('entry level') || lowerQuery.includes('entry-level')) {
    filters.beginnerOnly = true;
  }
  
  // Detect paid/stipend preference
  if (lowerQuery.includes('paid') || lowerQuery.includes('stipend') || 
      lowerQuery.includes('salary')) {
    filters.hasStipend = true;
  }
  
  // Detect sector preferences
  const sectorPatterns: [RegExp, string][] = [
    [/tech|software|programming|coding|developer/i, 'tech'],
    [/health|medical|hospital/i, 'healthcare'],
    [/education|teaching|school/i, 'education'],
    [/finance|banking|money|investment/i, 'finance'],
    [/government|gov|public|federal/i, 'government'],
    [/environment|green|sustainability|climate/i, 'environment'],
    [/media|creative|design|art/i, 'media'],
    [/nonprofit|ngo|charity|volunteer/i, 'nonprofit']
  ];
  
  const matchedSectors = sectorPatterns
    .filter(([pattern]) => pattern.test(lowerQuery))
    .map(([, sector]) => sector);
  
  if (matchedSectors.length > 0) {
    filters.sectors = matchedSectors;
  }
  
  // Detect location
  const locationPatterns = [
    /in\s+([a-z\s]+,?\s*[a-z]*)/i,
    /near\s+([a-z\s]+)/i,
    /at\s+([a-z\s]+)/i
  ];
  
  for (const pattern of locationPatterns) {
    const match = lowerQuery.match(pattern);
    if (match && match[1]) {
      filters.location = match[1].trim();
      break;
    }
  }
  
  // Determine intent
  if (Object.keys(filters).length > 0 && tokenize(query).length <= 2) {
    intent = 'filter';
  } else if (lowerQuery.includes('show') || lowerQuery.includes('browse') || 
             lowerQuery.includes('all')) {
    intent = 'browse';
  }
  
  // Extract remaining search terms (remove filter keywords)
  const filterWords = ['remote', 'beginner', 'paid', 'stipend', 'in', 'near', 'at', 
                       'show', 'find', 'search', 'looking', 'for', 'me', 'want'];
  const searchTerms = tokenize(query).filter(term => !filterWords.includes(term));
  
  return { searchTerms, filters, intent };
}
