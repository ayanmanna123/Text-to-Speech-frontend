import React from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { formatDate } from '../../utils/formatters';
import { History, Play, Pause, Music } from 'lucide-react';

export const HistoryList = () => {
  const { history, activeAudio, setActiveAudio, isPlaying, setIsPlaying, setText } = useTtsContext();

  if (!history || history.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card/40 p-8 text-center flex flex-col items-center justify-center gap-2">
        <History className="w-8 h-8 text-muted-foreground opacity-50" />
        <h4 className="font-semibold text-sm text-foreground">No generation history yet</h4>
        <p className="text-xs text-muted-foreground max-w-sm">
          Speech audio created in the studio will automatically appear here for quick playback and download.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <History className="w-4 h-4 text-violet-500" />
          <span>Recent Generations</span>
        </h3>
        <span className="text-xs text-muted-foreground">{history.length} items</span>
      </div>

      <div className="space-y-2">
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
            }
          };

          return (
            <div
              key={item.id || item.created_at}
              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
                isActive
                  ? 'border-violet-500/60 bg-violet-500/10 shadow-md shadow-violet-500/10'
                  : 'border-border bg-card hover:bg-muted/40'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                    isCurrentPlaying
                      ? 'bg-violet-600 text-white animate-pulse'
                      : 'bg-violet-500/10 text-violet-500'
                  }`}
                >
                  <Music className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs text-foreground">
                      {item.voice_name || item.voice_id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                      {item.provider}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      &bull; {formatDate(item.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1 font-sans">
                    "{item.text_content || item.text}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setText(item.text_content || item.text)}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-muted/30 hover:bg-muted text-xs text-muted-foreground hover:text-foreground font-medium transition-all"
                  title="Re-use script text in Studio"
                >
                  Use Text
                </button>

                <button
                  type="button"
                  onClick={handlePlayToggle}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-xs transition-all hover:scale-105 ${
                    isCurrentPlaying
                      ? 'bg-violet-600 text-white shadow-violet-500/30 ring-2 ring-violet-500/50'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-xs'
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
