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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { companiesService } from '@/services/companiesService';

interface CompanyFormData {
  name: string;
  code: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
}

const CompanyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    defaultValues: {
      name: '',
      code: '',
      address: '',
      contactEmail: '',
      contactPhone: '',
      isActive: true,
    },
  });

  const { data: company } = useQuery({
    queryKey: ['company', id],
    queryFn: () => companiesService.getCompany(id!),
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (company) {
      reset({
        name: company.name,
        code: company.code,
        address: company.address || '',
        contactEmail: company.contactEmail || '',
        contactPhone: company.contactPhone || '',
        isActive: company.isActive,
      });
    }
  }, [company, reset]);

  const mutation = useMutation({
    mutationFn: (data: CompanyFormData) =>
      isEdit ? companiesService.updateCompany(id!, data) : companiesService.createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      navigate('/companies');
    },
  });

  const onSubmit = (data: CompanyFormData) => {
    mutation.mutate(data);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/companies')}>
          목록
        </Button>
        <Typography variant="h4" fontWeight={700}>
          {isEdit ? '기업 수정' : '기업 추가'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" gutterBottom>
            기업 정보
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: '기업명을 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="기업명"
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
                rules={{ required: '기업 코드를 입력해주세요' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="기업 코드"
                    fullWidth
                    error={!!errors.code}
                    helperText={errors.code?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => <TextField {...field} label="주소" fullWidth />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="contactEmail"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="담당자 이메일" type="email" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="contactPhone"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="담당자 전화번호" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="활성 상태"
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/companies')}>
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

export default CompanyFormPage;
