import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Route as RouteIcon,
  DirectionsBus as VehicleIcon,
  People as UsersIcon,
  Analytics as AnalyticsIcon,
  Receipt as BillingIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { ROUTES } from '@/constants';
import { useAppSelector } from '@/store';
import { UserRole } from '@/types';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactElement;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: <DashboardIcon />,
  },
  {
    label: 'Routes',
    path: ROUTES.ROUTES,
    icon: <RouteIcon />,
  },
  {
    label: 'Vehicles',
    path: ROUTES.VEHICLES,
    icon: <VehicleIcon />,
    roles: [UserRole.KD_OPERATOR],
  },
  {
    label: 'Users',
    path: ROUTES.USERS,
    icon: <UsersIcon />,
    roles: [UserRole.KD_OPERATOR, UserRole.COMPANY_ADMIN],
  },
  {
    label: 'Analytics',
    path: ROUTES.ANALYTICS,
    icon: <AnalyticsIcon />,
  },
  {
    label: 'Billing',
    path: ROUTES.BILLING,
    icon: <BillingIcon />,
    roles: [UserRole.KD_OPERATOR, UserRole.COMPANY_ADMIN],
  },
];

const bottomNavItems: NavItem[] = [
  {
    label: 'Settings',
    path: ROUTES.SETTINGS,
    icon: <SettingsIcon />,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, drawerWidth }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const isNavItemVisible = (item: NavItem): boolean => {
    if (!item.roles) return true;
    if (!user?.role) return false;
    return item.roles.includes(user.role);
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 64,
          px: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            letterSpacing: '-0.5px',
          }}
        >
          KD Mobility
        </Typography>
      </Box>

      {/* Main Navigation */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', py: 2 }}>
        <List component="nav" sx={{ px: 1 }}>
          {navItems.filter(isNavItemVisible).map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'inherit',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive(item.path) ? 'inherit' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 600 : 400,
                    fontSize: '0.875rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom Navigation */}
      <Box sx={{ py: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <List component="nav" sx={{ px: 1 }}>
          {bottomNavItems.filter(isNavItemVisible).map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'inherit',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive(item.path) ? 'inherit' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 600 : 400,
                    fontSize: '0.875rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
