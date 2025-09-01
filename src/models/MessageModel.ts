export interface MessageRecipientModel {
  userId: number;
}

export interface MessageModel {
  subject: string;
  recipients: MessageRecipientModel[];
  body: string;
}
