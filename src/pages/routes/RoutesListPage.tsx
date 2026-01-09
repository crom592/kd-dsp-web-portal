import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Chip, TextField, MenuItem } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { routesService } from '@/services/routesService';
import { Route } from '@/types';

const RoutesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['routes', paginationModel.page, paginationModel.pageSize, statusFilter, searchQuery],
    queryFn: () =>
      routesService.getRoutes({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        status: statusFilter || undefined,
        search: searchQuery || undefined,
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

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="검색"
          placeholder="노선명 또는 코드 검색"
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
          <MenuItem value="ACTIVE">운행중</MenuItem>
          <MenuItem value="INACTIVE">미운행</MenuItem>
          <MenuItem value="SUSPENDED">중단</MenuItem>
        </TextField>
      </Box>

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
