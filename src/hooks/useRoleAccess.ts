import { useAuth } from '../contexts/AuthContext';

export const useRoleAccess = () => {
  const { isAdmin, isUser, isAuthenticated, hasRole, role } = useAuth();

  return {
    // Basic role checks
    isAdmin,
    isUser,
    isAuthenticated,
    hasRole,
    role,
    
    // Permission checks
    canAccessAdmin: isAdmin,
    canAccessUser: isUser,
    canBookEvents: isUser || isAdmin,
    canManageEvents: isAdmin,
    canManageUsers: isAdmin,
    canViewAnalytics: isAdmin,
    
    // Route access
    canAccessRoute: (route: string) => {
      if (!isAuthenticated) return false;
      
      switch (route) {
        case '/admin-dashboard':
        case '/admin/events':
        case '/admin/users':
        case '/admin/analytics':
          return isAdmin;
        case '/user-dashboard':
        case '/user/bookings':
        case '/user/profile':
          return isUser || isAdmin;
        case '/checkout':
        case '/seats':
          return isUser || isAdmin;
        default:
          return true; // Public routes
      }
    },
    
    // Get appropriate dashboard path
    getDashboardPath: () => {
      if (isAdmin) return '/admin-dashboard';
      if (isUser) return '/user-dashboard';
      return '/login';
    },
    
    // Get user-friendly role name
    getRoleDisplayName: () => {
      switch (role) {
        case 'ADMIN':
          return 'Administrator';
        case 'USER':
          return 'User';
        default:
          return 'Guest';
      }
    }
  };
};

export default useRoleAccess;
