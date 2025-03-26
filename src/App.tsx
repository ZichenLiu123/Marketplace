
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CoreAuthProvider } from "@/contexts/CoreAuthContext";
import { SavedItemsProvider } from "@/contexts/SavedItemsContext";
import { ListingsProvider } from "@/contexts/ListingsContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ServerValidatedRoute from "@/components/auth/ServerValidatedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import { cleanupStaleData } from "@/utils/storageUtils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Import pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import About from "./pages/About";
import Sell from "./pages/Sell";
import Account from "./pages/Account";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";

// Configure the query client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
        }
      }
    },
    mutations: {
      meta: {
        onError: (error: Error) => {
          console.error('Mutation error:', error);
        }
      }
    }
  }
});

// Clean up any stale data in local storage on app startup
cleanupStaleData();

// PWA component to detect online/offline status and handle app updates
const PWAFeatures = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back Online", {
        description: "Your internet connection has been restored."
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("You're Offline", {
        description: "Some features may be limited until your connection is restored."
      });
    };
    
    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check for service worker updates if available
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      let refreshing = false;
      
      // When a new service worker takes over, refresh the page
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return null; // This component doesn't render anything
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CoreAuthProvider>
          <BrowserRouter>
            <ListingsProvider>
              <SavedItemsProvider>
                <Toaster />
                <Sonner />
                <ScrollToTop />
                <PWAFeatures />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/faq" element={<FAQ />} />
                  
                  {/* Protected routes */}
                  <Route path="/products" element={
                    <ProtectedRoute>
                      <Products />
                    </ProtectedRoute>
                  } />
                  <Route path="/product/:id" element={
                    <ProtectedRoute>
                      <ProductDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/sell" element={
                    <ProtectedRoute>
                      <Sell />
                    </ProtectedRoute>
                  } />
                  <Route path="/account" element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SavedItemsProvider>
            </ListingsProvider>
          </BrowserRouter>
        </CoreAuthProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
