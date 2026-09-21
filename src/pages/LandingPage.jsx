import React from 'react';
import { useTtsContext } from '../context/TtsContext';
import { ArrowUpRight } from 'lucide-react';

export const LandingPage = ({ onGoToStudio }) => {
  const { quota, voices } = useTtsContext();

  return (
    <div className="w-full flex flex-col font-sans relative overflow-hidden">
      
      {/* FULL-SCREEN LANDING HERO SECTION */}
      <section className="min-h-[calc(100vh-65px)] w-full flex flex-col justify-center items-center text-center relative px-4 sm:px-6 py-10 select-none max-w-[1550px] mx-auto">
        
        {/* Far Left Viewport Edge Vertical Node Chain */}
        <div className="hidden md:flex flex-col items-center absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-85">
          <div className="w-3 h-3 rounded-full bg-[#f97316] border-2 border-black" />
          <div className="h-10 border-l-2 border-dashed border-zinc-700 my-1" />
          <div className="w-3.5 h-3.5 bg-white border-2 border-black transform rotate-12 my-1" />
          <div className="h-10 border-l-2 border-dashed border-zinc-700 my-1" />
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <polygon points="10,2 18,18 2,18" fill="#6889f4" stroke="#18181b" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Far Right Viewport Edge Vertical Node Chain */}
        <div className="hidden md:flex flex-col items-center absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-85">
          <svg width="18" height="28" viewBox="0 0 30 45" fill="none">
            <polygon points="15,0 30,20 15,28 0,20" fill="#6889f4" stroke="#18181b" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="15,28 30,20 15,45" fill="#4a68d9" stroke="#18181b" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="15,28 0,20 15,45" fill="#809cf9" stroke="#18181b" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <div className="h-12 border-l-2 border-dashed border-zinc-700 my-1" />
          <div className="w-3 h-3 rounded-full bg-[#facc15] border-2 border-black" />
        </div>

        {/* Figure 1: Bottom-Left Corner Graphic (Exact 1:1 SVG directly from source) */}
        <div className="hidden lg:block absolute bottom-0 left-0 z-0 pointer-events-none opacity-95 select-none w-[345px] h-auto">
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
            <circle cx="120" cy="320" r="140" stroke="#050505" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.6" />
            <circle cx="120" cy="320" r="110" stroke="#E5E5E5" strokeWidth="1.5" />
            <circle cx="120" cy="320" r="80" stroke="#F97316" strokeWidth="2" opacity="0.8" />
            <path d="M120 180 C90 230 70 270 120 320 C170 270 150 230 120 180Z" fill="#F97316" stroke="#050505" strokeWidth="2.5" />
            <path d="M60 220 C40 260 50 290 120 320 C110 260 80 230 60 220Z" fill="#627EEA" stroke="#050505" strokeWidth="2" />
            <path d="M180 220 C200 260 190 290 120 320 C130 260 160 230 180 220Z" fill="#8B5CF6" stroke="#050505" strokeWidth="2" />
            <path d="M120 230 C105 265 95 290 120 320 C145 290 135 265 120 230Z" fill="#FDE047" stroke="#050505" strokeWidth="1.5" />
            <path d="M190 380 V280 C190 250 240 250 240 280 V380" stroke="#050505" strokeWidth="3.5" fill="#FAFAFA" />
            <path d="M200 380 V290 C200 270 230 270 230 290 V380" stroke="#050505" strokeWidth="2" fill="#F97316" fillOpacity="0.2" />
            <path d="M180 280 H250 V260 C250 245 180 245 180 260 Z" fill="#050505" />
            <g transform="translate(190, 160) scale(0.9)">
              <polygon points="40,10 70,55 40,70 10,55" fill="#627EEA" stroke="#050505" strokeWidth="2.5" />
              <polygon points="40,10 70,55 40,42" fill="#8299F0" stroke="#050505" strokeWidth="1.5" />
              <polygon points="40,75 70,60 40,100 10,60" fill="#4B68D1" stroke="#050505" strokeWidth="2.5" />
              <polygon points="40,75 70,60 40,88" fill="#627EEA" stroke="#050505" strokeWidth="1.5" />
            </g>
            <rect x="30" y="320" width="28" height="28" fill="#10B981" stroke="#050505" strokeWidth="2" transform="rotate(12 30 320)" />
            <rect x="75" y="350" width="24" height="24" fill="#EC4899" stroke="#050505" strokeWidth="2" transform="rotate(-8 75 350)" />
            <line x1="45" y1="330" x2="85" y2="360" stroke="#050505" strokeWidth="2" strokeDasharray="3 3" />
          </svg>
        </div>

        {/* Figure 2: Bottom-Right Corner Graphic (Exact 1:1 SVG matching source) */}
        <div className="hidden lg:block absolute bottom-0 right-0 z-0 pointer-events-none opacity-95 select-none w-[345px] h-auto">
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
            <circle cx="280" cy="320" r="140" stroke="#050505" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.6" />
            <circle cx="280" cy="320" r="110" stroke="#E5E5E5" strokeWidth="1.5" />
            <circle cx="280" cy="320" r="80" stroke="#3B82F6" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
            <polygon points="248,310 260,322 248,334 236,322" fill="#FDE047" stroke="#050505" strokeWidth="2.5" strokeLinejoin="round" />
            <polygon points="320,325 340,325 330,302" fill="#3B82F6" stroke="#050505" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Lotus Flower */}
            <path d="M280 180 C250 230 230 270 280 320 C330 270 310 230 280 180Z" fill="#3B82F6" stroke="#050505" strokeWidth="2.5" />
            <path d="M220 220 C200 260 210 290 280 320 C270 260 240 230 220 220Z" fill="#EC4899" stroke="#050505" strokeWidth="2" />
            <path d="M340 220 C360 260 350 290 280 320 C290 260 320 230 340 220Z" fill="#F97316" stroke="#050505" strokeWidth="2" />
            <path d="M280 230 C265 265 255 290 280 320 C305 290 295 265 280 230Z" fill="#10B981" stroke="#050505" strokeWidth="1.5" />
            {/* Node assembly above Ethereum */}
            <line x1="165" y1="120" x2="200" y2="106" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="200" cy="106" r="4.5" fill="#050505" />
            <circle cx="165" cy="120" r="6" fill="#F97316" stroke="#050505" strokeWidth="2" />
            <line x1="165" y1="126" x2="165" y2="160" stroke="#050505" strokeWidth="2" strokeDasharray="3 3" />
            {/* Ethereum Crystal */}
            <g transform="translate(135, 160) scale(0.9)">
              <polygon points="40,10 70,55 40,70 10,55" fill="#8B5CF6" stroke="#050505" strokeWidth="2.5" />
              <polygon points="40,10 70,55 40,42" fill="#A78BFA" stroke="#050505" strokeWidth="1.5" />
              <polygon points="40,75 70,60 40,100 10,60" fill="#7C3AED" stroke="#050505" strokeWidth="2.5" />
              <polygon points="40,75 70,60 40,88" fill="#8B5CF6" stroke="#050505" strokeWidth="1.5" />
            </g>
          </svg>
        </div>

        {/* HERO CONTENT */}
        <div className="flex flex-col items-center relative z-10 my-auto max-w-4xl">
          
          {/* Top Pill Badge Header */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 text-[11px] font-mono font-bold text-zinc-700 shadow-2xs mb-6 select-none">
            <span className="w-2 h-2 rounded-full bg-black" />
            <span className="font-pixel text-black">MUMBAI // 2026</span>
            <span className="text-zinc-400">&bull;</span>
            <span className="text-[#f97316]">01—31 OCT</span>
            <span className="text-zinc-400">&bull;</span>
            <span className="text-[#f97316]">ELEVENLABS / OPENAI / TTS</span>
          </div>

          {/* Pixel Date Header Tag */}
          <div className="font-pixel text-4xl sm:text-6xl lg:text-7xl font-bold tracking-widest text-black mb-3">
            01—31/OCT
          </div>

          {/* Main Ultra-Bold Title */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black text-black tracking-tight leading-none uppercase">
            NEURAL VOICE STUDIO
          </h1>

          {/* Monospace Uppercase Subtitle */}
          <p className="font-mono text-xs sm:text-sm font-extrabold text-black tracking-widest uppercase mt-4">
            ONE PLATFORM. UNLIMITED VOICES. MULTIPLE ECOSYSTEMS.
          </p>

          {/* Descriptive Tagline */}
          <p className="text-zinc-600 text-xs sm:text-sm max-w-xl text-center mt-2 leading-relaxed">
            An AI Text-to-Speech command center tracking Devcon 8, ElevenLabs, OpenAI Audio, and Google Cloud speech drivers across Mumbai.
          </p>

          {/* Call to Action Button */}
          <button
            type="button"
            onClick={onGoToStudio}
            className="btn-pill-black text-sm uppercase px-8 py-3.5 mt-6 shadow-md cursor-pointer hover:scale-105 transition-all"
          >
            <span>LAUNCH STUDIO WORKSPACE</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>

          {/* STAT CARDS GRID */}
          <div className="w-full mt-10">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-zinc-500 uppercase px-2 mb-2">
              <span>NEURAL QUOTA IN</span>
              <span>TARGET: 01 OCT 2026 // 00:00 IST</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* Box 1 */}
              <div className="bg-white border border-zinc-200 p-5 sm:p-6 text-center shadow-xs">
                <div className="font-display text-3xl sm:text-5xl font-extrabold text-black">
                  {Math.round(quota.charactersRemaining / 1000)}K
                </div>
                <div className="font-mono text-xs text-zinc-500 font-bold uppercase mt-2">
                  REMAINING
                </div>
              </div>

              {/* Box 2 */}
              <div className="bg-white border border-zinc-200 p-5 sm:p-6 text-center shadow-xs">
                <div className="font-display text-3xl sm:text-5xl font-extrabold text-black">
                  {Math.round((quota.charactersUsed || 0) / 1000)}K
                </div>
                <div className="font-mono text-xs text-zinc-500 font-bold uppercase mt-2">
                  USED CHARS
                </div>
              </div>

              {/* Box 3 */}
              <div className="bg-white border border-zinc-200 p-5 sm:p-6 text-center shadow-xs">
                <div className="font-display text-3xl sm:text-5xl font-extrabold text-black">
                  {voices.length || 29}
                </div>
                <div className="font-mono text-xs text-zinc-500 font-bold uppercase mt-2">
                  VOICES
                </div>
              </div>

              {/* Box 4 */}
              <div className="bg-white border border-zinc-200 p-5 sm:p-6 text-center shadow-xs">
                <div className="font-display text-3xl sm:text-5xl font-extrabold text-black">
                  120
                </div>
                <div className="font-mono text-xs text-zinc-500 font-bold uppercase mt-2">
                  LATENCY MS
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};
