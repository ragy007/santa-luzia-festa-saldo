
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Cadastro from "./pages/Cadastro";
import Recarga from "./pages/Recarga";
import Consumo from "./pages/Consumo";
import Historico from "./pages/Historico";
import Relatorios from "./pages/Relatorios";
import Encerramento from "./pages/Encerramento";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SettingsProvider>
        <AuthProvider>
          <AppProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cadastro"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Cadastro />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recarga"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Recarga />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consumo"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'operator']}>
                      <Consumo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/historico"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Historico />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/relatorios"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Relatorios />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/encerramento"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Encerramento />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AppProvider>
        </AuthProvider>
      </SettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
