import React from 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white/80 backdrop-blur-md py-6 mt-16 text-xs font-mono text-zinc-500 relative z-10">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          <span className="font-pixel text-black font-bold">NEURAL // VOICE</span>
          <span>&copy; {new Date().getFullYear()} AI TEXT-TO-SPEECH PLATFORM</span>
        </div>
        
        <div className="flex items-center gap-4 text-zinc-600 font-mono text-xs">
          <span className="hover:text-black cursor-pointer transition-colors">API DOCUMENTATION</span>
          <span>&bull;</span>
          <span className="hover:text-black cursor-pointer transition-colors">ELEVENLABS DRIVER</span>
          <span>&bull;</span>
          <span className="hover:text-black cursor-pointer transition-colors">OPENAI AUDIO</span>
        </div>

      </div>
    </footer>
  );
};
