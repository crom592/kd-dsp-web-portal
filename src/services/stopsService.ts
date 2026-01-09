import api from './api';
import { RouteStop, PaginatedResponse } from '@/types';

interface GetStopsParams {
  page?: number;
  limit?: number;
  search?: string;
  routeId?: string;
}

export const stopsService = {
  getStops: async (params: GetStopsParams): Promise<PaginatedResponse<RouteStop>> => {
    const response = await api.get('/stops', { params });
    return response.data;
  },

  getStop: async (id: string): Promise<RouteStop> => {
    const response = await api.get(`/stops/${id}`);
    return response.data;
  },

  createStop: async (data: Partial<RouteStop>): Promise<RouteStop> => {
    const response = await api.post('/stops', data);
    return response.data;
  },

  updateStop: async (id: string, data: Partial<RouteStop>): Promise<RouteStop> => {
    const response = await api.put(`/stops/${id}`, data);
    return response.data;
  },

  deleteStop: async (id: string): Promise<void> => {
    await api.delete(`/stops/${id}`);
  },
};
