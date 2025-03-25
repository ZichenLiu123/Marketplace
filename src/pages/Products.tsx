
import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useListings } from '@/contexts/ListingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Import our new components
import ProductFilters from '@/components/product/ProductFilters';
import ActiveFilters from '@/components/product/ActiveFilters';
import ProductGrid from '@/components/product/ProductGrid';
import SearchInput from '@/components/product/SearchInput';
import { useProductFiltering } from '@/hooks/use-product-filtering';

const Products = () => {
  const { listings, filterListingsByLocation } = useListings();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  // Use our custom hook for filtering logic
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    filteredListings,
    sortedListings,
    resetFilters
  } = useProductFiltering(listings);

  // Apply location filter on top of other filters
  const locationFilteredListings = selectedLocation 
    ? filterListingsByLocation(selectedLocation)
    : filteredListings;
  
  // Apply sorting to location-filtered listings
  const finalSortedListings = selectedLocation
    ? [...locationFilteredListings].sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'oldest':
            return new Date(a.postedTime).getTime() - new Date(b.postedTime).getTime();
          case 'newest':
          default:
            return new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime();
        }
      })
    : sortedListings;

  useEffect(() => {
    console.log("Current listings in Products page:", listings.length);
  }, [listings]);

  // Add a debug function to create a test listing
  const createTestListing = () => {
    try {
      const { addListing } = useListings();
      const id = addListing({
        title: "Test Listing",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        category: "electronics",
        condition: "Like New",
        description: "This is a test listing",
        location: "St. George",
        seller: user?.name || "Anonymous"
      });
      
      if (id) {
        toast({
          title: "Test listing created",
          description: `Created listing with ID: ${id}`
        });
      }
    } catch (error) {
      console.error("Error creating test listing:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Browse Listings</h1>
            <p className="text-gray-600">Find what you need from your fellow UofT students</p>
          </div>
          
          <div className="lg:flex items-start gap-8 mb-8">
            <Button 
              variant="outline" 
              className="mb-4 flex items-center lg:hidden w-full justify-between"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <span className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </span>
              {(selectedCategory || selectedLocation || priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Badge variant="secondary" className="ml-2">Active</Badge>
              )}
            </Button>
            
            {/* Sidebar Filters */}
            <ProductFilters 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              resetFilters={resetFilters}
              mobileFiltersOpen={mobileFiltersOpen}
            />
            
            <div className="lg:w-3/4">
              {/* Search Input */}
              <SearchInput 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              
              {/* Active Filters */}
              <ActiveFilters 
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                filteredCount={finalSortedListings.length}
              />
              
              {/* Product Grid */}
              <ProductGrid 
                listings={finalSortedListings}
                isAuthenticated={isAuthenticated}
                createTestListing={createTestListing}
                resetFilters={resetFilters}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
