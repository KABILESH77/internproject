/**
 * Ollama AI Service
 * Connects to local Ollama instance running Llama models
 * Provides reactive AI assistant for job recommendations
 */

import { Internship } from '../components/InternshipCard';
import { OnboardingData } from '../components/OnboardingModal';
import { ScoredInternship } from './recommendationEngine';

// Ollama API configuration
const OLLAMA_BASE_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3.2'; // Can also use 'llama2', 'mistral', 'codellama', etc.

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export interface ConversationContext {
  userProfile: OnboardingData | null;
  availableInternships: Internship[];
  currentRecommendations: ScoredInternship[];
  conversationHistory: ChatMessage[];
}

/**
 * Check if Ollama is running and accessible
 */
export async function checkOllamaHealth(): Promise<{ available: boolean; models: string[] }> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      return { available: false, models: [] };
    }
    
    const data = await response.json();
    const models = data.models?.map((m: { name: string }) => m.name) || [];
    
    return { available: true, models };
  } catch (error) {
    console.warn('Ollama not available:', error);
    return { available: false, models: [] };
  }
}

/**
 * Generate system prompt for the AI assistant
 */
function generateSystemPrompt(context: ConversationContext): string {
  const { userProfile, availableInternships, currentRecommendations } = context;
  
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
  
  return `You are JobRasa AI, a friendly and helpful career assistant for an internship platform called JobRasa. Your role is to help users find the perfect internship opportunities.

ABOUT JOBRASA:
- JobRasa is an AI-powered internship matching platform
- We connect students and early-career professionals with internship opportunities
- We use ML-based matching to recommend relevant positions

${profileInfo}

CURRENT TOP RECOMMENDATIONS:
${topRecommendations || 'No recommendations generated yet.'}

AVAILABLE INTERNSHIP SECTORS:
Technology, Healthcare, Education, Finance, Government, Environment, Media, Non-Profit

YOUR CAPABILITIES:
1. Answer questions about internships and career advice
2. Help users refine their preferences
3. Explain why certain internships are recommended
4. Provide information about specific internship positions
5. Give tips for applications and interviews
6. Suggest skills to develop for career goals

GUIDELINES:
- Be concise but helpful (aim for 2-4 sentences unless more detail is requested)
- Be encouraging and supportive
- If asked about specific internships, reference the recommendations provided
- If the user asks to search for something specific, acknowledge you understand and suggest they use the search page for detailed filtering
- Never make up internship details that aren't in the provided data
- If you don't know something, admit it and suggest alternatives
- Use emojis sparingly for friendliness 🎯

RESPONSE FORMAT:
- Keep responses under 150 words unless explaining something complex
- Use bullet points for lists
- Be conversational but professional`;
}

/**
 * Send a chat message to Ollama and get a response
 */
export async function sendChatMessage(
  message: string,
  context: ConversationContext,
  model: string = DEFAULT_MODEL,
  onStream?: (chunk: string) => void
): Promise<string> {
  const systemPrompt = generateSystemPrompt(context);
  
  const messages = [
    { role: 'system', content: systemPrompt },
    ...context.conversationHistory.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: 'user', content: message }
  ];
  
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: !!onStream,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 500, // Max tokens in response
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }
    
    if (onStream && response.body) {
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const json: OllamaResponse = JSON.parse(line);
            if (json.message?.content) {
              fullResponse += json.message.content;
              onStream(json.message.content);
            }
          } catch {
            // Ignore parsing errors for incomplete chunks
          }
        }
      }
      
      return fullResponse;
    } else {
      // Handle non-streaming response
      const data: OllamaResponse = await response.json();
      return data.message?.content || 'I apologize, but I couldn\'t generate a response.';
    }
  } catch (error) {
    console.error('Error communicating with Ollama:', error);
    throw error;
  }
}

/**
 * Parse user intent from message to determine action
 */
