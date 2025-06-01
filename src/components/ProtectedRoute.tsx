
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

  console.log('ProtectedRoute check:', { user: user?.email, profile, loading });

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

  if (!user) {
    console.log('No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    console.log('No profile, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('User has profile, checking permissions:', { role: profile.role, requireAdmin, allowedRoles });

  if (requireAdmin && profile.role !== 'admin') {
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
          <p className="text-sm text-gray-500 mt-2">Operadores só podem acessar a tela de vendas.</p>
        </div>
      </div>
    );
  }

  console.log('Access granted, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
