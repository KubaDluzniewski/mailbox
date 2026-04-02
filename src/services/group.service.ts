import http from './http';
import type { GroupModel } from '../models/GroupModel';
import { i18n } from '../utils/i18n';
import type { UserModel } from '../models/UserModel';

export async function getGroupsSuggestions(name: string): Promise<GroupModel[]> {
  try {
    const response = await http.get<GroupModel[]>('groups/suggestions', { params: { name: name } });
    return response.data;
  } catch (error) {
    throw new Error(String(i18n.global.t('compose.sentError')));
  }
}

export interface GroupDetailModel {
  id: number;
  name: string;
  members: UserModel[];
  memberCount: number;
}

export interface UpdateGroupDto {
  name: string;
  userIds: number[];
}

export async function getAllGroups(): Promise<GroupDetailModel[]> {
  const response = await http.get<GroupDetailModel[]>('groups');
  return response.data;
}

export async function updateGroup(id: number, dto: UpdateGroupDto): Promise<GroupDetailModel> {
  const response = await http.put<GroupDetailModel>(`groups/${id}`, dto);
  return response.data;
}