import React, { useState, useRef, useEffect } from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { getVoiceSampleText, playVoicePreview, stopVoicePreview } from '../../utils/voiceSamples';
import { VoiceAvatar } from '../../utils/avatarUtils';
import { Play, Pause, Check, Loader2 } from 'lucide-react';

export const VoiceCard = ({ voice, onSelect }) => {
  const { selectedVoice } = useTtsContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        return <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-black text-white">ElevenLabs</span>;
      case 'openai':
        return <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-zinc-200 text-black">OpenAI</span>;
      case 'google':
        return <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300">Google</span>;
      default:
        return <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-zinc-100 text-zinc-700">Neural</span>;
    }
  };

  return (
    <div
      onClick={() => onSelect(voice)}
      className={`p-5 bg-white border transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer shadow-xs ${
        isSelected
          ? 'border-black ring-1 ring-black'
          : 'border-zinc-200 hover:border-black hover:shadow-md'
      }`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <VoiceAvatar voice={voice} className="w-10 h-10 rounded-xs border border-zinc-200" />
          <div>
            <h4 className="font-extrabold text-sm text-black">{voice.name.split('-')[0].trim()}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              {getProviderBadge(voice.provider)}
            </div>
          </div>
        </div>

        {isSelected && (
          <span className="p-1 bg-black text-white font-bold">
            <Check className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {/* Quote Preview */}
      <div className="bg-zinc-50 rounded-xs p-3 border border-zinc-200 text-xs text-zinc-600 italic line-clamp-2 leading-relaxed">
        "{sampleText}"
      </div>

      {/* Footer & Sample CTA */}
      <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-200">
        <div className="flex items-center gap-1.5 capitalize text-[11px] font-mono font-semibold text-zinc-600">
          <span className="px-2 py-0.5 bg-zinc-100 font-bold text-black uppercase">{voice.gender}</span>
          <span>&bull;</span>
          <span>{voice.accent}</span>
        </div>

        <button
          type="button"
          onClick={togglePreview}
          className={`px-3 py-1.5 font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
            isPlaying
              ? 'bg-black text-white'
              : 'bg-zinc-100 hover:bg-black hover:text-white text-black border border-zinc-200'
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
