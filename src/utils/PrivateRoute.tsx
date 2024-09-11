import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (!isAuthenticated && !loading) {
    return <Navigate to='/login' />;
  }

  return <Outlet />;
};

export default PrivateRoute;
