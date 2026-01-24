import http from './http';
import type { MessageModel } from '../models/MessageModel';
import { useToastStore } from '../store/toast';
import { i18n } from '../utils/i18n';

export async function sendMessage(messageModel: MessageModel): Promise<void> {
  try {
    const response = await http.post('/message/send', messageModel);
    useToastStore().push('success', i18n.global.t('compose.sentSuccess') as string);
  } catch (error) {
    useToastStore().push('error', i18n.global.t('compose.sentError') as string);
    throw new Error(String(i18n.global.t('compose.sentError')));
  }
}

export async function getMessages(): Promise<MessageModel[]> {
  try {
    const response = await http.get<MessageModel[]>('/message');
    return response.data;
  } catch (error) {
    useToastStore().push('error', i18n.global.t('errors.fetchMessages') as string);
    throw new Error(String(i18n.global.t('errors.fetchMessages')));
  }
}

export async function getSentMessages(): Promise<MessageModel[]> {
  try {
    const response = await http.get<MessageModel[]>('/message/sent');
    return response.data;
  } catch (error) {
    useToastStore().push('error', i18n.global.t('errors.fetchSent') as string);
    throw new Error(String(i18n.global.t('errors.fetchSent')));
  }
}

export async function saveDraft(messageModel: MessageModel): Promise<MessageModel> {
  try {
    const response = await http.post<MessageModel>('/message/draft', messageModel);
    useToastStore().push('success', i18n.global.t('compose.draftSaved') as string);
    return response.data;
  } catch (error) {
    useToastStore().push('error', i18n.global.t('compose.draftSaveError') as string);
    throw new Error(String(i18n.global.t('compose.draftSaveError')));
  }
}

export async function updateDraft(messageModel: MessageModel): Promise<MessageModel> {
  try {
    const response = await http.put<MessageModel>(
      `/message/draft/${messageModel.id}`,
      messageModel
    );
    useToastStore().push('success', i18n.global.t('compose.draftUpdated') as string);
    return response.data;
  } catch (error) {
    useToastStore().push('error', i18n.global.t('compose.draftUpdateError') as string);
    throw new Error(String(i18n.global.t('compose.draftUpdateError')));
  }
}

export async function getDrafts(): Promise<MessageModel[]> {
  try {
    const response = await http.get<MessageModel[]>('/message/drafts');
    return response.data;
  } catch (error) {
    useToastStore().push('error', i18n.global.t('compose.draftListError') as string);
    throw new Error(String(i18n.global.t('compose.draftListError')));
  }
}

export async function deleteDraft(id: number): Promise<void> {
  try {
    await http.delete(`/message/draft/${id}`);
    useToastStore().push('success', i18n.global.t('compose.draftDeleted') as string);
  } catch (error) {
    useToastStore().push('error', i18n.global.t('compose.draftDeleteError') as string);
    throw new Error(String(i18n.global.t('compose.draftDeleteError')));
  }
}

export async function markAsRead(messageId: number): Promise<void> {
  try {
    await http.put(`message/${messageId}/read`);
  } catch (error) {
    useToastStore().push('error', i18n.global.t('errors.markAsRead') as string);
    throw new Error(String(i18n.global.t('errors.markAsRead')));
  }
}

export async function markAsUnread(messageId: number): Promise<void> {
  try {
    await http.put(`message/${messageId}/unread`);
  } catch (error) {
    useToastStore().push('error', i18n.global.t('errors.markAsUnread') as string);
    throw new Error(String(i18n.global.t('errors.markAsUnread')));
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const response = await http.get<{ count: number }>('message/unread-count');
    return response.data.count;
  } catch (error) {
    return 0;
  }
}

export async function getAllMessages(): Promise<MessageModel[]> {
  try {
    const response = await http.get<MessageModel[]>('/message/admin/all');
    return response.data;
  } catch (error) {
    useToastStore().push('error', 'Nie udało się pobrać historii wiadomości');
    throw new Error('Failed to fetch message history');
  }
}
