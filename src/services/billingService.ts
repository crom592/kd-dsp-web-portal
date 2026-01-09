import api from './api';
import { Invoice, Payment, PaginatedResponse } from '@/types';

interface GetInvoicesParams {
  page?: number;
  limit?: number;
  status?: string;
  companyId?: string;
}

interface GetPaymentsParams {
  page?: number;
  limit?: number;
  status?: string;
  invoiceId?: string;
}

export const billingService = {
  getInvoices: async (params: GetInvoicesParams): Promise<PaginatedResponse<Invoice>> => {
    const response = await api.get('/billing/invoices', { params });
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

  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await api.get(`/billing/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (data: Partial<Invoice>): Promise<Invoice> => {
    const response = await api.post('/billing/invoices', data);
    return response.data;
  },

  updateInvoice: async (id: string, data: Partial<Invoice>): Promise<Invoice> => {
    const response = await api.put(`/billing/invoices/${id}`, data);
    return response.data;
  },

  getPayments: async (params: GetPaymentsParams): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get('/billing/payments', { params });
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

  getPayment: async (id: string): Promise<Payment> => {
    const response = await api.get(`/billing/payments/${id}`);
    return response.data;
  },

  createPayment: async (data: Partial<Payment>): Promise<Payment> => {
    const response = await api.post('/billing/payments', data);
    return response.data;
  },
};
