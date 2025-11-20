import type { Recipient, GroupInfo } from '../types/vicons';
import http from './http';

export async function searchRecipients(query: string): Promise<Recipient[]> {
  const response = await http.get<Recipient[]>(`/users/search?q=${query}`);
  return response.data;
}

export async function getGroupDetails(groupId: number): Promise<GroupInfo> {
  const response = await http.get<GroupInfo>(`/groups/${groupId}`);
  return response.data;
}
