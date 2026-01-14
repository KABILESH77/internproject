import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript?: (transcript: string) => void;
  className?: string;
}

export function VoiceInputButton({ onTranscript, className = '' }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);

  const handleClick = () => {
    setIsListening(!isListening);
    
    // Simulate voice input (in production, this would use Web Speech API)
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        onTranscript?.('Python JavaScript React');
      }, 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        relative inline-flex items-center justify-center 
        w-11 h-11 rounded-full transition-all duration-200
        ${isListening 
          ? 'bg-[var(--color-error-500)] text-white animate-pulse' 
          : 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] hover:bg-[var(--color-primary-200)]'
        }
        focus:outline-none focus:ring-3 focus:ring-[var(--color-primary-500)] focus:ring-offset-2
        ${className}
      `}
      aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
      aria-pressed={isListening}
    >
      {isListening ? (
        <>
          <MicOff className="w-5 h-5" aria-hidden="true" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </>
      ) : (
        <Mic className="w-5 h-5" aria-hidden="true" />
      )}
      <span className="sr-only">
        {isListening ? 'Listening... Click to stop' : 'Click to use voice input'}
      </span>
    </button>
  );
}
