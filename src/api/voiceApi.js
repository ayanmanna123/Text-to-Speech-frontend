import { apiClient } from './client';

export const voiceApi = {
  getVoices: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiClient(`/voices${query ? `?${query}` : ''}`);
  },
  getVoicePreview: async (data) => {
    return await apiClient('/voices/preview', {
      method: 'POST',
      body: data,
    });
  },
};


