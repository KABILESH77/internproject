/**
 * Authentication Context
 * Provides global auth state and methods throughout the app
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError, Provider } from '@supabase/supabase-js';
import { supabase, Profile, isSupabaseConfigured } from '../services/supabaseClient';

interface AuthContextType {
  // State
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;

  // Auth methods
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;

  // Profile methods
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;

  // Utility
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isConfigured = isSupabaseConfigured();

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Profile might not exist yet for new users
        if (error.code === 'PGRST116') {
          console.log('Profile not found, will be created on first update');
          return null;
        }
        throw error;
      }

      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  }, []);

  // Create profile for new user
  const createProfile = useCallback(async (user: User, fullName?: string) => {
    try {
      const newProfile: Partial<Profile> = {
        id: user.id,
        email: user.email,
        full_name: fullName || user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        education: null,
        skills: [],
        interests: [],
        location: null,
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(newProfile)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error creating profile:', err);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN' && session?.user) {
        const existingProfile = await fetchProfile(session.user.id);
        if (!existingProfile) {
          await createProfile(session.user);
        }
      }

      if (event === 'SIGNED_OUT') {
        setProfile(null);
      }

      if (event === 'PASSWORD_RECOVERY') {
        // User clicked password reset link
        console.log('Password recovery mode');
      }
    });

    return () => subscription.unsubscribe();
  }, [isConfigured, fetchProfile, createProfile]);

  // Sign in with email/password
  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
    return { error };
  };

  // Sign up with email/password
  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      // Create profile immediately for new user
      await createProfile(data.user, fullName);
    }

    setLoading(false);
    return { error };
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      setError(error.message);
    }

    return { error };
  };

  // Sign out
  const signOut = async () => {
    setError(null);
    await supabase.auth.signOut();
    setProfile(null);
  };

  // Request password reset email
  const resetPassword = async (email: string) => {
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
    }

    return { error };
  };

  // Update password (after reset)
  const updatePassword = async (newPassword: string) => {
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    }

    return { error };
  };

  // Update user profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('Not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Refresh profile after update
      await fetchProfile(user.id);
      return { error: null };
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return { error };
    }
  };

  // Refresh profile from database
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    error,
    isConfigured,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to require authentication
export function useRequireAuth(redirectTo?: string) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user && redirectTo) {
      // Could navigate to login page
      console.log('User not authenticated, should redirect to:', redirectTo);
    }
  }, [user, loading, redirectTo]);

  return { user, loading, isAuthenticated: !!user };
}
