
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthErrorBoundary from './auth/AuthErrorBoundary';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireServerValidation?: boolean;
}

const ProtectedRoute = ({ children, requireServerValidation = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, refreshSession, sessionExpiryTime } = useAuth();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);
  
  // Handle loading state with a timeout
  useEffect(() => {
    console.log("ProtectedRoute - Auth status:", { isAuthenticated, isLoading });
    const loadingTimeoutId = setTimeout(() => {
      setShowLoading(false);
    }, 2000); 
    
    if (!isLoading) {
      clearTimeout(loadingTimeoutId);
      setShowLoading(false);
    }
    
    return () => {
      clearTimeout(loadingTimeoutId);
    };
  }, [isLoading]);
  
  // Check for session expiry
  useEffect(() => {
    if (sessionExpiryTime && isAuthenticated) {
      const now = new Date();
      const timeUntilExpiry = sessionExpiryTime.getTime() - now.getTime();
      const tenMinutesInMs = 10 * 60 * 1000;
      
      if (timeUntilExpiry < tenMinutesInMs && timeUntilExpiry > 0) {
        refreshSession();
      }
    }
  }, [sessionExpiryTime, isAuthenticated, refreshSession]);
  
  // Show auth error message when redirecting
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !localStorage.getItem('authRedirectToast')) {
      toast.error("Authentication required", {
        description: "Please sign in to access this page"
      });
      localStorage.setItem('authRedirectToast', 'true');
      
      // Clear toast flag after a short delay
      setTimeout(() => {
        localStorage.removeItem('authRedirectToast');
      }, 3000);
    }
  }, [isAuthenticated, isLoading]);
  
  // Show loading state while checking authentication
  if (isLoading && showLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-toronto-blue" />
        <span className="ml-2 text-gray-600">
          Verifying authentication...
        </span>
      </div>
    );
  }
  
  // Redirect to login page if not authenticated
  if (!isAuthenticated && !isLoading) {
    console.log('Not authenticated, redirecting to /auth from', location.pathname);
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // User is authenticated, render the protected content
  return (
    <AuthErrorBoundary onError={(error) => {
      console.error('Authentication error in protected route:', error);
      toast.error("Authentication Error", {
        description: "There was a problem with your session. Please try signing in again."
      });
    }}>
      {children}
    </AuthErrorBoundary>
  );
};

export default ProtectedRoute;
