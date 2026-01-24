/**
 * Auth Modal Component
 * Clean white modal with red accent colors
 */

import React, { useState, useEffect } from 'react';
import { X, Briefcase } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';

export type AuthView = 'login' | 'signup' | 'forgot-password' | 'reset-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: AuthView;
  onAuthSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, initialView = 'login', onAuthSuccess }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<AuthView>(initialView);

  // Reset to initial view when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialView);
    }
  }, [isOpen, initialView]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthSuccess = () => {
    onAuthSuccess?.();
    onClose();
  };

  const getTitle = () => {
    switch (currentView) {
      case 'login':
        return 'Welcome Back';
      case 'signup':
        return 'Create Account';
      case 'forgot-password':
        return 'Reset Password';
      case 'reset-password':
        return 'Set New Password';
      default:
        return 'Authentication';
    }
  };

  const getSubtitle = () => {
    switch (currentView) {
      case 'login':
        return 'Sign in to access your personalized internships';
      case 'signup':
        return 'Join JobRasa to find your dream internship';
      case 'forgot-password':
        return "We'll send you a reset link";
      case 'reset-password':
        return 'Create a new secure password';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4), 0 10px 30px rgba(220, 53, 69, 0.15)',
        }}
      >
        {/* Red accent bar at top */}
        <div 
          className="h-1.5 w-full rounded-t-3xl"
          style={{
            background: 'linear-gradient(90deg, #DC3545 0%, #E85D6C 50%, #DC3545 100%)',
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div 
              className="p-2.5 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #DC3545 0%, #C82333 100%)',
                boxShadow: '0 4px 15px rgba(220, 53, 69, 0.4)',
              }}
            >
              <Briefcase size={24} color="white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">JobRasa</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {getTitle()}
          </h2>
          <p className="text-gray-500 text-sm">
            {getSubtitle()}
          </p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {currentView === 'login' && (
            <LoginForm
              onSwitchToSignUp={() => setCurrentView('signup')}
              onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
              onSuccess={handleAuthSuccess}
            />
          )}

          {currentView === 'signup' && (
            <SignUpForm
              onSwitchToLogin={() => setCurrentView('login')}
              onSuccess={handleAuthSuccess}
            />
          )}

          {currentView === 'forgot-password' && (
            <ForgotPasswordForm
              onSwitchToLogin={() => setCurrentView('login')}
            />
          )}

          {currentView === 'reset-password' && (
            <ResetPasswordForm
              onSuccess={handleAuthSuccess}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 pt-2 border-t border-gray-100">
          <p className="text-center text-gray-400 text-xs">
            By continuing, you agree to our{' '}
            <a href="#" className="text-red-500 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-red-500 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
