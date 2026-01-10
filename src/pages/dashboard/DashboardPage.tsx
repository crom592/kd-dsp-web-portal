import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
} from '@mui/material';
import {
  DirectionsBus,
  Route,
  People,
  EventNote,
  TrendingUp,
  Speed,
  Refresh,
  OpenInNew,
  GpsFixed,
  Warning,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { ROLE_DISPLAY_NAMES, ROUTES } from '@/constants';
import { dashboardService } from '@/services/dashboardService';
import { vehiclesService } from '@/services/vehiclesService';
import GoogleMap from '@/components/map/GoogleMap';

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

interface VehicleLocation {
  id: string;
  plateNumber: string;
  position: { lat: number; lng: number };
  status: 'IN_SERVICE' | 'IDLE' | 'DELAYED';
  speed: number;
  routeName?: string;
}

// Mock vehicle data for dashboard
const generateMockVehicles = (): VehicleLocation[] => [
  {
    id: 'v1',
    plateNumber: '서울 70가 1234',
    position: { lat: 37.5665, lng: 126.9780 },
    status: 'IN_SERVICE',
    speed: 42,
    routeName: 'A노선',
  },
  {
    id: 'v2',
    plateNumber: '서울 70가 5678',
    position: { lat: 37.5512, lng: 126.9882 },
    status: 'IN_SERVICE',
    speed: 35,
    routeName: 'B노선',
  },
  {
    id: 'v3',
    plateNumber: '서울 70나 9012',
    position: { lat: 37.5796, lng: 126.9770 },
    status: 'DELAYED',
    speed: 15,
    routeName: 'C노선',
  },
  {
    id: 'v4',
    plateNumber: '서울 70나 3456',
    position: { lat: 37.5407, lng: 127.0696 },
    status: 'IN_SERVICE',
    speed: 55,
    routeName: 'D노선',
  },
  {
    id: 'v5',
    plateNumber: '서울 70다 7890',
    position: { lat: 37.4979, lng: 127.0276 },
    status: 'IDLE',
    speed: 0,
    routeName: 'E노선',
  },
];

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [vehicleLocations, setVehicleLocations] = useState<VehicleLocation[]>([]);
  const [useMockData, setUseMockData] = useState(false);

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
  });

  const { data: vehicles, isLoading: vehiclesLoading, refetch: refetchVehicles } = useQuery({
    queryKey: ['vehicles', 'dashboard'],
    queryFn: () => vehiclesService.getVehicles({ status: 'IN_SERVICE', limit: 20 }),
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  // Simulate vehicle movement for mock data
  const simulateMovement = useCallback(() => {
    setVehicleLocations((prev) =>
      prev.map((vehicle) => {
        if (vehicle.status === 'IDLE') return vehicle;
        const latDelta = (Math.random() - 0.5) * 0.002;
        const lngDelta = (Math.random() - 0.5) * 0.002;
        const speedDelta = Math.floor((Math.random() - 0.5) * 10);
        return {
          ...vehicle,
          position: {
            lat: vehicle.position.lat + latDelta,
            lng: vehicle.position.lng + lngDelta,
          },
          speed: Math.max(0, Math.min(80, vehicle.speed + speedDelta)),
        };
      })
    );
  }, []);

  useEffect(() => {
    if (vehicles?.data && vehicles.data.length > 0) {
      const locations: VehicleLocation[] = vehicles.data
        .filter((v) => v.currentLocation)
        .map((v) => ({
          id: v.id,
          plateNumber: v.plateNumber,
          position: {
            lat: v.currentLocation!.latitude,
            lng: v.currentLocation!.longitude,
          },
          status: 'IN_SERVICE' as const,
          speed: Math.floor(Math.random() * 60) + 20,
          routeName: '노선 정보',
        }));
      if (locations.length > 0) {
        setVehicleLocations(locations);
        setUseMockData(false);
      } else {
        setVehicleLocations(generateMockVehicles());
        setUseMockData(true);
      }
    } else if (!vehiclesLoading) {
      setVehicleLocations(generateMockVehicles());
      setUseMockData(true);
    }
  }, [vehicles, vehiclesLoading]);

  // Animation for mock data
  useEffect(() => {
    if (useMockData && vehicleLocations.length > 0) {
      const interval = setInterval(simulateMovement, 3000);
      return () => clearInterval(interval);
    }
  }, [useMockData, vehicleLocations.length, simulateMovement]);

  const getMarkerIcon = (status: VehicleLocation['status']) => {
    switch (status) {
      case 'IN_SERVICE':
        return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
      case 'DELAYED':
        return 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
      case 'IDLE':
        return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      default:
        return 'https://maps.google.com/mapfiles/ms/icons/bus.png';
    }
  };

  const mapMarkers = vehicleLocations.map((vehicle) => ({
    id: vehicle.id,
    position: vehicle.position,
    title: `${vehicle.plateNumber} - ${vehicle.routeName} (${vehicle.speed}km/h)`,
    icon: getMarkerIcon(vehicle.status),
  }));

  const mapCenter = vehicleLocations.length > 0
    ? vehicleLocations[0].position
    : { lat: 37.5665, lng: 126.978 };

  const inServiceCount = vehicleLocations.filter((v) => v.status === 'IN_SERVICE').length;
  const delayedCount = vehicleLocations.filter((v) => v.status === 'DELAYED').length;

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

      {/* Real-time Map and Vehicle List */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 420 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  실시간 차량 위치
                </Typography>
                {useMockData && (
                  <Chip label="데모 데이터" size="small" color="info" />
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  icon={<GpsFixed sx={{ fontSize: 16 }} />}
                  label={`운행중 ${inServiceCount}`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
                {delayedCount > 0 && (
                  <Chip
                    icon={<Warning sx={{ fontSize: 16 }} />}
                    label={`지연 ${delayedCount}`}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                )}
                <Tooltip title="새로고침">
                  <IconButton size="small" onClick={() => refetchVehicles()}>
                    <Refresh fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="모니터링 페이지로 이동">
                  <IconButton size="small" onClick={() => navigate(ROUTES.MONITORING)}>
                    <OpenInNew fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <GoogleMap
              center={mapCenter}
              zoom={12}
              markers={mapMarkers}
              height={340}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 420, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                운행 차량 목록
              </Typography>
              <Chip
                label={`${vehicleLocations.length}대`}
                size="small"
                color="primary"
              />
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <List dense>
                {vehicleLocations.slice(0, 6).map((vehicle) => (
                  <ListItem
                    key={vehicle.id}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              bgcolor: vehicle.status === 'IN_SERVICE' ? 'success.main' :
                                vehicle.status === 'DELAYED' ? 'warning.main' : 'grey.400',
                              border: '2px solid white',
                            }}
                          />
                        }
                      >
                        <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
                          <DirectionsBus sx={{ fontSize: 16 }} />
                        </Avatar>
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={500}>
                          {vehicle.plateNumber}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {vehicle.routeName}
                          </Typography>
                          <Chip
                            label={`${vehicle.speed} km/h`}
                            size="small"
                            sx={{ height: 18, fontSize: '0.65rem' }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
                {vehicleLocations.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="운행 중인 차량이 없습니다"
                      secondary="차량이 운행을 시작하면 여기에 표시됩니다"
                    />
                  </ListItem>
                )}
              </List>
            </Box>
            {vehicleLocations.length > 6 && (
              <Box sx={{ pt: 1, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate(ROUTES.MONITORING)}
                >
                  +{vehicleLocations.length - 6}대 더보기
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <People sx={{ color: 'primary.main' }} />
                <Typography variant="body2">전체 탑승자</Typography>
              </Box>
              <Typography variant="h5" fontWeight={600}>
                {(stats.totalRiders ?? 0).toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TrendingUp sx={{ color: 'success.main' }} />
                <Typography variant="body2">평균 탑승률</Typography>
              </Box>
              <Typography variant="h5" fontWeight={600}>
                {stats.averageOccupancy ?? 0}%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EventNote sx={{ color: 'secondary.main' }} />
                <Typography variant="body2">내 역할</Typography>
              </Box>
              <Typography variant="h5" fontWeight={600}>
                {user?.role ? ROLE_DISPLAY_NAMES[user.role] : 'N/A'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
