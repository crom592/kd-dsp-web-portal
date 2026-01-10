import api from './api';
import { Driver, PaginatedResponse } from '@/types';

interface GetDriversParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

// Transform backend driver data to frontend Driver type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformDriver = (backendDriver: any): Driver => {
  // Map backend UserStatus to frontend Driver status
  // Backend uses ACTIVE/INACTIVE, frontend expects AVAILABLE/ON_DUTY/OFF_DUTY
  const statusMap: Record<string, string> = {
    'ACTIVE': 'AVAILABLE',
    'INACTIVE': 'OFF_DUTY',
    'SUSPENDED': 'OFF_DUTY',
  };

  return {
    id: backendDriver.id,
    userId: backendDriver.userId,
    user: backendDriver.user || {
      name: backendDriver.name,
      phone: backendDriver.phone,
    },
    licenseNumber: backendDriver.licenseNumber,
    licenseExpiry: backendDriver.licenseExpiry,
    status: statusMap[backendDriver.status] || backendDriver.status || 'AVAILABLE',
  };
};

export const driversService = {
  getDrivers: async (params: GetDriversParams): Promise<PaginatedResponse<Driver>> => {
    const response = await api.get('/drivers', { params });
    const backendData = response.data.data || response.data;
    const items = backendData.items || backendData.data || [];
    return {
      data: items.map(transformDriver),
      meta: backendData.pagination || backendData.meta || {
        total: backendData.total || items.length || 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil((backendData.total || items.length || 0) / (params.limit || 10)),
      },
    };
  },

  getDriver: async (id: string): Promise<Driver> => {
    const response = await api.get(`/drivers/${id}`);
    const data = response.data.data || response.data;
    return transformDriver(data);
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
