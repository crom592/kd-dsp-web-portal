import api from './api';
import { Reservation, PaginatedResponse } from '@/types';

interface GetReservationsParams {
  page?: number;
  limit?: number;
  status?: string;
  routeId?: string;
  userId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}

// Transform backend reservation data to frontend Reservation type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformReservation = (backendRes: any): Reservation => ({
  id: backendRes.id,
  userId: backendRes.userId,
  user: backendRes.user,
  routeId: backendRes.routeId,
  route: backendRes.route
    ? {
        ...backendRes.route,
        name: backendRes.route.routeName || backendRes.route.name,
        type: backendRes.route.routeType || backendRes.route.type || 'COMMUTE',
      }
    : undefined,
  tripId: backendRes.tripId,
  boardingStopId: backendRes.boardingStopId,
  boardingStop: backendRes.boardingStop
    ? {
        ...backendRes.boardingStop,
        name: backendRes.boardingStop.stopName || backendRes.boardingStop.name,
      }
    : undefined,
  alightingStopId: backendRes.alightingStopId,
  alightingStop: backendRes.alightingStop
    ? {
        ...backendRes.alightingStop,
        name: backendRes.alightingStop.stopName || backendRes.alightingStop.name,
      }
    : undefined,
  status: backendRes.status,
  reservationDate: backendRes.boardingDate || backendRes.reservationDate,
  createdAt: backendRes.createdAt,
});

export const reservationsService = {
  getReservations: async (params: GetReservationsParams): Promise<PaginatedResponse<Reservation>> => {
    const response = await api.get('/reservations', { params });
    const backendData = response.data.data || response.data;
    const items = backendData.items || backendData.data || [];
    return {
      data: items.map(transformReservation),
      meta: backendData.pagination || backendData.meta || {
        total: backendData.total || items.length || 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil((backendData.total || items.length || 0) / (params.limit || 10)),
      },
    };
  },

  getReservation: async (id: string): Promise<Reservation> => {
    const response = await api.get(`/reservations/${id}`);
    const data = response.data.data || response.data;
    return transformReservation(data);
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
