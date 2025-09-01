import axios from 'axios';
import router from '../router';
import { useUserStore } from '../store/user';

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5128/api';
const http = axios.create({ baseURL });

// Ścieżki niewymagające JWT – dostosuj do swojego API
const PUBLIC_PATHS = ['/auth/login', '/auth/refresh'];

function isPublicRequest(url?: string): boolean {
  if (!url) return false;
  // config.url może być względne lub absolutne
  const path = url.startsWith('http') ? new URL(url).pathname : url;
  return PUBLIC_PATHS.some((p) => path.startsWith(p));
}

// Attach Authorization header jeśli token jest, ale nie blokuj publicznych żądań
http.interceptors.request.use((config) => {
  const userStore = useUserStore();

  // Synchronizacja z localStorage (gdy ktoś ręcznie skasuje/podmieni token)
  const lsToken = localStorage.getItem('token');
  if (userStore.token !== lsToken) {
    userStore.setToken(lsToken);
  }

  const token = userStore.token;

  // Dopuść publiczne endpointy bez tokena
  if (!token) {
    if (isPublicRequest(config.url)) {
      return config;
    }
    // Brak tokena dla endpointu wymagającego autoryzacji
    if (router.currentRoute.value.name !== 'login') {
      router.push({ name: 'login' });
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
    if (status === 401 || status === 403) {
      const userStore = useUserStore();
      userStore.logout();
      if (router.currentRoute.value.name !== 'login') {
        await router.push({ name: 'login' });
      }
    }
    return Promise.reject(error);
  }
);

export default http;
