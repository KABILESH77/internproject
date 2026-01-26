/**
 * AI Chat Service using Groq API
 * Free, fast inference with Llama models
 * 
 * Get your free API key at: https://console.groq.com/keys
 */

import { Internship } from '../components/InternshipCard';
import { OnboardingData } from '../components/OnboardingModal';
import { ScoredInternship } from './recommendationEngine';

// Groq API Configuration
// Free tier: https://console.groq.com/keys
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant'; // Fast, free model

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ConversationContext {
  userProfile: OnboardingData | null;
  availableInternships: Internship[];
  currentRecommendations: ScoredInternship[];
  conversationHistory: ChatMessage[];
}

/**
 * Get API key from environment or localStorage
 */
function getApiKey(): string | null {
  // Check environment variable first
  const envKey = import.meta.env.VITE_GROQ_API_KEY;
  if (envKey) return envKey;
  
  // Check localStorage as fallback
  const storedKey = localStorage.getItem('groq_api_key');
  if (storedKey) return storedKey;
  
  return null;
}

/**
 * Check if API key is configured
 */
export function isAIConfigured(): boolean {
  return !!getApiKey();
}

/**
 * Save API key to localStorage
 */
export function saveApiKey(key: string): void {
  localStorage.setItem('groq_api_key', key);
}

/**
 * Clear saved API key
 */
export function clearApiKey(): void {
  localStorage.removeItem('groq_api_key');
}

/**
 * Generate system prompt for the AI assistant
 */
function generateSystemPrompt(context: ConversationContext): string {
  const { userProfile, currentRecommendations } = context;
  
  const profileInfo = userProfile
    ? `User Profile:
- Education: ${userProfile.education}
- Skills: ${userProfile.skills.join(', ')}
- Interests: ${userProfile.interests.join(', ')}
- Location: ${userProfile.location}`
    : 'User has not completed their profile yet.';
  
  const topRecommendations = currentRecommendations.slice(0, 5).map((r, i) => 
    `${i + 1}. ${r.title} at ${r.organization} (${r.matchScore}% match)${r.isRemote ? ' - Remote' : ` - ${r.location}`}`
  ).join('\n');
  
  return `You are JobRasa AI, a friendly and helpful career assistant for an internship platform called JobRasa.

ABOUT JOBRASA:
- AI-powered internship matching platform
- Connects students and professionals with internships
- Uses ML-based matching to recommend positions

${profileInfo}

TOP RECOMMENDATIONS:
${topRecommendations || 'No recommendations yet.'}

YOUR ROLE:
1. Answer questions about internships and careers
2. Help users understand their recommendations
3. Provide application and interview tips
4. Suggest skills to develop
5. Be encouraging and supportive

GUIDELINES:
- Keep responses concise (2-4 sentences unless more detail needed)
- Be conversational but professional
- Use emojis sparingly for friendliness
- If unsure, admit it and suggest alternatives
- Never make up internship details`;
}

/**
 * Smart fallback responses when API is unavailable
 */
