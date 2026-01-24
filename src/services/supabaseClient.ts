/**
 * Supabase Client Configuration
 * Initializes the Supabase client for authentication and database operations
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

// Custom lock implementation that doesn't throw AbortError
// Uses localStorage-based locking to avoid navigator.locks issues
const customLock = async <R>(
  name: string,
  acquireTimeout: number,
  fn: () => Promise<R>
): Promise<R> => {
  const lockKey = `supabase-lock-${name}`;
  const lockValue = Date.now().toString();
  const startTime = Date.now();

  // Try to acquire the lock
  while (true) {
    const existingLock = localStorage.getItem(lockKey);
    const existingLockTime = existingLock ? parseInt(existingLock, 10) : 0;

    // Lock is stale if older than 10 seconds
    if (!existingLock || Date.now() - existingLockTime > 10000) {
      localStorage.setItem(lockKey, lockValue);
      break;
    }

    // Check for timeout
    if (Date.now() - startTime > acquireTimeout) {
      // Timeout acquiring lock, proceed anyway
      console.warn('Lock acquisition timeout, proceeding anyway');
      break;
    }

    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  try {
    return await fn();
  } finally {
    // Only release if we still hold the lock
    if (localStorage.getItem(lockKey) === lockValue) {
      localStorage.removeItem(lockKey);
    }
  }
};

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storageKey: 'jobrasa-auth-token',
      // Use custom lock to prevent AbortError from navigator.locks
      lock: customLock,
    },
  }
);

// Database types for TypeScript
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  education: string | null;
  skills: string[] | null;
  interests: string[] | null;
  location: string | null;
  // Extended profile fields
  phone: string | null;
  bio: string | null;
  institution: string | null;
  field_of_study: string | null;
  graduation_year: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  resume_url: string | null;
  // ML-related fields
  resume_text: string | null;
  experience_level: 'entry' | 'junior' | 'mid' | 'senior' | null;
  created_at: string;
  updated_at: string;
}

export interface SavedInternship {
  id: string;
  user_id: string;
  internship_id: string;
  saved_at: string;
}

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder')
  );
};

// Get user profile by ID
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data as Profile;
};

// Update user profile
export const updateUserProfile = async (updates: Partial<Profile>): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) return null;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
  
  return data as Profile;
};

// Create or upsert user profile
export const upsertUserProfile = async (profile: Partial<Profile> & { id: string }): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      ...profile,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting profile:', error);
    throw error;
  }
  
  return data as Profile;
};
