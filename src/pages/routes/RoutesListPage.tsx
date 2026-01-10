import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  TextField,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { Add, Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { routesService } from '@/services/routesService';
import { Route } from '@/types';
import { format, subDays } from 'date-fns';

const RoutesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 기간 검색을 위한 시작일/종료일 상태 (기본값: 최근 90일)
  const [startDate, setStartDate] = useState<string>(() => format(subDays(new Date(), 90), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(() => format(new Date(), 'yyyy-MM-dd'));

  // 빠른 기간 선택 핸들러
  const handleQuickDateRange = (days: number) => {
    const today = new Date();
    const start = subDays(today, days);
    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(today, 'yyyy-MM-dd'));
  };

  // 기간 필터 초기화
  const handleClearDateRange = () => {
    setStartDate('');
    setEndDate('');
  };

  const { data, isLoading } = useQuery({
    queryKey: ['routes', paginationModel.page, paginationModel.pageSize, statusFilter, searchQuery, startDate, endDate],
    queryFn: () =>
      routesService.getRoutes({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        status: statusFilter || undefined,
        search: searchQuery || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }),
  });

  const columns: GridColDef<Route>[] = [
    {
      field: 'code',
      headerName: '노선 코드',
      width: 120,
    },
    {
      field: 'name',
      headerName: '노선명',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'type',
      headerName: '유형',
      width: 120,
      renderCell: (params: GridRenderCellParams<Route, string>) => (
        <Chip
          label={params.value === 'COMMUTE' ? '출퇴근' : 'DRT'}
          size="small"
          color={params.value === 'COMMUTE' ? 'primary' : 'secondary'}
        />
      ),
    },
    {
      field: 'status',
      headerName: '상태',
      width: 120,
      renderCell: (params: GridRenderCellParams<Route, string>) => {
        const statusMap = {
          ACTIVE: { label: '운행중', color: 'success' as const },
          INACTIVE: { label: '미운행', color: 'default' as const },
          SUSPENDED: { label: '중단', color: 'error' as const },
        };
        const status = statusMap[params.value as keyof typeof statusMap];
        return <Chip label={status.label} size="small" color={status.color} />;
      },
    },
    {
      field: 'company',
      headerName: '기업',
      flex: 1,
      minWidth: 150,
      valueGetter: (_value: unknown, row: Route) => row.company?.name || '-',
    },
    {
      field: 'stops',
      headerName: '정류장 수',
      width: 100,
      valueGetter: (_value: unknown, row: Route) => row.stops?.length || 0,
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          노선 관리
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/routes/new')}>
          노선 추가
        </Button>
      </Box>

      {/* 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          {/* 검색 */}
          <TextField
            label="검색"
            placeholder="노선명 또는 코드"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          />

          {/* 기간 검색 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIcon color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              등록 기간
            </Typography>
            <TextField
              type="date"
              label="시작일"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ width: 160 }}
              inputProps={{
                max: endDate || undefined,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              ~
            </Typography>
            <TextField
              type="date"
              label="종료일"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ width: 160 }}
              inputProps={{
                min: startDate || undefined,
              }}
            />
            {(startDate || endDate) && (
              <Button
                size="small"
                onClick={handleClearDateRange}
                startIcon={<ClearIcon />}
                color="inherit"
              >
                초기화
              </Button>
            )}
          </Box>

          {/* 빠른 기간 선택 */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleQuickDateRange(7)}
              sx={{ minWidth: 'auto', px: 1.5 }}
            >
              최근 7일
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleQuickDateRange(30)}
              sx={{ minWidth: 'auto', px: 1.5 }}
            >
              최근 30일
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleQuickDateRange(90)}
              sx={{ minWidth: 'auto', px: 1.5 }}
            >
              최근 3개월
            </Button>
          </Box>

          {/* 상태 필터 */}
          <TextField
            select
            label="상태"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="ACTIVE">운행중</MenuItem>
            <MenuItem value="INACTIVE">미운행</MenuItem>
            <MenuItem value="SUSPENDED">중단</MenuItem>
          </TextField>
        </Box>

        {/* 선택된 필터 표시 */}
        {(startDate || endDate || statusFilter || searchQuery) && (
          <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
            {searchQuery && (
              <Chip
                label={`검색: ${searchQuery}`}
                onDelete={() => setSearchQuery('')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {(startDate || endDate) && (
              <Chip
                label={`기간: ${startDate || '시작일 없음'} ~ ${endDate || '종료일 없음'}`}
                onDelete={handleClearDateRange}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {statusFilter && (
              <Chip
                label={`상태: ${
                  {
                    ACTIVE: '운행중',
                    INACTIVE: '미운행',
                    SUSPENDED: '중단',
                  }[statusFilter]
                }`}
                onDelete={() => setStatusFilter('')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Paper>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={data?.data || []}
          columns={columns}
          loading={isLoading}
          paginationMode="server"
          rowCount={data?.meta?.total || 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 50]}
          onRowClick={(params: { id: string | number }) => navigate(`/routes/${params.id}`)}
          sx={{ cursor: 'pointer' }}
        />
      </Paper>
    </Box>
  );
};

export default RoutesListPage;
