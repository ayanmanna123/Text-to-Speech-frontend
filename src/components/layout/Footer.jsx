import React from 'react';
import { Mic, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/20 py-8 mt-16 text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-violet-500" />
          <span className="font-semibold text-foreground">NeuralVoice Studio</span>
          <span>&copy; {new Date().getFullYear()} Enterprise Text-to-Speech Engine</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-foreground cursor-pointer">API Docs</span>
          <span>&bull;</span>
          <span className="hover:text-foreground cursor-pointer">Supabase DB</span>
          <span>&bull;</span>
          <span className="hover:text-foreground cursor-pointer">ElevenLabs Driver</span>
        </div>
      </div>
    </footer>
  );
};
