/**
 * ML-based Resume Analyzer Service
 * Extracts skills, experience, and qualifications from resume text
 * Uses NLP techniques for intelligent parsing
 */

// Common skills database for extraction
const SKILLS_DATABASE: Record<string, string[]> = {
  // Programming Languages
  programming: [
    'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'ruby', 'go', 'golang',
    'rust', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'sql', 'bash',
    'powershell', 'html', 'css', 'sass', 'less', 'dart', 'elixir', 'clojure', 'haskell'
  ],
  
  // Frameworks & Libraries
  frameworks: [
    'react', 'reactjs', 'react.js', 'angular', 'angularjs', 'vue', 'vuejs', 'vue.js',
    'next.js', 'nextjs', 'nuxt', 'nuxtjs', 'svelte', 'node.js', 'nodejs', 'express',
    'expressjs', 'fastapi', 'django', 'flask', 'spring', 'spring boot', 'springboot',
    'rails', 'ruby on rails', 'laravel', 'asp.net', '.net', 'dotnet', 'tensorflow',
    'pytorch', 'keras', 'scikit-learn', 'sklearn', 'pandas', 'numpy', 'scipy',
    'matplotlib', 'seaborn', 'plotly', 'd3.js', 'd3', 'three.js', 'electron',
    'react native', 'flutter', 'ionic', 'xamarin', 'qt', 'gtk', 'jquery', 'bootstrap',
    'tailwind', 'tailwindcss', 'material-ui', 'chakra-ui', 'ant design'
  ],
  
  // Databases
  databases: [
    'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
    'dynamodb', 'firebase', 'firestore', 'sqlite', 'oracle', 'sql server', 'mariadb',
    'neo4j', 'couchdb', 'influxdb', 'timescaledb', 'supabase', 'prisma', 'sequelize'
  ],
  
  // Cloud & DevOps
  cloud: [
    'aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 'digitalocean',
    'heroku', 'vercel', 'netlify', 'cloudflare', 'docker', 'kubernetes', 'k8s',
    'terraform', 'ansible', 'jenkins', 'circleci', 'github actions', 'gitlab ci',
    'travis ci', 'bamboo', 'puppet', 'chef', 'vagrant', 'nginx', 'apache', 'linux',
    'ubuntu', 'centos', 'debian', 'redhat', 'serverless', 'lambda', 'ecs', 'eks',
    'fargate', 'ec2', 's3', 'rds', 'cloudformation', 'cdk'
  ],
  
  // Data Science & ML
  datascience: [
    'machine learning', 'deep learning', 'neural networks', 'nlp', 'natural language processing',
    'computer vision', 'data mining', 'data analysis', 'data visualization', 'statistics',
    'big data', 'hadoop', 'spark', 'apache spark', 'hive', 'pig', 'kafka', 'airflow',
    'dbt', 'snowflake', 'databricks', 'jupyter', 'colab', 'tableau', 'power bi',
    'looker', 'metabase', 'grafana', 'etl', 'data pipeline', 'feature engineering',
    'model training', 'model deployment', 'mlops', 'regression', 'classification',
    'clustering', 'recommendation systems', 'time series', 'forecasting', 'a/b testing'
  ],
  
  // Design & UX
  design: [
    'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'indesign', 'after effects',
    'premiere pro', 'lightroom', 'canva', 'invision', 'zeplin', 'principle', 'framer',
    'ui design', 'ux design', 'user research', 'wireframing', 'prototyping', 'user testing',
    'design systems', 'responsive design', 'accessibility', 'wcag', 'information architecture'
  ],
  
  // Project Management & Collaboration
  management: [
    'agile', 'scrum', 'kanban', 'waterfall', 'jira', 'confluence', 'trello', 'asana',
    'monday.com', 'notion', 'linear', 'basecamp', 'slack', 'microsoft teams',
    'project management', 'product management', 'sprint planning', 'backlog grooming',
    'stakeholder management', 'roadmap', 'okrs', 'kpis', 'lean', 'six sigma'
  ],
  
  // Soft Skills
  soft: [
    'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
    'time management', 'organization', 'adaptability', 'creativity', 'attention to detail',
    'analytical thinking', 'decision making', 'conflict resolution', 'negotiation',
    'presentation', 'public speaking', 'mentoring', 'collaboration', 'initiative'
  ],
  
  // Testing
  testing: [
    'unit testing', 'integration testing', 'e2e testing', 'end-to-end testing',
    'jest', 'mocha', 'chai', 'pytest', 'junit', 'selenium', 'cypress', 'playwright',
    'puppeteer', 'testng', 'rspec', 'cucumber', 'postman', 'soapui', 'jmeter',
    'load testing', 'performance testing', 'security testing', 'tdd', 'bdd'
  ],
  
  // APIs & Protocols
  apis: [
    'rest', 'restful', 'graphql', 'grpc', 'soap', 'websocket', 'webhooks', 'oauth',
    'jwt', 'api design', 'api development', 'swagger', 'openapi', 'postman'
  ],
  
  // Version Control
  versioncontrol: [
    'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial', 'version control',
    'branching', 'merging', 'pull requests', 'code review'
  ]
};

