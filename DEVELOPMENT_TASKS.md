# Web Portal 개발 가이드

> 이 문서는 AI 에이전트 및 개발자가 병렬 개발 시 참고할 수 있는 가이드입니다.

## 현재 상태 요약

**전체 진행률: 25-30%** (가장 개발이 필요한 영역)

### 완료된 항목

| 항목 | 파일 위치 | 상태 |
|------|-----------|------|
| 프로젝트 설정 | `vite.config.ts` | ✅ 완료 |
| MUI 테마 | `src/theme.ts` | ✅ 완료 |
| Redux 스토어 | `src/store/` | ✅ 완료 |
| 레이아웃 | `src/components/layout/` | ✅ 완료 |
| 로그인 페이지 | `src/pages/auth/LoginPage.tsx` | ✅ 완료 |
| 대시보드 | `src/pages/dashboard/DashboardPage.tsx` | ⚠️ Mock 데이터 |
| API 클라이언트 | `src/services/api.ts` | ✅ 설정 완료 |

### 미구현 핵심 페이지

| 페이지 | 우선순위 | 상태 |
|--------|----------|------|
| 노선 관리 | 🔴 높음 | ❌ 미구현 |
| 예약 현황/관리 | 🔴 높음 | ❌ 미구현 |
| 실시간 모니터링 | 🔴 높음 | ❌ 플레이스홀더만 |
| 차량 관리 | 🟡 중간 | ❌ 미구현 |
| 기사 관리 | 🟡 중간 | ❌ 미구현 |
| 정류장 관리 | 🟡 중간 | ❌ 미구현 |
| 사용자 관리 | 🟡 중간 | ❌ 미구현 |
| 기업 관리 | 🟡 중간 | ❌ 미구현 |
| 정산/청구 | 🟡 중간 | ❌ 미구현 |
| 분석/리포트 | 🟢 낮음 | ❌ 미구현 |

---

## 남은 개발 태스크

### 1순위: 노선 관리 페이지

**생성할 파일**: `src/pages/routes/`

```
[ ] RoutesListPage.tsx
    - 노선 목록 테이블 (MUI DataGrid)
    - 검색/필터링
    - 상태별 필터 (ACTIVE, INACTIVE, PLANNING)

[ ] RouteDetailPage.tsx
    - 노선 상세 정보
    - 연결된 정류장 목록
    - 배차된 차량/기사 정보

[ ] RouteFormPage.tsx (생성/수정)
    - 기본 정보 입력
    - 정류장 추가/정렬 (드래그앤드롭)
    - 운행 시간표 설정
```

**백엔드 API**:
- `GET /api/routes` - 목록 조회
- `GET /api/routes/:id` - 상세 조회
- `POST /api/routes` - 생성
- `PUT /api/routes/:id` - 수정
- `DELETE /api/routes/:id` - 삭제

### 2순위: 예약 관리 페이지

**생성할 파일**: `src/pages/reservations/`

```
[ ] ReservationsListPage.tsx
    - 예약 목록 (날짜별 필터링)
    - 상태별 필터 (PENDING, CONFIRMED, CANCELLED 등)
    - 노선별 필터

[ ] ReservationDetailPage.tsx
    - 예약 상세 정보
    - 탑승자 정보
    - 예약 취소 기능

[ ] 좌석 가용성 뷰 (optional)
    - GET /api/reservations/availability?routeId=...&date=...
```

**백엔드 API**:
- `GET /api/reservations` - 목록 조회
- `GET /api/reservations/:id` - 상세 조회
- `PATCH /api/reservations/:id/cancel` - 취소

### 3순위: 실시간 모니터링 대시보드

**수정할 파일**: `src/pages/dashboard/DashboardPage.tsx`
**생성할 파일**: `src/pages/monitoring/`

```
[ ] 대시보드 API 연동
    - Mock 데이터 → 실제 API 호출로 변경
    - GET /api/stats/dashboard

[ ] MonitoringPage.tsx
    - 지도 컴포넌트 (카카오맵)
    - 차량 위치 실시간 표시
    - WebSocket 연결

[ ] 지도 컴포넌트
    - src/components/map/KakaoMap.tsx
    - 차량 마커 표시
    - 노선 경로 표시
```

### 4순위: 차량/기사 관리

**생성할 파일**: `src/pages/vehicles/`, `src/pages/drivers/`

```
[ ] VehiclesListPage.tsx
[ ] VehicleFormPage.tsx
[ ] DriversListPage.tsx
[ ] DriverFormPage.tsx
```

### 5순위: 정류장/사용자/기업 관리

```
[ ] src/pages/stops/
[ ] src/pages/users/
[ ] src/pages/companies/
```

---

## 코드 패턴 가이드

### 페이지 컴포넌트 패턴

