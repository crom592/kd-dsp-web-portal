import api from './api';
import { User, PaginatedResponse } from '@/types';

interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  companyId?: string;
}

export const usersService = {
  getUsers: async (params: GetUsersParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users', { params });
    // Transform backend response format to frontend expected format
    const backendData = response.data;
    return {
      data: backendData.items || backendData.data || [],
      meta: backendData.meta || {
        total: backendData.total || backendData.items?.length || 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil((backendData.total || backendData.items?.length || 0) / (params.limit || 10)),
      },
    };
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: Partial<User>): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
