import React, { useState, useRef } from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { Play, Pause, Mic, Check } from 'lucide-react';

export const VoiceCard = ({ voice, onSelect }) => {
  const { selectedVoice } = useTtsContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const isSelected = selectedVoice?.id === voice.id;

  const togglePreview = (e) => {
    e.stopPropagation();
    if (!voice.previewUrl) return;

    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(voice.previewUrl);
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const getProviderBadge = (provider) => {
    switch (provider?.toLowerCase()) {
      case 'elevenlabs':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">ElevenLabs</span>;
      case 'openai':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">OpenAI</span>;
      case 'google':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">Google</span>;
      default:
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Neural</span>;
    }
  };

  return (
    <div
      onClick={() => onSelect(voice)}
      className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer shadow-xs ${
        isSelected
          ? 'bg-primary/10 border-primary shadow-md'
          : 'bg-card hover:bg-muted/40 border-border hover:border-border/80 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-500 flex items-center justify-center font-bold text-base">
            {voice.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground">{voice.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              {getProviderBadge(voice.provider)}
            </div>
          </div>
        </div>

        {isSelected && (
          <span className="p-1 rounded-full bg-primary text-primary-foreground">
            <Check className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
        <div className="flex items-center gap-2 capitalize">
          <span className="px-2 py-0.5 rounded-md bg-muted font-medium">{voice.gender}</span>
          <span>&bull;</span>
          <span>{voice.accent}</span>
          <span>&bull;</span>
          <span>{voice.category || 'Neural'}</span>
        </div>

        {voice.previewUrl && (
          <button
            type="button"
            onClick={togglePreview}
            className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-all cursor-pointer"
            title="Preview Audio Sample"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        )}
      </div>
    </div>
  );
};
