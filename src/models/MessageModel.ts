import type { Recipient } from '../types/vicons';

export interface MessageModel {
  id?: number;
  subject: string;
  recipients: Recipient[];
  body: string;
  isDraft?: boolean;
  createdAt?: string | Date;
}
