/**
 * Forgot Password Form Component
 * Request password reset email - White/Red theme
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
      <div className="p-6 text-center bg-amber-50 rounded-xl border border-amber-200">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-gray-800 font-semibold mb-2">Supabase Not Configured</h3>
        <p className="text-gray-600 text-sm">
          Please add your Supabase credentials to the .env file.
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
          We've sent a password reset link to <strong className="text-gray-800">{email}</strong>.
          Click the link in the email to reset your password.
        </p>
        <button
          onClick={onSwitchToLogin}
          className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors flex items-center gap-2 mx-auto"
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
        <p className="text-gray-500 text-sm">Enter your email to receive a reset link</p>
      </div>

      {/* Error Display */}
      {displayError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm">{displayError}</p>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-1">
        <label htmlFor="reset-email" className="block text-gray-700 text-sm font-medium">
          Email Address
        </label>
        <input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm"
          disabled={loading}
          autoFocus
        />
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
        className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </button>
    </form>
  );
}
