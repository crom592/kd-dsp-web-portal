import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { reservationsService } from '@/services/reservationsService';
import { Reservation } from '@/types';
import { format, subDays } from 'date-fns';

const ReservationsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [statusFilter, setStatusFilter] = useState<string>('');

  // 기간 검색을 위한 시작일/종료일 상태
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

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
    queryKey: ['reservations', paginationModel.page, paginationModel.pageSize, statusFilter, startDate, endDate],
    queryFn: () =>
      reservationsService.getReservations({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        status: statusFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }),
  });

  const columns: GridColDef<Reservation>[] = [
    {
      field: 'id',
      headerName: '예약 ID',
      width: 120,
    },
    {
      field: 'user',
      headerName: '사용자',
      flex: 1,
      minWidth: 150,
      valueGetter: (_value: unknown, row: Reservation) => row.user?.name || '-',
    },
    {
      field: 'route',
      headerName: '노선',
      flex: 1,
      minWidth: 150,
      valueGetter: (_value: unknown, row: Reservation) => row.route?.name || '-',
    },
    {
      field: 'reservationDate',
      headerName: '예약일',
      width: 120,
      valueGetter: (value: string) => format(new Date(value), 'yyyy-MM-dd'),
    },
    {
      field: 'boardingStop',
      headerName: '탑승 정류장',
      flex: 1,
      minWidth: 150,
      valueGetter: (_value: unknown, row: Reservation) => row.boardingStop?.name || '-',
    },
    {
      field: 'alightingStop',
      headerName: '하차 정류장',
      flex: 1,
      minWidth: 150,
      valueGetter: (_value: unknown, row: Reservation) => row.alightingStop?.name || '-',
    },
    {
      field: 'status',
      headerName: '상태',
      width: 120,
      renderCell: (params: GridRenderCellParams<Reservation, string>) => {
        const statusMap = {
          PENDING: { label: '대기', color: 'warning' as const },
          CONFIRMED: { label: '확정', color: 'success' as const },
          CANCELLED: { label: '취소', color: 'error' as const },
          COMPLETED: { label: '완료', color: 'info' as const },
          NO_SHOW: { label: '노쇼', color: 'default' as const },
        };
        const status = statusMap[params.value as keyof typeof statusMap];
        return <Chip label={status.label} size="small" color={status.color} />;
      },
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          예약 관리
        </Typography>
      </Box>

      {/* 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          {/* 기간 검색 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIcon color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              예약 기간
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
              onClick={() => handleQuickDateRange(0)}
              sx={{ minWidth: 'auto', px: 1.5 }}
            >
              오늘
            </Button>
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
            <MenuItem value="PENDING">대기</MenuItem>
            <MenuItem value="CONFIRMED">확정</MenuItem>
            <MenuItem value="CANCELLED">취소</MenuItem>
            <MenuItem value="COMPLETED">완료</MenuItem>
            <MenuItem value="NO_SHOW">노쇼</MenuItem>
          </TextField>
        </Box>

        {/* 선택된 필터 표시 */}
        {(startDate || endDate || statusFilter) && (
          <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
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
                    PENDING: '대기',
                    CONFIRMED: '확정',
                    CANCELLED: '취소',
                    COMPLETED: '완료',
                    NO_SHOW: '노쇼',
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
          onRowClick={(params: { id: string | number }) => navigate(`/reservations/${params.id}`)}
          sx={{ cursor: 'pointer' }}
        />
      </Paper>
    </Box>
  );
};

export default ReservationsListPage;
