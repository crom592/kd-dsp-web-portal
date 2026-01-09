import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Chip, TextField, MenuItem } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usersService } from '@/services/usersService';
import { User, UserRole } from '@/types';
import { ROLE_DISPLAY_NAMES } from '@/constants';

const UsersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['users', paginationModel.page, paginationModel.pageSize, roleFilter, searchQuery],
    queryFn: () =>
      usersService.getUsers({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        role: roleFilter || undefined,
        search: searchQuery || undefined,
      }),
  });

  const columns: GridColDef<User>[] = [
    {
      field: 'name',
      headerName: '이름',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'email',
      headerName: '이메일',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'phone',
      headerName: '전화번호',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'role',
      headerName: '역할',
      width: 150,
      renderCell: (params: GridRenderCellParams<User, UserRole>) => {
        const roleColors: Record<UserRole, 'primary' | 'secondary' | 'success' | 'warning'> = {
          RIDER: 'primary',
          DRIVER: 'secondary',
          COMPANY_ADMIN: 'warning',
          KD_OPERATOR: 'success',
        };
        return (
          <Chip
            label={ROLE_DISPLAY_NAMES[params.value as UserRole]}
            size="small"
            color={roleColors[params.value as UserRole]}
          />
        );
      },
    },
    {
      field: 'company',
      headerName: '소속 기업',
      flex: 1,
      minWidth: 150,
      valueGetter: (_value: unknown, row: User) => row.company?.name || '-',
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          사용자 관리
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/users/new')}>
          사용자 추가
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="검색"
          placeholder="이름 또는 이메일 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <TextField
          select
          label="역할"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">전체</MenuItem>
          <MenuItem value="RIDER">탑승자</MenuItem>
          <MenuItem value="DRIVER">운전자</MenuItem>
          <MenuItem value="COMPANY_ADMIN">기업 관리자</MenuItem>
          <MenuItem value="KD_OPERATOR">KD 운영자</MenuItem>
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
          onRowClick={(params: { id: string | number }) => navigate(`/users/${params.id}/edit`)}
          sx={{ cursor: 'pointer' }}
        />
      </Paper>
    </Box>
  );
};

export default UsersListPage;
