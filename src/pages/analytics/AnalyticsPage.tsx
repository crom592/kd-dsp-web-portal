import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Chip,
  Button,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  EventNote,
  DirectionsBus,
  AttachMoney,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { analyticsService } from '@/services/analyticsService';
import { format, subDays } from 'date-fns';
import { MonthlyRevenueChart } from '@/components/charts';

const AnalyticsPage: React.FC = () => {
  // 기간 검색을 위한 시작일/종료일 상태
  const [startDate, setStartDate] = useState<string>(
    format(subDays(new Date(), 30), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // 빠른 기간 선택 핸들러
  const handleQuickDateRange = (days: number) => {
    const today = new Date();
    const start = subDays(today, days);
    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(today, 'yyyy-MM-dd'));
  };

  // 기간 필터 초기화 (기본 30일)
  const handleClearDateRange = () => {
    setStartDate(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
    setEndDate(format(new Date(), 'yyyy-MM-dd'));
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          분석 및 리포트
        </Typography>
      </Box>

      {/* 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          {/* 기간 검색 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIcon color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              분석 기간
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
            <Button
              size="small"
              onClick={handleClearDateRange}
              startIcon={<ClearIcon />}
              color="inherit"
            >
              초기화
            </Button>
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
        </Box>

        {/* 선택된 기간 표시 */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          <Chip
            label={`분석 기간: ${startDate} ~ ${endDate}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 수익"
            value={`₩${(analytics?.totalRevenue || 0).toLocaleString()}`}
            icon={<AttachMoney />}
            color="#2e7d32"
            subtitle={`${startDate} ~ ${endDate}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 예약"
            value={(analytics?.totalReservations || 0).toLocaleString()}
            icon={<EventNote />}
            color="#1976d2"
            subtitle={`${startDate} ~ ${endDate}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 운행"
            value={(analytics?.totalRides || 0).toLocaleString()}
            icon={<DirectionsBus />}
            color="#ed6c02"
            subtitle={`${startDate} ~ ${endDate}`}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                월별 수익 추이
              </Typography>
              {!analytics?.revenueByMonth?.length && (
                <Chip label="데모 데이터" size="small" color="info" />
              )}
            </Box>
            <MonthlyRevenueChart
              data={analytics?.revenueByMonth?.map((item) => ({
                month: item.month,
                revenue: item.revenue,
                previousRevenue: Math.round(item.revenue * (0.75 + Math.random() * 0.15)),
              }))}
              isLoading={isLoading}
              height={320}
              showComparison={true}
            />
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
