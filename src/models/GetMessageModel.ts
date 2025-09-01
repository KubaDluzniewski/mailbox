import type { UserModel } from './UserModel';

export interface MessageRecipientModel {
  userId: number;
}

export interface GetMessageModel {
  subject: string;
  recipients: MessageRecipientModel[];
  body: string;
  sentDate: Date;
  sender: UserModel;
}
