import api from './api';
import { Company, PaginatedResponse } from '@/types';

interface GetCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export const companiesService = {
  getCompanies: async (params: GetCompaniesParams): Promise<PaginatedResponse<Company>> => {
    const response = await api.get('/companies', { params });
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

  getCompany: async (id: string): Promise<Company> => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  createCompany: async (data: Partial<Company>): Promise<Company> => {
    const response = await api.post('/companies', data);
    return response.data;
  },

  updateCompany: async (id: string, data: Partial<Company>): Promise<Company> => {
    const response = await api.put(`/companies/${id}`, data);
    return response.data;
  },

  deleteCompany: async (id: string): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },
};
