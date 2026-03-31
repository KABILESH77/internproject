<div align="center">

# 🚀 JobRasa - AI-Powered Internship Discovery Platform

### *The smartest way to find your perfect government internship*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-00CED1?style=for-the-badge)](https://internproject.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![AI Powered](https://img.shields.io/badge/AI-Groq_LLM-FF6B6B?style=for-the-badge)](https://groq.com)

<img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800" alt="JobRasa Hero" width="600" style="border-radius: 12px; margin: 20px 0;">

**🎤 Voice-First • 🧠 ML-Powered Matching • 🎯 Beginner-Friendly • 🌍 Multi-Language**

[Features](#-why-jobrasa) • [Demo](#-live-demo) • [Installation](#️-quick-start) • [Architecture](#-architecture) • [Voice Features](#-voice-ai-features)

</div>

---

## 🌟 Why JobRasa?

> **The Problem:** Students waste hours scrolling through irrelevant job listings. Traditional platforms use basic keyword matching, ignoring skill relationships and career goals.

> **Our Solution:** JobRasa uses **machine learning** to understand your skills, interests, and experience level—then recommends internships that actually match. Plus, talk to our **AI assistant** using just your voice!

### 🏆 What Makes Us Different

| Feature | Traditional Platforms | JobRasa |
|---------|----------------------|---------|
| **Matching** | Basic keyword search | ML-powered with skill graphs & TF-IDF |
| **Voice Input** | ❌ Not available | ✅ Full voice conversation with AI |
| **Accessibility** | Limited | Text-to-Speech, Speech-to-Text, Multi-language |
| **Explainability** | "Jobs for you" (no reason) | "You match 87% because of React, Python skills" |
| **Beginner Focus** | Buried in results | Auto-boosted with clear badges |
| **AI Assistant** | Generic chatbot | Career-aware with your profile context |
| **Cost** | Often paid premium | 100% Free with fallback TTS engines |

---

## ✨ Key Features

### 🎤 Voice-First Experience
Talk to find internships—no typing required! Our voice system works on any device.

```
🎙️ "Hey, find me React internships in New York"
🤖 "I found 12 React internships near you. The top match is..."
🔊 [Reads the description aloud]
```

### 🧠 Intelligent ML Matching
Our recommendation engine goes beyond keywords:

- **Skill Graph Expansion** — "React" also matches JavaScript, Frontend, Web Development
- **Cosine Similarity** — Compares your resume against job descriptions
- **Experience Level Matching** — Entry-level gets beginner-friendly boosts
- **Explainable AI** — See exactly *why* each job was recommended

### 📊 Match Score Breakdown
```
┌─────────────────────────────────────┐
│  🎯 Match Score: 87%                │
├─────────────────────────────────────┤
│  ├── Skills:     92% ████████████░░ │
│  ├── Interests:  85% ██████████░░░░ │
│  └── Location:   78% █████████░░░░░ │
├─────────────────────────────────────┤
│  ✅ You have: React, Python, Git    │
│  📈 You'll learn: AWS, Docker       │
└─────────────────────────────────────┘
```

### 🌍 Accessibility Built-In
- **4 Languages** — English, Simple English, Spanish, Hindi
- **Voice Input** — Speak your skills during onboarding
- **Audio Output** — Listen to any job description
- **Screen Reader Support** — Full ARIA compliance
- **Keyboard Navigation** — Tab through everything

### 🤖 AI Career Assistant
Get personalized advice powered by Groq's blazing-fast LLM:

- "How should I prepare for a data science interview?"
- "What skills should I learn for frontend development?"
- "Review my application for this internship"

---

## 🎬 Live Demo

| Page | Description |
|------|-------------|
| **Home** | Animated hero, search, company carousel |
| **For You** | AI-powered personalized recommendations |
| **Search** | Filter by location, remote, stipend, beginner |
| **Profile** | Onboarding wizard, resume upload, skill tags |
| **Voice Chat** | Full conversation with AI assistant |
| **Admin** | Analytics dashboard, application tracking |

---

## 🎙️ Voice & AI Features

### Multi-Engine Text-to-Speech (TTS)

We've built a **3-tier fallback system** so voice always works:

```
┌─────────────────────────────────────────────────────────┐
│                    TTS Priority Chain                    │
├─────────────────────────────────────────────────────────┤
│  1️⃣  OpenAI TTS (tts-1-hd)                              │
│      └── 6 voices: nova, alloy, echo, fable, onyx...   │
│      └── Premium quality, requires API key              │
│                          ↓ (if unavailable)             │
│  2️⃣  Chatterbox (HuggingFace/ResembleAI)               │
│      └── Free, 300 char limit                          │
│      └── Good quality, no signup required              │
│                          ↓ (if fails)                   │
│  3️⃣  Web Speech API (Browser Native)                   │
│      └── Always available, works offline               │
│      └── Uses system voices                            │
└─────────────────────────────────────────────────────────┘
```

### Speech-to-Text (STT)

| Feature | Details |
|---------|---------|
| **Engine** | Web Speech API (native) |
| **Real-time** | Interim results while speaking |
| **Languages** | Configurable (default: en-US) |
| **Modes** | Single shot or continuous |
| **Privacy** | Audio never leaves your device |

### AI Chat (Groq LLM)

| Property | Value |
|----------|-------|
| **Model** | llama-3.3-70b-versatile |
| **Speed** | ~500 tokens/sec (fastest available) |
| **Context** | Knows your profile & saved jobs |
| **Cost** | Free tier available |

---

## 🏗️ Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React 18 + TypeScript                  │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────────┐   │  │
│  │  │  VoiceChat │ │ SearchPage │ │ RecommendationsPage│   │  │
│  │  └─────┬──────┘ └─────┬──────┘ └─────────┬──────────┘   │  │
│  │        │              │                   │              │  │
│  │  ┌─────▼──────────────▼───────────────────▼──────────┐  │  │
│  │  │              Custom Hooks & Services               │  │  │
│  │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │  │  │
│  │  │  │useSpeechRec │ │ttsService   │ │ groqService │  │  │  │
│  │  │  └─────────────┘ └─────────────┘ └─────────────┘  │  │  │
│  │  └───────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   SUPABASE      │  │   GROQ LLM      │  │   TTS ENGINES   │
│  ─────────────  │  │  ─────────────  │  │  ─────────────  │
│  • PostgreSQL   │  │  • llama-3.3    │  │  • OpenAI API   │
│  • Auth         │  │  • Fast (500t/s)│  │  • Chatterbox   │
│  • Profiles     │  │  • Context-aware│  │  • Web Speech   │
│  • Saved Jobs   │  │  • Free tier    │  │  • Auto-fallback│
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### ML Matching Pipeline

```
User Profile                    Internship Data
     │                               │
     ▼                               ▼
┌──────────────┐              ┌──────────────┐
│ Skills:      │              │ Requirements:│
│ React, Python│              │ JavaScript,  │
│ Git, Node.js │              │ React, AWS   │
└──────┬───────┘              └──────┬───────┘
       │                             │
       ▼                             ▼
┌────────────────────────────────────────────┐
│         RECOMMENDATION ENGINE              │
│  ┌──────────────────────────────────────┐ │
│  │ 1. Skill Graph Expansion             │ │
│  │    React → JavaScript, Frontend, Web │ │
│  ├──────────────────────────────────────┤ │
│  │ 2. TF-IDF Text Analysis              │ │
│  │    Compare resume ↔ job description  │ │
│  ├──────────────────────────────────────┤ │
│  │ 3. Cosine Similarity Scoring         │ │
│  │    Vector comparison for match %     │ │
│  ├──────────────────────────────────────┤ │
│  │ 4. Beginner Boost (if entry-level)   │ │
│  │    +15% score for beginner-friendly  │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  RANKED RESULTS     │
         │  1. Job A - 92%     │
         │  2. Job B - 87%     │
         │  3. Job C - 81%     │
         │  + Match Reasons    │
         └─────────────────────┘
```

---

## 📁 Project Structure

```
src/
├── 📂 components/
│   ├── 🎤 VoiceChat.tsx           # Full voice conversation UI
│   ├── 🤖 AIChatAssistant.tsx     # Text-based AI chat
│   ├── 🔊 TextToSpeechButton.tsx  # Reusable TTS button
│   ├── 💼 InternshipCard.tsx      # Job listing card
│   ├── 📊 MatchScoreCard.tsx      # Match visualization
│   ├── 🎯 OnboardingModal.tsx     # 3-step profile wizard
│   ├── 📂 ui/                     # 50+ Radix/Shadcn components
│   └── 📂 admin/                  # Dashboard components
│
├── 📂 services/
│   ├── 🧠 recommendationEngine.ts # Core ML matching
│   ├── 📄 mlResumeAnalyzer.ts     # Resume skill extraction
│   ├── 🔍 semanticSearch.ts       # Smart search with synonyms
│   ├── 🎤 groqService.ts          # LLM API wrapper
│   └── 🔊 ttsService.ts           # Multi-engine TTS
│
├── 📂 hooks/
│   ├── 🎙️ useSpeechRecognition.ts # STT hook
│   └── 📊 useMLRecommendations.ts # ML recommendations
│
├── 📂 pages/
│   ├── 🏠 HomePage.tsx            # Landing page
│   ├── 🔍 SearchPage.tsx          # Browse all jobs
│   ├── 🎯 RecommendationsPage.tsx # AI recommendations
│   └── 📊 AdminPage.tsx           # Analytics dashboard
│
└── 📂 context/
    └── 🔐 AuthContext.tsx         # Global auth state
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Why We Chose It |
|------------|---------|-----------------|
| **React 18** | UI Framework | Component-based, huge ecosystem |
| **TypeScript** | Type Safety | Catch bugs at compile time |
| **Vite 6.3** | Build Tool | 10x faster than Webpack |
| **Tailwind CSS** | Styling | Utility-first, rapid development |
| **Chakra UI** | Components | Accessible out of the box |
| **Radix UI** | Headless | Unstyled, fully accessible |
| **Framer Motion** | Animation | Smooth, declarative animations |
| **React Router 7** | Routing | Client-side navigation |

### Backend & AI
| Service | Purpose | Why We Chose It |
|---------|---------|-----------------|
| **Supabase** | Database + Auth | PostgreSQL, free tier, real-time |
| **Groq** | LLM Inference | Fastest available (500 tok/s) |
| **OpenAI TTS** | Voice Synthesis | Best quality voices |
| **Chatterbox** | Free TTS | No API key needed |
| **Vercel** | Deployment | Zero-config, edge network |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/KABILESH77/internproject.git
cd internproject

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

```env
# Required for AI features
VITE_GROQ_API_KEY=your_groq_api_key      # Get free at console.groq.com

# Optional (premium features)
VITE_OPENAI_API_KEY=your_openai_key      # For HD TTS voices

# Database (Supabase)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_GROQ_API_KEY` | ✅ For AI chat | Powers voice/text conversations |
| `VITE_OPENAI_API_KEY` | ❌ Optional | HD text-to-speech |
| `VITE_SUPABASE_*` | ✅ For profiles | User data persistence |

---

## 📖 Usage Examples

### Voice Chat
```tsx
import { VoiceChat, VoiceChatButton } from './components/VoiceChat';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <VoiceChatButton onClick={() => setIsOpen(true)} />
      <VoiceChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

### Text-to-Speech
```tsx
import { useTextToSpeech } from './components/TextToSpeechButton';

function JobCard({ description }) {
  const { speak, stop, isPlaying } = useTextToSpeech();
  
  return (
    <button onClick={() => isPlaying ? stop() : speak(description)}>
      {isPlaying ? '⏹️ Stop' : '🔊 Listen'}
    </button>
  );
}
```

### Speech Recognition
```tsx
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

function VoiceInput() {
  const { transcript, startListening, isListening } = useSpeechRecognition({
    onResult: (text) => console.log('You said:', text)
  });
  
  return (
    <button onClick={startListening}>
      {isListening ? '🔴 Listening...' : '🎤 Speak'}
    </button>
  );
}
```

### ML Recommendations
```tsx
import { useMLRecommendations } from './hooks/useMLRecommendations';

function ForYouPage() {
  const { recommendations, isLoading } = useMLRecommendations(userProfile);
  
  return recommendations.map(job => (
    <JobCard 
      key={job.id} 
      job={job} 
      matchScore={job.score}
      reasons={job.matchReasons}
    />
  ));
}
```

---

## 🎨 Screenshots

| Home Page | AI Recommendations | Voice Chat |
|-----------|-------------------|------------|
| Search, carousel, animated background | Personalized matches with scores | Full voice conversation |

| Profile | Admin Dashboard | Job Details |
|---------|-----------------|-------------|
| Skills, resume upload, onboarding | Analytics, application tracking | Slide-over with full info |

---

## 🔐 Security & Privacy

- ✅ **Voice data stays local** — Speech recognition happens in-browser
- ✅ **No tracking** — We don't sell your data
- ✅ **Optional auth** — Browse without creating an account
- ✅ **Secure storage** — Supabase with row-level security
- ✅ **Environment variables** — API keys never exposed to client

---

## 🚀 Roadmap

- [ ] **Offline Mode** — IndexedDB caching for offline browsing
- [ ] **Push Notifications** — New job alerts
- [ ] **Mobile App** — React Native version
- [ ] **Resume Builder** — AI-assisted resume creation
- [ ] **Interview Prep** — Mock interview with AI
- [ ] **Company Reviews** — Intern feedback system

---

## 🤝 Contributing

We love contributions! Here's how:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing`)
5. **Open** a Pull Request

### Development Guidelines
- Use TypeScript strict mode
- Follow existing code style
- Add accessibility labels to new components
- Test voice features on Chrome/Edge

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

| Service | What We Use |
|---------|-------------|
| [Groq](https://groq.com) | Ultra-fast LLM inference |
| [OpenAI](https://openai.com) | TTS API |
| [ResembleAI](https://resemble.ai) | Chatterbox TTS |
| [Supabase](https://supabase.com) | Backend services |
| [Figma](https://figma.com) | Original UI design |

---

<div align="center">

### 💼 Built for students, by developers who remember the struggle

**Star ⭐ this repo if JobRasa helped you find your dream internship!**

[Report Bug](https://github.com/KABILESH77/internproject/issues) • [Request Feature](https://github.com/KABILESH77/internproject/issues)

</div>
  