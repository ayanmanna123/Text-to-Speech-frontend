import React, { useState } from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { formatNumber } from '../../utils/formatters';
import { Sparkles, Mic, History, Zap, SlidersHorizontal, RefreshCw } from 'lucide-react';

const AVATAR_STYLES = ['avataaars', 'bottts', 'micah', 'lorelei', 'fun-emoji', 'thumbs'];

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { quota, isGenerating } = useTtsContext();

  const [avatarSeed, setAvatarSeed] = useState(() => {
    return localStorage.getItem('user_avatar_seed') || `user_${Math.floor(Math.random() * 10000)}`;
  });
  const [avatarStyle, setAvatarStyle] = useState(() => {
    return localStorage.getItem('user_avatar_style') || 'avataaars';
  });
  const [isRotating, setIsRotating] = useState(false);

  const remainingRatio = Math.max(0, Math.min(100, (quota.charactersRemaining / quota.characterQuota) * 100));
  const isLowQuota = remainingRatio < 15;

  const handleRandomizeAvatar = () => {
    setIsRotating(true);
    const newSeed = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const randomStyle = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
    
    setAvatarSeed(newSeed);
    setAvatarStyle(randomStyle);
    localStorage.setItem('user_avatar_seed', newSeed);
    localStorage.setItem('user_avatar_style', randomStyle);

    setTimeout(() => {
      setIsRotating(false);
    }, 500);
  };

  const avatarUrl = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${avatarSeed}&backgroundColor=c9fdf2,b3ebf2`;

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
          
          {/* Dynamic Character Credit Quota Indicator */}
          <div 
            className={`hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-[#d0f0ec] text-xs shadow-2xs transition-all duration-300 ${
              isGenerating ? 'ring-2 ring-[#85D1DB]/50 animate-pulse' : ''
            }`}
            title={`Tier: ${(quota.tier || 'free').toUpperCase()} | Used: ${formatNumber(quota.charactersUsed)} chars | Remaining: ${formatNumber(quota.charactersRemaining)} chars`}
          >
            <Zap className={`w-3.5 h-3.5 ${isLowQuota ? 'text-amber-500 fill-amber-500' : 'text-[#85D1DB] fill-[#85D1DB]'}`} />
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">
                {formatNumber(quota.charactersRemaining)} <span className="text-slate-400 font-normal">/ {formatNumber(quota.characterQuota)} chars</span>
              </span>
              <div className="w-16 h-1.5 bg-[#d0f0ec]/80 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    isLowQuota 
                      ? 'bg-gradient-to-r from-amber-400 to-rose-400' 
                      : 'bg-gradient-to-r from-[#85D1DB] to-[#B6F2D1]'
                  }`}
                  style={{ width: `${remainingRatio}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Random Avatar Circle */}
          <button
            type="button"
            onClick={handleRandomizeAvatar}
            className="group relative w-10 h-10 rounded-full bg-[#C9FDF2] border-2 border-[#85D1DB]/80 shadow-md flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 focus:outline-none"
            title="Click to generate a new avatar"
          >
            <img
              src={avatarUrl}
              alt="User Avatar"
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isRotating ? 'rotate-[360deg] scale-90' : 'group-hover:scale-110'
              }`}
              onError={(e) => {
                // Fallback icon if SVG fails to load
                e.target.style.display = 'none';
              }}
            />
            
            {/* Hover overlay indicator */}
            <div className="absolute inset-0 bg-[#0c3941]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
              <RefreshCw className={`w-4 h-4 text-white ${isRotating ? 'animate-spin' : ''}`} />
            </div>
          </button>

        </div>

      </div>
    </header>
  );
};

