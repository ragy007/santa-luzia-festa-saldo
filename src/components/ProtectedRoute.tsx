
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedRoles?: ('admin' | 'operator')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  allowedRoles = ['admin', 'operator']
}) => {
  const { user, profile, loading } = useAuth();

  console.log('ProtectedRoute check:', { 
    user: user?.email, 
    profile: profile?.role, 
    loading,
    requireAdmin,
    allowedRoles 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    console.log('No user or profile, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && profile.role !== 'admin') {
    console.log('Admin required but user is not admin');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
          <p className="text-sm text-gray-500 mt-2">Esta funcionalidade é exclusiva para administradores.</p>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(profile.role)) {
    console.log('Role not allowed:', profile.role, 'allowed:', allowedRoles);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  console.log('Access granted, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
