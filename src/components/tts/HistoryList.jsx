import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { formatDate } from '../../utils/formatters';
import { VoiceAvatar } from '../../utils/avatarUtils';
import { History, Play, Pause, Music } from 'lucide-react';

export const HistoryList = () => {
  const { history, activeAudio, setActiveAudio, isPlaying, setIsPlaying, setText, voices } = useTtsContext();

  if (!history || history.length === 0) {
    return (
      <div className="bg-white/30 backdrop-blur-md border border-[#d0f0ec] rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2 shadow-xs">
        <History className="w-8 h-8 text-slate-300 opacity-80" />
        <h4 className="font-extrabold text-sm text-slate-800">No generation history yet</h4>
        <p className="text-xs text-slate-500 max-w-sm">
          Speech audio created in the studio will automatically appear here for quick playback and download.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-[#1294a8]" />
          <span>Recent Generations</span>
        </h3>
        <span className="text-xs font-medium text-slate-400">{history.length} items</span>
      </div>

      <div className="space-y-2.5">
        {history.map((item) => {
          const itemUrl = item.audio_url || item.audioUrl;
          const isActive = activeAudio && (activeAudio.id === item.id || activeAudio.audioUrl === itemUrl || activeAudio.audio_url === itemUrl);
          const isCurrentPlaying = isActive && isPlaying;
          const voiceName = item.voice_name || item.voice_id;
          const matchedVoice = voices?.find((v) => v.name === voiceName || v.id === item.voice_id) || { name: voiceName, gender: item.gender || 'neutral' };

          const handlePlayToggle = () => {
            if (isActive) {
              setIsPlaying(!isPlaying);
            } else {
              setActiveAudio({
                id: item.id,
                audioUrl: itemUrl,
                audio_url: itemUrl,
                durationSeconds: item.duration_seconds || item.durationSeconds,
                characterCount: item.character_count || item.characterCount,
                voiceName: voiceName,
                text: item.text_content || item.text,
              });
              setIsPlaying(true);
            }
          };

          return (
            <div
              key={item.id || item.created_at}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs backdrop-blur-xs ${
                isActive
                  ? 'border-[#85D1DB] bg-[#C9FDF2]/50 shadow-xs'
                  : 'border-[#d0f0ec] bg-white/20 hover:bg-white/40'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <VoiceAvatar voice={matchedVoice} className={`w-9 h-9 rounded-xl ${isCurrentPlaying ? 'ring-2 ring-[#1294a8] animate-pulse' : ''}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-xs text-slate-900">
                      {item.voice_name || item.voice_id}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#e6f7f5]/80 text-[#084951]">
                      {item.provider}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      &bull; {formatDate(item.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-normal">
                    "{item.text_content || item.text}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setText(item.text_content || item.text)}
                  className="px-3 py-1.5 rounded-xl border border-[#d0f0ec] bg-white/30 hover:bg-white/50 text-xs text-slate-700 font-semibold shadow-2xs transition-all cursor-pointer backdrop-blur-xs"
                  title="Re-use script text in Studio"
                >
                  Use Text
                </button>

                <button
                  type="button"
                  onClick={handlePlayToggle}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isCurrentPlaying
                      ? 'bg-gradient-to-tr from-[#85D1DB] to-[#B6F2D1] text-[#05262c] shadow-md shadow-[#85D1DB]/30 font-bold'
                      : 'bg-gradient-to-tr from-[#85D1DB] to-[#B6F2D1] hover:from-[#72c7d2] hover:to-[#9eecc1] text-[#05262c] shadow-2xs font-bold'
                  }`}
                  title={isCurrentPlaying ? 'Pause Audio' : 'Play Audio'}
                >
                  {isCurrentPlaying ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

