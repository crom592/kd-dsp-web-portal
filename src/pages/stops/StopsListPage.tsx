import React, { useState } from 'react';
import { Box, Typography, Button, Paper, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { stopsService } from '@/services/stopsService';
import { RouteStop } from '@/types';

const StopsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['stops', paginationModel.page, paginationModel.pageSize, searchQuery],
    queryFn: () =>
      stopsService.getStops({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: searchQuery || undefined,
      }),
  });

  const columns: GridColDef<RouteStop>[] = [
    {
      field: 'name',
      headerName: '정류장명',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'address',
      headerName: '주소',
      flex: 2,
      minWidth: 300,
    },
    {
      field: 'latitude',
      headerName: '위도',
      width: 120,
    },
    {
      field: 'longitude',
      headerName: '경도',
      width: 120,
    },
    {
      field: 'sequence',
      headerName: '순서',
      width: 80,
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          정류장 관리
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/stops/new')}>
          정류장 추가
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="검색"
          placeholder="정류장명 또는 주소 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 300 }}
        />
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
          onRowClick={(params: { id: string | number }) => navigate(`/stops/${params.id}/edit`)}
          sx={{ cursor: 'pointer' }}
        />
      </Paper>
    </Box>
  );
};

export default StopsListPage;
