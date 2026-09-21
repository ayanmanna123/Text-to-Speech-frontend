import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { TextEditor } from './TextEditor';
import { VoiceSelector } from './VoiceSelector';
import { VoiceSettings } from './VoiceSettings';
import { AudioPlayer } from './AudioPlayer';
import { HistoryList } from './HistoryList';
import { Loader2, Zap, AlertCircle, CheckCircle2, Sliders } from 'lucide-react';

export const TtsStudio = () => {
  const { text, selectedVoice, isGenerating, generateSpeech, error, setError, infoMessage, setInfoMessage } = useTtsContext();

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
      setError('Script text contains only unprintable control characters or non-speakable symbols.');
      return;
    }

    if (!selectedVoice) {
      setError('Please select a voice from the Target Voice dropdown.');
      return;
    }
    generateSpeech();
  };

  return (
    <div className="max-w-[1550px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 font-sans">

      {/* Studio Header Bar */}
      <div className="flex flex-col gap-1 border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-black" />
          <h1 className="text-2xl sm:text-3xl font-display font-black text-black tracking-tight uppercase">
            SPEECH SYNTHESIS STUDIO WORKSPACE
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 font-sans">
          Enter your script text, select a neural voice driver, fine-tune stability & speed parameters, and synthesize audio.
        </p>
      </div>

      {/* Info Notice Banner */}
      {infoMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-xs font-mono">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{infoMessage}</span>
          </div>
          <button type="button" onClick={() => setInfoMessage(null)} className="font-bold underline uppercase cursor-pointer ml-4 hover:text-black">
            Dismiss
          </button>
        </div>
      )}

      {/* Error Alert Box */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between shadow-xs font-mono">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="font-bold underline uppercase cursor-pointer ml-4 hover:text-black">
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
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 sticky top-20">
          <VoiceSelector />
          <VoiceSettings />

          {/* Primary Action Button - Speech Generator */}
          <button
            type="button"
            onClick={handleGenerateClick}
            disabled={isDisabled}
            className={`w-full py-4 px-6 font-display font-black text-base uppercase flex items-center justify-center gap-3 transition-all duration-200 shadow-md ${
              isDisabled
                ? 'bg-zinc-200 text-zinc-400 border border-zinc-300 cursor-not-allowed shadow-none'
                : 'bg-black text-white hover:bg-zinc-800 active:scale-[0.99] cursor-pointer'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>SYNTHESIZING SPEECH...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-current" />
                <span>GENERATE SPEECH</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Generation History List Section */}
      <div className="mt-8 pt-8 border-t border-zinc-200">
        <HistoryList />
      </div>

    </div>
  );
};
