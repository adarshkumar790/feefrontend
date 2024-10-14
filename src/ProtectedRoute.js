import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
  const { isAdmin } = useAuth();

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
