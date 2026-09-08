import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { SAMPLE_PROMPTS } from '../../utils/constants';
import { Trash2, Copy, Clipboard, Sparkles, FileText, Wand2, AlertTriangle, Clapperboard, Headphones, Rocket, Mic } from 'lucide-react';

export const TextEditor = () => {
  const { text, setText, isGenerating } = useTtsContext();

  const maxChars = 5000;
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const isOverLimit = charCount > maxChars;
  const progressPercent = Math.min(100, (charCount / maxChars) * 100);

  // Character validation logic
  const hasControlChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\u200B-\u200D\uFEFF\u202A-\u202E]/.test(text);
  const cleanText = text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    .replace(/[\u200B-\u200D\uFEFF\u202A-\u202E]/g, '')
    .normalize('NFC')
    .trim();
  const hasSpeakableLetters = /[\p{L}\p{N}]/u.test(cleanText);
  const isNonSpeakable = text.trim().length > 0 && !hasSpeakableLetters;

  const handleClear = () => setText('');

  const handleSanitize = () => {
    setText(cleanText);
  };

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setText((prev) => prev + clipText);
      }
    } catch (err) {
      console.warn('Clipboard paste error:', err);
    }
  };

  const getPresetIcon = (idx) => {
    switch (idx) {
      case 0: return <Clapperboard className="w-3.5 h-3.5 text-indigo-500" />;
      case 1: return <Headphones className="w-3.5 h-3.5 text-purple-500" />;
      case 2: return <Rocket className="w-3.5 h-3.5 text-violet-500" />;
      default: return <Mic className="w-3.5 h-3.5 text-pink-500" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-600" />
          <span>Script Text</span>
          <span className="text-xs font-normal text-slate-400 hidden sm:inline">(Enter or paste text to convert)</span>
        </label>

        <div className="flex items-center gap-2">
          {hasControlChars && (
            <button
              type="button"
              onClick={handleSanitize}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-semibold transition-all cursor-pointer"
              title="Remove invisible/unprintable control characters"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Clean Text</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold shadow-2xs transition-all cursor-pointer"
            title="Paste text from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5 text-slate-500" />
            <span>Paste</span>
          </button>

          {text && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
                title="Copy script text"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                title="Clear script text"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Textarea Container */}
      <div className={`relative rounded-2xl border bg-[#fafbfc] transition-all focus-within:bg-white focus-within:ring-2 ${
        isOverLimit ? 'border-rose-400 focus-within:ring-rose-200' : 'border-slate-200 focus-within:border-violet-500 focus-within:ring-violet-500/10'
      }`}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isGenerating}
          maxLength={maxChars}
          placeholder="Type or paste your script here... (e.g., 'Welcome to our Text-to-Speech system. Convert written text into natural speech across multiple languages.')"
          rows={7}
          className="w-full p-4 bg-transparent text-slate-800 placeholder:text-slate-400 text-sm font-normal focus:outline-none resize-y min-h-[170px] leading-relaxed"
        />

        {isOverLimit && (
          <div className="mx-4 mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>Maximum character limit reached (5,000 characters). Please reduce your text length.</span>
          </div>
        )}

        {isNonSpeakable && (
          <div className="mx-4 mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Text contains only unsupported symbols or emojis. Please enter speakable words.</span>
            </div>
          </div>
        )}


        {hasControlChars && !isNonSpeakable && (
          <div className="mx-4 mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Text contains unprintable control characters. Click "Clean Text" above to clean it automatically.</span>
            </div>
            <button
              type="button"
              onClick={handleSanitize}
              className="font-bold underline cursor-pointer text-xs shrink-0 hover:text-amber-950"
            >
              Clean Now
            </button>
          </div>
        )}

        {/* Character Limit Thin Progress Bar */}
        <div className="w-full bg-slate-100 h-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isOverLimit ? 'bg-rose-500' : progressPercent > 80 ? 'bg-amber-500' : 'bg-violet-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Textarea Bottom Footer Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200/60 bg-white/50 rounded-b-2xl text-xs">
          {/* Quick Presets Tag & Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar w-full sm:w-auto">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1 hidden sm:flex text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              Presets:
            </span>
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(prompt.text)}
                className="px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-violet-50 hover:text-violet-700 border border-slate-200/70 text-slate-700 font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {getPresetIcon(idx)}
                <span>{prompt.title.replace(/^[^a-zA-Z0-9]+/, '')}</span>
              </button>
            ))}
          </div>

          {/* Word Count & Character Count Metrics */}
          <div className="flex items-center gap-3 text-xs font-medium text-slate-400 self-end sm:self-auto shrink-0">
            <span>{wordCount} words</span>
            <span>|</span>
            <span className={isOverLimit ? 'text-rose-600 font-bold' : 'text-slate-500 font-semibold'}>
              {charCount} / {maxChars} chars
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

