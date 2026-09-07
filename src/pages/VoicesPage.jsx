import React, { useState } from 'react';
import { useTtsContext } from '../context/TtsContext';
import { VoiceCard } from '../components/voices/VoiceCard';
import { Search, Library, Sparkles, Filter } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20">
            <Library className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Voice Library Catalog
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Explore and preview artificial intelligence voices across ElevenLabs, OpenAI, and Google Cloud Speech drivers.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-card/60 p-4 rounded-2xl border border-border">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search voice name, accent, or provider..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3">
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none"
          >
            <option value="all">All Providers</option>
            <option value="elevenlabs">ElevenLabs</option>
            <option value="openai">OpenAI</option>
            <option value="google">Google</option>
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none"
          >
            <option value="all">All Genders</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="neutral">Neutral</option>
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
