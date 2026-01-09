import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Chip, TextField, MenuItem } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { billingService } from '@/services/billingService';
import { Invoice } from '@/types';
import { format } from 'date-fns';

const InvoicesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', paginationModel.page, paginationModel.pageSize, statusFilter],
    queryFn: () =>
      billingService.getInvoices({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        status: statusFilter || undefined,
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
      valueGetter: (_value, row) => row.company?.name || '-',
    },
    {
      field: 'billingPeriodStart',
      headerName: '청구 기간',
      flex: 1,
      minWidth: 200,
      valueGetter: (_value, row) => {
        const start = format(new Date(row.billingPeriodStart), 'yyyy-MM-dd');
        const end = format(new Date(row.billingPeriodEnd), 'yyyy-MM-dd');
        return `${start} ~ ${end}`;
      },
    },
    {
      field: 'amount',
      headerName: '금액',
      width: 150,
      valueGetter: (value) => `₩${value.toLocaleString()}`,
    },
    {
      field: 'dueDate',
      headerName: '납부 기한',
      width: 120,
      valueGetter: (value) => format(new Date(value), 'yyyy-MM-dd'),
    },
    {
      field: 'status',
      headerName: '상태',
      width: 120,
      renderCell: (params) => {
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

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          select
          label="상태"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">전체</MenuItem>
          <MenuItem value="PENDING">대기</MenuItem>
          <MenuItem value="PAID">완료</MenuItem>
          <MenuItem value="OVERDUE">연체</MenuItem>
          <MenuItem value="CANCELLED">취소</MenuItem>
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
          onRowClick={(params) => navigate(`/billing/invoices/${params.id}`)}
          sx={{ cursor: 'pointer' }}
        />
      </Paper>
    </Box>
  );
};

export default InvoicesListPage;