// Education keywords
const EDUCATION_KEYWORDS = [
  'bachelor', 'master', 'phd', 'doctorate', 'degree', 'b.s.', 'b.a.', 'm.s.', 'm.a.',
  'b.sc', 'm.sc', 'b.tech', 'm.tech', 'mba', 'university', 'college', 'institute',
  'school', 'diploma', 'certificate', 'certification', 'graduated', 'major', 'minor',
  'gpa', 'cgpa', 'honors', 'magna cum laude', 'summa cum laude', 'cum laude'
];

// Experience keywords
const EXPERIENCE_KEYWORDS = [
  'experience', 'work history', 'employment', 'internship', 'intern', 'job',
  'position', 'role', 'worked', 'working', 'responsibilities', 'achievements',
  'accomplishments', 'projects', 'led', 'managed', 'developed', 'created',
  'implemented', 'designed', 'built', 'collaborated', 'coordinated', 'analyzed',
  'improved', 'increased', 'reduced', 'optimized', 'automated', 'streamlined'
];

// Action verbs for experience extraction
const ACTION_VERBS = [
  'developed', 'designed', 'implemented', 'created', 'built', 'led', 'managed',
  'coordinated', 'analyzed', 'improved', 'increased', 'reduced', 'optimized',
  'automated', 'streamlined', 'collaborated', 'mentored', 'trained', 'researched',
  'engineered', 'architected', 'deployed', 'maintained', 'launched', 'delivered',
  'executed', 'organized', 'planned', 'established', 'initiated', 'spearheaded'
];

export interface ExtractedSkill {
  name: string;
  category: string;
  confidence: number; // 0-1
  context?: string; // Surrounding text where skill was found
}

export interface ExtractedExperience {
  title?: string;
  company?: string;
  duration?: string;
  description: string;
  skills: string[];
}

export interface ExtractedEducation {
  degree?: string;
  institution?: string;
  field?: string;
  year?: string;
  gpa?: string;
}

export interface ResumeAnalysis {
  skills: ExtractedSkill[];
  skillCategories: Record<string, string[]>;
  experience: ExtractedExperience[];
  education: ExtractedEducation[];
  totalYearsExperience: number;
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior';
  topKeywords: string[];
  summary: string;
  rawText: string;
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
 * Tokenize text into words and n-grams
 */
function tokenize(text: string, maxNgram: number = 3): string[] {
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/);
  const tokens: string[] = [];
  
  // Single words
  tokens.push(...words);
  
  // N-grams (for multi-word skills like "machine learning")
  for (let n = 2; n <= maxNgram; n++) {
    for (let i = 0; i <= words.length - n; i++) {
      tokens.push(words.slice(i, i + n).join(' '));
    }
  }
  
  return tokens;
}

/**
 * Calculate confidence score based on context
 */
