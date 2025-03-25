
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useListings } from '@/contexts/ListingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { LockIcon } from 'lucide-react';
import { createMockListings } from '@/utils/debugUtils';
import { useToast } from '@/hooks/use-toast';

const mockFeaturedProducts = [{
  id: "1",
  title: 'MacBook Pro M2 - Nearly New',
  price: 1200.00,
  image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  category: 'Electronics',
  condition: 'Like New',
  seller: 'Maya T',
  postedTime: '2023-10-15',
  location: 'St. George Campus',
  views: 52
}, {
  id: "2",
  title: 'Calculus & Linear Algebra Textbooks Bundle',
  price: 85.00,
  image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  category: 'Textbooks',
  condition: 'Good',
  seller: 'Jayden K',
  postedTime: '2023-10-20',
  location: 'Robarts Library',
  views: 38
}, {
  id: "3",
  title: 'Study Desk and Chair Set',
  price: 120.00,
  image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  category: 'Furniture',
  condition: 'New',
  seller: 'Aisha M',
  postedTime: '2023-10-10',
  location: 'Mississauga Campus',
  views: 45
}];

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    listings,
    getFeaturedListings,
    addListing,
    clearAllListings
  } = useListings();
  const {
    isAuthenticated,
    user
  } = useAuth();
  const { toast } = useToast();

  // For debugging - populate with mock data if needed
  const populateMockData = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to add listings",
        variant: "destructive"
      });
      return;
    }
    
    clearAllListings();
    
    const mockListings = createMockListings();
    let addedCount = 0;
    
    mockListings.forEach(mockListing => {
      try {
        const { id, sellerId, deleted, ...rest } = mockListing;
        const newId = addListing(rest);
        if (newId) addedCount++;
      } catch (error) {
        console.error("Error adding mock listing:", error);
      }
    });
    
    toast({
      title: "Mock data added",
      description: `Added ${addedCount} listings for testing`
    });
  };

  // Debug function to view current listings data
  const debugListings = () => {
    console.log("Current listings:", listings);
    toast({
      title: "Listings debugged",
      description: `Currently ${listings.length} listings. Check console for details.`
    });
  };

  const recentUserListings = listings.sort((a, b) => new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime()).slice(0, 4);
  const userFeaturedListings = getFeaturedListings(4);
  const featuredProducts = userFeaturedListings.length >= 4 ? userFeaturedListings : [...userFeaturedListings, ...mockFeaturedProducts.slice(0, 4 - userFeaturedListings.length)];
  
  useEffect(() => {
    setIsLoaded(true);
    console.log("Index loaded, listings count:", listings.length);
  }, [listings.length]);

  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <Categories />

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 
                ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
                Featured Products
              </h2>
              <p className={`text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-700 delay-100
                ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
                Most popular items with highest engagement
              </p>
              {!isAuthenticated && <div className="mt-4 text-amber-600 bg-amber-50 p-4 rounded-lg inline-flex items-center gap-2">
                  <LockIcon className="h-4 w-4" />
                  <span>Sign in required to view product details</span>
                </div>}
                
              {isAuthenticated && (
                <div className="mt-4 flex justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={populateMockData}
                    className="text-xs"
                  >
                    Add Test Data
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={debugListings}
                    className="text-xs"
                  >
                    Debug Listings
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => <div key={product.id} className={`transition-all duration-700 
                  ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`} style={{
              transitionDelay: `${index * 100}ms`
            }}>
                  <ProductCard {...product} />
                  {!isAuthenticated && <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg backdrop-blur-[1px]">
                      <Button asChild variant="secondary" className="gap-2">
                        <Link to="/auth">
                          <LockIcon className="h-4 w-4" />
                          Sign in to View
                        </Link>
                      </Button>
                    </div>}
                </div>)}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild className="bg-toronto-blue hover:bg-toronto-blue/90 text-white px-8 py-6">
                <Link to="/products">View All Products</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                UofT Market makes buying and selling simple and secure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center p-6 rounded-lg bg-white shadow-soft hover:shadow-md transition-shadow relative">
                <div className="bg-toronto-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Sign Up with UofT Email</h3>
                <p className="text-gray-600">
                  Create an account using your @mail.utoronto.ca email to join our verified student marketplace.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-white shadow-soft hover:shadow-md transition-shadow relative">
                <div className="bg-toronto-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Browse or List Items</h3>
                <p className="text-gray-600">
                  Find what you need or list items you want to sell. Add photos, descriptions, and set your price.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-white shadow-soft hover:shadow-md transition-shadow relative">
                <div className="bg-toronto-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Meet & Complete Transaction</h3>
                <p className="text-gray-600">
                  Connect with buyers or sellers through our messaging system and arrange a campus meetup.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Listings</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The latest additions to our marketplace
              </p>
              {!isAuthenticated && <div className="mt-4 text-amber-600 bg-amber-50 p-4 rounded-lg inline-flex items-center gap-2">
                  <LockIcon className="h-4 w-4" />
                  <span>Sign in required to view product details</span>
                </div>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentUserListings.length > 0 ? recentUserListings.map(product => <div key={product.id} className="relative">
                    <ProductCard key={product.id} {...product} />
                    {!isAuthenticated && <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg backdrop-blur-[1px]">
                      <Button asChild variant="secondary" className="gap-2">
                        <Link to="/auth">
                          <LockIcon className="h-4 w-4" />
                          Sign in to View
                        </Link>
                      </Button>
                    </div>}
                  </div>) : <div className="col-span-4 text-center py-12">
                  <p className="text-lg text-gray-500">No listings available yet</p>
                  <p className="text-gray-400">Be the first to add a listing!</p>
                  <Button asChild className="mt-4">
                    <Link to="/sell">Create Listing</Link>
                  </Button>
                </div>}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild variant="outline" className="border-toronto-blue text-toronto-blue hover:bg-toronto-blue/5 px-8 py-6">
                <Link to="/products">See All Recent Listings</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-toronto-blue text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Buy or Sell?</h2>
              <p className="text-xl opacity-90 mb-8">
                Join our trusted community of UofT students and start trading today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button asChild className="bg-toronto-gold text-toronto-dark hover:bg-toronto-gold/90 px-8 py-6 text-lg">
                  <Link to="/auth">Sign Up Now</Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Index;
