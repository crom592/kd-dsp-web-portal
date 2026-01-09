// API Constants
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'kd_access_token',
  REFRESH_TOKEN: 'kd_refresh_token',
  USER: 'kd_user',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  // Routes
  ROUTES: '/routes',
  ROUTES_DETAIL: '/routes/:id',
  ROUTES_CREATE: '/routes/new',
  ROUTES_EDIT: '/routes/:id/edit',
  // Reservations
  RESERVATIONS: '/reservations',
  RESERVATIONS_DETAIL: '/reservations/:id',
  // Vehicles
  VEHICLES: '/vehicles',
  VEHICLES_CREATE: '/vehicles/new',
  VEHICLES_EDIT: '/vehicles/:id/edit',
  // Drivers
  DRIVERS: '/drivers',
  DRIVERS_CREATE: '/drivers/new',
  DRIVERS_EDIT: '/drivers/:id/edit',
  // Monitoring
  MONITORING: '/monitoring',
  // Users
  USERS: '/users',
  USERS_CREATE: '/users/new',
  USERS_EDIT: '/users/:id/edit',
  // Companies
  COMPANIES: '/companies',
  COMPANIES_CREATE: '/companies/new',
  COMPANIES_EDIT: '/companies/:id/edit',
  // Stops
  STOPS: '/stops',
  STOPS_CREATE: '/stops/new',
  STOPS_EDIT: '/stops/:id/edit',
  // Billing
  BILLING: '/billing',
  BILLING_DETAIL: '/billing/:id',
  // Analytics
  ANALYTICS: '/analytics',
  // Settings
  SETTINGS: '/settings',
} as const;

// User Roles Display Names
export const ROLE_DISPLAY_NAMES = {
  RIDER: '탑승자',
  DRIVER: '운전자',
  COMPANY_ADMIN: '기업 관리자',
  KD_OPERATOR: 'KD 운영자',
} as const;

// Status Display Names
export const ROUTE_STATUS_DISPLAY = {
  ACTIVE: '운영중',
  INACTIVE: '비활성',
  SUSPENDED: '중지',
} as const;

export const VEHICLE_STATUS_DISPLAY = {
  AVAILABLE: '대기중',
  IN_SERVICE: '운행중',
  MAINTENANCE: '정비중',
  INACTIVE: '비활성',
} as const;

export const RESERVATION_STATUS_DISPLAY = {
  PENDING: '대기',
  CONFIRMED: '확정',
  CANCELLED: '취소',
  COMPLETED: '완료',
  NO_SHOW: '미탑승',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Date Formats
export const DATE_FORMAT = 'yyyy-MM-dd';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm';
export const DISPLAY_DATE_FORMAT = 'yyyy년 MM월 dd일';
export const DISPLAY_DATETIME_FORMAT = 'yyyy년 MM월 dd일 HH:mm';

// Query Keys
export const QUERY_KEYS = {
  USER: 'user',
  USERS: 'users',
  ROUTES: 'routes',
  ROUTE: 'route',
  VEHICLES: 'vehicles',
  VEHICLE: 'vehicle',
  DRIVERS: 'drivers',
  DRIVER: 'driver',
  RESERVATIONS: 'reservations',
  RESERVATION: 'reservation',
  DASHBOARD_STATS: 'dashboardStats',
  BILLING: 'billing',
  ANALYTICS: 'analytics',
} as const;
