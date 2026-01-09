import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Chip, TextField, MenuItem } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { driversService } from '@/services/driversService';
import { Driver } from '@/types';
import { format } from 'date-fns';

const DriversListPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['drivers', page, pageSize, statusFilter, searchQuery],
    queryFn: () =>
      driversService.getDrivers({
        page: page + 1,
        limit: pageSize,
        status: statusFilter || undefined,
        search: searchQuery || undefined,
      }),
  });

  const columns: GridColDef<Driver>[] = [
    {
      field: 'user',
      headerName: '이름',
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row.user?.name || '-',
    },
    {
      field: 'phone',
      headerName: '전화번호',
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row.user?.phone || '-',
    },
    {
      field: 'licenseNumber',
      headerName: '면허번호',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'licenseExpiry',
      headerName: '면허 만료일',
      width: 120,
      valueGetter: (value) => format(new Date(value), 'yyyy-MM-dd'),
    },
    {
      field: 'status',
      headerName: '상태',
      width: 120,
      renderCell: (params) => {
        const statusMap = {
          AVAILABLE: { label: '대기중', color: 'success' as const },
          ON_DUTY: { label: '근무중', color: 'primary' as const },
          OFF_DUTY: { label: '비근무', color: 'default' as const },
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
          기사 관리
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/drivers/new')}>
          기사 추가
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="검색"
          placeholder="이름 또는 면허번호 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <TextField
          select
          label="상태"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">전체</MenuItem>
          <MenuItem value="AVAILABLE">대기중</MenuItem>
          <MenuItem value="ON_DUTY">근무중</MenuItem>
          <MenuItem value="OFF_DUTY">비근무</MenuItem>
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
          onRowClick={(params) => navigate(`/drivers/${params.id}/edit`)}
          sx={{ cursor: 'pointer' }}
        />
      </Paper>
    </Box>
  );
};

export default DriversListPage;
