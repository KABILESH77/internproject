/**
 * ML Recommendations Hook & Context
 * Provides easy access to ML-based job matching throughout the app
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Internship } from '../components/InternshipCard';
import { ResumeAnalysis, analyzeResume, extractTextFromFile } from '../services/mlResumeAnalyzer';
import { JobMatch, getMLRecommendations, quickMatch } from '../services/mlMatcher';
import { supabase, getUserProfile, updateUserProfile } from '../services/supabaseClient';

interface MLRecommendationsContextType {
  // Resume state
  resumeText: string;
  resumeAnalysis: ResumeAnalysis | null;
  isAnalyzingResume: boolean;
  resumeError: string | null;
  
  // Recommendations state
  recommendations: JobMatch[];
  isLoadingRecommendations: boolean;
  recommendationsError: string | null;
  
  // Insights
  insights: {
    topMatchingSkills: string[];
    skillGaps: string[];
    careerSuggestions: string[];
    marketDemand: string[];
  } | null;
  
  // Actions
  setResumeText: (text: string) => void;
  analyzeResumeText: (text: string) => Promise<ResumeAnalysis | null>;
  uploadResumeFile: (file: File) => Promise<void>;
  getRecommendationsForJobs: (jobs: Internship[]) => Promise<JobMatch[]>;
  getQuickMatch: (job: Internship) => JobMatch | null;
  clearResume: () => void;
  saveResumeToProfile: () => Promise<void>;
  loadResumeFromProfile: () => Promise<void>;
}

const MLRecommendationsContext = createContext<MLRecommendationsContextType | null>(null);

export function MLRecommendationsProvider({ children }: { children: React.ReactNode }) {
  // Resume state
  const [resumeText, setResumeTextState] = useState<string>('');
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  
  // Recommendations state
  const [recommendations, setRecommendations] = useState<JobMatch[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);
  
  // Insights
  const [insights, setInsights] = useState<MLRecommendationsContextType['insights']>(null);
  
  // Cached jobs for quick matching
  const [cachedJobs, setCachedJobs] = useState<Internship[]>([]);
  
  // Set resume text
  const setResumeText = useCallback((text: string) => {
    setResumeTextState(text);
    setResumeError(null);
  }, []);
  
  // Analyze resume text
  const analyzeResumeText = useCallback(async (text: string): Promise<ResumeAnalysis | null> => {
    if (!text.trim()) {
      setResumeError('Please provide resume content');
      return null;
    }
    
    setIsAnalyzingResume(true);
    setResumeError(null);
    
    try {
      const analysis = analyzeResume(text);
      setResumeAnalysis(analysis);
      setResumeTextState(text);
      return analysis;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to analyze resume';
      setResumeError(message);
      return null;
    } finally {
      setIsAnalyzingResume(false);
    }
  }, []);
  
  // Upload and analyze resume file
  const uploadResumeFile = useCallback(async (file: File) => {
    setIsAnalyzingResume(true);
    setResumeError(null);
    
    try {
      const text = await extractTextFromFile(file);
      await analyzeResumeText(text);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to read file';
      setResumeError(message);
    } finally {
      setIsAnalyzingResume(false);
    }
  }, [analyzeResumeText]);
  
  // Get recommendations for jobs
  const getRecommendationsForJobs = useCallback(async (jobs: Internship[]): Promise<JobMatch[]> => {
    if (!resumeAnalysis) {
      setRecommendationsError('Please analyze your resume first');
      return [];
    }
    
    if (jobs.length === 0) {
      setRecommendationsError('No jobs available');
      return [];
    }
    
    setIsLoadingRecommendations(true);
    setRecommendationsError(null);
    
    try {
      const { recommendations: matches, insights: newInsights } = getMLRecommendations(
        resumeAnalysis,
        jobs
      );
      
      setRecommendations(matches);
      setInsights(newInsights);
      setCachedJobs(jobs);
      
      return matches;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get recommendations';
      setRecommendationsError(message);
      return [];
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, [resumeAnalysis]);
  
  // Quick match for a single job
  const getQuickMatch = useCallback((job: Internship): JobMatch | null => {
    if (!resumeAnalysis) return null;
    
    try {
      return quickMatch(resumeAnalysis, job);
    } catch {
      return null;
    }
  }, [resumeAnalysis]);
  
  // Clear resume
  const clearResume = useCallback(() => {
    setResumeTextState('');
    setResumeAnalysis(null);
    setRecommendations([]);
    setInsights(null);
    setResumeError(null);
    setRecommendationsError(null);
  }, []);
  
  // Save resume to profile
  const saveResumeToProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not logged in');
    }
    
    try {
      await updateUserProfile({
        resume_text: resumeText,
        skills: resumeAnalysis?.skills.map(s => s.name) || [],
        experience_level: resumeAnalysis?.experienceLevel || 'entry'
      });
    } catch (error) {
      console.error('Failed to save resume to profile:', error);
      throw error;
    }
  }, [resumeText, resumeAnalysis]);
  
  // Load resume from profile
  const loadResumeFromProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    try {
      const profile = await getUserProfile(user.id);
      if (profile?.resume_text) {
        await analyzeResumeText(profile.resume_text);
      }
    } catch (error) {
      console.error('Failed to load resume from profile:', error);
    }
  }, [analyzeResumeText]);
  
  // Auto-load resume from profile on mount
  useEffect(() => {
    loadResumeFromProfile();
  }, []);
  
  const value: MLRecommendationsContextType = {
    resumeText,
    resumeAnalysis,
    isAnalyzingResume,
    resumeError,
    recommendations,
    isLoadingRecommendations,
    recommendationsError,
    insights,
    setResumeText,
    analyzeResumeText,
    uploadResumeFile,
    getRecommendationsForJobs,
    getQuickMatch,
    clearResume,
    saveResumeToProfile,
    loadResumeFromProfile
  };
  
  return (
    <MLRecommendationsContext.Provider value={value}>
      {children}
    </MLRecommendationsContext.Provider>
  );
}

export function useMLRecommendations() {
  const context = useContext(MLRecommendationsContext);
  if (!context) {
    throw new Error('useMLRecommendations must be used within MLRecommendationsProvider');
  }
  return context;
}
