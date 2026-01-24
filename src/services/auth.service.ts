export async function changeEmail(newEmail: string, currentPassword: string): Promise<void> {
  await http.post('/users/change-email', { newEmail, currentPassword });
}
import http from './http';
import router from '../router';
import { useUserStore } from '../store/user';
import { useToastStore } from '../store/toast';

export async function login(
  email: string,
  password: string,
  remember: boolean = false
): Promise<void> {
  try {
    const userStore = useUserStore();
    const toast = useToastStore();
    const response = await http.post('/auth/login', { email, password });
    const token = response.data.token;
    userStore.setToken(token, remember);
    await router.push('/');
    toast.push('success', 'Zalogowano pomyślnie');
  } catch (error) {
    useToastStore().push('error', 'Błąd podczas logowania');
    throw new Error('Błąd podczas logowania');
  }
}

export async function activate(email: string, isEmailChange: boolean): Promise<void> {
  try {
    await http.post('/auth/activate', { email, isEmailChange });
    useToastStore().push('success', 'Wysłano email aktywacyjny/zmieniający adres.');
  } catch (error) {
    useToastStore().push('error', 'Błąd podczas wysyłania emaila.');
    throw error;
  }
}

export async function isActive(email: string): Promise<boolean> {
  const response = await http.put(`/auth/isActive?email=${email}`);
  return response.data;
}

export async function confirm(
  email: string,
  token: string
): Promise<{ message: string; type: string }> {
  const response = await http.post('/auth/confirm', { email, token });
  return response.data;
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  await http.post('/users/change-password', { oldPassword, newPassword });
}

export async function forgotPassword(email: string): Promise<any> {
  const response = await http.post('/auth/forgot-password', { email });
  return response.data;
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string
): Promise<void> {
  await http.post('/auth/reset-password', { email, token, newPassword });
}
