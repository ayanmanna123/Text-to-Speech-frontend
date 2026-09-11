import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { TextEditor } from './TextEditor';
import { VoiceSelector } from './VoiceSelector';
import { VoiceSettings } from './VoiceSettings';
import { AudioPlayer } from './AudioPlayer';
import { HistoryList } from './HistoryList';
import { Loader2, Zap, AlertCircle } from 'lucide-react';

export const TtsStudio = () => {
  const { text, selectedVoice, isGenerating, generateSpeech, error, setError } = useTtsContext();

  const textLength = text.trim().length;
  const isOverLimit = text.length > 5000;
  const isDisabled = isGenerating || textLength === 0 || isOverLimit || !selectedVoice;

  const handleGenerateClick = () => {
    if (isDisabled) return;

    const cleanText = text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
      .replace(/[\u200B-\u200D\uFEFF\u202A-\u202E]/g, '')
      .normalize('NFC')
      .trim();

    if (!cleanText || !/[\p{L}\p{N}]/u.test(cleanText)) {
      setError('Script text contains only unprintable control characters or non-speakable symbols. Please enter valid speakable words or text.');
      return;
    }

    if (!selectedVoice) {
      setError('Please select a voice from the Target Voice dropdown.');
      return;
    }
    generateSpeech();
  };

  return (
    <div className="max-w-[1550px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 flex flex-col gap-6">

      {/* Error Alert Box */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="font-bold underline text-xs cursor-pointer ml-4 shrink-0 hover:text-rose-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Studio Grid (8 Cols Left, 4 Cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Script Textarea & Generated Audio Player */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <TextEditor />
          <AudioPlayer />
        </div>

        {/* Right Column: Voice Selection, Fine-Tuning Controls, & Generate Speech CTA */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 sticky top-6">
          <VoiceSelector />
          <VoiceSettings />

          {/* Primary Action Button - Speech Generator */}
          <button
            type="button"
            onClick={handleGenerateClick}
            disabled={isDisabled}
            className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 transition-all duration-200 border ${
              isDisabled
                ? 'bg-slate-200 text-slate-400 border-slate-300/80 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-[#85D1DB] via-[#6dc7d4] to-[#B6F2D1] hover:from-[#73c8d3] hover:to-[#a2efc4] text-[#05262c] border-transparent shadow-xl shadow-[#85D1DB]/35 hover:shadow-[#85D1DB]/50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Synthesizing Speech...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-current" />
                <span>Generate Speech</span>
              </>
            )}
          </button>
        </div>

      </div>


      {/* Generation History List Section */}
      <div className="mt-8 pt-8 border-t border-[#d0f0ec]">
        <HistoryList />
      </div>

    </div>
  );
};

