import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { LoginPage } from '@/pages/auth';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import RoutesListPage from '@/pages/routes/RoutesListPage';
import RouteDetailPage from '@/pages/routes/RouteDetailPage';
import RouteFormPage from '@/pages/routes/RouteFormPage';
import ReservationsListPage from '@/pages/reservations/ReservationsListPage';
import ReservationDetailPage from '@/pages/reservations/ReservationDetailPage';
import VehiclesListPage from '@/pages/vehicles/VehiclesListPage';
import VehicleFormPage from '@/pages/vehicles/VehicleFormPage';
import DriversListPage from '@/pages/drivers/DriversListPage';
import DriverFormPage from '@/pages/drivers/DriverFormPage';
import { ROUTES } from '@/constants';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Protected routes with layout */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        
        {/* Routes Management */}
        <Route path="/routes" element={<RoutesListPage />} />
        <Route path="/routes/new" element={<RouteFormPage />} />
        <Route path="/routes/:id" element={<RouteDetailPage />} />
        <Route path="/routes/:id/edit" element={<RouteFormPage />} />
        
        {/* Reservations Management */}
        <Route path="/reservations" element={<ReservationsListPage />} />
        <Route path="/reservations/:id" element={<ReservationDetailPage />} />
        
        {/* Vehicles Management */}
        <Route path="/vehicles" element={<VehiclesListPage />} />
        <Route path="/vehicles/new" element={<VehicleFormPage />} />
        <Route path="/vehicles/:id/edit" element={<VehicleFormPage />} />
        
        {/* Drivers Management */}
        <Route path="/drivers" element={<DriversListPage />} />
        <Route path="/drivers/new" element={<DriverFormPage />} />
        <Route path="/drivers/:id/edit" element={<DriverFormPage />} />
      </Route>

      {/* Default redirect */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

export default App;
