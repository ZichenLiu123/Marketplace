import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mock data for products
const featuredProducts = [{
  id: "1",
  title: 'MacBook Pro M2 - Nearly New',
  price: 1200.00,
  image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  category: 'Electronics',
  condition: 'Like New',
  seller: 'Maya T',
  postedTime: '3 days ago',
  location: 'St. George Campus'
}, {
  id: "2",
  title: 'Calculus & Linear Algebra Textbooks Bundle',
  price: 85.00,
  image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  category: 'Textbooks',
  condition: 'Good',
  seller: 'Jayden K',
  postedTime: '1 day ago',
  location: 'Robarts Library'
}, {
  id: "3",
  title: 'Study Desk and Chair Set',
  price: 120.00,
  image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  category: 'Furniture',
  condition: 'New',
  seller: 'Aisha M',
  postedTime: '4 days ago',
  location: 'Mississauga Campus'
}, {
  id: "4",
  title: 'Python Programming Tutoring',
  price: 40.00,
  image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  category: 'Services',
  condition: 'N/A',
  seller: 'Thomas W',
  postedTime: '2 days ago',
  location: 'Online'
}];
const recentProducts = [{
  id: "5",
  title: 'Wireless Noise-Cancelling Headphones',
  price: 180.00,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  category: 'Electronics',
  condition: 'Good',
  seller: 'Elena K',
  postedTime: '5 hours ago',
  location: 'Scarborough Campus'
}, {
  id: "6",
  title: 'City Bike with Helmet and Lock',
  price: 250.00,
  image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  category: 'Transportation',
  condition: 'Used',
  seller: 'Marcus J',
  postedTime: '12 hours ago',
  location: 'Kensington Market'
}, {
  id: "7",
  title: 'Modern Desk Lamp with Wireless Charging',
  price: 45.00,
  image: 'https://images.unsplash.com/photo-1534189832072-4f6b908e76c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  category: 'Appliances',
  condition: 'New',
  seller: 'Sophia L',
  postedTime: '1 day ago',
  location: 'Residence'
}, {
  id: "8",
  title: 'UofT Varsity Jacket - Size L',
  price: 75.00,
  image: 'https://images.unsplash.com/photo-1622519407650-3df9883f76a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  category: 'Clothing',
  condition: 'Like New',
  seller: 'Nathan P',
  postedTime: '3 days ago',
  location: 'Athletic Center'
}];
const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <Categories />

        {/* Featured Products Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 
                ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
                Featured Products
              </h2>
              <p className={`text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-700 delay-100
                ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
                Hand-picked quality items from verified UofT students
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => <div key={product.id} className={`transition-all duration-700 
                    ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`} style={{
              transitionDelay: `${index * 100}ms`
            }}>
                  <ProductCard {...product} />
                </div>)}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild className="bg-toronto-blue hover:bg-toronto-blue/90 text-white px-8 py-6">
                <Link to="/products">View All Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
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

        {/* Recent Listings Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Listings</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The latest additions to our marketplace
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.map(product => <ProductCard key={product.id} {...product} />)}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild variant="outline" className="border-toronto-blue text-toronto-blue hover:bg-toronto-blue/5 px-8 py-6">
                <Link to="/products">See All Recent Listings</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
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