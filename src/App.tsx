
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import { LocalAppProvider } from "./contexts/LocalAppContext";
import { LocalAuthProvider } from "./contexts/LocalAuthContext";
import { LocalSyncProvider } from "./contexts/LocalSyncContext";
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
            <LocalAppProvider>
              <LocalAuthProvider>
                <LocalSyncProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<LocalAuth />} />
                    
                    {/* Rotas protegidas */}
                    <Route path="/dashboard" element={
                      <LocalProtectedRoute>
                        <Dashboard />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/cadastro" element={
                      <LocalProtectedRoute>
                        <Cadastro />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/recarga" element={
                      <LocalProtectedRoute>
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
                      <LocalProtectedRoute>
                        <Historico />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/relatorios" element={
                      <LocalProtectedRoute>
                        <Relatorios />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/encerramento" element={
                      <LocalProtectedRoute>
                        <Encerramento />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <LocalProtectedRoute>
                        <Settings />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/guia-uso" element={
                      <LocalProtectedRoute>
                        <GuiaUso />
                      </LocalProtectedRoute>
                    } />
                    <Route path="/documentacao" element={
                      <LocalProtectedRoute>
                        <Documentacao />
                      </LocalProtectedRoute>
                    } />
                    
                    {/* Página 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </LocalSyncProvider>
              </LocalAuthProvider>
            </LocalAppProvider>
          </SettingsProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
