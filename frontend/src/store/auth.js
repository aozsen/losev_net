import { defineStore } from 'pinia'
import { api } from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
  },
  actions: {
    async login(email, password) {
      try {
        const { access_token } = await api.post('/auth/login', { email, password });
        this.token = access_token;
        localStorage.setItem('token', access_token);

        // Fetch profile immediately after login
        const profile = await this.fetchProfile();
        return profile;
      } catch (error) {
        this.logout();
        console.error('Login action failed:', error);
        throw error;
      }
    },

    async register(userData) {
      try {
        return await api.post('/auth/register', userData);
      } catch (error) {
        console.error('Register action failed:', error);
        throw error;
      }
    },

    async fetchProfile() {
      if (!this.token) {
        this.logout();
        throw new Error('No token found');
      }

      try {
        const profile = await api.get('/users/profile');
        this.user = profile;
        localStorage.setItem('user', JSON.stringify(profile));
        return profile;
      } catch (error) {
        console.error('Fetch profile failed:', error);
        if (error.status === 401) {
          this.logout();
        }
        throw error;
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      console.log('Logged out');
    }
  }
})
