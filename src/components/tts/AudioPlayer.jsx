import React, { useState, useRef, useEffect } from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { formatTime } from '../../utils/formatters';
import { Play, Pause, Download, Volume2, VolumeX, Sparkles, Music, RotateCcw, RotateCw, Gauge } from 'lucide-react';

export const AudioPlayer = () => {
  const { activeAudio, isPlaying, setIsPlaying } = useTtsContext();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackError, setPlaybackError] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState('mp3');

  const audioRef = useRef(null);

  useEffect(() => {
    const audioUrl = activeAudio?.audioUrl || activeAudio?.audio_url;
    if (!audioUrl) return;

    if (activeAudio?.format) {
      setDownloadFormat(activeAudio.format);
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setPlaybackError(null);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.volume = volume;
    audio.playbackRate = playbackRate;

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

  const handleSkip = (seconds) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
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

    const targetFormat = downloadFormat || activeAudio?.format || 'mp3';
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

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/20 via-card to-purple-950/20 backdrop-blur-md p-5 shadow-lg flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {playbackError && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center justify-between">
          <span>{playbackError}</span>
          <button type="button" onClick={() => setPlaybackError(null)} className="font-bold underline ml-2">Dismiss</button>
        </div>
      )}
      
      {/* Audio Info Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-500/30 shrink-0">
            <Music className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm text-foreground">Generated Audio Output</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                {activeAudio.voiceName || 'Neural Voice'}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {playbackRate}x Speed
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 italic max-w-md mt-0.5">
              "{activeAudio.text}"
            </p>
          </div>
        </div>

        {/* Chosen File Format Badge + Download Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-extrabold uppercase px-2.5 py-1.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/30">
            {(activeAudio?.format || downloadFormat || 'MP3').toUpperCase()}
          </span>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs shadow-md shadow-violet-600/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .{(activeAudio?.format || downloadFormat || 'mp3').toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Interactive Waveform Bar Visualizer */}
      <div 
        className="flex items-center justify-center gap-1 h-10 px-4 bg-violet-500/5 hover:bg-violet-500/10 rounded-xl overflow-hidden cursor-pointer border border-violet-500/20 transition-colors group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const targetRatio = Math.max(0, Math.min(1, clickX / rect.width));
          const targetTime = targetRatio * (duration || 1);
          if (audioRef.current) {
            audioRef.current.currentTime = targetTime;
            setCurrentTime(targetTime);
          }
        }}
        title="Click anywhere on the waveform to seek"
      >
        {Array.from({ length: 48 }).map((_, i) => {
          const progressRatio = currentTime / (duration || 1);
          const isActive = progressRatio * 48 > i;
          // Dynamic real-time height modulation when playing vs static wave when paused
          const dynamicMultiplier = isPlaying ? Math.abs(Math.sin(i * 0.35 + currentTime * 9)) * 14 + 8 : Math.sin(i * 0.4) * 8 + 14;
          const height = Math.max(4, Math.min(28, dynamicMultiplier));

          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-100 ${
                isActive 
                  ? 'bg-gradient-to-t from-violet-600 via-indigo-500 to-purple-400 shadow-xs shadow-violet-500/50' 
                  : 'bg-muted-foreground/25 group-hover:bg-muted-foreground/40'
              }`}
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>

      {/* Playback Controls & Timeline Scrubber */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        
        {/* Play / Pause / Skip Controls Group */}
        <div className="flex items-center gap-2">
          {/* Rewind 5s */}
          <button
            type="button"
            onClick={() => handleSkip(-5)}
            className="w-8 h-8 rounded-full bg-muted/60 hover:bg-muted text-foreground flex items-center justify-center transition-all text-xs font-bold"
            title="Rewind 5 seconds"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          {/* Forward 5s */}
          <button
            type="button"
            onClick={() => handleSkip(5)}
            className="w-8 h-8 rounded-full bg-muted/60 hover:bg-muted text-foreground flex items-center justify-center transition-all text-xs font-bold"
            title="Forward 5 seconds"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1 w-full flex items-center gap-3">
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

        {/* Playback Speed & Volume Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Dynamic Speed Selector */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/50">
            <Gauge className="w-3.5 h-3.5 text-muted-foreground ml-1" />
            <select
              value={playbackRate}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="text-xs bg-transparent text-foreground font-bold focus:outline-none cursor-pointer pr-1"
              title="Adjust playback speed in real-time"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>
          </div>

          {/* Volume Control */}
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
              className="w-16 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
