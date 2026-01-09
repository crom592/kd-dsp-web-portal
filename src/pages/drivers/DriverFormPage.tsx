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
import { driversService } from '@/services/driversService';

interface DriverFormData {
  userId: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY';
}

const DriverFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DriverFormData>({
    defaultValues: {
      userId: '',
      licenseNumber: '',
      licenseExpiry: '',
      status: 'AVAILABLE',
    },
  });

  const { data: driver } = useQuery({
    queryKey: ['driver', id],
    queryFn: () => driversService.getDriver(id!),
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (driver) {
      reset({
        userId: driver.userId,
        licenseNumber: driver.licenseNumber,
        licenseExpiry: driver.licenseExpiry.split('T')[0],
        status: driver.status,
      });
    }
  }, [driver, reset]);

  const mutation = useMutation({
    mutationFn: (data: DriverFormData) =>
      isEdit ? driversService.updateDriver(id!, data) : driversService.createDriver(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      navigate('/drivers');
    },
  });

  const onSubmit = (data: DriverFormData) => {
    mutation.mutate(data);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/drivers')}>
          목록
        </Button>
        <Typography variant="h4" fontWeight={700}>
          {isEdit ? '기사 수정' : '기사 추가'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" gutterBottom>
            기사 정보
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="userId"
                control={control}
                rules={{ required: '사용자 ID를 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="사용자 ID"
                    fullWidth
                    error={!!errors.userId}
                    helperText={errors.userId?.message || '기사로 등록할 사용자의 ID를 입력하세요'}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="licenseNumber"
                control={control}
                rules={{ required: '면허번호를 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="면허번호"
                    fullWidth
                    error={!!errors.licenseNumber}
                    helperText={errors.licenseNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="licenseExpiry"
                control={control}
                rules={{ required: '면허 만료일을 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label="면허 만료일"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.licenseExpiry}
                    helperText={errors.licenseExpiry?.message}
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
                    <MenuItem value="ON_DUTY">근무중</MenuItem>
                    <MenuItem value="OFF_DUTY">비근무</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/drivers')}>
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

export default DriverFormPage;
