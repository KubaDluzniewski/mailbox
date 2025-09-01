import { defineStore } from 'pinia';

function decodeJwt<T = any>(token: string): T | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4 ? '='.repeat(4 - (base64.length % 4)) : '';
    const json = atob(base64 + pad);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    tokenExp: null as number | null,
    _logoutTimer: null as number | null,
  }),
  actions: {
    setToken(token: string | null) {
      this.clearLogoutTimer();
      this.token = token;
      if (token) {
        localStorage.setItem('token', token);
        const payload = decodeJwt<{ exp?: number }>(token);
        this.tokenExp = typeof payload?.exp === 'number' ? payload.exp : null;
        this.scheduleAutoLogout();
      } else {
        localStorage.removeItem('token');
        this.tokenExp = null;
      }
    },
    logout() {
      this.clearLogoutTimer();
      this.token = null;
      this.tokenExp = null;
      localStorage.removeItem('token');
    },
    initFromStorage() {
      const saved = localStorage.getItem('token');
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
