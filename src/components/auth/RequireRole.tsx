import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

type Props = { role: 'USER' | 'ADMIN'; children: React.ReactElement };

const RequireRole: React.FC<Props> = ({ role, children }) => {
  const location = useLocation();
  const { token, role: currentRole } = useAuth();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentRole !== role) {
    const redirect = currentRole === 'ADMIN' ? '/admin-dashboard' : '/user-dashboard';
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default RequireRole;


