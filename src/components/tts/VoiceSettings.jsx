import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { DEFAULT_VOICE_SETTINGS } from '../../utils/constants';
import { Sliders, RotateCcw } from 'lucide-react';

export const VoiceSettings = () => {
  const { voiceSettings, setVoiceSettings } = useTtsContext();

  const handleReset = () => {
    setVoiceSettings(DEFAULT_VOICE_SETTINGS);
  };

  const updateSetting = (key, value) => {
    setVoiceSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white border border-zinc-200 p-5 shadow-xs flex flex-col gap-4 font-sans">
      {/* Fine-Tuning Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-black" />
          <span className="font-mono font-bold text-xs uppercase text-black">PARAMETER FINE-TUNING</span>
        </div>
        
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-500 hover:text-black border border-zinc-200 px-2.5 py-1 bg-zinc-50 hover:bg-zinc-100 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 2x2 Slider Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Stability Slider */}
        <div className="flex flex-col gap-2 p-3.5 bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-black uppercase">Stability</span>
            <span className="font-bold text-black">{Math.round(voiceSettings.stability * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={voiceSettings.stability}
            onChange={(e) => updateSetting('stability', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 appearance-none cursor-pointer accent-black"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>Expressive</span>
            <span>Consistent</span>
          </div>
        </div>

        {/* Clarity / Similarity Boost Slider */}
        <div className="flex flex-col gap-2 p-3.5 bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-black uppercase">Clarity / Boost</span>
            <span className="font-bold text-black">{Math.round(voiceSettings.similarity_boost * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={voiceSettings.similarity_boost}
            onChange={(e) => updateSetting('similarity_boost', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 appearance-none cursor-pointer accent-black"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>Natural</span>
            <span>High Fidelity</span>
          </div>
        </div>

        {/* Speed Slider */}
        <div className="flex flex-col gap-2 p-3.5 bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-black uppercase">Speaking Speed</span>
            <span className="font-bold text-black">{voiceSettings.speed}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={voiceSettings.speed}
            onChange={(e) => updateSetting('speed', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 appearance-none cursor-pointer accent-black"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>0.5x Slow</span>
            <span>2.0x Fast</span>
          </div>
        </div>

        {/* Output Format Toggle Buttons */}
        <div className="flex flex-col gap-2 p-3.5 bg-zinc-50 border border-zinc-200 justify-between">
          <span className="font-mono font-bold text-xs uppercase text-black">Output Format</span>
          <div className="grid grid-cols-3 gap-1.5 mt-0.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => updateSetting('format', 'mp3')}
              className={`py-1 rounded-xs font-bold transition-all cursor-pointer ${
                voiceSettings.format === 'mp3'
                  ? 'bg-black text-white'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:text-black'
              }`}
            >
              MP3
            </button>
            <button
              type="button"
              onClick={() => updateSetting('format', 'wav')}
              className={`py-1 rounded-xs font-bold transition-all cursor-pointer ${
                voiceSettings.format === 'wav'
                  ? 'bg-black text-white'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:text-black'
              }`}
            >
              WAV
            </button>
            <button
              type="button"
              onClick={() => updateSetting('format', 'ogg')}
              className={`py-1 rounded-xs font-bold transition-all cursor-pointer ${
                voiceSettings.format === 'ogg'
                  ? 'bg-black text-white'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:text-black'
              }`}
            >
              OGG
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
