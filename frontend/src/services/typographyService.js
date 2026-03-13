import { api } from './api';

export const typographyService = {
  // Get user typography
  async get() {
    const response = await api.get('/typography');
    return response.data.typography;
  },

  // Get default typography
  async getDefault() {
    const response = await api.get('/typography/default');
    return response.data.typography;
  },

  // Save typography
  async save(data) {
    const response = await api.post('/typography', data);
    return response.data.typography;
  },

  // Save to localStorage (client-side only)
  saveLocal(data) {
    localStorage.setItem('local_typography', JSON.stringify(data));
    return data;
  },

  // Get local typography
  getLocal() {
    const stored = localStorage.getItem('local_typography');
    return stored ? JSON.parse(stored) : null;
  },

  // Upload font file
  async uploadFont(file) {
    const formData = new FormData();
    formData.append('font', file);
    
    const response = await api.post('/typography/fonts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data;
  }
};