import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  TextField,
  Button,
  Avatar,
  Chip,
  Alert,
  Snackbar,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person,
  Notifications,
  Palette,
  Security,
  Language,
  DarkMode,
  Email,
  Phone,
  Business,
  Save,
  Edit,
  Lock,
  NotificationsActive,
  NotificationsOff,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAppSelector } from '@/store';
import { ROLE_DISPLAY_NAMES } from '@/constants';

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const sections: SettingsSection[] = [
  { id: 'profile', label: '프로필', icon: <Person /> },
  { id: 'notifications', label: '알림', icon: <Notifications /> },
  { id: 'appearance', label: '화면', icon: <Palette /> },
  { id: 'security', label: '보안', icon: <Security /> },
];

const SettingsPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeSection, setActiveSection] = useState('profile');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Profile state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '010-1234-5678',
    company: '기아자동차',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reservationAlerts: true,
    systemAlerts: true,
    marketingEmails: false,
    dailyReport: true,
    weeklyReport: true,
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    darkMode: false,
    language: 'ko',
    fontSize: 'medium',
    compactMode: false,
  });

  // Security settings
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSaveProfile = () => {
    // TODO: API call to save profile
    setIsEditingProfile(false);
    setSnackbar({ open: true, message: '프로필이 저장되었습니다.', severity: 'success' });
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    setSnackbar({ open: true, message: '알림 설정이 변경되었습니다.', severity: 'success' });
  };

  const handleAppearanceChange = (key: string, value: any) => {
    setAppearance((prev) => ({ ...prev, [key]: value }));
    setSnackbar({ open: true, message: '화면 설정이 변경되었습니다.', severity: 'success' });
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSnackbar({ open: true, message: '새 비밀번호가 일치하지 않습니다.', severity: 'error' });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setSnackbar({ open: true, message: '비밀번호는 8자 이상이어야 합니다.', severity: 'error' });
      return;
    }
    // TODO: API call to change password
    setPasswordDialog(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSnackbar({ open: true, message: '비밀번호가 변경되었습니다.', severity: 'success' });
  };

  const renderProfileSection = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          프로필 정보
        </Typography>
        <Button
          variant={isEditingProfile ? 'contained' : 'outlined'}
          startIcon={isEditingProfile ? <Save /> : <Edit />}
          onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
        >
          {isEditingProfile ? '저장' : '수정'}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Avatar
          sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}
        >
          {user?.name?.charAt(0) || 'U'}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {user?.name || '사용자'}
          </Typography>
          <Chip
            label={user?.role ? ROLE_DISPLAY_NAMES[user.role] : '역할 없음'}
            color="primary"
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="이름"
            value={profileForm.name}
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            disabled={!isEditingProfile}
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="이메일"
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            disabled={!isEditingProfile}
            InputProps={{
              startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="전화번호"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            disabled={!isEditingProfile}
            InputProps={{
              startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="소속 기업"
            value={profileForm.company}
            disabled
            InputProps={{
              startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
      </Grid>

      {isEditingProfile && (
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => setIsEditingProfile(false)}>
            취소
          </Button>
        </Box>
      )}
    </Box>
  );

  const renderNotificationsSection = () => (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        알림 설정
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        받고 싶은 알림을 설정하세요.
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <Email color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="이메일 알림"
            secondary="중요한 알림을 이메일로 받습니다."
          />
          <ListItemSecondaryAction>
            <Switch
              checked={notifications.emailNotifications}
              onChange={() => handleNotificationChange('emailNotifications')}
              color="primary"
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider variant="inset" component="li" />

        <ListItem>
          <ListItemIcon>
            {notifications.pushNotifications ? (
              <NotificationsActive color="primary" />
            ) : (
              <NotificationsOff color="disabled" />
            )}
          </ListItemIcon>
          <ListItemText
            primary="푸시 알림"
            secondary="브라우저 푸시 알림을 받습니다."
          />
          <ListItemSecondaryAction>
            <Switch
              checked={notifications.pushNotifications}
              onChange={() => handleNotificationChange('pushNotifications')}
              color="primary"
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider variant="inset" component="li" />

        <ListItem>
          <ListItemIcon>
            <Notifications color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="예약 알림"
            secondary="새로운 예약 및 예약 변경 알림을 받습니다."
          />
          <ListItemSecondaryAction>
            <Switch
              checked={notifications.reservationAlerts}
              onChange={() => handleNotificationChange('reservationAlerts')}
              color="primary"
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider variant="inset" component="li" />

        <ListItem>
          <ListItemIcon>
            <Notifications color="warning" />
          </ListItemIcon>
          <ListItemText
            primary="시스템 알림"
            secondary="시스템 점검 및 중요 공지를 받습니다."
          />
          <ListItemSecondaryAction>
            <Switch
              checked={notifications.systemAlerts}
              onChange={() => handleNotificationChange('systemAlerts')}
              color="primary"
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider variant="inset" component="li" />

        <ListItem>
          <ListItemIcon>
            <Email color="secondary" />
          </ListItemIcon>
          <ListItemText
            primary="일간 리포트"
            secondary="매일 아침 운영 현황 리포트를 받습니다."
          />
          <ListItemSecondaryAction>
            <Switch
              checked={notifications.dailyReport}
              onChange={() => handleNotificationChange('dailyReport')}
              color="primary"
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider variant="inset" component="li" />

        <ListItem>
          <ListItemIcon>
            <Email color="secondary" />
          </ListItemIcon>
          <ListItemText
            primary="주간 리포트"
            secondary="매주 월요일 주간 분석 리포트를 받습니다."
          />
          <ListItemSecondaryAction>
            <Switch
              checked={notifications.weeklyReport}
              onChange={() => handleNotificationChange('weeklyReport')}
              color="primary"
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Box>
  );

  const renderAppearanceSection = () => (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        화면 설정
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        화면 표시 방식을 설정하세요.
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <DarkMode color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="다크 모드"
            secondary="어두운 테마를 사용합니다."
          />
          <ListItemSecondaryAction>
            <Switch
              checked={appearance.darkMode}
              onChange={() => handleAppearanceChange('darkMode', !appearance.darkMode)}
              color="primary"
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider variant="inset" component="li" />

        <ListItem>
          <ListItemIcon>
            <Language color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="언어"
            secondary="표시 언어를 선택합니다."
          />
          <ListItemSecondaryAction>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={appearance.language}
                onChange={(e) => handleAppearanceChange('language', e.target.value)}
              >
                <MenuItem value="ko">한국어</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider variant="inset" component="li" />

        <ListItem>
          <ListItemIcon>
            <Palette color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="글자 크기"
            secondary="화면의 글자 크기를 조절합니다."
          />
          <ListItemSecondaryAction>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={appearance.fontSize}
                onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
              >
                <MenuItem value="small">작게</MenuItem>
                <MenuItem value="medium">보통</MenuItem>
                <MenuItem value="large">크게</MenuItem>
              </Select>
            </FormControl>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider variant="inset" component="li" />

        <ListItem>
          <ListItemIcon>
            <Palette color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="컴팩트 모드"
            secondary="더 많은 내용을 화면에 표시합니다."
          />
          <ListItemSecondaryAction>
            <Switch
              checked={appearance.compactMode}
              onChange={() => handleAppearanceChange('compactMode', !appearance.compactMode)}
              color="primary"
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Box>
  );

  const renderSecuritySection = () => (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        보안 설정
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        계정 보안을 관리하세요.
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <Lock color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="비밀번호 변경"
            secondary="계정 비밀번호를 변경합니다."
          />
          <ListItemSecondaryAction>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPasswordDialog(true)}
            >
              변경
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider variant="inset" component="li" />

        <ListItem>
          <ListItemIcon>
            <Security color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="2단계 인증"
            secondary="추가 보안을 위해 2단계 인증을 사용합니다."
          />
          <ListItemSecondaryAction>
            <Chip label="비활성화" color="default" size="small" />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider variant="inset" component="li" />

        <ListItem>
          <ListItemIcon>
            <Security color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="로그인 기록"
            secondary="최근 로그인 활동을 확인합니다."
          />
          <ListItemSecondaryAction>
            <Button variant="text" size="small">
              보기
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      <Alert severity="info" sx={{ mt: 3 }}>
        보안을 위해 정기적으로 비밀번호를 변경하는 것을 권장합니다.
      </Alert>
    </Box>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'appearance':
        return renderAppearanceSection();
      case 'security':
        return renderSecuritySection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          설정
        </Typography>
        <Typography variant="body2" color="text.secondary">
          계정 및 시스템 설정을 관리합니다.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar Navigation */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <List component="nav">
              {sections.map((section) => (
                <ListItem
                  key={section.id}
                  button
                  selected={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.50',
                      '&:hover': {
                        bgcolor: 'primary.100',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {React.cloneElement(section.icon as React.ReactElement, {
                      color: activeSection === section.id ? 'primary' : 'inherit',
                    })}
                  </ListItemIcon>
                  <ListItemText
                    primary={section.label}
                    primaryTypographyProps={{
                      fontWeight: activeSection === section.id ? 600 : 400,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            {renderSection()}
          </Paper>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>비밀번호 변경</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="현재 비밀번호"
              type={showPassword.current ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    edge="end"
                  >
                    {showPassword.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              fullWidth
              label="새 비밀번호"
              type={showPassword.new ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              sx={{ mb: 2 }}
              helperText="8자 이상 입력하세요"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    edge="end"
                  >
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              fullWidth
              label="새 비밀번호 확인"
              type={showPassword.confirm ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    edge="end"
                  >
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>취소</Button>
          <Button variant="contained" onClick={handlePasswordChange}>
            변경
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
