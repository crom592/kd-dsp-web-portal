import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Grid,
  Divider,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { vehiclesService } from '@/services/vehiclesService';

interface VehicleFormData {
  plateNumber: string;
  model: string;
  capacity: number;
  status: 'AVAILABLE' | 'IN_SERVICE' | 'MAINTENANCE' | 'INACTIVE';
}

const VehicleFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleFormData>({
    defaultValues: {
      plateNumber: '',
      model: '',
      capacity: 45,
      status: 'AVAILABLE',
    },
  });

  const { data: vehicle } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehiclesService.getVehicle(id!),
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (vehicle) {
      reset({
        plateNumber: vehicle.plateNumber,
        model: vehicle.model,
        capacity: vehicle.capacity,
        status: vehicle.status,
      });
    }
  }, [vehicle, reset]);

  const mutation = useMutation({
    mutationFn: (data: VehicleFormData) =>
      isEdit ? vehiclesService.updateVehicle(id!, data) : vehiclesService.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      navigate('/vehicles');
    },
  });

  const onSubmit = (data: VehicleFormData) => {
    mutation.mutate(data);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/vehicles')}>
          목록
        </Button>
        <Typography variant="h4" fontWeight={700}>
          {isEdit ? '차량 수정' : '차량 추가'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" gutterBottom>
            차량 정보
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="plateNumber"
                control={control}
                rules={{ required: '차량번호를 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="차량번호"
                    fullWidth
                    error={!!errors.plateNumber}
                    helperText={errors.plateNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="model"
                control={control}
                rules={{ required: '모델을 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="모델"
                    fullWidth
                    error={!!errors.model}
                    helperText={errors.model?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="capacity"
                control={control}
                rules={{
                  required: '정원을 입력해주세요',
                  min: { value: 1, message: '정원은 1명 이상이어야 합니다' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="정원"
                    fullWidth
                    error={!!errors.capacity}
                    helperText={errors.capacity?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="status"
                control={control}
                rules={{ required: '상태를 선택해주세요' }}
                render={({ field }) => (
                  <TextField {...field} select label="상태" fullWidth>
                    <MenuItem value="AVAILABLE">대기중</MenuItem>
                    <MenuItem value="IN_SERVICE">운행중</MenuItem>
                    <MenuItem value="MAINTENANCE">정비중</MenuItem>
                    <MenuItem value="INACTIVE">미사용</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/vehicles')}>
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

export default VehicleFormPage;
