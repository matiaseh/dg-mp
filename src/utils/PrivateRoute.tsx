import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN_NAME } from '../constants/apiConstants';

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_NAME);

  if (!isAuthenticated) {
    // Redirect them to the /login page if not logged in
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
