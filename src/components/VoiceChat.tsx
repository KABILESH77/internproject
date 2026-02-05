import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageCircle, 
  X, 
  Loader2,
  Bot,
  User,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { groqService, ChatMessage } from '../services/groqService';
import { ttsService } from '../services/ttsService';

interface VoiceChatProps {
  isOpen: boolean;
  onClose: () => void;
}

type ConversationState = 'idle' | 'listening' | 'processing' | 'speaking';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * VoiceChat Component
 * 
 * A voice-enabled AI chat interface powered by:
 * - Web Speech API for speech recognition (listening)
 * - Groq API for AI responses (thinking)
 * - TTS Service (Chatterbox/Web Speech) for speaking responses
 */
export function VoiceChat({ isOpen, onClose }: VoiceChatProps) {
  const [state, setState] = useState<ConversationState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasGreeted = useRef(false);

  // Speech recognition hook
  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error: recognitionError,
  } = useSpeechRecognition({
    language: 'en-US',
    continuous: false,
    interimResults: true,
    onResult: (text, isFinal) => {
      console.log('VoiceChat onResult callback - text:', text, 'isFinal:', isFinal);
      if (isFinal && text.trim()) {
        console.log('VoiceChat: Got final result, calling handleUserMessage');
        handleUserMessage(text.trim());
      } else {
        console.log('VoiceChat: Got interim result, updating transcript');
        setCurrentTranscript(text);
      }
    },
    onStart: () => {
      console.log('VoiceChat onStart callback - listening started');
    },
    onEnd: () => {
      console.log('VoiceChat onEnd callback - listening ended');
      console.log('VoiceChat onEnd - current state:', state, 'transcript:', transcript);
      if (state === 'listening') {
        // If we stopped listening but no final result, check transcript
        if (transcript.trim()) {
          console.log('VoiceChat: Using existing transcript');
          handleUserMessage(transcript.trim());
        } else {
          console.log('VoiceChat: No transcript, going to idle');
          setState('idle');
        }
      }
    },
    onError: (err) => {
      console.error('VoiceChat onError callback:', err);
      setError(err);
      setState('idle');
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting when opened
  useEffect(() => {
    if (isOpen && !hasGreeted.current && messages.length === 0) {
      hasGreeted.current = true;
      handleGreeting();
    }
  }, [isOpen]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      ttsService.stop();
      stopListening();
      setState('idle');
    }
  }, [isOpen, stopListening]);

  // Handle recognition error
  useEffect(() => {
    if (recognitionError) {
      setError(recognitionError);
    }
  }, [recognitionError]);

  /**
   * Send initial greeting
   */
  const handleGreeting = async () => {
    const greeting = await groqService.getGreeting();
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
    };
    setMessages([assistantMessage]);
    
    if (!isMuted) {
      setState('speaking');
      await speakText(greeting);
      setState('idle');
    }
  };

  /**
   * Handle user voice message
   */
  const handleUserMessage = async (text: string) => {
    console.log('VoiceChat: User said:', text);
    resetTranscript();
    setCurrentTranscript('');
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Get AI response
    setState('processing');
    setError(null);

    console.log('VoiceChat: Calling Groq API...');
    const response = await groqService.chat(text);
    console.log('VoiceChat: Groq response:', response);

    if (response.success && response.message) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response
      if (!isMuted) {
        console.log('VoiceChat: Speaking response...');
        setState('speaking');
        await speakText(response.message);
        console.log('VoiceChat: Done speaking');
      }
      setState('idle');
    } else {
      console.error('VoiceChat: Groq error:', response.error);
      setError(response.error || 'Failed to get response');
      setState('idle');
    }
  };

  /**
   * Speak text using TTS (OpenAI if available, fallback to Web Speech)
   */
  const speakText = async (text: string): Promise<void> => {
    try {
      // Use the main speak method which tries OpenAI first
      await ttsService.speak(text, { speed: 1.0 });
    } catch (err) {
      console.error('VoiceChat: TTS error:', err);
    }
  };

  /**
   * Toggle listening
   */
  const toggleListening = useCallback(() => {
    console.log('VoiceChat: toggleListening called');
    console.log('VoiceChat: current state:', state);
    console.log('VoiceChat: isListening:', isListening);
    console.log('VoiceChat: isSupported:', isSupported);
    
    if (state === 'speaking') {
      console.log('VoiceChat: Stopping speech because currently speaking');
      ttsService.stop();
      setState('idle');
      return;
    }

    if (isListening || state === 'listening') {
      console.log('VoiceChat: Stopping listening');
      stopListening();
      setState('idle');
    } else {
      console.log('VoiceChat: Starting to listen...');
      ttsService.stop(); // Stop any ongoing speech
      setError(null);
      setState('listening');
      startListening();
      console.log('VoiceChat: startListening called');
    }
  }, [isListening, state, startListening, stopListening, isSupported]);

  /**
   * Reset conversation
   */
  const resetConversation = useCallback(() => {
    groqService.resetConversation();
    setMessages([]);
    setError(null);
    setState('idle');
    hasGreeted.current = false;
    handleGreeting();
  }, []);

  /**
   * Toggle mute
   */
  const toggleMute = useCallback(() => {
    if (!isMuted) {
      ttsService.stop();
    }
    setIsMuted(!isMuted);
  }, [isMuted]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '24px',
        width: '380px',
        maxHeight: '600px',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1000,
        border: '1px solid #e5e7eb',
      }}
    >
      {/* Header */}
      <div 
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #0d9494 0%, #075959 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot style={{ width: '24px', height: '24px' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>JobRasa AI</h3>
            <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>
              {state === 'listening' && '🎤 Listening...'}
              {state === 'processing' && '🤔 Thinking...'}
              {state === 'speaking' && '🔊 Speaking...'}
              {state === 'idle' && 'Voice Assistant'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={toggleMute}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX style={{ width: '18px', height: '18px' }} /> : <Volume2 style={{ width: '18px', height: '18px' }} />}
          </button>
          <button
            onClick={resetConversation}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
            title="Reset conversation"
          >
            <RefreshCw style={{ width: '18px', height: '18px' }} />
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
            title="Close"
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          minHeight: '300px',
          maxHeight: '400px',
          backgroundColor: '#f9fafb',
        }}
      >
        {!isSupported && (
          <div 
            style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <AlertCircle style={{ width: '20px', height: '20px', color: '#d97706', flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
              Speech recognition is not supported in this browser. Please use Chrome or Edge.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: message.role === 'user' ? '#e0e7ff' : '#d1fae5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {message.role === 'user' ? (
                <User style={{ width: '18px', height: '18px', color: '#4f46e5' }} />
              ) : (
                <Bot style={{ width: '18px', height: '18px', color: '#059669' }} />
              )}
            </div>
            <div
              style={{
                maxWidth: '75%',
                padding: '12px 16px',
                borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                backgroundColor: message.role === 'user' ? '#4f46e5' : 'white',
                color: message.role === 'user' ? 'white' : '#1f2937',
                fontSize: '14px',
                lineHeight: '1.5',
                boxShadow: message.role === 'assistant' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {message.content}
            </div>
          </div>
        ))}

        {/* Current transcript (while speaking) */}
        {(currentTranscript || interimTranscript) && state === 'listening' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <User style={{ width: '18px', height: '18px', color: '#4f46e5' }} />
            </div>
            <div
              style={{
                maxWidth: '75%',
                padding: '12px 16px',
                borderRadius: '16px 16px 4px 16px',
                backgroundColor: '#4f46e5',
                color: 'white',
                fontSize: '14px',
                lineHeight: '1.5',
                opacity: 0.7,
              }}
            >
              {currentTranscript || interimTranscript}
              <span style={{ animation: 'blink 1s infinite' }}>|</span>
            </div>
          </div>
        )}

        {/* Processing indicator */}
        {state === 'processing' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#d1fae5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Bot style={{ width: '18px', height: '18px', color: '#059669' }} />
            </div>
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '16px 16px 16px 4px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Loader2 style={{ width: '16px', height: '16px', color: '#6b7280', animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Thinking...</span>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div 
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <AlertCircle style={{ width: '20px', height: '20px', color: '#dc2626', flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '14px', color: '#991b1b' }}>{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Control Area */}
      <div 
        style={{
          padding: '20px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={toggleListening}
          disabled={!isSupported || state === 'processing'}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            border: 'none',
            cursor: isSupported && state !== 'processing' ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            background: state === 'listening' 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : state === 'speaking'
              ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
              : 'linear-gradient(135deg, #0d9494 0%, #075959 100%)',
            boxShadow: state === 'listening' 
              ? '0 0 0 8px rgba(239, 68, 68, 0.2)' 
              : state === 'speaking'
              ? '0 0 0 8px rgba(139, 92, 246, 0.2)'
              : '0 4px 14px rgba(13, 148, 148, 0.4)',
            opacity: (!isSupported || state === 'processing') ? 0.5 : 1,
          }}
        >
          {state === 'listening' ? (
            <MicOff style={{ width: '32px', height: '32px', color: 'white' }} />
          ) : state === 'speaking' ? (
            <Volume2 style={{ width: '32px', height: '32px', color: 'white' }} />
          ) : (
            <Mic style={{ width: '32px', height: '32px', color: 'white' }} />
          )}
        </button>
        
        <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', margin: 0 }}>
          {state === 'listening' && 'Listening... Tap to stop'}
          {state === 'processing' && 'Processing your message...'}
          {state === 'speaking' && 'Speaking... Tap to interrupt'}
          {state === 'idle' && (isSupported ? 'Tap to speak' : 'Use Chrome or Edge for voice')}
        </p>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * Floating button to open voice chat
 */
export function VoiceChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '100px', // Above the text chat button
        right: '24px',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        border: 'none',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        zIndex: 999,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 25px rgba(139, 92, 246, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
      }}
      title="Talk to JobRasa AI (Voice)"
    >
      <Mic style={{ width: '28px', height: '28px', color: 'white' }} />
    </button>
  );
}

export default VoiceChat;
