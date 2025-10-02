import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Insights from "./pages/Insights";
import Actions from "./pages/Actions";
import Reports from "./pages/Reports";
import MainLayout from "@/components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/actions" element={<Actions />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const _container = document.getElementById("root");
if (!_container) throw new Error("Root container missing");

// Reuse the same root instance to avoid calling createRoot multiple times during HMR
declare global {
  interface Window {
    __ADROI_ROOT__?: import("react-dom/client").Root;
  }
}

if (!window.__ADROI_ROOT__) {
  window.__ADROI_ROOT__ = createRoot(_container);
}

window.__ADROI_ROOT__.render(<App />);