function calculateConfidence(skill: string, context: string): number {
  const contextLower = context.toLowerCase();
  let confidence = 0.5; // Base confidence
  
  // Higher confidence if near action verbs
  for (const verb of ACTION_VERBS) {
    if (contextLower.includes(verb)) {
      confidence += 0.1;
      break;
    }
  }
  
  // Higher confidence if in skills section
  if (contextLower.includes('skill') || contextLower.includes('technolog') || contextLower.includes('proficien')) {
    confidence += 0.2;
  }
  
  // Higher confidence if mentioned multiple times
  const regex = new RegExp(skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const matches = contextLower.match(regex);
  if (matches && matches.length > 1) {
    confidence += Math.min(matches.length * 0.05, 0.2);
  }
  
  return Math.min(confidence, 1);
}

/**
 * Extract skills from resume text
 */
export function extractSkills(text: string): ExtractedSkill[] {
  const tokens = tokenize(text);
  const tokenSet = new Set(tokens.map(t => t.toLowerCase()));
  const extractedSkills: Map<string, ExtractedSkill> = new Map();
  
  // Search through skills database
  for (const [category, skills] of Object.entries(SKILLS_DATABASE)) {
    for (const skill of skills) {
      if (tokenSet.has(skill.toLowerCase())) {
        // Find context (surrounding text)
        const skillRegex = new RegExp(`(.{0,50}${skill}.{0,50})`, 'gi');
        const contextMatch = text.match(skillRegex);
        const context = contextMatch ? contextMatch[0] : '';
        
        const confidence = calculateConfidence(skill, text);
        
        // Use the skill name as key to avoid duplicates
        const key = skill.toLowerCase();
        if (!extractedSkills.has(key) || extractedSkills.get(key)!.confidence < confidence) {
          extractedSkills.set(key, {
            name: skill,
            category,
            confidence,
            context: context.trim()
          });
        }
      }
    }
  }
  
  // Sort by confidence and return
  return Array.from(extractedSkills.values())
    .sort((a, b) => b.confidence - a.confidence);
}

/**
 * Extract experience sections from resume
 */
export function extractExperience(text: string): ExtractedExperience[] {
  const experiences: ExtractedExperience[] = [];
  
  // Split by common section headers
  const sections = text.split(/(?:experience|work history|employment|professional background)/i);
  
  if (sections.length > 1) {
    // Take the experience section
    const expSection = sections[1].split(/(?:education|skills|projects|certifications|references)/i)[0];
    
    // Split by bullet points or line breaks that indicate new entries
    const entries = expSection.split(/(?:\n\s*[\•\-\*]\s*|\n{2,})/);
    
    for (const entry of entries) {
      if (entry.trim().length > 20) {
        // Extract skills mentioned in this experience
        const entrySkills = extractSkills(entry).map(s => s.name);
        
        experiences.push({
          description: entry.trim().slice(0, 500),
          skills: entrySkills.slice(0, 10)
        });
      }
    }
  }
  
  return experiences.slice(0, 10); // Limit to 10 experiences
}

/**
 * Extract education from resume
 */
export function extractEducation(text: string): ExtractedEducation[] {
  const educations: ExtractedEducation[] = [];
  
  // Common degree patterns
  const degreePatterns = [
    /(?:bachelor(?:'s)?|b\.?s\.?|b\.?a\.?|b\.?tech)/gi,
    /(?:master(?:'s)?|m\.?s\.?|m\.?a\.?|m\.?tech|mba)/gi,
    /(?:ph\.?d\.?|doctorate)/gi,
    /(?:diploma|certificate|certification)/gi
  ];
  
  // Year pattern
  const yearPattern = /(?:20\d{2}|19\d{2})/g;
  
  // GPA pattern
  const gpaPattern = /(?:gpa|cgpa)[:\s]*([0-9]+\.?[0-9]*)/gi;
  
  // Split by education-related keywords
  const eduSection = text.split(/(?:education|academic|qualification)/i);
  
  if (eduSection.length > 1) {
    const section = eduSection[1].split(/(?:experience|work|skill|project)/i)[0];
    
    const education: ExtractedEducation = {};
    
    // Find degree
    for (const pattern of degreePatterns) {
      const match = section.match(pattern);
      if (match) {
        education.degree = match[0];
        break;
      }
    }
    
    // Find year
    const yearMatch = section.match(yearPattern);
    if (yearMatch) {
      education.year = yearMatch[yearMatch.length - 1]; // Usually graduation year is last
    }
    
    // Find GPA
    const gpaMatch = section.match(gpaPattern);
    if (gpaMatch) {
      education.gpa = gpaMatch[0].replace(/[^0-9\.]/g, '');
    }
    
    if (Object.keys(education).length > 0) {
      educations.push(education);
    }
  }
  
  return educations;
}

/**
 * Estimate years of experience
 */
export function estimateExperience(text: string): number {
  // Look for explicit mentions
  const yearPatterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)/gi,
    /(?:experience|exp)[:\s]*(\d+)\+?\s*years?/gi
  ];
  
  for (const pattern of yearPatterns) {
    const match = text.match(pattern);
    if (match) {
      const numMatch = match[0].match(/\d+/);
      if (numMatch) {
        return parseInt(numMatch[0], 10);
      }
    }
  }
  
  // Estimate based on date ranges
  const dateRanges = text.match(/(?:20\d{2}|19\d{2})\s*[-–—to]+\s*(?:20\d{2}|19\d{2}|present|current)/gi) || [];
  let totalYears = 0;
  
  for (const range of dateRanges) {
    const years = range.match(/\d{4}/g);
    if (years && years.length >= 2) {
      const start = parseInt(years[0], 10);
      const end = years[1].toLowerCase().includes('present') ? new Date().getFullYear() : parseInt(years[1], 10);
      totalYears += end - start;
    } else if (years && years.length === 1 && /present|current/i.test(range)) {
      totalYears += new Date().getFullYear() - parseInt(years[0], 10);
    }
  }
  
  return Math.max(totalYears, 0);
}

/**
 * Determine experience level
 */
function determineExperienceLevel(years: number): 'entry' | 'junior' | 'mid' | 'senior' {
  if (years < 1) return 'entry';
  if (years < 3) return 'junior';
  if (years < 6) return 'mid';
  return 'senior';
}

/**
 * Extract top keywords using TF-IDF-like scoring
 */
export function extractTopKeywords(text: string, topN: number = 20): string[] {
  const words = normalizeText(text).split(/\s+/);
  const wordFreq: Map<string, number> = new Map();
  
  // Count frequencies (excluding common stop words)
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
    'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have',
    'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
    'might', 'must', 'shall', 'can', 'need', 'i', 'you', 'he', 'she', 'it', 'we',
    'they', 'what', 'which', 'who', 'this', 'that', 'these', 'those', 'am', 'my'
  ]);
  
  for (const word of words) {
    if (word.length > 2 && !stopWords.has(word) && !/^\d+$/.test(word)) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  }
  
  // Sort by frequency and return top N
  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}

/**
 * Generate a summary of the resume
 */
export function generateSummary(analysis: Partial<ResumeAnalysis>): string {
  const parts: string[] = [];
  
  if (analysis.experienceLevel) {
    const levelMap = {
      'entry': 'Entry-level',
      'junior': 'Junior',
      'mid': 'Mid-level',
      'senior': 'Senior'
    };
    parts.push(`${levelMap[analysis.experienceLevel]} professional`);
  }
  
  if (analysis.totalYearsExperience && analysis.totalYearsExperience > 0) {
    parts.push(`with ${analysis.totalYearsExperience}+ years of experience`);
  }
  
  if (analysis.skillCategories) {
    const topCategories = Object.entries(analysis.skillCategories)
      .filter(([_, skills]) => skills.length > 0)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3)
      .map(([cat]) => cat);
    
    if (topCategories.length > 0) {
      parts.push(`skilled in ${topCategories.join(', ')}`);
    }
  }
  
  if (analysis.skills && analysis.skills.length > 0) {
    const topSkills = analysis.skills.slice(0, 5).map(s => s.name);
    parts.push(`with expertise in ${topSkills.join(', ')}`);
  }
  
  return parts.join(' ') || 'Professional seeking opportunities';
}

