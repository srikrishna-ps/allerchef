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
import Dieticians from "./pages/Dieticians";
import Blogs from "./pages/Blogs";
import Auth from "./pages/Auth";
import About from "./pages/About";
import RecipeDetail from "./pages/RecipeDetail";
import ForgotPassword from "./pages/ForgotPassword";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

// Simple test component
const TestComponent = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>AllerChef Test</h1>
    <p>If you can see this, React is working!</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<TestComponent />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/dieticians" element={<Dieticians />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
