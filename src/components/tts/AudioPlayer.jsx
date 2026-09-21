import React, { useState, useRef, useEffect } from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { formatTime } from '../../utils/formatters';
import { Play, Pause, Download, Volume2, VolumeX, Music, RotateCcw, RotateCw, ChevronDown } from 'lucide-react';

export const AudioPlayer = () => {
  const { activeAudio, isPlaying, setIsPlaying } = useTtsContext();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackError, setPlaybackError] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    const audioUrl = activeAudio?.audioUrl || activeAudio?.audio_url;
    if (!audioUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setPlaybackError(null);
    setCurrentTime(0);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.volume = volume;
    audio.playbackRate = playbackRate;

    audio.onloadedmetadata = () => {
      setDuration(audio.duration || activeAudio.durationSeconds || activeAudio.duration_seconds || 5);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.onerror = (err) => {
      console.warn("Audio element failed to load or play source:", audioUrl, err);
      setIsPlaying(false);
      setPlaybackError("Audio playback failed. Source URL may be expired or invalid.");
    };

    if (isPlaying) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Play failed:", err);
          setIsPlaying(false);
        });
    } else {
      setIsPlaying(false);
    }

    return () => {
      audio.pause();
    };
  }, [activeAudio]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Play error:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  if (!activeAudio) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Manual play failed:", err);
          setIsPlaying(false);
          setPlaybackError("Unable to play audio stream.");
        });
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSkip = (seconds) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(duration || 5, audioRef.current.currentTime + seconds));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleDownload = () => {
    let url = activeAudio?.audioUrl || activeAudio?.audio_url;
    if (!url) return;

    const targetFormat = (activeAudio?.format || 'mp3').toLowerCase();
    const mimeType = targetFormat === 'wav' ? 'audio/wav' : targetFormat === 'ogg' ? 'audio/ogg' : 'audio/mpeg';

    if (url.startsWith('data:')) {
      const parts = url.split(',');
      if (parts.length > 1) {
        url = `data:${mimeType};base64,${parts[1]}`;
      }
    }

    const a = document.createElement('a');
    a.href = url;
    const cleanSnippet = (activeAudio.text || 'speech').slice(0, 15).replace(/[^a-zA-Z0-9]/g, '_');
    a.download = `neural_${cleanSnippet}_${Date.now()}.${targetFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatExt = (activeAudio?.format || 'mp3').toUpperCase();
  const demoText = activeAudio.text || 'Synthesized speech output buffer.';

  return (
    <div className="bg-white border border-zinc-200 p-5 shadow-xs flex flex-col gap-4 font-sans relative">
      
      {playbackError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono font-bold flex items-center justify-between">
          <span>{playbackError}</span>
          <button type="button" onClick={() => setPlaybackError(null)} className="font-bold underline ml-2">Dismiss</button>
        </div>
      )}
      
      {/* Audio Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-extrabold text-sm text-black">GENERATED AUDIO STREAM</h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-zinc-100 text-black border border-zinc-200">
                {activeAudio.voiceName || 'Neural Voice'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-zinc-100 text-zinc-600">
                {playbackRate}x Speed
              </span>
            </div>
            <p className="text-xs text-zinc-500 italic line-clamp-1 max-w-lg mt-0.5">
              "{demoText}"
            </p>
          </div>
        </div>

        {/* Format Tag & Download CTA Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-xs font-mono font-extrabold px-2.5 py-1 bg-zinc-100 text-black border border-zinc-200 uppercase">
            .{formatExt}
          </span>

          <button
            type="button"
            onClick={handleDownload}
            className="btn-pill-black text-xs uppercase"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Dynamic Waveform Visualizer */}
      <div 
        className="flex items-center justify-center gap-1 h-14 px-4 bg-zinc-50 border border-zinc-200 overflow-hidden cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const targetRatio = Math.max(0, Math.min(1, clickX / rect.width));
          const targetTime = targetRatio * (duration || 5);
          if (audioRef.current) {
            audioRef.current.currentTime = targetTime;
            setCurrentTime(targetTime);
          }
        }}
        title="Click waveform to seek"
      >
        {Array.from({ length: 64 }).map((_, i) => {
          const progressRatio = currentTime / (duration || 5);
          const isActive = progressRatio * 64 > i;
          const dynamicMultiplier = isPlaying 
            ? Math.abs(Math.sin(i * 0.35 + currentTime * 8)) * 24 + 6 
            : Math.sin(i * 0.3) * 12 + 16;
          const height = Math.max(4, Math.min(36, dynamicMultiplier));

          return (
            <div
              key={i}
              className={`w-1 transition-all duration-100 ${
                isActive 
                  ? 'bg-black' 
                  : 'bg-zinc-200 group-hover:bg-zinc-300'
              }`}
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>

      {/* Playback Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        
        {/* Play / Pause / Skip */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSkip(-10)}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-black flex items-center justify-center transition-all cursor-pointer"
            title="Rewind 10s"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer font-bold"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
          </button>

          <button
            type="button"
            onClick={() => handleSkip(10)}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-black flex items-center justify-center transition-all cursor-pointer"
            title="Forward 10s"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timeline */}
        <div className="flex-1 w-full flex items-center gap-3 font-mono text-xs">
          <span className="font-bold text-black min-w-[36px] text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 5}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-zinc-200 appearance-none cursor-pointer accent-black"
          />
          <span className="font-bold text-zinc-400 min-w-[36px]">
            {formatTime(duration || 5)}
          </span>
        </div>

        {/* Speed & Volume */}
        <div className="flex items-center gap-3 font-mono text-xs self-end sm:self-auto shrink-0">
          <div className="relative inline-flex items-center">
            <select
              value={playbackRate}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="font-bold bg-zinc-100 border border-zinc-200 text-black px-2.5 py-1 rounded-full focus:outline-none cursor-pointer appearance-none pr-5"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>
            <ChevronDown className="w-3 h-3 text-zinc-500 absolute right-1.5 pointer-events-none" />
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <button type="button" onClick={toggleMute} className="text-zinc-500 hover:text-black transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1.5 bg-zinc-200 appearance-none cursor-pointer accent-black"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
