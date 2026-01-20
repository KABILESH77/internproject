/**
 * Forgot Password Form Component
 * Request password reset email
 */

import React, { useState } from 'react';
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export function ForgotPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
  const { resetPassword, loading, error, clearError, isConfigured } = useAuth();
  
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email) {
      setLocalError('Please enter your email address');
      return;
    }

    const { error } = await resetPassword(email);
    
    if (!error) {
      setSuccess(true);
    }
  };

  const displayError = localError || error;

  if (!isConfigured) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h3 className="text-white font-semibold mb-2">Supabase Not Configured</h3>
        <p className="text-white/70 text-sm">
          Please add your Supabase credentials to the .env file.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-white text-xl font-semibold mb-2">Check Your Email!</h3>
        <p className="text-white/70 mb-6">
          We've sent a password reset link to <strong className="text-white">{email}</strong>.
          Click the link in the email to reset your password.
        </p>
        <button
          onClick={onSwitchToLogin}
          className="px-6 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-white text-xl font-semibold mb-2">Forgot Password?</h3>
        <p className="text-white/70 text-sm">
          No worries! Enter your email and we'll send you a reset link.
        </p>
      </div>

      {/* Error Display */}
      {displayError && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-200 text-sm">{displayError}</p>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label htmlFor="reset-email" className="block text-white/80 text-sm font-medium mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0a7676] focus:border-transparent transition-all"
            disabled={loading}
            autoFocus
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0a7676] to-[#0d9494] text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Reset Link'
        )}
      </button>

      {/* Back to Login Link */}
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="w-full py-2 text-white/70 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </button>
    </form>
  );
}
