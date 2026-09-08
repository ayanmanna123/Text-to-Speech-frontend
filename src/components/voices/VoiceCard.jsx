import React, { useState, useRef, useEffect } from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { getVoiceSampleText, playVoicePreview, stopVoicePreview } from '../../utils/voiceSamples';
import { Play, Pause, Check, Volume2, Loader2 } from 'lucide-react';


export const VoiceCard = ({ voice, onSelect }) => {
  const { selectedVoice } = useTtsContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const isSelected = selectedVoice?.id === voice.id;
  const sampleText = getVoiceSampleText(voice);


  useEffect(() => {
    return () => {
      stopVoicePreview();
    };
  }, []);

  const togglePreview = (e) => {
    e.stopPropagation();

    if (isPlaying) {
      stopVoicePreview();
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      playVoicePreview(voice, {
        onStart: () => {
          setIsLoading(true);
        },
        onEnd: () => {
          setIsLoading(false);
          setIsPlaying(false);
        },
        onError: () => {
          setIsLoading(false);
          setIsPlaying(false);
        },
      }).then(() => {
        setIsLoading(false);
        setIsPlaying(true);
      }).catch(() => {
        setIsLoading(false);
        setIsPlaying(false);
      });
    }
  };


  const getProviderBadge = (provider) => {
    switch (provider?.toLowerCase()) {
      case 'elevenlabs':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">ElevenLabs</span>;
      case 'openai':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">OpenAI</span>;
      case 'google':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">Google</span>;
      default:
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Neural</span>;
    }
  };

  return (
    <div
      onClick={() => onSelect(voice)}
      className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer shadow-2xs group ${
        isSelected
          ? 'bg-violet-50/80 border-violet-400 shadow-md ring-1 ring-violet-400/50'
          : 'bg-white hover:bg-slate-50/80 border-slate-200/80 hover:border-violet-300 hover:shadow-md'
      }`}
    >
      {/* Header Info Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#7c3aed] border border-[#ddd6fe] flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
            {voice.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">{voice.name.split('-')[0].trim()}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              {getProviderBadge(voice.provider)}
            </div>
          </div>
        </div>

        {isSelected && (
          <span className="p-1 rounded-full bg-violet-600 text-white shadow-xs">
            <Check className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {/* Voice Sample Quote Preview */}
      <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 text-xs text-slate-600 italic line-clamp-2 leading-relaxed">
        "{sampleText}"
      </div>

      {/* Footer Traits & Play Sample Button */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 capitalize text-[11px] font-medium text-slate-500">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">{voice.gender}</span>
          <span>&bull;</span>
          <span>{voice.accent}</span>
        </div>

        {/* Dedicated Play Preview Button */}
        <button
          type="button"
          onClick={togglePreview}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
            isPlaying
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25 ring-2 ring-violet-400/50'
              : 'bg-violet-100 hover:bg-violet-200 text-violet-700 border border-violet-200'
          }`}
          title={`Play sample preview for ${voice.name}`}
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
          )}
          <span>{isPlaying ? 'Pause' : 'Sample'}</span>
        </button>
      </div>
    </div>
  );
};

