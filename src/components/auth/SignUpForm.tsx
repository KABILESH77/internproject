/**
 * Sign Up Form Component
 * Email/password registration with Google OAuth option - White/Red theme
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

export function SignUpForm({ onSwitchToLogin, onSuccess }: SignUpFormProps) {
  const { signUpWithEmail, signInWithGoogle, loading, error, clearError, isConfigured } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!fullName || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!hasMinLength) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    if (!passwordsMatch) {
      setLocalError('Passwords do not match');
      return;
    }

    const { error } = await signUpWithEmail(email, password, fullName);
    
    if (!error) {
      setSuccess(true);
      // In some cases, email verification is required
      // onSuccess?.();
    }
  };

  const handleGoogleSignUp = async () => {
    setLocalError(null);
    clearError();
    await signInWithGoogle();
  };

  const displayError = localError || error;

  if (!isConfigured) {
    return (
      <div className="p-6 text-center bg-amber-50 rounded-xl border border-amber-200">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-gray-800 font-semibold mb-2">Supabase Not Configured</h3>
        <p className="text-gray-600 text-sm">
          Please add your Supabase credentials to the .env file to enable authentication.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-gray-800 text-xl font-semibold mb-2">Check Your Email!</h3>
        <p className="text-gray-600 mb-6">
          We've sent a confirmation link to <strong className="text-gray-800">{email}</strong>.
          Please click the link to verify your account.
        </p>
        <button
          onClick={onSwitchToLogin}
          className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
        <p className="text-gray-500 text-sm">Start your internship journey today</p>
      </div>

      {/* Error Display */}
      {displayError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm">{displayError}</p>
        </div>
      )}

      {/* Google Sign Up - Primary CTA */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="w-full py-3.5 px-4 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign up with Google
      </button>

      {/* Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or sign up with email</span>
        </div>
      </div>

      {/* Full Name Field */}
      <div className="space-y-1">
        <label htmlFor="signup-name" className="block text-gray-700 text-sm font-medium">
          Full Name
        </label>
        <input
          id="signup-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm"
          disabled={loading}
        />
      </div>

      {/* Email Field */}
      <div className="space-y-1">
        <label htmlFor="signup-email" className="block text-gray-700 text-sm font-medium">
          Email Address
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm"
          disabled={loading}
        />
      </div>

      {/* Password Field */}
      <div className="space-y-1">
        <label htmlFor="signup-password" className="block text-gray-700 text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 pr-12 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Password Strength Indicators */}
        {password.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className={`flex items-center gap-1 ${hasMinLength ? 'text-green-500' : 'text-gray-400'}`}>
              {hasMinLength ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
              8+ characters
            </div>
            <div className={`flex items-center gap-1 ${hasUpperCase ? 'text-green-500' : 'text-gray-400'}`}>
              {hasUpperCase ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
              Uppercase
            </div>
            <div className={`flex items-center gap-1 ${hasLowerCase ? 'text-green-500' : 'text-gray-400'}`}>
              {hasLowerCase ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
              Lowercase
            </div>
            <div className={`flex items-center gap-1 ${hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
              {hasNumber ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
              Number
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-1">
        <label htmlFor="signup-confirm" className="block text-gray-700 text-sm font-medium">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="signup-confirm"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 pr-12 py-3 rounded-xl bg-white border-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm ${
              confirmPassword.length > 0
                ? passwordsMatch
                  ? 'border-green-500'
                  : 'border-red-500'
                : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {confirmPassword.length > 0 && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {passwordsMatch ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-4 rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #DC3545 0%, #C82333 100%)',
          boxShadow: '0 4px 15px rgba(220, 53, 69, 0.4)',
        }}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </button>

      {/* Login Link */}
      <p className="text-center text-gray-600 text-sm pt-2">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-red-500 hover:text-red-600 font-semibold transition-colors"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
