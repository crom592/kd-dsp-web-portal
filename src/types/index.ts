// User Types
export enum UserRole {
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  KD_OPERATOR = 'KD_OPERATOR',
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  companyId?: string;
  company?: Company;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: User;
  tokens: LoginTokens;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Route Types
export interface Route {
  id: string;
  name: string;
  code: string;
  companyId: string;
  company?: Company;
  type: 'COMMUTE' | 'DRT';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  stops: RouteStop[];
  createdAt: string;
  updatedAt: string;
}

export interface RouteStop {
  id: string;
  routeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  sequence: number;
  arrivalTime?: string;
  departureTime?: string;
}

// Vehicle Types
export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  capacity: number;
  status: 'AVAILABLE' | 'IN_SERVICE' | 'MAINTENANCE' | 'INACTIVE';
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  driverId?: string;
  driver?: Driver;
}

export interface Driver {
  id: string;
  userId: string;
  user?: User;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY';
}

// Reservation Types
export interface Reservation {
  id: string;
  userId: string;
  user?: User;
  routeId: string;
  route?: Route;
  tripId?: string;
  boardingStopId: string;
  boardingStop?: RouteStop;
  alightingStopId: string;
  alightingStop?: RouteStop;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  reservationDate: string;
  createdAt: string;
}

// Dashboard Types
export interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  totalRoutes: number;
  activeRoutes: number;
  totalRiders: number;
  todayReservations: number;
  averageOccupancy: number;
}
