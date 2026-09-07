import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { formatNumber } from '../../utils/formatters';
import { Sparkles, Mic, History, Library, Zap, Server } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { quota } = useTtsContext();

  const remainingRatio = Math.max(0, Math.min(100, (quota.charactersRemaining / quota.characterQuota) * 100));

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('studio')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-purple-400 flex items-center justify-center shadow-md shadow-violet-500/20">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                NeuralVoice
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/20">
                Studio
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">AI Text-to-Speech Platform</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'studio'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('voices')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'voices'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>Voice Library</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>
        </nav>

        {/* Right Status Badges */}
        <div className="flex items-center gap-3">
          
          {/* Live Character Quota Pill */}
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border text-xs">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">
                {formatNumber(quota.charactersRemaining)} <span className="text-muted-foreground font-normal">/ {formatNumber(quota.characterQuota)} chars</span>
              </span>
              <div className="w-24 h-1 bg-border rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${remainingRatio}%` }}
                />
              </div>
            </div>
          </div>

          {/* Engine Active Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">ElevenLabs Active</span>
          </div>

        </div>

      </div>
    </header>
  );
};
