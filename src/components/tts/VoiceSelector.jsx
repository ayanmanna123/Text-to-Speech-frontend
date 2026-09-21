import React, { useState, useRef, useEffect } from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { playVoicePreview, stopVoicePreview } from '../../utils/voiceSamples';
import { VoiceAvatar } from '../../utils/avatarUtils';
import { ChevronDown, Play, Pause, Search, Check, Mic, SlidersHorizontal } from 'lucide-react';

export const VoiceSelector = () => {
  const { voices, selectedVoice, setSelectedVoice } = useTtsContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');

  const [playingPreviewId, setPlayingPreviewId] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const togglePreview = (e, voice) => {
    e.stopPropagation();

    if (playingPreviewId === voice.id) {
      stopVoicePreview();
      setPlayingPreviewId(null);
    } else {
      setPlayingPreviewId(voice.id);
      playVoicePreview(voice, {
        onEnd: () => setPlayingPreviewId(null),
        onError: () => setPlayingPreviewId(null),
      }).catch(() => setPlayingPreviewId(null));
    }
  };

  const LANGUAGES = [
    { label: 'All Languages', value: 'all' },
    { label: 'English', value: 'english' },
    { label: 'Hindi', value: 'hindi' },
    { label: 'Gujarati', value: 'gujarati' },
    { label: 'Marathi', value: 'marathi' },
    { label: 'Spanish', value: 'spanish' },
    { label: 'French', value: 'french' },
    { label: 'German', value: 'german' },
  ];

  const filteredVoices = voices.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (v.language && v.language.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProvider = selectedProvider === 'all' || v.provider.toLowerCase() === selectedProvider.toLowerCase();
    const matchesGender = selectedGender === 'all' || v.gender.toLowerCase() === selectedGender.toLowerCase();
    const matchesLanguage = selectedLanguage === 'all' || 
                            (v.language && v.language.toLowerCase() === selectedLanguage.toLowerCase()) ||
                            (v.languageCode && v.languageCode.toLowerCase().includes(selectedLanguage.toLowerCase()));
    return matchesSearch && matchesProvider && matchesGender && matchesLanguage;
  });

  const getProviderBadge = (provider) => {
    switch (provider?.toLowerCase()) {
      case 'elevenlabs':
        return <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-black text-white">ElevenLabs</span>;
      case 'openai':
        return <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-zinc-200 text-black">OpenAI</span>;
      case 'google':
        return <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300">Google</span>;
      default:
        return <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-zinc-100 text-zinc-700">Neural</span>;
    }
  };

  return (
    <div ref={containerRef} className={`bg-white border border-zinc-200 p-5 shadow-xs flex flex-col gap-3 relative font-sans ${
      isOpen ? 'z-50' : 'z-10'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-mono font-bold uppercase text-black flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-black" />
          <span>TARGET VOICE DRIVER</span>
        </label>
        <span className="text-xs font-mono text-zinc-400">
          {voices.length > 0 ? `${voices.length} Available` : '29 Available'}
        </span>
      </div>

      {/* Selected Voice Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3.5 border border-zinc-200 bg-white hover:border-black transition-all flex items-center justify-between text-left cursor-pointer group shadow-2xs"
      >
        {selectedVoice ? (
          <div className="flex items-center gap-3">
            <VoiceAvatar voice={selectedVoice} className="w-10 h-10 rounded-xs border border-zinc-200" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-black text-sm">{selectedVoice.name.split('-')[0].trim()}</span>
                {getProviderBadge(selectedVoice.provider)}
              </div>
              <p className="text-xs text-zinc-500 font-mono capitalize mt-0.5">
                {selectedVoice.gender} &bull; {selectedVoice.accent} &bull; {selectedVoice.category || 'Narrative'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Mic className="w-4 h-4 text-zinc-400" />
            <span>Select a voice driver...</span>
          </div>
        )}

        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 group-hover:text-black ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Drawer */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 border border-black bg-white p-4 max-h-[460px] flex flex-col gap-3 shadow-xl">
            
            {/* Search & Filters */}
            <div className="flex flex-col gap-2">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search voices by name..."
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-zinc-200 bg-zinc-50 text-black placeholder:text-zinc-400 focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5 w-full font-mono text-xs">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-2 py-1.5 border border-zinc-200 bg-zinc-50 text-black focus:outline-none cursor-pointer truncate"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full px-2 py-1.5 border border-zinc-200 bg-zinc-50 text-black focus:outline-none cursor-pointer truncate"
                >
                  <option value="all">All Engines</option>
                  <option value="elevenlabs">ElevenLabs</option>
                  <option value="openai">OpenAI</option>
                  <option value="google">Google</option>
                </select>

                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-2 py-1.5 border border-zinc-200 bg-zinc-50 text-black focus:outline-none cursor-pointer truncate"
                >
                  <option value="all">All Genders</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
            </div>

            {/* Filtered Voice List */}
            <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 max-h-[280px]">
              {filteredVoices.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-zinc-400">
                  No voices match search filters.
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
                      className={`p-2.5 border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-zinc-100 border-black font-semibold' 
                          : 'hover:bg-zinc-50 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <VoiceAvatar voice={voice} className="w-8 h-8 rounded-xs border border-zinc-200" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-black text-xs">{voice.name.split('-')[0].trim()}</span>
                            {getProviderBadge(voice.provider)}
                          </div>
                          <p className="text-[11px] text-zinc-500 font-mono capitalize">
                            {voice.gender} &bull; {voice.accent}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => togglePreview(e, voice)}
                          className="w-7 h-7 rounded-full bg-black text-white hover:bg-zinc-800 flex items-center justify-center transition-all cursor-pointer"
                          title={`Preview sample for ${voice.name}`}
                        >
                          {isPreviewPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
                        </button>
                        {isSelected && <Check className="w-4 h-4 text-black" />}
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
