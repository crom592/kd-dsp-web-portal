import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Badge,
} from '@mui/material';
import {
  DirectionsBus,
  Speed,
  Warning,
  GpsFixed,
  Timeline,
  AccessTime,
  LocalGasStation,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import GoogleMap from '@/components/map/GoogleMap';
import { vehiclesService, VehicleMonitoringData } from '@/services/vehiclesService';

interface VehicleLocation {
  id: string;
  plateNumber: string;
  position: { lat: number; lng: number };
  status: 'IN_SERVICE' | 'IDLE' | 'DELAYED';
  speed: number;
  routeName?: string;
  driverName?: string;
  nextStop?: string;
  eta?: string;
  fuelLevel?: number;
  passengers?: number;
  heading?: number;
}

// Transform API data to VehicleLocation format
const transformMonitoringData = (data: VehicleMonitoringData): VehicleLocation | null => {
  if (!data.currentLocation) return null;

  return {
    id: data.id,
    plateNumber: data.plateNumber,
    position: {
      lat: data.currentLocation.latitude,
      lng: data.currentLocation.longitude,
    },
    status: data.status === 'IN_SERVICE' ? 'IN_SERVICE' : data.status === 'AVAILABLE' ? 'IDLE' : 'IDLE',
    speed: data.speed || 0,
    routeName: data.routeName,
    driverName: data.driverName,
    nextStop: data.nextStop,
    eta: data.eta,
    fuelLevel: data.fuelLevel,
    passengers: data.passengers,
    heading: data.heading,
  };
};

// Mock data for demonstration - Seoul area vehicles
const generateMockVehicles = (): VehicleLocation[] => [
  {
    id: 'v1',
    plateNumber: '서울 70가 1234',
    position: { lat: 37.5665, lng: 126.9780 },
    status: 'IN_SERVICE',
    speed: 42,
    routeName: 'A노선 (강남-판교)',
    driverName: '김철수',
    nextStop: '삼성역',
    eta: '3분',
    fuelLevel: 78,
    passengers: 12,
    heading: 45,
  },
  {
    id: 'v2',
    plateNumber: '서울 70가 5678',
    position: { lat: 37.5512, lng: 126.9882 },
    status: 'IN_SERVICE',
    speed: 35,
    routeName: 'B노선 (잠실-송파)',
    driverName: '이영희',
    nextStop: '잠실역',
    eta: '5분',
    fuelLevel: 65,
    passengers: 8,
    heading: 120,
  },
  {
    id: 'v3',
    plateNumber: '서울 70나 9012',
    position: { lat: 37.5796, lng: 126.9770 },
    status: 'DELAYED',
    speed: 15,
    routeName: 'C노선 (광화문-여의도)',
    driverName: '박민수',
    nextStop: '광화문역',
    eta: '12분',
    fuelLevel: 45,
    passengers: 20,
    heading: 270,
  },
  {
    id: 'v4',
    plateNumber: '서울 70나 3456',
    position: { lat: 37.5407, lng: 127.0696 },
    status: 'IN_SERVICE',
    speed: 55,
    routeName: 'D노선 (강동-송파)',
    driverName: '정수진',
    nextStop: '천호역',
    eta: '2분',
    fuelLevel: 90,
    passengers: 15,
    heading: 90,
  },
  {
    id: 'v5',
    plateNumber: '서울 70다 7890',
    position: { lat: 37.4979, lng: 127.0276 },
    status: 'IDLE',
    speed: 0,
    routeName: 'E노선 (강남-역삼)',
    driverName: '최동훈',
    nextStop: '역삼역',
    eta: '-',
    fuelLevel: 55,
    passengers: 0,
    heading: 0,
  },
  {
    id: 'v6',
    plateNumber: '서울 70다 1111',
    position: { lat: 37.5172, lng: 127.0473 },
    status: 'IN_SERVICE',
    speed: 38,
    routeName: 'F노선 (삼성-선릉)',
    driverName: '강지훈',
    nextStop: '선릉역',
    eta: '4분',
    fuelLevel: 82,
    passengers: 18,
    heading: 180,
  },
];

const MonitoringPage: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [vehicleLocations, setVehicleLocations] = useState<VehicleLocation[]>([]);
  const [useMockData, setUseMockData] = useState(false);

  // Use the new monitoring API
  const { data: monitoringData, isLoading } = useQuery({
    queryKey: ['vehicles', 'monitoring'],
    queryFn: () => vehiclesService.getMonitoringData(),
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Simulate vehicle movement for mock data
  const simulateMovement = useCallback(() => {
    setVehicleLocations((prev) =>
      prev.map((vehicle) => {
        if (vehicle.status === 'IDLE') return vehicle;

        // Random small movement to simulate real-time tracking
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
          heading: (vehicle.heading || 0 + Math.random() * 20 - 10) % 360,
        };
      })
    );
  }, []);

  useEffect(() => {
    if (monitoringData?.data && monitoringData.data.length > 0) {
      // Transform API data to VehicleLocation format
      const locations: VehicleLocation[] = monitoringData.data
        .map(transformMonitoringData)
        .filter((v): v is VehicleLocation => v !== null);

      if (locations.length > 0) {
        setVehicleLocations(locations);
        setUseMockData(false);
      } else {
        // Vehicles exist but no location data - use mock data with real vehicle info
        const mockWithRealInfo = monitoringData.data.map((v, index) => ({
          ...generateMockVehicles()[index % generateMockVehicles().length],
          id: v.id,
          plateNumber: v.plateNumber,
          routeName: v.routeName || '노선 정보 없음',
          driverName: v.driverName || '기사 정보 없음',
        }));
        setVehicleLocations(mockWithRealInfo);
        setUseMockData(true);
      }
    } else if (!isLoading) {
      // Use mock data when no real data is available
      setVehicleLocations(generateMockVehicles());
      setUseMockData(true);
    }
  }, [monitoringData, isLoading]);

  // Animation loop for mock data movement simulation
  useEffect(() => {
    if (useMockData && vehicleLocations.length > 0) {
      const interval = setInterval(() => {
        simulateMovement();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [useMockData, vehicleLocations.length, simulateMovement]);

  const getStatusColor = (status: VehicleLocation['status']) => {
    switch (status) {
      case 'IN_SERVICE':
        return 'success';
      case 'DELAYED':
        return 'warning';
      case 'IDLE':
        return 'default';
      default:
        return 'primary';
    }
  };

  const getStatusLabel = (status: VehicleLocation['status']) => {
    switch (status) {
      case 'IN_SERVICE':
        return '운행중';
      case 'DELAYED':
        return '지연';
      case 'IDLE':
        return '대기';
      default:
        return status;
    }
  };

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
    title: `${vehicle.plateNumber}\n${vehicle.routeName || ''}\n속도: ${vehicle.speed}km/h\n다음정류장: ${vehicle.nextStop || '-'}`,
    icon: getMarkerIcon(vehicle.status),
  }));

  const center =
    selectedVehicle
      ? vehicleLocations.find((v) => v.id === selectedVehicle)?.position || { lat: 37.5665, lng: 126.978 }
      : vehicleLocations.length > 0
        ? vehicleLocations[0].position
        : { lat: 37.5665, lng: 126.978 };

  const inServiceCount = vehicleLocations.filter((v) => v.status === 'IN_SERVICE').length;
  const delayedCount = vehicleLocations.filter((v) => v.status === 'DELAYED').length;
  const idleCount = vehicleLocations.filter((v) => v.status === 'IDLE').length;

  const selectedVehicleData = vehicleLocations.find((v) => v.id === selectedVehicle);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              실시간 모니터링
            </Typography>
            <Typography variant="body2" color="text.secondary">
              운행 중인 차량의 실시간 위치를 확인할 수 있습니다
              {useMockData && (
                <Chip
                  label="데모 데이터"
                  size="small"
                  color="info"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              icon={<GpsFixed />}
              label={`운행중: ${inServiceCount}`}
              color="success"
              variant="outlined"
            />
            <Chip
              icon={<Warning />}
              label={`지연: ${delayedCount}`}
              color="warning"
              variant="outlined"
            />
            <Chip
              icon={<DirectionsBus />}
              label={`대기: ${idleCount}`}
              color="default"
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                차량 위치 지도
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main' }} />
                  <Typography variant="caption">운행중</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'warning.main' }} />
                  <Typography variant="caption">지연</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'info.main' }} />
                  <Typography variant="caption">대기</Typography>
                </Box>
              </Box>
            </Box>
            <GoogleMap
              center={center}
              zoom={12}
              markers={mapMarkers}
              height={550}
              onMapClick={(lat, lng) => {
                console.log('Map clicked:', lat, lng);
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, height: 632, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              운행 차량 목록
            </Typography>

            {/* Selected vehicle details */}
            {selectedVehicleData && (
              <Card sx={{ mb: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {selectedVehicleData.plateNumber}
                    </Typography>
                    <Chip
                      label={getStatusLabel(selectedVehicleData.status)}
                      color={getStatusColor(selectedVehicleData.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {selectedVehicleData.routeName}
                  </Typography>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Speed sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedVehicleData.speed} km/h</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">ETA: {selectedVehicleData.eta}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Timeline sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedVehicleData.nextStop}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocalGasStation sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedVehicleData.fuelLevel}%</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  {selectedVehicleData.fuelLevel && (
                    <Box sx={{ mt: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">연료</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={selectedVehicleData.fuelLevel}
                        color={selectedVehicleData.fuelLevel > 30 ? 'success' : 'warning'}
                        sx={{ height: 6, borderRadius: 1 }}
                      />
                    </Box>
                  )}
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                      기사: {selectedVehicleData.driverName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      탑승객: {selectedVehicleData.passengers}명
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <List dense>
                {vehicleLocations.map((vehicle) => (
                  <ListItem
                    key={vehicle.id}
                    button
                    selected={selectedVehicle === vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      border: '1px solid',
                      borderColor: selectedVehicle === vehicle.id ? 'primary.main' : 'divider',
                      '&.Mui-selected': {
                        backgroundColor: 'primary.50',
                      },
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
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
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 100 }}>
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
                    <ListItemIcon>
                      <Warning color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="운행 중인 차량이 없습니다"
                      secondary="차량이 운행을 시작하면 여기에 표시됩니다"
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DirectionsBus sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    운행 중
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {vehicleLocations.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Speed sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    평균 속도
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {vehicleLocations.length > 0
                      ? Math.round(
                          vehicleLocations.reduce((sum, v) => sum + (v.speed || 0), 0) /
                            vehicleLocations.length
                        )
                      : 0}{' '}
                    <Typography component="span" variant="body1">
                      km/h
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Warning sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    알림
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    0
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MonitoringPage;
