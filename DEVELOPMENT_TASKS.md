# Web Portal 개발 가이드

> 이 문서는 AI 에이전트 및 개발자가 병렬 개발 시 참고할 수 있는 가이드입니다.

## 현재 상태 요약

**전체 진행률: 95%** (프론트엔드 UI 구현 완료, API 연동 필요)

### 완료된 항목

| 항목 | 파일 위치 | 상태 |
|------|-----------|------|
| 프로젝트 설정 | `vite.config.ts` | ✅ 완료 |
| MUI 테마 | `src/theme.ts` | ✅ 완료 |
| Redux 스토어 | `src/store/` | ✅ 완료 |
| 레이아웃 | `src/components/layout/` | ✅ 완료 |
| 로그인 페이지 | `src/pages/auth/LoginPage.tsx` | ✅ 완료 |
| 대시보드 | `src/pages/dashboard/DashboardPage.tsx` | ✅ 완료 (Mock 데이터 포함) |
| 실시간 차량 지도 | 대시보드 내 GoogleMap 통합 | ✅ 완료 |
| 예약 현황 차트 | `src/components/charts/ReservationStatusChart.tsx` | ✅ 완료 |
| 월별 수익 차트 | `src/components/charts/MonthlyRevenueChart.tsx` | ✅ 완료 |
| API 클라이언트 | `src/services/api.ts` | ✅ 완료 |
| 노선 관리 | `src/pages/routes/` | ✅ 완료 |
| 예약 관리 | `src/pages/reservations/` | ✅ 완료 |
| 차량 관리 | `src/pages/vehicles/` | ✅ 완료 |
| 기사 관리 | `src/pages/drivers/` | ✅ 완료 |
| 정류장 관리 | `src/pages/stops/` | ✅ 완료 |
| 사용자 관리 | `src/pages/users/` | ✅ 완료 |
| 기업 관리 | `src/pages/companies/` | ✅ 완료 |
| 실시간 모니터링 | `src/pages/monitoring/MonitoringPage.tsx` | ✅ 완료 (Mock 데이터 포함) |
| 정산/청구 | `src/pages/billing/` | ✅ 완료 |
| 분석/리포트 | `src/pages/analytics/AnalyticsPage.tsx` | ✅ 완료 |
| 설정 | `src/pages/settings/SettingsPage.tsx` | ✅ 완료 |

### 남은 작업

| 항목 | 우선순위 | 상태 |
|------|----------|------|
| 백엔드 API 연동 | 🔴 높음 | ⚠️ Mock 데이터 → 실제 API |
| 인증 토큰 관리 | 🔴 높음 | ⚠️ 리프레시 토큰 처리 |
| WebSocket 실시간 연동 | 🟡 중간 | ❌ 차량 위치 실시간 업데이트 |
| E2E 테스트 | 🟢 낮음 | ❌ Playwright/Cypress |
| 단위 테스트 | 🟢 낮음 | ❌ Vitest |

---

## 완료된 페이지 목록

### 1. 대시보드 (`src/pages/dashboard/DashboardPage.tsx`)
- ✅ 통계 카드 (총 차량, 운행 차량, 노선, 오늘 예약)
- ✅ 실시간 차량 위치 지도 (GoogleMap)
- ✅ 운행 차량 목록 (상태 배지)
- ✅ 예약 현황 차트 (Pie + Bar)
- ✅ Quick Stats 사이드바
- ⚠️ Mock 데이터 사용 중 (API 연동 필요)

### 2. 노선 관리 (`src/pages/routes/`)
- ✅ `RoutesListPage.tsx` - 노선 목록 (DataGrid, 검색, 필터)
- ✅ `RouteDetailPage.tsx` - 노선 상세 (정류장 목록, 배차 정보)
- ✅ `RouteFormPage.tsx` - 노선 생성/수정 폼

### 3. 예약 관리 (`src/pages/reservations/`)
- ✅ `ReservationsListPage.tsx` - 예약 목록 (상태별 필터)
- ✅ `ReservationDetailPage.tsx` - 예약 상세

### 4. 차량 관리 (`src/pages/vehicles/`)
- ✅ `VehiclesListPage.tsx` - 차량 목록
- ✅ `VehicleFormPage.tsx` - 차량 생성/수정 폼

### 5. 기사 관리 (`src/pages/drivers/`)
- ✅ `DriversListPage.tsx` - 기사 목록
- ✅ `DriverFormPage.tsx` - 기사 생성/수정 폼

### 6. 정류장 관리 (`src/pages/stops/`)
- ✅ `StopsListPage.tsx` - 정류장 목록
- ✅ `StopFormPage.tsx` - 정류장 생성/수정 폼

