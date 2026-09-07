import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { SAMPLE_PROMPTS } from '../../utils/constants';
import { Trash2, Copy, Sparkles, AlertCircle } from 'lucide-react';

export const TextEditor = () => {
  const { text, setText, isGenerating } = useTtsContext();

  const maxChars = 5000;
  const charCount = text.length;
  const isOverLimit = charCount > maxChars;

  const handleClear = () => setText('');
  
  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span>Script Text</span>
          <span className="text-xs font-normal text-muted-foreground">(Enter text to convert to natural speech)</span>
        </label>
        
        <div className="flex items-center gap-2">
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
        isOverLimit ? 'border-destructive focus-within:ring-destructive/30' : 'border-border focus-within:ring-primary/20 focus-within:border-primary'
      }`}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isGenerating}
          placeholder="Type or paste your script here... (e.g., 'Welcome to NeuralVoice. Discover ultra-realistic neural speech synthesis powered by ElevenLabs.')"
          rows={7}
          className="w-full p-4 bg-transparent text-foreground placeholder:text-muted-foreground text-base focus:outline-none resize-y min-h-[160px]"
        />

        {/* Textarea Bottom Footer Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50 text-xs">
          {/* Quick Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
            <span className="text-muted-foreground flex items-center gap-1 mr-1 hidden sm:flex">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Presets:
            </span>
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(prompt.text)}
                className="px-2.5 py-1 rounded-md bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/40 text-muted-foreground font-medium transition-all whitespace-nowrap"
              >
                {prompt.title}
              </button>
            ))}
          </div>

          {/* Character Count */}
          <div className={`flex items-center gap-1 font-mono font-medium ${
            isOverLimit ? 'text-destructive font-bold' : 'text-muted-foreground'
          }`}>
            {isOverLimit && <AlertCircle className="w-3.5 h-3.5 text-destructive" />}
            <span>{charCount}</span>
            <span>/</span>
            <span>{maxChars}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
