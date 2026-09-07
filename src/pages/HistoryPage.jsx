import React from 'react';
import { HistoryList } from '../components/tts/HistoryList';
import { History } from 'lucide-react';

export const HistoryPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20">
            <History className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Generation History Log
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Review all synthesized speech audio clips created during your session. Play, re-use text, or download audio files.
        </p>
      </div>

      <HistoryList />
    </div>
  );
};
