import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface MonthlyRevenueData {
  month: string;
  revenue: number;
  previousRevenue?: number;
}

interface MonthlyRevenueChartProps {
  data?: MonthlyRevenueData[];
  isLoading?: boolean;
  height?: number;
  showComparison?: boolean;
}

// Mock data for demonstration
const generateMockData = (): MonthlyRevenueData[] => {
  const months = [
    '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
    '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
  ];

  return months.map((month, index) => {
    // Generate realistic revenue growth pattern
    const baseRevenue = 45000000 + index * 2500000;
    const variance = (Math.random() - 0.3) * 8000000;
    const revenue = Math.round(baseRevenue + variance);
    const previousRevenue = Math.round(revenue * (0.75 + Math.random() * 0.15));

    return {
      month,
      revenue,
      previousRevenue,
    };
  });
};

const formatMonth = (month: string): string => {
  const parts = month.split('-');
  const monthNum = parts[1];
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  return monthNames[parseInt(monthNum, 10) - 1] || month;
};

const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}억`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(0)}만`;
  }
  return value.toLocaleString();
};

const formatFullCurrency = (value: number): string => {
  return `₩${value.toLocaleString()}`;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const currentRevenue = payload.find((p) => p.dataKey === 'revenue');
  const previousRevenue = payload.find((p) => p.dataKey === 'previousRevenue');

  const growthRate = currentRevenue && previousRevenue
    ? ((currentRevenue.value - previousRevenue.value) / previousRevenue.value) * 100
    : null;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        border: '1px solid',
        borderColor: 'divider',
        minWidth: 200,
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {label ? formatMonth(label) : ''}
      </Typography>
      {currentRevenue && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: currentRevenue.color }} />
          <Typography variant="body2" color="text.secondary">
            당월 수익:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatFullCurrency(currentRevenue.value)}
          </Typography>
        </Box>
      )}
      {previousRevenue && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: previousRevenue.color }} />
          <Typography variant="body2" color="text.secondary">
            전년 동월:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatFullCurrency(previousRevenue.value)}
          </Typography>
        </Box>
      )}
      {growthRate !== null && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 1,
            pt: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          {growthRate >= 0 ? (
            <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
          ) : (
            <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
          )}
          <Typography
            variant="body2"
            fontWeight={600}
            color={growthRate >= 0 ? 'success.main' : 'error.main'}
          >
            {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}% 성장
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const MonthlyRevenueChart: React.FC<MonthlyRevenueChartProps> = ({
  data,
  isLoading = false,
  height = 350,
  showComparison = true,
}) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    if (data && data.length > 0) {
      return data;
    }
    return generateMockData();
  }, [data]);

  const stats = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { total: 0, average: 0, growth: 0, max: 0, maxMonth: '' };
    }

    const total = chartData.reduce((sum, item) => sum + item.revenue, 0);
    const average = total / chartData.length;
    const max = Math.max(...chartData.map((item) => item.revenue));
    const maxMonth = chartData.find((item) => item.revenue === max)?.month || '';

    // Calculate growth (last month vs first month)
    const firstMonth = chartData[0]?.revenue || 0;
    const lastMonth = chartData[chartData.length - 1]?.revenue || 0;
    const growth = firstMonth > 0 ? ((lastMonth - firstMonth) / firstMonth) * 100 : 0;

    return { total, average, growth, max, maxMonth };
  }, [chartData]);

  if (isLoading) {
    return (
      <Box sx={{ height }}>
        <Skeleton variant="rectangular" height={height - 80} sx={{ borderRadius: 2 }} />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Stats Summary */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            연간 총 수익
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {formatFullCurrency(stats.total)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            월 평균
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {formatFullCurrency(Math.round(stats.average))}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            성장률
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {stats.growth >= 0 ? (
              <TrendingUp sx={{ fontSize: 20, color: 'success.main' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 20, color: 'error.main' }} />
            )}
            <Typography
              variant="h6"
              fontWeight={700}
              color={stats.growth >= 0 ? 'success.main' : 'error.main'}
            >
              {stats.growth >= 0 ? '+' : ''}{stats.growth.toFixed(1)}%
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            최고 수익 월
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {formatMonth(stats.maxMonth)}
          </Typography>
        </Box>
      </Box>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
              <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.grey[400]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={theme.palette.grey[400]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={alpha(theme.palette.divider, 0.5)}
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonth}
            stroke={theme.palette.text.secondary}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatCurrency}
            stroke={theme.palette.text.secondary}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span style={{ color: theme.palette.text.primary, fontSize: 12 }}>
                {value === 'revenue' ? '당월 수익' : '전년 동월'}
              </span>
            )}
          />
          {showComparison && (
            <Area
              type="monotone"
              dataKey="previousRevenue"
              name="previousRevenue"
              stroke={theme.palette.grey[400]}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrevious)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
          )}
          <Area
            type="monotone"
            dataKey="revenue"
            name="revenue"
            stroke={theme.palette.primary.main}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2, fill: theme.palette.primary.main }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MonthlyRevenueChart;
