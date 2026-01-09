import api from './api';
import { AnalyticsData } from '@/types';

interface GetAnalyticsParams {
  startDate?: string;
  endDate?: string;
  companyId?: string;
}

export const analyticsService = {
  getAnalytics: async (params: GetAnalyticsParams): Promise<AnalyticsData> => {
    const response = await api.get('/analytics', { params });
    return response.data;
  },

  getRevenueReport: async (params: GetAnalyticsParams): Promise<any> => {
    const response = await api.get('/analytics/revenue', { params });
    return response.data;
  },

  getUsageReport: async (params: GetAnalyticsParams): Promise<any> => {
    const response = await api.get('/analytics/usage', { params });
    return response.data;
  },
};
