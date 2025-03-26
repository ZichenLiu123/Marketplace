
import { useState, useEffect } from 'react';
import { Filter, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useListings } from '@/contexts/ListingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Import our components
import ProductFilters from '@/components/product/ProductFilters';
import ActiveFilters from '@/components/product/ActiveFilters';
import ProductGrid from '@/components/product/ProductGrid';
import SearchInput from '@/components/product/SearchInput';
import { useProductFiltering } from '@/hooks/use-product-filtering';

const Products = () => {
  const {
    listings,
    filterListingsByLocation
  } = useListings();
  
  const {
    isAuthenticated,
    user
  } = useAuth();
  
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
  const locationFilteredListings = selectedLocation ? filterListingsByLocation(selectedLocation) : filteredListings;

  // Apply sorting to location-filtered listings
  const finalSortedListings = selectedLocation ? [...locationFilteredListings].sort((a, b) => {
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
  }) : sortedListings;

  useEffect(() => {
    console.log("Current listings in Products page:", listings.length);
  }, [listings]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gray-50 my-[40px]">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Browse Listings</h1>
            <p className="text-gray-600">Find what you need from your fellow UofT students</p>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className={viewMode === 'grid' ? 'bg-toronto-blue/10' : ''}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={viewMode === 'list' ? 'bg-toronto-blue/10' : ''}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          </div>

          <div className="lg:flex items-start gap-8">
            {/* Mobile Filters */}
            <div className="mb-4 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters & Sort
                    </div>
                    {(selectedCategory || selectedLocation || priceRange[0] > 0 || priceRange[1] < 1000) && 
                      <Badge variant="secondary" className="ml-2">Active</Badge>
                    }
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                  <div className="py-4">
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
                      mobileFiltersOpen={true} 
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Desktop Filters */}
            <div className="hidden lg:block lg:w-1/4">
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
                mobileFiltersOpen={false} 
              />
            </div>
            
            <div className="lg:w-3/4">
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
              
              {/* Product Grid/List */}
              <ProductGrid 
                listings={finalSortedListings} 
                isAuthenticated={isAuthenticated} 
                resetFilters={resetFilters}
                viewMode={viewMode}
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