### 7. 사용자 관리 (`src/pages/users/`)
- ✅ `UsersListPage.tsx` - 사용자 목록
- ✅ `UserFormPage.tsx` - 사용자 생성/수정 폼

### 8. 기업 관리 (`src/pages/companies/`)
- ✅ `CompaniesListPage.tsx` - 기업 목록
- ✅ `CompanyFormPage.tsx` - 기업 생성/수정 폼

### 9. 실시간 모니터링 (`src/pages/monitoring/MonitoringPage.tsx`)
- ✅ 실시간 차량 위치 지도
- ✅ 차량 목록 (상태별 색상)
- ✅ 차량 상세 정보 카드
- ✅ 상태 카운터 (운행중/지연/대기)
- ✅ Mock 데이터 시뮬레이션 (2초마다 위치 업데이트)

### 10. 정산/청구 (`src/pages/billing/`)
- ✅ `InvoicesListPage.tsx` - 청구서 목록
- ✅ `InvoiceDetailPage.tsx` - 청구서 상세

### 11. 분석/리포트 (`src/pages/analytics/AnalyticsPage.tsx`)
- ✅ 통계 카드 (총 수익, 예약, 운행, 평점)
- ✅ 월별 수익 추이 차트 (AreaChart)
- ✅ 인기 노선 TOP 5
- ✅ 예약 상태별 분포

### 12. 설정 (`src/pages/settings/SettingsPage.tsx`)
- ✅ 프로필 설정 (이름, 이메일, 전화번호)
- ✅ 알림 설정 (이메일, 푸시, 리포트)
- ✅ 화면 설정 (다크모드, 언어, 폰트 크기)
- ✅ 보안 설정 (비밀번호 변경)

---

## 차트 컴포넌트 (`src/components/charts/`)

### MonthlyRevenueChart.tsx
- Recharts AreaChart
- 당월/전년 동월 비교
- 연간 총 수익, 월 평균, 성장률 표시
- 커스텀 툴팁

### ReservationStatusChart.tsx
- Recharts PieChart (상태별 분포)
- Recharts BarChart (일별 추이)
- 전체 예약, 확정률 표시

---

## 지도 컴포넌트 (`src/components/map/`)

### GoogleMap.tsx
- Google Maps API 연동
- 마커 표시 (차량 위치)
- 클릭 이벤트
- 반응형 높이

---

## API 서비스 (`src/services/`)

| 서비스 | 파일 | 상태 |
|--------|------|------|
| API 클라이언트 | `api.ts` | ✅ Axios 인스턴스, 인터셉터 |
| 인증 | `authService.ts` | ✅ 로그인, 로그아웃, 토큰 관리 |
| 대시보드 | `dashboardService.ts` | ✅ 통계 조회 |
| 노선 | `routesService.ts` | ✅ CRUD |
| 예약 | `reservationsService.ts` | ✅ 목록, 상세, 취소 |
| 차량 | `vehiclesService.ts` | ✅ CRUD |
| 기사 | `driversService.ts` | ✅ CRUD |
| 정류장 | `stopsService.ts` | ✅ CRUD |
| 사용자 | `usersService.ts` | ✅ CRUD |
| 기업 | `companiesService.ts` | ✅ CRUD |
| 정산 | `billingService.ts` | ✅ 청구서 조회 |
| 분석 | `analyticsService.ts` | ✅ 분석 데이터 조회 |

---

## 파일 구조 (현재)

