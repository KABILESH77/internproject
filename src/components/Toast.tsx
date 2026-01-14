import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, ThumbsUp, ThumbsDown, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'feedback';

interface ToastProps {
  type: ToastType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
  showFeedback?: boolean;
  onFeedback?: (useful: boolean) => void;
}

export function Toast({
  type,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000,
  showFeedback = false,
  onFeedback
}: ToastProps) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    if (isVisible && autoClose && !showFeedback) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose, showFeedback]);

  const handleFeedback = (useful: boolean) => {
    setFeedbackGiven(true);
    onFeedback?.(useful);
    setTimeout(onClose, 1500);
  };

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle className="w-6 h-6" aria-hidden="true" />,
    error: <XCircle className="w-6 h-6" aria-hidden="true" />,
    info: <Info className="w-6 h-6" aria-hidden="true" />,
    feedback: <Info className="w-6 h-6" aria-hidden="true" />
  };

  const styles = {
    success: 'bg-[var(--color-success-50)] border-[var(--color-success-500)] text-[var(--color-success-700)]',
    error: 'bg-[var(--color-error-50)] border-[var(--color-error-500)] text-[var(--color-error-700)]',
    info: 'bg-[var(--color-primary-50)] border-[var(--color-primary-500)] text-[var(--color-primary-700)]',
    feedback: 'bg-white border-[var(--color-neutral-300)] text-[var(--color-neutral-900)]'
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed bottom-6 right-6 z-50 
        max-w-md w-full sm:w-auto min-w-[320px]
        px-4 py-4 rounded-xl border-2 shadow-xl
        flex items-start gap-3
        animate-in slide-in-from-bottom-5 fade-in duration-300
        ${styles[type]}
      `}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[type]}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium mb-1">{message}</p>
        
        {showFeedback && !feedbackGiven && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-[var(--color-neutral-600)]">Was this helpful?</span>
            <button
              onClick={() => handleFeedback(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--color-success-100)] text-[var(--color-success-700)] hover:bg-[var(--color-success-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-success-500)] transition-colors min-h-[36px]"
              aria-label="Mark as helpful"
            >
              <ThumbsUp className="w-4 h-4" aria-hidden="true" />
              <span className="font-medium">Yes</span>
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--color-neutral-200)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-neutral-500)] transition-colors min-h-[36px]"
              aria-label="Mark as not helpful"
            >
              <ThumbsDown className="w-4 h-4" aria-hidden="true" />
              <span className="font-medium">No</span>
            </button>
          </div>
        )}

        {feedbackGiven && (
          <p className="text-sm text-[var(--color-neutral-600)] mt-2">
            Thanks for your feedback!
          </p>
        )}
      </div>

      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-current"
        aria-label="Close notification"
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
}

// Toast Manager Hook
export function useToast() {
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
    showFeedback?: boolean;
  } | null>(null);

  const showToast = (type: ToastType, message: string, showFeedback = false) => {
    setToast({ type, message, showFeedback });
  };

  const closeToast = () => {
    setToast(null);
  };

  return {
    toast,
    showToast,
    closeToast
  };
}
