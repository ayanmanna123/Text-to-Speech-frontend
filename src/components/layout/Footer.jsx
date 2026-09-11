import React from 'react';
import { Mic } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-[#d0f0ec] bg-white/60 py-6 mt-10 text-xs text-slate-500">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#85D1DB] to-[#B6F2D1] text-[#062c30] flex items-center justify-center font-bold text-xs shadow-xs">
            <Mic className="w-3.5 h-3.5 text-[#062c30]" />
          </div>
          <span className="font-extrabold text-slate-800">NeuralVoice Studio</span>
          <span>&copy; {new Date().getFullYear()} AI Text-to-Speech Platform</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 font-medium">
          <span className="hover:text-[#126b75] cursor-pointer transition-colors">API Documentation</span>
          <span>&bull;</span>
          <span className="hover:text-[#126b75] cursor-pointer transition-colors">ElevenLabs Driver</span>
          <span>&bull;</span>
          <span className="hover:text-[#126b75] cursor-pointer transition-colors">OpenAI Audio</span>
        </div>
      </div>
    </footer>
  );
};

