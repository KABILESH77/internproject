/**
 * Reset Password Form Component
 * Set new password after clicking reset link
 */

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ResetPasswordFormProps {
  onSuccess?: () => void;
}

export function ResetPasswordForm({ onSuccess }: ResetPasswordFormProps) {
  const { updatePassword, loading, error, clearError } = useAuth();
  
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

    if (!password || !confirmPassword) {
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

    const { error } = await updatePassword(password);
    
    if (!error) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    }
  };

  const displayError = localError || error;

  if (success) {
    return (
      <div className="p-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-white text-xl font-semibold mb-2">Password Updated!</h3>
        <p className="text-white/70">
          Your password has been successfully updated. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-white text-xl font-semibold mb-2">Set New Password</h3>
        <p className="text-white/70 text-sm">
          Please enter your new password below.
        </p>
      </div>

      {/* Error Display */}
      {displayError && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-200 text-sm">{displayError}</p>
        </div>
      )}

      {/* Password Field */}
      <div>
        <label htmlFor="new-password" className="block text-white/80 text-sm font-medium mb-2">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            id="new-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0a7676] focus:border-transparent transition-all"
            disabled={loading}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Password Strength Indicators */}
        {password.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className={`flex items-center gap-1 ${hasMinLength ? 'text-green-400' : 'text-white/50'}`}>
              {hasMinLength ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
              8+ characters
            </div>
            <div className={`flex items-center gap-1 ${hasUpperCase ? 'text-green-400' : 'text-white/50'}`}>
              {hasUpperCase ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
              Uppercase
            </div>
            <div className={`flex items-center gap-1 ${hasLowerCase ? 'text-green-400' : 'text-white/50'}`}>
              {hasLowerCase ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
              Lowercase
            </div>
            <div className={`flex items-center gap-1 ${hasNumber ? 'text-green-400' : 'text-white/50'}`}>
              {hasNumber ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
              Number
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirm-new-password" className="block text-white/80 text-sm font-medium mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            id="confirm-new-password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className={`w-full pl-12 pr-12 py-3 rounded-xl bg-white/10 border text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0a7676] focus:border-transparent transition-all ${
              confirmPassword.length > 0
                ? passwordsMatch
                  ? 'border-green-500/50'
                  : 'border-red-500/50'
                : 'border-white/20'
            }`}
            disabled={loading}
          />
          {confirmPassword.length > 0 && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {passwordsMatch ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
          )}
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
            Updating...
          </>
        ) : (
          'Update Password'
        )}
      </button>
    </form>
  );
}
