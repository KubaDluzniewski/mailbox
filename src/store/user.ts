import { defineStore } from 'pinia';
import type { UserModel } from '../models/UserModel';

function decodeJwt<T = any>(token: string): T | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4 ? '='.repeat(4 - (base64.length % 4)) : '';
    const json = atob(base64 + pad);
    const decoded = JSON.parse(json);
    console.log('Decoded JWT:', decoded);
    return decoded;
  } catch (e) {
    console.error('Error decoding JWT:', e);
    return null;
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    tokenExp: null as number | null,
    _logoutTimer: null as number | null,
    user: null as UserModel | null,
  }),
  actions: {
    setToken(token: string | null) {
      this.clearLogoutTimer();
      this.token = token;
      if (token) {
        localStorage.setItem('token', token);
        const payload = decodeJwt<{ exp?: number; sub?: string; email?: string; name?: string; surname?: string; isActive?: string }>(token);
        console.log('Decoded payload:', payload);
        this.tokenExp = typeof payload?.exp === 'number' ? payload.exp : null;
        if (payload) {
          this.user = {
            id: parseInt(payload.sub || '0'),
            email: payload.email || '',
            name: payload.name || '',
            surname: payload.surname || '',
            isActive: payload.isActive === 'True'
          };
          console.log('Set user:', this.user);
        }
        this.scheduleAutoLogout();
      } else {
        localStorage.removeItem('token');
        this.tokenExp = null;
        this.user = null;
      }
    },
    setUser(user: UserModel | null) {
      this.user = user;
    },
    logout() {
      this.clearLogoutTimer();
      this.token = null;
      this.tokenExp = null;
      this.user = null;
      localStorage.removeItem('token');
    },
    initFromStorage() {
      const saved = localStorage.getItem('token');
      console.log('Saved token:', saved);
      if (saved) this.setToken(saved);
      if (this.isTokenExpired) this.logout();
    },
    scheduleAutoLogout() {
      if (!this.tokenExp) return;
      const skewMs = 5000;
      const ttl = this.tokenExp * 1000 - Date.now() - skewMs;
      if (ttl <= 0) {
        this.logout();
        return;
      }
      this._logoutTimer = window.setTimeout(() => this.logout(), ttl);
    },
    clearLogoutTimer() {
      if (this._logoutTimer) {
        clearTimeout(this._logoutTimer);
        this._logoutTimer = null;
      }
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token && !((state.tokenExp ?? 0) * 1000 <= Date.now()),
    isTokenExpired: (state) => !state.token || (state.tokenExp ?? 0) * 1000 <= Date.now(),
  },
});
