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
  Alert,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, Cancel } from '@mui/icons-material';
import { reservationsService } from '@/services/reservationsService';
import { format } from 'date-fns';

const ReservationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: reservation, isLoading } = useQuery({
    queryKey: ['reservation', id],
    queryFn: () => reservationsService.getReservation(id!),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: () => reservationsService.cancelReservation(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation', id] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });

  if (isLoading) {
    return <Typography>로딩 중...</Typography>;
  }

  if (!reservation) {
    return <Typography>예약을 찾을 수 없습니다.</Typography>;
  }

  const statusMap = {
    PENDING: { label: '대기', color: 'warning' as const },
    CONFIRMED: { label: '확정', color: 'success' as const },
    CANCELLED: { label: '취소', color: 'error' as const },
    COMPLETED: { label: '완료', color: 'info' as const },
    NO_SHOW: { label: '노쇼', color: 'default' as const },
  };

  const canCancel = reservation.status === 'PENDING' || reservation.status === 'CONFIRMED';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/reservations')}>
            목록
          </Button>
          <Typography variant="h4" fontWeight={700}>
            예약 상세
          </Typography>
          <Chip
            label={statusMap[reservation.status].label}
            color={statusMap[reservation.status].color}
          />
        </Box>
        {canCancel && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<Cancel />}
            onClick={() => {
              if (confirm('예약을 취소하시겠습니까?')) {
                cancelMutation.mutate();
              }
            }}
            disabled={cancelMutation.isPending}
          >
            예약 취소
          </Button>
        )}
      </Box>

      {reservation.status === 'CANCELLED' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          이 예약은 취소되었습니다.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                예약 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    예약 ID
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {reservation.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    예약일
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {format(new Date(reservation.reservationDate), 'yyyy-MM-dd')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    노선
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {reservation.route?.name || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    생성일
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {format(new Date(reservation.createdAt), 'yyyy-MM-dd HH:mm')}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                사용자 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    이름
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {reservation.user?.name || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    이메일
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {reservation.user?.email || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    전화번호
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {reservation.user?.phone || '-'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                탑승 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <Typography variant="body2" gutterBottom>
                      탑승 정류장
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {reservation.boardingStop?.name || '-'}
                    </Typography>
                    <Typography variant="body2">
                      {reservation.boardingStop?.address || '-'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                    <Typography variant="body2" gutterBottom>
                      하차 정류장
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {reservation.alightingStop?.name || '-'}
                    </Typography>
                    <Typography variant="body2">
                      {reservation.alightingStop?.address || '-'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReservationDetailPage;
