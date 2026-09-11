import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { formatNumber } from '../../utils/formatters';
import { Sparkles, Mic, History, Zap, SlidersHorizontal } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { quota } = useTtsContext();

  const remainingRatio = Math.max(0, Math.min(100, (quota.charactersRemaining / quota.characterQuota) * 100));

  return (
    <header className="w-full bg-transparent pt-3 pb-1 px-2 sm:px-4">
      <div className="max-w-[1550px] mx-auto bg-white/30 backdrop-blur-xl border border-[#d0f0ec] rounded-2xl shadow-xs px-3 sm:px-5 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('studio')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#85D1DB] via-[#B3EBF2] to-[#B6F2D1] flex items-center justify-center text-[#062c30] shadow-md shadow-[#85D1DB]/30 font-bold">
            <Mic className="w-5 h-5 text-[#062c30]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                NeuralVoice
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#C9FDF2]/80 text-[#084951] border border-[#85D1DB]/60">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">AI Text-to-Speech Platform</p>
          </div>
        </div>

        {/* Center Navigation Segmented Pills */}
        <nav className="flex items-center gap-1 bg-white/30 backdrop-blur-md p-1 rounded-2xl border border-[#d0f0ec]">
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-[#0c3941] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'studio' ? 'text-[#B6F2D1]' : 'text-[#85D1DB]'}`} />
            <span>Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('voices')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'voices'
                ? 'bg-[#0c3941] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Voice Library</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#0c3941] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>
        </nav>

        {/* Right Action & Status Bar */}
        <div className="flex items-center gap-3">
          
          {/* Character Credit Quota Indicator */}
          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/30 backdrop-blur-md border border-[#d0f0ec] text-xs shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-[#85D1DB] fill-[#85D1DB]" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">
                {formatNumber(quota.charactersRemaining)} <span className="text-slate-400 font-normal">/ {formatNumber(quota.characterQuota)} chars</span>
              </span>
              <div className="w-16 h-1.5 bg-[#d0f0ec]/70 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#85D1DB] to-[#B6F2D1] rounded-full transition-all duration-500"
                  style={{ width: `${remainingRatio}%` }}
                />
              </div>
            </div>
          </div>

          {/* Engine Active Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9FDF2] text-[#084951] border border-[#85D1DB]/60 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#85D1DB] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1294a8]"></span>
            </span>
            <span className="hidden sm:inline">ElevenLabs Active</span>
          </div>

          {/* User Avatar Circle */}
          <div className="w-9 h-9 rounded-full bg-[#C9FDF2] text-[#084951] font-bold text-sm flex items-center justify-center border border-[#85D1DB]/60 shadow-2xs">
            A
          </div>

        </div>

      </div>
    </header>
  );
};

