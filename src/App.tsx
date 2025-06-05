
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SyncedAppProvider } from './contexts/SyncedAppContext';
import { AuthProvider } from './contexts/LocalAuthContext';
import LocalAuth from './pages/LocalAuth';
import Dashboard from './pages/Dashboard';
import Cadastro from './pages/Cadastro';
import Consumo from './pages/Consumo';
import Recarga from './pages/Recarga';
import ConsultaSaldo from './pages/ConsultaSaldo';
import Relatorios from './pages/Relatorios';
import Encerramento from './pages/Encerramento';
import Settings from './pages/Settings';
import Sincronizacao from './pages/Sincronizacao';
import { useAuth } from './contexts/LocalAuthContext';
import { Toaster } from '@/components/ui/toaster';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <SyncedAppProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<LocalAuth />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cadastro"
                element={
                  <ProtectedRoute>
                    <Cadastro />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/consumo"
                element={
                  <ProtectedRoute>
                    <Consumo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recarga"
                element={
                  <ProtectedRoute>
                    <Recarga />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/consulta-saldo"
                element={
                  <ProtectedRoute>
                    <ConsultaSaldo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/relatorios"
                element={
                  <ProtectedRoute>
                    <Relatorios />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/encerramento"
                element={
                  <ProtectedRoute>
                    <Encerramento />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sincronizacao"
                element={
                  <ProtectedRoute>
                    <Sincronizacao />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </SyncedAppProvider>
    </AuthProvider>
  );
}

export default App;
