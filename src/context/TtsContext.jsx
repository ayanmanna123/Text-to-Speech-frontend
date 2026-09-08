import React, { createContext, useContext, useState, useEffect } from 'react';
import { voiceApi } from '../api/voiceApi';
import { ttsApi } from '../api/ttsApi';
import { usageApi } from '../api/usageApi';
import { DEFAULT_VOICE_SETTINGS } from '../utils/constants';

const DEFAULT_INITIAL_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel - Calming & Professional', provider: 'elevenlabs', gender: 'female', accent: 'american', category: 'narrative' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah - Mature, Reassuring', provider: 'elevenlabs', gender: 'female', accent: 'american', category: 'premade' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni - Deep Storyteller', provider: 'elevenlabs', gender: 'male', accent: 'american', category: 'narration' },
  { id: 'alloy', name: 'Alloy - Versatile Neutral', provider: 'openai', gender: 'neutral', accent: 'american', category: 'versatile' },
  { id: 'echo', name: 'Echo - Warm Male', provider: 'openai', gender: 'male', accent: 'american', category: 'warm' },
];

const TtsContext = createContext(null);

export const TtsProvider = ({ children }) => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState(DEFAULT_INITIAL_VOICES);
  const [selectedVoice, setSelectedVoice] = useState(DEFAULT_INITIAL_VOICES[0]);
  const [voiceSettings, setVoiceSettings] = useState(DEFAULT_VOICE_SETTINGS);
  const [isGenerating, setIsGenerating] = useState(false);
  const getLocalHistory = () => {
    try {
      const saved = localStorage.getItem('tts_generation_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to read history from localStorage:', e);
      return [];
    }
  };

  const saveLocalHistory = (items) => {
    try {
      localStorage.setItem('tts_generation_history', JSON.stringify(items.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to save history to localStorage:', e);
    }
  };

  const [history, setHistory] = useState(() => getLocalHistory());
  const [activeAudio, setActiveAudio] = useState(() => {
    const initialHist = getLocalHistory();
    return initialHist.length > 0 ? initialHist[0] : null;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [quota, setQuota] = useState({
    tier: 'free',
    characterQuota: 10000,
    charactersUsed: 0,
    charactersRemaining: 10000,
  });
  const [error, setError] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    fetchVoices();
    fetchUsage();
    fetchHistory();
  }, []);

  const fetchVoices = async (filters = {}) => {
    try {
      const res = await voiceApi.getVoices(filters);
      if (res.success && res.data && res.data.length > 0) {
        setVoices(res.data);
        setSelectedVoice((current) => {
          if (!current) return res.data[0];
          const matched = res.data.find((v) => v.id === current.id);
          return matched || res.data[0];
        });
      }
    } catch (err) {
      console.warn('Backend server connecting or using initial voices catalog:', err.message);
    }
  };

  const fetchUsage = async () => {
    try {
      const res = await usageApi.getUserBalance();
      if (res.success && res.data) {
        setQuota(res.data);
      }
    } catch (err) {
      console.warn('Using default quota:', err.message);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await ttsApi.getHistory();
      if (res.success && res.data && res.data.length > 0) {
        setHistory((prev) => {
          const map = new Map();
          [...res.data, ...prev].forEach((item) => {
            const key = item.id || item.audio_url || item.audioUrl;
            if (key && !map.has(key)) {
              map.set(key, {
                ...item,
                audioUrl: item.audioUrl || item.audio_url,
                audio_url: item.audio_url || item.audioUrl,
                text: item.text || item.text_content,
                text_content: item.text_content || item.text,
              });
            }
          });
          const merged = Array.from(map.values());
          saveLocalHistory(merged);
          return merged;
        });
      }
    } catch (err) {
      console.warn('History load warning:', err.message);
    }
  };

  const generateSpeech = async (overrideText = null) => {
    const textToSynthesize = overrideText || text;
    
    // 1. Text must not be empty
    if (!textToSynthesize || typeof textToSynthesize !== 'string' || !textToSynthesize.trim()) {
      setError('Text must not be empty. Please type or paste script text before generating speech.');
      return;
    }

    // 2. Text should have a maximum length
    if (textToSynthesize.length > 5000) {
      setError('Text exceeds the maximum allowed length of 5,000 characters per request.');
      return;
    }

    // 3. Unsupported characters should be handled appropriately
    const cleanText = textToSynthesize
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
      .replace(/[\u200B-\u200D\uFEFF\u202A-\u202E]/g, '')
      .normalize('NFC')
      .trim();

    if (!cleanText || !/[\p{L}\p{N}]/u.test(cleanText)) {
      setError('Text contains only unsupported symbols or unprintable characters. Please enter speakable words or text.');
      return;
    }

    if (!selectedVoice) {
      setError('Please select a voice from the target voice dropdown.');
      return;
    }

    setIsGenerating(true);
    setError(null);


    try {
      const res = await ttsApi.generateSpeech({
        text: textToSynthesize,
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.name,
        provider: selectedVoice.provider || 'elevenlabs',
        format: voiceSettings.format,
        settings: {
          stability: voiceSettings.stability,
          similarity_boost: voiceSettings.similarity_boost,
          speed: voiceSettings.speed,
          pitch: voiceSettings.pitch,
        },
      });

      if (res.success && res.data) {
        const newAudio = {
          id: res.data.generationId || `gen_${Date.now()}`,
          audio_url: res.data.audioUrl,
          audioUrl: res.data.audioUrl,
          duration_seconds: res.data.durationSeconds,
          durationSeconds: res.data.durationSeconds,
          character_count: res.data.characterCount,
          characterCount: res.data.characterCount,
          provider: res.data.provider,
          voice_name: selectedVoice.name,
          voiceName: selectedVoice.name,
          text_content: textToSynthesize,
          text: textToSynthesize,
          format: voiceSettings.format || res.data.format || 'mp3',
          created_at: new Date().toISOString(),
        };
        setActiveAudio(newAudio);
        setHistory((prev) => {
          const updated = [newAudio, ...prev.filter((i) => i.id !== newAudio.id)];
          saveLocalHistory(updated);
          return updated;
        });
        setQuota((prev) => ({
          ...prev,
          charactersUsed: prev.charactersUsed + textToSynthesize.length,
          charactersRemaining: Math.max(0, prev.charactersRemaining - textToSynthesize.length),
        }));
        fetchUsage(); // Refresh quota balance
        fetchHistory(); // Sync backend history
      }
    } catch (err) {
      setError(err.message || 'Speech generation failed. Please check backend server.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <TtsContext.Provider
      value={{
        text,
        setText,
        voices,
        selectedVoice,
        setSelectedVoice,
        voiceSettings,
        setVoiceSettings,
        isGenerating,
        activeAudio,
        setActiveAudio,
        isPlaying,
        setIsPlaying,
        history,
        quota,
        error,
        setError,
        generateSpeech,
        fetchVoices,
        fetchUsage,
        fetchHistory,
      }}
    >
      {children}
    </TtsContext.Provider>
  );
};

export const useTtsContext = () => {
  const context = useContext(TtsContext);
  if (!context) {
    throw new Error('useTtsContext must be used within a TtsProvider');
  }
  return context;
};
