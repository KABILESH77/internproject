/**
 * Groq AI Service
 * Handles communication with Groq API for conversational AI responses
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// System prompt for the internship assistant
const SYSTEM_PROMPT = `You are JobRasa AI, a helpful and friendly voice assistant for an internship discovery platform. Your role is to:

1. Help users find internships that match their skills and interests
2. Answer questions about specific internships, companies, or career paths
3. Provide tips for applications, resumes, and interviews
4. Guide users through the platform's features
5. Be conversational, supportive, and encouraging - especially for first-time job seekers

Keep your responses concise (2-3 sentences max) since they will be spoken aloud. Be warm and helpful like a career counselor.

Available internship categories on the platform:
- Software Development (React, Python, JavaScript, etc.)
- Data Science & Analytics
- UI/UX Design
- Marketing & Content
- Business & Finance

If asked about specific internships, mention that users can browse the Search page or check their personalized Recommendations.`;

class GroqService {
  private conversationHistory: ChatMessage[] = [];
  private maxHistoryLength = 10; // Keep last 10 messages for context

  constructor() {
    this.resetConversation();
  }

  /**
   * Reset conversation history
   */
  resetConversation(): void {
    this.conversationHistory = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];
  }

  /**
   * Send a message to Groq and get a response
   */
  async chat(userMessage: string): Promise<GroqResponse> {
    console.log('GroqService: Sending message:', userMessage);
    
    if (!GROQ_API_KEY) {
      console.error('GroqService: No API key configured');
      return {
        success: false,
        error: 'Groq API key not configured. Please add VITE_GROQ_API_KEY to your .env file.',
      };
    }

    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      });

      // Trim history if too long (keep system prompt + last N messages)
      if (this.conversationHistory.length > this.maxHistoryLength + 1) {
        this.conversationHistory = [
          this.conversationHistory[0], // Keep system prompt
          ...this.conversationHistory.slice(-this.maxHistoryLength),
        ];
      }

      console.log('GroqService: Making API request...');
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile', // Fast and capable model
          messages: this.conversationHistory,
          temperature: 0.7,
          max_tokens: 150, // Keep responses short for voice
          top_p: 0.9,
        }),
      });

      console.log('GroqService: Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('GroqService: API error:', errorData);
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('GroqService: Response data:', data);
      const assistantMessage = data.choices?.[0]?.message?.content;

      if (!assistantMessage) {
        throw new Error('No response from Groq');
      }

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      console.log('GroqService: Success! Response:', assistantMessage);
      return {
        success: true,
        message: assistantMessage,
      };
    } catch (error) {
      console.error('Groq API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get response',
      };
    }
  }

  /**
   * Get a quick greeting
   */
  async getGreeting(): Promise<string> {
    const greetings = [
      "Hi there! I'm JobRasa AI, your internship assistant. How can I help you today?",
      "Hello! I'm here to help you find the perfect internship. What are you looking for?",
      "Hey! Ready to explore some amazing internship opportunities? Just ask me anything!",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  /**
   * Get conversation history (for display)
   */
  getHistory(): ChatMessage[] {
    return this.conversationHistory.filter(m => m.role !== 'system');
  }
}

// Export singleton instance
export const groqService = new GroqService();
export { GroqService };
