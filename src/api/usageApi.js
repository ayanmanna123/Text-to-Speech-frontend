import { apiClient } from './client';

export const usageApi = {
  getUserBalance: async () => {
    return await apiClient('/usage/balance');
  },
};
