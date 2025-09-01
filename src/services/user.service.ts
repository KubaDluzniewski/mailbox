import type { UserModel } from '../models/UserModel';
import http from './http';

export async function searchUsersBySurname(term: string): Promise<UserModel[]> {
  const q = term.trim();
  if (!q) return [];
  const res = await http.get<UserModel[]>(`/users`, {
    params: { surname: q },
  });
  return res.data;
}

// Re-eksport typu aby volar/TS poprawnie widział moduł z typami
export type { UserModel };
