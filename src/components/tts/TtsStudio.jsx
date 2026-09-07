import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { TextEditor } from './TextEditor';
import { VoiceSelector } from './VoiceSelector';
import { VoiceSettings } from './VoiceSettings';
import { AudioPlayer } from './AudioPlayer';
import { HistoryList } from './HistoryList';
import { Sparkles, Loader2, Zap, AlertCircle } from 'lucide-react';

export const TtsStudio = () => {
  const { text, selectedVoice, isGenerating, generateSpeech, error, setError } = useTtsContext();

  const textLength = text.trim().length;
  const isOverLimit = textLength > 5000;
  const isReady = textLength > 0 && !isOverLimit && selectedVoice;

  const handleGenerateClick = () => {
    if (isGenerating) return;
    if (!text.trim()) {
      setError('Please type or paste some text into the Script Text area before generating speech.');
      return;
    }
    if (isOverLimit) {
      setError('Script text exceeds the 5,000 character limit per request.');
      return;
    }
    if (!selectedVoice) {
      setError('Please select a voice from the Target Voice dropdown.');
      return;
    }
    generateSpeech();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Studio Header Banner */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20">
            <Sparkles className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Text-to-Speech Studio
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Convert scripts, articles, and dialogues into life-like neural speech using ElevenLabs and OpenAI speech drivers.
        </p>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center justify-between animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="font-bold underline text-xs cursor-pointer ml-4 shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Script Textarea & Generated Output Player (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <TextEditor />
          <AudioPlayer />
        </div>

        {/* Right Column: Voice Selection, Fine-Tuning, & Generate Button (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          <VoiceSelector />
          <VoiceSettings />

          {/* Generate Speech Primary CTA Button */}
          <button
            type="button"
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-xl cursor-pointer ${
              isReady && !isGenerating
                ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-primary/80 hover:bg-primary text-primary-foreground shadow-md'
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
                <span>Generate Speech {textLength > 0 ? `(${textLength} chars)` : ''}</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Generation History Section */}
      <div className="mt-6 pt-8 border-t border-border">
        <HistoryList />
      </div>

    </div>
  );
};
