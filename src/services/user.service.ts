import type { UserModel } from '../models/UserModel';
import { useToastStore } from '../store/toast';
import { i18n } from '../utils/i18n';
import http from './http';

export async function getUserSuggestions(name: string): Promise<UserModel[]> {
  try {
    const response = await http.get<UserModel[]>('users/getSuggestion', { params: { name } });
    return response.data;
  } catch (error) {
    throw new Error(String(i18n.global.t('compose.sentError')));
  }
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface ChangeEmailDto {
  newEmail: string;
  currentPassword: string;
}

export async function changePassword(dto: ChangePasswordDto): Promise<void> {
  try {
    await http.post('users/change-password', dto);
  } catch (error: any) {
    const msg = error?.response?.data || String(i18n.global.t('settings.changePassword.error'));
    throw new Error(msg);
  }
}

export async function changeEmail(dto: ChangeEmailDto): Promise<void> {
  try {
    await http.post('users/change-email', dto);
  } catch (error: any) {
    const msg = error?.response?.data || String(i18n.global.t('settings.changeEmail.error'));
    throw new Error(msg);
  }
}

// Admin functions
export interface UserDetailModel extends UserModel {
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserDto {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
}

export interface UpdateUserDto {
  name?: string;
  surname?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

export async function getAllUsers(): Promise<UserDetailModel[]> {
  try {
    const response = await http.get<UserDetailModel[]>('users');
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data || 'Failed to fetch users';
    throw new Error(msg);
  }
}

export async function createUser(dto: CreateUserDto): Promise<UserDetailModel> {
  try {
    const response = await http.post<UserDetailModel>('users', dto);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data || 'Failed to create user';
    throw new Error(msg);
  }
}

export async function updateUser(id: number, dto: UpdateUserDto): Promise<UserDetailModel> {
  try {
    const response = await http.put<UserDetailModel>(`users/${id}`, dto);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data || 'Failed to update user';
    throw new Error(msg);
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await http.delete(`users/${id}`);
  } catch (error: any) {
    const msg = error?.response?.data || 'Failed to delete user';
    throw new Error(msg);
  }
}

export async function toggleUserStatus(id: number): Promise<void> {
  try {
    await http.post(`users/${id}/toggle-status`);
  } catch (error: any) {
    const msg = error?.response?.data || 'Failed to toggle user status';
    throw new Error(msg);
  }
}

export type { UserModel };
