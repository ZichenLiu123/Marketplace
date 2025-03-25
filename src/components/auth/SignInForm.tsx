
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AtSign, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SignInFormProps {
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  signInEmail: string;
  setSignInEmail: (email: string) => void;
  signInPassword: string;
  setSignInPassword: (password: string) => void;
  isLoading: boolean;
  errorMessage?: string;
}

const SignInForm = ({
  handleSignIn,
  signInEmail,
  setSignInEmail,
  signInPassword,
  setSignInPassword,
  isLoading,
  errorMessage
}: SignInFormProps) => {
  // Helper function to detect UofT email
  const isUofTEmail = (email: string) => {
    return email.endsWith('@mail.utoronto.ca');
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">UofT Email Address</Label>
        <div className="relative">
          <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            id="email" 
            type="email" 
            placeholder="your.name@mail.utoronto.ca"
            className={`pl-10 ${!isUofTEmail(signInEmail) && signInEmail.length > 0 ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            value={signInEmail}
            onChange={(e) => setSignInEmail(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="email"
          />
          {!isUofTEmail(signInEmail) && signInEmail.length > 0 && (
            <p className="text-xs text-red-500 mt-1">Please use your UofT email address (@mail.utoronto.ca)</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="password">Password</Label>
          <Button variant="link" className="p-0 h-auto text-sm text-toronto-blue">
            Forgot password?
          </Button>
        </div>
        <Input 
          id="password" 
          type="password" 
          value={signInPassword}
          onChange={(e) => setSignInPassword(e.target.value)}
          disabled={isLoading}
          required
          autoComplete="current-password"  
        />
      </div>
      
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">
          {errorMessage}
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-toronto-blue hover:bg-toronto-blue/90" 
        disabled={isLoading || !isUofTEmail(signInEmail)}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
};

export default SignInForm;
