import api from './api';
import { Driver, PaginatedResponse } from '@/types';

interface GetDriversParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export const driversService = {
  getDrivers: async (params: GetDriversParams): Promise<PaginatedResponse<Driver>> => {
    const response = await api.get('/drivers', { params });
    return response.data;
  },

  getDriver: async (id: string): Promise<Driver> => {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
  },

  createDriver: async (data: Partial<Driver>): Promise<Driver> => {
    const response = await api.post('/drivers', data);
    return response.data;
  },

  updateDriver: async (id: string, data: Partial<Driver>): Promise<Driver> => {
    const response = await api.put(`/drivers/${id}`, data);
    return response.data;
  },

  deleteDriver: async (id: string): Promise<void> => {
    await api.delete(`/drivers/${id}`);
  },
};
