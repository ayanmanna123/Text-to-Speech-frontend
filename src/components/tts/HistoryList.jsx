import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { formatDate } from '../../utils/formatters';
import { VoiceAvatar } from '../../utils/avatarUtils';
import { History, Play, Pause } from 'lucide-react';

export const HistoryList = () => {
  const { history, activeAudio, setActiveAudio, isPlaying, setIsPlaying, setText, voices } = useTtsContext();

  if (!history || history.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 p-8 text-center flex flex-col items-center justify-center gap-2 font-sans shadow-xs">
        <History className="w-8 h-8 text-zinc-300" />
        <h4 className="font-mono font-bold text-sm text-black uppercase">No Generation History Yet</h4>
        <p className="text-xs text-zinc-500 max-w-sm">
          Speech audio created in the studio will automatically appear here for quick playback and download.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 font-sans">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <h3 className="text-xs font-mono font-bold uppercase text-black flex items-center gap-2">
          <History className="w-4 h-4 text-black" />
          <span>RECENT SYNTHESIS LOGS</span>
        </h3>
        <span className="text-xs font-mono text-zinc-400">{history.length} items</span>
      </div>

      <div className="space-y-2">
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
              className={`p-3.5 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isActive
                  ? 'border-black bg-zinc-50 shadow-xs'
                  : 'border-zinc-200 bg-white hover:border-zinc-400'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <VoiceAvatar voice={matchedVoice} className="w-9 h-9 rounded-xs border border-zinc-200 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-xs text-black">
                      {item.voice_name || item.voice_id}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-black text-white">
                      {item.provider}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      &bull; {formatDate(item.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 line-clamp-1 mt-1 font-sans">
                    "{item.text_content || item.text}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setText(item.text_content || item.text)}
                  className="px-3 py-1 border border-zinc-200 bg-white hover:bg-black hover:text-white text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                  title="Re-use script text in Studio"
                >
                  Use Text
                </button>

                <button
                  type="button"
                  onClick={handlePlayToggle}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isCurrentPlaying
                      ? 'bg-black text-white font-bold'
                      : 'bg-black text-white hover:bg-zinc-800 font-bold'
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
