import { apiClient } from './client';

export const ttsApi = {
  generateSpeech: async ({ text, voiceId, voiceName, provider, format, settings }) => {
    return await apiClient('/tts/generate', {
      method: 'POST',
      body: { text, voiceId, voiceName, provider, format, settings },
    });
  },

  getHistory: async (limit = 20, page = 1) => {
    return await apiClient(`/tts/history?limit=${limit}&page=${page}`);
  },
};
