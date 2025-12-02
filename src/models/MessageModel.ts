import type { Recipient } from '../types/vicons';

export interface MessageModel {
  subject: string;
  recipients: Recipient[];
  body: string;
}