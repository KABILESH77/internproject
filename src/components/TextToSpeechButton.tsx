import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Square, Loader2 } from 'lucide-react';
import { ttsService } from '../services/ttsService';

interface TextToSpeechButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'pill';
  label?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

/**
 * TextToSpeechButton Component
 * 
 * A button that reads text aloud using TTS (Text-to-Speech).
 * Powered by Chatterbox TTS (https://github.com/resemble-ai/chatterbox)
 * with fallback to Web Speech API.
 */
export function TextToSpeechButton({
  text,
  className = '',
  size = 'md',
  variant = 'icon',
  label = 'Listen',
  onStart,
  onEnd,
  onError,
}: TextToSpeechButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<'chatterbox' | 'web-speech' | 'none'>('none');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      ttsService.stop();
    };
  }, []);

  const handleClick = useCallback(async () => {
    if (isPlaying) {
      ttsService.stop();
      setIsPlaying(false);
      setIsLoading(false);
      onEnd?.();
      return;
    }

    if (!text || isLoading) return;

    setIsLoading(true);
    onStart?.();

    try {
      const result = await ttsService.speak(text);

      if (!isMounted.current) return;

      if (result.success) {
        setSource(result.source);
        setIsPlaying(true);
        
        // For Web Speech API, we need to monitor when it ends
        if (result.source === 'web-speech') {
          const checkSpeaking = setInterval(() => {
            if (!ttsService.isSpeaking() && isMounted.current) {
              clearInterval(checkSpeaking);
              setIsPlaying(false);
              onEnd?.();
            }
          }, 100);
        }
      } else {
        onError?.(result.error || 'Failed to generate speech');
      }
    } catch (error) {
      if (isMounted.current) {
        onError?.(error instanceof Error ? error.message : 'Unknown error');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [text, isPlaying, isLoading, onStart, onEnd, onError]);

  // Size configurations
  const sizeStyles = {
    sm: {
      icon: 'w-8 h-8',
      iconSize: 'w-4 h-4',
      button: 'px-3 py-1.5 text-sm',
      pill: 'px-3 py-1 text-xs',
    },
    md: {
      icon: 'w-10 h-10',
      iconSize: 'w-5 h-5',
      button: 'px-4 py-2 text-base',
      pill: 'px-4 py-1.5 text-sm',
    },
    lg: {
      icon: 'w-12 h-12',
      iconSize: 'w-6 h-6',
      button: 'px-6 py-3 text-lg',
      pill: 'px-5 py-2 text-base',
    },
  };

  const currentSize = sizeStyles[size];

  // Get the appropriate icon
  const Icon = isLoading ? Loader2 : isPlaying ? Square : Volume2;
  const iconClassName = `${currentSize.iconSize} ${isLoading ? 'animate-spin' : ''}`;

  // Variant-specific rendering
  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading && !isPlaying}
        className={`
          ${currentSize.icon}
          inline-flex items-center justify-center
          rounded-full transition-all duration-200
          ${isPlaying 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        aria-label={isPlaying ? 'Stop reading' : isLoading ? 'Loading...' : 'Read aloud'}
        title={isPlaying ? 'Stop reading' : isLoading ? 'Generating speech...' : `Read aloud${source === 'chatterbox' ? ' (Chatterbox AI)' : ''}`}
      >
        <Icon className={iconClassName} aria-hidden="true" />
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading && !isPlaying}
        className={`
          ${currentSize.pill}
          inline-flex items-center gap-2
          rounded-full transition-all duration-200 font-medium
          ${isPlaying 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        aria-label={isPlaying ? 'Stop reading' : isLoading ? 'Loading...' : 'Read aloud'}
      >
        <Icon className={`${sizeStyles.sm.iconSize} ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
        <span>{isPlaying ? 'Stop' : isLoading ? 'Loading...' : label}</span>
      </button>
    );
  }

  // Button variant (default)
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading && !isPlaying}
      className={`
        ${currentSize.button}
        inline-flex items-center gap-2
        rounded-lg transition-all duration-200 font-medium
        ${isPlaying 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-sm hover:shadow-md
        ${className}
      `}
      aria-label={isPlaying ? 'Stop reading' : isLoading ? 'Loading...' : 'Read aloud'}
    >
      <Icon className={iconClassName} aria-hidden="true" />
      <span>{isPlaying ? 'Stop' : isLoading ? 'Generating...' : label}</span>
    </button>
  );
}

/**
 * Hook for programmatic TTS control
 */
export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const speak = useCallback(async (text: string) => {
    setIsLoading(true);
    try {
      const result = await ttsService.speak(text);
      if (result.success) {
        setIsPlaying(true);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    ttsService.stop();
    setIsPlaying(false);
  }, []);

  const pause = useCallback(() => {
    ttsService.pause();
  }, []);

  const resume = useCallback(() => {
    ttsService.resume();
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isPlaying,
    isLoading,
    isSpeaking: ttsService.isSpeaking.bind(ttsService),
  };
}

export default TextToSpeechButton;
