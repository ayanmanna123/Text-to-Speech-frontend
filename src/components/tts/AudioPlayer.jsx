import React, { useState, useRef, useEffect } from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { formatTime } from '../../utils/formatters';
import { Play, Pause, Download, Volume2, VolumeX, Sparkles, Music } from 'lucide-react';

export const AudioPlayer = () => {
  const { activeAudio, isPlaying, setIsPlaying } = useTtsContext();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
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
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.volume = volume;

    audio.onloadedmetadata = () => {
      setDuration(audio.duration || activeAudio.durationSeconds || activeAudio.duration_seconds || 0);
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

    // Autoplay active audio
    audio.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn("Autoplay blocked or failed:", err);
        setIsPlaying(false);
      });

    return () => {
      audio.pause();
    };
  }, [activeAudio]);

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
    if (!activeAudio?.audioUrl) return;
    const a = document.createElement('a');
    a.href = activeAudio.audioUrl;
    a.download = `neural_speech_${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/20 via-card to-purple-950/20 backdrop-blur-md p-5 shadow-lg flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {playbackError && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center justify-between">
          <span>{playbackError}</span>
          <button type="button" onClick={() => setPlaybackError(null)} className="font-bold underline ml-2">Dismiss</button>
        </div>
      )}
      
      {/* Audio Info Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-500/30">
            <Music className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-foreground">Generated Audio Output</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                {activeAudio.voiceName || 'Neural Voice'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 italic max-w-md mt-0.5">
              "{activeAudio.text}"
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs shadow-md shadow-violet-600/30 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download MP3</span>
        </button>
      </div>

      {/* Waveform Bar Simulation */}
      <div className="flex items-center justify-center gap-1 h-8 px-4 bg-muted/30 rounded-xl overflow-hidden">
        {Array.from({ length: 48 }).map((_, i) => {
          const isActive = (currentTime / (duration || 1)) * 48 > i;
          const height = Math.sin(i * 0.4) * 12 + 16;
          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isActive ? 'bg-violet-500' : 'bg-muted-foreground/30'
              } ${isPlaying && isActive ? 'animate-pulse' : ''}`}
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>

      {/* Playback Controls & Timeline Scrubber */}
      <div className="flex items-center gap-4">
        
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="w-11 h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        {/* Timeline Slider */}
        <div className="flex-1 flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground min-w-[40px] text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <span className="text-xs font-mono text-muted-foreground min-w-[40px]">
            {formatTime(duration)}
          </span>
        </div>

        {/* Volume Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button type="button" onClick={toggleMute} className="text-muted-foreground hover:text-foreground">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
        </div>

      </div>
    </div>
  );
};
