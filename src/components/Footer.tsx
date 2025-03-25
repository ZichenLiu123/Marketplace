import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
const Footer = () => {
  return <footer className="bg-toronto-dark text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="rounded-md bg-toronto-blue p-1">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-blue-500">
                UofT<span className="text-cyan-500">Market</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6">
              The premier marketplace exclusively for University of Toronto students. Buy, sell, and connect within our trusted community.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white hover:bg-toronto-blue/20">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white hover:bg-toronto-blue/20">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white hover:bg-toronto-blue/20">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-toronto-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-toronto-gold transition-colors">Browse Products</Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-400 hover:text-toronto-gold transition-colors">Sell an Item</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-toronto-gold transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-toronto-gold transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=textbooks" className="text-gray-400 hover:text-toronto-gold transition-colors">Textbooks</Link>
              </li>
              <li>
                <Link to="/products?category=electronics" className="text-gray-400 hover:text-toronto-gold transition-colors">Electronics</Link>
              </li>
              <li>
                <Link to="/products?category=housing" className="text-gray-400 hover:text-toronto-gold transition-colors">Housing</Link>
              </li>
              <li>
                <Link to="/products?category=transportation" className="text-gray-400 hover:text-toronto-gold transition-colors">Transportation</Link>
              </li>
              <li>
                <Link to="/products?category=academic-services" className="text-gray-400 hover:text-toronto-gold transition-colors">Academic Services</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Stay updated with new listings and marketplace features.</p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Your email" className="bg-gray-800 border-gray-700 text-white placeholder-gray-500" />
              <Button className="bg-toronto-gold text-toronto-dark hover:bg-toronto-gold/90">
                Subscribe
              </Button>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>support@uoftmarket.com</span>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} UofT Market. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy" className="text-gray-500 hover:text-toronto-gold text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-toronto-gold text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-500 hover:text-toronto-gold text-sm transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;