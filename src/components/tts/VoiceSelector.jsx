import React, { useState, useRef, useEffect } from 'react';
import { useTtsContext } from '../../context/TtsContext';
import { playVoicePreview, stopVoicePreview } from '../../utils/voiceSamples';
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
        return <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-[#C9FDF2] text-[#084951] border border-[#85D1DB]/60">ElevenLabs</span>;
      case 'openai':
        return <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-[#B6F2D1]/60 text-[#07473b] border border-[#B6F2D1]">OpenAI</span>;
      case 'google':
        return <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-[#B3EBF2]/60 text-[#094754] border border-[#B3EBF2]">Google</span>;
      default:
        return <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-[#e6f7f5] text-[#084951]">Neural</span>;
    }
  };

  return (
    <div ref={containerRef} className={`bg-white/30 backdrop-blur-md border border-[#d0f0ec] rounded-2xl p-5 shadow-xs flex flex-col gap-3 relative transition-all ${
      isOpen ? 'z-50' : 'z-10'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1294a8]" />
          <span>Target Voice</span>
        </label>
        <span className="text-xs font-medium text-slate-400">
          {voices.length > 5 ? `${voices.length} voices available` : '29 voices available'}
        </span>
      </div>

      {/* Selected Voice Card Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3.5 rounded-2xl border border-[#d0f0ec] bg-white/20 hover:bg-white/40 hover:border-[#85D1DB] transition-all flex items-center justify-between shadow-2xs text-left cursor-pointer group backdrop-blur-xs"
      >
        {selectedVoice ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9FDF2]/80 border border-[#85D1DB]/60 flex items-center justify-center text-[#084951] font-extrabold text-base shrink-0 shadow-2xs">
              {selectedVoice.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm">{selectedVoice.name.split('-')[0].trim()}</span>
                {getProviderBadge(selectedVoice.provider)}
              </div>
              <p className="text-xs text-slate-500 font-medium capitalize mt-0.5">
                {selectedVoice.gender} &bull; {selectedVoice.accent} &bull; {selectedVoice.category || 'Narrative'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Mic className="w-4 h-4 text-slate-400" />
            <span>Select a voice...</span>
          </div>
        )}

        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 group-hover:text-slate-600 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Drawer Container */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-[#85D1DB] bg-white shadow-2xl p-4 max-h-[460px] flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Search & Filters Bar */}
            <div className="flex flex-col gap-2">
              {/* Search Input */}
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search voices by name..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#d0f0ec] bg-[#f8fdfc] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#85D1DB]"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="grid grid-cols-3 gap-1.5 w-full">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 rounded-xl border border-[#d0f0ec] bg-[#f8fdfc] text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#85D1DB] cursor-pointer truncate"
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
                  className="w-full text-xs px-2 py-1.5 rounded-xl border border-[#d0f0ec] bg-[#f8fdfc] text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#85D1DB] cursor-pointer truncate"
                >
                  <option value="all">All Engines</option>
                  <option value="elevenlabs">ElevenLabs</option>
                  <option value="openai">OpenAI</option>
                  <option value="google">Google</option>
                </select>

                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 rounded-xl border border-[#d0f0ec] bg-[#f8fdfc] text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#85D1DB] cursor-pointer truncate"
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
                <div className="py-8 text-center text-xs text-slate-400">
                  No voices match your search filters.
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
                        isSelected 
                          ? 'bg-[#C9FDF2]/80 border border-[#85D1DB]' 
                          : 'hover:bg-[#e6f7f5]/80 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#C9FDF2] text-[#084951] flex items-center justify-center font-bold text-xs shrink-0 border border-[#85D1DB]/50">
                          {voice.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-xs">{voice.name.split('-')[0].trim()}</span>
                            {getProviderBadge(voice.provider)}
                          </div>
                          <p className="text-[11px] text-slate-500 capitalize">
                            {voice.gender} &bull; {voice.accent}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => togglePreview(e, voice)}
                          className="w-7 h-7 rounded-full bg-[#C9FDF2] hover:bg-[#B3EBF2] text-[#084951] flex items-center justify-center transition-all cursor-pointer border border-[#85D1DB]/40"
                          title={`Preview sample for ${voice.name}`}
                        >
                          {isPreviewPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
                        </button>
                        {isSelected && <Check className="w-4 h-4 text-[#1294a8]" />}
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

