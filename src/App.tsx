
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Dashboard from "./pages/Dashboard";
import Cadastro from "./pages/Cadastro";
import Recarga from "./pages/Recarga";
import Consumo from "./pages/Consumo";
import Historico from "./pages/Historico";
import Relatorios from "./pages/Relatorios";
import Encerramento from "./pages/Encerramento";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/recarga" element={<Recarga />} />
            <Route path="/consumo" element={<Consumo />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/encerramento" element={<Encerramento />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
