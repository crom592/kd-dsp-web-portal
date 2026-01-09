import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { login, logout, fetchProfile } from '@/store/slices/authSlice';
import { ROUTES } from '@/constants';
import type { LoginRequest, UserRole } from '@/types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      const result = await dispatch(login(credentials));
      if (login.fulfilled.match(result)) {
        navigate(ROUTES.DASHBOARD);
      }
      return result;
    },
    [dispatch, navigate]
  );

  const handleLogout = useCallback(async () => {
    await dispatch(logout());
    navigate(ROUTES.LOGIN);
  }, [dispatch, navigate]);

  const refreshProfile = useCallback(async () => {
    return dispatch(fetchProfile());
  }, [dispatch]);

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!user?.role) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(user.role);
    },
    [user]
  );

  const isAdmin = useCallback((): boolean => {
    return user?.role === 'KD_OPERATOR';
  }, [user]);

  const isCompanyAdmin = useCallback((): boolean => {
    return user?.role === 'COMPANY_ADMIN' || user?.role === 'KD_OPERATOR';
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    refreshProfile,
    hasRole,
    isAdmin,
    isCompanyAdmin,
  };
};

export default useAuth;
