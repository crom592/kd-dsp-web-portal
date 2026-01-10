import api from './api';
import { RouteStop, PaginatedResponse } from '@/types';

interface GetStopsParams {
  page?: number;
  limit?: number;
  search?: string;
  routeId?: string;
}

// Transform backend stop data to frontend RouteStop type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformStop = (backendStop: any): RouteStop => ({
  id: backendStop.id,
  routeId: backendStop.routeId,
  name: backendStop.stopName || backendStop.name,
  address: backendStop.address,
  latitude: backendStop.latitude,
  longitude: backendStop.longitude,
  sequence: backendStop.sequence,
  arrivalTime: backendStop.arrivalTime,
  departureTime: backendStop.departureTime,
});

export const stopsService = {
  getStops: async (params: GetStopsParams): Promise<PaginatedResponse<RouteStop>> => {
    const response = await api.get('/stops', { params });
    const backendData = response.data.data || response.data;
    const items = backendData.items || backendData.data || [];
    return {
      data: items.map(transformStop),
      meta: backendData.meta || backendData.pagination || {
        total: backendData.total || items.length || 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil((backendData.total || items.length || 0) / (params.limit || 10)),
      },
    };
  },

  getStop: async (id: string): Promise<RouteStop> => {
    const response = await api.get(`/stops/${id}`);
    const data = response.data.data || response.data;
    return transformStop(data);
  },

  createStop: async (data: Partial<RouteStop>): Promise<RouteStop> => {
    const response = await api.post('/stops', data);
    const resData = response.data.data || response.data;
    return transformStop(resData);
  },

  updateStop: async (id: string, data: Partial<RouteStop>): Promise<RouteStop> => {
    const response = await api.put(`/stops/${id}`, data);
    const resData = response.data.data || response.data;
    return transformStop(resData);
  },

  deleteStop: async (id: string): Promise<void> => {
    await api.delete(`/stops/${id}`);
  },
};
