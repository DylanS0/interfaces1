import { api } from './api';

export const paletteService = {
  // Get all palettes (user + default)
  async getAll() {
    const response = await api.get('/palettes');
    return response.data;
  },

  // Get single palette
  async getById(id) {
    const response = await api.get(`/palettes/${id}`);
    return response.data.palette;
  },

  // Get default palettes only
  async getDefaults() {
    const response = await api.get('/palettes/default');
    return response.data.palettes;
  },

  // Create new palette
  async create(name, colors, mode = 'light') {
    const response = await api.post('/palettes', { name, colors, mode });
    return response.data.palette;
  },

  // Update palette
  async update(id, data) {
    const response = await api.put(`/palettes/${id}`, data);
    return response.data.palette;
  },

  // Delete palette
  async delete(id) {
    await api.delete(`/palettes/${id}`);
  },

  // Save to localStorage (client-side only)
  saveLocal(name, colors, mode = 'light') {
    const key = `palette_${Date.now()}`;
    const palette = { id: key, name, colors, mode, isLocal: true };
    
    const palettes = JSON.parse(localStorage.getItem('local_palettes') || '[]');
    palettes.push(palette);
    localStorage.setItem('local_palettes', JSON.stringify(palettes));
    
    return palette;
  },

  // Get local palettes
  getLocal() {
    return JSON.parse(localStorage.getItem('local_palettes') || '[]');
  },

  // Delete local palette
  deleteLocal(id) {
    const palettes = this.getLocal().filter(p => p.id !== id);
    localStorage.setItem('local_palettes', JSON.stringify(palettes));
  }
};