import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  DirectionsBus,
  Route,
  People,
  EventNote,
  TrendingUp,
  Speed,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/store';
import { ROLE_DISPLAY_NAMES } from '@/constants';
import { dashboardService } from '@/services/dashboardService';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  return (
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
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="caption" color="success.main">
                  {trend}
                </Typography>
              </Box>
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
};

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">데이터를 불러오는데 실패했습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.name || 'User'}! Here is your platform overview.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Vehicles"
            value={stats.totalVehicles ?? 0}
            icon={<DirectionsBus />}
            color="#1976d2"
            trend="+3 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Vehicles"
            value={stats.activeVehicles ?? 0}
            icon={<Speed />}
            color="#2e7d32"
            trend="84% utilization"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Routes"
            value={`${stats.activeRoutes ?? 0}/${stats.totalRoutes ?? 0}`}
            icon={<Route />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Reservations"
            value={stats.todayReservations ?? 0}
            icon={<EventNote />}
            color="#9c27b0"
            trend="+12% vs yesterday"
          />
        </Grid>
      </Grid>

      {/* Additional Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Real-time Vehicle Locations
            </Typography>
            <Box
              sx={{
                height: 320,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.default',
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Map component will be integrated here
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Stats
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <People sx={{ color: 'primary.main' }} />
                  <Typography variant="body2">Total Riders</Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {(stats.totalRiders ?? 0).toLocaleString()}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TrendingUp sx={{ color: 'success.main' }} />
                  <Typography variant="body2">Avg. Occupancy</Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {stats.averageOccupancy ?? 0}%
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <EventNote sx={{ color: 'secondary.main' }} />
                  <Typography variant="body2">Your Role</Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {user?.role ? ROLE_DISPLAY_NAMES[user.role] : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