export function getFallbackResponse(userMessage: string, context: ConversationContext): string {
  const message = userMessage.toLowerCase();
  const { userProfile, currentRecommendations } = context;
  
  // Greeting responses
  if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return userProfile
      ? `Hello! 👋 Great to see you! Based on your skills in ${userProfile.skills.slice(0, 2).join(' and ')}, I have some exciting internship recommendations for you. What would you like to explore today?`
      : `Welcome to JobRasa! 👋 I'm your AI career assistant. To give you personalized recommendations, I'd love to know more about your skills and interests. How can I help you today?`;
  }
  
  // Recommendations
  if (message.includes('recommend') || message.includes('suggestion') || message.includes('internship')) {
    if (currentRecommendations.length > 0) {
      const top3 = currentRecommendations.slice(0, 3);
      return `Here are your top matches:\n\n${top3.map((r, i) => 
        `${i + 1}. **${r.title}** at ${r.organization} (${r.matchScore}% match)`
      ).join('\n')}\n\nClick on any internship card to see full details!`;
    }
    return "Upload your resume on the ML Recommendations page to get personalized matches based on your skills and experience!";
  }
  
  // Skills
  if (message.includes('skill') || message.includes('learn')) {
    return "Top in-demand skills for interns include:\n\n• Programming (Python, JavaScript, React)\n• Data Analysis (SQL, Excel, Tableau)\n• Communication & teamwork\n• Problem-solving\n\nFocus on building projects to demonstrate these skills!";
  }
  
  // Resume/Application
  if (message.includes('resume') || message.includes('cv') || message.includes('application')) {
    return "Resume tips for internships:\n\n• Keep it to 1 page\n• Highlight relevant projects and coursework\n• Quantify achievements when possible\n• Tailor it for each application\n• Include your GitHub/portfolio links";
  }
  
  // Interview
  if (message.includes('interview')) {
    return "Interview preparation tips:\n\n• Research the company thoroughly\n• Prepare STAR method stories\n• Practice common behavioral questions\n• Prepare thoughtful questions to ask\n• Test your tech setup for virtual interviews";
  }
  
  // Help
  if (message.includes('help') || message.includes('what can you')) {
    return "I can help you with:\n\n• 🎯 Finding internship recommendations\n• 📝 Resume and application tips\n• 💼 Interview preparation\n• 🚀 Career development advice\n• ❓ Questions about JobRasa\n\nWhat would you like to explore?";
  }
  
  // Thank you
  if (message.includes('thank') || message.includes('thanks')) {
    return "You're welcome! 😊 Good luck with your internship search. I'm here whenever you need more help!";
  }
  
  // Default
  return "I'm here to help with your internship search! You can ask me about:\n\n• Internship recommendations\n• Resume and application tips\n• Interview preparation\n• Career development\n\nWhat would you like to know?";
}

/**
 * Generate quick suggestion buttons based on context
 */
export function generateQuickSuggestions(context: ConversationContext): string[] {
  const { userProfile, currentRecommendations } = context;
  
  if (!userProfile) {
    return [
      "How do I get started?",
      "Show me internships",
      "What skills are in demand?"
    ];
  }
  
  if (currentRecommendations.length > 0) {
    return [
      "Why these recommendations?",
      "Help me with my resume",
      "Interview tips please"
    ];
  }
  
  return [
    "Find me internships",
    "What skills should I learn?",
    "Application tips"
  ];
}

/**
 * Send message to Groq API
 */
export async function sendChatMessage(
  userMessage: string,
  context: ConversationContext,
  onStream?: (chunk: string) => void
): Promise<string> {
  const apiKey = getApiKey();
  
  // If no API key, use fallback
  if (!apiKey) {
    // Simulate slight delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 500));
    return getFallbackResponse(userMessage, context);
  }
  
  const systemPrompt = generateSystemPrompt(context);
  
  // Build messages array
  const messages = [
    { role: 'system', content: systemPrompt },
    ...context.conversationHistory.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: 'user', content: userMessage }
  ];
  
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 500,
        stream: !!onStream,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      
      // Handle specific error cases
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Groq API key.');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      
      throw new Error(error.error?.message || 'API request failed');
    }
    
    // Handle streaming response
    if (onStream && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
        
        for (const line of lines) {
          const data = line.replace('data: ', '').trim();
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              onStream(content);
            }
          } catch {
            // Skip invalid JSON chunks
          }
        }
      }
      
      return fullResponse;
    }
    
    // Handle non-streaming response
    const data = await response.json();
    return data.choices?.[0]?.message?.content || getFallbackResponse(userMessage, context);
    
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return fallback response on error
    return getFallbackResponse(userMessage, context);
  }
}

/**
 * Test API key validity
 */
export async function testApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5,
      }),
    });
    
    if (response.ok) {
      return { valid: true };
    }
    
    if (response.status === 401) {
      return { valid: false, error: 'Invalid API key' };
    }
    
    return { valid: false, error: 'API test failed' };
  } catch (error) {
    return { valid: false, error: 'Connection failed' };
  }
}
