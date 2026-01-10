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
import { billingService } from '@/services/billingService';
import { Invoice } from '@/types';
import { format, subDays } from 'date-fns';

const InvoicesListPage: React.FC = () => {
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
    queryKey: ['invoices', paginationModel.page, paginationModel.pageSize, statusFilter, startDate, endDate],
    queryFn: () =>
      billingService.getInvoices({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        status: statusFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }),
  });

  const columns: GridColDef<Invoice>[] = [
    {
      field: 'invoiceNumber',
      headerName: '청구서 번호',
      width: 150,
    },
    {
      field: 'company',
      headerName: '기업',
      flex: 1,
      minWidth: 200,
      valueGetter: (_value: unknown, row: Invoice) => row.company?.name || '-',
    },
    {
      field: 'billingPeriodStart',
      headerName: '청구 기간',
      flex: 1,
      minWidth: 200,
      valueGetter: (_value: unknown, row: Invoice) => {
        const start = format(new Date(row.billingPeriodStart), 'yyyy-MM-dd');
        const end = format(new Date(row.billingPeriodEnd), 'yyyy-MM-dd');
        return `${start} ~ ${end}`;
      },
    },
    {
      field: 'amount',
      headerName: '금액',
      width: 150,
      valueGetter: (value: number) => `₩${value.toLocaleString()}`,
    },
    {
      field: 'dueDate',
      headerName: '납부 기한',
      width: 120,
      valueGetter: (value: string) => format(new Date(value), 'yyyy-MM-dd'),
    },
    {
      field: 'status',
      headerName: '상태',
      width: 120,
      renderCell: (params: GridRenderCellParams<Invoice, string>) => {
        const statusMap = {
          PENDING: { label: '대기', color: 'warning' as const },
          PAID: { label: '완료', color: 'success' as const },
          OVERDUE: { label: '연체', color: 'error' as const },
          CANCELLED: { label: '취소', color: 'default' as const },
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
          청구 관리
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/billing/invoices/new')}>
          청구서 생성
        </Button>
      </Box>

      {/* 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          {/* 기간 검색 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIcon color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              청구 기간
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
              onClick={() => handleQuickDateRange(30)}
              sx={{ minWidth: 'auto', px: 1.5 }}
            >
              최근 1개월
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleQuickDateRange(90)}
              sx={{ minWidth: 'auto', px: 1.5 }}
            >
              최근 3개월
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleQuickDateRange(180)}
              sx={{ minWidth: 'auto', px: 1.5 }}
            >
              최근 6개월
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleQuickDateRange(365)}
              sx={{ minWidth: 'auto', px: 1.5 }}
            >
              최근 1년
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
            <MenuItem value="PAID">완료</MenuItem>
            <MenuItem value="OVERDUE">연체</MenuItem>
            <MenuItem value="CANCELLED">취소</MenuItem>
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
                    PAID: '완료',
                    OVERDUE: '연체',
                    CANCELLED: '취소',
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
          onRowClick={(params: { id: string | number }) => navigate(`/billing/invoices/${params.id}`)}
          sx={{ cursor: 'pointer' }}
        />
      </Paper>
    </Box>
  );
};

export default InvoicesListPage;
