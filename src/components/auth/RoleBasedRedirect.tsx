import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RoleBasedRedirectProps {
  children: React.ReactNode;
  allowedRoles: ('USER' | 'ADMIN')[];
  fallbackPath?: string;
}

const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({ 
  children, 
  allowedRoles, 
  fallbackPath 
}) => {
  const { token, role } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user doesn't have required role, redirect to appropriate dashboard
  if (role && !allowedRoles.includes(role)) {
    const redirectPath = fallbackPath || (role === 'ADMIN' ? '/admin-dashboard' : '/user-dashboard');
    return <Navigate to={redirectPath} replace />;
  }

  // If role is null or undefined, redirect to login
  if (!role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRedirect;
