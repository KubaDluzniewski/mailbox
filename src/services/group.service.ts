import http from './http';
import type { GroupModel } from '../models/GroupModel';
import { useToastStore } from '../store/toast';
import { i18n } from '../utils/i18n';

export async function getGroupsSuggestions(name: string): Promise<GroupModel[]> {
  try {
    const response = await http.get<GroupModel[]>('groups/suggestions', { params: { name: name } });
    return response.data;
  } catch (error) {
    throw new Error(String(i18n.global.t('compose.sentError')));
  }
}