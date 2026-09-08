import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { TextEditor } from './TextEditor';
import { VoiceSelector } from './VoiceSelector';
import { VoiceSettings } from './VoiceSettings';
import { AudioPlayer } from './AudioPlayer';
import { HistoryList } from './HistoryList';
import { AudioWaveform, Loader2, Zap, AlertCircle } from 'lucide-react';

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

      
      {/* Studio Header Banner with Handwritten Decorative Accent */}
      <div className="relative flex items-center justify-between pt-2 pb-2">
        <div className="flex items-start gap-4">
          {/* Soundwave Icon Container */}
          <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] text-[#7c3aed] border border-[#ddd6fe] flex items-center justify-center shrink-0 shadow-2xs mt-1">
            <AudioWaveform className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Text-to-Speech <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Studio</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1 font-medium leading-relaxed">
              Convert scripts, articles, and dialogues into life-like neural speech using ElevenLabs and OpenAI speech drivers.
            </p>
          </div>
        </div>

        {/* Right Handwritten Cursive "Your ideas, in every voice" Banner */}
        <div className="hidden lg:flex items-center gap-4 relative pr-4">
          <div className="opacity-25 flex items-center gap-1 text-violet-500">
            <div className="w-1 h-6 bg-violet-500 rounded-full animate-pulse"></div>
            <div className="w-1 h-10 bg-indigo-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-1 h-14 bg-purple-500 rounded-full animate-pulse delay-150"></div>
            <div className="w-1 h-8 bg-violet-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-1 h-12 bg-indigo-400 rounded-full animate-pulse delay-200"></div>
            <div className="w-1 h-5 bg-purple-400 rounded-full animate-pulse"></div>
          </div>
          <div className="relative">
            <span className="font-handwriting text-2xl sm:text-3xl text-indigo-500/90 -rotate-6 block select-none pointer-events-none">
              Your ideas, in every voice
            </span>
            <svg className="w-24 h-6 text-indigo-400/60 absolute -bottom-3 -right-2 pointer-events-none" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M 5 15 Q 40 5 95 12" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

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
                : 'bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white border-transparent shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
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
      <div className="mt-8 pt-8 border-t border-slate-200/80">
        <HistoryList />
      </div>

    </div>
  );
};

