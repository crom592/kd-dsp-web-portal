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
import { usersService } from '@/services/usersService';
import { User, UserRole } from '@/types';
import { ROLE_DISPLAY_NAMES } from '@/constants';
import { format, subDays } from 'date-fns';

const UsersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    queryKey: ['users', paginationModel.page, paginationModel.pageSize, roleFilter, searchQuery, startDate, endDate],
    queryFn: () =>
      usersService.getUsers({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        role: roleFilter || undefined,
        search: searchQuery || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
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

      {/* 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          {/* 검색 */}
          <TextField
            label="검색"
            placeholder="이름 또는 이메일"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          />

          {/* 기간 검색 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIcon color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              가입 기간
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

          {/* 역할 필터 */}
          <TextField
            select
            label="역할"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="RIDER">탑승자</MenuItem>
            <MenuItem value="DRIVER">운전자</MenuItem>
            <MenuItem value="COMPANY_ADMIN">기업 관리자</MenuItem>
            <MenuItem value="KD_OPERATOR">KD 운영자</MenuItem>
          </TextField>
        </Box>

        {/* 선택된 필터 표시 */}
        {(startDate || endDate || roleFilter || searchQuery) && (
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
            {roleFilter && (
              <Chip
                label={`역할: ${
                  {
                    RIDER: '탑승자',
                    DRIVER: '운전자',
                    COMPANY_ADMIN: '기업 관리자',
                    KD_OPERATOR: 'KD 운영자',
                  }[roleFilter]
                }`}
                onDelete={() => setRoleFilter('')}
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
          onRowClick={(params: { id: string | number }) => navigate(`/users/${params.id}/edit`)}
          sx={{ cursor: 'pointer' }}
        />
      </Paper>
    </Box>
  );
};

export default UsersListPage;
