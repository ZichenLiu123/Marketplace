
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, AtSign, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Authentication Required",
        description: "This is a demo. In a real app, you would be authenticated now.",
      });
    }, 1500);
  };

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
              <h1 className="text-2xl font-bold text-toronto-dark mb-2">Welcome to UofT Market</h1>
              <p className="text-gray-600">Sign in or create an account to get started</p>
            </div>
            
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">UofT Email Address</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your.name@mail.utoronto.ca"
                        className="pl-10"
                        required
                        pattern=".*@mail\.utoronto\.ca$"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button variant="link" className="p-0 h-auto text-sm text-toronto-blue">
                        Forgot password?
                      </Button>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-toronto-blue hover:bg-toronto-blue/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input id="fullname" type="text" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">UofT Email Address</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="your.name@mail.utoronto.ca"
                        className="pl-10"
                        required
                        pattern=".*@mail\.utoronto\.ca$"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You must use your @mail.utoronto.ca email to register
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" required />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-toronto-blue hover:bg-toronto-blue/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500 mt-4">
                    By signing up, you agree to our{" "}
                    <Link to="/terms" className="text-toronto-blue hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-toronto-blue hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
