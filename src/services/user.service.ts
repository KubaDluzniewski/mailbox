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

export async function getCurrentUser(): Promise<UserDetailModel> {
  try {
    const response = await http.get<UserDetailModel>('users/me');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch current user', error);
    throw error;
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

export async function getPasswordChangedAt(): Promise<Date | null> {
  try {
    const response = await http.get<{ passwordChangedAt: string | null }>(
      'users/password-changed-at'
    );
    return response.data.passwordChangedAt ? new Date(response.data.passwordChangedAt) : null;
  } catch {
    return null;
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
  roles: string[];
  isActive: boolean;
}

export interface UpdateUserDto {
  name?: string;
  surname?: string;
  email?: string;
  roles?: string[];
  isActive?: boolean;
}

function extractErrorMessage(error: any, defaultMsg: string): string {
  const errorData = error?.response?.data;

  if (!errorData) return defaultMsg;

  if (typeof errorData === 'string') {
    return errorData;
  }

  if (errorData.title) {
    let msg = errorData.title;
    if (errorData.errors) {
      const errorMessages = Object.values(errorData.errors).flat() as string[];
      if (errorMessages.length > 0) {
        msg += ': ' + errorMessages.join(', ');
      }
    }
    return msg;
  }

  return defaultMsg;
}

export async function getAllUsers(): Promise<UserDetailModel[]> {
  try {
    const response = await http.get<UserDetailModel[]>('users');
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, 'Failed to fetch users'));
  }
}

export async function createUser(dto: CreateUserDto): Promise<UserDetailModel> {
  try {
    const response = await http.post<UserDetailModel>('users', dto);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, 'Failed to create user'));
  }
}

export async function updateUser(id: number, dto: UpdateUserDto): Promise<UserDetailModel> {
  try {
    const response = await http.put<UserDetailModel>(`users/${id}`, dto);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, 'Failed to update user'));
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await http.delete(`users/${id}`);
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, 'Failed to delete user'));
  }
}

export async function toggleUserStatus(id: number): Promise<void> {
  try {
    await http.post(`users/${id}/toggle-status`);
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, 'Failed to toggle user status'));
  }
}

export type { UserModel };
