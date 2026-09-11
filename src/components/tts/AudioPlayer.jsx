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
      setPlaybackError("Audio playback failed. The clip URL may be expired or inaccessible.");
    };

    // Autoplay disabled: play only if isPlaying state is already true (e.g. user clicked Play)
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
    a.download = `${cleanSnippet}_${Date.now()}.${targetFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatExt = (activeAudio?.format || 'mp3').toUpperCase();
  const demoText = activeAudio.text || 'सपनों की आवाज़, अब हर शब्द में, आपके विचारों को मिलेगी एक नई ऊँचाई!';

  return (
    <div className="bg-white/30 backdrop-blur-md border border-[#d0f0ec] rounded-2xl p-5 shadow-xs flex flex-col gap-4 relative animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {playbackError && (
        <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <span>{playbackError}</span>
          <button type="button" onClick={() => setPlaybackError(null)} className="font-bold underline ml-2">Dismiss</button>
        </div>
      )}
      
      {/* Audio Output Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#85D1DB] via-[#B3EBF2] to-[#B6F2D1] text-[#062c30] flex items-center justify-center shadow-md shadow-[#85D1DB]/20 shrink-0">
            <Music className="w-5 h-5 text-[#062c30]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-extrabold text-sm text-slate-900">Generated Audio Output</h4>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#C9FDF2]/80 text-[#084951] border border-[#85D1DB]/60">
                {activeAudio.voiceName || 'Neural Voice'}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/40 text-slate-600 border border-[#d0f0ec] backdrop-blur-xs">
                {playbackRate}x Speed
              </span>
            </div>
            <p className="text-xs text-slate-500 italic line-clamp-1 max-w-lg mt-0.5 font-normal">
              {demoText}
            </p>
          </div>
        </div>

        {/* Format Tag & Download CTA Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-[#C9FDF2]/80 text-[#084951] border border-[#85D1DB]/60 uppercase">
            {formatExt}
          </span>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#85D1DB] via-[#66c2ce] to-[#B6F2D1] hover:from-[#72c7d2] hover:to-[#9eecc1] text-[#05262c] font-extrabold text-xs shadow-md shadow-[#85D1DB]/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .{formatExt}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Waveform Visualizer */}
      <div 
        className="flex items-center justify-center gap-1 h-14 px-4 bg-white/30 backdrop-blur-xs rounded-xl overflow-hidden cursor-pointer border border-[#d0f0ec] shadow-2xs group transition-all"
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
        title="Click anywhere on the waveform to seek"
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
              className={`w-1 rounded-full transition-all duration-100 ${
                isActive 
                  ? 'bg-gradient-to-t from-[#85D1DB] via-[#B3EBF2] to-[#B6F2D1] shadow-2xs' 
                  : 'bg-slate-300/60 group-hover:bg-slate-400/60'
              }`}
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>

      {/* Playback Scrubber & Control Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
        
        {/* Play / Pause / Skip Buttons */}
        <div className="flex items-center gap-2">
          {/* Rewind 10s */}
          <button
            type="button"
            onClick={() => handleSkip(-10)}
            className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 border border-[#d0f0ec] text-slate-700 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
            title="Rewind 10 seconds"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Play / Pause Circle Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#85D1DB] via-[#66c2ce] to-[#B6F2D1] text-[#05262c] flex items-center justify-center shadow-md shadow-[#85D1DB]/35 transition-transform hover:scale-105 active:scale-95 cursor-pointer font-bold"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
          </button>

          {/* Forward 10s */}
          <button
            type="button"
            onClick={() => handleSkip(10)}
            className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 border border-[#d0f0ec] text-slate-700 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
            title="Forward 10 seconds"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrubber Timeline */}
        <div className="flex-1 w-full flex items-center gap-3">
          <span className="text-xs font-mono font-medium text-slate-500 min-w-[36px] text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 5}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-[#d0f0ec]/60 rounded-lg appearance-none cursor-pointer accent-[#85D1DB]"
          />
          <span className="text-xs font-mono font-medium text-slate-500 min-w-[36px]">
            {formatTime(duration || 5)}
          </span>
        </div>

        {/* Speed Dropdown & Volume Control */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          {/* Speed Selector */}
          <div className="relative inline-flex items-center">
            <select
              value={playbackRate}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="text-xs font-extrabold bg-white/30 border border-[#d0f0ec] text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#85D1DB] cursor-pointer appearance-none pr-6 shadow-2xs backdrop-blur-xs"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 pointer-events-none" />
          </div>

          {/* Volume Control Slider */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button type="button" onClick={toggleMute} className="text-slate-500 hover:text-slate-800 transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1.5 bg-[#d0f0ec] rounded-lg appearance-none cursor-pointer accent-[#85D1DB]"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

