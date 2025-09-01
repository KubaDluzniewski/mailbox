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
