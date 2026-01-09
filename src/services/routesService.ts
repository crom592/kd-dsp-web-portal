import api from './api';
import { Route, PaginatedResponse } from '@/types';

interface GetRoutesParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  companyId?: string;
}

export const routesService = {
  getRoutes: async (params: GetRoutesParams): Promise<PaginatedResponse<Route>> => {
    const response = await api.get('/routes', { params });
    return response.data;
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
