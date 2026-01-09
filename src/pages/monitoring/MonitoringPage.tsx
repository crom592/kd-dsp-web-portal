import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { DirectionsBus, Speed, Warning } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import GoogleMap from '@/components/map/GoogleMap';
import { vehiclesService } from '@/services/vehiclesService';

interface VehicleLocation {
  id: string;
  plateNumber: string;
  position: { lat: number; lng: number };
  status: string;
  speed?: number;
}

const MonitoringPage: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [vehicleLocations, setVehicleLocations] = useState<VehicleLocation[]>([]);

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles', 'IN_SERVICE'],
    queryFn: () => vehiclesService.getVehicles({ status: 'IN_SERVICE', limit: 100 }),
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (vehicles?.data) {
      const locations: VehicleLocation[] = vehicles.data
        .filter((v) => v.currentLocation)
        .map((v) => ({
          id: v.id,
          plateNumber: v.plateNumber,
          position: {
            lat: v.currentLocation!.latitude,
            lng: v.currentLocation!.longitude,
          },
          status: v.status,
          speed: 0,
        }));
      setVehicleLocations(locations);
    }
  }, [vehicles]);

  const mapMarkers = vehicleLocations.map((vehicle) => ({
    id: vehicle.id,
    position: vehicle.position,
    title: `${vehicle.plateNumber} - ${vehicle.status}`,
    icon: 'https://maps.google.com/mapfiles/ms/icons/bus.png',
  }));

  const center =
    vehicleLocations.length > 0
      ? vehicleLocations[0].position
      : { lat: 37.5665, lng: 126.978 };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          실시간 모니터링
        </Typography>
        <Typography variant="body2" color="text.secondary">
          운행 중인 차량의 실시간 위치를 확인할 수 있습니다
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                차량 위치 지도
              </Typography>
              <Chip
                icon={<DirectionsBus />}
                label={`운행 중: ${vehicleLocations.length}대`}
                color="primary"
                size="small"
              />
            </Box>
            <GoogleMap
              center={center}
              zoom={12}
              markers={mapMarkers}
              height={600}
              onMapClick={(lat, lng) => {
                console.log('Map clicked:', lat, lng);
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Paper sx={{ p: 2, height: 600, overflow: 'auto' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              운행 차량 목록
            </Typography>
            <List>
              {vehicleLocations.map((vehicle) => (
                <ListItem
                  key={vehicle.id}
                  button
                  selected={selectedVehicle === vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                    },
                  }}
                >
                  <ListItemIcon>
                    <DirectionsBus color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={vehicle.plateNumber}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Speed sx={{ fontSize: 14 }} />
                        <Typography variant="caption">
                          {vehicle.speed || 0} km/h
                        </Typography>
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
