import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../../../Pharmacy_Team03/frontend/src/components/useAuth';
import React from 'react';

const ProtectedRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/Login" replace />
  );
};

export default ProtectedRoute;
