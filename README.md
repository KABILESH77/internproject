# VibeMatch Intern

A modern internship matching platform with AI-powered voice interaction capabilities.

> 🎨 Original UI Design: [Figma - VibeMatch Intern UI Design](https://www.figma.com/design/AZ95XakeTvYnVa5uDmu1Ki/VibeMatch-Intern-UI-Design)

---

## 🚀 Features

- **Internship Discovery** - Browse and search internship opportunities
- **Smart Matching** - AI-powered recommendations
- **Voice Chat** - Full-featured voice interaction with AI assistant
- **Text-to-Speech** - Listen to internship descriptions and content
- **Speech-to-Text** - Voice input for hands-free interaction

---

## 🎙️ Voice Features (TTS & STT)

### Speech-to-Text (STT)

| Feature | Details |
|---------|---------|
| **Technology** | Web Speech API (SpeechRecognition) |
| **Hook** | `useSpeechRecognition.ts` |
| **Languages** | Configurable (default: en-US) |
| **Modes** | Continuous & single-shot recognition |
| **Real-time** | Interim results for live transcription |

**Capabilities:**
- ✅ Real-time speech recognition
- ✅ Interim transcript display
- ✅ Error handling (no-speech, audio-capture, permissions)
- ✅ Browser compatibility detection

**Browser Support:**
| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Edge | ✅ Full |
| Safari | ✅ iOS |
| Firefox | ❌ Not supported |

---

### Text-to-Speech (TTS)

Multi-engine TTS system with intelligent fallback:

```
Priority Chain: OpenAI → Chatterbox → Web Speech API
```

#### 1. OpenAI TTS (Premium Quality)
| Property | Value |
|----------|-------|
| **Model** | tts-1-hd (High Definition) |
| **Voices** | alloy, echo, fable, onyx, nova, shimmer |
| **Format** | MP3 |
| **Speed** | 0.5x - 2.0x |

**Voice Descriptions:**
- `nova` (default) - Female, warm and engaging
- `alloy` - Neutral, balanced
- `echo` - Male, clear
- `fable` - Expressive, storytelling
- `onyx` - Male, deep
- `shimmer` - Female, gentle

#### 2. Chatterbox TTS (Free)
| Property | Value |
|----------|-------|
| **API** | Hugging Face Gradio |
| **Provider** | ResembleAI |
| **Limit** | 300 characters |
| **Cost** | Free |

#### 3. Web Speech API (Fallback)
| Property | Value |
|----------|-------|
| **Technology** | Browser Native |
| **Voices** | System-dependent |
| **Cost** | Free |
| **Offline** | ✅ Supported |

---

### Voice Chat Component

Full-featured AI voice assistant:

```
User Speech → STT → AI (Groq LLM) → TTS → Audio Output
```

**Features:**
- 🎤 Push-to-talk microphone input
- 🤖 AI responses via Groq (llama-3.3-70b-versatile)
- 🔊 Automatic speech output
- 🔇 Mute/unmute TTS
- 💬 Conversation history
- 📱 Floating dialog UI

**States:**
- `idle` - Ready for input
- `listening` - Recording speech
- `processing` - AI generating response
- `speaking` - Playing audio response

---

## 📁 Project Structure

```
src/
├── components/
│   ├── VoiceChat.tsx           # Full voice chat with AI
│   ├── TextToSpeechButton.tsx  # Reusable TTS button component
│   └── VoiceInputButton.tsx    # Voice input button
├── hooks/
│   └── useSpeechRecognition.ts # STT custom hook
├── services/
│   ├── ttsService.ts           # Multi-engine TTS service
│   └── groqService.ts          # AI chat service
└── ...
```

---

## ⚙️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI API Key (for premium TTS)
VITE_OPENAI_API_KEY=your_openai_api_key

# Groq API Key (for AI voice chat)
VITE_GROQ_API_KEY=your_groq_api_key

# Supabase (database)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_OPENAI_API_KEY` | Optional | Premium TTS (falls back to free options) |
| `VITE_GROQ_API_KEY` | Required for Voice Chat | AI responses |
| `VITE_SUPABASE_URL` | Required | Database connection |
| `VITE_SUPABASE_ANON_KEY` | Required | Database authentication |

---

## 📖 Usage Examples

### Using Text-to-Speech Button

```tsx
import { TextToSpeechButton } from './components/TextToSpeechButton';

<TextToSpeechButton 
  text="Hello, welcome to VibeMatch!"
  variant="icon"    // 'icon' | 'button' | 'pill'
  size="md"         // 'sm' | 'md' | 'lg'
  onError={(err) => console.error(err)}
/>
```

### Using TTS Hook

```tsx
import { useTextToSpeech } from './components/TextToSpeechButton';

const { speak, stop, isPlaying } = useTextToSpeech();

// Speak text
await speak("This is a test message");

// Stop playback
stop();
```

### Using Speech Recognition Hook

```tsx
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

const {
  isListening,
  transcript,
  interimTranscript,
  startListening,
  stopListening,
  isSupported
} = useSpeechRecognition({
  language: 'en-US',
  continuous: true,
  onResult: (text) => console.log('Recognized:', text)
});
```

### Voice Chat Integration

```tsx
import { VoiceChat, VoiceChatButton } from './components/VoiceChat';

const [isOpen, setIsOpen] = useState(false);

<VoiceChatButton onClick={() => setIsOpen(true)} />
<VoiceChat 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
/>
```

---

## 🏗️ Architecture

### Audio Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERACTION                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SPEECH-TO-TEXT (STT)                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  useSpeechRecognition Hook                          │    │
│  │  └── Web Speech API (SpeechRecognition)             │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      AI PROCESSING                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  groqService.chat()                                 │    │
│  │  └── Groq API (llama-3.3-70b-versatile)            │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    TEXT-TO-SPEECH (TTS)                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  TTSService (Priority Fallback)                     │    │
│  │  ├── 1. OpenAI TTS API (tts-1-hd)                  │    │
│  │  ├── 2. Chatterbox (Gradio/HuggingFace)            │    │
│  │  └── 3. Web Speech API (Browser Native)            │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      AUDIO OUTPUT                            │
│  ├── HTMLAudioElement (OpenAI/Chatterbox)                   │
│  └── SpeechSynthesisUtterance (Web Speech)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **AI/LLM** | Groq (Llama 3.3) |
| **TTS** | OpenAI, Chatterbox, Web Speech API |
| **STT** | Web Speech API |
| **Database** | Supabase |
| **Deployment** | Vercel |

---

## 📝 API Services Used

| Service | Purpose | Documentation |
|---------|---------|---------------|
| OpenAI | Text-to-Speech | [docs.openai.com](https://platform.openai.com/docs/guides/text-to-speech) |
| Groq | LLM/AI Chat | [console.groq.com](https://console.groq.com/docs) |
| Chatterbox | Free TTS | [HuggingFace Space](https://huggingface.co/spaces/ResembleAI/chatterbox-turbo-demo) |
| Supabase | Database | [supabase.com](https://supabase.com/docs) |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for TTS API
- [Groq](https://groq.com/) for fast LLM inference
- [ResembleAI](https://www.resemble.ai/) for Chatterbox TTS
- [Supabase](https://supabase.com/) for backend services
  