```
src/
├── main.tsx                     # 앱 엔트리포인트
├── App.tsx                      # 라우터 설정 ✅
├── theme.ts                     # MUI 테마 설정
│
├── components/
│   ├── layout/                  # ✅ 완료
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MainLayout.tsx
│   │   └── index.ts
│   ├── common/                  # ✅ 완료
│   │   ├── Loading.tsx
│   │   └── index.ts
│   ├── charts/                  # ✅ 완료
│   │   ├── MonthlyRevenueChart.tsx
│   │   ├── ReservationStatusChart.tsx
│   │   └── index.ts
│   └── map/                     # ✅ 완료
│       └── GoogleMap.tsx
│
├── pages/
│   ├── auth/                    # ✅ 완료
│   │   └── LoginPage.tsx
│   ├── dashboard/               # ✅ 완료
│   │   └── DashboardPage.tsx
│   ├── routes/                  # ✅ 완료
│   │   ├── RoutesListPage.tsx
│   │   ├── RouteDetailPage.tsx
│   │   └── RouteFormPage.tsx
│   ├── reservations/            # ✅ 완료
│   │   ├── ReservationsListPage.tsx
│   │   └── ReservationDetailPage.tsx
│   ├── vehicles/                # ✅ 완료
│   │   ├── VehiclesListPage.tsx
│   │   └── VehicleFormPage.tsx
│   ├── drivers/                 # ✅ 완료
│   │   ├── DriversListPage.tsx
│   │   └── DriverFormPage.tsx
│   ├── stops/                   # ✅ 완료
│   │   ├── StopsListPage.tsx
│   │   └── StopFormPage.tsx
│   ├── users/                   # ✅ 완료
│   │   ├── UsersListPage.tsx
│   │   └── UserFormPage.tsx
│   ├── companies/               # ✅ 완료
│   │   ├── CompaniesListPage.tsx
│   │   └── CompanyFormPage.tsx
│   ├── billing/                 # ✅ 완료
│   │   ├── InvoicesListPage.tsx
│   │   └── InvoiceDetailPage.tsx
│   ├── analytics/               # ✅ 완료
│   │   └── AnalyticsPage.tsx
│   ├── monitoring/              # ✅ 완료
│   │   └── MonitoringPage.tsx
│   └── settings/                # ✅ 완료
│       ├── SettingsPage.tsx
│       └── index.ts
│
├── services/                    # ✅ 완료
│   ├── api.ts
│   ├── authService.ts
│   ├── dashboardService.ts
│   ├── routesService.ts
│   ├── reservationsService.ts
│   ├── vehiclesService.ts
│   ├── driversService.ts
│   ├── stopsService.ts
│   ├── usersService.ts
│   ├── companiesService.ts
│   ├── billingService.ts
│   └── analyticsService.ts
│
├── store/                       # ✅ 완료
│   ├── index.ts
│   └── slices/
│       └── authSlice.ts
│
├── hooks/                       # ✅ 완료
│   ├── useAuth.ts
│   └── index.ts
│
├── types/                       # ✅ 완료
│   └── index.ts
│
├── utils/                       # ✅ 완료
│   ├── format.ts
│   ├── validation.ts
│   └── index.ts
│
└── constants/                   # ✅ 완료
    └── index.ts
```

---

## 라우트 설정 (현재)

```tsx
// src/App.tsx

<Routes>
  {/* Public */}
  <Route path="/login" element={<LoginPage />} />

  {/* Protected */}
  <Route element={<MainLayout />}>
    <Route path="/dashboard" element={<DashboardPage />} />

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

    {/* 정류장 관리 */}
    <Route path="/stops" element={<StopsListPage />} />
    <Route path="/stops/new" element={<StopFormPage />} />
    <Route path="/stops/:id/edit" element={<StopFormPage />} />

    {/* 사용자 관리 */}
    <Route path="/users" element={<UsersListPage />} />
    <Route path="/users/new" element={<UserFormPage />} />
    <Route path="/users/:id/edit" element={<UserFormPage />} />

    {/* 기업 관리 */}
    <Route path="/companies" element={<CompaniesListPage />} />
    <Route path="/companies/new" element={<CompanyFormPage />} />
    <Route path="/companies/:id/edit" element={<CompanyFormPage />} />

    {/* 실시간 모니터링 */}
    <Route path="/monitoring" element={<MonitoringPage />} />

    {/* 정산/청구 */}
    <Route path="/billing" element={<InvoicesListPage />} />
    <Route path="/billing/:id" element={<InvoiceDetailPage />} />

    {/* 분석 */}
    <Route path="/analytics" element={<AnalyticsPage />} />

    {/* 설정 */}
    <Route path="/settings" element={<SettingsPage />} />
  </Route>

  {/* 리다이렉트 */}
  <Route path="/" element={<Navigate to="/dashboard" />} />
  <Route path="*" element={<Navigate to="/dashboard" />} />
</Routes>
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
  "차트": {
    "recharts": "2.x (월별 수익, 예약 현황 차트)"
  },
  "지도": {
    "Google Maps API": "차량 위치 표시"
  },
  "날짜": {
    "date-fns": "날짜 포맷팅"
  }
}
```

---

## 환경 변수

```env
# .env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## 다음 단계 (API 연동)

1. **백엔드 API 연동**
   - Mock 데이터를 실제 API 호출로 교체
   - 에러 핸들링 개선

2. **실시간 기능**
   - WebSocket 연결로 차량 위치 실시간 업데이트
   - 알림 기능

3. **테스트**
   - 단위 테스트 (Vitest)
   - E2E 테스트 (Playwright)

4. **최적화**
   - 코드 스플리팅
   - 이미지 최적화
   - 번들 사이즈 최적화
