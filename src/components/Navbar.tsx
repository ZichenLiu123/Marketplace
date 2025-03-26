import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setSearchValue(searchQuery);
    }
  }, [location.search]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      toast.loading("Logging out...");
      
      await logout();
      
      navigate('/', { replace: true });
      
      toast.dismiss();
      toast.success("Logged out successfully");
      
      localStorage.removeItem('userProfile');
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout Error", {
        description: "There was an issue during logout. Please try again."
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      if (isMobileMenuOpen) {
        toggleMobileMenu();
      }
    }
  };

  const navClasses = `
    fixed top-0 w-full z-50 transition-all duration-300 bg-white shadow-sm
    ${isScrolled 
      ? 'py-2' 
      : 'py-4'
    }
  `;

  return (
    <>
      <nav className={navClasses}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-toronto-blue">
                UofT<span className="text-toronto-gold">Market</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="font-medium hover:text-toronto-blue transition-colors font-sans">
                Home
              </Link>
              <Link to="/products" className="font-medium hover:text-toronto-blue transition-colors font-sans">
                Browse
              </Link>
              <Link to="/sell" className="font-medium hover:text-toronto-blue transition-colors font-sans">
                Sell
              </Link>
              <Link to="/about" className="font-medium hover:text-toronto-blue transition-colors font-sans">
                About
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4 relative w-1/4">
              <form onSubmit={handleSearch} className="relative w-full">
                <Input 
                  type="text" 
                  placeholder="Search products..." 
                  className="pl-10 pr-4 py-2 w-full font-sans" 
                  value={searchValue} 
                  onChange={e => setSearchValue(e.target.value)} 
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <button type="submit" className="sr-only">Search</button>
              </form>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <User className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="font-sans">
                    <DropdownMenuLabel className="font-sans">{user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="font-sans">
                      <Link to="/account" className="cursor-pointer w-full">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="font-sans">
                      <Link to="/sell" className="cursor-pointer w-full">Sell Item</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer font-sans">
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/account">
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild className="font-sans">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </>
              )}
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[999] bg-white md:hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="h-full flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <Link to="/" className="flex items-center space-x-2" onClick={toggleMobileMenu}>
                <span className="text-xl font-bold text-toronto-blue">
                  UofT<span className="text-toronto-gold">Market</span>
                </span>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileMenu}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="container mx-auto px-4 py-6 flex-grow flex flex-col">
              <form onSubmit={handleSearch} className="relative mb-8">
                <Input 
                  type="text" 
                  placeholder="Search products..." 
                  className="pl-10 pr-4 py-2 w-full font-sans" 
                  value={searchValue} 
                  onChange={e => setSearchValue(e.target.value)} 
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <button type="submit" className="sr-only">Search</button>
              </form>
              
              <div className="flex flex-col space-y-6 flex-grow">
                <Link 
                  to="/" 
                  className="font-medium text-lg py-2 hover:text-toronto-blue transition-colors font-sans" 
                  onClick={toggleMobileMenu}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className="font-medium text-lg py-2 hover:text-toronto-blue transition-colors font-sans" 
                  onClick={toggleMobileMenu}
                >
                  Browse
                </Link>
                <Link 
                  to="/sell" 
                  className="font-medium text-lg py-2 hover:text-toronto-blue transition-colors font-sans" 
                  onClick={toggleMobileMenu}
                >
                  Sell
                </Link>
                <Link 
                  to="/about" 
                  className="font-medium text-lg py-2 hover:text-toronto-blue transition-colors font-sans" 
                  onClick={toggleMobileMenu}
                >
                  About
                </Link>
                
                <div className="border-t pt-6 mt-auto">
                  {isAuthenticated ? (
                    <>
                      <div className="font-medium text-lg py-2 font-sans">
                        Hi, {user?.name}
                      </div>
                      <Link 
                        to="/account" 
                        className="flex items-center space-x-2 font-medium text-lg py-2 hover:text-toronto-blue transition-colors font-sans" 
                        onClick={toggleMobileMenu}
                      >
                        <User className="h-5 w-5" />
                        <span>My Account</span>
                      </Link>
                      <button 
                        onClick={() => {
                          handleLogout();
                          toggleMobileMenu();
                        }}
                        className="flex items-center space-x-2 font-medium text-lg py-2 text-red-500 hover:text-red-600 transition-colors w-full text-left font-sans"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/account" 
                        className="flex items-center space-x-2 font-medium text-lg py-2 hover:text-toronto-blue transition-colors font-sans" 
                        onClick={toggleMobileMenu}
                      >
                        <User className="h-5 w-5" />
                        <span>Account</span>
                      </Link>
                      <Button className="mt-4 w-full font-sans" asChild onClick={toggleMobileMenu}>
                        <Link to="/auth">Sign In</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
