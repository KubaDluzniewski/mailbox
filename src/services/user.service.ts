import type { UserModel } from '../models/UserModel';
import { useToastStore } from '../store/toast';
import { i18n } from '../utils/i18n';
import http from './http';


export async function getUserSuggestions(name: string): Promise<UserModel[]> {
  try {
    const response = await http.get<UserModel[]>('users/getSuggestion', { params: { name } });
    return response.data;
  } catch (error) {
    throw new Error(String(i18n.global.t('compose.sentError')));
  }
}
// Re-eksport typu aby volar/TS poprawnie widział moduł z typami
export type { UserModel };
