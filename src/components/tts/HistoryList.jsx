import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { formatDate } from '../../utils/formatters';
import { History, Play, Pause, Music } from 'lucide-react';

export const HistoryList = () => {
  const { history, activeAudio, setActiveAudio, isPlaying, setIsPlaying, setText } = useTtsContext();

  if (!history || history.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2 shadow-xs">
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
          <History className="w-4 h-4 text-violet-600" />
          <span>Recent Generations</span>
        </h3>
        <span className="text-xs font-medium text-slate-400">{history.length} items</span>
      </div>

      <div className="space-y-2.5">
        {history.map((item) => {
          const itemUrl = item.audio_url || item.audioUrl;
          const isActive = activeAudio && (activeAudio.id === item.id || activeAudio.audioUrl === itemUrl || activeAudio.audio_url === itemUrl);
          const isCurrentPlaying = isActive && isPlaying;

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
                voiceName: item.voice_name || item.voice_id,
                text: item.text_content || item.text,
              });
              setIsPlaying(true);
            }
          };


          return (
            <div
              key={item.id || item.created_at}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs ${
                isActive
                  ? 'border-violet-300 bg-violet-50/60 shadow-xs'
                  : 'border-slate-200/80 bg-white hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                    isCurrentPlaying
                      ? 'bg-violet-600 text-white animate-pulse'
                      : 'bg-[#ede9fe] text-[#7c3aed]'
                  }`}
                >
                  <Music className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-xs text-slate-900">
                      {item.voice_name || item.voice_id}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
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
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs text-slate-700 font-semibold shadow-2xs transition-all cursor-pointer"
                  title="Re-use script text in Studio"
                >
                  Use Text
                </button>

                <button
                  type="button"
                  onClick={handlePlayToggle}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isCurrentPlaying
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-2xs'
                  }`}
                  title={isCurrentPlaying ? 'Pause Audio' : 'Play Audio'}
                >
                  {isCurrentPlaying ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 ml-0.5" />
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

