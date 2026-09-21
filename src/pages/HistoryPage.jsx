import React from 'react';
import { HistoryList } from '../components/tts/HistoryList';
import { AudioPlayer } from '../components/tts/AudioPlayer';
import { History } from 'lucide-react';

export const HistoryPage = () => {
  return (
    <div className="max-w-[1550px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6 font-sans">

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-black" />
          <h1 className="text-3xl font-display font-extrabold text-black tracking-tight uppercase">
            GENERATION HISTORY LOG
          </h1>
        </div>
        <p className="text-sm text-zinc-600 max-w-2xl font-sans">
          Review all synthesized speech audio clips created during your session. Play, re-use text, or download audio files.
        </p>
      </div>

      <AudioPlayer />

      <HistoryList />
    </div>
  );
};
