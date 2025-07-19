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
import { Component, ErrorInfo, ReactNode } from "react";

const queryClient = new QueryClient();

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red', backgroundColor: '#fff', minHeight: '100vh' }}>
          <h1>🚨 React Error Detected!</h1>
          <p><strong>Error:</strong> {this.state.error?.message}</p>
          <details style={{ textAlign: 'left', background: '#f5f5f5', padding: '10px', margin: '10px 0' }}>
            <summary>Click to see full error details</summary>
            <pre style={{ overflow: 'auto', whiteSpace: 'pre-wrap' }}>
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Super simple test component
const TestComponent = () => {
  console.log('TestComponent rendering...');
  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff', minHeight: '100vh' }}>
      <h1>✅ AllerChef Test</h1>
      <p>If you can see this, React is working!</p>
      <p style={{ color: 'green' }}>✅ No errors detected</p>
    </div>
  );
};

const App = () => {
  console.log('App component rendering...');

  try {
    return (
      <ErrorBoundary>
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
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red', backgroundColor: '#fff', minHeight: '100vh' }}>
        <h1>🚨 App Component Error!</h1>
        <p><strong>Error:</strong> {error instanceof Error ? error.message : 'Unknown error'}</p>
        <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {error instanceof Error ? error.stack : 'No stack trace available'}
        </pre>
      </div>
    );
  }
};

export default App;
