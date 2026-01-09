import api from './api';
import { Company, PaginatedResponse } from '@/types';

interface GetCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export const companiesService = {
  getCompanies: async (params: GetCompaniesParams): Promise<PaginatedResponse<Company>> => {
    const response = await api.get('/companies', { params });
    return response.data;
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