```tsx
// src/pages/routes/RoutesListPage.tsx 예시

import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { routesService } from '@/services/routesService';

const RoutesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // React Query로 데이터 페칭
  const { data, isLoading, error } = useQuery({
    queryKey: ['routes', page, pageSize],
    queryFn: () => routesService.getRoutes({ page: page + 1, limit: pageSize }),
  });

  const columns: GridColDef[] = [
    { field: 'routeName', headerName: '노선명', flex: 1 },
    { field: 'routeType', headerName: '유형', width: 120 },
    { field: 'status', headerName: '상태', width: 100 },
    { field: 'startPoint', headerName: '출발지', flex: 1 },
    { field: 'endPoint', headerName: '도착지', flex: 1 },
  ];

  return (
    <Box>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          노선 관리
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/routes/new')}
        >
          노선 추가
        </Button>
      </Box>

      {/* 데이터 그리드 */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={data?.data || []}
          columns={columns}
          loading={isLoading}
          paginationMode="server"
          rowCount={data?.total || 0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onRowClick={(params) => navigate(`/routes/${params.id}`)}
        />
      </Paper>
    </Box>
  );
};

export default RoutesListPage;
```

### API 서비스 패턴

```tsx
// src/services/routesService.ts

import api from './api';
import { Route, PaginatedResponse } from '@/types';

interface GetRoutesParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export const routesService = {
  // 목록 조회
  getRoutes: async (params: GetRoutesParams): Promise<PaginatedResponse<Route>> => {
    const response = await api.get('/routes', { params });
    return response.data;
  },

  // 상세 조회
  getRoute: async (id: string): Promise<Route> => {
    const response = await api.get(`/routes/${id}`);
    return response.data;
  },

  // 생성
  createRoute: async (data: Partial<Route>): Promise<Route> => {
    const response = await api.post('/routes', data);
    return response.data;
  },

  // 수정
  updateRoute: async (id: string, data: Partial<Route>): Promise<Route> => {
    const response = await api.put(`/routes/${id}`, data);
    return response.data;
  },

  // 삭제
  deleteRoute: async (id: string): Promise<void> => {
    await api.delete(`/routes/${id}`);
  },
};
```

### 폼 컴포넌트 패턴

```tsx
// src/pages/routes/RouteFormPage.tsx

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, TextField, Button, MenuItem, Paper, Typography, Grid
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { routesService } from '@/services/routesService';

interface RouteFormData {
  routeName: string;
  routeType: 'COMMUTE' | 'DRT' | 'CHARTER';
  startPoint: string;
  endPoint: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PLANNING';
}

const RouteFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const { control, handleSubmit, formState: { errors } } = useForm<RouteFormData>();

  const mutation = useMutation({
    mutationFn: (data: RouteFormData) =>
      isEdit
        ? routesService.updateRoute(id!, data)
        : routesService.createRoute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      navigate('/routes');
    },
  });

  const onSubmit = (data: RouteFormData) => {
    mutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {isEdit ? '노선 수정' : '노선 추가'}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="routeName"
                control={control}
                rules={{ required: '노선명을 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="노선명"
                    fullWidth
                    error={!!errors.routeName}
                    helperText={errors.routeName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="routeType"
                control={control}
                rules={{ required: '유형을 선택해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="노선 유형"
                    fullWidth
                  >
                    <MenuItem value="COMMUTE">출퇴근</MenuItem>
                    <MenuItem value="DRT">DRT</MenuItem>
                    <MenuItem value="CHARTER">전세</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {/* 추가 필드들 */}
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/routes')}>
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isPending}
            >
              {isEdit ? '수정' : '생성'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default RouteFormPage;
```

### 라우터 설정 패턴

```tsx
// src/App.tsx에 추가할 라우트

import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

// 페이지 import
import RoutesListPage from '@/pages/routes/RoutesListPage';
import RouteDetailPage from '@/pages/routes/RouteDetailPage';
import RouteFormPage from '@/pages/routes/RouteFormPage';
// ... 기타 페이지

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />

        {/* 노선 관리 */}
        <Route path="/routes" element={<RoutesListPage />} />
        <Route path="/routes/new" element={<RouteFormPage />} />
        <Route path="/routes/:id" element={<RouteDetailPage />} />
        <Route path="/routes/:id/edit" element={<RouteFormPage />} />

        {/* 예약 관리 */}
        <Route path="/reservations" element={<ReservationsListPage />} />
        <Route path="/reservations/:id" element={<ReservationDetailPage />} />

        {/* 차량 관리 */}
        <Route path="/vehicles" element={<VehiclesListPage />} />
        <Route path="/vehicles/new" element={<VehicleFormPage />} />
        <Route path="/vehicles/:id/edit" element={<VehicleFormPage />} />

        {/* 기사 관리 */}
        <Route path="/drivers" element={<DriversListPage />} />
        <Route path="/drivers/new" element={<DriverFormPage />} />
        <Route path="/drivers/:id/edit" element={<DriverFormPage />} />

        {/* 실시간 모니터링 */}
        <Route path="/monitoring" element={<MonitoringPage />} />
      </Route>
    </Routes>
  );
};
```

---