export function parseUserIntent(message: string): {
  intent: 'search' | 'recommend' | 'explain' | 'profile' | 'general';
  keywords: string[];
  sectors: string[];
  isRemoteQuery: boolean;
} {
  const lowerMessage = message.toLowerCase();
  
  // Detect intent
  let intent: 'search' | 'recommend' | 'explain' | 'profile' | 'general' = 'general';
  
  const searchKeywords = ['find', 'search', 'look for', 'show me', 'looking for', 'want', 'need'];
  const recommendKeywords = ['recommend', 'suggest', 'best for me', 'match', 'suited'];
  const explainKeywords = ['why', 'how', 'explain', 'tell me about', 'what is'];
  const profileKeywords = ['my profile', 'my skills', 'update', 'change my'];
  
  if (searchKeywords.some(k => lowerMessage.includes(k))) {
    intent = 'search';
  } else if (recommendKeywords.some(k => lowerMessage.includes(k))) {
    intent = 'recommend';
  } else if (explainKeywords.some(k => lowerMessage.includes(k))) {
    intent = 'explain';
  } else if (profileKeywords.some(k => lowerMessage.includes(k))) {
    intent = 'profile';
  }
  
  // Extract keywords
  const skillKeywords = [
    'python', 'javascript', 'react', 'java', 'sql', 'data', 'design', 
    'marketing', 'writing', 'research', 'excel', 'communication'
  ];
  const keywords = skillKeywords.filter(k => lowerMessage.includes(k));
  
  // Extract sectors
  const sectorMap: Record<string, string> = {
    'tech': 'tech',
    'technology': 'tech',
    'software': 'tech',
    'healthcare': 'healthcare',
    'health': 'healthcare',
    'medical': 'healthcare',
    'education': 'education',
    'teaching': 'education',
    'finance': 'finance',
    'banking': 'finance',
    'government': 'government',
    'public': 'government',
    'environment': 'environment',
    'green': 'environment',
    'media': 'media',
    'creative': 'media',
    'nonprofit': 'nonprofit',
    'ngo': 'nonprofit'
  };
  
  const sectors = Object.entries(sectorMap)
    .filter(([keyword]) => lowerMessage.includes(keyword))
    .map(([, sector]) => sector)
    .filter((v, i, a) => a.indexOf(v) === i); // Unique
  
  // Check for remote
  const isRemoteQuery = lowerMessage.includes('remote') || lowerMessage.includes('work from home');
  
  return { intent, keywords, sectors, isRemoteQuery };
}

/**
 * Generate quick suggestions based on context
 */
export function generateQuickSuggestions(context: ConversationContext): string[] {
  const suggestions: string[] = [];
  
  if (!context.userProfile) {
    suggestions.push('Help me set up my profile');
    suggestions.push('What skills are in demand?');
  } else {
    if (context.currentRecommendations.length > 0) {
      suggestions.push(`Tell me about ${context.currentRecommendations[0].title}`);
      suggestions.push('Why is this my top match?');
    }
    suggestions.push('Find remote internships');
    suggestions.push(`More ${context.userProfile.interests[0] || 'tech'} internships`);
  }
  
  suggestions.push('Tips for my application');
  suggestions.push('What skills should I learn?');
  
  return suggestions.slice(0, 4);
}

/**
 * Fallback response when Ollama is not available
 */
export function getFallbackResponse(message: string, context: ConversationContext): string {
  const intent = parseUserIntent(message);
  
  if (intent.intent === 'recommend' || intent.intent === 'search') {
    if (context.currentRecommendations.length > 0) {
      const top = context.currentRecommendations[0];
      return `Based on your profile, I recommend checking out **${top.title}** at ${top.organization} - it's a ${top.matchScore}% match! ${top.isRemote ? '✨ This is a remote position!' : ''} You can see all your personalized matches on the Recommendations page.`;
    }
    return 'Complete your profile to get personalized internship recommendations! I\'ll analyze your skills and interests to find the best matches for you. 🎯';
  }
  
  if (intent.intent === 'explain') {
    return 'Our matching algorithm considers three factors: **Skills Match** (40%) - how well your skills align with requirements, **Interest Match** (35%) - whether the sector matches your career interests, and **Location** (25%) - distance and remote options. You can see detailed breakdowns on each recommendation!';
  }
  
  if (intent.intent === 'profile') {
    return 'You can update your profile anytime to improve your matches! Add more skills, update your interests, or change your location to see different recommendations. 📝';
  }
  
  // General fallback
  return 'I\'m here to help you find the perfect internship! You can ask me to find specific types of internships, explain your matches, or give career advice. What would you like to know? 🚀';
}
