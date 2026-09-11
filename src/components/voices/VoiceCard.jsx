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
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#C9FDF2] text-[#084951] border border-[#85D1DB]/60">ElevenLabs</span>;
      case 'openai':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#B6F2D1]/60 text-[#07473b] border border-[#B6F2D1]">OpenAI</span>;
      case 'google':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#B3EBF2]/60 text-[#094754] border border-[#B3EBF2]">Google</span>;
      default:
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#e6f7f5] text-[#084951]">Neural</span>;
    }
  };

  return (
    <div
      onClick={() => onSelect(voice)}
      className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer shadow-2xs group backdrop-blur-md ${
        isSelected
          ? 'bg-[#C9FDF2]/50 border-[#85D1DB] shadow-md ring-1 ring-[#85D1DB]/50'
          : 'bg-white/30 hover:bg-white/50 border-[#d0f0ec] hover:border-[#85D1DB] hover:shadow-md'
      }`}
    >
      {/* Header Info Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C9FDF2]/80 text-[#084951] border border-[#85D1DB]/60 flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
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
          <span className="p-1 rounded-full bg-[#1294a8] text-white shadow-xs">
            <Check className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {/* Voice Sample Quote Preview */}
      <div className="bg-white/20 rounded-xl p-2.5 border border-[#d0f0ec]/70 text-xs text-slate-600 italic line-clamp-2 leading-relaxed backdrop-blur-xs">
        "{sampleText}"
      </div>

      {/* Footer Traits & Play Sample Button */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-[#d0f0ec]">
        <div className="flex items-center gap-1.5 capitalize text-[11px] font-medium text-slate-500">
          <span className="px-2 py-0.5 rounded-md bg-[#e6f7f5] font-semibold text-[#084951]">{voice.gender}</span>
          <span>&bull;</span>
          <span>{voice.accent}</span>
        </div>

        {/* Dedicated Play Preview Button */}
        <button
          type="button"
          onClick={togglePreview}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
            isPlaying
              ? 'bg-gradient-to-r from-[#85D1DB] to-[#B6F2D1] text-[#05262c] shadow-md shadow-[#85D1DB]/25 ring-2 ring-[#85D1DB]/50'
              : 'bg-[#C9FDF2] hover:bg-[#B3EBF2] text-[#084951] border border-[#85D1DB]/50'
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

