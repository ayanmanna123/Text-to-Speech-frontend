import React, { useState } from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { formatNumber } from '../../utils/formatters';
import { ArrowUpRight, Zap, RefreshCw } from 'lucide-react';

const AVATAR_STYLES = ['bottts', 'identicon', 'pixel-art', 'icons', 'shapes'];

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { quota, isGenerating } = useTtsContext();

  const [avatarSeed, setAvatarSeed] = useState(() => {
    return localStorage.getItem('user_avatar_seed') || `user_${Math.floor(Math.random() * 10000)}`;
  });
  const [avatarStyle, setAvatarStyle] = useState(() => {
    return localStorage.getItem('user_avatar_style') || 'bottts';
  });
  const [isRotating, setIsRotating] = useState(false);

  const handleRandomizeAvatar = () => {
    setIsRotating(true);
    const newSeed = `nv_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const randomStyle = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
    
    setAvatarSeed(newSeed);
    setAvatarStyle(randomStyle);
    localStorage.setItem('user_avatar_seed', newSeed);
    localStorage.setItem('user_avatar_style', randomStyle);

    setTimeout(() => {
      setIsRotating(false);
    }, 400);
  };

  const avatarUrl = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${avatarSeed}&backgroundColor=000000`;

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50 py-3 px-3 sm:px-6">
      <div className="max-w-[1550px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left Brand Badge */}
        <div 
          className="flex items-center gap-2 cursor-pointer group select-none" 
          onClick={() => setActiveTab('home')}
        >
          <div className="w-8 h-8 bg-black text-white font-pixel flex items-center justify-center text-xs font-bold rounded-xs">
            NV
          </div>
          <div className="flex items-center gap-1.5 font-pixel text-xs sm:text-sm tracking-tight text-black">
            <span className="font-extrabold">NEURAL</span>
            <span className="text-zinc-400">//</span>
            <span className="text-black font-extrabold">VOICE</span>
            <span className="text-[10px] font-pixel text-zinc-500 ml-1">2026</span>
          </div>
        </div>

        {/* Center Navigation Links (Distinct HOME & STUDIO Tabs) */}
        <nav className="flex items-center gap-4 sm:gap-6 font-mono text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`py-1 transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'text-black border-b-2 border-black font-extrabold'
                : 'text-zinc-500 hover:text-black'
            }`}
          >
            HOME
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`py-1 transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'text-black border-b-2 border-black font-extrabold'
                : 'text-zinc-500 hover:text-black'
            }`}
          >
            STUDIO
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('voices')}
            className={`py-1 transition-all cursor-pointer hidden sm:block ${
              activeTab === 'voices'
                ? 'text-black border-b-2 border-black font-extrabold'
                : 'text-zinc-500 hover:text-black'
            }`}
          >
            VOICE LIBRARY
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-1 transition-all cursor-pointer hidden sm:block ${
              activeTab === 'history'
                ? 'text-black border-b-2 border-black font-extrabold'
                : 'text-zinc-500 hover:text-black'
            }`}
          >
            HISTORY
          </button>
        </nav>

        {/* Right Status & Action Pills */}
        <div className="flex items-center gap-3">
          
          {/* Date & Location Pill Tag */}
          <div className="hidden lg:flex flex-col text-right font-pixel text-[9px] text-zinc-600 leading-tight">
            <span>01—31 OCT 2026</span>
            <span className="text-zinc-400">MUMBAI, INDIA</span>
          </div>

          {/* Quota Meter Badge */}
          <div 
            className="hidden sm:flex items-center gap-2 px-3 py-1 bg-zinc-100 border border-zinc-200 rounded-full text-xs font-mono"
            title={`Remaining quota: ${formatNumber(quota.charactersRemaining)} chars`}
          >
            <Zap className={`w-3.5 h-3.5 ${isGenerating ? 'text-amber-500 animate-pulse' : 'text-black'}`} />
            <span className="font-bold text-black text-xs">
              {formatNumber(quota.charactersRemaining)} <span className="text-zinc-400 font-normal">CHARS</span>
            </span>
          </div>

          {/* Black Pill Button CTA (Go to Studio) */}
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className="btn-pill-black text-xs uppercase cursor-pointer"
          >
            <span>STUDIO PRO</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Avatar Icon */}
          <button
            type="button"
            onClick={handleRandomizeAvatar}
            className="w-8 h-8 rounded-full bg-black flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            title="Click to randomize avatar"
          >
            <img
              src={avatarUrl}
              alt="Avatar"
              className={`w-full h-full object-cover ${isRotating ? 'animate-spin' : ''}`}
            />
          </button>

        </div>

      </div>
    </header>
  );
};
