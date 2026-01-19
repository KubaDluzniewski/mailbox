import type { Recipient } from '../types/vicons';

export interface UserInfo {
  id: number;
  name: string;
  surname: string;
  email: string;
}

export interface MessageModel {
  id?: number;
  subject: string;
  recipients: Recipient[];
  body: string;
  isDraft?: boolean;
  createdAt?: string | Date;
  isRead?: boolean;
  readAt?: string | Date;
  sender?: UserInfo;
  sentDate?: string | Date;
  recipientCount?: number;
}
