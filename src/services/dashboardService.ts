import api from './api';
import { DashboardStats } from '@/types';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/stats/dashboard');
    return response.data;
  },
};
