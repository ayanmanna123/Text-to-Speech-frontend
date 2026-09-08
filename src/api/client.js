import { API_BASE_URL } from '../utils/constants';

export const apiClient = async (endpoint, options = {}) => {
  const { body, headers, ...customConfig } = options;
  const config = {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...customConfig,
  };

  if (body) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  } else {
    delete config.body;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
};
