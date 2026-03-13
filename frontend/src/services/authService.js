import { api, setApiAccessToken } from './api';

export const authService = {
  async register(payload) {
    const response = await api.post('/auth/register', payload, { auth: false });
    return response.data?.data?.user;
  },

  async login(payload) {
    const response = await api.post('/auth/login', payload, { auth: false });
    const user = response.data?.data?.user;
    const token = response.data?.data?.accessToken;
    setApiAccessToken(token || null);
    return { user, accessToken: token };
  },

  async refresh() {
    const response = await api.post('/auth/refresh', null, { auth: false });
    const user = response.data?.data?.user;
    const token = response.data?.data?.accessToken;
    setApiAccessToken(token || null);
    return { user, accessToken: token };
  },

  async me() {
    const response = await api.get('/auth/me');
    return response.data?.data?.user;
  },

  async logout() {
    try {
      await api.post('/auth/logout', null, { auth: false });
    } finally {
      setApiAccessToken(null);
    }
  }
};
