import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Saved from "./pages/Saved";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/dieticians" element={<div className="text-center py-16"><h1 className="text-3xl font-bold">Dieticians (Coming Soon)</h1></div>} />
            <Route path="/blogs" element={<div className="text-center py-16"><h1 className="text-3xl font-bold">Health Blogs (Coming Soon)</h1></div>} />
            <Route path="/auth" element={<div className="text-center py-16"><h1 className="text-3xl font-bold">Login/Register (Coming Soon)</h1></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
