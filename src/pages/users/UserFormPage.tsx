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
import { usersService } from '@/services/usersService';
import { UserRole } from '@/types';

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  companyId?: string;
}

const UserFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'RIDER' as UserRole,
      companyId: '',
    },
  });

  const selectedRole = watch('role');

  const { data: user } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersService.getUser(id!),
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        companyId: user.companyId || '',
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (data: UserFormData) =>
      isEdit ? usersService.updateUser(id!, data) : usersService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/users');
    },
  });

  const onSubmit = (data: UserFormData) => {
    mutation.mutate(data);
  };

  const requiresCompany = selectedRole === 'COMPANY_ADMIN' || selectedRole === 'DRIVER';

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/users')}>
          목록
        </Button>
        <Typography variant="h4" fontWeight={700}>
          {isEdit ? '사용자 수정' : '사용자 추가'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" gutterBottom>
            사용자 정보
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: '이름을 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="이름"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: '이메일을 입력해주세요',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '올바른 이메일 형식이 아닙니다',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="이메일"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="전화번호"
                    fullWidth
                    placeholder="010-1234-5678"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="role"
                control={control}
                rules={{ required: '역할을 선택해주세요' }}
                render={({ field }) => (
                  <TextField {...field} select label="역할" fullWidth>
                    <MenuItem value="RIDER">탑승자</MenuItem>
                    <MenuItem value="DRIVER">운전자</MenuItem>
                    <MenuItem value="COMPANY_ADMIN">기업 관리자</MenuItem>
                    <MenuItem value="KD_OPERATOR">KD 운영자</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {requiresCompany && (
              <Grid item xs={12}>
                <Controller
                  name="companyId"
                  control={control}
                  rules={{
                    required: requiresCompany ? '소속 기업을 입력해주세요' : false,
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="소속 기업 ID"
                      fullWidth
                      error={!!errors.companyId}
                      helperText={errors.companyId?.message || '기업 ID를 입력하세요'}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/users')}>
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

export default UserFormPage;
