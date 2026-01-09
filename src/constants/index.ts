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
  ROUTES: '/routes',
  ROUTES_DETAIL: '/routes/:id',
  ROUTES_CREATE: '/routes/create',
  VEHICLES: '/vehicles',
  USERS: '/users',
  ANALYTICS: '/analytics',
  BILLING: '/billing',
  SETTINGS: '/settings',
} as const;

// User Roles Display Names
export const ROLE_DISPLAY_NAMES = {
  RIDER: '탑승자',
  DRIVER: '운전자',
  COMPANY_ADMIN: '기업 관리자',
  SYSTEM_ADMIN: '시스템 관리자',
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
  RESERVATIONS: 'reservations',
  DASHBOARD_STATS: 'dashboardStats',
  BILLING: 'billing',
  ANALYTICS: 'analytics',
} as const;
