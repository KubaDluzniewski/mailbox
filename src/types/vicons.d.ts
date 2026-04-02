export interface Recipient {
  type: 'user' | 'group';
  id: number;
  displayName: string;
  subtitle?: string;
  email?: string;
  isRead?: boolean;
  readAt?: string | Date;
}

export interface GroupMember {
  id: number;
  email: string;
  name: string;
  surname: string;
}

export interface GroupInfo {
  id: number;
  name: string;
  members: GroupMember[];
  memberCount: number;
}