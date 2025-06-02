
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import { AuthProvider } from "./contexts/LocalAuthContext";
import { SyncedAppProvider } from "./contexts/SyncedAppContext";
import LocalProtectedRoute from "./components/LocalProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Cadastro from "./pages/Cadastro";
import Recarga from "./pages/Recarga";
import Consumo from "./pages/Consumo";
import Historico from "./pages/Historico";
import Relatorios from "./pages/Relatorios";
import Encerramento from "./pages/Encerramento";
import Settings from "./pages/Settings";
import Sincronizacao from "./pages/Sincronizacao";
import LocalAuth from "./pages/LocalAuth";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import GuiaUso from "./pages/GuiaUso";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SettingsProvider>
        <AuthProvider>
          <SyncedAppProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/auth" element={<LocalAuth />} />
                <Route path="/" element={<Navigate to="/auth" replace />} />
                <Route
                  path="/dashboard"
                  element={
                    <LocalProtectedRoute requireAdmin>
                      <Dashboard />
                    </LocalProtectedRoute>
                  }
                />
                <Route
                  path="/cadastro"
                  element={
                    <LocalProtectedRoute requireAdmin>
                      <Cadastro />
                    </LocalProtectedRoute>
                  }
                />
                <Route
                  path="/recarga"
                  element={
                    <LocalProtectedRoute requireAdmin>
                      <Recarga />
                    </LocalProtectedRoute>
                  }
                />
                <Route
                  path="/consumo"
                  element={
                    <LocalProtectedRoute allowedRoles={['admin', 'operator']}>
                      <Consumo />
                    </LocalProtectedRoute>
                  }
                />
                <Route
                  path="/historico"
                  element={
                    <LocalProtectedRoute requireAdmin>
                      <Historico />
                    </LocalProtectedRoute>
                  }
                />
                <Route
                  path="/relatorios"
                  element={
                    <LocalProtectedRoute requireAdmin>
                      <Relatorios />
                    </LocalProtectedRoute>
                  }
                />
                <Route
                  path="/encerramento"
                  element={
                    <LocalProtectedRoute requireAdmin>
                      <Encerramento />
                    </LocalProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <LocalProtectedRoute requireAdmin>
                      <Settings />
                    </LocalProtectedRoute>
                  }
                />
                <Route
                  path="/guia"
                  element={
                    <LocalProtectedRoute allowedRoles={['admin', 'operator']}>
                      <GuiaUso />
                    </LocalProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SyncedAppProvider>
        </AuthProvider>
      </SettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
