import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Chip, TextField, MenuItem } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { vehiclesService } from '@/services/vehiclesService';
import { Vehicle } from '@/types';

const VehiclesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', paginationModel.page, paginationModel.pageSize, statusFilter, searchQuery],
    queryFn: () =>
      vehiclesService.getVehicles({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        status: statusFilter || undefined,
        search: searchQuery || undefined,
      }),
  });

  const columns: GridColDef<Vehicle>[] = [
    {
      field: 'plateNumber',
      headerName: '차량번호',
      width: 150,
    },
    {
      field: 'model',
      headerName: '모델',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'capacity',
      headerName: '정원',
      width: 100,
      valueGetter: (value: number) => `${value}명`,
    },
    {
      field: 'status',
      headerName: '상태',
      width: 120,
      renderCell: (params: GridRenderCellParams<Vehicle, string>) => {
        const statusMap = {
          AVAILABLE: { label: '대기중', color: 'success' as const },
          IN_SERVICE: { label: '운행중', color: 'primary' as const },
          MAINTENANCE: { label: '정비중', color: 'warning' as const },
          INACTIVE: { label: '미사용', color: 'default' as const },
        };
        const status = statusMap[params.value as keyof typeof statusMap];
        return <Chip label={status.label} size="small" color={status.color} />;
      },
    },
    {
      field: 'driver',
      headerName: '배정 기사',
      flex: 1,
      minWidth: 150,
      valueGetter: (_value: unknown, row: Vehicle) => row.driver?.user?.name || '-',
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          차량 관리
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/vehicles/new')}>
          차량 추가
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="검색"
          placeholder="차량번호 또는 모델 검색"
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
          <MenuItem value="IN_SERVICE">운행중</MenuItem>
          <MenuItem value="MAINTENANCE">정비중</MenuItem>
          <MenuItem value="INACTIVE">미사용</MenuItem>
        </TextField>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={data?.data || []}
          columns={columns}
          loading={isLoading}
          paginationMode="server"
          rowCount={data?.meta.total || 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 50]}
          onRowClick={(params: { id: string | number }) => navigate(`/vehicles/${params.id}/edit`)}
          sx={{ cursor: 'pointer' }}
        />
      </Paper>
    </Box>
  );
};

export default VehiclesListPage;
