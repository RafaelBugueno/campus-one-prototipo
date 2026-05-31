import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/imports/rating_components/ui/sonner";
import { Toaster } from "@/imports/rating_components/ui/toaster";
import { TooltipProvider } from "@/imports/rating_components/ui/tooltip";
import AppLayout from "@/imports/rating_components/layout/AppLayout";
import Dashboard from "@/imports/rating_pages/Dashboard";
import Evaluar from "@/imports/rating_pages/Evaluar";
import Analytics from "@/imports/rating_pages/Analytics";
import Rankings from "@/imports/rating_pages/Rankings";
import Progreso from "@/imports/rating_pages/Progreso";
import Recordatorios from "@/imports/rating_pages/Recordatorios";
import NotFound from "@/imports/rating_pages/NotFound";

const queryClient = new QueryClient();

const RatingApp = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* rating-module class applies ULS Blue sidebar vars and rating-specific fonts */}
      <div className="rating-module h-full">
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="evaluar" element={<Evaluar />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="rankings" element={<Rankings />} />
            <Route path="progreso" element={<Progreso />} />
            <Route path="recordatorios" element={<Recordatorios />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default RatingApp;
