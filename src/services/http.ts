import axios from 'axios';
import router from '../router';
import { useUserStore } from '../store/user';

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5128/api';
const http = axios.create({ baseURL });

// Ścieżki niewymagające JWT – dostosuj do swojego API
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/activate',
  '/auth/confirm',
  '/auth/isActive',
  '/auth/register',
];

function isPublicRequest(url?: string): boolean {
  if (!url) return false;
  // config.url może być względne lub absolutne
  const path = url.startsWith('http') ? new URL(url).pathname : url;
  return PUBLIC_PATHS.some((p) => path.startsWith(p));
}

// Attach Authorization header jeśli token jest, ale nie blokuj publicznych żądań
http.interceptors.request.use((config) => {
  const userStore = useUserStore();

  // Synchronizacja z localStorage/sessionStorage (gdy ktoś ręcznie skasuje/podmieni token)
  const lsToken = localStorage.getItem('token');
  const ssToken = sessionStorage.getItem('token');
  const storedToken = lsToken || ssToken;

  if (userStore.token !== storedToken) {
    userStore.setToken(storedToken, !!lsToken); // remember = true if from localStorage
  }

  const token = userStore.token;

  // Dopuść publiczne endpointy bez tokena
  if (!token) {
    if (isPublicRequest(config.url)) {
      return config;
    }
    // Brak tokena dla endpointu wymagającego autoryzacji
    if (router.currentRoute.value.name !== 'Login') {
      router.push({ name: 'Login' });
    }
    return Promise.reject(new Error('Unauthorized'));
  }

  // Token obecny → dołącz nagłówek
  config.headers = config.headers ?? {};
  (config.headers as any).Authorization = `Bearer ${token}`;
  return config;
});

// Globalna obsługa 401/403
http.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url;

    // Ignore auth endpoints from global handling
    if (url && (url.includes('/auth/login') || url.includes('/auth/register'))) {
      return Promise.reject(error);
    }

    if (status === 401 || status === 403) {
      const userStore = useUserStore();
      userStore.logout();
      if (router.currentRoute.value.name !== 'Login') {
        await router.push({ name: 'Login' });
      }
    }
    return Promise.reject(error);
  }
);

export default http;
