/**
 * AI Chat Assistant Component
 * Powered by Groq API with Llama models (Free)
 * 
 * Features:
 * - Real AI conversation using Groq's free API
 * - Smart fallback responses when no API key
 * - API key configuration UI
 * - Streaming responses
 * - Context-aware career assistance
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  Sparkles,
  Loader2,
  AlertCircle,
  Settings,
  Key,
  Check,
  ExternalLink
} from 'lucide-react';
import { 
  ChatMessage, 
  sendChatMessage, 
  generateQuickSuggestions,
  getFallbackResponse,
  ConversationContext,
  isAIConfigured,
  saveApiKey,
  clearApiKey,
  testApiKey
} from '../services/aiChatService';
import { OnboardingData } from './OnboardingModal';
import { Internship } from './InternshipCard';
import { ScoredInternship } from '../services/recommendationEngine';

interface AIChatAssistantProps {
  userProfile: OnboardingData | null;
  internships: Internship[];
  recommendations: ScoredInternship[];
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile?: () => void;
}

export function AIChatAssistant({
  userProfile,
  internships,
  recommendations,
  isOpen,
  onClose,
  onOpenProfile
}: AIChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const [isConfigured, setIsConfigured] = useState(isAIConfigured());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if API is configured on mount
  useEffect(() => {
    setIsConfigured(isAIConfigured());
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: userProfile 
          ? `Hi there! 👋 I'm JobRasa AI, your personal career assistant. I see you're interested in ${userProfile.interests.slice(0, 2).join(' and ')} with skills in ${userProfile.skills.slice(0, 2).join(' and ')}. How can I help you find the perfect internship today?`
          : `Welcome to JobRasa! 👋 I'm your AI career assistant. I can help you discover internship opportunities, give you application tips, or provide career advice. What would you like to explore?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [userProfile]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && !showSettings) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized, showSettings]);

  const getContext = useCallback((): ConversationContext => ({
    userProfile,
    availableInternships: internships,
    currentRecommendations: recommendations,
    conversationHistory: messages
  }), [userProfile, internships, recommendations, messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    setStreamingMessage('');
    
    try {
      const context = getContext();
      
      // Send message with streaming support
      const response = await sendChatMessage(
        userMessage.content,
        { ...context, conversationHistory: [...messages, userMessage] },
        isConfigured ? (chunk) => {
          setStreamingMessage(prev => prev + chunk);
        } : undefined
      );
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setStreamingMessage('');
    } catch (err) {
      console.error('Chat error:', err);
      setError('Something went wrong. Using smart responses.');
      
      // Fallback response
      const fallbackResponse = getFallbackResponse(userMessage.content, getContext());
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
      setStreamingMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) return;
    
    setIsTestingKey(true);
    setApiKeyValid(null);
    
    const result = await testApiKey(apiKeyInput.trim());
    
    if (result.valid) {
      saveApiKey(apiKeyInput.trim());
      setApiKeyValid(true);
      setIsConfigured(true);
      setApiKeyInput('');
      
      // Close settings after brief delay
      setTimeout(() => {
        setShowSettings(false);
        setApiKeyValid(null);
      }, 1500);
    } else {
      setApiKeyValid(false);
      setError(result.error || 'Invalid API key');
    }
    
    setIsTestingKey(false);
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setIsConfigured(false);
    setApiKeyInput('');
    setApiKeyValid(null);
  };

  const quickSuggestions = generateQuickSuggestions(getContext());

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        width: isMinimized ? 'auto' : '380px',
        height: isMinimized ? 'auto' : '500px',
        maxHeight: '70vh',
      }}
      role="dialog"
      aria-label="AI Chat Assistant"
    >
      {isMinimized ? (
        /* Minimized State */
        <button
          onClick={() => setIsMinimized(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            color: 'white',
            borderRadius: '50px',
            border: 'none',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Bot className="w-5 h-5" />
          <span className="font-medium">JobRasa AI</span>
          <Maximize2 className="w-4 h-4" />
        </button>
      ) : (
        /* Full Chat Interface */
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            color: 'white',
          }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">JobRasa AI</h3>
                <p className="text-xs text-white/80">
                  {isConfigured ? 'Powered by Llama AI 🦙' : 'Smart Assistant ✨'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 hover:bg-white/20 rounded-lg transition-colors ${showSettings ? 'bg-white/20' : ''}`}
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Minimize chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Key className="w-4 h-4" />
                AI Configuration
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                Get a free API key from{' '}
                <a 
                  href="https://console.groq.com/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline inline-flex items-center gap-1"
                >
                  Groq Console <ExternalLink className="w-3 h-3" />
                </a>
              </p>
              
              {isConfigured ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">API Key Configured</span>
                  </div>
                  <button
                    onClick={handleClearApiKey}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Enter your Groq API key..."
                    className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors ${
                      apiKeyValid === false 
                        ? 'border-red-300 focus:border-red-500' 
                        : apiKeyValid === true
                        ? 'border-green-300 focus:border-green-500'
                        : 'border-gray-300 focus:border-purple-500'
                    }`}
                  />
                  <button
                    onClick={handleSaveApiKey}
                    disabled={!apiKeyInput.trim() || isTestingKey}
                    className="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isTestingKey ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Testing...
                      </>
                    ) : apiKeyValid === true ? (
                      <>
                        <Check className="w-4 h-4" />
                        Saved!
                      </>
                    ) : (
                      'Save API Key'
                    )}
                  </button>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                💡 The chatbot works without an API key using smart responses!
              </p>
            </div>
          )}

          {/* Status Banner (only when not configured) */}
          {!isConfigured && !showSettings && (
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>Using smart responses. Add API key in settings for full AI.</span>
            </div>
          )}

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#f9fafb',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                {/* Avatar */}
                <div style={{
                  flexShrink: 0,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: message.role === 'user' ? '#14b8a6' : '#7c3aed',
                }}>
                  {message.role === 'user' 
                    ? <User style={{ width: '16px', height: '16px', color: 'white' }} />
                    : <Bot style={{ width: '16px', height: '16px', color: 'white' }} />
                  }
                </div>
                
                {/* Message Bubble */}
                <div style={{
                  maxWidth: '75%',
                  borderRadius: '16px',
                  padding: '10px 14px',
                  backgroundColor: message.role === 'user' ? '#14b8a6' : 'white',
                  color: message.role === 'user' ? 'white' : '#1f2937',
                  border: message.role === 'user' ? 'none' : '1px solid #e5e7eb',
                  boxShadow: message.role === 'user' ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                }}>
                  <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap', margin: 0 }}>{message.content}</p>
                  {message.timestamp && (
                    <p style={{ 
                      fontSize: '11px', 
                      marginTop: '4px', 
                      marginBottom: 0,
                      opacity: 0.7,
                    }}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {/* Streaming Message */}
            {streamingMessage && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-md px-4 py-3 bg-white border border-gray-200 shadow-sm">
                  <p className="text-sm whitespace-pre-wrap">{streamingMessage}</p>
                  <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse ml-1" />
                </div>
              </div>
            )}
            
            {/* Loading Indicator */}
            {isLoading && !streamingMessage && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 2 && !isLoading && !showSettings && (
            <div className="px-4 py-2 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(suggestion)}
                    className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-700 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="hover:text-red-900">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about internships..."
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm transition-all"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
              {isConfigured ? 'Powered by Groq + Llama 🦙' : 'Smart responses enabled ✨'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Floating Chat Button to open the assistant
 */
interface ChatButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

export function AIChatButton({ onClick, hasUnread = false }: ChatButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <>
      {/* CSS Keyframes for animations */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
      `}</style>
      
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9998,
          padding: '16px',
          background: isHovered 
            ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
            : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
          color: 'white',
          borderRadius: '50%',
          border: 'none',
          boxShadow: isHovered 
            ? '0 8px 30px rgba(124, 58, 237, 0.6)' 
            : '0 4px 20px rgba(124, 58, 237, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          animation: 'float 3s ease-in-out infinite',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
        aria-label="Open AI Chat Assistant"
      >
        {/* Pulse ring effect */}
        <span style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '50%',
          border: '2px solid #7c3aed',
          animation: 'pulse-ring 2s ease-out infinite',
        }} />
        
        {/* Icon container with wiggle on hover */}
        <span style={{
          display: 'block',
          animation: isHovered ? 'wiggle 0.5s ease-in-out' : 'none',
        }}>
          {isHovered ? (
            <Sparkles style={{ width: '24px', height: '24px' }} />
          ) : (
            <MessageCircle style={{ width: '24px', height: '24px' }} />
          )}
        </span>
        
        {/* Notification dot with pulse */}
        {hasUnread && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '14px',
            height: '14px',
            backgroundColor: '#14b8a6',
            borderRadius: '50%',
            border: '2px solid white',
            animation: 'pulse-ring 1.5s ease-out infinite',
          }} />
        )}
        
        {/* Sparkle decorations on hover */}
        {isHovered && (
          <>
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '50%',
              width: '8px',
              height: '8px',
              backgroundColor: '#fbbf24',
              borderRadius: '50%',
              animation: 'sparkle 0.6s ease-out forwards',
            }} />
            <span style={{
              position: 'absolute',
              top: '20%',
              right: '-8px',
              width: '6px',
              height: '6px',
              backgroundColor: '#34d399',
              borderRadius: '50%',
              animation: 'sparkle 0.6s ease-out 0.1s forwards',
            }} />
            <span style={{
              position: 'absolute',
              bottom: '-6px',
              left: '30%',
              width: '7px',
              height: '7px',
              backgroundColor: '#f472b6',
              borderRadius: '50%',
              animation: 'sparkle 0.6s ease-out 0.2s forwards',
            }} />
          </>
        )}
      </button>
    </>
  );
}
