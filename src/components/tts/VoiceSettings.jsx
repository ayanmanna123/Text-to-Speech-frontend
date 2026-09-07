import React, { useState } from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { DEFAULT_VOICE_SETTINGS } from '../../utils/constants';
import { Sliders, RotateCcw, Volume2, Gauge, Zap } from 'lucide-react';

export const VoiceSettings = () => {
  const { voiceSettings, setVoiceSettings } = useTtsContext();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleReset = () => {
    setVoiceSettings(DEFAULT_VOICE_SETTINGS);
  };

  const updateSetting = (key, value) => {
    setVoiceSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-4 flex flex-col gap-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-violet-500" />
          <span className="font-semibold text-sm text-foreground">Voice Fine-Tuning</span>
        </div>
        
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Stability Slider */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-muted/40 border border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Stability</span>
            <span className="font-mono text-muted-foreground">{Math.round(voiceSettings.stability * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={voiceSettings.stability}
            onChange={(e) => updateSetting('stability', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Expressive</span>
            <span>Consistent</span>
          </div>
        </div>

        {/* Clarity / Similarity Boost Slider */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-muted/40 border border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Clarity / Similarity</span>
            <span className="font-mono text-muted-foreground">{Math.round(voiceSettings.similarity_boost * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={voiceSettings.similarity_boost}
            onChange={(e) => updateSetting('similarity_boost', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Natural</span>
            <span>High Fidelity</span>
          </div>
        </div>

        {/* Speed / Speaking Rate Slider */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-muted/40 border border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Speaking Speed</span>
            <span className="font-mono text-muted-foreground">{voiceSettings.speed}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={voiceSettings.speed}
            onChange={(e) => updateSetting('speed', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0.5x Slow</span>
            <span>2.0x Fast</span>
          </div>
        </div>

        {/* Output Audio Format Selector */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-muted/40 border border-border/50">
          <span className="font-medium text-xs text-foreground">Output Format</span>
          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={() => updateSetting('format', 'mp3')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                voiceSettings.format === 'mp3'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-background hover:bg-muted text-muted-foreground'
              }`}
            >
              MP3 (Compressed)
            </button>
            <button
              type="button"
              onClick={() => updateSetting('format', 'wav')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                voiceSettings.format === 'wav'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-background hover:bg-muted text-muted-foreground'
              }`}
            >
              WAV (Lossless)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