/**
 * Main function: Analyze resume text comprehensively
 */
export function analyzeResume(resumeText: string): ResumeAnalysis {
  if (!resumeText || resumeText.trim().length === 0) {
    return {
      skills: [],
      skillCategories: {},
      experience: [],
      education: [],
      totalYearsExperience: 0,
      experienceLevel: 'entry',
      topKeywords: [],
      summary: 'No resume content provided',
      rawText: ''
    };
  }
  
  // Extract components
  const skills = extractSkills(resumeText);
  const experience = extractExperience(resumeText);
  const education = extractEducation(resumeText);
  const totalYearsExperience = estimateExperience(resumeText);
  const experienceLevel = determineExperienceLevel(totalYearsExperience);
  const topKeywords = extractTopKeywords(resumeText);
  
  // Group skills by category
  const skillCategories: Record<string, string[]> = {};
  for (const skill of skills) {
    if (!skillCategories[skill.category]) {
      skillCategories[skill.category] = [];
    }
    skillCategories[skill.category].push(skill.name);
  }
  
  const analysis: ResumeAnalysis = {
    skills,
    skillCategories,
    experience,
    education,
    totalYearsExperience,
    experienceLevel,
    topKeywords,
    summary: '',
    rawText: resumeText
  };
  
  // Generate summary
  analysis.summary = generateSummary(analysis);
  
  return analysis;
}

/**
 * Extract text from PDF file using pdf.js
 * Uses unpkg CDN for reliable worker loading
 */
async function extractTextFromPDF(file: File): Promise<string> {
  // Import pdf.js
  const pdfjs = await import('pdfjs-dist');
  
  // Set worker source using unpkg CDN (more reliable than cdnjs)
  // Use version 4.4.168 which is stable and available on CDN
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';
  
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      disableFontFace: true,
    });
    
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine all text items with proper spacing
      const pageText = textContent.items
        .map((item: any) => {
          // Add newline if item ends a line
          if (item.hasEOL) {
            return item.str + '\n';
          }
          return item.str;
        })
        .join(' ')
        .replace(/\s+/g, ' ');
      
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF. Please try copying and pasting the text instead.');
  }
}

/**
 * Extract text from common resume formats
 * Supports: .txt, .pdf, .doc/.docx (text only)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  // Handle plain text files
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
  
  // Handle PDF files
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    try {
      const text = await extractTextFromPDF(file);
      if (!text.trim()) {
        throw new Error('No text content found in PDF. The PDF may be image-based or protected.');
      }
      return text;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`PDF parsing failed: ${error.message}`);
      }
      throw new Error('Failed to parse PDF file. Please try copy-pasting the content instead.');
    }
  }
  
  // Handle Word documents (basic support - encourage text/PDF)
  if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
    throw new Error('Word documents (.doc/.docx) are not directly supported. Please save as PDF or copy-paste the content.');
  }
  
  throw new Error('Unsupported file format. Please upload a .txt or .pdf file, or copy-paste resume content.');
}
