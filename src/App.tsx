
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import { AppProvider } from "./contexts/LocalAppContext";
import { AuthProvider } from "./contexts/LocalAuthContext";
import { SyncProvider } from "./contexts/LocalSyncContext";
import LocalProtectedRoute from "./components/LocalProtectedRoute";

// Páginas
import Index from "./pages/Index";
import LocalAuth from "./pages/LocalAuth";
import Dashboard from "./pages/Dashboard";
import Cadastro from "./pages/Cadastro";
import Recarga from "./pages/Recarga";
import Consumo from "./pages/Consumo";
import ConsultarSaldo from "./pages/ConsultarSaldo";
import Historico from "./pages/Historico";
import Relatorios from "./pages/Relatorios";
import Encerramento from "./pages/Encerramento";
import Settings from "./pages/Settings";
import GuiaUso from "./pages/GuiaUso";
import Documentacao from "./pages/Documentacao";
import Sincronizacao from "./pages/Sincronizacao";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SettingsProvider>
            <AppProvider>
              <AuthProvider>
                <SyncProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<LocalAuth />} />
                    
                    {/* Rotas protegidas */}
                    <Route path="/dashboard" element={
                      <LocalProtectedRoute requireAdmin={true}>
                        <Dashboard />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/cadastro" element={
                      <LocalProtectedRoute requireAdmin={true}>
                        <Cadastro />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/recarga" element={
                      <LocalProtectedRoute requireAdmin={true}>
                        <Recarga />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/consumo" element={
                      <LocalProtectedRoute>
                        <Consumo />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/consultar-saldo" element={
                      <LocalProtectedRoute>
                        <ConsultarSaldo />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/historico" element={
                      <LocalProtectedRoute requireAdmin={true}>
                        <Historico />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/relatorios" element={
                      <LocalProtectedRoute requireAdmin={true}>
                        <Relatorios />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/encerramento" element={
                      <LocalProtectedRoute requireAdmin={true}>
                        <Encerramento />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/sincronizacao" element={
                      <LocalProtectedRoute>
                        <Sincronizacao />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <LocalProtectedRoute requireAdmin={true}>
                        <Settings />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/guia-uso" element={
                      <LocalProtectedRoute requireAdmin={true}>
                        <GuiaUso />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/documentacao" element={
                      <LocalProtectedRoute requireAdmin={true}>
                        <Documentacao />
                      </LocalProtectedRoute>
                    } />
                    
                    {/* Página 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </SyncProvider>
              </AuthProvider>
            </AppProvider>
          </SettingsProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
