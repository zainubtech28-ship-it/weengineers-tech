import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'founder' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, loading, isAuthenticated, isFounder } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Authenticating access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    const loginPath = requiredRole === 'founder' ? '/auth/founder-login' : '/auth/admin-login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole === 'founder' && !isFounder) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
