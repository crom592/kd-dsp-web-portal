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
    return response.data;
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
