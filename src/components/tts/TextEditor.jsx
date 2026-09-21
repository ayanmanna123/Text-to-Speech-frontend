import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { SAMPLE_PROMPTS } from '../../utils/constants';
import { Trash2, Copy, Clipboard, Sparkles, FileText, Wand2, AlertTriangle } from 'lucide-react';

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

  return (
    <div className="bg-white border border-zinc-200 p-5 shadow-xs flex flex-col gap-4">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold uppercase text-black flex items-center gap-2">
          <FileText className="w-4 h-4 text-black" />
          <span>SCRIPT TEXT BUFFER</span>
        </label>

        <div className="flex items-center gap-2 font-mono text-xs">
          {hasControlChars && (
            <button
              type="button"
              onClick={handleSanitize}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 font-bold uppercase transition-all cursor-pointer"
              title="Remove unprintable control characters"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Clean Text</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-black font-bold uppercase transition-all cursor-pointer"
            title="Paste text from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste</span>
          </button>

          {text && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-zinc-600 hover:text-black hover:bg-zinc-100 transition-all cursor-pointer"
                title="Copy script text"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
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
      <div className={`relative border transition-all ${
        isOverLimit ? 'border-rose-500 focus-within:ring-2 focus-within:ring-rose-300' : 'border-zinc-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black'
      }`}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isGenerating}
          maxLength={maxChars}
          placeholder="Type or paste your speech script here... (e.g., 'Welcome to Neural Voice Studio. Synthesizing natural speech across multiple drivers.')"
          rows={7}
          className="w-full p-4 bg-white text-black placeholder:text-zinc-400 text-sm font-sans focus:outline-none resize-y min-h-[170px] leading-relaxed"
        />

        {isOverLimit && (
          <div className="mx-4 mb-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5 font-mono font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>Maximum character limit (5,000) reached. Reduce script text.</span>
          </div>
        )}

        {isNonSpeakable && (
          <div className="mx-4 mb-3 p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2 font-mono font-bold">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Script contains non-speakable symbols. Enter valid words.</span>
            </div>
          </div>
        )}

        {/* Character Progress Line */}
        <div className="w-full bg-zinc-100 h-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isOverLimit ? 'bg-rose-500' : progressPercent > 80 ? 'bg-amber-500' : 'bg-black'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Bottom Presets Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-zinc-50 border-t border-zinc-200 text-xs">
          {/* Quick Presets Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar w-full sm:w-auto">
            <span className="text-zinc-500 font-mono font-bold uppercase flex items-center gap-1 mr-1 hidden sm:flex text-xs">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              Presets:
            </span>
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(prompt.text)}
                className="px-3 py-1 bg-white hover:bg-black hover:text-white border border-zinc-200 text-zinc-800 font-mono text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>{prompt.title.replace(/^[^a-zA-Z0-9]+/, '')}</span>
              </button>
            ))}
          </div>

          {/* Word Count & Character Metrics */}
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 self-end sm:self-auto shrink-0 font-semibold">
            <span>{wordCount} WORDS</span>
            <span>|</span>
            <span className={isOverLimit ? 'text-rose-600 font-bold' : 'text-black font-bold'}>
              {charCount} / {maxChars} CHARS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
