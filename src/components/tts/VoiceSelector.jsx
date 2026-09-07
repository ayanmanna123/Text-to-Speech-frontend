import React, { useState, useRef } from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { ChevronDown, Play, Pause, Search, Check, Mic, Filter } from 'lucide-react';

export const VoiceSelector = () => {
  const { voices, selectedVoice, setSelectedVoice } = useTtsContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');

  const [playingPreviewId, setPlayingPreviewId] = useState(null);
  const audioRef = useRef(null);

  const togglePreview = (e, voice) => {
    e.stopPropagation();
    if (!voice.previewUrl) return;

    if (playingPreviewId === voice.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingPreviewId(null);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(voice.previewUrl);
      audioRef.current.play();
      setPlayingPreviewId(voice.id);
      audioRef.current.onended = () => setPlayingPreviewId(null);
    }
  };

  const filteredVoices = voices.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = selectedProvider === 'all' || v.provider.toLowerCase() === selectedProvider.toLowerCase();
    const matchesGender = selectedGender === 'all' || v.gender.toLowerCase() === selectedGender.toLowerCase();
    return matchesSearch && matchesProvider && matchesGender;
  });

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
    <div className="relative">
      <label className="text-sm font-semibold text-foreground flex items-center justify-between mb-2">
        <span>Target Voice</span>
        <span className="text-xs font-normal text-muted-foreground">{voices.length} voices available</span>
      </label>

      {/* Selected Voice Card Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-all flex items-center justify-between shadow-xs text-left cursor-pointer"
      >
        {selectedVoice ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center text-violet-500 font-bold text-sm">
              {selectedVoice.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-sm">{selectedVoice.name}</span>
                {getProviderBadge(selectedVoice.provider)}
              </div>
              <p className="text-xs text-muted-foreground capitalize">
                {selectedVoice.gender} &bull; {selectedVoice.accent} &bull; {selectedVoice.category || 'Neural'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Mic className="w-4 h-4" />
            <span>Select a voice...</span>
          </div>
        )}

        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Drawer */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-border bg-popover/95 backdrop-blur-xl shadow-2xl p-4 max-h-[420px] flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Search & Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by voice name or provider..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-muted/40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 text-foreground focus:outline-none"
              >
                <option value="all">All Providers</option>
                <option value="elevenlabs">ElevenLabs</option>
                <option value="openai">OpenAI</option>
                <option value="google">Google</option>
              </select>

              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 text-foreground focus:outline-none"
              >
                <option value="all">All Genders</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
          </div>

          {/* Voice Items List */}
          <div className="overflow-y-auto space-y-1 pr-1 flex-1 max-h-[300px]">
            {filteredVoices.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No voices found matching your filters.
              </div>
            ) : (
              filteredVoices.map((voice) => {
                const isSelected = selectedVoice?.id === voice.id;
                const isPreviewPlaying = playingPreviewId === voice.id;

                return (
                  <div
                    key={voice.id}
                    onClick={() => {
                      setSelectedVoice(voice);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-xs text-foreground">
                        {voice.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-xs">{voice.name}</span>
                          {getProviderBadge(voice.provider)}
                        </div>
                        <p className="text-[11px] text-muted-foreground capitalize">
                          {voice.gender} &bull; {voice.accent}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {voice.previewUrl && (
                        <button
                          type="button"
                          onClick={(e) => togglePreview(e, voice)}
                          className="w-7 h-7 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-all"
                          title="Preview voice audio sample"
                        >
                          {isPreviewPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}
    </div>
  );
};
