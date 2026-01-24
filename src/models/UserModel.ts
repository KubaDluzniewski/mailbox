export enum UserRole {
  ADMIN = 'ADMIN',
  LECTURER = 'LECTURER',
  STUDENT = 'STUDENT',
}

export interface UserModel {
  id: number;
  email: string;
  name: string;
  surname: string;
  isActive: boolean;
  roles: UserRole[];
}
