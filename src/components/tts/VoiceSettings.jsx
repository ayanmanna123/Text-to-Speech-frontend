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
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
      {/* Fine-Tuning Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-violet-600" />
          <span className="font-extrabold text-sm text-slate-900">Voice Fine-Tuning</span>
        </div>
        
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 border border-slate-200 rounded-xl px-2.5 py-1 bg-white hover:bg-slate-50 shadow-2xs font-semibold transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 2x2 Slider Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Stability Slider */}
        <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-[#fafbfc] border border-slate-200/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Stability</span>
            <span className="font-semibold text-slate-500">{Math.round(voiceSettings.stability * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={voiceSettings.stability}
            onChange={(e) => updateSetting('stability', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
          />
          <div className="flex justify-between text-[10px] font-medium text-slate-400">
            <span>Expressive</span>
            <span>Consistent</span>
          </div>
        </div>

        {/* Clarity / Similarity Boost Slider */}
        <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-[#fafbfc] border border-slate-200/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Clarity / Similarity</span>
            <span className="font-semibold text-slate-500">{Math.round(voiceSettings.similarity_boost * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={voiceSettings.similarity_boost}
            onChange={(e) => updateSetting('similarity_boost', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
          />
          <div className="flex justify-between text-[10px] font-medium text-slate-400">
            <span>Natural</span>
            <span>High Fidelity</span>
          </div>
        </div>

        {/* Speed Slider */}
        <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-[#fafbfc] border border-slate-200/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Speaking Speed</span>
            <span className="font-semibold text-slate-500">{voiceSettings.speed}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={voiceSettings.speed}
            onChange={(e) => updateSetting('speed', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
          />
          <div className="flex justify-between text-[10px] font-medium text-slate-400">
            <span>0.5x Slow</span>
            <span>2.0x Fast</span>
          </div>
        </div>

        {/* Output Format Toggle Buttons */}
        <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-[#fafbfc] border border-slate-200/80 justify-between">
          <span className="font-bold text-xs text-slate-800">Output Format</span>
          <div className="grid grid-cols-3 gap-1.5 mt-0.5">
            <button
              type="button"
              onClick={() => updateSetting('format', 'mp3')}
              className={`py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                voiceSettings.format === 'mp3'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              MP3
            </button>
            <button
              type="button"
              onClick={() => updateSetting('format', 'wav')}
              className={`py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                voiceSettings.format === 'wav'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              WAV
            </button>
            <button
              type="button"
              onClick={() => updateSetting('format', 'ogg')}
              className={`py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                voiceSettings.format === 'ogg'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
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

