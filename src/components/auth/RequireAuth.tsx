import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type Props = { children: React.ReactElement };

const RequireAuth: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;


