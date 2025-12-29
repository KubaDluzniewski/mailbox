import http from './http';
import router from '../router';
import { useUserStore } from '../store/user';
import { useToastStore } from '../store/toast';

export async function login(email: string, password: string): Promise<void> {
  try {
    const userStore = useUserStore();
    const toast = useToastStore();
    const response = await http.post('/auth/login', { email, password });
    const token = response.data.token;
    userStore.setToken(token);
    await router.push('/');
    toast.push('success', 'Zalogowano pomyślnie');
  } catch (error) {
    useToastStore().push('error', 'Błąd podczas logowania');
    throw new Error('Błąd podczas logowania');
  }
}

export async function activate(email: string): Promise<void> {
  await http.post('/auth/activate',  { email } );
}

export async function isActive(email: string): Promise<boolean> {
  const response = await http.put('/auth/isActive', { email });
  return response.data;
}

export async function confirm(email: string, token: string): Promise<void> {
  await http.post('/auth/confirm', { email, token });
}
