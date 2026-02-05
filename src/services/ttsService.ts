/**
 * Text-to-Speech Service
 * Supports multiple TTS backends:
 * 1. OpenAI TTS API (most natural human-like voices)
 * 2. Chatterbox TTS (via Hugging Face Gradio API)
 * 3. Web Speech API (browser built-in, fallback)
 */

// Hugging Face Spaces Gradio API endpoint for Chatterbox
const CHATTERBOX_API_URL = 'https://resembleai-chatterbox-turbo-demo.hf.space/api/predict';
const CHATTERBOX_GRADIO_URL = 'https://resembleai-chatterbox-turbo-demo.hf.space';

// OpenAI TTS API
const OPENAI_TTS_URL = 'https://api.openai.com/v1/audio/speech';

// OpenAI voices: alloy, echo, fable, onyx, nova, shimmer
export type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface TTSOptions {
  text: string;
  voice?: 'default' | 'male' | 'female';
  openaiVoice?: OpenAIVoice;
  speed?: number; // 0.5 to 2.0
  pitch?: number; // 0 to 2
  language?: string;
  useOpenAI?: boolean; // Use OpenAI TTS if available
}

export interface TTSResult {
  audioUrl?: string;
  audioBlob?: Blob;
  success: boolean;
  error?: string;
  source: 'openai' | 'chatterbox' | 'web-speech' | 'none';
}

class TTSService {
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private openaiApiKey: string | null = null;
  private gradioSessionHash: string;

  constructor() {
    // Initialize Web Speech API if available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      // Pre-load voices
      this.synthesis.getVoices();
      this.synthesis.onvoiceschanged = () => {
        console.log('TTS: Voices loaded:', this.synthesis?.getVoices().length);
      };
    }
    this.gradioSessionHash = this.generateSessionHash();
    
