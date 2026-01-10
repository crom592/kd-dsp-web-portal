import api from './api';
import { Invoice, Payment, PaginatedResponse } from '@/types';

interface GetInvoicesParams {
  page?: number;
  limit?: number;
  status?: string;
  companyId?: string;
  startDate?: string;
  endDate?: string;
}

interface GetPaymentsParams {
  page?: number;
  limit?: number;
  status?: string;
  invoiceId?: string;
}

// Transform backend billing data to frontend Invoice type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformInvoice = (backendBilling: any): Invoice => ({
  id: backendBilling.id,
  companyId: backendBilling.companyId,
  company: backendBilling.company
    ? {
        ...backendBilling.company,
        code: backendBilling.company.businessNumber || backendBilling.company.code || '',
      }
    : undefined,
  invoiceNumber: backendBilling.billingMonth || backendBilling.id?.substring(0, 8).toUpperCase() || '',
  billingPeriodStart: backendBilling.startDate || backendBilling.billingPeriodStart,
  billingPeriodEnd: backendBilling.endDate || backendBilling.billingPeriodEnd,
  amount: backendBilling.finalAmount || backendBilling.totalAmount || backendBilling.amount || 0,
  status: backendBilling.status,
  dueDate: backendBilling.dueDate,
  paidAt: backendBilling.paidAt,
  createdAt: backendBilling.createdAt,
});

// Transform backend payment data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformPayment = (backendPayment: any): Payment => ({
  id: backendPayment.id,
  invoiceId: backendPayment.billingId || backendPayment.invoiceId,
  invoice: backendPayment.billing ? transformInvoice(backendPayment.billing) : backendPayment.invoice,
  amount: backendPayment.amount,
  paymentMethod: backendPayment.paymentMethod,
  status: backendPayment.status,
  transactionId: backendPayment.transactionId,
  paidAt: backendPayment.paidAt,
  createdAt: backendPayment.createdAt,
});

export const billingService = {
  getInvoices: async (params: GetInvoicesParams): Promise<PaginatedResponse<Invoice>> => {
    const response = await api.get('/billing/invoices', { params });
    const backendData = response.data.data || response.data;
    const items = backendData.items || backendData.data || [];
    return {
      data: items.map(transformInvoice),
      meta: backendData.meta || backendData.pagination || {
        total: backendData.total || items.length || 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil((backendData.total || items.length || 0) / (params.limit || 10)),
      },
    };
  },

  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await api.get(`/billing/${id}`);
    const data = response.data.data || response.data;
    return transformInvoice(data);
  },

  createInvoice: async (data: Partial<Invoice>): Promise<Invoice> => {
    const response = await api.post('/billing/generate', data);
    const resData = response.data.data || response.data;
    return transformInvoice(resData);
  },

  updateInvoice: async (id: string, data: Partial<Invoice>): Promise<Invoice> => {
    const response = await api.patch(`/billing/${id}`, data);
    const resData = response.data.data || response.data;
    return transformInvoice(resData);
  },

  getPayments: async (params: GetPaymentsParams): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get('/billing/payments', { params });
    const backendData = response.data.data || response.data;
    const items = backendData.items || backendData.data || [];
    return {
      data: items.map(transformPayment),
      meta: backendData.meta || backendData.pagination || {
        total: backendData.total || items.length || 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil((backendData.total || items.length || 0) / (params.limit || 10)),
      },
    };
  },

  getPayment: async (id: string): Promise<Payment> => {
    const response = await api.get(`/billing/payments/${id}`);
    const data = response.data.data || response.data;
    return transformPayment(data);
  },

  createPayment: async (data: Partial<Payment>): Promise<Payment> => {
    const response = await api.post('/billing/payments', data);
    const resData = response.data.data || response.data;
    return transformPayment(resData);
  },
};
