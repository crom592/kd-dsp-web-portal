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
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, ArrowBack, Delete } from '@mui/icons-material';
import { routesService } from '@/services/routesService';
import { format } from 'date-fns';

const RouteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: route, isLoading } = useQuery({
    queryKey: ['route', id],
    queryFn: () => routesService.getRoute(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <Typography>로딩 중...</Typography>;
  }

  if (!route) {
    return <Typography>노선을 찾을 수 없습니다.</Typography>;
  }

  const statusMap = {
    ACTIVE: { label: '운행중', color: 'success' as const },
    INACTIVE: { label: '미운행', color: 'default' as const },
    SUSPENDED: { label: '중단', color: 'error' as const },
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/routes')}>
            목록
          </Button>
          <Typography variant="h4" fontWeight={700}>
            {route.name}
          </Typography>
          <Chip
            label={statusMap[route.status].label}
            color={statusMap[route.status].color}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/routes/${id}/edit`)}
          >
            수정
          </Button>
          <Button variant="outlined" color="error" startIcon={<Delete />}>
            삭제
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                기본 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    노선 코드
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {route.code}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    노선 유형
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {route.type === 'COMMUTE' ? '출퇴근' : 'DRT'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    소속 기업
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {route.company?.name || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    생성일
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {format(new Date(route.createdAt), 'yyyy-MM-dd')}
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
                정류장 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {route.stops
                  ?.sort((a, b) => a.sequence - b.sequence)
                  .map((stop, index) => (
                    <ListItem key={stop.id} divider={index < route.stops.length - 1}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label={stop.sequence} size="small" />
                            <Typography fontWeight={600}>{stop.name}</Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {stop.address}
                            </Typography>
                            {stop.arrivalTime && (
                              <Typography variant="body2" color="primary">
                                도착: {stop.arrivalTime}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RouteDetailPage;
