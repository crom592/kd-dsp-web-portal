import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  EventNote,
  DirectionsBus,
  AttachMoney,
} from '@mui/icons-material';
import { analyticsService } from '@/services/analyticsService';
import { format, subMonths } from 'date-fns';

const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState<string>('30');

  const startDate = format(subMonths(new Date(), parseInt(period) / 30), 'yyyy-MM-dd');
  const endDate = format(new Date(), 'yyyy-MM-dd');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', startDate, endDate],
    queryFn: () => analyticsService.getAnalytics({ startDate, endDate }),
  });

  const StatCard = ({
    title,
    value,
    icon,
    color,
    subtitle,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon as React.ReactElement, {
              sx: { fontSize: 24, color },
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <Typography>로딩 중...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          분석 및 리포트
        </Typography>
        <TextField
          select
          label="기간"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="7">최근 7일</MenuItem>
          <MenuItem value="30">최근 30일</MenuItem>
          <MenuItem value="90">최근 3개월</MenuItem>
          <MenuItem value="180">최근 6개월</MenuItem>
          <MenuItem value="365">최근 1년</MenuItem>
        </TextField>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 수익"
            value={`₩${(analytics?.totalRevenue || 0).toLocaleString()}`}
            icon={<AttachMoney />}
            color="#2e7d32"
            subtitle="전체 기간"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 예약"
            value={(analytics?.totalReservations || 0).toLocaleString()}
            icon={<EventNote />}
            color="#1976d2"
            subtitle="전체 기간"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 운행"
            value={(analytics?.totalRides || 0).toLocaleString()}
            icon={<DirectionsBus />}
            color="#ed6c02"
            subtitle="전체 기간"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="평균 평점"
            value={(analytics?.averageRating || 0).toFixed(1)}
            icon={<TrendingUp />}
            color="#9c27b0"
            subtitle="5.0 만점"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              월별 수익 추이
            </Typography>
            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">
                차트 컴포넌트 (Recharts 또는 Chart.js 사용)
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              인기 노선 TOP 5
            </Typography>
            <Box sx={{ mt: 2 }}>
              {analytics?.topRoutes?.slice(0, 5).map((route, index) => (
                <Box
                  key={route.routeId}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    borderBottom: index < 4 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: 'primary.main',
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="body2">{route.routeName}</Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {route.count}회
                  </Typography>
                </Box>
              ))}
              {(!analytics?.topRoutes || analytics.topRoutes.length === 0) && (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  데이터가 없습니다
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              예약 상태별 분포
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {analytics?.reservationsByStatus?.map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.status}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {item.status}
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {item.count.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage;
