import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, Payment as PaymentIcon, Download } from '@mui/icons-material';
import { billingService } from '@/services/billingService';
import { format } from 'date-fns';

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => billingService.getInvoice(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <Typography>로딩 중...</Typography>;
  }

  if (!invoice) {
    return <Typography>청구서를 찾을 수 없습니다.</Typography>;
  }

  const statusMap = {
    PENDING: { label: '대기', color: 'warning' as const },
    PAID: { label: '완료', color: 'success' as const },
    OVERDUE: { label: '연체', color: 'error' as const },
    CANCELLED: { label: '취소', color: 'default' as const },
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/billing/invoices')}>
            목록
          </Button>
          <Typography variant="h4" fontWeight={700}>
            청구서 상세
          </Typography>
          <Chip label={statusMap[invoice.status].label} color={statusMap[invoice.status].color} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {invoice.status === 'PENDING' && (
            <Button variant="contained" startIcon={<PaymentIcon />}>
              결제 처리
            </Button>
          )}
          <Button variant="outlined" startIcon={<Download />}>
            PDF 다운로드
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                청구 정보
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    청구서 번호
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {invoice.invoiceNumber}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    발행일
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {format(new Date(invoice.createdAt), 'yyyy-MM-dd')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    청구 기간
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {format(new Date(invoice.billingPeriodStart), 'yyyy-MM-dd')} ~{' '}
                    {format(new Date(invoice.billingPeriodEnd), 'yyyy-MM-dd')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    납부 기한
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {format(new Date(invoice.dueDate), 'yyyy-MM-dd')}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>항목</TableCell>
                      <TableCell align="right">수량</TableCell>
                      <TableCell align="right">단가</TableCell>
                      <TableCell align="right">금액</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>서비스 이용료</TableCell>
                      <TableCell align="right">1</TableCell>
                      <TableCell align="right">₩{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell align="right">₩{invoice.amount.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="h6" fontWeight={700}>
                          총 금액
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" fontWeight={700} color="primary">
                          ₩{invoice.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                기업 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  기업명
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {invoice.company?.name || '-'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  기업 코드
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {invoice.company?.code || '-'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  담당자 이메일
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {invoice.company?.contactEmail || '-'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  담당자 전화
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {invoice.company?.contactPhone || '-'}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {invoice.paidAt && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="success.main">
                  결제 완료
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  결제일
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {format(new Date(invoice.paidAt), 'yyyy-MM-dd HH:mm')}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceDetailPage;