    // Check for OpenAI API key
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
    if (this.openaiApiKey) {
      console.log('TTS: OpenAI API key found - high quality voices available');
    }
  }

  /**
   * Set OpenAI API key at runtime
   */
  setOpenAIApiKey(key: string) {
    this.openaiApiKey = key;
    console.log('TTS: OpenAI API key set');
  }

  /**
   * Check if OpenAI TTS is available
   */
  isOpenAIAvailable(): boolean {
    return !!this.openaiApiKey;
  }

  private generateSessionHash(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Generate speech using OpenAI's TTS API (most natural voices)
   * Voices: alloy, echo, fable, onyx, nova, shimmer
   * - nova: female, warm and engaging
   * - alloy: neutral, balanced
   * - echo: male, clear
   * - fable: expressive, storytelling
   * - onyx: male, deep
   * - shimmer: female, gentle
   */
  async speakWithOpenAI(text: string, options: Partial<TTSOptions> = {}): Promise<TTSResult> {
    if (!this.openaiApiKey) {
      console.log('TTS: OpenAI API key not available');
      return {
        success: false,
        error: 'OpenAI API key not configured',
        source: 'none',
      };
    }

    try {
      console.log('TTS: Using OpenAI TTS...');
      
      // Stop any current audio
      this.stop();

      const voice = options.openaiVoice || 'nova'; // nova sounds very natural
      const speed = options.speed || 1.0;

      const response = await fetch(OPENAI_TTS_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1-hd', // High definition model for better quality
          input: text,
          voice: voice,
          speed: speed,
          response_format: 'mp3',
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI TTS failed: ${error}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play the audio with proper buffering
      return new Promise((resolve) => {
        const audio = new Audio();
        this.currentAudio = audio;
        
        // Set up event handlers before loading
        audio.onended = () => {
          console.log('TTS: OpenAI audio ended');
          this.isPlaying = false;
          this.currentAudio = null;
          URL.revokeObjectURL(audioUrl);
          resolve({
            success: true,
            audioUrl,
            audioBlob,
            source: 'openai',
          });
        };

        audio.onerror = (err) => {
          console.error('TTS: OpenAI audio error:', err);
          this.isPlaying = false;
          this.currentAudio = null;
          URL.revokeObjectURL(audioUrl);
          resolve({
            success: false,
            error: 'Audio playback failed',
            source: 'none',
          });
        };

        // Wait for enough data to be buffered before playing
        audio.oncanplaythrough = () => {
          console.log('TTS: Audio buffered, playing...');
          this.isPlaying = true;
          audio.play().catch(err => {
            console.error('TTS: Play failed:', err);
            this.isPlaying = false;
            this.currentAudio = null;
            resolve({
              success: false,
              error: err.message,
              source: 'none',
            });
          });
        };

        // Handle stalls during playback
        audio.onstalled = () => {
          console.log('TTS: Audio stalled, waiting for data...');
        };

        audio.onwaiting = () => {
          console.log('TTS: Audio waiting for data...');
        };

        // Preload the entire audio file
        audio.preload = 'auto';
        console.log('TTS: Loading OpenAI audio...');
        audio.src = audioUrl;
        audio.load();
      });
    } catch (error) {
      console.error('TTS: OpenAI error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'none',
      };
    }
  }

  /**
   * Try to use Chatterbox TTS via Hugging Face Gradio API
   */
  async generateWithChatterbox(text: string): Promise<TTSResult> {
    try {
      // Gradio API format for the Chatterbox Turbo demo
      const response = await fetch(`${CHATTERBOX_GRADIO_URL}/run/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [
            text, // Text to synthesize
            null, // Reference audio file (optional)
            0.8,  // Temperature
            0,    // Seed (0 for random)
            0.05, // min_p
            0.95, // top_p
            1000, // top_k
            1.2,  // repetition_penalty
            true, // normalize loudness
          ],
          session_hash: this.gradioSessionHash,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Gradio returns audio as a file path or base64
      if (result.data && result.data[0]) {
        const audioData = result.data[0];
        
        // Handle different response formats
        if (typeof audioData === 'string') {
          // It's a URL or path
          const audioUrl = audioData.startsWith('http') 
            ? audioData 
            : `${CHATTERBOX_GRADIO_URL}/file=${audioData}`;
          
          return {
            audioUrl,
            success: true,
            source: 'chatterbox',
          };
        } else if (audioData.name) {
          // It's a file object from Gradio
          const audioUrl = `${CHATTERBOX_GRADIO_URL}/file=${audioData.name}`;
          return {
            audioUrl,
            success: true,
            source: 'chatterbox',
          };
        }
      }

      throw new Error('Invalid response format from Chatterbox API');
    } catch (error) {
      console.warn('Chatterbox API failed, falling back to Web Speech:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'none',
      };
    }
  }

  /**
   * Use browser's built-in Web Speech API
   */
  speakWithWebSpeech(text: string, options: Partial<TTSOptions> = {}): Promise<TTSResult> {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        console.error('TTS: Web Speech API not supported');
        resolve({
          success: false,
          error: 'Web Speech API not supported in this browser',
          source: 'none',
        });
        return;
      }

      // Cancel any ongoing speech
      this.stop();

      console.log('TTS: Speaking text:', text.substring(0, 50) + '...');

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings - slightly slower for more natural feel
      utterance.rate = options.speed || 0.95;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = 1.0;

      // Get voices
      const voices = this.synthesis.getVoices();
      console.log('TTS: Available voices:', voices.length);

      // Find the best human-like voice
      const preferredVoice = this.selectBestVoice(voices, options.language || 'en');

      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('TTS: Using voice:', preferredVoice.name);
      }

      this.currentUtterance = utterance;
      this.isPlaying = true;

      utterance.onstart = () => {
        console.log('TTS: Speech started');
      };

      utterance.onend = () => {
        console.log('TTS: Speech ended');
        this.isPlaying = false;
        this.currentUtterance = null;
        resolve({
          success: true,
          source: 'web-speech',
        });
      };

      utterance.onerror = (event) => {
        console.error('TTS: Speech error:', event.error);
        this.isPlaying = false;
        this.currentUtterance = null;
        resolve({
          success: false,
          error: event.error,
          source: 'none',
        });
      };

      // Actually speak
      this.synthesis.speak(utterance);
      console.log('TTS: speak() called');
    });
  }

  /**
   * Select the most human-like voice available
   * Priority: Neural/Online voices > Google voices > Other high-quality voices
   */
  private selectBestVoice(voices: SpeechSynthesisVoice[], language: string): SpeechSynthesisVoice | null {
    const langCode = language.split('-')[0]; // 'en' from 'en-US'
    
    // Filter voices by language
    const langVoices = voices.filter(v => v.lang.startsWith(langCode));
    
    if (langVoices.length === 0) {
      return voices[0] || null;
    }

    // Log available voices for debugging
    console.log('TTS: Language voices available:', langVoices.map(v => v.name).join(', '));

    // Priority 1: Microsoft Neural/Online voices (most natural in Edge)
    // These contain "Online" or "Natural" in the name
    const msNeuralVoice = langVoices.find(v => 
      (v.name.includes('Online') || v.name.includes('Natural')) &&
      (v.name.includes('Microsoft') || v.name.includes('Edge'))
    );
    if (msNeuralVoice) {
      console.log('TTS: Found Microsoft Neural voice');
      return msNeuralVoice;
    }

    // Priority 2: Any "Online" voice (neural quality)
    const onlineVoice = langVoices.find(v => v.name.includes('Online'));
    if (onlineVoice) {
      console.log('TTS: Found Online neural voice');
      return onlineVoice;
    }

    // Priority 3: Google voices (good quality)
    const googleVoice = langVoices.find(v => v.name.includes('Google'));
    if (googleVoice) {
      console.log('TTS: Found Google voice');
      return googleVoice;
    }

    // Priority 4: Specific high-quality voices by name
    const preferredNames = [
      'Samantha', // macOS high quality
      'Alex',     // macOS
      'Zira',     // Windows - female
      'Jenny',    // Windows neural
      'Aria',     // Windows neural
      'Guy',      // Windows neural
      'Sara',     // Windows neural
    ];
    
    for (const name of preferredNames) {
      const voice = langVoices.find(v => v.name.includes(name));
      if (voice) {
        console.log('TTS: Found preferred voice:', name);
        return voice;
      }
    }

    // Priority 5: Female voices often sound clearer
    const femaleVoice = langVoices.find(v => 
      v.name.toLowerCase().includes('female') ||
      v.name.includes('Zira') ||
      v.name.includes('Samantha') ||
      v.name.includes('Helena') ||
      v.name.includes('Catherine')
    );
    if (femaleVoice) {
      console.log('TTS: Found female voice');
      return femaleVoice;
    }

    // Default: first voice for the language
    console.log('TTS: Using default voice for language');
    return langVoices[0];
  }

  /**
   * Main speak method - Priority: OpenAI > Chatterbox > Web Speech
   */
  async speak(text: string, options: Partial<TTSOptions> = {}): Promise<TTSResult> {
    // Clean and prepare text
    const cleanText = this.prepareText(text);
    
    if (!cleanText) {
      return {
        success: false,
        error: 'No text provided',
        source: 'none',
      };
    }

    // Priority 1: OpenAI TTS (most natural)
    if (this.openaiApiKey && (options.useOpenAI !== false)) {
      const openaiResult = await this.speakWithOpenAI(cleanText, options);
      if (openaiResult.success) {
        return openaiResult;
      }
      console.log('TTS: OpenAI failed, trying fallback...');
    }

    // Priority 2: Chatterbox API (only for shorter texts due to API limits)
    if (cleanText.length <= 300) {
      const chatterboxResult = await this.generateWithChatterbox(cleanText);
      if (chatterboxResult.success && chatterboxResult.audioUrl) {
        // Play the audio from Chatterbox
        return this.playAudioFromUrl(chatterboxResult.audioUrl);
      }
    }

    // Priority 3: Web Speech API (browser built-in)
    return this.speakWithWebSpeech(cleanText, options);
  }

  /**
   * Play audio from a URL
   */
  private playAudioFromUrl(url: string): Promise<TTSResult> {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      
      audio.onended = () => {
        this.isPlaying = false;
        resolve({
          audioUrl: url,
          success: true,
          source: 'chatterbox',
        });
      };

      audio.onerror = () => {
        // Fall back to Web Speech if audio fails to load
        console.warn('Failed to load Chatterbox audio, falling back to Web Speech');
        resolve({
          success: false,
          error: 'Failed to load audio',
          source: 'none',
        });
      };

      this.isPlaying = true;
      audio.play().catch(() => {
        this.isPlaying = false;
        resolve({
          success: false,
          error: 'Failed to play audio',
          source: 'none',
        });
      });
    });
  }

  /**
   * Clean and prepare text for speech
   */
  private prepareText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 1000); // Limit length
  }

  /**
   * Stop current speech
   */
  stop(): void {
    // Stop Web Speech API
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    
    // Stop OpenAI/Chatterbox audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    
    this.isPlaying = false;
    this.currentUtterance = null;
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.synthesis && this.isPlaying) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    const audioPlaying = this.currentAudio && !this.currentAudio.paused;
    return this.isPlaying || (this.synthesis?.speaking ?? false) || !!audioPlaying;
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis?.getVoices() || [];
  }
}

// Export singleton instance
export const ttsService = new TTSService();

// Export the class for testing
export { TTSService };
