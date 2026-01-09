import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, TextField, MenuItem } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { reservationsService } from '@/services/reservationsService';
import { Reservation } from '@/types';
import { format } from 'date-fns';

const ReservationsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['reservations', page, pageSize, statusFilter, dateFilter],
    queryFn: () =>
      reservationsService.getReservations({
        page: page + 1,
        limit: pageSize,
        status: statusFilter || undefined,
        date: dateFilter || undefined,
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
      valueGetter: (value, row) => row.user?.name || '-',
    },
    {
      field: 'route',
      headerName: '노선',
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row.route?.name || '-',
    },
    {
      field: 'reservationDate',
      headerName: '예약일',
      width: 120,
      valueGetter: (value) => format(new Date(value), 'yyyy-MM-dd'),
    },
    {
      field: 'boardingStop',
      headerName: '탑승 정류장',
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row.boardingStop?.name || '-',
    },
    {
      field: 'alightingStop',
      headerName: '하차 정류장',
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row.alightingStop?.name || '-',
    },
    {
      field: 'status',
      headerName: '상태',
      width: 120,
      renderCell: (params) => {
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

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          type="date"
          label="예약일"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />
        <TextField
          select
          label="상태"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">전체</MenuItem>
          <MenuItem value="PENDING">대기</MenuItem>
          <MenuItem value="CONFIRMED">확정</MenuItem>
          <MenuItem value="CANCELLED">취소</MenuItem>
          <MenuItem value="COMPLETED">완료</MenuItem>
          <MenuItem value="NO_SHOW">노쇼</MenuItem>
        </TextField>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={data?.data || []}
          columns={columns}
          loading={isLoading}
          paginationMode="server"
          rowCount={data?.meta.total || 0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 20, 50]}
          onRowClick={(params) => navigate(`/reservations/${params.id}`)}
          sx={{ cursor: 'pointer' }}
        />
      </Paper>
    </Box>
  );
};

export default ReservationsListPage;
