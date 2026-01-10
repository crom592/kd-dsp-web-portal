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

// Transform backend route data to frontend Route type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformRoute = (backendRoute: any): Route => ({
  id: backendRoute.id,
  name: backendRoute.routeName || backendRoute.name,
  code: backendRoute.id?.substring(0, 8).toUpperCase() || '', // Generate code from ID if not present
  companyId: backendRoute.companyId,
  company: backendRoute.company,
  type: backendRoute.routeType || backendRoute.type || 'COMMUTE',
  status: backendRoute.status || 'ACTIVE',
  stops: backendRoute.stops || [],
  createdAt: backendRoute.createdAt,
  updatedAt: backendRoute.updatedAt,
});

export const routesService = {
  getRoutes: async (params: GetRoutesParams): Promise<PaginatedResponse<Route>> => {
    const response = await api.get('/routes', { params });
    const backendData = response.data.data || response.data;
    const items = backendData.items || backendData.data || [];
    return {
      data: items.map(transformRoute),
      meta: backendData.pagination || backendData.meta || {
        total: backendData.total || items.length || 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil((backendData.total || items.length || 0) / (params.limit || 10)),
      },
    };
  },

  getRoute: async (id: string): Promise<Route> => {
    const response = await api.get(`/routes/${id}`);
    const data = response.data.data || response.data;
    return transformRoute(data);
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
