import React, { useState } from 'react';
import { useTtsContext } from '../context/TtsContext';
import { VoiceCard } from '../components/voices/VoiceCard';
import { Search, Library } from 'lucide-react';

export const VoicesPage = ({ onSelectVoiceAndGoToStudio }) => {
  const { voices, setSelectedVoice } = useTtsContext();
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');

  const filteredVoices = voices.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                          v.provider.toLowerCase().includes(search.toLowerCase());
    const matchesProvider = providerFilter === 'all' || v.provider.toLowerCase() === providerFilter.toLowerCase();
    const matchesGender = genderFilter === 'all' || v.gender.toLowerCase() === genderFilter.toLowerCase();
    return matchesSearch && matchesProvider && matchesGender;
  });

  const handleSelect = (voice) => {
    setSelectedVoice(voice);
    if (onSelectVoiceAndGoToStudio) {
      onSelectVoiceAndGoToStudio();
    }
  };

  return (
    <div className="max-w-[1550px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6 font-sans">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Library className="w-5 h-5 text-black" />
          <h1 className="text-3xl font-display font-extrabold text-black tracking-tight uppercase">
            VOICE LIBRARY CATALOG
          </h1>
        </div>
        <p className="text-sm text-zinc-600 max-w-2xl font-sans">
          Explore and preview artificial intelligence voices across ElevenLabs, OpenAI, and Google Cloud Speech drivers.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 border border-zinc-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 font-mono text-xs">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH VOICE NAME, ACCENT, OR PROVIDER..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 text-black uppercase placeholder:text-zinc-400 focus:outline-none focus:border-black"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="font-bold px-3 py-2 border border-zinc-200 bg-zinc-50 text-black uppercase focus:outline-none cursor-pointer"
          >
            <option value="all">ALL PROVIDERS</option>
            <option value="elevenlabs">ELEVENLABS</option>
            <option value="openai">OPENAI</option>
            <option value="google">GOOGLE</option>
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="font-bold px-3 py-2 border border-zinc-200 bg-zinc-50 text-black uppercase focus:outline-none cursor-pointer"
          >
            <option value="all">ALL GENDERS</option>
            <option value="female">FEMALE</option>
            <option value="male">MALE</option>
            <option value="neutral">NEUTRAL</option>
          </select>
        </div>
      </div>

      {/* Voice Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVoices.map((voice) => (
          <VoiceCard key={voice.id} voice={voice} onSelect={handleSelect} />
        ))}
      </div>

    </div>
  );
};
