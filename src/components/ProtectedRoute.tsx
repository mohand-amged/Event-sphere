import { Navigate, useLocation } from 'react-router-dom';
import { authApi } from '../services/api';
import type { User } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'attendee' | 'organizer' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const user = authApi.getCurrentUser();

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    // Check if user has required role
    if (requiredRole === 'admin' && user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    
    if (requiredRole === 'organizer' && !['organizer', 'admin'].includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}