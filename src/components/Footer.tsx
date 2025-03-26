import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <span className="text-xl font-bold text-toronto-blue">
                UofT<span className="text-toronto-gold">Market</span>
              </span>
            </Link>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              The premier marketplace exclusively for University of Toronto students. Buy, sell, and connect within our trusted community.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9 text-gray-500 hover:text-toronto-blue hover:bg-blue-50 border-gray-200">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9 text-gray-500 hover:text-toronto-blue hover:bg-blue-50 border-gray-200">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9 text-gray-500 hover:text-toronto-blue hover:bg-blue-50 border-gray-200">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-5 text-gray-800">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-toronto-blue transition-colors text-sm flex items-center">
                  <span className="mr-2 h-1 w-1 bg-gray-400 rounded-full inline-block"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-toronto-blue transition-colors text-sm flex items-center">
                  <span className="mr-2 h-1 w-1 bg-gray-400 rounded-full inline-block"></span>
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-600 hover:text-toronto-blue transition-colors text-sm flex items-center">
                  <span className="mr-2 h-1 w-1 bg-gray-400 rounded-full inline-block"></span>
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-toronto-blue transition-colors text-sm flex items-center">
                  <span className="mr-2 h-1 w-1 bg-gray-400 rounded-full inline-block"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-toronto-blue transition-colors text-sm flex items-center">
                  <span className="mr-2 h-1 w-1 bg-gray-400 rounded-full inline-block"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-base font-semibold mb-5 text-gray-800">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products?category=textbooks" className="text-gray-600 hover:text-toronto-blue transition-colors text-sm flex items-center">
                  <span className="mr-2 h-1 w-1 bg-gray-400 rounded-full inline-block"></span>
                  Textbooks
                </Link>
              </li>
              <li>
                <Link to="/products?category=electronics" className="text-gray-600 hover:text-toronto-blue transition-colors text-sm flex items-center">
                  <span className="mr-2 h-1 w-1 bg-gray-400 rounded-full inline-block"></span>
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=housing" className="text-gray-600 hover:text-toronto-blue transition-colors text-sm flex items-center">
                  <span className="mr-2 h-1 w-1 bg-gray-400 rounded-full inline-block"></span>
                  Housing
                </Link>
              </li>
              <li>
                <Link to="/products?category=transportation" className="text-gray-600 hover:text-toronto-blue transition-colors text-sm flex items-center">
                  <span className="mr-2 h-1 w-1 bg-gray-400 rounded-full inline-block"></span>
                  Transportation
                </Link>
              </li>
              <li>
                <Link to="/products?category=academic-services" className="text-gray-600 hover:text-toronto-blue transition-colors text-sm flex items-center">
                  <span className="mr-2 h-1 w-1 bg-gray-400 rounded-full inline-block"></span>
                  Academic Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-base font-semibold mb-5 text-gray-800">Stay Connected</h3>
            <p className="text-gray-600 mb-4 text-sm">Get exclusive updates on new listings and features.</p>
            <div className="flex space-x-2 mb-6">
              <Input type="email" placeholder="Your email" className="bg-white border-gray-200 text-gray-800 text-sm h-10 placeholder-gray-400 rounded-l-md" />
              <Button className="bg-toronto-blue hover:bg-toronto-blue/90 text-white rounded-r-md h-10">
                Subscribe
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 text-sm">
                <Mail className="h-4 w-4 mr-3 text-toronto-blue" />
                <span>support@uoftmarket.com</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-4 w-4 mr-3 text-toronto-blue" />
                <span>University of Toronto, CA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-100 py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-xs mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} UofT Market. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/privacy" className="text-gray-500 hover:text-toronto-blue text-xs transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-toronto-blue text-xs transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-500 hover:text-toronto-blue text-xs transition-colors">
                Contact Us
              </Link>
              <a href="https://utoronto.ca" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-toronto-blue text-xs transition-colors flex items-center">
                University of Toronto <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
