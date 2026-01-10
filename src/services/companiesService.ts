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

// Transform backend company data to frontend Company type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformCompany = (backendCompany: any): Company => ({
  id: backendCompany.id,
  name: backendCompany.name,
  code: backendCompany.businessNumber || backendCompany.code || '',
  address: backendCompany.address,
  contactEmail: backendCompany.contactEmail,
  contactPhone: backendCompany.contactPhone,
  isActive: backendCompany.isActive ?? backendCompany.status === 'ACTIVE',
  createdAt: backendCompany.createdAt,
  updatedAt: backendCompany.updatedAt,
});

export const companiesService = {
  getCompanies: async (params: GetCompaniesParams): Promise<PaginatedResponse<Company>> => {
    const response = await api.get('/companies', { params });
    const backendData = response.data.data || response.data;
    const items = backendData.items || backendData.data || [];
    return {
      data: items.map(transformCompany),
      meta: backendData.meta || backendData.pagination || {
        total: backendData.total || items.length || 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil((backendData.total || items.length || 0) / (params.limit || 10)),
      },
    };
  },

  getCompany: async (id: string): Promise<Company> => {
    const response = await api.get(`/companies/${id}`);
    const data = response.data.data || response.data;
    return transformCompany(data);
  },

  createCompany: async (data: Partial<Company>): Promise<Company> => {
    const response = await api.post('/companies', data);
    const resData = response.data.data || response.data;
    return transformCompany(resData);
  },

  updateCompany: async (id: string, data: Partial<Company>): Promise<Company> => {
    const response = await api.put(`/companies/${id}`, data);
    const resData = response.data.data || response.data;
    return transformCompany(resData);
  },

  deleteCompany: async (id: string): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },
};
