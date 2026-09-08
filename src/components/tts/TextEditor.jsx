import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { SAMPLE_PROMPTS } from '../../utils/constants';
import { Trash2, Copy, Clipboard, Sparkles, AlertCircle, Type, FileText } from 'lucide-react';

export const TextEditor = () => {
  const { text, setText, isGenerating } = useTtsContext();

  const maxChars = 5000;
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const isOverLimit = charCount > maxChars;
  const progressPercent = Math.min(100, (charCount / maxChars) * 100);

  const handleClear = () => setText('');

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
    <div className="flex flex-col gap-3">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-500" />
          <span>Script Text</span>
          <span className="text-xs font-normal text-muted-foreground hidden sm:inline">(Enter or paste text to convert)</span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50 transition-all"
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
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                title="Copy script text"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md text-destructive hover:bg-destructive/10 transition-all"
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
      <div className={`relative rounded-xl border bg-card/60 backdrop-blur-sm transition-all focus-within:ring-2 ${
        isOverLimit ? 'border-destructive focus-within:ring-destructive/30' : 'border-border focus-within:ring-violet-500/20 focus-within:border-violet-500'
      }`}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isGenerating}
          placeholder="Type or paste your script here... (e.g., 'Welcome to our Text-to-Speech system. Convert written text into natural speech across multiple languages.')"
          rows={7}
          className="w-full p-4 bg-transparent text-foreground placeholder:text-muted-foreground text-base focus:outline-none resize-y min-h-[160px]"
        />

        {/* Character Limit Progress Bar */}
        <div className="w-full bg-muted/40 h-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isOverLimit ? 'bg-destructive' : progressPercent > 80 ? 'bg-amber-500' : 'bg-violet-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Textarea Bottom Footer Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2.5 border-t border-border/50 text-xs">
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar w-full sm:w-auto">
            <span className="text-muted-foreground flex items-center gap-1 mr-1 hidden sm:flex">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Presets:
            </span>
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(prompt.text)}
                className="px-2.5 py-1 rounded-md bg-muted/60 hover:bg-violet-500/10 hover:text-violet-500 border border-border/40 text-muted-foreground font-medium transition-all whitespace-nowrap"
              >
                {prompt.title}
              </button>
            ))}
          </div>

          {/* Metrics: Word Count & Character Count */}
          <div className="flex items-center gap-4 text-xs font-mono font-medium text-muted-foreground self-end sm:self-auto">
            <div className="flex items-center gap-1" title="Word Count">
              <Type className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{wordCount} words</span>
            </div>

            <div className={`flex items-center gap-1 ${
              isOverLimit ? 'text-destructive font-bold' : 'text-muted-foreground'
            }`} title="Character Count">
              {isOverLimit && <AlertCircle className="w-3.5 h-3.5 text-destructive" />}
              <span>{charCount} / {maxChars} chars</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
