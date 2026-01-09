import { post, get } from './api';
import { STORAGE_KEYS } from '@/constants';
import type { LoginRequest, LoginResponse, User } from '@/types';

export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await post<LoginResponse>('/auth/login', credentials);

    // Store tokens and user data
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

    return response;
  },

  /**
   * Logout - Clear all auth data
   */
  logout: async (): Promise<void> => {
    try {
      await post('/auth/logout');
    } catch (error) {
      // Ignore logout errors - still clear local data
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    return get<User>('/auth/profile');
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<{ accessToken: string; refreshToken: string }> => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      refreshToken,
    });

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);

    return response;
  },

  /**
   * Get stored access token
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser: (): User | null => {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await post('/auth/change-password', { currentPassword, newPassword });
  },
};

export default authService;
