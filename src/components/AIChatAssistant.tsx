/**
 * AI Chat Assistant Component
 * Reactive chatbot interface powered by Ollama/Llama
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
  RefreshCw
} from 'lucide-react';
import { Button } from './Button';
import { 
  ChatMessage, 
  sendChatMessage, 
  checkOllamaHealth,
  generateQuickSuggestions,
  getFallbackResponse,
  ConversationContext
} from '../services/ollamaService';
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
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Don't check Ollama on mount - only when user sends first message
  // This prevents network errors from appearing in console

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: userProfile 
          ? `Hi there! 👋 I'm JobRasa AI, your personal career assistant. I see you're interested in ${userProfile.interests.slice(0, 2).join(' and ')} with skills in ${userProfile.skills.slice(0, 2).join(' and ')}. How can I help you find the perfect internship today?`
          : `Welcome to JobRasa! 👋 I'm your AI career assistant. I can help you discover internship opportunities, explain our matching system, or give you career advice. What would you like to explore?`,
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
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

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
      let response: string;
      
      if (ollamaAvailable) {
        // Use Ollama with streaming
        response = await sendChatMessage(
          userMessage.content,
          { ...context, conversationHistory: [...messages, userMessage] },
          'llama3.2',
          (chunk) => {
            setStreamingMessage(prev => prev + chunk);
          }
        );
      } else {
        // Use fallback
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        response = getFallbackResponse(userMessage.content, context);
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setStreamingMessage('');
    } catch {
      // Silently use fallback - don't show error in console
      setError('Using smart fallback mode.');
      
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

  const quickSuggestions = generateQuickSuggestions(getContext());

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 ease-in-out ${
        isMinimized 
          ? 'bottom-4 right-4 w-auto h-auto' 
          : 'bottom-4 right-4 w-96 h-[600px] max-h-[80vh]'
      }`}
      role="dialog"
      aria-label="AI Chat Assistant"
    >
      {isMinimized ? (
        /* Minimized State */
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Bot className="w-5 h-5" />
          <span className="font-medium">JobRasa AI</span>
          <Maximize2 className="w-4 h-4" />
        </button>
      ) : (
        /* Full Chat Interface */
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl border border-[var(--color-neutral-200)] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)] text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">JobRasa AI</h3>
                <p className="text-xs text-white/80">
                  {ollamaAvailable === null ? 'Connecting...' : 
                   ollamaAvailable ? 'Powered by Llama' : 'Smart Assistant'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
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

          {/* Status Banner */}
          {ollamaAvailable === false && (
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              <span>Running in fallback mode. Start Ollama for full AI features.</span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-neutral-50)]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-[var(--color-accent-500)]' 
                    : 'bg-[var(--color-primary-600)]'
                }`}>
                  {message.role === 'user' 
                    ? <User className="w-4 h-4 text-white" />
                    : <Bot className="w-4 h-4 text-white" />
                  }
                </div>
                
                {/* Message Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-[var(--color-accent-500)] text-white rounded-tr-md'
                    : 'bg-white border border-[var(--color-neutral-200)] text-[var(--color-neutral-900)] rounded-tl-md'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.timestamp && (
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/70' : 'text-[var(--color-neutral-500)]'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {/* Streaming Message */}
            {streamingMessage && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary-600)] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-md px-4 py-3 bg-white border border-[var(--color-neutral-200)]">
                  <p className="text-sm whitespace-pre-wrap">{streamingMessage}</p>
                  <span className="inline-block w-2 h-4 bg-[var(--color-primary-500)] animate-pulse ml-1" />
                </div>
              </div>
            )}
            
            {/* Loading Indicator */}
            {isLoading && !streamingMessage && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary-600)] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-[var(--color-neutral-200)] rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex items-center gap-2 text-[var(--color-neutral-600)]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 py-2 border-t border-[var(--color-neutral-200)] bg-white">
              <p className="text-xs text-[var(--color-neutral-500)] mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(suggestion)}
                    className="text-xs px-3 py-1.5 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] rounded-full hover:bg-[var(--color-primary-100)] transition-colors"
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
          <div className="p-4 border-t border-[var(--color-neutral-200)] bg-white">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about internships..."
                className="flex-1 px-4 py-3 rounded-full border border-[var(--color-neutral-300)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] outline-none text-sm transition-all"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="p-3 rounded-full bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-center text-[var(--color-neutral-500)] mt-2">
              {ollamaAvailable ? 'Powered by Llama 🦙' : 'Smart matching enabled ✨'}
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
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
      aria-label="Open AI Chat Assistant"
    >
      <MessageCircle className="w-6 h-6" />
      {hasUnread && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-[var(--color-accent-500)] rounded-full animate-pulse" />
      )}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[var(--color-neutral-900)] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Ask JobRasa AI 🤖
      </span>
    </button>
  );
}
