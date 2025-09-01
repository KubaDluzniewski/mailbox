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
