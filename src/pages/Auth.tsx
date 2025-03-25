import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { clearAllLocalStorage } from '@/utils/storageUtils';
import { resetAllSessions } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

import AuthLayout from '@/components/auth/AuthLayout';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm'; 
import VerificationSuccess from '@/components/auth/VerificationSuccess';
import { Loader2, RefreshCw } from "lucide-react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isVerified = searchParams.get('verified') === 'true';
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam === "signup" ? "signup" : "signin");
  
  const { login, signup, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [program, setProgram] = useState('');
  const [year, setYear] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginStartTime, setLoginStartTime] = useState<number | null>(null);
  const [initializationTimeout, setInitializationTimeout] = useState(false);
  const [isResettingSession, setIsResettingSession] = useState(false);

  const from = location.state?.from || '/';

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (authLoading) {
        console.log('Auth initialization taking too long, allowing UI rendering anyway');
        setInitializationTimeout(true);
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [authLoading]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && !isVerified) {
      if (location.state?.from) {
        console.log('User is authenticated, redirecting to:', from);
        navigate(from, { replace: true });
      } else {
        console.log('Already logged in, redirecting to home');
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, authLoading, navigate, from, isVerified, location.state]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    
    if (isLoading && loginStartTime) {
      timerId = setTimeout(() => {
        if (isLoading) {
          toast.info("Still working...", {
            description: "Authentication is taking longer than usual. Please wait."
          });
        }
      }, 4000);
    }
    
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isLoading, loginStartTime]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearAllLocalStorage();
    }
  }, [isAuthenticated]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(undefined);
    setLoginStartTime(Date.now());
    
    try {
      console.log("Attempting login with:", signInEmail);
      const success = await login(signInEmail, signInPassword);
      
      if (!success) {
        setErrorMessage("Login failed. Please check your credentials and try again.");
        toast.error("Authentication Failed", {
          description: "Invalid email or password. Please try again."
        });
      } else {
        console.log("Login successful, redirecting will happen automatically");
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage("An error occurred during login. Please try again.");
      toast.error("Authentication Failed", {
        description: "An error occurred during login. Please try again."
      });
    } finally {
      setIsLoading(false);
      setLoginStartTime(null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!signUpName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!program.trim()) {
      newErrors.program = "Program is required";
    }
    
    if (!year.trim()) {
      newErrors.year = "Year is required";
    }
    
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!bio.trim()) {
      newErrors.bio = "Bio is required";
    }
    
    if (signUpPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!validateForm()) {
      toast.error("Required Fields Missing", {
        description: "Please fill out all required fields to continue."
      });
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Attempting signup with:", signUpEmail);
      const success = await signup(signUpName, signUpEmail, signUpPassword, {
        program,
        year,
        bio,
        phone,
        hasCompletedSetup: true
      });
      
      if (success) {
        toast.success("Account Created", {
          description: "Please check your email to verify your account."
        });
        setSignUpName('');
        setSignUpEmail('');
        setSignUpPassword('');
        setConfirmPassword('');
        setProgram('');
        setYear('');
        setPhone('');
        setBio('');
      } else {
        toast.error("Registration Failed", {
          description: "There was an error during registration. Please try again."
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error("Registration Failed", {
        description: "An error occurred during account creation. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = async () => {
    setIsResettingSession(true);
    try {
      await resetAllSessions();
      clearAllLocalStorage();
      toast.success("Session Reset", {
        description: "Your session has been completely reset."
      });
      window.location.reload();
    } catch (error) {
      console.error('Error resetting session:', error);
      toast.error("Reset Error", {
        description: "There was a problem resetting your session."
      });
    } finally {
      setIsResettingSession(false);
    }
  };

  if (isVerified) {
    return <VerificationSuccess />;
  }

  if (authLoading && !initializationTimeout) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-toronto-blue" />
        <span className="ml-2 text-gray-600">Initializing authentication...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <AuthLayout showRequestedPage={true} requestPath={from}>
        <div className="p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Already Logged In</h2>
          <div className="text-center mb-6">
            <p className="mb-2">You already have an active session.</p>
          </div>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => navigate('/', { replace: true })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go Home
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <AuthLayout showRequestedPage={true} requestPath={from}>
      <div className="w-full">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <SignInForm 
              handleSignIn={handleSignIn}
              signInEmail={signInEmail}
              setSignInEmail={setSignInEmail}
              signInPassword={signInPassword}
              setSignInPassword={setSignInPassword}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm 
              handleSignUp={handleSignUp}
              signUpName={signUpName}
              setSignUpName={setSignUpName}
              signUpEmail={signUpEmail}
              setSignUpEmail={setSignUpEmail}
              signUpPassword={signUpPassword}
              setSignUpPassword={setSignUpPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              program={program}
              setProgram={setProgram}
              year={year}
              setYear={setYear}
              phone={phone}
              setPhone={setPhone}
              bio={bio}
              setBio={setBio}
              errors={errors}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2 text-center">
            Having trouble signing in?
          </p>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={handleResetSession}
            disabled={isResettingSession}
          >
            {isResettingSession ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Reset Session Tokens
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Auth;
