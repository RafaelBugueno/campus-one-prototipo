import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Evaluar from "./pages/Evaluar";
import Analytics from "./pages/Analytics";
import Rankings from "./pages/Rankings";
import Progreso from "./pages/Progreso";
import Recordatorios from "./pages/Recordatorios";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/evaluar" element={<Evaluar />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/progreso" element={<Progreso />} />
            <Route path="/recordatorios" element={<Recordatorios />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
