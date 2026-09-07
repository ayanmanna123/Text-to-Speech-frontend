import React, { createContext, useContext, useState, useEffect } from 'react';
import { voiceApi } from '../api/voiceApi';
import { ttsApi } from '../api/ttsApi';
import { usageApi } from '../api/usageApi';
import { DEFAULT_VOICE_SETTINGS } from '../utils/constants';

const TtsContext = createContext(null);

export const TtsProvider = ({ children }) => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceSettings, setVoiceSettings] = useState(DEFAULT_VOICE_SETTINGS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAudio, setActiveAudio] = useState(null);
  const [history, setHistory] = useState([]);
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
      if (res.success && res.data) {
        setVoices(res.data);
        if (!selectedVoice && res.data.length > 0) {
          // Default to first ElevenLabs voice or first voice in list
          const defaultV = res.data.find((v) => v.provider === 'elevenlabs') || res.data[0];
          setSelectedVoice(defaultV);
        }
      }
    } catch (err) {
      console.error('Failed to load voices:', err);
    }
  };

  const fetchUsage = async () => {
    try {
      const res = await usageApi.getUserBalance();
      if (res.success && res.data) {
        setQuota(res.data);
      }
    } catch (err) {
      console.error('Failed to load credit quota:', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await ttsApi.getHistory();
      if (res.success && res.data) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const generateSpeech = async (overrideText = null) => {
    const textToSynthesize = overrideText || text;
    if (!textToSynthesize.trim()) {
      setError('Please enter text to synthesize.');
      return;
    }
    if (!selectedVoice) {
      setError('Please select a voice.');
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
          audioUrl: res.data.audioUrl,
          durationSeconds: res.data.durationSeconds,
          characterCount: res.data.characterCount,
          provider: res.data.provider,
          voiceName: selectedVoice.name,
          text: textToSynthesize,
          createdAt: new Date().toISOString(),
        };
        setActiveAudio(newAudio);
        fetchUsage(); // Refresh quota balance
        fetchHistory(); // Refresh history list
      }
    } catch (err) {
      setError(err.message || 'Speech generation failed. Please try again.');
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
