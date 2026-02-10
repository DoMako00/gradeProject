import axios from 'axios';
import { authStore } from '../store';
import { supabase } from '../lib/supabase';

const baseURL =
  (typeof process !== 'undefined' &&
    process.env?.EXPO_PUBLIC_API_URL) ||
  'https://api.autoassist.example.com';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = authStore.getState().user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await supabase.auth.signOut();
      authStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
