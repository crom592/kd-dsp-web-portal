import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Skeleton,
  Grid,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface ReservationStatusData {
  status: string;
  count: number;
  label?: string;
}

interface DailyReservationData {
  date: string;
  count: number;
  confirmed: number;
  cancelled: number;
}

interface ReservationStatusChartProps {
  statusData?: ReservationStatusData[];
  dailyData?: DailyReservationData[];
  isLoading?: boolean;
  height?: number;
  showDaily?: boolean;
}

// Status labels and colors
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: '대기', color: '#ff9800' },
  CONFIRMED: { label: '확정', color: '#4caf50' },
  CANCELLED: { label: '취소', color: '#f44336' },
  COMPLETED: { label: '완료', color: '#2196f3' },
  NO_SHOW: { label: '미탑승', color: '#9e9e9e' },
};

// Generate mock status data
const generateMockStatusData = (): ReservationStatusData[] => [
  { status: 'CONFIRMED', count: 156, label: '확정' },
  { status: 'COMPLETED', count: 342, label: '완료' },
  { status: 'PENDING', count: 45, label: '대기' },
  { status: 'CANCELLED', count: 28, label: '취소' },
  { status: 'NO_SHOW', count: 12, label: '미탑승' },
];

// Generate mock daily data for the last 7 days
const generateMockDailyData = (): DailyReservationData[] => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    const dayName = days[date.getDay()];
    const confirmed = Math.floor(Math.random() * 50) + 30;
    const cancelled = Math.floor(Math.random() * 10) + 2;

    return {
      date: dayName,
      count: confirmed + cancelled,
      confirmed,
      cancelled,
    };
  });
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: ReservationStatusData;
  }>;
}

const PieTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0];
  const config = STATUS_CONFIG[data.payload.status] || { label: data.payload.status, color: '#999' };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 1.5,
        borderRadius: 1,
        boxShadow: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: config.color }} />
        <Typography variant="body2" fontWeight={600}>
          {config.label}
        </Typography>
      </Box>
      <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
        {data.value.toLocaleString()}건
      </Typography>
    </Box>
  );
};

interface BarTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

const BarTooltip: React.FC<BarTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 1.5,
        borderRadius: 1,
        boxShadow: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {label}요일
      </Typography>
      {payload.map((item) => (
        <Box key={item.dataKey} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: item.color }} />
          <Typography variant="body2" color="text.secondary">
            {item.dataKey === 'confirmed' ? '확정' : '취소'}:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {item.value}건
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const ReservationStatusChart: React.FC<ReservationStatusChartProps> = ({
  statusData,
  dailyData,
  isLoading = false,
  height = 280,
  showDaily = true,
}) => {
  const theme = useTheme();

  const pieData = useMemo(() => {
    if (statusData && statusData.length > 0) {
      return statusData.map((item) => ({
        ...item,
        label: STATUS_CONFIG[item.status]?.label || item.status,
      }));
    }
    return generateMockStatusData();
  }, [statusData]);

  const barData = useMemo(() => {
    if (dailyData && dailyData.length > 0) {
      return dailyData;
    }
    return generateMockDailyData();
  }, [dailyData]);

  const totalReservations = useMemo(() => {
    return pieData.reduce((sum, item) => sum + item.count, 0);
  }, [pieData]);

  const confirmedRate = useMemo(() => {
    const confirmed = pieData.find((item) => item.status === 'CONFIRMED' || item.status === 'COMPLETED');
    const completed = pieData.find((item) => item.status === 'COMPLETED');
    const total = (confirmed?.count || 0) + (completed?.count || 0);
    return totalReservations > 0 ? ((total / totalReservations) * 100).toFixed(1) : '0';
  }, [pieData, totalReservations]);

  if (isLoading) {
    return (
      <Box sx={{ height }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="circular" width={180} height={180} sx={{ mx: 'auto' }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    if (percent < 0.05) return null; // Don't show label for small slices

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: 12, fontWeight: 600 }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box>
      {/* Summary Stats */}
      <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            전체 예약
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {totalReservations.toLocaleString()}건
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            확정률
          </Typography>
          <Typography variant="h5" fontWeight={700} color="success.main">
            {confirmedRate}%
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {/* Pie Chart - Status Distribution */}
        <Grid item xs={12} md={showDaily ? 5 : 12}>
          <Box sx={{ height: height - 40 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              상태별 분포
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={80}
                  innerRadius={40}
                  dataKey="count"
                  paddingAngle={2}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_CONFIG[entry.status]?.color || '#999'}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => {
                    const item = pieData.find((d) => d.status === value);
                    return (
                      <span style={{ color: theme.palette.text.primary, fontSize: 11 }}>
                        {item?.label || value}
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Bar Chart - Daily Trend */}
        {showDaily && (
          <Grid item xs={12} md={7}>
            <Box sx={{ height: height - 40 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                최근 7일 예약 추이
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke={theme.palette.text.secondary}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip content={<BarTooltip />} />
                  <Bar
                    dataKey="confirmed"
                    name="confirmed"
                    fill={STATUS_CONFIG.CONFIRMED.color}
                    radius={[4, 4, 0, 0]}
                    stackId="stack"
                  />
                  <Bar
                    dataKey="cancelled"
                    name="cancelled"
                    fill={STATUS_CONFIG.CANCELLED.color}
                    radius={[4, 4, 0, 0]}
                    stackId="stack"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ReservationStatusChart;
