import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Divider,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { stopsService } from '@/services/stopsService';

interface StopFormData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  routeId: string;
  sequence: number;
}

const StopFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StopFormData>({
    defaultValues: {
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
      routeId: '',
      sequence: 1,
    },
  });

  const { data: stop } = useQuery({
    queryKey: ['stop', id],
    queryFn: () => stopsService.getStop(id!),
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (stop) {
      reset({
        name: stop.name,
        address: stop.address,
        latitude: stop.latitude,
        longitude: stop.longitude,
        routeId: stop.routeId,
        sequence: stop.sequence,
      });
    }
  }, [stop, reset]);

  const mutation = useMutation({
    mutationFn: (data: StopFormData) =>
      isEdit ? stopsService.updateStop(id!, data) : stopsService.createStop(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stops'] });
      navigate('/stops');
    },
  });

  const onSubmit = (data: StopFormData) => {
    mutation.mutate(data);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/stops')}>
          목록
        </Button>
        <Typography variant="h4" fontWeight={700}>
          {isEdit ? '정류장 수정' : '정류장 추가'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" gutterBottom>
            정류장 정보
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: '정류장명을 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="정류장명"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="sequence"
                control={control}
                rules={{ required: '순서를 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="순서"
                    fullWidth
                    error={!!errors.sequence}
                    helperText={errors.sequence?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                rules={{ required: '주소를 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="주소"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="latitude"
                control={control}
                rules={{ required: '위도를 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="위도"
                    fullWidth
                    inputProps={{ step: 'any' }}
                    error={!!errors.latitude}
                    helperText={errors.latitude?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="longitude"
                control={control}
                rules={{ required: '경도를 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="경도"
                    fullWidth
                    inputProps={{ step: 'any' }}
                    error={!!errors.longitude}
                    helperText={errors.longitude?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="routeId"
                control={control}
                rules={{ required: '노선 ID를 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="노선 ID"
                    fullWidth
                    error={!!errors.routeId}
                    helperText={errors.routeId?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/stops')}>
              취소
            </Button>
            <Button type="submit" variant="contained" disabled={mutation.isPending}>
              {isEdit ? '수정' : '생성'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default StopFormPage;
