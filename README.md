# NeuralVoice Studio - Frontend Web Application

An ultra-sleek, modern **AI Text-to-Speech Web Application** built with **React 19**, **Vite**, and **Tailwind CSS**. Features custom voice sample previews, interactive studio editor with text validation, speed controls, audio visualizer/player, generation history, and multi-provider voice discovery.

---

## ✨ Key Features

- **🎨 Modern Studio UI/UX**: Custom light studio theme featuring soft gradients, glassmorphism, responsive grid layouts (`max-w-[1550px]`), and micro-animations.
- **📝 Smart Text Validation**:
  - Requires non-empty speakable text.
  - Enforces 5000 character maximum limit with live counter indicator.
  - Automatically cleans unsupported special symbols and formats input.
  - Disables the **Generate Speech** button when text input is empty or invalid.
- **🎙️ Voice Library & Example Previews**:
  - Filter voices by Provider (ElevenLabs, OpenAI, Google), Gender, Category, and Language.
  - Dedicated **Sample Play Button** on every voice card and selector item.
  - Integrates with backend table caching (`tts_voice_previews`) for instant, zero-latency sample playback.
- **🎧 Audio Player Controls**:
  - Complete audio player with Play / Pause, Timeline progress bar, Current Time / Duration counter.
  - Playback Speed Adjuster (0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 2.0x).
  - One-click **Download MP3** button.
- **📜 Generation History Panel**:
  - Real-time generated audio list with playback, voice name, character count, and creation timestamp.
  - Autoplay disabled by default on history list items and page navigation for comfortable UX.
- **⚡ Concurrent Server Runner**: Includes `npm run both` script to start both frontend and backend dev servers with a single command.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite
- **Styling**: Vanilla Tailwind CSS v4 + Lucide React Icons
- **HTTP Client**: Native Fetch API wrapper (`apiClient`)
- **State Management**: React Context API (`TtsContext`)

---

## 📁 Project Structure

```text
Text-to-Speech-frontend/
├── src/
│   ├── api/             # API client & endpoints (client.js, ttsApi.js, voiceApi.js, usageApi.js)
│   ├── components/
│   │   ├── common/      # Reusable UI components (Navbar, Footer, AudioPlayer)
│   │   ├── history/     # Audio generation history list (HistoryList.jsx)
│   │   ├── tts/         # Studio editor components (TtsStudio.jsx, TextEditor.jsx, VoiceSelector.jsx)
│   │   └── voices/      # Voice cards & library grid (VoiceCard.jsx)
│   ├── context/         # React Context provider for TTS state (TtsContext.jsx)
│   ├── utils/           # Helper utilities (constants.js, textUtils.js, voiceSamples.js)
│   ├── App.jsx          # Main application page layout
│   ├── main.jsx         # Application entry point
│   └── index.css        # Tailwind CSS & global design system tokens
├── index.html           # HTML template
├── package.json         # Scripts and dependencies
├── vite.config.js       # Vite development configuration
└── README.md            # Frontend documentation
```

---

## 🚀 Getting Started

### Prerequisites
Make sure **Node.js** (v18+) is installed on your machine.

### Installation

1. Clone the repository and navigate into the frontend folder:
   ```bash
   cd Text-to-Speech-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 🧪 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Start frontend Vite development server (`http://localhost:5174/`) |
| `npm run dev:backend` | Start Node.js backend server (`http://localhost:5000/`) |
| `npm run both` | **Start both Frontend and Backend dev servers concurrently** |
| `npm run build` | Build production bundle to `dist/` folder |
| `npm run preview` | Preview production build locally |

---

## 🌐 API Communication

The frontend communicates with the backend API running at `http://localhost:5000/api/v1` via [`src/api/client.js`](file:///c:/Users/manna/Coding/Internship/Text-to-Speech/Text-to-Speech-frontend/src/api/client.js):

- `POST /api/v1/tts/generate` - Generate speech audio from input script
- `POST /api/v1/voices/preview` - Fetch or generate cached voice sample preview
- `GET /api/v1/voices` - Fetch available voices list
- `GET /api/v1/tts/history` - Fetch generation history list
- `GET /api/v1/usage/balance` - Fetch user character quota balance

---

## 🎨 Design System & Styling

- Core Palette: Soft slate neutrals (`#f8fafc`), violet accent accents (`#7c3aed`, `#6d28d9`), subtle borders (`#e2e8f0`).
- Typography: Inter / System sans-serif with clear heading hierarchy.
- Layout: Responsive max-width container (`max-w-[1550px]`) with compact padding (`px-4 sm:px-6 lg:px-8`).
