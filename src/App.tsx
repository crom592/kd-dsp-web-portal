import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { LoginPage } from '@/pages/auth';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import { ROUTES } from '@/constants';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Protected routes with layout */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        {/* Add more protected routes here */}
      </Route>

      {/* Default redirect */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

export default App;
