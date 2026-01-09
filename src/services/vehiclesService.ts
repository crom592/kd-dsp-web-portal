import api from './api';
import { Vehicle, PaginatedResponse } from '@/types';

interface GetVehiclesParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export const vehiclesService = {
  getVehicles: async (params: GetVehiclesParams): Promise<PaginatedResponse<Vehicle>> => {
    const response = await api.get('/vehicles', { params });
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

  getVehicle: async (id: string): Promise<Vehicle> => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (data: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await api.post('/vehicles', data);
    return response.data;
  },

  updateVehicle: async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },
};
