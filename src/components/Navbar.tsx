import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };
  const navClasses = `
    fixed top-0 w-full z-50 transition-all duration-300
    ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}
  `;
  return <nav className={navClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="rounded-md bg-toronto-blue p-1">
              <ShoppingBag className="h-6 w-6 text-white bg-[#000a09]" />
            </div>
            <span className="text-xl font-display font-bold text-blue-500">
              UofT<span className="text-sky-500">Market</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-toronto-blue transition-colors">
              Home
            </Link>
            <Link to="/products" className="font-medium hover:text-toronto-blue transition-colors">
              Browse
            </Link>
            <Link to="/sell" className="font-medium hover:text-toronto-blue transition-colors">
              Sell
            </Link>
            <Link to="/about" className="font-medium hover:text-toronto-blue transition-colors">
              About
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center space-x-4 relative w-1/4">
            <div className="relative w-full">
              <Input type="text" placeholder="Search products..." className="pl-10 pr-4 py-2 w-full" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart">
                <ShoppingBag className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && <div className="fixed inset-0 z-40 bg-white pt-16 animate-slide-in md:hidden">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <div className="relative mb-6">
              <Input type="text" placeholder="Search products..." className="pl-10 pr-4 py-2 w-full" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-4">
              <Link to="/" className="font-medium text-lg py-2 hover:text-toronto-blue transition-colors" onClick={toggleMobileMenu}>
                Home
              </Link>
              <Link to="/products" className="font-medium text-lg py-2 hover:text-toronto-blue transition-colors" onClick={toggleMobileMenu}>
                Browse
              </Link>
              <Link to="/sell" className="font-medium text-lg py-2 hover:text-toronto-blue transition-colors" onClick={toggleMobileMenu}>
                Sell
              </Link>
              <Link to="/about" className="font-medium text-lg py-2 hover:text-toronto-blue transition-colors" onClick={toggleMobileMenu}>
                About
              </Link>
              <div className="pt-4 border-t">
                <Link to="/account" className="flex items-center space-x-2 font-medium text-lg py-2 hover:text-toronto-blue transition-colors" onClick={toggleMobileMenu}>
                  <User className="h-5 w-5" />
                  <span>Account</span>
                </Link>
                <Link to="/cart" className="flex items-center space-x-2 font-medium text-lg py-2 hover:text-toronto-blue transition-colors" onClick={toggleMobileMenu}>
                  <ShoppingBag className="h-5 w-5" />
                  <span>Cart</span>
                </Link>
              </div>
              <Button className="mt-4 w-full" asChild onClick={toggleMobileMenu}>
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>}
    </nav>;
};
export default Navbar;