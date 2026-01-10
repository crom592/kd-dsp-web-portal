import api from './api';
import { Vehicle, PaginatedResponse } from '@/types';

interface GetVehiclesParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface VehicleMonitoringData {
  id: string;
  plateNumber: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  status: string;
  speed?: number;
  heading?: number;
  routeName?: string;
  routeId?: string;
  driverName?: string;
  driverId?: string;
  nextStop?: string;
  eta?: string;
  fuelLevel?: number;
  passengers?: number;
  tripId?: string;
  capacity: number;
}

export interface VehicleMonitoringResponse {
  data: VehicleMonitoringData[];
  total: number;
  inService: number;
  idle: number;
  timestamp: string;
}

// Transform backend vehicle data to frontend Vehicle type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformVehicle = (backendVehicle: any): Vehicle => {
  // Map backend status to frontend status
  const statusMap: Record<string, string> = {
    'IN_USE': 'IN_SERVICE',
    'RETIRED': 'INACTIVE',
    'AVAILABLE': 'AVAILABLE',
    'MAINTENANCE': 'MAINTENANCE',
  };

  return {
    id: backendVehicle.id,
    plateNumber: backendVehicle.licensePlate || backendVehicle.plateNumber,
    model: backendVehicle.model,
    capacity: backendVehicle.capacity,
    status: statusMap[backendVehicle.status] || backendVehicle.status,
    currentLocation: backendVehicle.currentLocation,
    driverId: backendVehicle.driverId,
    driver: backendVehicle.driver,
  };
};

export const vehiclesService = {
  getVehicles: async (params: GetVehiclesParams): Promise<PaginatedResponse<Vehicle>> => {
    const response = await api.get('/vehicles', { params });
    const backendData = response.data.data || response.data;
    const items = backendData.items || backendData.data || [];
    return {
      data: items.map(transformVehicle),
      meta: backendData.pagination || backendData.meta || {
        total: backendData.total || items.length || 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil((backendData.total || items.length || 0) / (params.limit || 10)),
      },
    };
  },

  getVehicle: async (id: string): Promise<Vehicle> => {
    const response = await api.get(`/vehicles/${id}`);
    const data = response.data.data || response.data;
    return transformVehicle(data);
  },

  createVehicle: async (data: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await api.post('/vehicles', data);
    return response.data;
  },

  updateVehicle: async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },

  /**
   * 실시간 모니터링 데이터 조회
   * 운행 중인 차량들의 위치, 노선, 기사 정보를 종합하여 반환
   */
  getMonitoringData: async (): Promise<VehicleMonitoringResponse> => {
    const response = await api.get('/vehicles/monitoring');
    return response.data.data || response.data;
  },
};
