
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showRequestedPage?: boolean;
  requestPath?: string;
}

const AuthLayout = ({ 
  children, 
  title = "Welcome to UofT Market", 
  subtitle = "Sign in or create an account to get started",
  showRequestedPage = false,
  requestPath = '/'
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="rounded-md bg-toronto-blue p-1">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-toronto-dark">
              UofT<span className="text-toronto-blue">Market</span>
            </span>
          </Link>
          
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center space-x-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-soft p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-toronto-dark mb-2">{title}</h1>
              <p className="text-gray-600">{subtitle}</p>
              {showRequestedPage && requestPath !== '/' && (
                <p className="mt-2 text-toronto-blue text-sm">
                  Sign in to continue to the requested page
                </p>
              )}
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
