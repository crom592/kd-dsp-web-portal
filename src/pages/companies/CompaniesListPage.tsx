import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Chip, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { companiesService } from '@/services/companiesService';
import { Company } from '@/types';

const CompaniesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['companies', paginationModel.page, paginationModel.pageSize, searchQuery],
    queryFn: () =>
      companiesService.getCompanies({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: searchQuery || undefined,
      }),
  });

  const columns: GridColDef<Company>[] = [
    {
      field: 'name',
      headerName: '기업명',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'code',
      headerName: '기업 코드',
      width: 150,
    },
    {
      field: 'contactEmail',
      headerName: '담당자 이메일',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'contactPhone',
      headerName: '담당자 전화',
      width: 150,
    },
    {
      field: 'isActive',
      headerName: '상태',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? '활성' : '비활성'}
          size="small"
          color={params.value ? 'success' : 'default'}
        />
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          기업 관리
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/companies/new')}>
          기업 추가
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="검색"
          placeholder="기업명 또는 코드 검색"
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
          onRowClick={(params) => navigate(`/companies/${params.id}/edit`)}
          sx={{ cursor: 'pointer' }}
        />
      </Paper>
    </Box>
  );
};

export default CompaniesListPage;
