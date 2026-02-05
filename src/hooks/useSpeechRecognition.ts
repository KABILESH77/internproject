import { useState, useCallback, useRef, useEffect } from 'react';

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onStart?: () => void;
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

/**
 * Custom hook for speech recognition using Web Speech API
 */
export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true,
    onResult,
    onError,
    onEnd,
    onStart,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const onEndRef = useRef(onEnd);
  const onStartRef = useRef(onStart);
  
  // Keep refs updated
  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
    onEndRef.current = onEnd;
    onStartRef.current = onStart;
  }, [onResult, onError, onEnd, onStart]);

  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) {
      console.warn('Speech Recognition: Not supported in this browser');
      return;
    }

    console.log('Speech Recognition: Initializing...');
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Speech Recognition: Started listening');
      setIsListening(true);
      setError(null);
      onStartRef.current?.();
    };

    recognition.onend = () => {
      console.log('Speech Recognition: Ended');
      setIsListening(false);
      onEndRef.current?.();
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech Recognition: Error:', event.error);
      const errorMessage = getErrorMessage(event.error);
      setError(errorMessage);
      setIsListening(false);
      onErrorRef.current?.(errorMessage);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('Speech Recognition: Got result event', event);

      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptText = result[0].transcript;
        console.log(`Speech Recognition: Result ${i} - "${transcriptText}" (final: ${result.isFinal}, confidence: ${result[0].confidence})`);
        
        if (result.isFinal) {
          finalTranscript += transcriptText;
        } else {
          interim += transcriptText;
        }
      }

      console.log('Speech Recognition: Final transcript:', finalTranscript);
      console.log('Speech Recognition: Interim transcript:', interim);

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        setInterimTranscript('');
        console.log('Speech Recognition: Calling onResult callback with final:', finalTranscript);
        onResultRef.current?.(finalTranscript, true);
      } else {
        setInterimTranscript(interim);
        console.log('Speech Recognition: Calling onResult callback with interim:', interim);
        onResultRef.current?.(interim, false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [isSupported, language, continuous, interimResults]); // Removed callback dependencies - using refs instead

  const startListening = useCallback(() => {
    console.log('Speech Recognition: startListening called');
    console.log('Speech Recognition: isSupported:', isSupported);
    console.log('Speech Recognition: recognitionRef.current:', recognitionRef.current);
    
    if (!isSupported || !recognitionRef.current) {
      console.error('Speech Recognition: Not supported or not initialized');
      setError('Speech recognition is not supported in this browser');
      return;
    }

    setTranscript('');
    setInterimTranscript('');
    setError(null);

    try {
      console.log('Speech Recognition: Calling recognition.start()...');
      recognitionRef.current.start();
      console.log('Speech Recognition: start() called successfully');
    } catch (err) {
      // Recognition might already be started
      console.warn('Speech recognition start error:', err);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
}

/**
 * Get human-readable error message
 */
function getErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    'no-speech': 'No speech was detected. Please try again.',
    'audio-capture': 'No microphone was found. Please check your device.',
    'not-allowed': 'Microphone permission was denied. Please allow microphone access.',
    'network': 'Network error occurred. Please check your connection.',
    'aborted': 'Speech recognition was aborted.',
    'language-not-supported': 'The selected language is not supported.',
    'service-not-allowed': 'Speech recognition service is not allowed.',
  };

  return errorMessages[error] || `Speech recognition error: ${error}`;
}

export default useSpeechRecognition;
