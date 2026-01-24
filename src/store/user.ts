import { defineStore } from 'pinia';
import type { UserModel } from '../models/UserModel';
import { UserRole } from '../models/UserModel';
import { getCurrentUser } from '../services/user.service';

function decodeJwt<T = any>(token: string): T | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4 ? '='.repeat(4 - (base64.length % 4)) : '';
    const binaryString = atob(base64 + pad);
    // Convert binary string to UTF-8 to properly decode Polish characters (ł, ż, etc.)
    const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
    const json = new TextDecoder('utf-8').decode(bytes);
    const decoded = JSON.parse(json);
    return decoded;
  } catch (e) {
    return null;
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || sessionStorage.getItem('token') || null,
    tokenExp: null as number | null,
    _logoutTimer: null as number | null,
    user: null as UserModel | null,
  }),
  actions: {
    setToken(token: string | null, remember: boolean = true) {
      this.clearLogoutTimer();
      this.token = token;
      if (token) {
        if (remember) {
          localStorage.setItem('token', token);
          sessionStorage.removeItem('token');
        } else {
          sessionStorage.setItem('token', token);
          localStorage.removeItem('token');
        }

        const payload = decodeJwt<{
          exp?: number;
          sub?: string;
          email?: string;
          name?: string;
          surname?: string;
          isActive?: string;
          roles?: string;
        }>(token);
        this.tokenExp = typeof payload?.exp === 'number' ? payload.exp : null;
        if (payload) {
          const rolesArray = payload.roles
            ? payload.roles
                .split(',')
                .map((r) => r.trim() as UserRole)
                .filter((r) => r)
            : [UserRole.STUDENT];
          this.user = {
            id: parseInt(payload.sub || '0'),
            email: payload.email || '',
            name: payload.name || '',
            surname: payload.surname || '',
            isActive: payload.isActive === 'True',
            roles: rolesArray,
          };
        }
        this.scheduleAutoLogout();
        // Fetch fresh user data from API
        this.fetchCurrentUser();
      } else {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        this.tokenExp = null;
        this.user = null;
      }
    },
    async fetchCurrentUser() {
      if (!this.token) return;
      try {
        const userDetail = await getCurrentUser();
        // Map roles strings to UserRole enum
        const rolesArray = userDetail.roles
          ? userDetail.roles.map((r) => r.trim() as unknown as UserRole).filter((r) => r)
          : [UserRole.STUDENT];

        this.user = {
          id: userDetail.id,
          email: userDetail.email,
          name: userDetail.name,
          surname: userDetail.surname,
          isActive: userDetail.isActive,
          roles: rolesArray,
        };
      } catch (error) {
        console.error('Failed to fetch current user details', error);
        // Optional: logout if 401?
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
      sessionStorage.removeItem('token');
    },
    initFromStorage() {
      const saved = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (saved) this.setToken(saved, !!localStorage.getItem('token')); // Jeśli jest w local, to remember=true
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
    isAdmin: (state) => state.user?.roles?.includes(UserRole.ADMIN) ?? false,
    isLecturer: (state) => state.user?.roles?.includes(UserRole.LECTURER) ?? false,
    isStudent: (state) => state.user?.roles?.includes(UserRole.STUDENT) ?? false,
  },
});
