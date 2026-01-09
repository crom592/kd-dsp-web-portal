import api from './api';
import { Reservation, PaginatedResponse } from '@/types';

interface GetReservationsParams {
  page?: number;
  limit?: number;
  status?: string;
  routeId?: string;
  userId?: string;
  date?: string;
}

export const reservationsService = {
  getReservations: async (params: GetReservationsParams): Promise<PaginatedResponse<Reservation>> => {
    const response = await api.get('/reservations', { params });
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

  getReservation: async (id: string): Promise<Reservation> => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  cancelReservation: async (id: string): Promise<Reservation> => {
    const response = await api.patch(`/reservations/${id}/cancel`);
    return response.data;
  },

  getAvailability: async (routeId: string, date: string): Promise<{ available: number; total: number }> => {
    const response = await api.get('/reservations/availability', {
      params: { routeId, date },
    });
    return response.data;
  },
};
