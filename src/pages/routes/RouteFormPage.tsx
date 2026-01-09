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
import { routesService } from '@/services/routesService';

interface RouteFormData {
  name: string;
  code: string;
  type: 'COMMUTE' | 'DRT';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  companyId: string;
}

const RouteFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RouteFormData>({
    defaultValues: {
      name: '',
      code: '',
      type: 'COMMUTE',
      status: 'ACTIVE',
      companyId: '',
    },
  });

  const { data: route } = useQuery({
    queryKey: ['route', id],
    queryFn: () => routesService.getRoute(id!),
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (route) {
      reset({
        name: route.name,
        code: route.code,
        type: route.type,
        status: route.status,
        companyId: route.companyId,
      });
    }
  }, [route, reset]);

  const mutation = useMutation({
    mutationFn: (data: RouteFormData) =>
      isEdit ? routesService.updateRoute(id!, data) : routesService.createRoute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      navigate('/routes');
    },
  });

  const onSubmit = (data: RouteFormData) => {
    mutation.mutate(data);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/routes')}>
          목록
        </Button>
        <Typography variant="h4" fontWeight={700}>
          {isEdit ? '노선 수정' : '노선 추가'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" gutterBottom>
            기본 정보
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: '노선명을 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="노선명"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="code"
                control={control}
                rules={{ required: '노선 코드를 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="노선 코드"
                    fullWidth
                    error={!!errors.code}
                    helperText={errors.code?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="type"
                control={control}
                rules={{ required: '유형을 선택해주세요' }}
                render={({ field }) => (
                  <TextField {...field} select label="노선 유형" fullWidth>
                    <MenuItem value="COMMUTE">출퇴근</MenuItem>
                    <MenuItem value="DRT">DRT</MenuItem>
                  </TextField>
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
                    <MenuItem value="ACTIVE">운행중</MenuItem>
                    <MenuItem value="INACTIVE">미운행</MenuItem>
                    <MenuItem value="SUSPENDED">중단</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="companyId"
                control={control}
                rules={{ required: '기업을 선택해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="소속 기업"
                    fullWidth
                    error={!!errors.companyId}
                    helperText={errors.companyId?.message}
                    placeholder="기업 ID를 입력하세요"
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/routes')}>
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

export default RouteFormPage;