## 파일 구조

```
src/
├── main.tsx                     # 앱 엔트리포인트
├── App.tsx                      # 라우터 설정
├── theme.ts                     # MUI 테마 설정
│
├── components/
│   ├── layout/                  # ✅ 완료
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MainLayout.tsx
│   │   └── index.ts
│   ├── common/                  # ✅ 일부 완료
│   │   ├── Loading.tsx
│   │   └── index.ts
│   └── map/                     # ❌ 생성 필요
│       └── KakaoMap.tsx
│
├── pages/
│   ├── auth/                    # ✅ 완료
│   │   └── LoginPage.tsx
│   ├── dashboard/               # ⚠️ Mock 데이터
│   │   └── DashboardPage.tsx
│   ├── routes/                  # ❌ 생성 필요
│   ├── reservations/            # ❌ 생성 필요
│   ├── vehicles/                # ❌ 생성 필요
│   ├── drivers/                 # ❌ 생성 필요
│   ├── stops/                   # ❌ 생성 필요
│   ├── users/                   # ❌ 생성 필요
│   ├── companies/               # ❌ 생성 필요
│   ├── billing/                 # ❌ 생성 필요
│   └── monitoring/              # ❌ 생성 필요
│
├── services/
│   ├── api.ts                   # ✅ Axios 인스턴스
│   ├── authService.ts           # ✅ 인증 서비스
│   ├── routesService.ts         # ❌ 생성 필요
│   ├── reservationsService.ts   # ❌ 생성 필요
│   ├── vehiclesService.ts       # ❌ 생성 필요
│   └── driversService.ts        # ❌ 생성 필요
│
├── store/
│   ├── index.ts                 # ✅ Redux 스토어
│   └── slices/
│       └── authSlice.ts         # ✅ 인증 상태
│
├── hooks/
│   ├── useAuth.ts               # ✅ 완료
│   └── index.ts
│
├── types/
│   └── index.ts                 # 타입 정의
│
├── utils/
│   ├── format.ts                # ✅ 포맷 유틸
│   ├── validation.ts            # ✅ 유효성 검사
│   └── index.ts
│
└── constants/
    └── index.ts                 # ✅ 상수 정의
```

---

## 기존 코드 참고

### 대시보드 (DashboardPage.tsx)

```tsx
// 현재 Mock 데이터 사용 부분 (API 연동 필요)
const stats = {
  totalVehicles: 45,      // → GET /api/vehicles?count=true
  activeVehicles: 38,     // → GET /api/vehicles?status=ACTIVE&count=true
  totalRoutes: 12,        // → GET /api/routes?count=true
  activeRoutes: 10,       // → GET /api/routes?status=ACTIVE&count=true
  totalRiders: 1250,      // → GET /api/users?role=RIDER&count=true
  todayReservations: 342, // → GET /api/reservations?date=today&count=true
  averageOccupancy: 78,   // → GET /api/stats/occupancy
};
```

### 레이아웃 (Sidebar.tsx 메뉴 구조)

```tsx
// 사이드바 메뉴 항목 (라우트와 매칭 필요)
const menuItems = [
  { path: '/', label: '대시보드', icon: <DashboardIcon /> },
  { path: '/routes', label: '노선 관리', icon: <RouteIcon /> },
  { path: '/reservations', label: '예약 관리', icon: <EventNoteIcon /> },
  { path: '/vehicles', label: '차량 관리', icon: <DirectionsBusIcon /> },
  { path: '/drivers', label: '기사 관리', icon: <PersonIcon /> },
  { path: '/monitoring', label: '실시간 모니터링', icon: <LocationOnIcon /> },
  // ...
];
```

---

## 개발 환경 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 테스트
npm run test
```

**개발 서버**: http://localhost:5173
**API 프록시**: `/api` → `http://localhost:3000/api`

---

## 의존성 정보

```json
{
  "UI 프레임워크": {
    "@mui/material": "5.x",
    "@mui/x-data-grid": "데이터 테이블",
    "@emotion/react": "스타일링"
  },
  "상태 관리": {
    "@reduxjs/toolkit": "전역 상태",
    "@tanstack/react-query": "서버 상태"
  },
  "라우팅": {
    "react-router-dom": "6.x"
  },
  "폼": {
    "react-hook-form": "폼 관리"
  },
  "HTTP": {
    "axios": "API 클라이언트"
  },
  "지도": {
    "kakao-maps-sdk": "카카오맵 (설정 필요)"
  }
}
```

---

## 타입 정의 필요

```typescript
// src/types/index.ts에 추가 필요

export interface Route {
  id: string;
  routeName: string;
  routeType: 'COMMUTE' | 'DRT' | 'CHARTER';
  status: 'ACTIVE' | 'INACTIVE' | 'PLANNING';
  startPoint: string;
  endPoint: string;
  operatingDays: string[];
  operatingTimes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  routeId: string;
  boardingDate: string;
  seatNumber: number | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  createdAt: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_DUTY';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```
