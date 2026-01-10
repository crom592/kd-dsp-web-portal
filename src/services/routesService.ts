import api from './api';
import { Route, PaginatedResponse } from '@/types';

interface GetRoutesParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  companyId?: string;
  startDate?: string;
  endDate?: string;
}

export const routesService = {
  getRoutes: async (params: GetRoutesParams): Promise<PaginatedResponse<Route>> => {
    const response = await api.get('/routes', { params });
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

  getRoute: async (id: string): Promise<Route> => {
    const response = await api.get(`/routes/${id}`);
    return response.data;
  },

  createRoute: async (data: Partial<Route>): Promise<Route> => {
    const response = await api.post('/routes', data);
    return response.data;
  },

  updateRoute: async (id: string, data: Partial<Route>): Promise<Route> => {
    const response = await api.put(`/routes/${id}`, data);
    return response.data;
  },

  deleteRoute: async (id: string): Promise<void> => {
    await api.delete(`/routes/${id}`);
  },
};
